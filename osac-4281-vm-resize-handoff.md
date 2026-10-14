# OSAC-4281 — VM resize via instance type (UX handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-4281](https://redhat.atlassian.net/browse/OSAC-4281) — *UX Design - VM Resize via InstanceType Selection* |
| **Parent epic** | [OSAC-5635](https://redhat.atlassian.net/browse/OSAC-5635) — *UIX - VM Resize Instancetype Selection* |
| **Scope** | Day-2 **Edit instance type** (resize) on VM details Overview |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html) |
| **Companion docs** | [VM details Overview UX doc](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit) |
| **Status** | Design approved (`design-approved`, `osac-ux`). Spec covered in the shared prototype. |

---

## Goal

Allow tenants to change a VM’s **instance type** after create, with clear messaging for:

1. **Live hot-plug** (running + RWX boot disk)
2. **Restart required** (running + RWO / unknown)
3. **Apply on next start** (stopped)

No new API — uses existing `ComputeInstances.Update`. Backend gate: [OSAC-5328](https://redhat.atlassian.net/browse/OSAC-5328) (CEL immutability on `spec.instanceType`).

---

## Entry

VM details Overview → **Details** card → **Instance type** pencil → **Edit instance type** modal.

- Enabled when VM is **Running** or **Stopped**
- Disabled during **Starting** / **Stopping** / **Deleting** (tooltip explains why)
- **Tenant User:** edit control disabled (read-only Overview config)

---

## Resize paths (spec ↔ mock)

| VM state | Boot disk access | Path | Modal behaviour | Demo VM in mock |
|---|---|---|---|---|
| Running | **RWX** | Hot-plug live | No warning. Primary CTA = **Apply Resize** (after a different type is selected) | `indigo-quokka-89` |
| Running | **RWO** / unknown | Restart required | Inline **warning**: *This resize requires a VM restart. The VM will not be restarted automatically.* CTA = **Save** | `azure-baboon-27`, `rhel9-black-gunnysack-58` |
| Stopped | Any | Restart required | Inline **info**: *Resize will apply on next start.* CTA = **Save** | `windows-golden-eider-58` |

Alerts appear only after the user selects a **different** instance type than the current one.

---

## Modal content

| Element | Detail |
|---|---|
| Title | Edit instance type |
| Description | GPU / non-GPU guidance based on current VM configuration |
| Field | **Instance type** * — typeahead rich select (same catalog as create) |
| Primary | **Apply Resize** (hot-plug + selection changed) or **Save** (restart paths / unchanged) |
| Secondary | Cancel |

GPU VMs stay in the GPU instance-type set; non-GPU VMs stay non-GPU (mismatch blocked with toast).

---

## Success toasts

| Path | Toast |
|---|---|
| Hot-plug | Instance type updated to {label}. |
| Restart (running) | Instance type updated to {label}. Restart the virtual machine to apply the resize. |
| Restart (stopped) | Instance type updated to {label}. Resize will apply on next start. |

---

## How to review in the mock

1. Open [the prototype](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html) (Tenant Admin).
2. Open **indigo-quokka-89** → Instance type pencil → pick another type → confirm **Apply Resize** (no alert).
3. Open **azure-baboon-27** (Running + RWO) → change type → see **warning** alert.
4. Open **windows-golden-eider-58** (Stopped) → change type → see **info** alert.
5. Try a starting/stopping/error VM → edit should be unavailable.

---

## Out of scope (this handoff)

- [OSAC-4864](https://redhat.atlassian.net/browse/OSAC-4864) — Instance type becomes vCPU+memory only; GPU as separate device add-on (future modal section)
- Automatic restart after resize
- Changing boot disk access mode from this modal

---

## Engineering notes

- UI can ship in parallel with OSAC-5328; until that lands, update may be rejected by API.
- Resize path is derived from **power state** + **boot disk access mode** (`RWX` / `RWO` / unknown).
- Prototype commit: `17b128ef` (*Cover OSAC-4281 VM resize hot-plug and restart paths*).
