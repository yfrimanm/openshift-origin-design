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
| **Details** | Identity and compute summary for the VM |
| **Network** | NIC summary + Internal FQDN |
| **Storage** | Disk summary |
| **Utilization** | Live resource usage for this VM |
| **Console** | Guest console preview + power state (no kebab actions) |

### Layout (CNV-aligned)

| Column | Cards (top → bottom) |
|---|---|
| **Main (left)** | Details · Utilization |
| **Side (right)** | Console · Network · Storage |

Card chrome matches the **Details** style: bordered surface, title in the header (Network / Storage titles as blue links), divider under the header, compact body content.

### Changes

**Details**

- Network and Storage rows removed from the Details description list (those domains live in their own cards).
- Titled **Details** card with the remaining fields (e.g. Name, Description, Operating system, CPU, Memory, Hub).

**Network (2)**

- Dedicated card outside Details.
- Title count reflects NIC count: **Network (2)**.
- Table: **Name** | **IP address** — one row per network (two demo NICs).
- **Internal FQDN** below the table (separated by a divider), value in a secondary surface with copy-to-clipboard.

**Storage (2)**

- Dedicated card outside Details.
- Title count reflects disk count: **Storage (2)**.
- Table: **Name** | **Size** only (no Drive / Interface columns on Overview).
- Demo disks: `rootdisk` (VM storage size) · `cloudinitdisk` (`Dynamic`).

**Utilization**

- Dedicated card for this VM (not fleet dashboard charts).
- Header: **Utilization** + help affordance · time range **Last 5 minutes**.
- Four columns: **CPU** · **Memory** · **Storage** · **Network transfer**.
- CPU / Memory / Storage: absolute value + “of” capacity · thin donut (% Used) · sparkline.
- Network transfer: **no pie** — Total / In / Out · **Breakdown by network** link · sparkline.
- Demo values are stable per VM name so different VMs show different utilization.

**Console**

- Side card: preview + power label / pending only.
- Kebab / VM actions are **not** on the Console card (moved to the page header).

### VM detail header actions (CNV)

On the sticky detail heading, to the **right of the VM name** (same row as the title + status badge):

| Control | Behavior |
|---|---|
| **Stop** | PF6 brand-blue icon + tooltip — enabled when Running or Paused |
| **Restart** | PF6 brand-blue **RedoAlt** (single clockwise arrow) + tooltip — enabled when Running or Paused |
| **Pause** | PF6 brand-blue icon + tooltip — enabled when Running |
| **Start** | Icon + tooltip — enabled when Stopped; disabled (muted) when Running |
| **Actions** | Secondary toggle — flyout menu (see below) |

Power state badge (or pending spinner + label) sits next to the VM name on the left of that row.

**Actions menu (CNV-aligned):**

| Item | Notes |
|---|---|
| **Control** ▸ | Flyout: Stop · Pause · Restart (“Shut down and reboot the VM”) · Reset (“Hard power cycle on the VM”) |
| **Open Console** | Description: “Open console in new tab” — disabled unless Running |
| **Clone** | Opens clone flow |
| **Take snapshot** | Demo |
| **Migration** ▸ | Flyout: Migrate · Cancel migration |
| **Move to group** | Demo |
| **Edit labels** | Demo |
| **Delete** | Disabled while Running — description “The Virtual machine is running” |

### Out of scope for this Overview pass

- Full NIC attach / edit remains under **Configuration → Network** (Overview Network is summary only).
- Full disk management remains under Configuration / Storage flows (Overview Storage is summary only).
- Alerts / General / Snapshots / Hardware devices / File systems / Services / Active users side or bottom cards are not part of this v3 pass unless added later.

---

## Changelog (v3 working notes)

| Date | Change |
|---|---|
| 2026-07-27 | Overview: split into Details, Network (2), Storage (2), Utilization, Console cards; remove Network/Storage from Details DL |
| 2026-07-27 | Move VM actions off Console kebab to detail header: Stop / Restart / Pause / Start icons + Actions dropdown (right of VM name) |
| 2026-07-27 | Header icons: PF6 brand blue + tooltips; Restart = RedoAlt; Actions adds Control / Migration flyouts and CNV menu items |
| 2026-08-04 | Fork osac-bmaas → `osac-vmaas`; embed VMaaS HTML mockup under Services → Virtual machines + `/vmaas` standalone |
| 2026-08-04 | Create VM wizard simplified: **1. Catalog** (select a catalog item) → Details → Customization → Review |

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
