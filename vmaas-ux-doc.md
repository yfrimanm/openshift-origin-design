# VMaaS UX mockup — current handoff

Prototype: [VMaaS UX prototype](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=9e721e2&role=provider)
Google UX doc: [Catalog items](https://docs.google.com/document/d/1YTm2X4nUXWVI_Mjq_hXEY4Rj6i9BaOiXjzVeF3jcMA4/edit)

## Create catalog item

The wizard follows **Details → Compute configuration → Storage → Access & Initial run → Review**. Scope (Global or Tenant scoped) and tenant selection are within Details, not a separate Visibility step. Disk image and instance type are within Compute configuration. In Details, the Name helper reads **“Enter a name or click the generate name one.”** The Provisioning template menu uses the same dropdown styling and selection behavior as Tenant; each option has a template name on the first line and its description on the second. Only the selected option has a blue background. The chosen template name/ID appears on catalog item details.

Storage treats **Boot disk size**, **Boot storage tier**, and **Additional disks** as separate governance controls. Each can be Editable or Locked. The additional disks group is governed as a whole. Omitted values are not shown as configured defaults.

## VM and catalog item details

Storage separates the boot disk fields from an **Additional disks** table. There is no disk-name column: additional disk rows show **Size** and **Storage tier**. The Additional disks label uses the same table-heading treatment on VM and catalog item details pages; catalog item governance appears next to the applicable field or group.

Cloud-init is shown as a link to its secret when a secret is selected, or as a read-only text box when inline data is provided. It is **Not configured** when absent. The same representation applies to VM and catalog item overview pages.

On VM details, **Access & Initial run** starts with **External IP**, followed by **Cloud-init**, then **SSH public key**. The SSH command is not displayed. External IP uses an action button for both **Attach external IP** and **Detach external IP**, with consistent sizing and styling. Retry and Choose another are secondary small buttons for failed attachment.

For automatically attached IPs, show an **Auto attached** label and the explanation **“This IP is managed with the VM and is detached only when the VM is deleted.”** Do not offer Edit or Detach in that state. Manually attached IPs may be detached.

## Audit and screenshots

The 4 November audit checked the provider catalog wizard, catalog item overview, VM overview, auto-attached and manual External IP states, storage tables, Cloud-init presentation, and dropdown interactions. It found and fixed a double-event toggle that prevented the Tenant and Provisioning template menus from staying open, plus a cramped Auto attached label and stale build tag.

The Google UX doc's screenshot gallery predates the five-step wizard. Until refreshed captures are inserted, treat the existing gallery as historical. The current interactive prototype is the source of truth.
