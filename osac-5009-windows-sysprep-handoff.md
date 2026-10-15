# OSAC-5009 — Create Windows VMs with Unattend.xml / Sysprep (UX handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-5009](https://redhat.atlassian.net/browse/OSAC-5009) — *UX Design - Create Windows VMs with a caller-supplied Unattend.xml* |
| **Parent epic** | [OSAC-5687](https://redhat.atlassian.net/browse/OSAC-5687) — *UIX - Create Windows VMs* |
| **Feature** | [OSAC-4705](https://redhat.atlassian.net/browse/OSAC-4705) — *Create Windows VMs with a caller-supplied Unattend.xml* |
| **Eng stories** | [HPUX-2253](https://redhat.atlassian.net/browse/HPUX-2253) / [HPUX-2254](https://redhat.atlassian.net/browse/HPUX-2254) — *Create Windows VM with Sysprep* |
| **Scope of this handoff** | Create VM wizard → **Access & Initial run** for Windows (Sysprep Unattend.xml: Attach existing / Create new), as specified in the Windows Sysprep Create UX tab |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7147) |
| **UX source tab** | [VMaaS prototype — UX documentation → Windows Sysprep Create](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.ty4w66xwh2mw) |
| **Handoff Google Doc** | [OSAC-5009 — Create Windows VMs with Unattend.xml / Sysprep (UX handoff)](https://docs.google.com/document/d/1NpRGPRKJP-HG769O2Q_7RPagKyfpGTFr_NQkeL1WNWU/edit) |
| **Status** | **Fully covered** for Create VM Windows Access & Initial run (OSAC-5009 / UX tab). Catalog Provide-default Unattend deferred; SSH stays hidden for Windows; day-2 Sysprep edit out of scope. |

---

## Goal

Let tenants supply an optional Windows **Unattend.xml** at VM create time for first-boot Sysprep customization. Content is write-only (stored as a secret; never returned on GET). Linux path on the same step stays SSH + Cloud-init; Windows never shows SSH.

---

## How to review in the mock

1. Open the [mock](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7147) as **Tenant Admin**.
2. **Create virtual machine** → on **Details**, choose Guest OS **Microsoft Windows** (or a Windows disk image / catalog path that sets Windows).
3. Continue to **Access & Initial run** (Optional).
4. Confirm **no SSH public key** field; Sysprep section with **Windows only** badge.
5. **Create new Sysprep** — upload/paste Unattend.xml; optional **Save as secret**; leave empty to boot without an answer file.
6. **Attach existing Sysprep** — pick a saved secret (demo: `corp-windows-unattend`, `skip-oobe-unattend` in project-a).
7. **Review** → Access & Initial run shows method + **Provided (hidden)** (or secret name for Attach); never echoes XML body.
8. Contrast: set Guest OS to **Linux** on the same step → SSH + Cloud-init; no Sysprep cards.

---

## Coverage vs OSAC-5009 + Windows Sysprep Create UX tab

| Spec item | Status | Notes |
|---|---|---|
| Windows-only Unattend / Sysprep UI | **Covered** | Driven by Guest OS / `isWindowsOs` |
| Optional — omit to boot without answer file | **Covered** | Step badge Optional; empty Unattend allowed |
| Write-only secret; Review = Provided (hidden) | **Covered** | `sysprepReviewDisplay`; attach shows secret name |
| Create-time only (no day-2 update in scope) | **Covered** | No Edit Sysprep on VM Overview in this scope |
| SSH hidden for Windows | **Covered** | `sshHtml` empty; key cleared when Windows |
| Felt mode cards: Attach existing / Create new | **Covered** | Same pattern as Guest OS |
| Create: upload or paste Unattend.xml | **Covered** | PF file-upload + textarea |
| Max 1 MiB client check | **Covered** | Toast if over size |
| Soft well-formed XML check (`unattend` root) | **Covered** | Soft; server remains SoT |
| Save as secret for future Attach | **Covered** | Checkbox + optional secret name |
| Attach: project-scoped secret typeahead | **Covered** | Empty-state helper when none |
| Linux path unchanged (SSH + Cloud-init) | **Covered** | Same wizard step |
| No new routes / nav | **Covered** | Existing Create VM wizard only |

**Verdict (OSAC-5009 Create VM Windows Sysprep):** Fully covered.

---

## Out of scope (documented for awareness)

| Topic | Notes |
|---|---|
| Catalog **Provide default** Unattend on Create catalog item | Separate surface (Create catalog item → Access). Not required for OSAC-5009 create-time Unattend field. |
| Day-2 edit / replace Sysprep after create | Explicitly out of ticket (“Create-time only”) |
| API / CEL / `unattend_xml` field wiring | Eng ([HPUX-2253](https://redhat.atlassian.net/browse/HPUX-2253) / [HPUX-2254](https://redhat.atlassian.net/browse/HPUX-2254)) |

---

## Entry & surfaces

| Surface | Path |
|---|---|
| Create VM | Creation method → Details (Guest OS Windows) → … → **Access & Initial run** → Review |
| Review rows | Access method (Password / RDP); Sysprep method; Sysprep (Unattend.xml) |
| Demo secrets | `corp-windows-unattend`, `skip-oobe-unattend` (project-a); `rdp-admin-unattend` (project-b) |
| Demo Windows VM (configured) | `windows-golden-eider-58` shows Sysprep secret link on Overview (read-only display) |

---

## Design constraints (ticket → mock)

| Constraint | Mock decision |
|---|---|
| Max size 1 MiB | Enforced client-side with toast |
| Windows detection | Guest OS family / disk image → Windows |
| SSH for Windows | **Hidden** entirely (not shown as optional) |
| Catalog `StringFieldPolicy` for `unattend_xml` | Eng decision; UX assumes optional create-time field |

---

## Related

- UX tab: [Windows Sysprep Create](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit?tab=t.ty4w66xwh2mw)
- Feature: [OSAC-4705](https://redhat.atlassian.net/browse/OSAC-4705)
- Epic: [OSAC-5687](https://redhat.atlassian.net/browse/OSAC-5687)
- Screenshots (gh-pages): `screenshots/create` (see UX tab)

---

## Decisions (confirmed)

1. **Scope:** “Fully covered” = Create VM **Access & Initial run** (Windows Sysprep) only — not Catalog Provide-default Unattend.
2. **SSH for Windows:** Remains **hidden** (not optional for OpenSSH images).
3. **Follow-ups:** No Catalog default Unattend UX tickets for now; leave on Create catalog item tab / eng stories.
