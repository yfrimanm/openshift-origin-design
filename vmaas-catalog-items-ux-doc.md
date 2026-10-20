# Catalog items

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Parent epic** | [OSAC-5631](https://redhat.atlassian.net/browse/OSAC-5631) — *UIX - Full Catalog Items* |
| **Related** | [OSAC-3539](https://redhat.atlassian.net/browse/OSAC-3539) — *Catalog Items v2 - Field Governance Redesign* (Closed) |
| **Scope of this handoff** | Cloud provider admin **Catalog** UX in the shared mock: list · create wizard · detail · edit · delete (aligned to Catalog + Create catalog item tabs). |
| **Role** | Cloud provider admin — Catalog (no tenant **Services** nav) |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7134&role=provider) |
| **Handoff Google Doc** | [Catalog items](https://docs.google.com/document/d/1YTm2X4nUXWVI_Mjq_hXEY4Rj6i9BaOiXjzVeF3jcMA4/edit) |
| **Shared UX tabs (pointers)** | [Catalog](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.plwyvg94k7ml) · [Create catalog item](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.guwke1kyefc0) |
| **MD handoff** | [vmaas-catalog-items-ux-doc.md](https://github.com/yfrimanm/openshift-origin-design/blob/vmaas-create-vm-wizard/vmaas-catalog-items-ux-doc.md) |
| **Screenshots** | `screenshots/catalog-create/` · [gh-pages/screenshots/catalog-create](https://github.com/yfrimanm/openshift-origin-design/tree/gh-pages/screenshots/catalog-create) |
| **Status** | Documented from mock build **catalog-init 7134**. |

**IA (create):** Details → Instance types → Visibility → Storage → Access & Initial run → Review

---

## Goal

Enable Cloud Provider Admins to publish **Catalog items** tenants order as VMs: set identity, optional defaults (disk image, instance type, storage, user data), visibility (Global public / Tenant scoped), and Editable / Locked governance so tenants can or cannot change values at VM create time.

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7134&role=provider) as **Cloud provider admin** (default landing: Catalog).
2. Confirm provider nav has **Catalog** and omits **Services**.
3. **Create catalog item** → walk all steps → Review → create.
4. Open a catalog item detail → Hardware specifications · Launch instance · Actions.
5. **Actions → Edit** → Review empty vs before/after · **Actions → Delete**.

---

## Catalog — list

| Column / card | Notes |
|---|---|
| Name | Link → detail |
| Status | Live / Unpublished |
| Visibility | Global public / Tenant scoped |
| Instance type · Disk image · Rate | Card view shows specs + rate |

Primary CTA: **Create catalog item**.

---

## Create catalog item wizard

Editable / Locked switches on default fields control whether tenants can change the value at VM create time.

### Step 1 — Details

- Help: *Set the catalog item identity and optionally a default disk image for tenants.*
- **Name** (required, DNS-style) + generate
- **Description** (optional)
- **Disk image** — typeahead rich-select; **Not set** lets tenants choose at VM create. Guest OS is derived from the selected disk image.
- Editable / Locked on Disk image

### Step 2 — Instance types

- Help: *Optionally set instance type defaults… Leave fields Not set if tenants should choose…*
- **Instance type** typeahead (Not set) + Editable / Locked
- **Run strategy** (when present) + Editable / Locked

### Step 3 — Visibility

- Felt cards:
  - **Global public** — available to all tenants when published
  - **Tenant scoped** — visible only to selected tenants (required multi-select typeahead)

### Step 4 — Storage

- Boot / additional disk defaults (size, storage tier) with Editable / Locked where applicable

### Step 5 — Access & Initial run (optional)

- Linux help: *Choose whether this catalog item seeds default cloud-init user data. SSH keys are set when creating a virtual machine.*
- Windows help: *Choose whether this catalog item seeds a default Unattend.xml… Tenants can still Attach or Create Sysprep when creating a VM.*
- Felt cards: **No default** · **Provide default** (textarea + Editable / Locked)
- SSH is never set on the catalog item
- Review summarizes User data default as No default / Provide default

### Step 6 — Review

- Nebius-style grouped review with edit links
- Primary CTA: **Create catalog item** (or **Save changes** when editing)

---

## Catalog item — details

| Section | Fields |
|---|---|
| Overview | Service · Status (Live / Unpublished) · Rate |
| Publishing | Visibility · Created |
| Hardware specifications | Size (+ Locked) · CPU · RAM · GPU · Disk image (+ Locked) |

Header actions: **Launch instance** · **Actions** (Edit / Duplicate / Publish or Unpublish / Delete).

### Edit — Review

| Review state | Behavior |
|---|---|
| No changes | Helper “No changes yet…” · Save changes disabled · info alert |
| With changes | Before → after rows · Save changes enabled |

### Delete

**Actions → Delete** — danger confirmation naming the catalog item.

---

## Screenshots

| # | File | Caption |
|---|---|---|
| 1 | `00-tenant-admin-nav.png` | Tenant Admin — Services present |
| 2 | `01-catalog-list.png` | Catalog list (provider) |
| 3 | `02-details.png` | Create — Details |
| 4 | `03-instance-types.png` | Create — Instance types |
| 5 | `04-visibility-global.png` | Visibility — Global public |
| 6 | `04b-visibility-tenant.png` | Visibility — Tenant scoped |
| 7 | `05-storage.png` | Storage |
| 8 | `06-access-init.png` | Access — No default |
| 9 | `06b-access-provide-default.png` | Access — Provide default |
| 10 | `07-review.png` | Review |

Also: detail / hardware specs / edit review / delete under `screenshots/prototype/17–22`.

---

## Related

- Create Windows Sysprep (tenant Access): [Create Windows VM with sysprep](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit)
- Disk images (provider): [Disk images](https://docs.google.com/document/d/1tKrg2Wb2bmD6ny6Iqw87ysnMRwHjj6XmDttc-rv05a4/edit)
- Prototype build: **7134** (catalog-init)
