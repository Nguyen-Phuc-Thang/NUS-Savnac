import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Pomodoro Integration Test', () => {
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
    testUser = await createUser();
  });

  // ==== Helper Functions ====
  const cleanDatabase = async () => {
    await prisma.client.pomodoro.deleteMany();
    await prisma.client.user.deleteMany();
  };

  const createUser = async () => {
    const user = await prisma.client.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: 'hashedpassword',
        name: 'Test User',
      },
    });
    return user;
  };

  const createPomodoro = async (
    userId: string,
    name = 'Test Pomodoro',
    focusTime = 1500,
    breakTime = 300,
  ) => {
    return prisma.client.pomodoro.create({
      data: {
        userId,
        name,
        focusTime,
        breakTime,
      },
    });
  };

  // ==== Test Cases ====

  describe('GET all pomodoros', () => {
    it('should return default pomodoro if user has no timers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pomodoro')
        .query({ userId: testUser.id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual(
        expect.objectContaining({
          name: 'Default',
          focusTime: 1500,
          breakTime: 300,
          userId: testUser.id,
        }),
      );

      const pomodoroInDb = await prisma.client.pomodoro.findFirst({
        where: {
          userId: testUser.id,
          name: 'Default',
        },
      });
      expect(pomodoroInDb).not.toBeNull();
    });

    it('should return existing pomodoros', async () => {
      await createPomodoro(testUser.id, 'Test Pomodoro 1', 3600, 600);
      await createPomodoro(testUser.id, 'Test Pomodoro 2', 3601, 601);

      const response = await request(app.getHttpServer())
        .get('/api/pomodoro')
        .query({ userId: testUser.id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Test Pomodoro 1',
            focusTime: 3600,
            breakTime: 600,
          }),
          expect.objectContaining({
            name: 'Test Pomodoro 2',
            focusTime: 3601,
            breakTime: 601,
          }),
        ]),
      );
    });

    it('should only return pomodoros belonging to the user', async () => {
      const otherUser = await createUser();

      await createPomodoro(testUser.id, 'My Pomodoro', 3600, 600);
      await createPomodoro(otherUser.id, 'Others Pomodoro', 3600, 600);

      const response = await request(app.getHttpServer())
        .get('/api/pomodoro')
        .query({ userId: testUser.id });

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('My Pomodoro');
    });
  });

  describe('GET pomodoro by id', () => {
    it('should return a pomodoro by id', async () => {
      const pomodoro = await createPomodoro(
        testUser.id,
        'Test Pomodoro',
        3600,
        600,
      );

      const response = await request(app.getHttpServer())
        .get(`/api/pomodoro/${pomodoro.pomodoroId}`)
        .query({ userId: testUser.id });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          pomodoroId: pomodoro.pomodoroId,
          name: 'Test Pomodoro',
        }),
      );
    });

    it('should not return another user pomodoro', async () => {
      const anotherUser = await createUser();
      const pomodoro = await createPomodoro(anotherUser.id, 'Test Pomodoro');
      const response = await request(app.getHttpServer())
        .get(`/api/pomodoro/${pomodoro.pomodoroId}`)
        .query({
          userId: testUser.id,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });
  });

  describe('POST add pomodoro', () => {
    it('should add a new pomodoro', async () => {
      const newPomodoro = {
        name: 'Test Pomodoro',
        focusTime: 1800,
        breakTime: 300,
      };

      const response = await request(app.getHttpServer())
        .post('/api/pomodoro')
        .query({
          userId: testUser.id,
        })
        .send(newPomodoro);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Test Pomodoro',
          focusTime: 1800,
          breakTime: 300,
          userId: testUser.id,
        }),
      );
    });
  });

  describe('PATCH update pomodoro', () => {
    it('should update an existing pomodoro', async () => {
      const pomodoro = await createPomodoro(testUser.id, 'Old Name', 1500, 300);
      const updatePomodoro = {
        name: 'Updated Timer',
        focusTime: 1800,
        breakTime: 600,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/pomodoro/${pomodoro.pomodoroId}`)
        .query({ userId: testUser.id })
        .send(updatePomodoro);

      expect(response.status).toBe(200);

      const updated = await prisma.client.pomodoro.findUnique({
        where: {
          pomodoroId: pomodoro.pomodoroId,
        },
      });

      expect(updated).toEqual(
        expect.objectContaining({
          name: 'Updated Timer',
          focusTime: 1800,
          breakTime: 600,
        }),
      );
    });
  });

  describe('DELETE pomdooro', () => {
    it('should delete pomodoro', async () => {
      const pomodoro = await createPomodoro(testUser.id, 'Delete Me');

      const response = await request(app.getHttpServer())
        .delete(`/api/pomodoro/${pomodoro.pomodoroId}`)
        .query({
          userId: testUser.id,
        });

      expect(response.status).toBe(200);
      const deleted = await prisma.client.pomodoro.findUnique({
        where: {
          pomodoroId: pomodoro.pomodoroId,
        },
      });
      expect(deleted).toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
