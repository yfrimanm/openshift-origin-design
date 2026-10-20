# Virtual machine details Overview — UX documentation

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Scope of this doc** | Single-VM **details Overview** (day-2) |
| **Handoff Google Doc** | [Virtual machine details Overview — UX documentation](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit) |
| **Shared UX tab (pointer)** | [VMaaS prototype — UX documentation → VM Overview](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.ut299rnpbsxq) |
| **Companion Create Doc** | [Create Virtual machine — UX documentation](https://docs.google.com/document/d/1LL0iWhIIh3gAhJAsm7MCpnlFxfzaOXkZS_MVI6dSfSo/edit) |
| **External IP / Networking** | [OSAC-2621 Doc](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit) |
| **Resize (instance type)** | [OSAC-4281 Doc](https://docs.google.com/document/d/1kgln_LzTA3-VSP0SUM0jLce2Nvw0pix3oTYkwZuX-wE/edit) |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7162-overview) |
| **Screenshots** | `videos/vmaas-vm-details-overview-ux-doc/` · [gh-pages/screenshots/details](https://github.com/yfrimanm/openshift-origin-design/tree/gh-pages/screenshots/details) |
| **Entry** | List **Name** link, after Create, or `?vm={name}` |

---

## Goal

Document OSAC VMaaS **Virtual machine details Overview** (day-2): header power actions, Overview / Configuration / Access & Initial run summary, **External IP**, Networking, Storage, Utilization, and key edit modals.

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7162-overview) as **Tenant Admin**.
2. Open a Running VM (e.g. `azure-baboon-27`) from the list.
3. Confirm Overview columns, **External IP** (Host + SSH), Networking, Storage, Utilization.
4. Try Instance type pencil (resize — OSAC-4281) and External IP attach/detach (OSAC-2621).

---

## Layout

| Area | Contents |
|---|---|
| Header | Breadcrumb · title · **Open console** · Start / Restart / Stop / Pause · Actions |
| Top columns | **Overview** · **Configuration** · **Access & Initial run** |
| Below | **External IP** (Host + SSH command) · **Networking** table · **Storage** table · **Utilization** |
| Sidebar | Alerts · Recent activity |

---

## Top columns

| Column | Fields |
|---|---|
| Overview | Project · Status (popover) · Created · Catalog item |
| Configuration | Guest OS family · Disk image · Instance type (edit pencil) |
| Access & Initial run | SSH public key · Cloud-init / Sysprep (as configured) |

---

## External IP

Section title: **External IP** (not “Access” — avoids colliding with Access & Initial run).

- **Host** + Attach / Detach
- **SSH command** clipboard-copy when attached
- States: not attached · attaching · attached · failed

Full contract: [OSAC-2621 Doc](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit).

---

## Networking / Storage

- **Networking:** Virtual network · Subnet · Security groups · Internal IP · Add network
- **Storage:** disks table · Add disk · boot disk delete protected

---

## Edit modals (day-2)

| Modal | Entry |
|---|---|
| Edit instance type | Configuration → Instance type pencil (OSAC-4281) |
| Edit SSH public key | Access & Initial run → SSH |
| Add / Edit network | Networking |
| Add / Edit disk | Storage |
| Delete Virtual machine | Actions → Delete |

---

## Roles

| Role | Overview edits |
|---|---|
| Tenant Admin | Can edit Overview config |
| Tenant User | Read-only Overview config **except Instance type resize**; power / console OK |

---

## Related

- Create Doc: [Create Virtual machine](https://docs.google.com/document/d/1LL0iWhIIh3gAhJAsm7MCpnlFxfzaOXkZS_MVI6dSfSo/edit)
- Prototype build: **7162**
