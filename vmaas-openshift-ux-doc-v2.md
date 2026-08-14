# VMaaS for OpenShift — UX alignment with CNV (v2)

Working copy branched from v1 so further iteration does not override the frozen v1 artifacts (`vmaas-openshift-ux-doc.md`, `vmaas-openshift-ux-mockup.html`).

## Goal

Align **OSAC VMaaS** tenant UX with what **OpenShift Virtualization (CNV)** ships today for three primary flows:

1. **Create a new VM**
2. **Manage VMs**
3. **Network configuration** (create/manage networks + attach NICs on Create VM)

Source of truth for Create VM interaction: [Create VM wizard for OSAC VMaaS (Figma)](https://www.figma.com/design/5r8QuN2LHSGFmiLkwIVmOu/Create-VM-wizard-for-OSAC-VMaaS?node-id=0-1) — CNV wizard frames (InstanceType / custom path + From template + Clone).

PM requirements: `VMaaS user requirements-my copy.pdf` (VCD tenant roles & permissions). Google Doc mirrors: [original](https://docs.google.com/document/d/1CwLPslwDOWmXd3AzAU45fMgqYw_5qyGa-lH9NMLROeo/edit) / [shared copy](https://docs.google.com/document/d/1V2U-HdjOUx5_HB1k7YYbqAmxMSawhwOWQBRUOuHpmzE/edit).

Competitive pattern (VCD, AWS/Azure, CNV): **network infrastructure is separate** from Create VM; **NIC attach / IP mode is part of Create VM**. RunPod-style deploy toggles are not the VMaaS model.

*Interactive mockup (v2): `vmaas-openshift-ux-mockup-v2.html`*

---

## Personas (aligned to PM / VCD tenant roles)

PM source: predefined VMware Cloud Director **tenant roles**. Map to VMaaS UX for Create VM + Manage VMs (OpenShift vocabulary; no “vApp” in UI copy).

| VCD role (PM) | Mental model | Create VM | Manage VMs | Create / manage networks | NIC attach (Create VM / details) | Console |
|---|---|---|---|---|---|---|
| **Organization Administrator** | Full tenant governance | Yes | All VMs in org | **Yes** (org / shared / provider) | Yes | Yes |
| **Catalog Author** | Templates / media / permissions | **No** | View / consume | **No** | Limited | Yes if needed |
| **vApp Author** → **VM Author** | Builder — deploy & own workloads | **Yes** | Own / controlled VMs | **Isolated / app-scoped** (vApp-network analogue) | **Yes** (add/remove NICs, IP mode, map network) | Yes |
| **vApp User** → **VM User** | Operator of shared workloads | **No** | Shared / assigned only | **View only** | **View only** (IPs) | Yes |
| **Console Access Only** | Guest login only | **No** | View assigned | Hidden or view-only | View IPs only | **Yes** (primary) |
| **Defer to Identity Provider** | IdP-mapped roles | Dynamic | Dynamic | Dynamic | Dynamic | Dynamic |

**Locked:** Catalog Author does **not** get Create VM. Focus is catalog/template management and permissions. Create VM belongs to **VM Author** (vApp Author) and Org Admin.

### Workload roles — UX implications (Create + Manage)

From PM comparison matrix (vApp Author / User / Console Access Only):

| UX surface | VM Author | VM User | Console Access Only |
|---|---|---|---|
| **Create** primary button | Visible | **Hidden** | **Hidden** |
| Empty state Create CTA | Yes | No — “No VMs shared with you” | No |
| Bulk / row: Start, Stop, Restart | Yes | Yes (shared/assigned) | **Hidden** |
| Row: Delete, Clone, Edit hardware | Yes (own) | **Hidden** | **Hidden** |
| Row: Open console | Yes | Yes | Yes (primary / only management action) |
| Details: edit CPU/RAM/disk/NIC | Editable | Read-only | Read-only basics |
| ISO mount | Yes | Yes (if shared allows) | No |
| Networks list | View + Create isolated/app | View only | Hidden or view-only |
| Create org / shared network | No (Org Admin) | No | No |

**Default mockup persona for Create + Manage flows:** **VM Author** (maps to vApp Author). Demo role switcher should show Author / User / Console Access Only / Org Admin.

### Org Administrator

Can do everything Authors can, plus users/groups, quotas, catalogs, and **organization networks** (create/manage routed, isolated, shared/provider-backed networks). Create network is the primary action on **Networks**.

---

## Design principles

1. **Parity with CNV first** — Same step order, labels, and patterns as today’s Create Virtual machine wizard and Virtual machines list; VMaaS only scopes/hides what a tenant must not see.
2. **PF6 only** — Modal Wizard, Form, Table, Drawer, Tabs, Toolbar, Label, Empty state.
3. **Create on the list page** — Primary **Create** on Virtual machines and **Create** on Networks — visible only for roles that may create that resource.
4. **Three VM create paths (v1)** — Figma labels:  
   - **Custom configuration (default)**  
   - **Create from template**  
   - **Clone existing Virtual machine**  
   From volume remains out of scope.
5. **Split networking (PM / VCD / hyperscalers)** —  
   - **Networks page** = create & manage network infrastructure (org / shared / isolated).  
   - **Create VM → Customization → Network** = attach NIC(s) to an *existing* network (IP mode, primary NIC).  
   Do not bury org-network creation inside Create VM.
6. **RBAC from PM roles** — Hide or disable actions the role cannot perform (do not show grayed Create for Console Access Only as if it’s a temporary outage — omit the action).
7. **Tenant scoping** — No cluster project tree for tenant personas; project/folder via Location in Create and filters on the list.

---

## Flow A — Manage VMs (CNV Virtual machines page)

### Entry

Nav → **Virtual machines** (default landing).

### CNV pattern to keep

| Element | CNV today | VMaaS tenant adaptation |
|---|---|---|
| Page title | Virtual machines + favorite | **Virtual machines** |
| Primary action | **Create** | Visible for **Org Admin / VM Author** only |
| Toolbar | Search, filters, pagination | Same |
| Table | Name, Namespace, Status, Conditions, Node, IP, … | Same pattern as mockup; **Name** is a link (blue, underlined) to VM details Overview; Node visibility TBD |
| Status column | PF6 `Icon` + status color: **Running** = `pf-v6-pficon-running` + `success`; **Stopped** = `pf-v6-pficon-off`; transitional = spinner / in-progress | Same; status label is a link (blue, underlined) |
| Row actions | Kebab | Filtered by role (see matrix above) |
| Project tree (left) | Local cluster → projects | **Omit** for tenant shell |

### Row / bulk actions (by role)

| Action | VM Author | VM User | Console Access Only |
|---|---|---|---|
| Start / Stop / Restart | Yes | Yes | No |
| Open console | Yes | Yes | Yes |
| Clone / Delete | Yes | No | No |
| Edit hardware / guest | Yes | No | No |

### Empty state

- **Author:** “No virtual machines” + **Create**
- **User / Console:** “No virtual machines shared with you” — no Create

### VM details (click VM name on list)

Clicking a VM name opens **VM Overview** (CNV-aligned). Tabs: Overview · Metrics · YAML · **Configuration** · Events · Console · Snapshots · Diagnostics.

**Header actions (CNV):** icon toolbar — **Stop** · **Restart** · **Pause** · **Start** (disabled when Running) · **Actions** dropdown. Not labeled secondary buttons.

| Surface | Content |
|---|---|
| **Overview** | Top: Details + VNC · Utilization (CPU/Memory/Storage donuts + Network transfer In/Out — no pie) · side cards Alerts / General / Snapshots / Network / Storage. Bottom (full width): **Hardware devices (0)** · **File systems** · **Services** · **Active users (0)** |
| **Configuration → Network** | **Attach NIC** here — title **Network interfaces** · **Add network interface** opens modal (does not insert a row immediately) · Filter / search · table (Name, Model, Network, State, Type, MAC) · kebab: Set link down / Edit / Delete · helper links to **Networks** page for creating infrastructure (do not create org networks here) |

**Add network interface modal (CNV):** Name * · Model (virtio) · Network * (searchable NAD / existing network; error if none available) · Use as boot source · **Advanced settings** (MAC address, Link state Up/Down) · **Save** disabled until Network selected · Cancel.

Overview Network card is a summary only; full attach/edit is under **Configuration → Network**.

---

## Flow B — Create VM (CNV modal wizard)

**Pattern:** Large **modal wizard** opened from Virtual machines → **Create**.  
**Title:** Create Virtual machine  

**Footer:** In the **right** content column (not under the step nav) — **Back** (secondary) · **Next** / **Create Virtual machine** (primary) · **Cancel** (link), end-aligned.

**Cancel / close confirmation:** If the user has progressed past step 1 or entered any data, **Cancel**, the header **Close (X)**, backdrop click, or **Escape** opens a warning modal before discarding:

| Element | Content |
|---|---|
| Title | Cancel create Virtual machine? |
| Body | Are you sure you want to cancel the create VM flow? If you cancel now, any information you've entered won't be saved. |
| Actions | **Yes, cancel** (primary) · **No, continue** (link) |

If the wizard is still pristine (step 1, no edits), Cancel / Close dismisses immediately with no confirmation.

### Step 1 — Deployment details (shared)

| Section | Content |
|---|---|
| **Select a creation method** | Horizontal cards: **Custom configuration (default)** · **Create from template** · **Clone existing Virtual machine** |
| **General info** | Name* (placeholder: “Enter a name or click the refresh icon to generate one” + refresh) · Description |
| **Location** | “Select the location for your Virtual machine to be created at” · **Project*** searchable select · **Folder (optional)** searchable select — no path preview (location is chosen, not detected) |

---

### Flow 1 — Custom configuration (default)

| # | Step (nav) | Content |
|---|---|---|
| 1 | **Deployment details** | Creation method = Custom · Name · Description · Location |
| 2 | **Guest OS** | “Guest operating system” — tiles **RHEL** · **Microsoft Windows** · **Other Linux** + **Guest operating system type** dropdown (e.g. `rhel.10`, preselected for family) |
| 3 | **Boot source** | “Select a boot source (volume or ISO) now or configure it later.” — Boot source (volume table + Add boot source) **or** No boot source |
| 4 | **Compute resources** | “Define resources by selecting series and size.” — Red Hat provided / User provided · series cards (default **General Purpose**) · Size dropdown **preselected** to `medium: 1 CPUs, 4 GiB Memory` (user can change) |
| 5 | **Customization** | “Optionally, explore the tabs…” — **Find settings** · Details / Storage / **Network** / Scheduling / **SSH** / Initial run / Metadata |

#### Customization → SSH

| Control | Content |
|---|---|
| **SSH public key** | Resizable textarea (paste public key) |
| Helper text | “Paste a public key to enable SSH access after the VM starts. Supported types: **ssh-ed25519**, **ecdsa-sha2-nistp256/384/521**, and **ssh-rsa**.” |
| 6 | **Review and create** | “Before you create your Virtual machine, review its configuration.” · expandable Details/Storage/Networking/Hardware · **Start this Virtual machine after creation** checkbox · **Create Virtual machine** |

#### Customization → Network (NIC attach — part of Create VM)

| Control | Behavior |
|---|---|
| Default NIC | `nic0` attached to default/pod or selected project network |
| Add network interface | Opens form: Name · Network* (from Networks list) · Binding / type · IP mode (DHCP / Static pool / Manual) · Primary NIC |
| Edit / remove | Authors only; Users see read-only |
| Empty networks | Helper: “No networks in this project. An Organization Administrator can create one from **Networks**.” + link (Authors may create isolated/app network if permitted) |

---

### Flow 2 — Create from template

| # | Step (nav) | Content |
|---|---|---|
| 1 | **Deployment details** | Creation method = Create from template · Name · Description · Location |
| 2 | **Template** | Title **Templates** · “Select a Template…” · All projects + keyword filter · **list/card view toggle** · left filter panel (see below) · **2-column card grid** (taller cards so names/meta stay readable) · click selects + opens **side drawer** (Details) · **Next disabled** until a template is selected |

#### Template filters (Type drives secondary filters)

| Type selection | Secondary filters shown | Card fields |
|---|---|---|
| **OpenShift templates** (T) checked | **Architecture** (amd64 / arm64) · **OpenShift templates** radios: All / Default / User · **Provider** (Red Hat / Other) · **Operating system** (RHEL / Fedora / CentOS / Windows / Other) | Project · **OS** · vCPU \| Memory |
| **Virtual machine templates** (VMT) only | **Architecture** · **Virtual machines templates** radios: All templates · Databases · Operating systems · Monitoring · Networking · Observability · Security · Storage | Project · **Category** · Size |
| Both T + VMT | Same secondary panel as OpenShift (while T is checked); grid includes both kinds | Mixed — OS for OpenShift cards, Category for VMT cards |

Empty checkbox groups mean “all”. Selecting Architecture / Provider / OS / Category / Default vs User live-filters the grid.
| 3 | **Customization** | Same tab model as custom path |
| 4 | **Review and create** | Same review + start checkbox → **Create Virtual machine** |

---

### Flow 3 — Clone existing Virtual machine

Shorter path (no Guest OS / Boot / Compute / Customization). Disks and NICs come from the source VM.

| # | Step (nav) | Content |
|---|---|---|
| 1 | **Deployment details** | Creation method = Clone existing Virtual machine · **Location only** (no Name / Description on this step) |
| 2 | **Source** | Title **Source** · “Select a VM to clone.” · Project filter · Filter · Search by name · table (radio · Name with VM badge · Status · Created) · **Next disabled** until a source VM is selected · selecting a row suggests `{source}-clone` as the new name |
| 3 | **Review and create** | “Before you clone your Virtual machine…” · Details with editable Name* (+ refresh) and Description · Source VM · Cluster / Project / Folder · Storage / Network / Hardware (collapsed; clone PVC copy) · **Start this Virtual machine after creation** → **Create Virtual machine** |

---

### Post-create

- Close wizard; land on Virtual machines list (or VM Details if CNV does).
- Toast / status: VM appears as Starting / Running per “start after creation”.

---

## Flow C — Networks (separate from Create VM)

**Why separate:** VCD Org Admins create organization VDC networks outside New VM; Authors map NICs (and optionally create vApp-local networks). AWS/Azure: VPC/VNet admin vs Launch/Create Networking tab. CNV: NAD/UDN outside wizard; NIC on Customization → Network. RunPod toggles at deploy are not the tenant VMaaS pattern.

### Entry

Nav → **Networks**.

### List page

| Element | Behavior |
|---|---|
| Page title | **Networks** |
| Primary action | **Create** — Org Admin (all types); VM Author (isolated / application only); hidden for User / Console |
| Table | Name · Type · Project · CIDR / subnet · Status · Connected VMs · kebab |
| Types (v1 labels) | **Isolated** · **Shared** (org) · **Provider** (read-only / provider-backed) |

### Create network wizard

**Pattern:** Modal wizard from Networks → **Create**.  
**Title:** Create network  

| # | Step | Content |
|---|---|---|
| 1 | **Type** | Cards: Isolated · Shared · Provider (Provider may be Org Admin only / provider-provisioned) |
| 2 | **Basics** | Name* · Description · Project* |
| 3 | **Addressing** | Subnet / CIDR · Gateway (optional) · DNS (optional) · IP pool / DHCP |
| 4 | **Review and create** | Summary → **Create network** |

Post-create: land on Networks list; toast. Networks become selectable in Create VM → Network tab.

### Role summary (networking)

| Capability | Org Admin | VM Author | VM User | Console |
|---|---|---|---|---|
| Create org / shared network | Yes | No | No | No |
| Create isolated / app network | Yes | Yes | No | No |
| Attach NIC on Create VM | Yes | Yes | N/A (no Create) | N/A |
| View network list / VM IPs | Yes | Yes | Yes | Yes (IPs) |

---

## VMaaS vs full CNV (intentional deltas)

| Topic | CNV | VMaaS tenant v1 |
|---|---|---|
| Cluster project tree | Yes | Omit for tenant roles |
| Create types Volume / Clone | Yes | **Clone shown**; Volume still **Hidden** |
| Node column | Yes | Confirm for tenants |
| Role-gated Create / Actions | Console RBAC | Align to PM VCD role matrix |
| vApp wrapper UX | N/A | Out of scope — VM-centric (Author ≈ vApp Author); isolated network ≈ vApp network |
| Network admin | NAD / UDN / cluster | Tenant **Networks** page (no cluster admin terms in UI) |

---

## Component inventory (PF6)

| Surface | Components |
|---|---|
| Manage VMs | Page, Toolbar, SearchInput, Filter, Table, Pagination, Label, Dropdown (kebab), Modal (confirm) |
| Create VM | Modal + Wizard, Form, ExpandableSection, Radio (cards), Tabs, Select, Drawer (template details), Table (clone source), DescriptionList (Review) |
| Networks | Page, Toolbar, Table, Empty state, Modal + Wizard (Create network), Label (type) |

---

## Open questions

1. **Naming** — Use “VM Author / VM User” in product, or keep VCD “vApp Author / vApp User” in docs only?
2. **Template drawer** — Full Details/YAML/Scripts for Authors?
3. **Node / Conditions columns** — Show to all tenant roles?
4. **Org Admin Overview** — Separate aggregated dashboard later?
5. **Author isolated networks** — Confirm product name (Isolated vs Application network) and whether Authors get Create on Networks in v1.
6. **Provider networks** — Tenant-visible create, or provider-only (read-only in tenant UI)?

---

## Next steps

1. Role-gate Create VM / Create network + kebab actions in mockup (Author / User / Console / Org Admin); Create VM hidden for Catalog Author.
2. Confirm Author network Create with PM.
3. File HPUX stories per role capability for Create VM, Manage VMs, and Networks.
