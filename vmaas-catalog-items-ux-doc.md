# Catalog items

Contact: Yifat Friman Menchik, UXD

## Handoff

- Parent epic: [OSAC-5631](https://redhat.atlassian.net/browse/OSAC-5631)
- Related field governance: [OSAC-3539](https://redhat.atlassian.net/browse/OSAC-3539)
- Scope: Cloud provider admin Catalog list, create, details, edit, and delete
- [Interactive mockup](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=9e721e2&role=provider)
- [Google UX doc](https://docs.google.com/document/d/1YTm2X4nUXWVI_Mjq_hXEY4Rj6i9BaOiXjzVeF3jcMA4/edit)
- [Shared UX pointers](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit)

## Create catalog item

The current five-step flow is **Details → Compute configuration → Storage → Access & Initial run → Review**. There is no separate Visibility step: Global and Tenant scoped choices, plus tenant selection, live in Details.

### Details

- Scope: Global or Tenant scoped; select a tenant for Tenant scoped.
- Name: required DNS-style name. Helper text is **“Enter a name or click the generate name one.”** Generate name is an action icon next to the field.
- Description: optional.
- Provisioning template: required dropdown. Each option has its name on the first line and description on the second. It matches Tenant dropdown styling and behavior; only the selected option gets a blue background. The selected template name/ID appears on catalog item details.

### Compute configuration

- Guest operating system family and Disk image; disk image may be Not set when editable.
- Instance type; it may be Not set when editable.
- Editable / Locked governance controls whether a tenant may override the configured default at VM create time.

### Storage

- Boot disk size and Boot storage tier have independent Editable / Locked controls.
- Additional disks has one Editable / Locked control for the group as a whole.
- An omitted additional disk set is not rendered as a configured default in details.

### Access & Initial run

- Cloud-init for Linux, or Sysprep (Unattend.xml) for Windows, can be inline content or a selected secret.
- No SSH key is configured on the catalog item; SSH is chosen at VM creation.

### Review

The grouped review reflects the same five steps and includes the selected provisioning template. Creating saves the catalog item as Unpublished. Editing shows changed fields before Save changes.

## Catalog item details

Overview shows Service, Status, Rate, **Provisioning template**, Visibility, and Created. Configuration shows Guest OS, Disk image, and Instance type. Access & Initial run shows Cloud-init or Sysprep as a secret link when sourced from a secret, a read-only text box when entered inline, and Not configured when absent.

Storage separates Boot disk size and Boot storage tier from an **Additional disks** table. Additional disks is a table heading with its group governance badge. The table columns are **Size** and **Storage tier**; there is no disk-name column. Boot disk governance badges sit next to their respective values.

Header actions are Launch instance and Actions (Edit, Duplicate, Publish or Unpublish, Delete). Delete uses a danger confirmation naming the item.

## Screenshots

The original `screenshots/catalog-create/` gallery is historical and predates the five-step flow. These images need recapture from the current mockup before they can serve as current handoff screenshots:

- `02-details.png` — updated Name guidance, scope and tenant, Provisioning template menu with two-line options.
- `03-instance-types.png` — replace with Compute configuration.
- `04-visibility-global.png` and `04b-visibility-tenant.png` — replace with Details scope states or remove as separate-step screenshots.
- `05-storage.png` — independent boot-size, boot-tier, and additional-disks governance.
- `06-access-init.png` and `06b-access-provide-default.png` — current Access & Initial run treatment.
- `07-review.png` — current five-step review.

`00-tenant-admin-nav.png` and `01-catalog-list.png` still illustrate the same navigation/list concepts, but should be recaptured if the gallery is refreshed wholesale. Add a new catalog item details screenshot showing Provisioning template, Cloud-init, and Storage.
