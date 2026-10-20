# Virtual networks

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Feature** | [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433) — *Unified Networking Architecture* (UI Goal: VirtualNetworks / Subnets / SGs / ExternalIPs / NAT) |
| **Scope of this handoff** | Tenant **Virtual networks** manage UX in the shared VMaaS mock (list · create · detail). Pulled out of VMaaS Tenant Networking so VM attach + External IP stay in [Tenant Networking](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit). |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7162&nav=networks) |
| **Handoff Google Doc** | [Virtual networks](https://docs.google.com/document/d/1ZV8NBeRQzeW8vKeR1D-XlZy-FFFAVDwvKJRkZMOmYwY/edit) |
| **Shared UX tab (pointer)** | [VMaaS prototype — UX documentation → Virtual networks](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.j5bvza9g1n7m) |
| **MD handoff** | [vmaas-virtual-networks-ux-doc.md](https://github.com/yfrimanm/openshift-origin-design/blob/vmaas-create-vm-wizard/vmaas-virtual-networks-ux-doc.md) |
| **Companion** | [Tenant Networking](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit) — Create VM Networking + day-2 External IP |
| **Status** | Documented from current mock. Subnet / SG / NAT **create** CTAs are stubbed (disabled) in the prototype. |

---

## Goal

Give tenants a shared **Virtual networks** surface (list → create → detail) for address space used by VMs, bare metal, and clusters — without duplicating that CRUD inside the VMaaS Create VM / Overview networking handoff.

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7162&nav=networks) as **Tenant Admin**.
2. Nav: **Networking → Virtual networks**.
3. Confirm list columns, status filter, search, list/card toggle.
4. Open **tenant-workload** → Overview / Configuration / NAT / Subnets / Security groups.
5. **Create virtual network** → Details (Name, Description, IPv4 CIDR, IPv6 CIDR) → Review → create.

---

## Surfaces

### List

| Column | Notes |
|---|---|
| Name | Link → detail |
| Status | Ready / Provisioning (+ filter) |
| IPv4 CIDR · IPv6 CIDR | |
| Subnets · Security groups | Counts |
| NAT gateway | Name / IP when attached |
| Actions | Kebab (delete where enabled) |

Toolbar: status filter · search · card/list toggle. Primary CTA: **Create virtual network**.

### Create virtual network

| Step | Contents |
|---|---|
| Details | Name (DNS label) · Description · IPv4 CIDR (required) · IPv6 CIDR (optional) |
| Review | Nebius-style summary + edit links · **Create virtual network** |

### Detail

| Area | Contents |
|---|---|
| Header | Breadcrumb · title · description · Actions (stub) |
| Overview | Status · Created · Project |
| Configuration | IPv4 CIDR · IPv6 CIDR |
| NAT gateway | Attached name/IP or empty + Manage / + Attach (stub) |
| Subnets | List with status / CIDR / VLAN · + Add (stub) |
| Security groups | List with status / summary · + Add (stub) |

### Demo data

| Name | Status | Project | NAT |
|---|---|---|---|
| `tenant-workload` | Ready | project-a | edge-nat · 203.0.113.10 |
| `shared-services` | Ready | vmaas | — |

---

## Out of scope (this Doc)

| Topic | Notes |
|---|---|
| Create VM → Networking attach | [Tenant Networking](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit) |
| Day-2 External IP (Host + SSH) | Tenant Networking |
| External IPs **list** page | OSAC-1433 (not in this mock surface) |
| Subnet / SG / NAT full CRUD | Stubbed in mock; fuller unified UI under OSAC-1433 |

---

## Related

- Feature: [OSAC-1433](https://redhat.atlassian.net/browse/OSAC-1433)
- VMaaS attach + EIP: [Tenant Networking](https://docs.google.com/document/d/1Bb-TzaXkhdASe6btymwRk2u0wXycwyqS-I8h637hDGY/edit)
- Prototype build: **7162**
