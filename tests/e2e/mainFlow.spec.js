const { test, expect } = require('@playwright/test');

function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

test('student can register, reserve, and export ICS', async ({ page }) => {
  test.setTimeout(120000);

  const suffix = uniqueSuffix();
  const email = `e2e.${suffix}@esiee-it.fr`;
  const plate = `E2E-${String(suffix).slice(-3)}-AA`;

  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => !document.body.textContent.includes('Chargement...'));

  await page.getByRole('button', { name: /cr[eé]er un compte/i }).first().click();

  await page.getByLabel(/nom complet/i).fill('E2E Student');
  await page.getByLabel(/adresse email/i).fill(email);
  await page.getByLabel(/t[eé]l[ée]phone/i).fill('0600000000');
  await page.getByLabel(/plaque d'immatriculation/i).fill(plate);
  await page.getByLabel(/^mot de passe$/i).fill('secret123');
  await page.getByLabel(/confirmer le mot de passe/i).fill('secret123');

  await page.getByRole('button', { name: /cr[eé]er mon compte/i }).click();

  await expect(page.getByRole('heading', { name: /bonjour/i })).toBeVisible();

  const reserveButton = page.getByRole('button', { name: /reserver pour le|réserver pour le/i });
  await expect(reserveButton).toBeVisible();
  await expect(reserveButton).toBeEnabled();
  await reserveButton.click();

  await expect(page.locator('.alert')).toContainText(/reservation confirmee|réservation confirmée/i);

  const exportButton = page.getByRole('button', { name: /exporter ics/i });
  await expect(exportButton).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await exportButton.click();
  const download = await downloadPromise;
  await expect(download.suggestedFilename()).toMatch(/reservation-\d{4}-\d{2}-\d{2}\.ics/i);
});
