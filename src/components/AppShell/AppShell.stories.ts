import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Bell, Building2, CalendarCog, CalendarDays, GraduationCap, House, Layers, MessageSquare, Settings, Users } from "@lucide/vue";
import { computed, ref } from "vue";
import Breadcrumb from "../Breadcrumb/Breadcrumb.vue";
import Button from "../Button/Button.vue";
import { sidebarTrail } from "../Sidebar/sidebar";
import type { SidebarItem } from "../Sidebar/Sidebar.vue";
import AppShell from "./AppShell.vue";

const pages: SidebarItem[] = [
  { label: "Home", icon: House },
  { label: "Students", icon: Users },
  { label: "Timetable", icon: CalendarDays },
  { label: "Messages", icon: MessageSquare, badge: 3 },
  { label: "Settings", icon: Settings },
];

const meta = {
  title: "Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    title: "Keston Admissions",
    collapsible: true,
    user: { name: "Ben Smith", email: "ben.smith@keston.school", organisation: "The Keston School" },
  },
  render: (args) => ({
    components: { AppShell, Button, Bell },
    setup() {
      const current = ref("Home");
      const items = computed<SidebarItem[]>(() =>
        pages.map((page) => ({
          ...page,
          active: page.label === current.value,
          onSelect: () => (current.value = page.label),
        })),
      );
      return { args, items, current };
    },
    template: `
      <AppShell v-bind="args" :items="items" :ui="{ main: 'p-6' }">
        <template #header-trailing>
          <Button variant="ghost" square aria-label="Notifications"><Bell /></Button>
        </template>
        <h1 class="text-2xl font-bold">{{ current }}</h1>
        <p v-for="n in 40" :key="n" class="mt-3 text-sm text-black/65">
          Line {{ n }}. Scroll: the header stays at the top and the sidebar stays beside the page.
        </p>
      </AppShell>`,
  }),
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground. Narrow the preview (or use the viewport menu) to see the
 * sidebar move into the menu.
 */
export const Default: Story = {};

/** Starts with the sidebar collapsed to icons. */
export const Collapsed: Story = {
  args: { collapsed: true },
};

/** Opens on a phone-sized screen, where the sidebar is in the menu. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

/**
 * A nested sidebar with a Breadcrumb above the page that follows it:
 * School › School Structure › New School Year Setup. `sidebarTrail(items)`
 * gives the path to the current page. "School" is a group, not a page, so
 * it's plain text; "School Structure" also opens a level, so here it's text
 * too.
 */
export const WithBreadcrumb: Story = {
  render: (args) => ({
    components: { AppShell, Breadcrumb },
    setup() {
      const current = ref("New School Year Setup");
      const page = (label: string, icon?: SidebarItem["icon"]): SidebarItem => ({
        label,
        icon,
        active: label === current.value,
        onSelect: () => (current.value = label),
      });
      const items = computed<SidebarItem[]>(() => [
        page("Home", House),
        page("Students", Users),
        {
          label: "School",
          icon: Building2,
          children: [
            page("Overview", House),
            {
              label: "School Structure",
              icon: Layers,
              children: [
                page("New School Year Setup", CalendarCog),
                page("Year Groups", GraduationCap),
                page("Houses", Users),
              ],
            },
            page("Term Dates", CalendarDays),
          ],
        },
        page("Messages", MessageSquare),
        page("Settings", Settings),
      ]);
      const trail = computed(() => sidebarTrail(items.value));
      return { args, items, trail, current };
    },
    template: `
      <AppShell v-bind="args" :items="items" :ui="{ main: 'p-6' }">
        <Breadcrumb :items="trail" />
        <h1 class="mt-2 text-2xl font-bold">{{ current }}</h1>
        <p class="mt-3 text-sm text-black/65">Choose pages in the sidebar: the breadcrumb follows.</p>
      </AppShell>`,
  }),
};
