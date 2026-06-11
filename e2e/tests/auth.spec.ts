import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('User can see the login page', async ({ page }) => {
    // Navigate to the app (defaults to login if unauthenticated)
    await page.goto('/');
    
    // Expect the login heading to be visible
    await expect(page.locator('h2', { hasText: 'Sign In to CARBON' })).toBeVisible();
    
    // Check that there's an email and password input
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });
  
  test('User can navigate to registration', async ({ page }) => {
    await page.goto('/login');
    
    // Click the register link
    await page.getByRole('link', { name: 'Create one free' }).click();
    
    // Should be on register page
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.locator('h2', { hasText: 'Create Account' })).toBeVisible();
  });
});
