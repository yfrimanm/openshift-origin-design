# Create VirtualMachine — UX documentation

## Goal

Document the **Create VirtualMachine** wizard for OSAC VMaaS so developers can implement the flow with clear step boundaries, locked vs editable template fields, and PatternFly patterns.

### Option comparison

| | **Option 1** (flat) | **Option 2** (details-page aligned) |
|---|---|---|
| Steps | Select template → Details → Configure → Storage → Network → Review | Select template → Details (+ Access) → Configure (Compute / Storage / Network) → Review |
| Mock | `vmaas-create-wizard-option-1.html` | `vmaas-create-wizard-option-2.html` (embedded in tenant shell) |

**Preferred baseline (stakeholder feedback):** Option 1 flat flow. Option 2 remains an alternate IA reference.

**Option 1 wizard steps:** Select template → Details → Configure (compute + Access) → Storage → Network → Review and create  
**Option 2 wizard steps:** Select template → Details (Access) → Configure → Review and create

*Interactive mockup (Option 1):* `vmaas-create-wizard-option-1.html`  
*Option 2 (alternate):* `vmaas-create-wizard-option-2.html` (also embedded in the tenant shell: Services → Virtual machines)  
*Google Doc:* [Create VirtualMachine — UX documentation](https://docs.google.com/document/d/1o97lTRGKAOPdNQz_zH7KbUOxAchPnJYsjlGye9W_tNs/edit)  
*Screenshots:* `videos/vmaas-create-ux-doc/` (Option 1 capture)  
*Regenerate screenshots:* `node scripts/capture-vmaas-create-screenshots.mjs`

---

## UX summary

| Decision | Detail |
|---|---|
| **Wizard left nav** | Keep the PatternFly wizard step nav on the left in **both** Option 1 and Option 2. Do not replace with a nav-less / single-page form or header-only stepper for stakeholder or product mocks. |
| **Option 1 preferred IA** | Flat steps: Select template → Details → Configure → Storage → Network → Review. Access stays on Configure. |
| **Option 2 IA** | Details holds identity + optional Access. Configure groups Compute resource, Storage, and Network as substeps (aligns with VM details). |
| **Storage under Configure** | Boot disk + additional disks on Configure → Storage. |
| **Network under Configure** | Virtual network, subnet, and security groups on Configure → Network. |
| **Compute under Configure** | OS image always locked; compute locked or editable on Configure → Compute resource. |
| **Locked vs Editable** | **Locked** uses a lock icon; **Editable** uses a pen icon. Drawer panels: “Locked by this template” / “Editable later”. Prefer **Locked** (not “Fixed”) in UI copy. |
| **Project** | Editable Project dropdown on Details (CNV pattern). Prefills from the Virtual machines list context where Create was clicked; user can change it. |
| **Exit confirm** | Warning modal: Exit without saving / Continue creating. |

```
Select template → Details (+ Access) → Configure (Compute / Storage / Network) → Review and create
```

---

## Entry — Virtual machines list

Primary **Create** opens the wizard.

![Virtual machines list](videos/vmaas-create-ux-doc/01-vm-list.png)

---

## Step 1 — Select template

Browse templates as cards (or list). Selecting a template opens a drawer with **Template settings**:

- **Locked by this template** — OS image always; compute / boot disk when the SKU locks them  
- **Editable later** — fields the user can change on later steps  

**Editable** templates show starting CPU / memory / storage and pen icons. Locked SKUs show lock icons.

![Select template](videos/vmaas-create-ux-doc/02-select-template.png)

![Template drawer (locked SKU)](videos/vmaas-create-ux-doc/03-template-drawer.png)

![Template drawer (Editable SKU)](videos/vmaas-create-ux-doc/12-editable-template-drawer.png)

**Dev notes**

- Template field governance is per-field: `compute` / `bootDisk` = `locked` | `editable`; image is always locked.
- Card footer: **Estimate cost** with hourly + monthly (Editable templates may prefix hourly with **From**).

---

## Step 2 — Details (+ Access)

- Step help: *Name your VirtualMachine, select a project, and optionally set access.* (Option 1: *Name your VirtualMachine and select a project. Description is optional.*)  
- **Name** (required) + generate  
- **Description** (optional)  
- **Project** — editable dropdown (CNV pattern). Prefills from list/workspace context (`createContextProject()`); user can change the project. Helper: *Your VirtualMachine will be created in project **&lt;name&gt;*** (updates when the selection changes).  
- **Access** (Optional) — SSH public key (PF6 FileUpload) and cloud-init on this step (moved off Configure for details-page alignment).

![Details](videos/vmaas-create-ux-doc/04-details.png)

**Dev notes**

- Prefill Project from list/workspace context, then allow edit via a FormSelect (not an info alert).
- Keep Review in sync with the selected project.

---

## Step 3 — Configure (substeps)

Nav parent **Configure** with three substeps:

### Compute resource
- Step help reflects whether compute is editable or locked.  
  - Locked: *OS image and compute size are locked by the template.*  
  - Editable: *OS image is locked by the template. Choose a compute size.*  
- **Compute resource** — select when editable; disabled field when locked.

### Storage
- **Boot disk size** — editable or locked per template.  
- Editable step help: *Set the boot disk size. Add additional disks if you need more storage.*  
- When locked, step help: *Boot disk size is locked by the template. You can add additional disks below.*  
- **Add disk** below boot disk under a small **Additional disks** section title; empty state *No additional disks yet.*

### Network
- Primary attach: virtual network, subnet, security groups (required).  
- **Add network** below under a small **Additional networks** section title (same pattern as Additional disks); empty state *No additional networks yet.*  
- Additional networks listed with remove; Review shows *Network N* → `vnet | subnet | security groups`, or *Additional networks* → *None*.

![Configure](videos/vmaas-create-ux-doc/05-configure.png)

---

## Step 4 — Review and create

Grouped review: Details / Configure / Storage / Network with edit affordances back to the step. Cost panel on the right. Optional *Start this VirtualMachine after creation*.

- **SSH public key** / **Cloud-init:** *Configured* or *Not configured* (no dash). If SSH was uploaded, *Configured (filename)*. Do not paste key or cloud-init body on Review.
- **Additional disks:** when present, one row per disk: *Disk N* → *Size | Storage tier* (e.g. `30 GiB | Balanced`). When none: *Additional disks* → *None*.
- **Additional networks:** when present, one row per network: *Network N* → *vnet | subnet | security groups*. When none: *Additional networks* → *None*.
- **Empty values:** optional text (e.g. Description) uses *—*; required Network fields show values (or *—* only as a fail-safe if incomplete). Access uses *Configured* / *Not configured* only.

**Option 1 Access (on Configure):** SSH FileUpload textarea stays collapsed until focus, upload, drag, or paste (same progressive disclosure as Option 2). Cloud-init stays single-line until focus/content.

![Review](videos/vmaas-create-ux-doc/10-review.png)

**Cost aside footnote**

- Size locked (no extra disks): *Rates match this template. Actual billing may vary.*  
- Size editable, or additional disks added: *Same rates as template cards — updates when you change compute or storage. Actual billing may vary.*

---

## Exit confirmation

Shown when Cancel / close would discard entered data.

| Element | Copy |
|---|---|
| Title | Exit VirtualMachine creation? |
| Body | If you leave now, any information you’ve entered won’t be saved. |
| Primary | Exit without saving |
| Secondary | Continue creating |

![Exit modal](videos/vmaas-create-ux-doc/11-exit-modal.png)

---

## Acceptance checklist (for implementation)

- [ ] Wizard keeps **left step nav** (PF6 wizard nav) in Option 1 and Option 2  
- [ ] Wizard nav includes **Storage** and **Network** as separate steps (Option 1) or Configure substeps (Option 2)  
- [ ] Configure has no disks UI; Storage owns boot + additional disks  
- [ ] Locked fields use disabled controls + lock icon; copy says **Locked** (not Fixed)  
- [ ] Details Project is an editable dropdown (CNV), prefilled from list context  
- [ ] Add disk: auto name; storage tier select with in-menu search + divider  
- [ ] Add network: same list/modal/empty pattern as Add disk; Review shows Network N or None  
- [ ] Exit modal matches copy and button roles above  
- [ ] Estimate cost updates when compute / storage changes  
- [ ] Review: Access = Configured / Not configured; empty Description = —; no additional disks = None 

---

## Related

- Preferred mock: `vmaas-create-wizard-option-1.html`  
- Alternate IA: `vmaas-create-wizard-option-2.html` (tenant shell may still embed this)  
- Earlier alignment notes: `vmaas-openshift-ux-doc-v3.md`  
- Governance PRD context: OSAC-3538 / enhancement-proposals PR #195 (per-field locked/editable)
