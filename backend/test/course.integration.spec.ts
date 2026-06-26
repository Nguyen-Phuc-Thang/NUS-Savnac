import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Course Module Integration Test', () => {
    let app: INestApplication;

    const validUserId = '550e8400-e29b-41d4-a716-446655440000';
    const validCourseCode = 'CS1010';
    const validCourseTitle = 'Programming Methodology';
    const validCourseId = '22222222-2222-2222-2222-222222222222';
    const validTaskId = '33333333-3333-3333-3333-333333333333';

    const prismaMock = {
        client: {
            course: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                delete: jest.fn(),
            },
        },
    };

    const fetchMock = jest.spyOn(globalThis, 'fetch');

    const mockJsonResponse = (data: unknown) => ({
        json: async () => data,
    } as Response);

    const seedPrismaMocks = () => {
        prismaMock.client.course.findMany.mockImplementation(async ({ where, include }) => {
            if (where?.userId !== validUserId) {
                return [];
            }

            if (include?.tasks) {
                return [
                    {
                        courseId: validCourseId,
                        courseCode: validCourseCode,
                        courseTitle: validCourseTitle,
                        courseType: 'NUS',
                        createdAt: new Date('2026-06-01T00:00:00.000Z'),
                        userId: validUserId,
                        tasks: [
                            {
                                taskId: validTaskId,
                                name: 'Revision',
                                taskType: 'WEEKLY',
                                createdAt: new Date('2026-06-01T01:00:00.000Z'),
                                completed: false,
                                courseId: validCourseId,
                                userId: validUserId,
                            },
                        ],
                    },
                ];
            }

            return [
                {
                    courseId: validCourseId,
                    courseCode: validCourseCode,
                    courseTitle: validCourseTitle,
                    courseType: 'NUS',
                    createdAt: new Date('2026-06-01T00:00:00.000Z'),
                    userId: validUserId,
                },
            ];
        });

        prismaMock.client.course.findFirst.mockImplementation(async ({ where }) => {
            if (where?.userId !== validUserId || where?.courseCode !== validCourseCode) {
                return null;
            }

            return {
                courseId: validCourseId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
                createdAt: new Date('2026-06-01T00:00:00.000Z'),
                userId: validUserId,
            };
        });

        prismaMock.client.course.create.mockResolvedValue({
            courseId: validCourseId,
            courseCode: validCourseCode,
            courseTitle: validCourseTitle,
            courseType: 'NUS',
            createdAt: new Date('2026-06-01T00:00:00.000Z'),
            userId: validUserId,
        });

        prismaMock.client.course.delete.mockResolvedValue({
            courseId: validCourseId,
            courseCode: validCourseCode,
            courseTitle: validCourseTitle,
            courseType: 'NUS',
            createdAt: new Date('2026-06-01T00:00:00.000Z'),
            userId: validUserId,
        });
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(prismaMock)
            .compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.mockReset();
        fetchMock.mockResolvedValue(mockJsonResponse([]));
        seedPrismaMocks();
    });

    afterAll(async () => {
        fetchMock.mockRestore();
        await app.close();
    });

    it('should return all NUS courses', async () => {
        fetchMock.mockResolvedValueOnce(
            mockJsonResponse([
                { moduleCode: 'CS1010', title: 'Programming Methodology' },
                { moduleCode: 'MA1521', title: 'Calculus for Computing' },
            ]),
        );

        const response = await request(app.getHttpServer()).get('/api/course/all-nus-courses');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { moduleCode: 'CS1010', title: 'Programming Methodology' },
            { moduleCode: 'MA1521', title: 'Calculus for Computing' },
        ]);
    });

    it('should return NUS course data for a specific course code', async () => {
        fetchMock.mockResolvedValueOnce(
            mockJsonResponse({
                moduleCode: validCourseCode,
                title: validCourseTitle,
                workload: '2-1-0-3-4',
                semesterData: [{ semester: 1 }],
                moduleCredit: '4',
            }),
        );

        const response = await request(app.getHttpServer()).get(`/api/course/nus-course-data/${validCourseCode}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            moduleCode: validCourseCode,
            title: validCourseTitle,
            workload: '2-1-0-3-4',
            semesterData: [{ semester: 1 }],
            credit: '4',
        });
    });

    it('should not return NUS course data for an invalid course code', async () => {
        fetchMock.mockRejectedValueOnce(new Error('Module not found'));

        const response = await request(app.getHttpServer()).get('/api/course/nus-course-data/INVALID');

        expect(response.status).toBe(500);
    });

    it('should return all courses for a specific user ID', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/course/all-courses')
            .query({ userId: validUserId });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            expect.objectContaining({
                courseId: validCourseId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
                userId: validUserId,
            }),
        ]);
    });

    it('should not return any courses for a missing user ID', async () => {
        const response = await request(app.getHttpServer()).get('/api/course/all-courses');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should return all courses with tasks for a specific user ID', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/course/all-courses-with-tasks')
            .query({ userId: validUserId });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            expect.objectContaining({
                courseId: validCourseId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
                userId: validUserId,
                tasks: [
                    expect.objectContaining({
                        taskId: validTaskId,
                        name: 'Revision',
                        taskType: 'WEEKLY',
                        completed: false,
                        courseId: validCourseId,
                        userId: validUserId,
                    }),
                ],
            }),
        ]);
    });

    it('should not return any courses with tasks for a missing user ID', async () => {
        const response = await request(app.getHttpServer()).get('/api/course/all-courses-with-tasks');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should return course info for a specific user ID and course code', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/course/course-info')
            .query({ userId: validUserId, courseCode: validCourseCode });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                courseId: validCourseId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
                userId: validUserId,
            }),
        );
    });

    it('should not return any course info for a missing user ID', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/course/course-info')
            .query({ courseCode: validCourseCode });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });

    it('should not return any course info for a missing course code', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/course/course-info')
            .query({ userId: validUserId });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });

    it('should add a new NUS course', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/course/add-course')
            .send({
                userId: validUserId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                courseId: validCourseId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
                userId: validUserId,
            }),
        );
        expect(prismaMock.client.course.create).toHaveBeenCalledWith({
            data: {
                userId: validUserId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
            },
        });
    });

    it('should not add a new NUS course with missing user ID', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/course/add-course')
            .send({
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
            });

        expect(response.status).toBe(400);
    });

    it('should not add a new NUS course with user ID that is not UUID', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/course/add-course')
            .send({
                userId: 'not-a-uuid',
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
            });

        expect(response.status).toBe(400);
    });

    it('should not add a new NUS course with missing course code', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/course/add-course')
            .send({
                userId: validUserId,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
            });

        expect(response.status).toBe(400);
    });

    it('should not add a new NUS course with missing course title', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/course/add-course')
            .send({
                userId: validUserId,
                courseCode: validCourseCode,
                courseType: 'NUS',
            });

        expect(response.status).toBe(400);
    });

    it('should not add a new NUS course with missing course type', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/course/add-course')
            .send({
                userId: validUserId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
            });

        expect(response.status).toBe(400);
    });

    it('should not add a new NUS course with invalid course type', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/course/add-course')
            .send({
                userId: validUserId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'INVALID',
            });

        expect(response.status).toBe(400);
    });

    it('should delete a course', async () => {
        const response = await request(app.getHttpServer())
            .delete('/api/course/delete-course')
            .send({ courseId: validCourseId });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                courseId: validCourseId,
                courseCode: validCourseCode,
                courseTitle: validCourseTitle,
                courseType: 'NUS',
                userId: validUserId,
            }),
        );
        expect(prismaMock.client.course.delete).toHaveBeenCalledWith({
            where: {
                courseId: validCourseId,
            },
        });
    });

    it('should not delete a course with missing course ID', async () => {
        const response = await request(app.getHttpServer())
            .delete('/api/course/delete-course')
            .send({});

        expect(response.status).toBe(400);
    });
});