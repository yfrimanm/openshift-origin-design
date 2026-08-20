/**
 * Capture Create VM only screenshots for the UX Google Doc.
 * Avoids clipped text by shooting drawers/modals as elements and using a wide viewport.
 * Usage: node scripts/capture-vmaas-create-vm-only-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'videos', 'vmaas-create-vm-only-ux-doc');
const htmlPath = path.join(root, 'vmaas-create-vm-only.html');
const fileUrl = `file://${htmlPath}`;

async function shotPage(page, name) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('wrote', path.relative(root, file));
}

async function shotEl(page, selector, name) {
  const file = path.join(outDir, `${name}.png`);
  const loc = page.locator(selector).first();
  await loc.waitFor({ state: 'visible', timeout: 8000 });
  await loc.screenshot({ path: file });
  console.log('wrote', path.relative(root, file), `(el ${selector})`);
}

async function clickNext(page) {
  await page.locator('#wiz-next').click();
  await page.waitForTimeout(450);
}

async function waitStep(page, title) {
  // Prefer the step title (first matching h3), not nested section titles like "Additional networks".
  await page.locator('#wiz-panel h3').filter({ hasText: new RegExp(`^${title}$`) }).first().waitFor({ timeout: 8000 });
}

async function closeDrawer(page) {
  const drawerClose = page.locator('#tpl-drawer-close, .tpl-drawer__close').first();
  if (await drawerClose.count()) {
    try { await drawerClose.click({ timeout: 1500 }); } catch { /* ignore */ }
    await page.waitForTimeout(250);
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  await shotPage(page, '01-vm-list');

  const kebab = page.locator('[data-vm-kebab]').first();
  if (await kebab.count()) {
    await kebab.click();
    await page.waitForTimeout(400);
    // Capture kebab menu in frame (not clipped by viewport edge)
    const menu = page.locator('#vm-kebab-menu');
    if (await menu.count() && await menu.isVisible()) {
      await shotEl(page, '#vm-kebab-menu', '01b-vm-kebab');
    } else {
      await shotPage(page, '01b-vm-kebab');
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  await page.locator('#btn-create').click();
  await page.waitForSelector('#overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(400);

  // Select template grid — no drawer open (avoids cards cut by drawer)
  await shotPage(page, '02-select-template');

  // Locked template — shoot drawer panel only
  const lockedCard = page.locator('.tpl-card').filter({ hasNotText: 'Editable' }).first();
  if (await lockedCard.count()) await lockedCard.click();
  else await page.locator('.tpl-card').first().click();
  await page.waitForSelector('#tpl-drawer', { timeout: 5000 });
  await page.waitForTimeout(400);
  await shotEl(page, '#tpl-drawer', '03-template-drawer-locked');
  await closeDrawer(page);

  // Editable template drawer
  const editableCard = page.locator('.tpl-card').filter({ hasText: 'Editable' }).first();
  if (await editableCard.count()) {
    await editableCard.click();
    await page.waitForSelector('#tpl-drawer', { timeout: 5000 });
    await page.waitForTimeout(400);
    await shotEl(page, '#tpl-drawer', '04-template-drawer-editable');
    await closeDrawer(page);
    // Keep editable selected for remaining flow
    await editableCard.click();
    await page.waitForTimeout(250);
    await closeDrawer(page);
  }

  await clickNext(page);
  await waitStep(page, 'Details');
  await page.waitForTimeout(300);
  await shotPage(page, '05-details');

  await page.locator('#f-regen').click();
  await page.waitForTimeout(200);
  await clickNext(page);
  await waitStep(page, 'Compute resource');
  await page.waitForTimeout(300);
  await shotPage(page, '06-compute-resource');

  await clickNext(page);
  await waitStep(page, 'Storage');
  await page.waitForTimeout(300);
  await shotPage(page, '07-storage');

  // Inline Add disk → Disk set (Ethan's config-sets pattern; no modal)
  await page.locator('#f-add-disk').click();
  await page.waitForSelector('.inline-set[data-disk-set]', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotPage(page, '08-additional-disk-set');

  await clickNext(page);
  await waitStep(page, 'Network');
  await page.waitForTimeout(300);
  // Primary network fields + Additional networks (empty Add link)
  await shotPage(page, '09-network');

  // Inline Add network → Network set
  await page.locator('#f-add-network').click();
  await page.waitForSelector('.inline-set[data-network-set]', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotPage(page, '09b-additional-network-set');

  await clickNext(page);
  await waitStep(page, 'Review and create');
  await page.waitForTimeout(300);
  await shotPage(page, '10-review');

  await page.locator('#wiz-cancel').click();
  await page.waitForSelector('#cancel-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(300);
  const cancelModal = page.locator('#cancel-overlay .pf-v6-c-modal-box, #cancel-modal').first();
  if (await cancelModal.count()) await shotEl(page, '#cancel-overlay .pf-v6-c-modal-box', '11-exit-modal');
  else await shotPage(page, '11-exit-modal');

  await browser.close();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
