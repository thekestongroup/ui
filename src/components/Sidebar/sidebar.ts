import type { SidebarItem, SidebarSection } from './Sidebar.vue'

/**
 * The path to the current page (the item marked `active`) through nested
 * items, top level first, e.g. [School, School Structure, New School Year
 * Setup]. Empty when no item is active. Takes the same `items` and
 * `sections` as the Sidebar, so a Breadcrumb can follow it:
 *
 *   <Breadcrumb :items="sidebarTrail(items, sections)" />
 */
export function sidebarTrail(items: SidebarItem[] = [], sections: SidebarSection[] = []): SidebarItem[] {
  for (const item of [...items, ...sections.flatMap((section) => section.items)]) {
    if (item.active) return [item]
    if (item.children?.length) {
      const below = sidebarTrail(item.children)
      if (below.length) return [item, ...below]
    }
  }
  return []
}
