# VM Overview

Contact: Yifat Friman Menchik, UXD

## Handoff

- Scope: Single-VM details Overview (day-2)
- [Interactive mockup — auto-attached IP](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=9e721e2&role=admin&vm=indigo-quokka-89)
- [Google UX doc](https://docs.google.com/document/d/1Y8hjgE924owve0VXA3rkKqTYuB4sXKif8KhXyFL3hyQ/edit)
- [Networking handoff](osac-2621-vmaas-tenant-networking-handoff.md)

## Layout

The header has the breadcrumb, VM title, Open console, power actions, and Actions. The top columns are Overview, Configuration, and **Access & Initial run**. Networking, Storage, and Utilization follow below; Alerts and Recent activity remain in the sidebar.

Access & Initial run is ordered **External IP → Cloud-init or Sysprep → SSH public key**. There is no SSH command in this overview.

## External IP

External IP is the first subsection under Access & Initial run, with the same heading treatment as Instance type and Additional disks. It shows Host and an action button. **Attach external IP** and **Detach external IP** are matching secondary small buttons. Failed attachment offers **Retry** and **Choose another** in the same button style.

An IP attached automatically during VM creation displays an **Auto attached** label beside the heading and the explanation **“This IP is managed with the VM and is detached only when the VM is deleted.”** Edit and Detach are unavailable. A manually attached IP may be detached.

## Cloud-init and SSH public key

Cloud-init or Sysprep is a link to the selected secret, a read-only gray text box for inline content, or Not configured when absent. SSH public key follows it. Spacing between the External IP subsection and Cloud-init matches the rest of the overview fields.

## Storage

Boot disk size and Boot storage tier are separate fields. **Additional disks** is a table heading, with **Size**, **Storage tier**, and day-2 **Actions** columns. There is no disk-name column. Add disk remains a separate action. The boot disk cannot be deleted.

## Other day-2 interactions

Tenant Admin can edit supported configuration. Tenant User is read-only for most overview configuration, subject to the instance type resize rule. Instance type, SSH public key, network, and disk edits use their corresponding controls and modals.

## Screenshots

The existing VM Overview screenshot gallery predates the Access & Initial run reorder and storage redesign. Replace **Overview — running** and **External IP (Host + SSH)** with current captures. Add a separate capture for the auto-attached IP state and an inline Cloud-init example. The existing Status popover, Edit instance type, Edit SSH public key, Add network, and Delete VM images are unaffected by the Nov 3 overview changes unless a visual review finds another discrepancy.
