# Memory request ratio — UX documentation

- Related bug: [CNV-88963](https://redhat.atlassian.net/browse/CNV-88963)

## Goal

Replace **Memory density** under **Virtualization → Settings → Cluster → General settings** with a control admins can understand: the **memory request ratio** — requested memory as a percentage of **configured memory**, on a **0–100%** range.

Admins should be able to:

- Set the cluster-wide default ratio with a **number input** (no slider)
- **Save** when the value changes
- **Restore default** to reset the field to the product default (**97.5%**)
- Read full context in the **?** help popover (not inline helper text)

**Success:** admins set the cluster default without interpreting legacy *memory density* / *overcommit* terminology, VMware *reservation* language, or values above 100%.

*Scope: cluster settings only in this mockup. KSM is shown on the page but is unchanged by this proposal.*

## UX summary

### Current problem (today)

The current **Memory density** control uses a percentage slider that can go above 100%. It does not explain **configured** vs **requested** memory, so values like 120% are hard to interpret without backend context. Bounding the UI at **0–100%** ties the control to one relationship admins can reason about: **requested ÷ configured**.

### Terminology

We are replacing the existing **Memory density** with **Memory request ratio**. The **memory request ratio** is the **percentage of** each VM's **configured memory** (the VM's memory size) that is **requested** on the cluster, on a **0–100%** range. This setting sets the cluster-wide default ratio for all VMs.

### Control

We are replacing the slider with a **PF6 Number input with unit** (− / numeric field / + / **%**). The ratio is always enabled — no on/off toggle. **?** and **New** appear on the accordion title (**Memory request ratio**). Two distinct values appear inside the accordion:

1. **Applied ratio** — read-only, live cluster calculation (may differ from saved)
2. **Saved ratio** — editable cluster default (Save / Restore default)

Full concept context is in the accordion **?** help popover.

### Applied ratio

Show the **live cluster ratio** above the saved-ratio control:

**Applied ratio: 94.2%** **[?]**

- **Read-only** — calculated across VMs on the cluster in real time
- Reflects active workload and resource availability; may differ from **Saved ratio** when the cluster has headroom (overcommit behavior intensifies under load)
- Updates from the backend (static **94.2%** in the mockup to show it can differ from saved **97.5%**)

**Applied ratio ? popover:**

> The actual real-time memory ratio currently calculated across all VMs on the cluster. This fluctuates based on active system load and resource availability.

### Saved ratio

Label the editable control **Saved ratio** **[?]** — the cluster-wide default the admin sets:

**Saved ratio** **[?]**  
**[−] [ 97.5 ] [+] %**

- Editable — reflects the last **saved** setting when unchanged; unsaved edits show **Save**
- Updates in the cluster when the admin clicks **Save**
- Distinct from the **product default** (**97.5%**) used by **Restore default**

**Saved ratio ? popover:**

> After changes are saved, they apply cluster-wide:  
> **New VMs:** Use the saved ratio immediately, unless they have a specific ratio set by the VM owner.  
> **Running VMs:** Retain their current ratio until they reboot or migrate.

### Validation

If the value is outside **0–100**, we show: **Enter a value from 0 to 100.**

### Ratio levels (traffic light)

A lower ratio requests less memory on the cluster and increases overcommit risk.

When the value is valid, show a colored dot and short label below the number input. This is informational only and does not block **Save**.

Level definitions are in the **?** help popover.

| Level | Range | Label | Meaning |
|---|---|---|---|
| **Green** | **75% – 100%** | Recommended | Requests most of each VM's configured memory on the cluster. Product default **97.5%** is in this range. |
| **Yellow** | **50% – 74.9%** | Use with caution | Moderate overcommit. Monitor cluster memory pressure. |
| **Red** | **Below 50%** | High overcommit risk | Aggressive overcommit. Each VM requests **less than half** of its configured memory. |

*Thresholds are proposed for the mockup — confirm with engineering and PM before implementation.*

### Save

We show **Save** (secondary button) only when the entered value differs from the saved cluster setting. No **Cancel** button.

### Restore default

When the value has been edited, **Restore default** (link button) appears to the right of **Save**. It resets the field to **97.5%** without saving. If **97.5%** matches the saved setting, the action row is hidden again.

## Replacing the current control

| Today (Memory density) | Proposed |
|---|---|
| Label: **Memory density** | Accordion: **Memory request ratio** |
| **?** mentions swap / higher density | **?** defines request ratio vs configured memory |
| Percentage slider (can exceed 100%) | **PF6 Number input with unit**, **0–100%** only |
| VMware-style *reservation* framing | Kubernetes-style **request** framing |
| Opaque density percentage | **Applied ratio** readout + **Saved ratio** input; default **97.5%**; **Restore default** link; traffic-light ratio levels |

## Why this terminology

- **This is a ratio, not a sharing policy.** The **memory request ratio** is the **percentage of** each VM's **configured memory** that is **requested** on the cluster — not whether VMs “share memory” with each other. An earlier proposal used sharing policy cards; review feedback ([CNV-88963](https://redhat.atlassian.net/browse/CNV-88963)) clarified the real model is a **percentage between configured and requested memory** at cluster level.

- **Configured memory is the anchor (100%).** **Configured memory** is the VM's memory size. The ratio is always requested ÷ configured, on a **0–100%** range — e.g. **25%** on a 4 GiB VM means 1 GiB requested on the cluster; **100%** means the full configured amount.

- **“Reservation ratio” → “Memory request ratio”.** Review first suggested **reservation ratio** (reserved ÷ configured), which aligns with VMware's configured vs **reservation** vocabulary. We renamed to **memory request ratio** to avoid VMware-specific **reservation** language in the OpenShift console and to align with KubeVirt/Kubernetes **request** and **limit** terms used elsewhere in OCP. Engineering still needs to confirm which backend field this maps to.

- **Avoid legacy “memory density”.** The old control allowed values above 100% (e.g. 125% applied / 250% target) without explaining configured vs requested. **“Density” sounds like a 0–100% fraction of VM memory**, so values like 120% or 250% leave admins guessing the denominator (configured memory? host RAM? an internal target?). Admins had to decode backend overcommit math. Bounding the UI at **0–100%** and naming **requested ÷ configured** keeps the control tied to one relationship admins can reason about without admin-doc context.

## Design principles

### No values above 100% in the UI

The previous **memory density** design showed ratios above 100%. That did not map to a clear **configured vs requested** relationship. This design caps the UI at **0–100%** only.

Legacy backend values above 100% are **out of scope for display** — confirm migration/read-only handling with engineering.

### Plain language

Avoid *memory density*, *overcommit*, *reservation*, and swap/density framing in this control's UI copy. Use **memory request ratio**, **configured memory**, and **requested**.

### Minimal surface area

- Accordion title **Memory request ratio** + **?** defines the concept
- **Applied ratio** readout (live) and **Saved ratio** label + input (user setting) — two distinct values
- No always-visible range helper under the input — the **%** unit and min/max imply the range
- Colored **ratio level** indicator (dot + label) below the **Saved ratio** input for valid values
- No rollout progress bar or per-VM applied-status dashboard

## Layout (mockup)

```
Memory request ratio  [New] [?]               [accordion, expanded]
└── Applied ratio: 94.2%  [?]                [read-only; live cluster value]
    Saved ratio  [?]                           [label for editable control]
    [−] [ 97.5 ] [+] %                         [PF6 Number input with unit]
    ● Recommended                               [traffic-light level; valid values only]
    [Save]  [Restore default]                 [visible when saved value changed]

Kernel Samepage Merging (KSM)  [?]            [toggle; left-aligned with accordions]
```

### Interaction

1. **Default** — mockup loads at **97.5%** (product default).
2. **Edit value** — type or use **−** / **+** (**0.1%** steps, min **0**, max **100**).
3. **Save** — secondary button appears only when **Saved ratio** differs from the last saved setting.
4. **Rollout** — running VMs apply the saved ratio after reboot or migrate; **Applied ratio** may differ until load increases.
5. **Restore default** — link button appears with **Save**; resets the field to **97.5%**.

### Component

Use **PatternFly 6 Number input with unit** (`pf-v6-c-number-input`):

- Minus / numeric field / plus control group
- **%** as `pf-v6-c-number-input__unit`
- Minus disabled at **0%**; plus disabled at **100%**
- Validation error only on invalid input (e.g. out of range)

## Concepts

| Term | Meaning |
|---|---|
| **Configured memory** | The VM's memory size |
| **Memory request** | Portion of configured memory requested on the cluster |
| **Memory request ratio** | Requested ÷ configured, on a 0–100% range (accordion / concept name) |
| **Applied ratio** | Live ratio calculated across VMs on the cluster (read-only) |
| **Saved ratio** | Cluster-wide default the admin sets and saves (editable) |
| **Cluster default** | Same as saved ratio — applies to new VMs cluster-wide |
| **Product default** | **97.5%** (mockup) |

## Copy reference (mockup)

| Element | Copy |
|---|---|
| Accordion | **Memory request ratio** |
| Applied ratio | **Applied ratio:** **94.2%** with **?** (read-only; live cluster value) |
| Applied ratio **?** popover | The actual real-time memory ratio currently calculated across all VMs on the cluster. This fluctuates based on active system load and resource availability. |
| Saved ratio | **Saved ratio** label with **?** above number input |
| Saved ratio **?** popover | After changes are saved, they apply cluster-wide: **New VMs:** Use the saved ratio immediately, unless they have a specific ratio set by the VM owner. **Running VMs:** Retain their current ratio until they reboot or migrate. |
| Badge | **New** (accordion header only) |
| **?** popover (accordion) | **Memory request ratio** — The percentage of each VM's configured memory that is requested on the cluster. **Formula:** requested ÷ configured, on a 0–100% range. At **25%**, a 4 GiB VM requests 1 GiB on the cluster. At **100%**, it requests the full configured amount of 4 GiB. This setting is the cluster-wide default for all VMs. **Ratio levels:** … |
| Ratio level indicator | Colored dot + label below input: **Recommended** / **Use with caution** / **High overcommit risk** |
| Number input (aria) | Saved ratio |
| Unit | **%** |
| Save | **Save** (secondary) |
| Restore default | **Restore default** (link) |
| Validation error | Enter a value from 0 to 100. |

## Out of scope (this mockup)

- VM create/edit memory request fields
- Rollout progress bar / per-VM applied-status dashboard
- Display or edit of legacy density values **> 100%**
- KSM behavior (unchanged)
- Enable/disable toggle for the ratio (always on per PM)

## Open questions for engineering

- Does **memory request ratio** (requested ÷ configured) match the HyperConverged / memory density API field?
- Is **97.5%** the correct product default from the backend?
- Is this the same as limit-to-request ratio, or a different metric?
- **Applied ratio** — API source, refresh interval, and relationship to saved ratio under load
- Legacy density **> 100%** — migration, read-only display, or hide?
- **Ratio level thresholds (75% / 50%)** — confirm with engineering and PM
