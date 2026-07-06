import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Link Integration Tests', () => {
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
  let testFolder: any;

  beforeEach(async () => {
    await cleanDatabase();

    testUser = await createUser();
    testCourse = await createCourse(
      testUser.id,
      'CS1010',
      'Programming Methodology',
    );
    testFolder = await createFolder(
      testCourse.courseId,
      'Tutorial',
      'Tutorial folder',
    );
  });

  // ==== Helper Functions ====
  const cleanDatabase = async () => {
    await prisma.client.link.deleteMany();
    await prisma.client.folder.deleteMany();
    await prisma.client.event.deleteMany();
    await prisma.client.task.deleteMany();
    await prisma.client.course.deleteMany();
    await prisma.client.user.deleteMany();
  };

  const createUser = async () => {
    const user = await prisma.client.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      },
    });
    return user;
  };

  const createCourse = async (
    userId: string,
    courseCode: string,
    courseTitle: string,
  ) => {
    const course = await prisma.client.course.create({
      data: {
        userId: userId,
        courseCode: courseCode,
        courseTitle: courseTitle,
        courseType: 'NUS',
      },
    });
    return course;
  };

  const createFolder = async (
    courseId: string,
    name: string,
    description: string,
  ) => {
    const folder = await prisma.client.folder.create({
      data: {
        courseId: courseId,
        name: name,
        description: description,
      },
    });
    return folder;
  };

  const createLink = async (folderId: string, url: string, title: string) => {
    const link = await prisma.client.link.create({
      data: {
        folderId: folderId,
        url: url,
        title: title,
      },
    });
    return link;
  };

  // === Tests ===
  describe('GET links by folder', () => {
    it('should return all links for a given folder', async () => {
      const link1 = await createLink(
        testFolder.folderId,
        'https://example.com/1',
        'Example 1',
      );
      const link2 = await createLink(
        testFolder.folderId,
        'https://example.com/2',
        'Example 2',
      );

      const response = await request(app.getHttpServer())
        .get(`/api/link/all-links`)
        .query({ folderId: testFolder.folderId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            linkId: link1.linkId,
            url: link1.url,
            title: link1.title,
          }),
          expect.objectContaining({
            linkId: link2.linkId,
            url: link2.url,
            title: link2.title,
          }),
        ]),
      );
    });

    it('should return empty array for folder with no links', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/link/all-links`)
        .query({ folderId: testFolder.folderId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('should not return links for missing folderId', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/link/all-links`,
      );

      expect(response.status).toBe(400);
    });

    it('should not return links for invalid folderId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/link/all-links`)
        .query({ folderId: 'invalid-id' });

      expect(response.status).toBe(400);
    });

    it('should not return links for non-existing folder', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/link/all-links`)
        .query({ folderId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e' });

      expect(response.status).toBe(404);
    });

    it('should not return links of other folders', async () => {
      const anotherFolder = await createFolder(
        testCourse.courseId,
        'Another Folder',
        'Another folder description',
      );
      const linkInTestFolder = await createLink(
        testFolder.folderId,
        'https://example.com/1',
        'Example 1',
      );
      const linkInAnotherFolder = await createLink(
        anotherFolder.folderId,
        'https://example.com/2',
        'Example 2',
      );
      const response = await request(app.getHttpServer())
        .get(`/api/link/all-links`)
        .query({ folderId: testFolder.folderId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            linkId: linkInTestFolder.linkId,
            url: linkInTestFolder.url,
            title: linkInTestFolder.title,
          }),
        ]),
      );
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            linkId: linkInAnotherFolder.linkId,
            url: linkInAnotherFolder.url,
            title: linkInAnotherFolder.title,
          }),
        ]),
      );
    });
  });

  describe('POST create link', () => {
    it('should create new link', async () => {
      const newLink = {
        folderId: testFolder.folderId,
        title: 'New Link',
        url: 'https://example.com/new-link',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/link/create-link`)
        .send(newLink);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          folderId: newLink.folderId,
          title: newLink.title,
          url: newLink.url,
        }),
      );

      const linkInDb = await prisma.client.link.findUnique({
        where: { linkId: response.body.linkId },
      });
      expect(linkInDb).not.toBeNull();
      expect(linkInDb).toEqual(
        expect.objectContaining({
          folderId: newLink.folderId,
          title: newLink.title,
          url: newLink.url,
        }),
      );
    });

    it('should not create new link for missing folderId', async () => {
      const newLink = {
        title: 'New Link',
        url: 'https://example.com/new-link',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/link/create-link`)
        .send(newLink);

      expect(response.status).toBe(400);
      expect(await prisma.client.link.count()).toBe(0);
    });

    it('should not create new link for invalid folderId', async () => {
      const newLink = {
        folderId: 'invalid-id',
        title: 'New Link',
        url: 'https://example.com/new-link',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/link/create-link`)
        .send(newLink);

      expect(response.status).toBe(400);

      expect(await prisma.client.link.count()).toBe(0);
    });

    it('should not create new link for non-existing folder', async () => {
      const newLink = {
        folderId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e',
        title: 'New Link',
        url: 'https://example.com/new-link',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/link/create-link`)
        .send(newLink);
      expect(response.status).toBe(404);
      expect(await prisma.client.link.count()).toBe(0);
    });

    it('should not create new link for missing title', async () => {
      const newLink = {
        folderId: testFolder.folderId,
        url: 'https://example.com/new-link',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/link/create-link`)
        .send(newLink);

      expect(response.status).toBe(400);

      expect(await prisma.client.link.count()).toBe(0);
    });

    it('should not create new link for missing url', async () => {
      const newLink = {
        folderId: testFolder.folderId,
        title: 'New Link',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/link/create-link`)
        .send(newLink);

      expect(response.status).toBe(400);

      expect(await prisma.client.link.count()).toBe(0);
    });

    it('should not create new link for invalid url', async () => {
      const newLink = {
        folderId: testFolder.folderId,
        title: 'New Link',
        url: 'invalid-url',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/link/create-link`)
        .send(newLink);

      expect(response.status).toBe(400);

      expect(await prisma.client.link.count()).toBe(0);
    });
  });

  describe('PATCH update link', () => {
    let oldLink: any;
    beforeEach(async () => {
      oldLink = await createLink(
        testFolder.folderId,
        'https://example.com/old-link',
        'Old Link',
      );
    });

    const expectOldLinkUnchanged = async () => {
      const linkInDb = await prisma.client.link.findUnique({
        where: { linkId: oldLink.linkId },
      });
      expect(linkInDb).not.toBeNull();
      expect(linkInDb).toEqual(
        expect.objectContaining({
          linkId: oldLink.linkId,
          folderId: oldLink.folderId,
          title: oldLink.title,
          url: oldLink.url,
        }),
      );
    };

    it('should update link', async () => {
      const newLink = {
        linkId: oldLink.linkId,
        title: 'Updated Link',
        url: 'https://example.com/updated-link',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/link/update-link')
        .send(newLink);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          linkId: newLink.linkId,
          title: newLink.title,
          url: newLink.url,
        }),
      );

      const linkInDb = await prisma.client.link.findUnique({
        where: { linkId: newLink.linkId },
      });
      expect(linkInDb).not.toBeNull();
      expect(linkInDb).toEqual(
        expect.objectContaining({
          linkId: newLink.linkId,
          title: newLink.title,
          url: newLink.url,
        }),
      );
    });

    it('should not update link for missing linkId', async () => {
      const newLink = {
        title: 'Updated Link',
        url: 'https://example.com/updated-link',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/link/update-link')
        .send(newLink);

      expect(response.status).toBe(400);
      await expectOldLinkUnchanged();
    });

    it('should not update link for invalid linkId', async () => {
      const newLink = {
        linkId: 'invalid-link-id',
        title: 'Updated Link',
        url: 'https://example.com/updated-link',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/link/update-link')
        .send(newLink);

      expect(response.status).toBe(400);

      await expectOldLinkUnchanged();
    });

    it('should not update link for non-existing link', async () => {
      const newLink = {
        linkId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e',
        title: 'Updated Link',
        url: 'https://example.com/updated-link',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/link/update-link')
        .send(newLink);

      expect(response.status).toBe(404);

      await expectOldLinkUnchanged();
    });

    it('should not update link for missing title', async () => {
      const newLink = {
        linkId: oldLink.linkId,
        url: 'https://example.com/updated-link',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/link/update-link')
        .send(newLink);

      expect(response.status).toBe(400);
      await expectOldLinkUnchanged();
    });

    it('should not update link for missing url', async () => {
      const newLink = {
        linkId: oldLink.linkId,
        title: 'Updated Link',
      };

      const response = await request(app.getHttpServer())
        .patch('/api/link/update-link')
        .send(newLink);

      expect(response.status).toBe(400);
      await expectOldLinkUnchanged();
    });
  });

  describe('DELETE link', () => {
    let oldLink: any;
    beforeEach(async () => {
      oldLink = await createLink(
        testFolder.folderId,
        'https://example.com/old-link',
        'Old Link',
      );
    });

    const expectOldLinkNotDeleted = async () => {
      const linkInDb = await prisma.client.link.findUnique({
        where: { linkId: oldLink.linkId },
      });
      expect(linkInDb).not.toBeNull();
      expect(linkInDb).toEqual(
        expect.objectContaining({
          linkId: oldLink.linkId,
          folderId: oldLink.folderId,
          title: oldLink.title,
          url: oldLink.url,
        }),
      );
    };

    it('should delete link', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/link/delete-link')
        .send({ linkId: oldLink.linkId });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          linkId: oldLink.linkId,
          folderId: oldLink.folderId,
          title: oldLink.title,
          url: oldLink.url,
        }),
      );

      const linkInDb = await prisma.client.link.findUnique({
        where: { linkId: oldLink.linkId },
      });
      expect(linkInDb).toBeNull();
    });

    it('should not delete link for missing linkId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/link/delete-link')
        .send({});

      expect(response.status).toBe(400);
      await expectOldLinkNotDeleted();
    });

    it('should not delete link for invalid linkId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/link/delete-link')
        .send({ linkId: 'invalid-link-id' });

      expect(response.status).toBe(400);
      await expectOldLinkNotDeleted();
    });

    it('should not delete link for non-existing link', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/link/delete-link')
        .send({ linkId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e' });

      expect(response.status).toBe(404);
      await expectOldLinkNotDeleted();
    });
  });
});
