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
  'https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=20260904-rename';

async function shot(page, name) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('wrote', path.relative(root, file));
}

async function clickNext(page) {
  await page.locator('#wiz-next').click();
  await page.waitForTimeout(500);
}

async function waitStep(page, title) {
  await page.locator('#wiz-panel h3').filter({ hasText: new RegExp(`^${title}$`) }).first().waitFor({ timeout: 10000 });
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

  const tplCard = page.locator('.tpl-card').first();
  await tplCard.click();
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

  // Fill required network fields if empty so Review is reachable
  const netSelect = page.locator('#wiz-panel select, #wiz-panel [aria-label*="Virtual network"], #wiz-panel .pf-v6-c-menu-toggle').first();
  // Prefer known mock controls
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
  // Click first available option in rich selects if present
  const toggles = page.locator('#wiz-panel .pf-v6-c-menu-toggle:not([disabled])');
  const toggleCount = await toggles.count();
  for (let i = 0; i < Math.min(toggleCount, 3); i++) {
    const t = toggles.nth(i);
    const text = ((await t.innerText()) || '').trim();
    if (/select|choose|—|-/i.test(text) || !text) {
      await t.click();
      await page.waitForTimeout(200);
      const opt = page.locator('.pf-v6-c-menu__item:not([disabled]), [role="option"]').first();
      if (await opt.count()) await opt.click();
      await page.waitForTimeout(200);
    }
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

  // —— VM Overview ——
  await page.goto(`${BASE.split('?')[0]}?v=20260904-rename&vm=azure-baboon-27`, {
    waitUntil: 'networkidle',
  });
  await setRole(page, 'admin');
  await page.waitForTimeout(600);
  await shot(page, '10-vm-overview');

  // Details card crop-ish: scroll to details
  const detailsTitle = page.locator('.vm-card__title', { hasText: 'Details' }).first();
  if (await detailsTitle.count()) {
    await detailsTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
  }
  await shot(page, '10b-vm-details-card');

  // Status popover
  const statusLink = page.locator('#view-vm .vm-detail__status button, #view-vm button').filter({ hasText: 'Running' }).first();
  if (await statusLink.count()) {
    await statusLink.click();
    await page.waitForTimeout(400);
    await shot(page, '10c-status-popover');
    await page.keyboard.press('Escape');
  }

  // —— Provider: Instance types ——
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await setRole(page, 'provider');
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

  // —— Disk images ——
  await page.locator('[data-nav="disk-images"]').click();
  await page.waitForTimeout(500);
  await shot(page, '14-disk-images-list');

  await page.locator('#btn-create-disk-image').click();
  await page.waitForTimeout(500);
  await shot(page, '15-create-disk-image');
  await page.locator('#create-di-cancel').click();
  await page.waitForTimeout(400);

  await page.locator('[data-disk-image="rhel-9-5"]').click();
  await page.waitForTimeout(500);
  await shot(page, '16-disk-image-detail');

  await browser.close();
  console.log('done →', path.relative(root, outDir));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
