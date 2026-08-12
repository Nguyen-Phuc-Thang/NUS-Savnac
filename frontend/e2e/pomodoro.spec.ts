import { test, expect } from '@playwright/test';

test('Add, Select, Edit and Delete Timer', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Enter your email').fill('test@gmail.com');
    await page.getByPlaceholder('Enter your password').fill('123456');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Pomodoro').click();

    // Create timer
    await page.getByRole('button', { name: 'Pick Timer' }).click();
    await page.getByRole('button', { name: 'Add Timer' }).click();
    await page.getByLabel('Name').fill('Testing Timer');
    await page.locator('#focus-minutes').fill('1');
    await page.locator('#focus-seconds').fill('0');
    await page.locator('#break-minutes').fill('0');
    await page.locator('#break-seconds').fill('30');
    await page.getByRole('button', { name: 'Save' }).click();

    // Ensure timer is shown on TimerCard
    await expect(page.getByText('Testing Timer')).toBeVisible();
    await expect(page.getByText('Focus: 1m')).toBeVisible();
    await expect(page.getByText('Break: 0m 30s')).toBeVisible();

    // Pick the timer
    await page.getByText('Testing Timer').click();

    // Edit the timer
    await page
        .getByText('Testing Timer')
        .locator('..')
        .locator('..')
        .getByRole('button', { name: 'Edit Timer' })
        .click();
    await page.locator('#focus-minutes').fill('0');
    await page.locator('#focus-seconds').fill('6');
    await page.locator('#break-minutes').fill('0');
    await page.locator('#break-seconds').fill('3');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Focus: 0m 6s')).toBeVisible();
    await expect(page.getByText('Break: 0m 3s')).toBeVisible();

    // Delete the timer
    await page
        .getByRole('heading', { name: 'Testing Timer' })
        .locator('..')
        .locator('..')
        .getByRole('button', { name: 'Delete Timer' })
        .click();
    await page
        .getByRole('alertdialog')
        .getByRole('button', { name: 'Delete' })
        .click();
});

test('Runs Timer', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Enter your email').fill('test@gmail.com');
    await page.getByPlaceholder('Enter your password').fill('123456');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Pomodoro').click();

    await page.getByRole('button', { name: 'Pick Timer' }).click();
    await page
        .getByRole('heading', { name: "Test (Don't Delete)" })
        .locator('..')
        .locator('..')
        .click();
    await page.keyboard.press('Escape');

    await expect(page.getByText('Focus Time')).toBeVisible();
    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
    await page.waitForTimeout(6500);
    await expect(page.getByText('Break Time')).toBeVisible();
});
