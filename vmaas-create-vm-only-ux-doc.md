# Create Virtual machine — UX documentation

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Scope** | Tenant **Create Virtual machine** wizard (list entry → creation method → steps → Review) |
| **Handoff Google Doc** | [Create Virtual machine — UX documentation](https://docs.google.com/document/d/1LL0iWhIIh3gAhJAsm7MCpnlFxfzaOXkZS_MVI6dSfSo/edit) |
| **Shared UX tab (pointer)** | [VMaaS prototype — UX documentation → Create Virtual machine](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.9bgpoonlcpfy) |
| **Windows Sysprep detail** | [OSAC-5009 dedicated Doc](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit) |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7162-create) |
| **Screenshots** | `videos/vmaas-create-vm-only-ux-doc/` · [gh-pages/screenshots/create](https://github.com/yfrimanm/openshift-origin-design/tree/gh-pages/screenshots/create) |
| **Regenerate** | `node scripts/capture-vmaas-create-vm-only-screenshots.mjs` |

**IA (custom path):** Creation method → Details → Instance type → Storage → Network → Access & Initial run → Review and create

---

## Goal

Document the tenant Create Virtual machine flow in the shared VMaaS mock: entry from the VM list, creation-method felt cards, wizard steps, Review, and exit confirmation. Windows Sysprep (Access & Initial run) is summarized here and detailed in the OSAC-5009 Doc.

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7162-create) as **Tenant Admin**.
2. **Virtual machines** → **Create Virtual machine**.
3. Walk Creation method → Details → Instance type → Storage → Network → Access & Initial run → Review.
4. For Windows Access: set Guest OS to **Microsoft Windows** on Details (see OSAC-5009 Doc).

---

## Entry — Virtual machines list

- Primary CTA: **Create Virtual machine**
- **Name** opens VM Overview
- Filter row: Project · Power state · Operating system · Hardware devices · Search
- Row kebab: Control ▸ · Open console · Delete (danger)

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
| Access & Initial run | Linux: SSH + Cloud-init · Windows: Sysprep (OSAC-5009) |
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

- Companion Overview Doc: [Virtual machine details Overview](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit)
- Networking (Create + day-2 EIP): [OSAC-2621](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit)
- Windows Sysprep: [OSAC-5009](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit)
- Prototype build: **7162**
