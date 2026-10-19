# OSAC-2621 — VMaaS Tenant Networking (UX handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-2621](https://redhat.atlassian.net/browse/OSAC-2621) — *UX Design - VMaaS Tenant Networking* |
| **Parent epic** | [OSAC-5652](https://redhat.atlassian.net/browse/OSAC-5652) — *UIX - VMaaS Networking* |
| **Feature** | [OSAC-1435](https://redhat.atlassian.net/browse/OSAC-1435) |
| **Eng epic** | [HPUX-2249](https://redhat.atlassian.net/browse/HPUX-2249) — *VMaaS Tenant Networking* |
| **Scope of this handoff** | **VMaaS-only:** how a VM connects to shared virtual networks + **External IP** (create + day-2). Virtual network / External IP **list** management is **out of scope** (unified networking). |
| **Handoff Google Doc** | [OSAC-2621 — VMaaS Tenant Networking (UX handoff)](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit?usp=drivesdk) (shared with @redhat.com) |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7161-ethan-access) |
| **Ethan reference (BMaaS)** | [Launch BM → Networking](https://heyethankim.github.io/osac-bmaas/tenant-admin/northsummit/workspace?nav=catalog&action=launch-instance&item=bare-metal-general-purpose-server&step=networking) |
| **Alignment note** | [OSAC-2616 comment](https://redhat.atlassian.net/browse/OSAC-2616?focusedCommentId=18959987) — Create VM **Networking** matches BMaaS/Cluster attachment patterns; **VM-only** difference = Additional networks (Custom path). |
| **Status** | Design complete for VM attach + External IP. VN CRUD + External IPs list → [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433). |

---

## Goal

VMaaS networking UX is about **connecting a VM** to the shared networking model and **reaching it over SSH**:

1. At **Create VM → Networking**, choose how the VM attaches to an existing virtual network (Tenant default / Custom), security groups, optional **auto-attach External IP**, and Additional networks (Custom only).
2. On **VM Overview**, manage **External IP** day-2 via Ethan **Access** (Host + SSH command) — with clear **attaching** and **failed** states.

Virtual networks are **shared** across clusters, bare metal, and VMs. That management UX is **not** duplicated here.

---

## Out of scope (unified networking)

| Surface | Owner |
|---|---|
| Virtual networks list / create / edit | [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433) |
| External IPs **list** page (Networking → External IPs) | [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433) |
| Subnets / Security groups / NAT / NetworkClasses admin | [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433) |

The VMaaS prototype may still show **Networking → Virtual networks** as a **placeholder**; it is **not** part of the OSAC-2621 handoff contract.

---

## In scope

### A. Create VM → Networking (Ethan-aligned attachment)

1. Open [the mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7161-ethan-access) as **Tenant Admin**.
2. **Create virtual machine** → **Networking**.
3. **Tenant default** / **Custom network** felt cards.
4. Tenant default: read-only VN + Subnet + Security groups; External IP switch (**default on**). Additional networks **hidden**.
5. Custom: VN → Subnet → SG multi-select; External IP; **Additional networks** (Add network).
6. Review → Networking section.

### B. External IP (day-2) — Ethan Access pattern

Day-2 matches Ethan BMaaS **Access** (not a card): **Host** + **SSH command** (clipboard-copy), above Networking.

| State | UI |
|---|---|
| **Not attached** | Host `—` + **Attach external IP** |
| **Attaching** | Host shows pending IP + “Attaching external IP…” |
| **Attached** | Host `<code>IP</code>` + SSH clipboard-copy + **Detach** |
| **Failed** | Inline error + **Retry** / **Choose another** |

**Demo failure:** attach modal → pick `198.51.100.99` (*Demo: simulate attach failure*).

---

## Coverage

| Spec / feedback | Status | Notes |
|---|---|---|
| Create VM Networking Ethan-aligned (OSAC-2616) | **Covered** | Attachment UX only |
| Tenant default + Custom + SG multi + EIP default on | **Covered** | |
| Additional networks Custom-only | **Covered** | |
| Day-2 Attach External IP modal | **Covered** | Project pool |
| External IP prominence (SSH access) | **Covered** | Ethan Access: Host + SSH clipboard |
| Attach **in progress** | **Covered** | Attaching state |
| Attach **failure** | **Covered** | Failed + Retry / Choose another |
| VN list / create / edit | **Out of scope** | [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433) |
| External IPs list page | **Out of scope** | [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433); day-2 attach only here |

---

## Decisions (confirmed)

1. **SG cardinality:** Multi-select (`securityGroupRefs[]`).
2. **Additional networks:** Custom path only.
3. **External IP default at create:** **On** (auto-attach).
4. **Step title:** **Networking**.
5. **Day-2 External IP:** Attach modal only (no EIP list in VMaaS).
6. **Virtual networks UX:** Owned by unified networking — [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433).

---

## Related

- Unified networking feature: [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433)
- Ethan sync: [OSAC-2616](https://redhat.atlassian.net/browse/OSAC-2616)
- VMaaS networking feature: [OSAC-1435](https://redhat.atlassian.net/browse/OSAC-1435)
- Prototype build: `7161` (*ethan-access* / restart-plain-labels)

---

## Screenshots

Local copies: `videos/osac-2621-networking-handoff/`
