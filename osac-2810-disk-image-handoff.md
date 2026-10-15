# OSAC-2810 — DiskImage resource UX (handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-2810](https://redhat.atlassian.net/browse/OSAC-2810) — *UX Design - DiskImage resource for disk image metadata management* |
| **Parent epic** | [OSAC-2807](https://redhat.atlassian.net/browse/OSAC-2807) — *DiskImage resource… — Bootstrap* |
| **Feature** | [OSAC-2540](https://redhat.atlassian.net/browse/OSAC-2540) — *DiskImage resource for disk image metadata management* |
| **Scope of this handoff** | Provider **Disk images** UX in the shared mock (list · create · detail · lifecycle), as specified in the Disk images UX tab |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7147&role=provider) |
| **UX source tab** | [VMaaS prototype — UX documentation → Disk images](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.uxouanov03p1) |
| **Status** | OSAC-2810 **Closed**. **Fully covered** for provider Disk images UX tab scope. Broader OSAC-2540 UI gaps are deferred (no UX follow-ups for now; delete-if-referenced left to eng). |

---

## Goal

Enable Cloud Provider Admins to manage DiskImage metadata in the console: register OCI image references with human-readable metadata, control Global vs Tenant visibility, and run lifecycle (Available → Deprecated → Obsolete → Delete / Reactivate), without requiring CLI/API for day-to-day admin.

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7147&role=provider) with Role = **Cloud provider admin**.
2. Nav: **Infrastructure → Disk images**.
3. Confirm **Show obsolete** is off → `fedora-39` (Obsolete) is hidden; turn it on to reveal.
4. Open **rhel-9-5** (Available) → Overview + Image columns; Actions: Deprecate / Obsolete.
5. Open **rhel-9-4** (Deprecated) → Actions: Obsolete / Reactivate.
6. With Show obsolete on, open **fedora-39** → Actions: Reactivate / Delete.
7. **Create disk image** → Scope (Global / Tenant) → Configuration (Image, Guest OS, Architecture) → Review → lands on new detail.

---

## Coverage vs OSAC-2810 UX tab

Primary acceptance for this ticket is the **Disk images** UX tab (list / create / detail / lifecycle). Against that tab:

| Spec item | Status | Notes |
|---|---|---|
| List columns: Name, Lifecycle, Guest OS, Architecture, Visibility, Created, Actions | **Covered** | Provider table + kebab |
| Show obsolete (off by default) | **Covered** | `#di-show-obsolete` |
| Create CTA | **Covered** | Create disk image |
| Create: Scope Global / Tenant (felt) + Tenant when scoped | **Covered** | Same pattern as Instance types |
| Create: Name (DNS), Image (OCI), Guest OS, Architecture multi-select | **Covered** | Also Description + Labels on General (extra vs tab table) |
| Create Review (Nebius sections) → success → detail | **Covered** | |
| Detail: Overview + Image columns; header Actions | **Covered** | Description not shown on detail (minor) |
| Lifecycle: Available→Deprecate/Obsolete; Deprecated→Obsolete/Reactivate; Obsolete→Reactivate/Delete | **Covered** | Mirrors osac-ui actions |
| Role: Cloud provider admin | **Covered** | Infrastructure nav gated |

**Verdict (OSAC-2810 UX tab):** Fully covered for provider Disk images manage UX.

---

## Deferred vs full feature OSAC-2540 (out of OSAC-2810 scope)

Not required for OSAC-2810 acceptance. Captured for awareness; **no UX follow-ups filed for now**.

| Topic | Decision |
|---|---|
| Tenant Admin DiskImage manage UI + create-picker lifecycle (deprecate warning / obsolete filter / single data source) | Deferred — no UX work now |
| Delete blocked when referenced | Left to engineering |

---

## Entry & surfaces (provider)

| Surface | Path |
|---|---|
| List | Infrastructure → **Disk images** |
| Create | **Create disk image** (General → Configuration → Review) |
| Detail | Name link from list |
| Lifecycle | List kebab or detail **Actions** |

### Demo data (useful for review)

| Name | Lifecycle | Visibility |
|---|---|---|
| `rhel-9-5` | Available | Global |
| `rhel-9-4` | Deprecated | Global |
| `windows-2022` | Available | project-a |
| `centos-stream-9` | Available | Global |
| `fedora-39` | Obsolete | yifat |

---

## Related

- Feature PRD: [OSAC-2540](https://redhat.atlassian.net/browse/OSAC-2540)
- Bootstrap epic: [OSAC-2807](https://redhat.atlassian.net/browse/OSAC-2807)
- Companion screenshot: `videos/vmaas-prototype-ux-doc/15-create-disk-image.png`
- Aligned eng PRs noted in UX tab: osac-ui PR 164 (list/create), PR 177 (detail)

---

## Decisions (confirmed)

1. **Scope:** “Fully covered” = Disk images UX tab (**provider** list / create / detail / lifecycle) only — not the full OSAC-2540 DoD.
2. **Follow-ups:** No Tenant Admin manage / create-picker lifecycle UX tickets for now.
3. **Delete-if-referenced:** Leave to engineering (no prototype mock of blocked delete).
