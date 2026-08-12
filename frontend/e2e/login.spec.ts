import { test, expect } from '@playwright/test';

test('user can log in successfully', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Enter your email').fill('e1528479@u.nus.edu');

    await page.getByPlaceholder('Enter your password').fill('testing123');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard/);
});
