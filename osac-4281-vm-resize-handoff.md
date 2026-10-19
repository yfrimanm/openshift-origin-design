# OSAC-4281 — VM resize via instance type (UX handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-4281](https://redhat.atlassian.net/browse/OSAC-4281) — *UX Design - VM Resize via InstanceType Selection* |
| **Parent epic** | [OSAC-5635](https://redhat.atlassian.net/browse/OSAC-5635) — *UIX - VM Resize Instancetype Selection* |
| **UI design (eng)** | [OSAC-4282](https://redhat.atlassian.net/browse/OSAC-4282) · [enhancement-proposals PR #388](https://github.com/osac-project/enhancement-proposals/pull/388) |
| **Scope** | Day-2 **Edit instance type** (resize) on VM details Overview |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7148) |
| **Companion docs** | [VM details Overview UX doc](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit) |
| **Handoff Google Doc** | [OSAC-4281 — VM resize via instance type (UX handoff)](https://docs.google.com/document/d/1kgln_LzTA3-VSP0SUM0jLce2Nvw0pix3oTYkwZuX-wE/edit) |
| **Status** | Design approved (`design-approved`, `osac-ux`). Spec covered in the shared prototype. Submit failures use **inline danger alert** in the modal (aligned to PR #388 / AttachExternalIpModal). |

---

## Goal

Allow tenants to change a VM’s **instance type** after create, with clear messaging for:

1. **Live hot-plug** (running + RWX boot disk) — mocked; eng ship may defer to [OSAC-5335](https://redhat.atlassian.net/browse/OSAC-5335) until API signals exist
2. **Restart required** (running + RWO / unknown)
3. **Apply on next start** (stopped)

No new API — uses existing `ComputeInstances.Update`. Backend gate: [OSAC-5328](https://redhat.atlassian.net/browse/OSAC-5328) (CEL immutability on `spec.instanceType`).

---

## Entry

VM details Overview → **Details** card → **Instance type** pencil → **Edit instance type** modal.

- Enabled when VM is **Running** or **Stopped**
- Disabled during **Starting** / **Stopping** / **Deleting** (tooltip explains why)
- **Roles:** **Tenant Admin** and **Tenant User** can resize (per [OSAC-4277](https://redhat.atlassian.net/browse/OSAC-4277)). Other Overview config (SSH, Network, Storage) stays read-only for Tenant User.

---

## Resize paths (spec ↔ mock)

| VM state | Boot disk access | Path | Modal behaviour | Demo VM in mock |
|---|---|---|---|---|
| Running | **RWX** | Hot-plug live | No warning. Primary CTA = **Apply Resize** (after a different type is selected) | `indigo-quokka-89` |
| Running | **RWO** / unknown | Restart required | Inline **warning**: *This resize requires a VM restart. The VM will not be restarted automatically.* CTA = **Save** | `azure-baboon-27`, `rhel9-black-gunnysack-58` |
| Stopped | Any | Restart required | Inline **info**: *Resize will apply on next start.* CTA = **Save** | `windows-golden-eider-58` |

Alerts appear only after the user selects a **different** instance type than the current one.

> **Eng note (PR #388):** Current ship scope is **restart-only** (Running warning + Stopped info). Hot-plug is deferred to OSAC-5335 until boot-disk access mode / restart-necessity is API-readable. Mock still shows the hot-plug path for UX preview.

---

## Modal content

| Element | Detail |
|---|---|
| Title | Edit instance type |
| Description | GPU / non-GPU guidance based on current VM configuration |
| Field | **Instance type** * — typeahead rich select (same catalog as create) |
| Power-state alert | Inline warning / info (see paths) — only when selection changed |
| Submit error | Inline **danger** alert inside the modal; modal stays open |
| Primary | **Apply Resize** (hot-plug + selection changed) or **Save** (restart paths / unchanged) |
| Secondary | Cancel |

GPU VMs stay in the GPU instance-type set; non-GPU VMs stay non-GPU. Client filter + server `FailedPrecondition` backstop.

---

## Feedback (success vs error)

| Outcome | Surface | Copy / behaviour |
|---|---|---|
| Success — hot-plug | **Toast** (success) | Instance type updated to {label}. |
| Success — restart (running) | **Toast** (success) | Instance type updated to {label}. Restart the virtual machine to apply the resize. |
| Success — restart (stopped) | **Toast** (success) | Instance type updated to {label}. Resize will apply on next start. |
| Submit failure (GPU mismatch, obsolete type, API error, etc.) | **Inline danger alert** in modal | Title: *Failed to update the instance type*. Description: error message (e.g. GPU / OBSOLETE `FailedPrecondition`). Modal stays open. |

**Decision (UXD sign-off for PR #388):** Error toast is replaced by an in-modal inline danger alert, matching AttachExternalIpModal. Success feedback stays as toasts.

---

## How to review in the mock

1. Open [the prototype](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7148) as **Tenant Admin** or **Tenant User**.
2. Open **indigo-quokka-89** → Instance type pencil → pick another type → confirm **Apply Resize** (no alert).
3. Open **azure-baboon-27** (Running + RWO) → change type → see **warning** alert.
4. Open **windows-golden-eider-58** (Stopped) → change type → see **info** alert.
5. Try a starting/stopping/error VM → edit should be unavailable.
6. As **Tenant User**, confirm Instance type pencil works, while SSH / Network / Storage edits stay disabled.
7. Force a GPU-class mismatch (if reachable) → inline **danger** alert in the modal; no error toast.

---

## Out of scope (this handoff)

- [OSAC-4864](https://redhat.atlassian.net/browse/OSAC-4864) — Instance type becomes vCPU+memory only; GPU as separate device add-on (future modal section)
- Automatic restart after resize
- Changing boot disk access mode from this modal
- Hot-plug delivery in production until [OSAC-5335](https://redhat.atlassian.net/browse/OSAC-5335)

---

## Engineering notes

- UI can ship in parallel with OSAC-5328; until that lands, update may be rejected by API.
- Resize path is derived from **power state** + **boot disk access mode** (`RWX` / `RWO` / unknown) in the mock; eng restart-only scope may use power state alone until OSAC-5335.
- Submit errors: inline danger alert; success: toast (PR #388).
- Prototype build: `7148` (*resize-inline-error*).

---

## Open questions

1. **Hot-plug in mock vs eng ship:** Keep **Apply Resize** / RWX path in the mock for UX preview while eng ships restart-only first — or temporarily hide hot-plug in the mock to match PR #388 scope?
2. **GPU description copy:** PR proposes slightly different modal description wording (“uses a GPU / non-GPU instance type…”). Keep current handoff/mock copy, or adopt PR wording?
