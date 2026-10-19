# OSAC-4281 — VM resize via instance type (UX handoff)

### Contact: Yifat Friman Menchik, UXD

## Handoff overview

| | |
|---|---|
| **Jira** | [OSAC-4281](https://redhat.atlassian.net/browse/OSAC-4281) — *UX Design - VM Resize via InstanceType Selection* |
| **Parent epic** | [OSAC-5635](https://redhat.atlassian.net/browse/OSAC-5635) — *UIX - VM Resize Instancetype Selection* |
| **UI design (eng)** | [OSAC-4282](https://redhat.atlassian.net/browse/OSAC-4282) · [enhancement-proposals PR #388](https://github.com/osac-project/enhancement-proposals/pull/388) |
| **Scope** | Day-2 **Edit instance type** (resize) on VM details Overview |
| **Interactive mock** | [vmaas-ux-prototype.html](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7151) |
| **Companion docs** | [VM details Overview UX doc](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit) |
| **Handoff Google Doc** | [OSAC-4281 — VM resize via instance type (UX handoff)](https://docs.google.com/document/d/1kgln_LzTA3-VSP0SUM0jLce2Nvw0pix3oTYkwZuX-wE/edit) |
| **Status** | Revised after eng review: **no pre-submit restart/hot-plug detection** in the UI. Restart need comes from API **status conditions after** update. |

---

## Goal

Allow tenants to change a VM’s **instance type** after create via `ComputeInstances.Update`.

The UI must **not** invent whether a resize will hot-plug or require a restart before submit. The API announces restart necessity through **status conditions after** the resize event — the UI surfaces that transition then (toast + Overview condition), not by reimplementing path logic client-side.

Backend gate: [OSAC-5328](https://redhat.atlassian.net/browse/OSAC-5328) (CEL immutability on `spec.instanceType`).

---

## Entry

VM details Overview → **Details** card → **Instance type** pencil → **Edit instance type** modal.

- Enabled when VM is **Running** or **Stopped**
- Disabled during **Starting** / **Stopping** / **Deleting** (tooltip explains why)
- **Roles:** **Tenant Admin** and **Tenant User** can resize (per [OSAC-4277](https://redhat.atlassian.net/browse/OSAC-4277)). Other Overview config (SSH, Network, Storage) stays read-only for Tenant User.

---

## Modal behaviour (ship)

| VM power state | Pre-submit modal | Primary CTA |
|---|---|---|
| **Running** | No restart/hot-plug warning. UI does not predict restart need. | **Save** |
| **Stopped** | Optional inline **info** (power state only): *Resize will apply on next start.* | **Save** |

- Alerts that claim “this resize requires a restart” **before** submit are **out** — the API cannot tell the UI that ahead of time.
- Boot-disk access mode (RWX/RWO) is **not** used for modal messaging.
- Hot-plug / **Apply Resize** pre-submit path is **removed** from ship UX (future platform capability; not UI-guessed).

---

## Feedback after update

| Outcome | Surface | Behaviour |
|---|---|---|
| Success (generic) | **Toast** | Instance type updated to {label}. |
| Success + API condition says restart needed | **Toast** and/or Overview **status condition** | Surface the platform message (e.g. restart required). Do not invent the condition in the client. |
| Success + VM was stopped | **Toast** | Instance type updated to {label}. Resize will apply on next start. *(power state known up front)* |
| Submit failure | **Inline danger alert** in modal | Title: *Failed to update the instance type*. Description: error message. Modal stays open. |

**Decision (PR #388):** Submit errors = in-modal inline danger alert (AttachExternalIpModal pattern). Success = toast (+ conditions when the API provides them).

---

## Modal content

| Element | Detail |
|---|---|
| Title | Edit instance type |
| Description | *Select a new instance type for this virtual machine.* (no GPU/non-GPU copy — GPU is independent of vCPU/memory) |
| Field | **Instance type** * — typeahead rich select (same ACTIVE catalog as create) |
| Pre-submit alert | Only optional **Stopped** info (see above). No Running restart warning. |
| Submit error | Inline **danger** alert; modal stays open |
| Primary | **Save** |
| Secondary | Cancel |

---

## Source of truth (clarified)

| Artifact | Role |
|---|---|
| Original OSAC-4281 ticket “two paths” table | **Historical UX intent** (pre-submit hot-plug vs restart). **Superseded** for ship. |
| This handoff (revised) | **Current UX contract** for UI design / OSAC-4282 |
| API status conditions | **Source of truth** for restart-required *after* resize |
| [OSAC-5335](https://redhat.atlassian.net/browse/OSAC-5335) | Hot-plug **environment / testing** follow-up — not “make restart need API-visible before submit” |

---

## How to review in the mock

1. Open [the prototype](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=7151) as **Tenant Admin** or **Tenant User**.
2. Open a **Running** VM → Instance type pencil → change type → **Save** (no pre-submit restart warning; CTA is Save).
3. Open a **Stopped** VM → change type → optional **info** “applies on next start” → **Save**.
4. After a Running resize, Overview may show a **demo status condition** for restart-required (stands in for API conditions).
5. Starting/stopping/error VMs → edit unavailable.
6. **Tenant User** → Instance type pencil works; SSH / Network / Storage stay read-only.
7. Submit failure → inline **danger** alert in the modal.

---

## Out of scope (this handoff)

- [OSAC-4864](https://redhat.atlassian.net/browse/OSAC-4864) — Instance type = vCPU+memory only; GPU as separate device add-on
- Automatic restart after resize
- Pre-submit detection of hot-plug vs restart (not API-supported)
- Changing boot disk access mode from this modal

---

## Engineering notes

- UI can ship in parallel with OSAC-5328; until that lands, update may be rejected by API.
- Wire success UX to Update response + **status conditions**; do not reimplement resize-path detection from boot-disk access mode.
- Submit errors: inline danger alert (PR #388).
- Prototype build: `7151` (*resize-no-gpu-desc*).
- Modal description does **not** mention GPU (Jonathan feedback).

---

## Open questions

1. **Post-resize condition UX:** Prefer toast copy from the condition message, an Overview inline alert, or both? Align with eng on the exact condition type/name.
