/**
 * Authentication helper for E2E tests
 * Handles login, JWT token management, and authentication state
 */

import { Page } from '@playwright/test';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Login helper - performs authentication via API
 */
export async function loginViaAPI(
  credentials: LoginCredentials,
  gatewayURL: string = 'http://localhost:8081'
): Promise<AuthTokens> {
  const response = await fetch(`${gatewayURL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.accessToken || data.access_token,
    refreshToken: data.refreshToken || data.refresh_token,
  };
}

/**
 * Login via UI - performs authentication through the dashboard interface
 */
export async function loginViaUI(
  page: Page,
  credentials: LoginCredentials
): Promise<void> {
  // Navigate to login page
  await page.goto('/login');

  // Fill in credentials
  await page.fill('[name="email"], [placeholder*="email" i]', credentials.email);
  await page.fill('[name="password"], [placeholder*="password" i]', credentials.password);

  // Submit form
  await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');

  // Wait for navigation to complete
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

/**
 * Set authentication token in browser storage
 */
export async function setAuthToken(page: Page, tokens: AuthTokens): Promise<void> {
  await page.evaluate((tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  }, tokens);
}

/**
 * Get authentication token from browser storage
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    return localStorage.getItem('accessToken');
  });
}

/**
 * Clear authentication state
 */
export async function logout(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
  });
}

/**
 * Create test user credentials
 */
export function getTestCredentials(): LoginCredentials {
  return {
    email: process.env.TEST_USER_EMAIL || 'test@a4co.com',
    password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
  };
}
