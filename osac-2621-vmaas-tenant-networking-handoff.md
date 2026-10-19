# OSAC-2621 — VMaaS Tenant Networking (UX handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-2621](https://redhat.atlassian.net/browse/OSAC-2621) — *UX Design - VMaaS Tenant Networking* |
| **Parent epic** | [OSAC-5652](https://redhat.atlassian.net/browse/OSAC-5652) — *UIX - VMaaS Networking* |
| **Feature** | [OSAC-1435](https://redhat.atlassian.net/browse/OSAC-1435) |
| **Eng epic** | [HPUX-2249](https://redhat.atlassian.net/browse/HPUX-2249) — *VMaaS Tenant Networking* |
| **Scope of this handoff** | Tenant Networking UX in the shared mock: **Virtual networks** (list / create / edit) + Create VM **Networking** step (Ethan-aligned) + day-2 **Attach external IP** |
| **Handoff Google Doc** | [OSAC-2621 — VMaaS Tenant Networking (UX handoff)](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit?usp=drivesdk) (shared with @redhat.com) |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7153) |
| **Ethan reference (BMaaS)** | [Launch BM → Networking](https://heyethankim.github.io/osac-bmaas/tenant-admin/northsummit/workspace?nav=catalog&action=launch-instance&item=bare-metal-general-purpose-server&step=networking) · [Create virtual network](https://heyethankim.github.io/osac-bmaas/tenant-admin/northsummit/workspace?nav=networking-virtual-networks&action=create-virtual-network&step=virtual-network) |
| **Alignment note** | [OSAC-2616 comment](https://redhat.atlassian.net/browse/OSAC-2616?focusedCommentId=18959987) — VMaaS matches BMaaS/Cluster networking; **only VM difference = multiple networks** |
| **Status** | **Fully covered** for tenant networking surfaces in the mock (Ethan-aligned). Type field removed (no API). |

---

## Goal

Give Tenant Admins a unified Networking experience aligned with BMaaS/CaaS:

1. Manage **Virtual networks** (list, cards, create, edit)
2. At **Create VM**, choose **Tenant default** or **Custom network** (VN → Subnet → Security groups), optional auto-attach external IP; **Additional networks** only on Custom
3. Day-2 **Attach external IP** from VM Overview

---

## How to review in the mock

### A. Virtual networks (tenant)

1. Open [the mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7153) as **Tenant Admin**.
2. Nav: **Networking → Virtual networks**.
3. Confirm Ethan-style header, filters, cards/list toggle, name link, kebab (Edit → wizard).
4. **Create virtual network** → Name, Description, IPv4 CIDR, IPv6 CIDR → Review (no Type field).

**Screenshots** (also in the [Google Doc](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit)):

- Cards view: `videos/osac-2621-networking-handoff/01b-virtual-networks-cards.png` · [gh-pages](https://raw.githubusercontent.com/yfrimanm/openshift-origin-design/gh-pages/screenshots/osac-2621/01b-virtual-networks-cards.png)
- Create virtual network: `videos/osac-2621-networking-handoff/02-create-virtual-network.png` · [gh-pages](https://raw.githubusercontent.com/yfrimanm/openshift-origin-design/gh-pages/screenshots/osac-2621/02-create-virtual-network.png)

### B. Create VM → Networking (Ethan-aligned)

1. **Create virtual machine** → continue to **Networking**.
2. Felt cards: **Tenant default** / **Custom network**.
3. **Tenant default** — read-only summary: Virtual network + Subnet + **Security groups**; External IP switch (**default on**). **Additional networks is hidden** (Custom-only).
4. **Custom network** — VN → Subnet → Security groups (multi-select); then External IP; **Additional networks** (Add network).
5. Review → Networking section shows path, SGs, auto-attach; extras only on Custom.

**Screenshots:**

- Tenant default: `videos/osac-2621-networking-handoff/03-create-vm-networking-tenant-default.png` · [gh-pages](https://raw.githubusercontent.com/yfrimanm/openshift-origin-design/gh-pages/screenshots/osac-2621/03-create-vm-networking-tenant-default.png)
- Custom network: `videos/osac-2621-networking-handoff/04-create-vm-networking-custom.png` · [gh-pages](https://raw.githubusercontent.com/yfrimanm/openshift-origin-design/gh-pages/screenshots/osac-2621/04-create-vm-networking-custom.png)
- Additional networks: `videos/osac-2621-networking-handoff/05-create-vm-additional-networks.png` · [gh-pages](https://raw.githubusercontent.com/yfrimanm/openshift-origin-design/gh-pages/screenshots/osac-2621/05-create-vm-additional-networks.png)

### C. External IP (day-2)

1. Open a VM Overview → Network / external IP actions.
2. **Attach external IP** modal — pick from project pool (Bat-Zion reopen ask).

**Screenshot:** Attach external IP modal — `videos/osac-2621-networking-handoff/06-attach-external-ip-modal.png` · [gh-pages](https://raw.githubusercontent.com/yfrimanm/openshift-origin-design/gh-pages/screenshots/osac-2621/06-attach-external-ip-modal.png)

---

## Coverage vs feedback + Ethan

| Spec / feedback | Status | Notes |
|---|---|---|
| Align Create VM Networking with Ethan (OSAC-2616) | **Covered** | Same cards, summary, External IP pattern |
| Tenant default + Custom network | **Covered** | Felt select boxes |
| Tenant default summary includes Security groups | **Covered** | Read-only; not editable on default path |
| Custom: VN → Subnet → SG together | **Covered** | SG only on Custom |
| Security groups multi-select | **Covered** | API `securityGroupRefs[]`; rich option desc |
| Auto-attach external IP default **on** | **Covered** | Product decision for VMaaS Create VM |
| Step title **Networking** | **Covered** | Nav + panel + Review |
| VM-only Additional networks | **Covered** | Custom path only — hidden on Tenant default |
| Remove Network Type (Alona — no API) | **Covered** | Removed from list/create/detail |
| Create VN Ethan fields | **Covered** | Name, Description, IPv4/IPv6 CIDR |
| VN list cards / kebab Edit wizard | **Covered** | Ethan-sized cards |
| External IP attach modal (Bat-Zion) | **Covered** | Day-2 modal on Overview |

**Verdict (OSAC-2621 tenant networking UX in mock):** Fully covered / Ethan-aligned.

---

## Surfaces

| Surface | Path |
|---|---|
| Virtual networks list | Networking → **Virtual networks** |
| Create / Edit VN | Create virtual network / kebab → Edit |
| Create VM Networking | Create VM → **Networking** |
| Attach external IP | VM Overview → Attach external IP |

### Demo defaults

| Item | Value |
|---|---|
| Tenant default VN | `tenant-workload` |
| Tenant default subnet | `bm-compute-a` |
| Default security group | `allow-ssh-https` |

---

## Decisions (confirmed)

1. **SG cardinality:** Multi-select (API supports `securityGroupRefs[]`).
2. **Additional networks SG:** Same multi-select control as primary.
3. **External IP default:** **On** (auto-attach).
4. **Step title:** **Networking** (not Network).
5. **Network Type:** Removed — no API (Alona).
6. **Additional networks:** Shown only when **Custom network** is selected; cleared/hidden on Tenant default.

---

## Related

- Ethan sync: [OSAC-2616](https://redhat.atlassian.net/browse/OSAC-2616) / [OSAC-2616 comment 18959987](https://redhat.atlassian.net/browse/OSAC-2616?focusedCommentId=18959987)
- Feature: [OSAC-1435](https://redhat.atlassian.net/browse/OSAC-1435)
- Prototype build: `7153` (Additional networks Custom-only; EIP default on; Networking Ethan alignment from `7149`)

---

## Open questions

1. **Jira status:** OK to move OSAC-2621 to design-approved / Closed with this handoff, or keep open until eng UI design story exists?
2. **External IPs list page:** Is a dedicated Networking → External IPs list in scope for this ticket, or day-2 attach modal only for now?
