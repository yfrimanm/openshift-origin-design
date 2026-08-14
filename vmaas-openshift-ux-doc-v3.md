# VMaaS for OpenShift — UX alignment with CNV (v3)

Working copy for ongoing UX iteration. Branched from v2 so further changes do not override frozen v1 (`vmaas-openshift-ux-doc.md`, `vmaas-openshift-ux-mockup.html`) or the v2 snapshot (`vmaas-openshift-ux-doc-v2.md`, `vmaas-openshift-ux-mockup-v2.html`).

**Prototype under active edit:** `osac-vmaas/` — fork of [osac-bmaas](https://heyethankim.github.io/osac-bmaas/) with the VMaaS HTML mockup integrated.

- Landing: `http://127.0.0.1:5184/`
- In shell: Tenant User → Services → **Virtual machines** (`?nav=services-virtual-machines`)
- Standalone: `http://127.0.0.1:5184/vmaas` → `public/vmaas-prototype.html` (from `vmaas-openshift-ux-mockup-v2.html`)

---

## Goal

Continue aligning **OSAC VMaaS** single-VM details with **OpenShift Virtualization (CNV)** Overview patterns: smaller domain cards, clear Network / Storage summaries, and per-VM Utilization—without overloading one large “everything” card.

---

## VM Overview tab — card split

VM Overview is split into smaller cards that each own a specific domain:

| Card | Role |
|---|---|
| **Details** | Identity + compute summary, with **VNC console** preview in the same card |
| **Utilization** | Live resource usage for this VM |
| **Alerts** | Alert count / empty state |
| **Network** | NIC summary + **Add network** |
| **Storage** | Disk summary + **Add disk** |
| **Hardware devices** | GPU / Host devices tabs |
| **File systems** | Guest file system table |

### Layout (CNV-aligned — current mock)

| Column | Cards (top → bottom) |
|---|---|
| **Main (left)** | Details (incl. VNC) · Utilization |
| **Side (right)** | Alerts · Network · Storage |
| **Full width (bottom)** | Hardware devices · File systems |

### Details

- Fields: **Name** (+ amd64 badge) · **Project** · **Status** · **Created** · **Operating system** (or *Guest agent is required.*) · **Compute resources** (with edit pencil).
- **VNC console** lives in the Details card (Open web console + preview), not a separate side card.

### Network (n) / Storage (n)

- **Add network** / **Add disk** in the card header.
- Network table: **Name** | **IP address** only.
- Storage table: **Name** | **Size** only (Boot disk / Disk 1 / … as links).

### Utilization

- Header: **Utilization** + help · time range **Last 5 minutes**.
- Four columns: **CPU** · **Memory** · **Storage** · **Network transfer**.
- Storage may show **No data available** when metrics are missing.

### VM detail header actions (CNV)

On the sticky detail heading, to the **right of the VM name** (same row as the title + status badge):

| Control | Behavior |
|---|---|
| **Stop** | PF6 brand-blue icon + tooltip — enabled when Running or Paused |
| **Restart** | PF6 brand-blue **RedoAlt** (single clockwise arrow) + tooltip — enabled when Running or Paused |
| **Pause** | PF6 brand-blue icon + tooltip — enabled when Running |
| **Start** | Icon + tooltip — enabled when Stopped; disabled (muted) when Running |
| **Actions** | Secondary toggle — flyout menu (see below) |

Power state badge sits next to the VM name on the left of that row. Arch badge (amd64) sits next to the name.

**Actions menu (CNV-aligned):**

| Item | Notes |
|---|---|
| **Control** ▸ | Flyout: Stop · Pause · Restart · Reset |
| **Open Console** | Disabled unless Running |
| **Clone** | Opens clone flow |
| **Take snapshot** | Demo |
| **Migration** ▸ | Flyout: Migrate · Cancel migration |
| **Move to group** | Demo |
| **Edit labels** | Demo |
| **Delete** | Disabled while Running |

### Out of Overview (not shown in this mock)

- Separate Console side card, General, Snapshots, Services, Active users.
- Full NIC / disk management remains under **Configuration**.

---

## Changelog (v3 working notes)

| Date | Change |
|---|---|
| 2026-07-27 | Overview: split into Details, Network (2), Storage (2), Utilization, Console cards; remove Network/Storage from Details DL |
| 2026-07-27 | Move VM actions off Console kebab to detail header: Stop / Restart / Pause / Start icons + Actions dropdown (right of VM name) |
| 2026-07-27 | Header icons: PF6 brand blue + tooltips; Restart = RedoAlt; Actions adds Control / Migration flyouts and CNV menu items |
| 2026-08-04 | Fork osac-bmaas → `osac-vmaas`; embed VMaaS HTML mockup under Services → Virtual machines + `/vmaas` standalone |
| 2026-08-14 | Overview aligned to CNV details mock: Details+VNC, Utilization; side Alerts/Network(+Add)/Storage(+Add); bottom Hardware + File systems; drop General/Snapshots/Services/Active users |

---

## Create VM wizard — catalog-first (simplified)

Default **Create** opens a shorter flow (no “creation method” cards on step 1):

| # | Nav label | Content |
|---|---|---|
| 1 | **Catalog** | Same catalog/template browser as CNV Templates (filters, search, card/list, details drawer). Title: **Catalog** — “Select a catalog item to create your Virtual machine from.” Next disabled until an item is selected. |
| 2 | **Details** | General info (Name*, description) · Location (project / group) · **SSH public key** (textarea + supported key types helper) |
| 3 | **Configuration** | Existing configure tabs (storage, network, SSH, …) |
| 4 | **Review and create** | Review + start-after-create |

Prototype file: `osac-vmaas/public/vmaas-prototype.html`
