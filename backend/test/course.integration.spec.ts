import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Course Integration Test', () => {
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

  beforeEach(async () => {
    await cleanDatabase();
    testUser = await createUser('test@example.com', 'password', 'Test User');
  });

  afterAll(async () => {
    await app.close();
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

  const createUser = async (email: string, password: string, name: string) => {
    const user = await prisma.client.user.create({
      data: {
        email,
        password,
        name,
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

  const createTask = async (
    userId: string,
    name: string,
    taskType: 'WEEKLY' | 'TODAY',
    courseId?: string,
  ) => {
    const task = await prisma.client.task.create({
      data: {
        userId: userId,
        name: name,
        taskType: taskType,
        courseId: courseId,
      },
    });
    return task;
  };

  // ==== Test Cases ====
  describe('GET all NUS courses', () => {
    it('should return all NUS courses', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/all-nus-courses',
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should handle NUS API failure', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockRejectedValueOnce(new Error('NUS API unavailable'));

      const response = await request(app.getHttpServer()).get(
        '/api/course/all-nus-courses',
      );

      expect(response.status).toBe(500);
    });
  });

  describe('GET NUS course data', () => {
    it('should return NUS course data for a valid course code', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/nus-course-data/CS1010',
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          courseCode: 'CS1010',
          title: expect.any(String),
        }),
      );
    });

    it('should not return course data for missing course code', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/nus-course-data/',
      );
      expect(response.status).toBe(404);
    });

    it('should not return course data for an invalid course code', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/nus-course-data/INVALID_CODE',
      );
      expect(response.status).toBe(404);
    });
  });

  describe('GET all courses', () => {
    it('should return all courses', async () => {
      await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
      await createCourse(testUser.id, 'CS1231', 'Discrete Structures');

      const response = await request(app.getHttpServer()).get(
        `/api/course/all-courses?userId=${testUser.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            courseCode: 'CS1010',
            courseTitle: 'Programming Methodology',
          }),
          expect.objectContaining({
            courseCode: 'CS1231',
            courseTitle: 'Discrete Structures',
          }),
        ]),
      );
    });

    it('should return an empty array if the user has no courses', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/course/all-courses?userId=${testUser.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should not return courses for missing user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/all-courses',
      );
      expect(response.status).toBe(400);
    });

    it('should not return courses for an invalid user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/all-courses?userId=invalid-uuid',
      );
      expect(response.status).toBe(400);
    });

    it('should not return courses for a non-existent user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/all-courses?userId=bfd62187-db3e-4de3-a7c0-376a579aa20e',
      );
      expect(response.status).toBe(404);
    });

    it('should not return courses of another user', async () => {
      const anotherUser = await createUser(
        'test2@example.com',
        'password',
        'Test User 2',
      );
      await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
      await createCourse(
        anotherUser.id,
        'CS2040',
        'Data Structures and Algorithms',
      );

      const response = await request(app.getHttpServer()).get(
        `/api/course/all-courses?userId=${testUser.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            courseCode: 'CS1010',
            courseTitle: 'Programming Methodology',
          }),
        ]),
      );
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            courseCode: 'CS2040',
            courseTitle: 'Data Structures and Algorithms',
          }),
        ]),
      );
    });
  });

  describe('GET all courses with tasks', () => {
    it('should return all courses with tasks', async () => {
      await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
      await createCourse(testUser.id, 'CS1231', 'Discrete Structures');

      const response = await request(app.getHttpServer()).get(
        `/api/course/all-courses-with-tasks?userId=${testUser.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            courseCode: 'CS1010',
            courseTitle: 'Programming Methodology',
          }),
          expect.objectContaining({
            courseCode: 'CS1231',
            courseTitle: 'Discrete Structures',
          }),
        ]),
      );
    });

    it('should return courses with their associated tasks', async () => {
      const testCourse = await createCourse(
        testUser.id,
        'CS1010',
        'Programming Methodology',
      );
      await createTask(testUser.id, 'Task 1', 'WEEKLY', testCourse.courseId);
      await createTask(testUser.id, 'Task 2', 'TODAY', testCourse.courseId);

      const response = await request(app.getHttpServer()).get(
        `/api/course/all-courses-with-tasks?userId=${testUser.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            courseCode: 'CS1010',
            courseTitle: 'Programming Methodology',
            tasks: expect.arrayContaining([
              expect.objectContaining({ name: 'Task 1', taskType: 'WEEKLY' }),
              expect.objectContaining({ name: 'Task 2', taskType: 'TODAY' }),
            ]),
          }),
        ]),
      );
    });

    it('should return an empty array if the user has no courses', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/course/all-courses-with-tasks?userId=${testUser.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should not return courses for missing user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/all-courses-with-tasks',
      );
      expect(response.status).toBe(400);
    });

    it('should not return courses for an invalid user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/all-courses-with-tasks?userId=invalid-uuid',
      );
      expect(response.status).toBe(400);
    });

    it('should not return courses for a non-existent user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/all-courses-with-tasks?userId=bfd62187-db3e-4de3-a7c0-376a579aa20e',
      );
      expect(response.status).toBe(404);
    });

    it('should not return courses of another user', async () => {
      const anotherUser = await createUser(
        'test2@example.com',
        'password',
        'Test User 2',
      );
      await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
      await createCourse(
        anotherUser.id,
        'CS2040',
        'Data Structures and Algorithms',
      );

      const response = await request(app.getHttpServer()).get(
        `/api/course/all-courses-with-tasks?userId=${testUser.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            courseCode: 'CS1010',
            courseTitle: 'Programming Methodology',
          }),
        ]),
      );
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            courseCode: 'CS2040',
            courseTitle: 'Data Structures and Algorithms',
          }),
        ]),
      );
    });
  });

  describe('GET course info', () => {
    it('should return course info', async () => {
      await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
      const response = await request(app.getHttpServer()).get(
        `/api/course/course-info?userId=${testUser.id}&courseCode=CS1010`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
        }),
      );
    });

    it('should not return course info for missing user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/course-info?courseCode=CS1010',
      );
      expect(response.status).toBe(400);
    });

    it('should not return course info for an invalid user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/course-info?userId=invalid-uuid&courseCode=CS1010',
      );
      expect(response.status).toBe(400);
    });

    it('should not return course info for a non-existent user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/course/course-info?userId=bfd62187-db3e-4de3-a7c0-376a579aa20e&courseCode=CS1010',
      );
      expect(response.status).toBe(404);
    });

    it('should not return course info for missing course code', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/course/course-info?userId=${testUser.id}`,
      );
      expect(response.status).toBe(400);
    });

    it('should not return course info for non-existent course code of userId', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/course/course-info?userId=${testUser.id}&courseCode=CS2040S`,
      );
      expect(response.status).toBe(404);
    });

    it('should not return another user course info', async () => {
      const anotherUser = await createUser(
        'test2@example.com',
        'password',
        'Test User 2',
      );
      await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
      await createCourse(
        anotherUser.id,
        'CS2040',
        'Data Structures and Algorithms',
      );

      const response = await request(app.getHttpServer()).get(
        `/api/course/course-info?userId=${testUser.id}&courseCode=CS2040`,
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST add course', () => {
    it('should add a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );

      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );
    });

    it('should not add a course for missing user ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        });
      expect(response.status).toBe(400);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add a course for an invalid user ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: 'invalid-uuid',
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        });
      expect(response.status).toBe(400);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add a course for a non-existent user ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e',
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        });
      expect(response.status).toBe(404);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add a course for missing course code', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: testUser.id,
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        });
      expect(response.status).toBe(400);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add a course for invalid course code', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: testUser.id,
          courseCode: 'INVALID_CODE',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        });
      expect(response.status).toBe(400);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add a course for missing course title', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseType: 'NUS',
        });
      expect(response.status).toBe(400);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add a course for missing course type', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
        });
      expect(response.status).toBe(400);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add a course for an invalid course type', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'INVALID_TYPE',
        });
      expect(response.status).toBe(400);
      expect(await prisma.client.course.count()).toBe(0);
    });

    it('should not add duplicate course', async () => {
      await createCourse(testUser.id, 'CS1010', 'Programming Methodology');
      const response = await request(app.getHttpServer())
        .post('/api/course/add-course')
        .send({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        });
      expect(response.status).toBe(409);
      expect(await prisma.client.course.count()).toBe(1);
    });
  });

  describe('DELETE delete course', () => {
    let testCourse: any;
    beforeEach(async () => {
      testCourse = await createCourse(
        testUser.id,
        'CS1010',
        'Programming Methodology',
      );
    });

    it('should delete a course', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/course/delete-course')
        .send({
          userId: testUser.id,
          courseCode: 'CS1010',
        });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );

      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).toBeNull();
    });

    it('should not delete a course for missing user ID', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/course/delete-course')
        .send({
          courseCode: 'CS1010',
        });
      expect(response.status).toBe(400);
      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );
    });

    it('should not delete a course for an invalid user ID', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/course/delete-course')
        .send({
          userId: 'invalid-user-id',
          courseCode: 'CS1010',
        });
      expect(response.status).toBe(400);
      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );
    });

    it('should not delete a course for a non-existent user ID', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/course/delete-course')
        .send({
          userId: 'bfd62187-db3e-4de3-a7c0-376a579aa20e',
          courseCode: 'CS1010',
        });
      expect(response.status).toBe(404);
      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );
    });

    it('should not delete a course for missing course code', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/course/delete-course')
        .send({
          userId: testUser.id,
        });
      expect(response.status).toBe(400);
      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );
    });

    it('should not delete a course for invalid course code', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/course/delete-course')
        .send({
          userId: testUser.id,
          courseCode: 'INVALID_CODE',
        });
      expect(response.status).toBe(400);
      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );
    });

    it('should not delete a course for a non-existent course code of userId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/course/delete-course')
        .send({
          userId: testUser.id,
          courseCode: 'CS2040S',
        });
      expect(response.status).toBe(404);
      const courseInDb = await prisma.client.course.findUnique({
        where: {
          userId_courseCode: {
            userId: testUser.id,
            courseCode: 'CS1010',
          },
        },
      });
      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          courseCode: 'CS1010',
          courseTitle: 'Programming Methodology',
          courseType: 'NUS',
        }),
      );
    });
  });
});
