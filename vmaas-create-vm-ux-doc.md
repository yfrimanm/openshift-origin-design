# Create VirtualMachine — UX documentation

## Goal

Document the **Create VirtualMachine** wizard for OSAC VMaaS so developers can implement the flow with clear step boundaries, locked vs editable template fields, and PatternFly patterns.

### Option comparison

| | **Option 1** (flat) | **Option 2** (details-page aligned) |
|---|---|---|
| Steps | Select template → Details → Configure → Storage → Network → Review | Select template → Details (+ Access) → Configure (Compute / Storage / Network) → Review |
| Mock | `vmaas-create-wizard-option-1.html` | `vmaas-create-wizard-option-2.html` (embedded in tenant shell) |

**Option 2 wizard steps:** Select template → Details (Access) → Configure → Review and create

*Interactive mockup (Option 2):* `vmaas-create-wizard-option-2.html` (also embedded in the tenant shell: Services → Virtual machines)  
*Option 1 (previous flat flow):* `vmaas-create-wizard-option-1.html`  
*Google Doc:* [Create VirtualMachine — UX documentation](https://docs.google.com/document/d/1o97lTRGKAOPdNQz_zH7KbUOxAchPnJYsjlGye9W_tNs/edit)  
*Screenshots:* `videos/vmaas-create-ux-doc/` (Option 1 capture; regenerate for Option 2 when needed)  
*Regenerate screenshots:* `node scripts/capture-vmaas-create-screenshots.mjs`

---

## UX summary

| Decision | Detail |
|---|---|
| **Option 2 IA** | Details holds identity + optional Access. Configure groups Compute resource, Storage, and Network as substeps (aligns with VM details). |
| **Storage under Configure** | Boot disk + additional disks on Configure → Storage. |
| **Network under Configure** | Virtual network, subnet, and security groups on Configure → Network. |
| **Compute under Configure** | OS image always locked; compute locked or editable on Configure → Compute resource. |
| **Locked vs Editable** | **Locked** uses a lock icon; **Editable** uses a pen icon. Drawer panels: “Locked by this template” / “Editable later”. Prefer **Locked** (not “Fixed”) in UI copy. |
| **Project** | Context awareness on Details (info alert) — inherited from the Virtual machines list where Create was clicked. Not a disabled dropdown. |
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

**Flexible** templates show starting CPU / memory / storage and pen icons. Locked SKUs show lock icons.

![Select template](videos/vmaas-create-ux-doc/02-select-template.png)

![Template drawer (locked SKU)](videos/vmaas-create-ux-doc/03-template-drawer.png)

![Template drawer (flexible SKU)](videos/vmaas-create-ux-doc/12-flexible-template-drawer.png)

**Dev notes**

- Template field governance is per-field: `compute` / `bootDisk` = `locked` | `editable`; image is always locked.
- Card footer: **Estimate cost** with hourly + monthly (flexible may prefix hourly with **From**).

---

## Step 2 — Details (+ Access)

- Step help: *Name your VirtualMachine and optionally set access.*  
- **Name** (required) + generate  
- **Description** (optional)  
- **Project** — context awareness only (inline info alert), not a disabled dropdown. One line: *Your VirtualMachine will be created in project **&lt;name&gt;*** (project name bold). Bound from the VMs list where Create was started.
- **Access** (Optional) — SSH public key (PF6 FileUpload) and cloud-init on this step (moved off Configure for details-page alignment).

![Details](videos/vmaas-create-ux-doc/04-details.png)

**Dev notes**

- Do not ask the user to pick a project here. Bind from list/workspace context (`createContextProject()`).
- Use an info alert (or equivalent non-control) so Project reads as awareness, not a form field.

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
- **Add disk** below boot disk; empty state *No additional disks yet.*

### Network
Attach to an existing virtual network: network, subnet, security groups.

![Configure](videos/vmaas-create-ux-doc/05-configure.png)

---

## Step 4 — Review and create

Grouped review: Details / Configure / Storage / Network with edit affordances back to the step. Cost panel on the right. Optional *Start this VirtualMachine after creation*.

- **SSH public key** / **Cloud-init:** *Configured* or *Not configured* (no dash). If SSH was uploaded, *Configured (filename)*. Do not paste key or cloud-init body on Review.
- **Additional disks:** when present, one row per disk: *Disk N* → *Size | Storage tier* (e.g. `30 GiB | Balanced`). When none: *Additional disks* → *None*.
- **Empty values:** optional text (e.g. Description) uses *—*; required Network fields show values (or *—* only as a fail-safe if incomplete). Access uses *Configured* / *Not configured* only.

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

- [ ] Wizard nav includes **Storage** and **Network** as separate steps  
- [ ] Configure has no disks UI; Storage owns boot + additional disks  
- [ ] Locked fields use disabled controls + lock icon; copy says **Locked** (not Fixed)  
- [ ] Details Project is context awareness from list (not a disabled dropdown)  
- [ ] Add disk: auto name; storage tier select with in-menu search + divider  
- [ ] Exit modal matches copy and button roles above  
- [ ] Estimate cost updates when compute / storage changes  

---

## Related

- Mock: `osac-vmaas/public/vmaas-create-wizard-option-2.html`  
- Earlier alignment notes: `vmaas-openshift-ux-doc-v3.md`  
- Governance PRD context: OSAC-3538 / enhancement-proposals PR #195 (per-field locked/editable)
