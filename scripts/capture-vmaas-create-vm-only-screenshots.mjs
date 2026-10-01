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
const htmlPath = path.join(root, 'vmaas-ux-prototype.html');
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
  // Prefer the step title (first matching h3). Allow leading whitespace / trailing labels like "Optional".
  await page.locator('#wiz-panel h3').filter({ hasText: new RegExp(`^\\s*${title}`) }).first().waitFor({ timeout: 8000 });
}

async function closeDrawer(page) {
  const drawerClose = page.locator('#tpl-drawer-close, .tpl-drawer__close').first();
  if (await drawerClose.count()) {
    try { await drawerClose.click({ timeout: 1500 }); } catch { /* ignore */ }
    await page.waitForTimeout(250);
  }
}

async function ensureDiskImage(page) {
  const toggle = page.locator('#vm-disk-image-toggle');
  if (!(await toggle.count())) return;
  const selected = await page.locator('#vm-disk-image-select .rich-select__toggle-label').textContent().catch(() => '');
  if (selected && !/select a disk image/i.test(selected)) return;
  await toggle.click();
  await page.waitForTimeout(250);
  const opt = page.locator('[data-vm-disk-image]').first();
  if (await opt.count()) {
    await opt.click();
    await page.waitForTimeout(300);
  } else {
    await page.keyboard.press('Escape');
  }
}

async function selectGuestOs(page, label) {
  const card = page.locator(`input[name="vmGuestOs"][value="${label}"]`).locator('xpath=ancestor::label[1]');
  if (await card.count()) {
    await card.click();
    await page.waitForTimeout(400);
  }
}

async function selectTplProject(page, projectId) {
  await page.locator('#f-tpl-project-toggle').click();
  await page.waitForTimeout(250);
  const opt = page.locator(`[data-tpl-project="${projectId}"]`).first();
  if (await opt.count()) {
    await opt.click();
  } else {
    // Fallback: search then pick first match
    const search = page.locator('#vm-tpl-project-search');
    if (await search.count()) {
      await search.fill(projectId);
      await page.waitForTimeout(200);
      await page.locator('[data-tpl-project]').first().click();
    }
  }
  await page.waitForTimeout(400);
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

  await shotPage(page, '02-select-template');

  await selectTplProject(page, 'yifat');
  await shotPage(page, '02b-select-template-empty');
  await selectTplProject(page, 'project-a');

  const lockedCard = page.locator('.tpl-card').filter({ hasNotText: 'Editable' }).first();
  if (await lockedCard.count()) await lockedCard.click();
  else await page.locator('.tpl-card').first().click();
  await page.waitForSelector('#tpl-drawer', { timeout: 5000 });
  await page.waitForTimeout(400);
  await shotEl(page, '#tpl-drawer', '03-template-drawer-locked');
  await closeDrawer(page);

  const editableCard = page.locator('.tpl-card').filter({ hasText: 'Editable' }).first();
  if (await editableCard.count()) {
    await editableCard.click();
    await page.waitForSelector('#tpl-drawer', { timeout: 5000 });
    await page.waitForTimeout(400);
    await shotEl(page, '#tpl-drawer', '04-template-drawer-editable');
    await closeDrawer(page);
    await editableCard.click();
    await page.waitForTimeout(250);
    await closeDrawer(page);
  }

  await clickNext(page);
  await waitStep(page, 'Details');
  await page.waitForTimeout(300);
  await page.locator('#f-regen').click();
  await page.waitForTimeout(200);
  await ensureDiskImage(page);
  await shotPage(page, '05-details');

  await clickNext(page);
  await waitStep(page, 'Instance type');
  await page.waitForTimeout(300);
  await shotPage(page, '06-compute-resource');

  await clickNext(page);
  await waitStep(page, 'Storage');
  await page.waitForTimeout(300);
  await shotPage(page, '07-storage');

  await page.locator('#f-add-disk').click();
  await page.waitForSelector('.inline-set[data-disk-set]', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotPage(page, '08-additional-disk-set');

  await clickNext(page);
  await waitStep(page, 'Network');
  await page.waitForTimeout(300);
  await shotPage(page, '09-network');

  await page.locator('#f-add-network').click();
  await page.waitForSelector('.inline-set[data-network-set]', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotPage(page, '09b-additional-network-set');

  await clickNext(page);
  await waitStep(page, 'Access & Initial run');
  await page.waitForTimeout(350);
  // Linux path: SSH + Cloud-init
  await shotPage(page, '09c-access-linux');

  // Switch to Windows Sysprep cards via Details guest OS
  await page.locator('.pf-v6-c-wizard__nav-link').filter({ hasText: /Details/ }).first().click();
  await waitStep(page, 'Details');
  await page.waitForTimeout(300);
  await selectGuestOs(page, 'Microsoft Windows');
  await ensureDiskImage(page);
  await page.locator('.pf-v6-c-wizard__nav-link').filter({ hasText: /Access/ }).first().click();
  await waitStep(page, 'Access & Initial run');
  await page.waitForTimeout(400);
  await shotPage(page, '09d-access-windows-sysprep');

  // Attach existing card selected
  const attachCard = page.locator('input[name="sysprepMode"][value="attach"]').locator('xpath=ancestor::label[1]');
  if (await attachCard.count()) {
    await attachCard.click();
    await page.waitForTimeout(350);
    await shotPage(page, '09e-access-windows-attach');
  }

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
