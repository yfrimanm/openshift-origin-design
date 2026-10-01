/**
 * Capture Create catalog item wizard screenshots for the UX Google Doc.
 * Usage: node scripts/capture-vmaas-catalog-create-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'videos', 'vmaas-catalog-create-ux-doc');
const htmlPath = path.join(root, 'vmaas-ux-prototype.html');
const fileUrl = `file://${htmlPath}`;

async function shot(page, name) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('wrote', path.relative(root, file));
}

async function waitStep(page, title) {
  await page.locator('#create-ci-panel h3').filter({ hasText: new RegExp(`^\\s*${title}`) }).first().waitFor({ timeout: 10000 });
}

async function clickNext(page) {
  await page.locator('#create-ci-next').click();
  await page.waitForTimeout(450);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  await page.locator('#role-select').selectOption('provider');
  await page.waitForTimeout(500);
  await shot(page, '01-catalog-list');

  await page.locator('#btn-create-catalog-item').click();
  await page.waitForSelector('#create-ci-panel', { timeout: 8000 });
  await page.waitForTimeout(400);
  await waitStep(page, 'Details');
  await shot(page, '02-details');

  // Fill required name so we can advance freely
  await page.locator('#ci-regen-name').click();
  await page.waitForTimeout(200);

  await clickNext(page);
  await waitStep(page, 'Instance types');
  await shot(page, '03-instance-types');

  await clickNext(page);
  await waitStep(page, 'Visibility');
  await shot(page, '04-visibility-global');

  // Tenant scoped view
  const tenantCard = page.locator('input[name="ciVisibility"][value="tenant"]').locator('xpath=ancestor::label[1]');
  if (await tenantCard.count()) {
    await tenantCard.click();
    await page.waitForTimeout(350);
    await shot(page, '04b-visibility-tenant');
    // back to global for easier continue
    const globalCard = page.locator('input[name="ciVisibility"][value="global"]').locator('xpath=ancestor::label[1]');
    if (await globalCard.count()) await globalCard.click();
    await page.waitForTimeout(250);
  }

  await clickNext(page);
  await waitStep(page, 'Storage');
  await shot(page, '05-storage');

  await clickNext(page);
  await waitStep(page, 'Access & Initial run');
  await shot(page, '06-access-init');

  await clickNext(page);
  await waitStep(page, 'Review');
  await shot(page, '07-review');

  await browser.close();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
