# OSAC-5009 — Create Windows VMs with Unattend.xml / Sysprep (UX handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-5009](https://redhat.atlassian.net/browse/OSAC-5009) — *UX Design - Create Windows VMs with a caller-supplied Unattend.xml* |
| **Parent epic** | [OSAC-5687](https://redhat.atlassian.net/browse/OSAC-5687) — *UIX - Create Windows VMs* |
| **Feature** | [OSAC-4705](https://redhat.atlassian.net/browse/OSAC-4705) — *Create Windows VMs with a caller-supplied Unattend.xml* |
| **Eng stories** | [HPUX-2253](https://redhat.atlassian.net/browse/HPUX-2253) / [HPUX-2254](https://redhat.atlassian.net/browse/HPUX-2254) — *Create Windows VM with Sysprep* |
| **Scope of this handoff** | Create VM wizard → **Access & Initial run** for Windows (Sysprep Unattend.xml: Attach existing / Create new) |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7161-sysprep) |
| **Handoff Google Doc** | [OSAC-5009 — Create Windows VMs with Unattend.xml / Sysprep (UX handoff)](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit) |
| **Shared UX tab (pointer)** | [Windows Sysprep Create](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.ty4w66xwh2mw) |
| **Status** | Fully covered for Create VM Windows Access & Initial run. Catalog Provide-default Unattend deferred; SSH hidden for Windows; day-2 Sysprep edit out of scope. |

---

## Goal

Let tenants supply an optional Windows **Unattend.xml** at VM create time for first-boot Sysprep customization. Content is write-only (stored as a secret; never returned on GET). Linux path on the same step stays SSH + Cloud-init; Windows never shows SSH.

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7161-sysprep) as **Tenant Admin**.
2. **Create virtual machine** → on **Details**, choose Guest OS **Microsoft Windows**.
3. Continue to **Access & Initial run** (Optional).
4. Confirm **no SSH public key** field; Sysprep section with **Windows only** badge.
5. **Create new Sysprep** — upload/paste Unattend.xml; optional **Save as secret**; leave empty to boot without an answer file.
6. **Attach existing Sysprep** — pick a saved secret (demo: `corp-windows-unattend`, `skip-oobe-unattend` in project-a).
7. **Review** → Access & Initial run shows method + **Provided (hidden)** (or secret name for Attach); never echoes XML body.
8. Contrast: set Guest OS to **Linux** → SSH + Cloud-init; no Sysprep cards.

---

## Access & Initial run — Windows

- Step badge: **Optional**
- Help: *Configure first-boot customization for this Windows virtual machine.*
- **Sysprep** + **Windows only** badge
- Helper: *Supply an Unattend.xml for first-boot customization, or leave unset to boot without one.*
- Mode selection uses **felt cards** (same pattern as Guest OS):
  - **Attach existing Sysprep** — saved Unattend.xml secret (write-only; contents never shown)
  - **Create new Sysprep** — upload or paste Unattend.xml; optional **Save as secret for future VM deployments**
- Unattend optional at create; max **1 MiB**; stored as a secret and never shown again after create.

---

## Coverage

| Spec item | Status | Notes |
|---|---|---|
| Windows-only Unattend / Sysprep UI | **Covered** | Driven by Guest OS / `isWindowsOs` |
| Optional — omit to boot without answer file | **Covered** | Step badge Optional; empty Unattend allowed |
| Write-only secret; Review = Provided (hidden) | **Covered** | Attach shows secret name |
| Create-time only (no day-2 update) | **Covered** | No Edit Sysprep on Overview in this scope |
| SSH hidden for Windows | **Covered** | Field omitted; key cleared when Windows |
| Felt mode cards: Attach / Create new | **Covered** | Same pattern as Guest OS |
| Create: upload or paste Unattend.xml | **Covered** | PF file-upload + textarea |
| Max 1 MiB client check | **Covered** | Toast if over size |
| Soft well-formed XML check (`unattend` root) | **Covered** | Soft; server remains SoT |
| Save as secret for future Attach | **Covered** | Checkbox + optional secret name |
| Attach: project-scoped secret typeahead | **Covered** | Empty-state helper when none |
| Linux path unchanged (SSH + Cloud-init) | **Covered** | Same wizard step |
| No new routes / nav | **Covered** | Existing Create VM wizard only |

**Verdict:** Fully covered for OSAC-5009 Create VM Windows Sysprep.

---

## Out of scope

| Topic | Notes |
|---|---|
| Catalog **Provide default** Unattend | Separate surface (Create catalog item → Access); deferred |
| Day-2 edit / replace Sysprep after create | Explicitly out (“Create-time only”) |
| API / CEL / `unattend_xml` wiring | Eng ([HPUX-2253](https://redhat.atlassian.net/browse/HPUX-2253) / [HPUX-2254](https://redhat.atlassian.net/browse/HPUX-2254)) |

---

## Design constraints (ticket → mock)

| Constraint | Mock decision |
|---|---|
| Max size 1 MiB | Enforced client-side with toast |
| Windows detection | Guest OS family / disk image → Windows |
| SSH for Windows | **Hidden** entirely (not optional) |
| Catalog `StringFieldPolicy` for `unattend_xml` | Eng decision; UX assumes optional create-time field |

---

## Decisions (confirmed)

1. **Scope:** Create VM **Access & Initial run** (Windows Sysprep) only — not Catalog Provide-default Unattend.
2. **SSH for Windows:** Remains **hidden**.
3. **Follow-ups:** No Catalog default Unattend UX tickets for now.

---

## Related

- Feature: [OSAC-4705](https://redhat.atlassian.net/browse/OSAC-4705)
- Epic: [OSAC-5687](https://redhat.atlassian.net/browse/OSAC-5687)
- Prototype build: **7161**
- Screenshots: `videos/osac-5009-windows-sysprep-handoff/` · [gh-pages/screenshots/osac-5009](https://github.com/yfrimanm/openshift-origin-design/tree/gh-pages/screenshots/osac-5009)

---

## Screenshots (inline in Doc)

| Figure | File |
|---|---|
| Details — Guest OS (Windows) | `05-details.png` |
| Access — Create new Sysprep | `09d-access-windows-sysprep.png` |
| Access — Attach existing Sysprep | `09e-access-windows-attach.png` |
| Access — Linux contrast | `09c-access-linux.png` |
| Review — Access & Initial run | `10-review.png` |
