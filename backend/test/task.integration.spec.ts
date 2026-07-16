import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Task Integration Tests', () => {
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
    testUser = await createUser('test@example.com', 'password', 'Test User');
    testCourse = await createCourse(
      testUser.id,
      'CS1101S',
      'Programming Methodology',
    );
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
  const NON_EXISTENT_UUID = 'bfd62187-db3e-4de3-a7c0-376a579aa20e';

  describe('GET all tasks by course ID', () => {
    it('should return all tasks', async () => {
      const task1 = await createTask(
        testUser.id,
        'Task 1',
        'WEEKLY',
        testCourse.courseId,
      );

      const task2 = await createTask(
        testUser.id,
        'Task 2',
        'TODAY',
        testCourse.courseId,
      );

      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-course')
        .query({ courseId: testCourse.courseId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            taskId: task1.taskId,
            userId: testUser.id,
            courseId: testCourse.courseId,
            name: 'Task 1',
            taskType: 'WEEKLY',
          }),
          expect.objectContaining({
            taskId: task2.taskId,
            userId: testUser.id,
            courseId: testCourse.courseId,
            name: 'Task 2',
            taskType: 'TODAY',
          }),
        ]),
      );
    });

    it('should return empty array if no tasks exist for the course', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-course')
        .query({ courseId: testCourse.courseId });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should not return tasks for missing course ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/task/get-all-tasks-by-course',
      );

      expect(response.status).toBe(400);
    });

    it('should not return tasks for invalid course ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-course')
        .query({ courseId: 'invalid-course-id' });

      expect(response.status).toBe(400);
    });

    it('should not return tasks for non-existent course ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-course')
        .query({ courseId: NON_EXISTENT_UUID });

      expect(response.status).toBe(404);
    });

    it('should not return tasks of other courses', async () => {
      const anotherCourse = await createCourse(
        testUser.id,
        'CS2040S',
        'Data Structures and Algorithms',
      );

      const taskInTestCourse = await createTask(
        testUser.id,
        'Task in CS1010',
        'WEEKLY',
        testCourse.courseId,
      );

      const taskInAnotherCourse = await createTask(
        testUser.id,
        'Task in CS2040S',
        'TODAY',
        anotherCourse.courseId,
      );

      // A user-only task should not appear in a course query either.
      await createTask(testUser.id, 'User-only Task', 'TODAY');

      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-course')
        .query({ courseId: testCourse.courseId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            taskId: taskInTestCourse.taskId,
            courseId: testCourse.courseId,
          }),
        ]),
      );

      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            taskId: taskInAnotherCourse.taskId,
          }),
        ]),
      );
    });
  });

  describe('GET all tasks by user ID', () => {
    it('should return all tasks', async () => {
      const courseTask = await createTask(
        testUser.id,
        'Course Task',
        'WEEKLY',
        testCourse.courseId,
      );

      const userOnlyTask = await createTask(
        testUser.id,
        'User-only Task',
        'TODAY',
      );

      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-user')
        .query({ userId: testUser.id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            taskId: courseTask.taskId,
            userId: testUser.id,
            courseId: testCourse.courseId,
            name: 'Course Task',
          }),
          expect.objectContaining({
            taskId: userOnlyTask.taskId,
            userId: testUser.id,
            courseId: null,
            name: 'User-only Task',
          }),
        ]),
      );
    });

    it('should return empty array if no tasks exist for the user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-user')
        .query({ userId: testUser.id });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should not return tasks for missing user ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/task/get-all-tasks-by-user',
      );

      expect(response.status).toBe(400);
    });

    it('should not return tasks for invalid user ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-user')
        .query({ userId: 'invalid-user-id' });

      expect(response.status).toBe(400);
    });

    it('should not return tasks for non-existent user ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-user')
        .query({ userId: NON_EXISTENT_UUID });

      expect(response.status).toBe(404);
    });

    it('should not return tasks of other users', async () => {
      const anotherUser = await createUser(
        'task-user-2@example.com',
        'password',
        'Task User 2',
      );

      const anotherCourse = await createCourse(
        anotherUser.id,
        'CS1231S',
        'Discrete Structures',
      );

      const ownTask = await createTask(
        testUser.id,
        'Own Task',
        'WEEKLY',
        testCourse.courseId,
      );

      const anotherUserTask = await createTask(
        anotherUser.id,
        'Another User Task',
        'TODAY',
        anotherCourse.courseId,
      );

      const response = await request(app.getHttpServer())
        .get('/api/task/get-all-tasks-by-user')
        .query({ userId: testUser.id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            taskId: ownTask.taskId,
            userId: testUser.id,
          }),
        ]),
      );

      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            taskId: anotherUserTask.taskId,
          }),
        ]),
      );
    });
  });

  describe('POST create task', () => {
    it('should create a task that belongs to a course', async () => {
      const newTask = {
        userId: testUser.id,
        courseId: testCourse.courseId,
        name: 'New Course Task',
        taskType: 'WEEKLY',
      };

      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newTask));

      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: response.body.taskId,
        },
      });

      expect(taskInDb).not.toBeNull();
      expect(taskInDb).toEqual(expect.objectContaining(newTask));
    });

    it('should create a task that does not belong to any course', async () => {
      const newTask = {
        userId: testUser.id,
        name: 'User-only Task',
        taskType: 'TODAY',
      };

      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          userId: testUser.id,
          name: 'User-only Task',
          taskType: 'TODAY',
          courseId: null,
        }),
      );

      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: response.body.taskId,
        },
      });

      expect(taskInDb).not.toBeNull();
      expect(taskInDb?.courseId).toBeNull();
    });

    it('should not create a task for missing user ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          name: 'New Task',
          taskType: 'WEEKLY',
          courseId: testCourse.courseId,
        });

      expect(response.status).toBe(400);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task for invalid user ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: 'invalid-user-id',
          name: 'New Task',
          taskType: 'WEEKLY',
          courseId: testCourse.courseId,
        });

      expect(response.status).toBe(400);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task for non-existent user ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: NON_EXISTENT_UUID,
          name: 'New Task',
          taskType: 'WEEKLY',
        });

      expect(response.status).toBe(404);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task for missing name', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: testUser.id,
          taskType: 'WEEKLY',
          courseId: testCourse.courseId,
        });

      expect(response.status).toBe(400);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task for missing task type', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: testUser.id,
          name: 'New Task',
          courseId: testCourse.courseId,
        });

      expect(response.status).toBe(400);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task for invalid task type', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: testUser.id,
          name: 'New Task',
          taskType: 'INVALID_TYPE',
          courseId: testCourse.courseId,
        });

      expect(response.status).toBe(400);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task for invalid course ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: testUser.id,
          name: 'New Task',
          taskType: 'WEEKLY',
          courseId: 'invalid-course-id',
        });

      expect(response.status).toBe(400);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task for non-existent course ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: testUser.id,
          name: 'New Task',
          taskType: 'WEEKLY',
          courseId: NON_EXISTENT_UUID,
        });

      expect(response.status).toBe(404);
      expect(await prisma.client.task.count()).toBe(0);
    });

    it('should not create a task under a course owned by another user', async () => {
      const anotherUser = await createUser(
        'task-owner-2@example.com',
        'password',
        'Task Owner 2',
      );

      const anotherCourse = await createCourse(
        anotherUser.id,
        'CS2100',
        'Computer Organisation',
      );

      const response = await request(app.getHttpServer())
        .post('/api/task/create-task')
        .send({
          userId: testUser.id,
          name: 'Unauthorized Task',
          taskType: 'WEEKLY',
          courseId: anotherCourse.courseId,
        });

      expect(response.status).toBe(403);
      expect(await prisma.client.task.count()).toBe(0);
    });
  });

  describe('POST toggle task', () => {
    let oldTask: any;

    beforeEach(async () => {
      oldTask = await createTask(
        testUser.id,
        'Old Task',
        'WEEKLY',
        testCourse.courseId,
      );
    });

    const expectTaskCompletion = async (completed: boolean) => {
      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: oldTask.taskId,
        },
      });

      expect(taskInDb).not.toBeNull();
      expect(taskInDb?.completed).toBe(completed);
    };

    it('should toggle a task from uncompleted to completed', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/toggle-task')
        .send({
          taskId: oldTask.taskId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          taskId: oldTask.taskId,
          completed: true,
        }),
      );

      await expectTaskCompletion(true);
    });

    it('should toggle a task from completed to uncompleted', async () => {
      await prisma.client.task.update({
        where: {
          taskId: oldTask.taskId,
        },
        data: {
          completed: true,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/api/task/toggle-task')
        .send({
          taskId: oldTask.taskId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          taskId: oldTask.taskId,
          completed: false,
        }),
      );

      await expectTaskCompletion(false);
    });

    it('should not toggle a task for missing task ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/toggle-task')
        .send({});

      expect(response.status).toBe(400);
      await expectTaskCompletion(false);
    });

    it('should not toggle a task for invalid task ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/toggle-task')
        .send({
          taskId: 'invalid-task-id',
        });

      expect(response.status).toBe(400);
      await expectTaskCompletion(false);
    });

    it('should not toggle a task for non-existent task ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/toggle-task')
        .send({
          taskId: NON_EXISTENT_UUID,
        });

      expect(response.status).toBe(404);
      await expectTaskCompletion(false);
    });

    it('should not toggle a task of another user', async () => {
      const anotherUser = await createUser(
        'toggle-user-2@example.com',
        'password',
        'Toggle User 2',
      );

      const anotherTask = await createTask(
        anotherUser.id,
        'Another User Task',
        'TODAY',
      );

      const response = await request(app.getHttpServer())
        .post('/api/task/toggle-task')
        .send({
          userId: testUser.id,
          taskId: anotherTask.taskId,
        });

      expect(response.status).toBe(403);

      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: anotherTask.taskId,
        },
      });

      expect(taskInDb?.completed).toBe(false);
    });
  });

  describe('POST update task name', () => {
    let oldTask: any;

    beforeEach(async () => {
      oldTask = await createTask(
        testUser.id,
        'Old Task Name',
        'WEEKLY',
        testCourse.courseId,
      );
    });

    const expectOldTaskNameUnchanged = async () => {
      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: oldTask.taskId,
        },
      });

      expect(taskInDb).not.toBeNull();
      expect(taskInDb?.name).toBe('Old Task Name');
    };

    it('should update the name of a task', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/update-task-name')
        .send({
          taskId: oldTask.taskId,
          name: 'Updated Task Name',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          taskId: oldTask.taskId,
          name: 'Updated Task Name',
        }),
      );

      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: oldTask.taskId,
        },
      });

      expect(taskInDb?.name).toBe('Updated Task Name');
    });

    it('should not update a task for missing task ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/update-task-name')
        .send({
          name: 'Updated Task Name',
        });

      expect(response.status).toBe(400);
      await expectOldTaskNameUnchanged();
    });

    it('should not update a task for invalid task ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/update-task-name')
        .send({
          taskId: 'invalid-task-id',
          name: 'Updated Task Name',
        });

      expect(response.status).toBe(400);
      await expectOldTaskNameUnchanged();
    });

    it('should not update a task for non-existent task ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/update-task-name')
        .send({
          taskId: NON_EXISTENT_UUID,
          name: 'Updated Task Name',
        });

      expect(response.status).toBe(404);
      await expectOldTaskNameUnchanged();
    });

    it('should not update a task for missing name', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/task/update-task-name')
        .send({
          taskId: oldTask.taskId,
        });

      expect(response.status).toBe(400);
      await expectOldTaskNameUnchanged();
    });

    it('should not update a task of another user', async () => {
      const anotherUser = await createUser(
        'update-user-2@example.com',
        'password',
        'Update User 2',
      );

      const anotherTask = await createTask(
        anotherUser.id,
        'Another User Task',
        'TODAY',
      );

      const response = await request(app.getHttpServer())
        .post('/api/task/update-task-name')
        .send({
          userId: testUser.id,
          taskId: anotherTask.taskId,
          name: 'Unauthorized Update',
        });

      expect(response.status).toBe(403);

      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: anotherTask.taskId,
        },
      });

      expect(taskInDb?.name).toBe('Another User Task');
    });
  });

  describe('DELETE task', () => {
    let oldTask: any;

    beforeEach(async () => {
      oldTask = await createTask(
        testUser.id,
        'Task to Delete',
        'WEEKLY',
        testCourse.courseId,
      );
    });

    const expectOldTaskNotDeleted = async () => {
      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: oldTask.taskId,
        },
      });

      expect(taskInDb).not.toBeNull();
      expect(taskInDb).toEqual(
        expect.objectContaining({
          taskId: oldTask.taskId,
          userId: oldTask.userId,
          name: oldTask.name,
          taskType: oldTask.taskType,
        }),
      );
    };

    it('should delete a task', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/task/delete-task')
        .query({
          taskId: oldTask.taskId,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          taskId: oldTask.taskId,
          name: oldTask.name,
          taskType: oldTask.taskType,
        }),
      );

      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: oldTask.taskId,
        },
      });

      expect(taskInDb).toBeNull();
    });

    it('should not delete a task for missing task ID', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/task/delete-task',
      );

      expect(response.status).toBe(400);
      await expectOldTaskNotDeleted();
    });

    it('should not delete a task for invalid task ID', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/task/delete-task')
        .query({
          taskId: 'invalid-task-id',
        });

      expect(response.status).toBe(400);
      await expectOldTaskNotDeleted();
    });

    it('should not delete a task for non-existent task ID', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/task/delete-task')
        .query({
          taskId: NON_EXISTENT_UUID,
        });

      expect(response.status).toBe(404);
      await expectOldTaskNotDeleted();
    });

    it('should not delete a task of another user', async () => {
      const anotherUser = await createUser(
        'delete-user-2@example.com',
        'password',
        'Delete User 2',
      );

      const anotherTask = await createTask(
        anotherUser.id,
        'Another User Task',
        'TODAY',
      );

      const response = await request(app.getHttpServer())
        .delete('/api/task/delete-task')
        .query({
          userId: testUser.id,
          taskId: anotherTask.taskId,
        });

      expect(response.status).toBe(403);

      const taskInDb = await prisma.client.task.findUnique({
        where: {
          taskId: anotherTask.taskId,
        },
      });

      expect(taskInDb).not.toBeNull();
    });
  });
});
