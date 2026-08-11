import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    webServer: [
        {
            command: 'npm run dev',
            url: 'http://localhost:3000',
            reuseExistingServer: !process.env.CI,
        },
        {
            command: 'npm run start:dev',
            cwd: '../backend',
            url: 'http://localhost:3001/api',
            reuseExistingServer: !process.env.CI,
        },
    ],
});
