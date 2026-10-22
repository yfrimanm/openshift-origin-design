# Create Virtual machine

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Scope** | Tenant **Create Virtual machine** wizard (list entry → creation method → steps → Review) |
| **Handoff Google Doc** | [Create Virtual machine](https://docs.google.com/document/d/1LL0iWhIIh3gAhJAsm7MCpnlFxfzaOXkZS_MVI6dSfSo/edit) |
| **Shared UX tab (pointer)** | [VMaaS prototype — UX documentation → Create Virtual machine](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.9bgpoonlcpfy) |
| **Windows Sysprep detail** | [Create Windows VM with sysprep](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit) |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165) |
| **Screenshots** | `videos/vmaas-create-vm-only-ux-doc/` · [gh-pages/screenshots/create](https://github.com/yfrimanm/openshift-origin-design/tree/gh-pages/screenshots/create) |
| **MD handoff** | [vmaas-create-vm-only-ux-doc.md](https://github.com/yfrimanm/openshift-origin-design/blob/vmaas-create-vm-wizard/vmaas-create-vm-only-ux-doc.md) |
| **Regenerate** | `node scripts/capture-vmaas-create-vm-only-screenshots.mjs` |

**IA (custom path):** Creation method → Details → Instance type → Storage → Network → Access & Initial run → Review and create

---

## Goal

Document the tenant Create Virtual machine flow in the shared VMaaS mock: entry from the VM list, creation-method felt cards, wizard steps, Review, and exit confirmation. Windows Sysprep (Access & Initial run) is summarized here and detailed in [Create Windows VM with sysprep](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit).

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165) as **Tenant Admin**.
2. **Virtual machines** (card view is default) → **Create Virtual machine**.
3. Walk Creation method → Details → Instance type → Storage → Network → Access & Initial run → Review.
4. For Windows Access: set Guest OS to **Microsoft Windows** on Details (see [Create Windows VM with sysprep](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit)).

---

## Entry — Virtual machines list

- Primary CTA: **Create Virtual machine**
- Filter row: Project · Power state · Operating system · Hardware devices · Search
- View toggle: **card** (default) · list — aligned to Ethan [Clusters cards](https://heyethankim.github.io/osac-bmaas/tenant-admin/northsummit/workspace?nav=services-clusters)

**Card view**

| Element | Notes |
|---|---|
| Header | Checkbox · server icon · status pill · kebab |
| Title | Blue name → Overview · subtitle = catalog item |
| Specs | Instance type · IP address |
| Footer | Project · Created |
| Actions | Kebab only: Control ▸ · **Open console** (enabled when Running) · Delete |

**List view:** same filters; row kebab: Control ▸ · Open console · Delete (danger).

---

## Creation method (felt cards)

- **Custom configuration**
- **Create from template**
- **Clone existing virtual machine**

---

## Wizard steps (summary)

| Step | Notes |
|---|---|
| Select template | Template path only; Project typeahead; Locked / Editable drawer |
| Details | Name · Description · Guest OS felt cards · Disk image |
| Instance type | Typeahead rich-select (or locked by template) |
| Storage | Boot disk + tier; Additional disks (inline Add disk) |
| Network | VN / Subnet / SG; Additional networks (see OSAC-2621) |
| Access & Initial run | Linux: SSH + Cloud-init · Windows: Sysprep Enter value / Select secret (OSAC-5009) |
| Review and create | Nebius sections · cost estimate · Start after create (default on) |

---

## Exit confirmation

| Element | Copy |
|---|---|
| Title | Exit Virtual machine creation? |
| Body | If you leave now, any information you’ve entered won’t be saved. |
| Primary | Exit without saving |
| Secondary | Continue creating |

---

## Related

- Companion Overview Doc: [VM Overview](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit)
- Networking (Create + day-2 EIP): [Tenant Networking](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit)
- Windows Sysprep: [Create Windows VM with sysprep](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit)
- Prototype build: **ethan-cards 7165**
