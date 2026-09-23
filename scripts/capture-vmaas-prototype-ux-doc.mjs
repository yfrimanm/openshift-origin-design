/**
 * Capture screenshots for the VMaaS prototype UX doc from the live Pages mock.
 * Usage: node scripts/capture-vmaas-prototype-ux-doc.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'videos', 'vmaas-prototype-ux-doc');
const BASE =
  process.env.VMAAS_MOCK_URL ||
  'https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=20260916-tenant';

async function shot(page, name) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('wrote', path.relative(root, file));
}

async function shotPanel(page, name) {
  const file = path.join(outDir, `${name}.png`);
  const panel = page.locator('.console__body').first();
  await panel.waitFor({ state: 'visible' });
  await panel.screenshot({ path: file });
  console.log('wrote', path.relative(root, file));
}

async function clickNext(page) {
  await page.locator('#wiz-next').click();
  await page.waitForTimeout(500);
}

async function clickCatalogNext(page) {
  await page.locator('#create-ci-next').click();
  await page.waitForTimeout(500);
}

async function waitStep(page, title) {
  await page.locator('#wiz-panel h3').filter({ hasText: new RegExp(`^${title}$`) }).first().waitFor({ timeout: 10000 });
}

async function waitCatalogStep(page, title) {
  await page.locator('#create-ci-panel h3').filter({ hasText: new RegExp(`^${title}$`) }).first().waitFor({ timeout: 10000 });
}

async function setRole(page, value) {
  await page.locator('#role-select').selectOption(value);
  await page.waitForTimeout(400);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // —— Tenant Admin: VM list ——
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await setRole(page, 'admin');
  await page.waitForTimeout(500);
  await shot(page, '01-vm-list');

  // Row kebab
  await page.locator('[data-vm-kebab="azure-baboon-27"]').click();
  await page.waitForTimeout(300);
  await shot(page, '01b-vm-kebab');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // —— Create wizard ——
  await page.locator('#btn-create').click();
  await page.waitForSelector('#overlay.pf-m-open', { timeout: 8000 });
  await page.waitForTimeout(500);
  await shot(page, '02-select-template');

  // Prefer an editable template so Storage tier shows typeahead rich-select chrome
  const tplCards = page.locator('.tpl-card');
  const tplCount = await tplCards.count();
  let picked = false;
  for (let i = 0; i < tplCount; i++) {
    const label = ((await tplCards.nth(i).innerText()) || '');
    if (/editable/i.test(label) && !/\bxl\b/i.test(label)) {
      await tplCards.nth(i).click();
      picked = true;
      break;
    }
  }
  if (!picked) await tplCards.first().click();
  await page.waitForTimeout(600);
  await shot(page, '03-template-drawer');

  const drawerClose = page.locator('#tpl-drawer-close, .tpl-drawer button[aria-label="Close"]').first();
  if (await drawerClose.count()) {
    try {
      await drawerClose.click({ timeout: 1500 });
    } catch {
      /* ignore */
    }
  }

  await clickNext(page);
  await waitStep(page, 'Details');
  await shot(page, '04-details');

  // Ensure name filled
  const nameInput = page.locator('#f-name');
  if (await nameInput.count()) {
    const val = await nameInput.inputValue();
    if (!val) {
      const regen = page.locator('#f-regen');
      if (await regen.count()) await regen.click();
      else await nameInput.fill('demo-vm-ux-doc');
      await page.waitForTimeout(200);
    }
  }

  await clickNext(page);
  await waitStep(page, 'Compute resource');
  await shot(page, '05-compute');

  await clickNext(page);
  await waitStep(page, 'Storage');
  await shot(page, '06-storage');

  await clickNext(page);
  await waitStep(page, 'Network');
  await shot(page, '07-network');

  // Fill required network fields if empty so Review is reachable (typeahead rich-selects)
  for (const sel of ['#f-network', '#f-vn', '#f-subnet', '#f-sg']) {
    const el = page.locator(sel);
    if (await el.count()) {
      const tag = await el.evaluate((n) => n.tagName.toLowerCase());
      if (tag === 'select') {
        const opts = await el.locator('option').allTextContents();
        const pick = opts.find((o) => o && !/select/i.test(o));
        if (pick) await el.selectOption({ label: pick });
      }
    }
  }
  const richToggles = page.locator('#wiz-panel .rich-select__toggle:not([disabled])');
  const toggleCount = await richToggles.count();
  for (let i = 0; i < Math.min(toggleCount, 3); i++) {
    const t = richToggles.nth(i);
    const text = ((await t.innerText()) || '').trim();
    if (!/select|choose|—|-|^$/i.test(text) && text.length > 1) continue;
    await t.click();
    await page.waitForTimeout(250);
    const opt = page
      .locator(
        '.rich-select.pf-m-expanded .rich-select__option:visible, #wiz-panel .rich-select__menu:not([hidden]) .rich-select__option:visible'
      )
      .first();
    if (await opt.count()) {
      await opt.click({ timeout: 3000 }).catch(() => {});
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }
    await page.waitForTimeout(200);
  }

  await clickNext(page);
  await waitStep(page, 'Review and create');
  await shot(page, '08-review');

  // Exit confirm
  await page.locator('#wiz-close').click();
  await page.waitForTimeout(400);
  const exitOverlay = page.locator('#cancel-overlay.pf-m-open, #cancel-overlay[aria-hidden="false"]');
  if (await page.locator('#cancel-overlay').isVisible().catch(() => false)) {
    await shot(page, '09-exit-modal');
    const stay = page.locator('#cancel-stay');
    if (await stay.count()) await stay.click();
    else await page.locator('#cancel-confirm').click();
  } else {
    // If exit closed wizard, reopen briefly skipped
    await shot(page, '09-exit-modal');
  }
  await page.waitForTimeout(300);

  // Close wizard if still open
  if (await page.locator('#overlay.pf-m-open').count()) {
    await page.locator('#wiz-close').click().catch(() => {});
    await page.waitForTimeout(300);
    if (await page.locator('#cancel-confirm').isVisible().catch(() => false)) {
      await page.locator('#cancel-confirm').click();
    }
  }
  await page.waitForTimeout(400);

  // —— VM Overview (v2) ——
  const vmUrl = BASE.includes('?') ? `${BASE}&vm=indigo-quokka-89` : `${BASE}?vm=indigo-quokka-89`;
  await page.goto(vmUrl, { waitUntil: 'networkidle' });
  await setRole(page, 'admin');
  await page.waitForTimeout(600);
  await shot(page, '10-vm-overview');

  const detailCols = page.locator('.vm-overview-v2__detail-cols').first();
  if (await detailCols.count()) {
    const file = path.join(outDir, '10b-vm-details-card.png');
    await detailCols.screenshot({ path: file });
    console.log('wrote', path.relative(root, file), '(el .vm-overview-v2__detail-cols)');
  } else {
    await shot(page, '10b-vm-details-card');
  }

  const statusLink = page.locator('#view-vm .status-link').filter({ hasText: 'Running' }).first();
  if (await statusLink.count()) {
    await statusLink.click();
    await page.waitForTimeout(400);
    await shot(page, '10c-status-popover');
    await page.keyboard.press('Escape');
  }

  // —— Provider: Catalog (default landing) ——
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await setRole(page, 'provider');
  await page.waitForTimeout(600);
  await shot(page, '17-catalog-list');

  await page.locator('[data-nav="templates"]').click();
  await page.waitForTimeout(400);
  await page.locator('#btn-create-catalog-item').waitFor({ state: 'visible', timeout: 8000 });
  await page.locator('#btn-create-catalog-item').click();
  await page.waitForSelector('#create-ci-panel', { timeout: 8000 });
  await page.waitForTimeout(500);
  await clickCatalogNext(page);
  await waitCatalogStep(page, 'Instance type & Access');
  await clickCatalogNext(page);
  await waitCatalogStep(page, 'Visibility');
  await shot(page, '18-catalog-create-visibility');
  await page.locator('#create-ci-cancel').click();
  await page.waitForTimeout(400);

  await page.locator('[data-catalog-card]').first().click();
  await page.waitForTimeout(600);
  await shot(page, '19-catalog-item-detail');

  // Hardware specifications card (catalog detail)
  const hwSpecs = page.locator('.catalog-hw-specs').first();
  if (await hwSpecs.count()) {
    await hwSpecs.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const hwFile = path.join(outDir, '19b-catalog-hardware-specs.png');
    await hwSpecs.screenshot({ path: hwFile });
    console.log('wrote', path.relative(root, hwFile));
  }

  // Edit catalog item — Review (no changes)
  await page.locator('#ci-detail-actions-btn').click();
  await page.waitForTimeout(300);
  await page.locator('[data-ci-action="edit"]').click();
  await page.waitForSelector('#create-ci-panel', { timeout: 8000 });
  await page.waitForTimeout(400);
  for (const title of ['Instance type & Access', 'Visibility', 'Storage', 'Review']) {
    await clickCatalogNext(page);
    if (title === 'Review') {
      await page.locator('#create-ci-panel h3').filter({ hasText: /Review/ }).first().waitFor({ timeout: 10000 });
    } else {
      await waitCatalogStep(page, title);
    }
  }
  await shot(page, '20-catalog-edit-review-empty');

  // Back to Details via wizard nav, change description, return to Review with changes
  await page.locator('#create-ci-nav [data-catalog-step="0"]').click();
  await waitCatalogStep(page, 'Details');
  await page.waitForTimeout(300);
  const desc = page.locator('#ci-description');
  await desc.waitFor({ state: 'visible', timeout: 8000 });
  const prev = await desc.inputValue();
  await desc.fill(`${prev || 'Catalog item'} (updated for review)`);
  await page.waitForTimeout(200);
  for (const title of ['Instance type & Access', 'Visibility', 'Storage', 'Review']) {
    await clickCatalogNext(page);
    if (title === 'Review') {
      await page.locator('#create-ci-panel h3').filter({ hasText: /Review/ }).first().waitFor({ timeout: 10000 });
    } else {
      await waitCatalogStep(page, title);
    }
  }
  await shot(page, '21-catalog-edit-review-changes');

  // Exit edit wizard
  await page.locator('#create-ci-cancel').click();
  await page.waitForTimeout(400);

  // Delete catalog item confirmation modal
  // Ensure we are on catalog detail (re-open first card if needed)
  if (!(await page.locator('#ci-detail-actions-btn').isVisible().catch(() => false))) {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await setRole(page, 'provider');
    await page.waitForTimeout(500);
    await page.locator('[data-catalog-card]').first().click();
    await page.waitForTimeout(500);
  }
  await page.locator('#ci-detail-actions-btn').click();
  await page.waitForTimeout(300);
  await page.locator('[data-ci-action="delete"]').click();
  await page.waitForSelector('#delete-catalog-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(300);
  await shot(page, '22-catalog-delete-modal');
  await page.locator('#delete-catalog-cancel').click();
  await page.waitForTimeout(300);

  // —— Provider: Instance types ——
  await page.locator('[data-nav="instance-types"]').click();
  await page.waitForTimeout(600);
  await shot(page, '11-instance-types-list');

  await page.locator('#btn-create-instance-type').click();
  await page.waitForTimeout(500);
  await shot(page, '12-create-instance-type');
  await page.locator('#create-it-cancel').click();
  await page.waitForTimeout(400);

  await page.locator('[data-instance-type="aaa"]').click();
  await page.waitForTimeout(500);
  await shot(page, '13-instance-type-detail');

  await page.locator('#it-detail-actions-btn').click();
  await page.waitForTimeout(300);
  await shot(page, '13b-instance-type-actions');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // —— Disk images (panel shots — better aspect ratio for Google Doc embeds) ——
  await page.setViewportSize({ width: 1680, height: 1000 });
  await page.locator('[data-nav="disk-images"]').click();
  await page.waitForTimeout(600);
  await shotPanel(page, '14-disk-images-list');

  await page.locator('#btn-create-disk-image').click();
  await page.waitForTimeout(600);
  await shotPanel(page, '15-create-disk-image');
  await page.locator('#create-di-cancel').click();
  await page.waitForTimeout(400);

  await page.locator('[data-disk-image="rhel-9-5"]').click();
  await page.waitForTimeout(600);
  await shotPanel(page, '16-disk-image-detail');
  await page.setViewportSize({ width: 1440, height: 900 });

  await browser.close();
  console.log('done →', path.relative(root, outDir));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
