# Create Virtual machine — UX documentation

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Scope of this doc** | Virtual machines **list** + **Create** wizard |
| **Companion doc** | [Virtual machine details Overview — UX documentation](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit) |
| **Shared interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html) — one mock covers list → create → details |
| **Google Doc (this doc)** | [Create Virtual machine - UX documentation](https://docs.google.com/document/d/1LL0iWhIIh3gAhJAsm7MCpnlFxfzaOXkZS_MVI6dSfSo/edit) |
| **Screenshots** | `videos/vmaas-create-vm-only-ux-doc/` · [GitHub](https://github.com/yfrimanm/openshift-origin-design/tree/gh-pages/screenshots/create) |
| **Regenerate screenshots** | `node scripts/capture-vmaas-create-vm-only-screenshots.mjs` |

**IA:** Select template → Details → Instance type → Storage → Network → Access & Initial run → Review and create

---

## Goal

Document the Create Virtual machine flow for OSAC VMaaS (catalog / template–first). List and create share one mock with VM details Overview; this doc covers **create only**.

---

## UX summary

| Decision | Detail |
|---|---|
| **Scope** | List + Create wizard. VM **Name** links open details Overview (see companion doc). |
| **IA** | Flat wizard steps — Select template → Details → Instance type → Storage → Network → **Access & Initial run** → Review and create. |
| **Primary CTA** | **Create Virtual machine** |
| **Role labels** | **Tenant Admin**, **Tenant User** (OSAC personas). Demo switcher only — gates Create / power / networks / Overview config edit. |
| **Tenant Admin** | Create VM, power, **edit** config, create/view networks (incl. Shared / Provider — same network create as prior author/orgadmin). Default for Create demos. |
| **Tenant User** | No Create; power/console on VMs; view networks; **read-only** Overview config (no edit / Add / Delete on compute, SSH, network, disk). |
| **Search** | Compact filter-row search (Ethan/OSAC): matches **name / IP / OS / project**. No CNV Save search / Saved searches. |
| **List filters** | `Project: All projects` (folder) · `All power states` · `All operating systems` · `Hardware devices` (GPU / Host) · search. Multi-select menus kept. |
| **Row kebab / Actions** | Control ▸, Open console, Delete. Disabled reasons use **Virtual machine** wording. |
| **Status** | Status is a link → PF6 popover (title, body, **Ask AI about this status** placeholder, Learn more). |
| **Details** | Name, description, **Guest OS cards** (Linux / Microsoft Windows / Unspecified) + disk image typeahead. Project is context-only (chosen on Select template). |
| **Access & Initial run** | Optional. **Linux:** SSH public key + Cloud-init. **Windows:** Sysprep (Unattend.xml) via **Attach existing** / **Create new** felt cards (OSAC-5009). No SSH on Windows. |
| **Locked vs Editable** | Template governance: lock / pen. Prefer **Locked** / **Editable**. |
| **Project** | On Select template only — filters available templates and sets where the VM is created. Users see projects they can access. Not on Details. |
| **Exit confirm** | Exit without saving / Continue creating. |
| **After create** | Opens the new VM details Overview + success toast (`created` or `created and starting` → Running). |
| **Start after create** | Review checkbox **Start this Virtual machine after creation** — checked by default (CNV parity). |
| **Shell chrome** | PatternFly **Felt + Glass** (PF 6.6.1), aligned to Ethan’s [osac-bmaas](https://heyethankim.github.io/osac-bmaas/) — soft floating sidebar/main panels, Felt current nav accent (no hard nav divider). |
| **Additional disk / network** | Wizard uses **inline** Add / Remove sets (Disk set N / Network set N). Overview cards still use **Add** modals. |
| **Form width** | Create wizard fields, cards, uploads, and helpers share one **40rem** column (no zigzag). |

---

## Entry — Virtual machines list

- Primary **Create Virtual machine** opens the wizard.
- **Name** column opens VM details Overview.
- Filter row (OSAC / Ethan): **Project: All projects** · **All power states** · **All operating systems** · **Hardware devices** · **Search virtual machines**.
- Search matches name / IP / OS / project. No Save search / Saved searches.
- Toolbar **Actions** disabled until selection; matches row kebab when enabled.

Figure: Virtual machines list

### Row kebab / Actions menu

- **Control** flyout: Start / Stop / Pause / Restart / Reset (state-dependent)
- **Open console** — disabled when not running (*The Virtual machine is not running*)
- **Delete** — disabled while running (*The Virtual machine is running*)

Figure: Row Actions kebab

---

## Step 1 — Select template

Toolbar: **Project** · **Search** · list/card view.

- **Project** defines which templates are available and where the new VM will be created (users only see projects they can access).
- Helper: *Choose a project to see the templates available to you there. The Virtual machine will be created in that project. Then select a template to review details and click Next.*
- **Empty state** (`yifat` / `vmaas` in the mock): *No Templates found in this project. Select a different project, or ask an administrator to add templates.*

Selecting a template opens a drawer (**Template settings**):

- **Locked by this template** — OS image always; compute / boot disk when locked
- **Editable later** — fields the user can change on later steps

Figure: Select template

Figure: Select template — no templates in project

**Dev notes**

- Per-field governance: `compute` / `bootDisk` = `locked` \| `editable`; image always locked.
- Card cost may prefix hourly with **From** when size is editable.
- Templates are filtered by `template.project === selected project`.

Figure: Template drawer — locked

Figure: Template drawer — editable

---

## Step 2 — Details

- Help: *Name your virtual machine and choose a disk image.*
- Context note (not a dropdown): *Your virtual machine will be created in project: **{project}***
- **Name** (required) + generate
- **Description** (optional)
- Project is chosen on Select template (not editable here)
- **Disk image**
  - **Guest operating system** — 3 felt cards: Linux / Microsoft Windows / Unspecified (same card pattern as Sysprep mode)
  - **Image reference** — required typeahead rich-select filtered by guest OS

Figure: Details

---

## Step 3 — Instance type

- Instance type locked or editable per template
- Helper when locked: size is set by the template; can edit after create
- OS image and Access are not on this step

Figure: Instance type

---

## Step 4 — Storage

- Boot disk size (locked or editable) + **Storage tier** (locked or editable with size — same control as additional disks when editable) + PF helper text
- **Additional disks** — inline **Add disk** (PF link + PlusCircle; dashed underline on the label only). Empty: no sets yet.
- Each added disk is a **Disk set N** with Size, Storage tier (helpers), and **Remove** (danger link + MinusCircle)
- Matches Ethan’s OSAC config-sets pattern (no Add disk modal on this step). Overview **Add disk** still uses a modal.

Figure: Storage

Figure: Additional disk set (inline Add / Remove)

---

## Step 5 — Network

- Virtual network, subnet, security groups (required)
- **Additional networks** — inline **Add network** (same link pattern as Storage). Empty: no sets yet.
- Each added network is a **Network set N** with Virtual network / Subnet / Security groups + **Remove**
- Terminology: **Network** (not “network interface”)
- Overview **Add network** still uses a modal.

Figure: Network

Figure: Additional network set (inline Add / Remove)

---

## Step 6 — Access & Initial run (optional)

Guest OS from Details drives the content of this step.

### Linux (and Unspecified)

- **SSH public key** — PF file upload (paste or browse). Optional.
- **Cloud-init** — optional user data textarea.

Figure: Access & Initial run — Linux (SSH + Cloud-init)

### Microsoft Windows (OSAC-5009)

- No SSH.
- **Sysprep** (Windows only) — helper: *Supply an Unattend.xml for first-boot customization, or leave unset to boot without one.*
- Mode selection uses **felt cards** (same pattern as Guest OS):
  - **Attach existing Sysprep** — pick a saved Unattend.xml secret (write-only; contents never shown)
  - **Create new Sysprep** — upload / paste Unattend.xml; optional **Save as secret for future VM deployments**
- Unattend is optional at create time.

Figure: Access & Initial run — Windows Sysprep cards (Create new)

Figure: Access & Initial run — Windows Sysprep (Attach existing)

---

## Step 7 — Review and create

Grouped review: Details / Instance type / Storage / Network / **Access & Initial run** with edit links. Cost panel. *Start this Virtual machine after creation* — **checked by default** (CNV parity).

- Access: method-specific summary (SSH / Cloud-init / Sysprep attach or create) or *Not configured*
- Additional disks / networks listed or *None*
- Create success: toast reflects Stopped vs starting → Running

Figure: Review and create

---

## Exit confirmation

| Element | Copy |
|---|---|
| Title | Exit Virtual machine creation? |
| Body | If you leave now, any information you’ve entered won’t be saved. |
| Primary | Exit without saving |
| Secondary | Continue creating |

Figure: Exit confirmation

---

## Related

- **Details / Overview UX doc** — day-2 Overview cards, Network/Storage Add·Edit·Delete, Utilization empty state, SSH, Status → AI placeholder
- **Mock (shared):** https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html
- **OSAC-5009** — Windows Unattend.xml / Sysprep at create (Access & Initial run)

---

## Appendix — Personas: can vs cannot

- **Tenant Admin** — create and manage VMs and networks (edit config).
- **Tenant User** — use VMs they can access (power + console); view only for config and networks.

| | Tenant Admin | Tenant User |
|---|---|---|
| **Create Virtual machine** | Can | Can not |
| **Power** (Start / Stop / Pause / Restart) | Can | Can |
| **Open console** | Can | Can |
| **Delete Virtual machine** | Can | Can not |
| **Edit Overview config** (instance type, SSH, network, disk) | Can | Can not (view only) |
| **Create / manage networks** | Can | Can not (view) |
