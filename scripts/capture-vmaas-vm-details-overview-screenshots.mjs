/**
 * Capture VM details Overview screenshots for the UX Google Doc.
 * Usage: node scripts/capture-vmaas-vm-details-overview-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'videos', 'vmaas-vm-details-overview-ux-doc');
const htmlPath = path.join(root, 'vmaas-ux-prototype.html');
const fileUrl = `file://${htmlPath}`;

async function shotPage(page, name, { fullPage = true } = {}) {
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage });
  console.log('wrote', path.relative(root, file));
}

async function shotEl(page, selector, name) {
  const file = path.join(outDir, `${name}.png`);
  const loc = page.locator(selector).first();
  await loc.waitFor({ state: 'visible', timeout: 8000 });
  await loc.screenshot({ path: file });
  console.log('wrote', path.relative(root, file), `(el ${selector})`);
}

async function openVmDetail(page, name) {
  const link = page.locator(`[data-open-vm="${name}"]`).first();
  await link.waitFor({ state: 'visible', timeout: 10000 });
  await link.click();
  await page.waitForSelector('#vm-detail-root', { timeout: 8000 });
  await page.waitForTimeout(500);
}

async function backToVmList(page) {
  const crumb = page.locator('[data-breadcrumb-vms]').first();
  if (await crumb.count()) {
    await crumb.click();
    await page.waitForTimeout(400);
  } else {
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
  }
}

async function ensureTwoNics(page, vmName) {
  await page.evaluate((name) => {
    const vm = VMS.find((v) => v.name === name);
    if (!vm) return;
    if (!vm.nics || !vm.nics.length) {
      vm.nics = [{
        name: 'tenant-workload',
        virtualNetwork: 'tenant-workload',
        subnet: 'bm-compute-a',
        securityGroups: ['allow-ssh-https'],
        ip: vm.ip || '—',
      }];
    }
    if (vm.nics.length < 2) {
      vm.nics.push({
        name: 'secondary-net',
        virtualNetwork: 'secondary-net',
        subnet: 'bm-compute-b',
        securityGroups: ['allow-ssh-https'],
        ip: '10.130.1.200',
      });
    }
    if (typeof renderVmDetail === 'function') renderVmDetail();
  }, vmName);
  await page.waitForTimeout(350);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Resolve preferred running VM with guest agent (indigo), else first running with guestAgent
  const runningVm = await page.evaluate(() => {
    const indigo = VMS.find((v) => v.name === 'indigo-quokka-89');
    if (indigo) return indigo.name;
    const ga = VMS.find((v) => v.status === 'running' && v.guestAgent === true);
    return ga?.name || VMS.find((v) => v.status === 'running')?.name || VMS[0]?.name;
  });

  // 01 — Overview running
  await openVmDetail(page, runningVm);
  await shotPage(page, '01-overview-running');

  // 02 — Status popover (Details card preferred; avoid hidden list-table status links)
  const statusBtn = page.locator('#vm-detail-root .vm-dl [data-status-popover], #vm-detail-root .vm-detail__status [data-status-popover]').first();
  await statusBtn.scrollIntoViewIfNeeded();
  await statusBtn.click();
  await page.waitForTimeout(350);
  const statusPop = page.locator('#status-popover');
  if (await statusPop.count() && await statusPop.isVisible()) {
    await shotEl(page, '#status-popover', '02-status-popover');
  } else {
    await shotPage(page, '02-status-popover');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 03 — Network kebab (Edit + Delete visible → need ≥2 NICs)
  await ensureTwoNics(page, runningVm);
  const netKebab = page.locator('[data-overview-menu^="nic:"]').first();
  await netKebab.click();
  await page.waitForTimeout(350);
  const netMenu = page.locator('.overview-row-menu').first();
  const netCard = page.locator('.vm-card').filter({ hasText: 'Network' }).first();
  if (await netMenu.count() && await netMenu.isVisible()) {
    await shotEl(page, '.overview-row-menu', '03-network-kebab');
  } else if (await netCard.count()) {
    await shotEl(page, '.vm-card:has([data-overview-menu^="nic:"])', '03-network-kebab');
  } else {
    await shotPage(page, '03-network-kebab');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 04 — Boot disk kebab (disabled Delete + reason)
  const bootKebab = page.locator('[data-overview-menu^="disk:"]').first();
  await bootKebab.click();
  await page.waitForTimeout(350);
  const diskMenu = page.locator('.overview-row-menu').first();
  if (await diskMenu.count() && await diskMenu.isVisible()) {
    await shotEl(page, '.overview-row-menu', '04-storage-boot-delete');
  } else {
    await shotEl(page, '.vm-card:has([data-overview-menu^="disk:"])', '04-storage-boot-delete');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 05 — Utilization not running (stopped VM)
  await backToVmList(page);
  const stoppedVm = await page.evaluate(() => {
    const preferred = VMS.find((v) => v.name === 'windows-golden-eider-58');
    if (preferred) return preferred.name;
    return VMS.find((v) => v.status === 'stopped')?.name;
  });
  await openVmDetail(page, stoppedVm);
  await shotPage(page, '05-utilization-not-running');

  // 06 — SSH Not configured (Linux without sshPublicKey)
  await backToVmList(page);
  const sshVm = await page.evaluate(() => {
    const candidates = ['azure-baboon-27', 'fedora-aqua-barnacle-58', 'rhel9-black-gunnysack-58'];
    for (const name of candidates) {
      const v = VMS.find((x) => x.name === name);
      if (v && !/win/i.test(String(v.os || v.osFull || '')) && !(v.sshPublicKey && String(v.sshPublicKey).trim())) {
        return name;
      }
    }
    const any = VMS.find((v) =>
      !/win/i.test(String(v.os || v.osFull || '')) && !(v.sshPublicKey && String(v.sshPublicKey).trim())
    );
    return any?.name || 'azure-baboon-27';
  });
  await openVmDetail(page, sshVm);
  const sshLink = page.locator('[data-edit-ssh].name-link, button.name-link[data-edit-ssh]').filter({ hasText: 'Not configured' }).first();
  if (await sshLink.count()) {
    await sshLink.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    // Prefer Details card so the Not configured link is visible
    const detailsCard = page.locator('.vm-card').filter({ hasText: 'SSH public key' }).first();
    if (await detailsCard.count()) await shotEl(page, '.vm-card:has([data-edit-ssh])', '06-ssh-not-configured');
    else await shotPage(page, '06-ssh-not-configured');
  } else {
    await shotPage(page, '06-ssh-not-configured');
  }

  // 07 — Error status Overview
  await backToVmList(page);
  await openVmDetail(page, 'rhel8-mystic-eagle-22');
  await shotPage(page, '07-error-status');

  // —— Overview modals (day-2 edit / add / delete) ——
  await backToVmList(page);
  await openVmDetail(page, runningVm);

  // 09 — Edit compute resources
  await page.locator('[data-edit-compute]').first().click();
  await page.waitForSelector('#compute-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(300);
  await shotEl(page, '#compute-modal', '09-edit-compute-modal');
  await page.locator('#compute-modal-cancel').click();
  await page.waitForSelector('#compute-overlay:not(.pf-m-open)', { timeout: 5000 }).catch(() => {});

  // 10 — Edit SSH public key
  const sshEdit = page.locator('[data-edit-ssh]').first();
  if (await sshEdit.count()) {
    await sshEdit.click();
    await page.waitForSelector('#ssh-overlay.pf-m-open', { timeout: 5000 });
    await page.waitForTimeout(300);
    await shotEl(page, '#ssh-modal', '10-edit-ssh-modal');
    await page.locator('#ssh-modal-cancel').click();
    await page.waitForSelector('#ssh-overlay:not(.pf-m-open)', { timeout: 5000 }).catch(() => {});
  }

  // 11 — Add network
  await page.locator('#btn-overview-add-net').click();
  await page.waitForSelector('#nic-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotEl(page, '#nic-modal', '11-add-network-modal');
  await page.locator('#nic-modal-close').click();
  await page.waitForSelector('#nic-overlay:not(.pf-m-open)', { timeout: 5000 }).catch(() => {});

  // 12 — Edit network (need ≥2 NICs so Edit is available with a secondary)
  await ensureTwoNics(page, runningVm);
  await page.locator('[data-overview-menu^="nic:"]').first().click();
  await page.waitForTimeout(250);
  await page.locator('.overview-row-menu button, .overview-row-menu [role="menuitem"]').filter({ hasText: 'Edit' }).first().click();
  await page.waitForSelector('#nic-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotEl(page, '#nic-modal', '12-edit-network-modal');
  await page.locator('#nic-modal-close').click();
  await page.waitForSelector('#nic-overlay:not(.pf-m-open)', { timeout: 5000 }).catch(() => {});

  // 13 — Add disk
  await page.locator('#btn-overview-add-disk').click();
  await page.waitForSelector('#disk-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotEl(page, '#disk-modal', '13-add-disk-modal');
  await page.locator('#disk-modal-close').click();
  await page.waitForSelector('#disk-overlay:not(.pf-m-open)', { timeout: 5000 }).catch(() => {});

  // 14 — Edit disk (boot disk Edit is fine)
  await page.locator('[data-overview-menu^="disk:"]').first().click();
  await page.waitForTimeout(250);
  await page.locator('.overview-row-menu button, .overview-row-menu [role="menuitem"]').filter({ hasText: 'Edit' }).first().click();
  await page.waitForSelector('#disk-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(350);
  await shotEl(page, '#disk-modal', '14-edit-disk-modal');
  await page.locator('#disk-modal-close').click();
  await page.waitForSelector('#disk-overlay:not(.pf-m-open)', { timeout: 5000 }).catch(() => {});

  // 15 — Delete network confirmation (secondary NIC)
  await page.locator('[data-overview-menu^="nic:"]').nth(1).click().catch(async () => {
    await page.locator('[data-overview-menu^="nic:"]').last().click();
  });
  await page.waitForTimeout(250);
  const delNet = page.locator('.overview-row-menu button, .overview-row-menu [role="menuitem"]').filter({ hasText: 'Delete' }).first();
  if (await delNet.isEnabled()) {
    await delNet.click();
    await page.waitForSelector('#delete-resource-overlay.pf-m-open', { timeout: 5000 });
    await page.waitForTimeout(300);
    await shotEl(page, '#delete-resource-modal', '15-delete-network-modal');
    await page.locator('#delete-resource-cancel').click();
    await page.waitForSelector('#delete-resource-overlay:not(.pf-m-open)', { timeout: 5000 }).catch(() => {});
  }

  // 16 — Delete Virtual machine confirmation
  await backToVmList(page);
  const stoppedForDelete = await page.evaluate(() => {
    return VMS.find((v) => v.status === 'stopped')?.name || 'windows-golden-eider-58';
  });
  await openVmDetail(page, stoppedForDelete);
  await page.evaluate((name) => {
    if (typeof openDeleteVmModal === 'function') openDeleteVmModal(name);
  }, stoppedForDelete);
  await page.waitForSelector('#delete-vm-overlay.pf-m-open', { timeout: 5000 });
  await page.waitForTimeout(300);
  await shotEl(page, '#delete-vm-modal', '16-delete-vm-modal');

  await browser.close();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
