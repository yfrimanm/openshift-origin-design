/**
 * Capture OSAC-2621 Tenant Networking handoff screenshots.
 * Usage: node scripts/capture-osac-2621-networking-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'videos', 'osac-2621-networking-handoff');
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
  await loc.waitFor({ state: 'visible', timeout: 10000 });
  await loc.screenshot({ path: file });
  console.log('wrote', path.relative(root, file), `(el ${selector})`);
}

async function clickNext(page) {
  await page.locator('#wiz-next').click();
  await page.waitForTimeout(450);
}

async function waitStep(page, title) {
  await page.locator('#wiz-panel h3').filter({ hasText: new RegExp(`^\\s*${title}`) }).first().waitFor({ timeout: 10000 });
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

async function goToCreateNetworking(page) {
  await page.locator('#btn-create').click();
  await page.waitForSelector('#overlay.pf-m-open', { timeout: 8000 });
  await page.waitForTimeout(400);

  const editable = page.locator('.tpl-card').filter({ hasText: 'Editable' }).first();
  if (await editable.count()) {
    await editable.click();
    await page.waitForTimeout(300);
    await closeDrawer(page);
  } else {
    await page.locator('.tpl-card').first().click();
    await page.waitForTimeout(300);
    await closeDrawer(page);
  }

  await clickNext(page);
  await waitStep(page, 'Details');
  const regen = page.locator('#f-regen');
  if (await regen.count()) {
    await regen.click();
    await page.waitForTimeout(250);
  }
  await ensureDiskImage(page);

  // Prefer side-nav jump once Details is valid
  const netNav = page.locator('#wiz-nav-list [data-step="config-network"]').first();
  if (await netNav.count()) {
    await netNav.click();
    await page.waitForTimeout(500);
  } else {
    for (let i = 0; i < 6; i++) {
      const title = (await page.locator('#wiz-panel h3').first().textContent().catch(() => '')) || '';
      if (/^\s*Networking/i.test(title.trim())) return;
      await clickNext(page);
    }
  }
  await waitStep(page, 'Networking');
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#role-select').selectOption('admin');
  await page.waitForTimeout(500);

  // A1. Virtual networks list (cards)
  await page.locator('[data-nav="networks"]').click();
  await page.waitForTimeout(600);
  await shotPage(page, '01-virtual-networks-list');
  const cardsToggle = page.locator('button[aria-label*="Cards"], button[aria-label*="cards"], #net-view-cards, [data-net-view="cards"]').first();
  if (await cardsToggle.count()) {
    await cardsToggle.click().catch(() => {});
    await page.waitForTimeout(300);
    await shotPage(page, '01b-virtual-networks-cards');
  }

  // A2. Create virtual network
  await page.locator('#btn-create-network').click();
  await page.waitForSelector('#overlay.pf-m-open', { timeout: 8000 });
  await page.waitForTimeout(500);
  await shotPage(page, '02-create-virtual-network');
  await page.locator('#wiz-cancel').click().catch(() => {});
  await page.waitForTimeout(300);
  const leave = page.locator('#cancel-overlay .pf-v6-c-button.pf-m-primary, #cancel-confirm, button').filter({ hasText: /Leave|Exit|Discard/i }).first();
  if (await leave.count() && await leave.isVisible()) {
    await leave.click();
    await page.waitForTimeout(400);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
  // Ensure overlay closed
  await page.evaluate(() => {
    const o = document.getElementById('overlay');
    if (o) o.classList.remove('pf-m-open');
    const c = document.getElementById('cancel-overlay');
    if (c) c.classList.remove('pf-m-open');
  });
  await page.waitForTimeout(200);

  // Back to VMs for Create wizard
  await page.locator('[data-nav="vms"]').click();
  await page.waitForTimeout(400);

  // B1. Create VM → Networking (Tenant default)
  await goToCreateNetworking(page);
  await page.waitForTimeout(400);
  await shotPage(page, '03-create-vm-networking-tenant-default');

  // B2. Custom network
  const custom = page.locator('input[name="networkPath"][value="custom"]').locator('xpath=ancestor::label[1]');
  if (await custom.count()) {
    await custom.click();
  } else {
    await page.locator('label').filter({ hasText: /Custom network/i }).first().click();
  }
  await page.waitForTimeout(500);
  await shotPage(page, '04-create-vm-networking-custom');

  // B3. Additional network
  const addNet = page.locator('#f-add-network');
  if (await addNet.count()) {
    await addNet.click();
    await page.waitForTimeout(450);
    await shotPage(page, '05-create-vm-additional-networks');
  }

  // Close wizard
  await page.evaluate(() => {
    const o = document.getElementById('overlay');
    if (o) o.classList.remove('pf-m-open');
    const c = document.getElementById('cancel-overlay');
    if (c) c.classList.remove('pf-m-open');
  });
  await page.waitForTimeout(300);

  // C. Attach external IP modal
  await page.locator('[data-nav="vms"]').click();
  await page.waitForTimeout(400);
  const vmLink = page.locator('[data-open-vm="azure-baboon-27"], a').filter({ hasText: 'azure-baboon-27' }).first();
  if (await vmLink.count()) {
    await vmLink.click();
  } else {
    await page.locator('[data-vm-card="azure-baboon-27"]').first().click();
  }
  await page.waitForTimeout(700);

  // Detach if needed so Attach is available
  const ipToggle = page.locator('[data-ip-toggle="external"]').first();
  if (await ipToggle.count()) {
    const label = ((await ipToggle.textContent()) || '').trim();
    if (/^Detach$/i.test(label)) {
      await ipToggle.click();
      await page.waitForTimeout(400);
    }
    await page.locator('[data-ip-toggle="external"]').filter({ hasText: /Attach/i }).first().click();
    await page.waitForTimeout(500);
    if (await page.locator('#extip-modal').isVisible()) {
      await shotEl(page, '#extip-modal', '06-attach-external-ip-modal');
    } else {
      await shotPage(page, '06-attach-external-ip-modal');
    }
  } else {
    await shotPage(page, '06-attach-external-ip-overview');
  }

  await browser.close();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
