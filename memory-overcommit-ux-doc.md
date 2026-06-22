# Memory sharing policy — UX documentation

- Interactive mockup: [memory-overcommit-ux-mockup.html](./memory-overcommit-ux-mockup.html)
- Browser view: [memory-overcommit-ux-doc.html](./memory-overcommit-ux-doc.html)

## Goal

Proposal to replace **Memory density** under **Virtualization → Settings → Cluster → General settings**.

Help cluster admins configure how VM memory is **shared or reserved** across the cluster without interpreting abstract percentages or admin-only terminology.

Admins should be able to:

- Turn memory sharing on or off for the cluster
- Choose a memory policy that matches their workloads (share by default, reserve all, or reserve a minimum)
- Understand that the policy applies to **all VMs**, and that **running VMs apply a change after they reboot**

**Success:** admins set cluster memory behavior confidently without needing to know what “120% memory density” means or what *overcommit* implies in backend terms.

*v1: cluster settings only — no VM create/edit UI in this mockup.*

## UX

The new design asks admins to choose **behavior**, not a number or complex math:

- **The percentage slider doesn’t explain itself** — **Memory density** is a % slider that can go above 100%. There is no simple way to tell an admin what “120%” means without backend context — unlike choosing “allow sharing” or “reserve all memory.”
- **Behavior before math** — Policy cards describe what happens to VM memory (shared, fully reserved, or partially reserved). Admins pick an outcome — allow sharing, reserve all, or reserve a minimum — instead of calculating a cluster-wide percentage.
- **Plain language and clear scope** — The accordion is **Memory sharing policy**. **Enable for this cluster** turns sharing on or off. Policy cards set the cluster memory policy for all VMs. The UI states that running VMs apply a policy change after they reboot. *Sharing* and *reserved* replace *overcommit* and abstract density terms in labels; technical terms stay in admin documentation.
- **One accordion, minimal default path** — A single **Memory sharing policy** section replaces the abstract **Memory density** percentage. With **Enable for this cluster** on and **Allow sharing** selected by default, no changes are required — the three policy cards stay visible for review. The **Minimum reserved** field appears only when the admin chooses **Reserve a minimum**.
- **One field, only when needed** — If **Minimum reserved** exceeds available physical memory on eligible nodes, the UI shows an error.
