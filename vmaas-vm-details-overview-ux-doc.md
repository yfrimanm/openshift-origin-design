# Virtual machine details Overview — UX documentation

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Scope of this doc** | Single-VM **details Overview** (day-2) |
| **Companion doc** | [Create Virtual machine — UX documentation](https://docs.google.com/document/d/1LL0iWhIIh3gAhJAsm7MCpnlFxfzaOXkZS_MVI6dSfSo/edit) |
| **Shared interactive mock** | [vmaas-create-vm-only.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-create-vm-only.html) — list → create → details in one mock |
| **Google Doc** | [Virtual machine details Overview — UX documentation](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit) |
| **Screenshots** | `videos/vmaas-vm-details-overview-ux-doc/` |
| **Entry** | List **Name** link, or after Create finishes |

---

## Goal

Document OSAC VMaaS **Virtual machine details Overview**: CNV-inspired card layout with VMaaS terminology (Network, Storage tier, Virtual machine), without a separate Configuration nav in this mock.

---

## UX summary

| Decision | Detail |
|---|---|
| **Tabs** | Overview only in this mock (other detail tabs hidden). |
| **Breadcrumb** | Virtual machines › **{VM name}** |
| **Status** | In header and Details card — clickable → popover. **Ask AI about this status** is a placeholder until AI ships. |
| **Power icons** | Stop / Restart / Pause / Start — disabled states show **Virtual machine** tooltips (same reasons as Actions menu). |
| **Actions** | Control ▸, Open console, Delete — disabled copy uses **Virtual machine** / **Virtual machines**. |
| **Operating system** | Show OS from create/template metadata when known. If unknown: **—** + *Guest agent not reporting*. |
| **SSH** | *Configured* + pencil, or ***Not configured*** as a link (+ pencil) → edit modal. Windows: *Not applicable*. |
| **Compute** | **Compute resource** + edit pencil. |
| **Network / Storage** | Card **Add** + row kebab **Edit** / **Delete**. Delete disabled in-menu with reason (last network / boot disk). Terminology: **Network**. |
| **Utilization** | Metrics only when status is **Running**. Otherwise: *Virtual machine is not running*. Time range shown as static “Last 5 minutes”. |
| **After create** | Lands on this Overview with success toast. |
| **Shell chrome** | Same shared mock as Create: PatternFly **Felt + Glass** (PF 6.6.1), aligned to Ethan’s [osac-bmaas](https://heyethankim.github.io/osac-bmaas/) — soft floating sidebar/main panels. |

---

## Layout

| Column | Cards (top → bottom) |
|---|---|
| **Main (left)** | Details (incl. VNC) · Utilization |
| **Side (right)** | Alerts · Network · Storage |
| **Full width (bottom)** | Hardware devices · File systems |

![Figure: Overview — running](videos/vmaas-vm-details-overview-ux-doc/01-overview-running.png)

Figure: Overview — running

---

## Details card

| Field | Notes |
|---|---|
| **Project** | Display |
| **Status** | Link → popover (Ask AI placeholder + Learn more) |
| **Created** | Timestamp |
| **Operating system** | Metadata OS, or soft empty (*Guest agent not reporting*) |
| **Compute resource** | Summary + edit |
| **SSH public key** | Configured / Not configured (link) + pencil |
| **VNC console** | Open web console + preview. New tab is a placeholder with a **Serial console** / **VNC console** dropdown (CNV parity; our PF shell styling). |

Name lives in the page header (not duplicated in the DL), with arch badge (**amd64**).

![Figure: Status popover](videos/vmaas-vm-details-overview-ux-doc/02-status-popover.png)

Figure: Status popover

![Figure: SSH Not configured](videos/vmaas-vm-details-overview-ux-doc/06-ssh-not-configured.png)

Figure: SSH Not configured

---

## Network card

- Title: **Network (n)** + **Add network**
- Table: **Name** | **IP address** | actions
- Name opens network detail popover
- Row kebab: **Edit** (opens Add network modal in edit mode) · **Delete**
- Last network: Delete disabled — *At least one network is required.*
- Success toasts: *Network “…” added / updated / Deleted network …*

![Figure: Network row actions](videos/vmaas-vm-details-overview-ux-doc/03-network-kebab.png)

Figure: Network row actions

---

## Storage card

- Title: **Storage (n)** + **Add disk**
- Table: **Name** | **Size** | **Storage tier** | actions
- Bootable badge on boot disk
- Row kebab: **Edit** · **Delete**
- Boot disk: Delete disabled — *The boot disk cannot be deleted.*

![Figure: Boot disk Delete disabled](videos/vmaas-vm-details-overview-ux-doc/04-storage-boot-delete.png)

Figure: Boot disk Delete disabled

---

## Utilization card

- When **Running**: CPU · Memory · Storage · Network transfer tiles
- When not running: centered empty state — *Virtual machine is not running*
- Help icon on title; time range is non-interactive in the mock

![Figure: Utilization when not running](videos/vmaas-vm-details-overview-ux-doc/05-utilization-not-running.png)

Figure: Utilization when not running

---

## Alerts / Hardware / File systems

- **Alerts** — count + list when present (Diagnostics deep-link not wired)
- **Hardware devices** — GPU / Host tabs; empty states
- **File systems** — guest FS table + help

---

## Header power + Actions

| Control | Enabled when |
|---|---|
| **Stop** | Running or Paused |
| **Restart** | Running |
| **Pause** | Running |
| **Start** | Not running and not starting |
| **Actions** | Control ▸ · Open console · Delete |

Disabled icon tooltips match Actions menu reasons (*The Virtual machine is starting / not running / running*).

![Figure: Error status](videos/vmaas-vm-details-overview-ux-doc/07-error-status.png)

Figure: Error status

---

## Out of scope in this mock

- Configuration vertical nav (removed for VMaaS Overview-first)
- Full Metrics / YAML / Events / Snapshots / Diagnostics tabs
- Wired AI assistant (Status popover CTA is a placeholder)

---

## Related

- **Create UX doc** — list + wizard handoff
- **Mock (shared):** https://yfrimanm.github.io/openshift-origin-design/vmaas-create-vm-only.html
