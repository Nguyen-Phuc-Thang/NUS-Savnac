import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Folder Integration Tests', () => {

    // ==== Setup ====
    let app: INestApplication;
    let prisma: PrismaService;

    jest.setTimeout(30000);

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        prisma = moduleRef.get<PrismaService>(PrismaService);

        await app.init();
    });

    let testUser: any;
    let testCourse: any;

    beforeEach(async () => {
        await cleanDatabase();
        testUser = await createUser();
        testCourse = await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
    });


    // ==== Helper Functions ====
    const cleanDatabase = async () => {
        await prisma.client.link.deleteMany();
        await prisma.client.folder.deleteMany();
        await prisma.client.event.deleteMany();
        await prisma.client.task.deleteMany();
        await prisma.client.course.deleteMany();
        await prisma.client.user.deleteMany();
    }

    const createUser = async () => {
        const user = await prisma.client.user.create({
            data: {
                email: 'test@example.com',
                password: 'hashedpassword',
                name: 'Test User',
            }
        });
        return user;
    }

    const createCourse = async (userId: string, courseCode: string, courseTitle: string) => {
        const course = await prisma.client.course.create({
            data: {
                userId: userId,
                courseCode: courseCode,
                courseTitle: courseTitle,
                courseType: 'NUS',
            }
        });
        return course;
    }

    const createFolder = async (courseId: string, name: string, description: string) => {
        const folder = await prisma.client.folder.create({
            data: {
                courseId: courseId,
                name: name,
                description: description,
            }
        });
        return folder;
    };

    const createLink = async (folderId: string, url: string, title: string) => {
        const link = await prisma.client.link.create({
            data: {
                folderId: folderId,
                url: url,
                title: title,
            }
        });
        return link;
    }

    // ==== Test Cases ====

    describe('GET folders by course', () => {
        it('should get all folders for a course', async () => {
            await createFolder(testCourse.courseId, 'Folder 1', 'Description 1');
            await createFolder(testCourse.courseId, 'Folder 2', 'Description 2');

            const response = await request(app.getHttpServer())
                .get('/api/folder/all-folders')
                .query({ courseId: testCourse.courseId });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Folder 1', description: 'Description 1' }),
                    expect.objectContaining({ name: 'Folder 2', description: 'Description 2' }),
                ])
            );
        });

        it('should return empty array when course has no folders', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/folder/all-folders')
                .query({ courseId: testCourse.courseId });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it('should not return folders for missing courseId', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/folder/all-folders');

            expect(response.status).toBe(400);
        });

        it('should not return folders for invalid courseId format', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/folder/all-folders')
                .query({ courseId: 'invalid-course-id' });

            expect(response.status).toBe(400);
        });

        it('should not return folders for non-existing courseId', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/folder/all-folders')
                .query({ courseId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e' });

            expect(response.status).toBe(404);
        });

        it('should not return folders from another course', async () => {
            const anotherCourse = await createCourse(testUser.id, 'CS2030S', 'Programming Methodology II');
            await createFolder(testCourse.courseId, 'Folder 1', 'Description 1');
            await createFolder(anotherCourse.courseId, 'Folder 2', 'Description 2');

            const response = await request(app.getHttpServer())
                .get('/api/folder/all-folders')
                .query({ courseId: testCourse.courseId });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Folder 1', description: 'Description 1' }),
                ]),
            );

            expect(response.body).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Folder 2', description: 'Description 2' }),
                ]),
            );
        });
    });

    describe('POST add folder', () => {
        it('should add a new folder', async () => {
            const newFolder = {
                courseId: testCourse.courseId,
                name: 'New Folder',
                description: 'New Description',
            };

            const response = await request(app.getHttpServer())
                .post('/api/folder/add-folder')
                .send(newFolder);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(
                expect.objectContaining({
                    courseId: newFolder.courseId,
                    name: newFolder.name,
                    description: newFolder.description,
                }),
            );
        });

        it('should not add a folder with missing courseId', async () => {
            const newFolder = {
                name: 'New Folder',
                description: 'New Description',
            };

            const response = await request(app.getHttpServer())
                .post('/api/folder/add-folder')
                .send(newFolder);

            expect(response.status).toBe(400);
        });

        it('should not add a folder with missing name', async () => {
            const newFolder = {
                courseId: testCourse.courseId,
                description: 'New Description',
            };

            const response = await request(app.getHttpServer())
                .post('/api/folder/add-folder')
                .send(newFolder);

            expect(response.status).toBe(400);
        });

        it('should not add a folder with missing description', async () => {
            const newFolder = {
                courseId: testCourse.courseId,
                name: 'New Folder',
            };

            const response = await request(app.getHttpServer())
                .post('/api/folder/add-folder')
                .send(newFolder);

            expect(response.status).toBe(400);
        });

        it('should not add a folder with invalid courseId format', async () => {
            const newFolder = {
                courseId: 'invalid-course-id',
                name: 'New Folder',
                description: 'New Description',
            };

            const response = await request(app.getHttpServer())
                .post('/api/folder/add-folder')
                .send(newFolder);

            expect(response.status).toBe(400);
        });

        it('should not add a folder for non-existing courseId', async () => {
            const newFolder = {
                courseId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e',
                name: 'New Folder',
                description: 'New Description',
            };

            const response = await request(app.getHttpServer())
                .post('/api/folder/add-folder')
                .send(newFolder);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH update folder', () => {
        it('should update an existing folder', async () => {
            const testFolder = await createFolder(testCourse.courseId, 'Old Folder', 'Old Description');
            const newFolder = {
                folderId: testFolder.folderId,
                name: 'Updated Folder',
                description: 'Updated Description',
            }

            const response = await request(app.getHttpServer())
                .patch('/api/folder/update-folder')
                .send(newFolder);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    folderId: newFolder.folderId,
                    name: newFolder.name,
                    description: newFolder.description,
                }),
            );

            const folderInDb = await prisma.client.folder.findUnique({
                where: {
                    folderId: testFolder.folderId,
                },
            });

            expect(folderInDb).toEqual(
                expect.objectContaining({
                    folderId: testFolder.folderId,
                    name: 'Updated Folder',
                    description: 'Updated Description',
                }),
            );

        });

        it('should not update a folder with missing folderId', async () => {
            await createFolder(testCourse.courseId, 'Old Folder', 'Old Description');
            const newFolder = {
                name: 'Updated Folder',
                description: 'Updated Description',
            }

            const response = await request(app.getHttpServer())
                .patch('/api/folder/update-folder')
                .send(newFolder);

            expect(response.status).toBe(400);
        });

        it('should not update a folder with missing name', async () => {
            const testFolder = await createFolder(testCourse.courseId, 'Old Folder', 'Old Description');
            const newFolder = {
                folderId: testFolder.folderId,
                description: 'Updated Description',
            }

            const response = await request(app.getHttpServer())
                .patch('/api/folder/update-folder')
                .send(newFolder);

            expect(response.status).toBe(400);

            const folderInDb = await prisma.client.folder.findUnique({
                where: {
                    folderId: testFolder.folderId,
                },
            });

            expect(folderInDb).toEqual(
                expect.objectContaining({
                    name: 'Old Folder',
                    description: 'Old Description',
                }),
            );
        });

        it('should not update a folder with missing description', async () => {
            const testFolder = await createFolder(testCourse.courseId, 'Old Folder', 'Old Description');
            const newFolder = {
                folderId: testFolder.folderId,
                name: 'Updated Folder',
            }

            const response = await request(app.getHttpServer())
                .patch('/api/folder/update-folder')
                .send(newFolder);

            expect(response.status).toBe(400);

            const folderInDb = await prisma.client.folder.findUnique({
                where: {
                    folderId: testFolder.folderId,
                },
            });

            expect(folderInDb).toEqual(
                expect.objectContaining({
                    name: 'Old Folder',
                    description: 'Old Description',
                }),
            );
        });

        it('should not update a folder with invalid folderId format', async () => {
            const newFolder = {
                folderId: 'invalid-folder-id',
                name: 'Updated Folder',
                description: 'Updated Description',
            }

            const response = await request(app.getHttpServer())
                .patch('/api/folder/update-folder')
                .send(newFolder);

            expect(response.status).toBe(400);
        });

        it('should not update a non-existing folder', async () => {
            const newFolder = {
                folderId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e',
                name: 'Updated Folder',
                description: 'Updated Description',
            }

            const response = await request(app.getHttpServer())
                .patch('/api/folder/update-folder')
                .send(newFolder);

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE folder', () => {
        it('should delete an existing folder', async () => {
            const testFolder = await createFolder(testCourse.courseId, 'Folder to Delete', 'Description');

            const response = await request(app.getHttpServer())
                .delete('/api/folder/delete-folder')
                .send({ folderId: testFolder.folderId });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    folderId: testFolder.folderId,
                    name: testFolder.name,
                    description: testFolder.description,
                }),
            );

            const folderInDb = await prisma.client.folder.findUnique({
                where: {
                    folderId: testFolder.folderId,
                },
            });

            expect(folderInDb).toBeNull();
        });

        it('should not delete a folder with missing folderId', async () => {
            const response = await request(app.getHttpServer())
                .delete('/api/folder/delete-folder')
                .send({});

            expect(response.status).toBe(400);
        });

        it('should not delete a folder with invalid folderId format', async () => {
            const response = await request(app.getHttpServer())
                .delete('/api/folder/delete-folder')
                .send({ folderId: 'invalid-folder-id' });

            expect(response.status).toBe(400);
        });

        it('should not delete a non-existing folder', async () => {
            await createFolder(testCourse.courseId, 'Folder to Delete', 'Description');

            const response = await request(app.getHttpServer())
                .delete('/api/folder/delete-folder')
                .send({ folderId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e' });

            expect(response.status).toBe(404);

            const foldersInDb = await prisma.client.folder.findMany({
                where: {
                    courseId: testCourse.courseId,
                },
            });

            expect(foldersInDb).toHaveLength(1);
        });

        it('should delete related links when folder is deleted', async () => {
            const testFolder = await createFolder(testCourse.courseId, 'Folder with Links', 'Description');
            await createLink(testFolder.folderId, 'https://example.com', 'Example Link');
            await createLink(testFolder.folderId, 'https://example2.com', 'Example Link 2');

            const response = await request(app.getHttpServer())
                .delete('/api/folder/delete-folder')
                .send({ folderId: testFolder.folderId });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    folderId: testFolder.folderId,
                    name: testFolder.name,
                    description: testFolder.description,
                }),
            );

            const folderInDb = await prisma.client.folder.findUnique({
                where: {
                    folderId: testFolder.folderId,
                },
            });

            expect(folderInDb).toBeNull();

            const linksInDb = await prisma.client.link.findMany({
                where: {
                    folderId: testFolder.folderId,
                },
            });

            expect(linksInDb).toHaveLength(0);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});