import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  BookOpen,
  Building2,
  CalendarCog,
  GraduationCap,
  Layers,
  CalendarDays,
  ClipboardList,
  House,
  LifeBuoy,
  MessageSquare,
  Settings,
  Users,
} from "@lucide/vue";
import { computed, ref } from "vue";
import Sidebar, { type SidebarItem, type SidebarSection } from "./Sidebar.vue";

const items: SidebarItem[] = [
  { label: "Home", icon: House, href: "#", active: true },
  { label: "Students", icon: Users, href: "#" },
  { label: "Timetable", icon: CalendarDays, href: "#" },
  { label: "Messages", icon: MessageSquare, href: "#", badge: 3 },
  { label: "Homework", icon: BookOpen, href: "#", badge: 2, badgeColor: "red" },
];

const sections: SidebarSection[] = [
  {
    label: "Teaching",
    items: [
      { label: "Registers", icon: ClipboardList, href: "#" },
      { label: "Lessons", icon: BookOpen, href: "#" },
    ],
  },
  {
    label: "School",
    items: [
      { label: "Settings", icon: Settings, href: "#" },
      { label: "Archive", icon: BookOpen, href: "#", disabled: true },
    ],
  },
];

const Logo = `
  <span class="flex size-7 shrink-0 items-center justify-center rounded bg-primary text-xs font-bold text-white" aria-hidden="true">K</span>
  <span class="truncate text-base font-bold transition-opacity duration-150" :class="collapsed && 'opacity-0'">Keston</span>`;

const meta = {
  title: "Components/Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    items,
    sections,
    label: "Main",
    collapsible: true,
  },
  render: (args) => ({
    components: { Sidebar, LifeBuoy },
    setup: () => ({ args }),
    template: `
      <div class="flex h-screen bg-background">
        <Sidebar v-bind="args">
          <template #header="{ collapsed }">${Logo}</template>
        </Sidebar>
      </div>`,
  }),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. The button at the bottom collapses it to icons. */
export const Default: Story = {};

/** Narrow, icons only. Labels are kept for screen readers and shown as a tooltip on hover. */
export const Collapsed: Story = {
  args: { collapsed: true },
};

/** Clicking an item makes it the current page. */
export const Interactive: Story = {
  args: { sections: [] },
  render: (args) => ({
    components: { Sidebar },
    setup() {
      const current = ref("Home");
      const navItems = computed<SidebarItem[]>(() =>
        items.map((item) => ({
          ...item,
          href: undefined,
          active: item.label === current.value,
          onSelect: () => (current.value = item.label),
        })),
      );
      return { args, navItems, current };
    },
    template: `
      <div class="flex h-screen bg-background">
        <Sidebar v-bind="args" :items="navItems" />
        <main class="flex-1 p-6 text-sm">Current page: <strong>{{ current }}</strong></main>
      </div>`,
  }),
};

/** Something at the bottom, e.g. help or a profile, in the footer slot. */
export const WithFooter: Story = {
  args: { collapsible: false },
  render: (args) => ({
    components: { Sidebar, LifeBuoy },
    setup: () => ({ args }),
    template: `
      <div class="flex h-screen bg-background">
        <Sidebar v-bind="args">
          <template #header="{ collapsed }">${Logo}</template>
          <template #footer>
            <div class="flex items-center gap-3 px-3 py-2 text-sm">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-bold" aria-hidden="true">BS</span>
              <span class="flex min-w-0 flex-col">
                <span class="truncate font-bold">Ben Smith</span>
                <span class="truncate text-xs text-black/65">Head of Year 9</span>
              </span>
            </div>
          </template>
        </Sidebar>
      </div>`,
  }),
};

// School › School Structure › New School Year Setup, plus siblings at each level.
const schoolTree = (current: string, go: (label: string) => void): SidebarItem[] => {
  const page = (label: string, icon?: SidebarItem["icon"]): SidebarItem => ({
    label,
    icon,
    active: label === current,
    onSelect: () => go(label),
  });
  return [
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
        page("Settings", Settings),
      ],
    },
    page("Messages", MessageSquare),
  ];
};

/**
 * Items with `children` open a level instead of navigating, with a back row
 * (‹ School) at the top. It opens at the current page's level, and the
 * parents above the current page are shown in bold.
 */
export const Nested: Story = {
  args: { sections: [] },
  render: (args) => ({
    components: { Sidebar },
    setup() {
      const current = ref("New School Year Setup");
      const navItems = computed(() => schoolTree(current.value, (label) => (current.value = label)));
      return { args, navItems, current };
    },
    template: `
      <div class="flex h-screen bg-background">
        <Sidebar v-bind="args" :items="navItems" />
        <main class="flex-1 p-6 text-sm">Current page: <strong>{{ current }}</strong></main>
      </div>`,
  }),
};

/** Many items: the middle scrolls, the header and footer stay put. */
export const LongList: Story = {
  args: {
    items: Array.from({ length: 40 }, (_, n) => ({ label: `Class ${n + 1}`, icon: Users, href: "#" })),
    sections: [],
  },
};
