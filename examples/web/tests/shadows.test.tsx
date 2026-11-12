import { expect, test } from '@playwright/test';

for (const entry of ['source', 'module', 'commonjs']) {
  test(`${entry}: SSR styles before JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4173');
      await expect(page.getByTestId(`${entry}-converted`)).toHaveCSS(
        'border-radius',
        '20px'
      );
      await expect(page.getByTestId(`${entry}-converted`)).toHaveCSS(
        'box-shadow',
        'rgba(18, 52, 86, 0.25) -2px 3px 8px 0px'
      );
    } finally {
      await context.close();
    }
  });
  test(`${entry}: browser styles, hydration, DOM refs and child state`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    await page.goto('/');
    await expect(page.getByTestId(`${entry}-ref`)).toHaveText('mounted');
    const converted = page.getByTestId(`${entry}-converted`);
    await expect(converted).toHaveCSS('border-radius', '20px');
    await expect(converted).toHaveCSS(
      'box-shadow',
      'rgba(18, 52, 86, 0.25) -2px 3px 8px 0px'
    );
    await expect(page.getByTestId(`${entry}-string`)).toHaveCSS(
      'box-shadow',
      'rgb(255, 0, 0) 1px 2px 3px 4px inset, rgb(0, 0, 255) 2px 3px 4px 0px'
    );
    await expect(page.getByTestId(`${entry}-array`)).toHaveCSS(
      'box-shadow',
      'rgb(255, 0, 0) 1px 2px 3px 4px inset'
    );
    await expect(page.getByTestId(`${entry}-default`)).toHaveCSS(
      'box-shadow',
      'rgb(0, 0, 0) 0px 0px 4px 0px'
    );
    await expect(page.getByTestId(`${entry}-numeric`)).toHaveCSS(
      'box-shadow',
      'rgba(18, 52, 86, 0.25) 0px 0px 2px 0px'
    );
    await expect(page.getByTestId(`${entry}-legacy`)).toHaveCSS(
      'box-shadow',
      'rgba(18, 52, 86, 0.25) -2px 3px 4px 0px'
    );
    const state = page.getByTestId(`${entry}-state`);
    await state.getByRole('button').click();
    await expect(state).toHaveText('Count 1');
    await page.getByTestId(`${entry}-toggle`).click();
    await expect(state).toHaveText('Count 1');
    expect(await state.getAttribute('useLegacyShadow')).toBeNull();
    expect(errors).toEqual([]);
  });
}
