# VMaaS UX mockup — current handoff

Prototype: [VMaaS UX prototype](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=d397584&role=provider)  
Google UX doc: [Catalog items](https://docs.google.com/document/d/1YTm2X4nUXWVI_Mjq_hXEY4Rj6i9BaOiXjzVeF3jcMA4/edit)

## Create catalog item

The wizard follows Details → Instance types → Visibility → Storage → Access & Initial run → Review. In Details, the Name helper reads **“Enter a name or click the generate name one.”** The Provisioning template menu uses the same dropdown styling and selection behavior as Tenant; each option has a template name on the first line and its description on the second. A selected template’s name/ID appears on the catalog item details page.

Storage treats **Boot disk size**, **Boot storage tier**, and **Additional disks** as separate governance controls. Each can be Editable or Locked. The additional disks group is governed as a whole. Omitted values are not shown as configured defaults.

## VM and catalog item details

Storage separates the boot disk fields from an **Additional disks** table. There is no disk-name column: additional disk rows show **Size** and **Storage tier**. The Additional disks label uses the same table-heading treatment on VM and catalog item details pages; catalog item governance appears next to the applicable field or group.

Cloud-init is shown as a link to its secret when a secret is selected, or as a read-only text box when inline data is provided. It is **Not configured** when absent. The same representation applies to VM and catalog item overview pages.

On VM details, **Access & Initial run** starts with **External IP**, followed by **Cloud-init**, then **SSH public key**. The SSH command is not displayed. External IP uses an action button for both **Attach external IP** and **Detach external IP**, with consistent sizing and styling. Retry and Choose another are secondary small buttons for failed attachment.

For automatically attached IPs, show an **Auto attached** label and the explanation **“This IP is managed with the VM and is detached only when the VM is deleted.”** Do not offer Edit or Detach in that state. Manually attached IPs may be detached.

## Screenshots

The Google UX doc contains the screenshot gallery. Refresh overview screenshots from the current prototype build when UI changes; avoid relying on older cached `?v=` links.
