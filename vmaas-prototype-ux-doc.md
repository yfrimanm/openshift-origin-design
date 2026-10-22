# VMaaS prototype — UX documentation

**Source of truth (Google Doc, tabbed):** [VMaaS prototype — UX documentation](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit)

**Mock (aligned):** [vmaas-ux-prototype.html?v=ethan-cards-7165](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165) · Build Oct 21 · **ethan-cards 7165**

| Tab | Contents |
|---|---|
| **Overview** | Goal, personas, UX summary, links |
| **Create Virtual machine** | List + Create wizard (all steps) |
| **Create Windows VM with sysprep** | Access & Initial run — Windows Unattend.xml / Sysprep (OSAC-5009) |
| **VM Overview** | Day-2 details Overview |
| **Virtual networks** | Pointer → [Virtual networks](https://docs.google.com/document/d/1ZV8NBeRQzeW8vKeR1D-XlZy-FFFAVDwvKJRkZMOmYwY/edit) Doc |
| **Catalog** / **Create catalog item** | Pointers → [Catalog items](https://docs.google.com/document/d/1YTm2X4nUXWVI_Mjq_hXEY4Rj6i9BaOiXjzVeF3jcMA4/edit) Doc |
| **Instance types** | Provider list / create / details |
| **Disk images** | Provider list / create / details |

## Handoff overview

| | |
|---|---|
| **Scope** | Full interactive prototype: Virtual machines list + Create wizard + Overview, plus provider Catalog, Instance types, Disk images |
| **Interactive mock** | https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165 |
| **Deep links** | [Create](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165&create=1) · [Overview](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165&vm=indigo-quokka-89) · [Virtual networks](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165&nav=networks) · [Catalog](https://yfrimanm.github.io/openshift-origin-design/vmaas-ux-prototype.html?v=ethan-cards-7165&role=provider) |
| **Google Doc** | [Tabbed source of truth](https://docs.google.com/document/d/1Vfn_9cGj92BOaqFKWE64pnL5Mi8WcCGwEllCVlhAWes/edit) |
| **Create screenshots** | `videos/vmaas-create-vm-only-ux-doc/` · [gh-pages](https://github.com/yfrimanm/openshift-origin-design/tree/gh-pages/screenshots/create) |
| **Regenerate Create screenshots** | `node scripts/capture-vmaas-create-vm-only-screenshots.mjs` |

## Goal

One coherent product surface for engineering and stakeholders: tenant Create / Overview flows and provider infrastructure, aligned to OSAC PatternFly Felt + Glass.

## Personas (demo role switcher)

| Role | Sees | Primary flows |
|---|---|---|
| **Tenant Admin** | Services → Virtual machines, Networking | List, Create wizard, VM Overview (editable) |
| **Tenant User** | Same nav; Create hidden | Power / console; Overview read-only |
| **Cloud provider admin** | Catalog, Instance types, Disk images | Provider list / create / detail · **No Services** in nav |

## UX summary

| Area | Decision |
|---|---|
| **IA (Create)** | Select template → Details → Instance type → Storage → **Networking** → Access & Initial run → Review and create |
| **Details** | Name, description, Guest OS felt cards + disk image typeahead. Project context-only. |
| **Access & Initial run** | Optional. Linux: SSH + Cloud-init. Windows: Sysprep Unattend.xml (Enter value / Select secret felt cards). |
| **Create dropdowns** | Typeahead rich-select for Project, Instance type, Storage tier, Virtual network, Subnet. Security groups = multi-select chips. |
| **Form width** | Wizard fields / cards / uploads / helpers = **40rem** column |
| **After create** | New VM Overview + success toast |
| **Start after create** | Checked by default (CNV parity) |
| **List cards (VM + VN)** | Ethan Clusters pattern; **card** view default; Console on VM kebab (not card CTA) |
| **Shell** | PatternFly Felt + Glass |

---

*Create / Sysprep step detail and screenshots live in the Google Doc tabs — keep this markdown as a short local mirror only.*
