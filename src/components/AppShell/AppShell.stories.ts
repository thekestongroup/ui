import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Bell, CalendarDays, House, MessageSquare, Settings, Users } from "@lucide/vue";
import { computed, ref } from "vue";
import Button from "../Button/Button.vue";
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
