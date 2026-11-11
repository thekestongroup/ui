import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Inbox,
  LayoutDashboard,
  PoundSterling,
  Receipt,
  Settings,
  UserPlus,
  Users,
  Wallet,
} from "@lucide/vue";
import { computed, ref, type Component } from "vue";
import AppShell from "../components/AppShell/AppShell.vue";
import Badge, { type BadgeProps } from "../components/Badge/Badge.vue";
import Button from "../components/Button/Button.vue";
import type { SidebarSection } from "../components/Sidebar/Sidebar.vue";

/**
 * Whole pages from two different apps, to show the intended layout: every
 * app uses AppShell, so the header is the same everywhere (only the title
 * changes) and each app brings its own sidebar items and pages.
 * Not part of the library itself.
 *
 * Narrow the preview, or use the viewport menu, to see the mobile menu.
 */
const meta = {
  title: "Examples/App pages",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Every app passes the same user and handles the account actions the same
// way; only the title, sidebar and pages differ.
const user = { name: "Ben Smith", email: "ben.smith@keston.school", organisation: "The Keston School" };

const sharedHeader = `
  <template #header-trailing>
    <Button variant="ghost" square aria-label="Notifications"><Bell /></Button>
  </template>`;

/** Marks one item as the current page, and makes choosing an item go to it. */
function useNav(sections: SidebarSection[], first: string) {
  const current = ref(first);
  const nav = computed(() =>
    sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        active: item.label === current.value,
        onSelect: () => (current.value = item.label),
      })),
    })),
  );
  return { current, nav };
}

type Row = { name: string; detail: string; date: string; status: string; color: BadgeProps["color"] };

const pageTemplate = `
  <div class="flex flex-col gap-6 p-4 sm:p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold">{{ current }}</h1>
      <Button variant="primary"><template #leading><component :is="actionIcon" /></template>{{ action }}</Button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-1 rounded border border-black/15 bg-white p-4">
        <span class="text-sm text-black/65">{{ stat.label }}</span>
        <span class="text-2xl font-bold">{{ stat.value }}</span>
      </div>
    </div>

    <div class="overflow-x-auto rounded border border-black/15 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-black/15 text-black/65">
          <tr>
            <th v-for="h in headings" :key="h" class="px-4 py-3 font-bold whitespace-nowrap">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.name" class="border-b border-black/15 last:border-b-0">
            <td class="px-4 py-3 font-bold whitespace-nowrap">{{ row.name }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ row.detail }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-black/65">{{ row.date }}</td>
            <td class="px-4 py-3"><Badge :color="row.color" size="sm">{{ row.status }}</Badge></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;

function pageStory(options: {
  title: string;
  sections: SidebarSection[];
  first: string;
  action: string;
  actionIcon: Component;
  stats: { label: string; value: string }[];
  headings: string[];
  rows: Row[];
}): Story {
  return {
    render: () => ({
      components: { AppShell, Badge, Button, Bell },
      setup() {
        const { current, nav } = useNav(options.sections, options.first);
        return { ...options, current, nav, user };
      },
      template: `
        <AppShell :title="title" :sections="nav" :user="user">
          ${sharedHeader}
          ${pageTemplate}
        </AppShell>`,
    }),
  };
}

const statuses: Record<string, BadgeProps["color"]> = {
  Offered: "green",
  Interview: "blue",
  "Awaiting documents": "orange",
  Withdrawn: "basic",
  Paid: "green",
  "Due soon": "orange",
  Overdue: "red",
  Draft: "basic",
};
const row = (name: string, detail: string, date: string, status: string): Row => ({
  name,
  detail,
  date,
  status,
  color: statuses[status],
});

/** The admissions app: applications, interviews and offers. */
export const Admissions = pageStory({
  title: "Keston Admissions",
  first: "Applications",
  action: "New application",
  actionIcon: UserPlus,
  sections: [
    {
      items: [
        { label: "Dashboard", icon: LayoutDashboard },
        { label: "Applications", icon: Inbox, badge: 12 },
        { label: "Interviews", icon: CalendarDays },
        { label: "Offers", icon: ClipboardCheck },
      ],
    },
    {
      label: "Records",
      items: [
        { label: "Students", icon: Users },
        { label: "Documents", icon: FileText, badge: 4, badgeColor: "orange" },
      ],
    },
    { label: "Admin", items: [{ label: "Settings", icon: Settings }] },
  ],
  stats: [
    { label: "Open applications", value: "48" },
    { label: "Interviews this week", value: "9" },
    { label: "Offers accepted", value: "31" },
  ],
  headings: ["Applicant", "Year group", "Applied", "Status"],
  rows: [
    row("Amelia Clarke", "Year 7", "3 Nov 2026", "Offered"),
    row("Noah Patel", "Year 9", "1 Nov 2026", "Interview"),
    row("Isla Thompson", "Year 7", "28 Oct 2026", "Awaiting documents"),
    row("Leo Okafor", "Year 12", "24 Oct 2026", "Interview"),
    row("Grace Wilson", "Year 8", "20 Oct 2026", "Withdrawn"),
    row("Oliver Hughes", "Year 7", "18 Oct 2026", "Offered"),
  ],
});

/** The finance app: same shell and header, its own sidebar and pages. */
export const Finance = pageStory({
  title: "Keston Finance",
  first: "Invoices",
  action: "New invoice",
  actionIcon: Receipt,
  sections: [
    {
      items: [
        { label: "Overview", icon: LayoutDashboard },
        { label: "Invoices", icon: Receipt, badge: 5, badgeColor: "red" },
        { label: "Payments", icon: Wallet },
        { label: "Fees", icon: PoundSterling },
      ],
    },
    { label: "Admin", items: [{ label: "Settings", icon: Settings }] },
  ],
  stats: [
    { label: "Outstanding", value: "£18,420" },
    { label: "Paid this term", value: "£246,900" },
    { label: "Overdue invoices", value: "5" },
  ],
  headings: ["Family", "Amount", "Due", "Status"],
  rows: [
    row("Clarke family", "£4,950.00", "1 Dec 2026", "Due soon"),
    row("Patel family", "£4,950.00", "1 Nov 2026", "Overdue"),
    row("Thompson family", "£2,475.00", "1 Oct 2026", "Paid"),
    row("Okafor family", "£5,300.00", "1 Nov 2026", "Overdue"),
    row("Wilson family", "£4,950.00", "1 Jan 2027", "Draft"),
    row("Hughes family", "£4,950.00", "1 Oct 2026", "Paid"),
  ],
});
