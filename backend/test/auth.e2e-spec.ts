import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth Integration Test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    // Test cases for user registration
    it('should register a new user', async () => {
        const email = `test${Date.now()}@gmail.com`;
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: email,
                password: '123456',
                name: 'test username',
            });

        expect(response.status).toBe(201);
        expect(response.body.email).toBe(email);
        expect(response.body.name).toBe('test username');
    });

    it('should not register a user with existing email', async () => {
        const email = `test@gmail.com`;

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: email,
                password: '123456',
                name: 'test name',
            });
        expect(response.status).toBe(500);
    });

    // Test cases for user login
    it('should login a user successfully', async () => {
        const email = `test@gmail.com`;
        const password = '123456';

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: email, password: password });
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(email);
        expect(response.body.name).toBe('test username');
    });

    it('should not login with non-existent email', async () => {
        const email = `nonexistent${Date.now()}@gmail.com`;
        const password = '123456';

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: email, password: password });
        expect(response.status).toBe(401);
    });

    it('should not login with incorrect password', async () => {
        const email = `test@gmail.com`;
        const password = 'wrongpassword';

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: email, password: password });
        expect(response.status).toBe(401);
    });
});