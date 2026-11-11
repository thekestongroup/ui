import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  Bell,
  BookOpen,
  Building2,
  CalendarCog,
  CalendarDays,
  Circle,
  CircleCheck,
  Copy,
  GraduationCap,
  House,
  Layers,
  Shield,
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
import { computed, reactive, ref, type Component } from "vue";
import AppShell from "../components/AppShell/AppShell.vue";
import Badge, { type BadgeProps } from "../components/Badge/Badge.vue";
import AvatarGroup from "../components/AvatarGroup/AvatarGroup.vue";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb.vue";
import Button, { type ButtonStatus } from "../components/Button/Button.vue";
import Card from "../components/Card/Card.vue";
import Divider from "../components/Divider/Divider.vue";
import Input from "../components/Input/Input.vue";
import PageHeader from "../components/PageHeader/PageHeader.vue";
import InputDate from "../components/InputDate/InputDate.vue";
import InputNumber from "../components/InputNumber/InputNumber.vue";
import Select from "../components/Select/Select.vue";
import type { SidebarItem, SidebarSection } from "../components/Sidebar/Sidebar.vue";
import { sidebarTrail } from "../components/Sidebar/sidebar";

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
    <PageHeader :title="current">
      <template #actions>
        <Button variant="primary"><template #leading><component :is="actionIcon" /></template>{{ action }}</Button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card v-for="stat in stats" :key="stat.label" padding="sm" :ui="{ body: 'gap-1' }">
        <span class="text-sm text-black/65">{{ stat.label }}</span>
        <span class="text-2xl font-bold">{{ stat.value }}</span>
      </Card>
    </div>

    <Card padding="none" :ui="{ body: 'overflow-x-auto' }">
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
    </Card>
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
      components: { AppShell, Badge, Button, Bell, Card, PageHeader },
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

// ── New School Year Setup ───────────────────────────────────────────────────

const yearGroups = [7, 8, 9, 10, 11, 12].map((n) => ({ label: `Year ${n}`, value: n, description: `Becomes Year ${n + 1}` }));
const studentsPerYear: Record<number, number> = { 7: 182, 8: 179, 9: 184, 10: 176, 11: 181, 12: 158 };

const copyOptions = [
  { label: "Classes and sets", value: "classes", icon: BookOpen, description: "Each class moves up a year; teachers stay with them" },
  { label: "Tutor groups", value: "tutors", icon: Users, description: "Same tutors, renamed for the new year group" },
  { label: "Houses", value: "houses", icon: Shield, description: "Students stay in their house" },
  { label: "Timetable", value: "timetable", icon: CalendarDays, description: "Last year's periods and rooms, as a starting point" },
  { label: "Fee structures", value: "fees", icon: PoundSterling, description: "Fees and discounts, before any rise is applied" },
];

const terms = [
  { key: "autumn", label: "Autumn term" },
  { key: "spring", label: "Spring term" },
  { key: "summer", label: "Summer term" },
] as const;
type TermKey = (typeof terms)[number]["key"];

/**
 * A settings page three levels deep: School › School Structure › New School
 * Year Setup. The sidebar opens at that level, the breadcrumb follows it, and
 * the page uses the form components together: dates that must be in order,
 * a multi-select with descriptions, and a summary that updates as you go.
 *
 * "Start new year" checks everything (try clearing a date, or setting a term
 * outside the year), then loads and succeeds.
 */
export const NewSchoolYearSetup: Story = {
  render: () => ({
    components: { AppShell, AvatarGroup, Badge, Breadcrumb, Button, Bell, Card, Divider, Input, PageHeader, InputDate, InputNumber, Select, Circle, CircleCheck, Copy },
    setup() {
      const current = ref("New School Year Setup");
      const page = (label: string, icon?: Component): SidebarItem => ({
        label,
        icon,
        active: label === current.value,
        onSelect: () => (current.value = label),
      });
      const items = computed<SidebarItem[]>(() => [
        page("Home", House),
        page("Students", Users),
        page("Staff", GraduationCap),
        {
          label: "School",
          icon: Building2,
          children: [
            page("Overview", LayoutDashboard),
            {
              label: "School Structure",
              icon: Layers,
              children: [
                page("New School Year Setup", CalendarCog),
                page("Year Groups", GraduationCap),
                page("Houses", Shield),
                page("Classes", BookOpen),
              ],
            },
            page("Term Dates", CalendarDays),
            page("Settings", Settings),
          ],
        },
        page("Reports", FileText),
      ]);
      const trail = computed(() => sidebarTrail(items.value));

      const form = reactive({
        name: "2027–28",
        start: "2027-09-01" as string | undefined,
        end: "2028-07-21" as string | undefined,
        terms: {
          autumn: { start: "2027-09-01", end: "2027-12-17" },
          spring: { start: "2028-01-04", end: "2028-03-31" },
          summer: { start: "2028-04-18", end: "2028-07-21" },
        } as Record<TermKey, { start?: string; end?: string }>,
        moveUp: [7, 8, 9, 10, 11, 12] as number[],
        year13: "leavers",
        intake: 180 as number | undefined,
        copy: ["classes", "tutors", "houses"] as string[],
      });

      // Errors appear after "Start new year", then update as fields change.
      const checked = ref(false);
      const errors = computed(() => {
        const e: Record<string, string | undefined> = {};
        if (!checked.value) return e;
        if (!form.name.trim()) e.name = "Enter a name, e.g. 2027–28";
        if (!form.start) e.start = "Enter the first day of the year";
        if (!form.end) e.end = "Enter the last day of the year";
        else if (form.start && form.end <= form.start) e.end = "Must be after the start date";
        let previousEnd: string | undefined;
        for (const term of terms) {
          const t = form.terms[term.key];
          if (!t.start) e[`${term.key}.start`] = "Enter a start date";
          else if (form.start && t.start < form.start) e[`${term.key}.start`] = "Must be in the academic year";
          else if (previousEnd && t.start <= previousEnd) e[`${term.key}.start`] = "Must be after the previous term ends";
          if (!t.end) e[`${term.key}.end`] = "Enter an end date";
          else if (t.start && t.end <= t.start) e[`${term.key}.end`] = "Must be after the term starts";
          else if (form.end && t.end > form.end) e[`${term.key}.end`] = "Must be in the academic year";
          previousEnd = t.end;
        }
        if (form.intake === undefined) e.intake = "Enter the expected intake (0 if none)";
        return e;
      });
      const errorCount = computed(() => Object.values(errors.value).filter(Boolean).length);

      // The summary down the side.
      const movingUp = computed(() => form.moveUp.reduce((sum, year) => sum + (studentsPerYear[year] ?? 0), 0));
      const checklist = computed(() => [
        { label: "Academic year", done: !!(form.name.trim() && form.start && form.end && form.end > form.start) },
        { label: "Term dates", done: terms.every((t) => form.terms[t.key].start && form.terms[t.key].end) },
        { label: "Year groups", done: form.moveUp.length > 0 && form.intake !== undefined },
        { label: "Copied from 2026–27", done: form.copy.length > 0 },
      ]);

      const status = ref<ButtonStatus>("idle");
      const saved = ref(false);
      function start() {
        checked.value = true;
        if (errorCount.value) {
          // Take keyboard and screen reader users to the first problem.
          requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
          return;
        }
        status.value = "loading";
        setTimeout(() => (status.value = "success"), 1200);
      }

      const signOff = [
        { name: "Margaret Osei", role: "Headteacher", email: "m.osei@keston.school", organisation: "The Keston School" },
        { name: "Zara Khan", role: "Deputy Head", email: "z.khan@keston.school", organisation: "The Keston School" },
        { name: "Oscar Hughes", role: "Data Manager", email: "o.hughes@keston.school", organisation: "The Keston School" },
        { name: "Isla Ahmed", role: "Business Manager", email: "i.ahmed@keston.school", organisation: "The Keston School" },
        { name: "Leo Wright", role: "Assistant Head", email: "l.wright@keston.school", organisation: "The Keston School" },
        { name: "Freya Lewis", role: "Assistant Head", email: "f.lewis@keston.school", organisation: "The Keston School" },
      ];

      return { signOff, current, items, trail, form, terms, errors, errorCount, checked, movingUp, checklist, status, saved, start, user, yearGroups, copyOptions, studentsPerYear };
    },
    template: `
      <AppShell title="Keston School Admin" :items="items" :user="user">
        ${sharedHeader}

        <div v-if="current !== 'New School Year Setup'" class="flex flex-col gap-2 p-4 sm:p-6">
          <PageHeader :title="current" :breadcrumb="trail" description="Choose New School Year Setup (School › School Structure) to see the example page." />
        </div>

        <div v-else class="flex flex-col gap-6 p-4 sm:p-6">
          <!-- Title, status and actions -->
          <PageHeader
            title="New School Year Setup"
            description="Set up 2027–28 before the summer. Nothing changes for staff or students until you start the new year."
            :breadcrumb="trail"
          >
            <template #badge>
              <Badge :color="status === 'success' ? 'green' : 'basic'">{{ status === 'success' ? 'Started' : saved ? 'Draft saved' : 'Draft' }}</Badge>
            </template>
            <template #actions>
              <Button @click="saved = true">Save draft</Button>
              <Button variant="primary" v-model:status="status" loading-text="Starting…" success-text="Started" @click="start">
                Start new year
              </Button>
            </template>
            <p v-if="checked && errorCount" role="alert" class="text-sm text-red">
              {{ errorCount === 1 ? 'There is 1 thing' : 'There are ' + errorCount + ' things' }} to fix before the new year can start.
            </p>
          </PageHeader>

          <!-- Laid out by the space it has (container queries), not the
               window: the sidebar takes 256px, and the form needs room. -->
          <div class="@container">
          <div class="grid grid-cols-1 items-start gap-6 @4xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div class="flex flex-col gap-6">
              <!-- Academic year -->
              <Card title="Academic year" description="The first and last day students are on roll.">
                <div class="grid grid-cols-1 gap-4 @lg:grid-cols-3">
                  <Input v-model="form.name" label="Name" :error-text="errors.name" />
                  <InputDate v-model="form.start" label="Starts" :error-text="errors.start" />
                  <InputDate v-model="form.end" label="Ends" :min="form.start" :error-text="errors.end" />
                </div>
              </Card>

              <!-- Term dates -->
              <Card title="Term dates" description="Half terms and INSET days can be added later in Term Dates.">
                <div v-for="term in terms" :key="term.key" class="grid grid-cols-1 gap-x-4 gap-y-2 @xl:grid-cols-[7rem_1fr_1fr] @xl:items-start">
                  <h3 class="text-sm font-bold @xl:pt-8">{{ term.label }}</h3>
                  <InputDate v-model="form.terms[term.key].start" :label="term.label + ' starts'" :min="form.start" :max="form.end" :error-text="errors[term.key + '.start']" />
                  <InputDate v-model="form.terms[term.key].end" :label="term.label + ' ends'" :min="form.terms[term.key].start || form.start" :max="form.end" :error-text="errors[term.key + '.end']" />
                </div>
              </Card>

              <!-- Year groups -->
              <Card title="Year groups" description="Who moves up, who leaves, and who joins.">
                <Select
                  v-model="form.moveUp"
                  label="Year groups moving up"
                  helper="Untick a year group to keep it where it is, e.g. if it's being restructured."
                  :options="yearGroups"
                  multiple
                />
                <div class="grid grid-cols-1 gap-4 @lg:grid-cols-2">
                  <Select
                    v-model="form.year13"
                    label="Year 13 students"
                    :options="[
                      { label: 'Mark as leavers', value: 'leavers', description: 'Off roll on 31 August' },
                      { label: 'Keep on roll', value: 'keep', description: 'Until results day, then mark as leavers' },
                    ]"
                  />
                  <InputNumber
                    v-model="form.intake"
                    label="Expected Year 7 intake"
                    helper="From admissions. Places can be added later."
                    :min="0"
                    :max="400"
                    :error-text="errors.intake"
                  />
                </div>
              </Card>

              <!-- Copy from last year -->
              <Card title="Copy from 2026–27" description="Anything not copied starts empty.">
                <Select v-model="form.copy" label="What to copy" :options="copyOptions" multiple searchable placeholder="Search what to copy…" />
              </Card>
            </div>

            <!-- Summary -->
            <Card as="aside" title="Summary" padding="sm" class="@4xl:sticky @4xl:top-18">
              <ul class="flex flex-col gap-2 text-sm">
                <li v-for="step in checklist" :key="step.label" class="flex items-center gap-2">
                  <CircleCheck v-if="step.done" class="size-4 shrink-0 text-green" aria-hidden="true" />
                  <Circle v-else class="size-4 shrink-0 text-black/40" aria-hidden="true" />
                  <span :class="step.done ? 'text-black' : 'text-black/65'">{{ step.label }}</span>
                  <span class="sr-only">{{ step.done ? '(done)' : '(to do)' }}</span>
                </li>
              </ul>
              <Divider />
              <dl class="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
                <dt class="text-black/65">Moving up a year</dt>
                <dd class="text-right font-bold tabular-nums">{{ movingUp.toLocaleString('en-GB') }}</dd>
                <dt class="text-black/65">{{ form.year13 === 'leavers' ? 'Leaving (Year 13)' : 'Staying on (Year 13)' }}</dt>
                <dd class="text-right font-bold tabular-nums">162</dd>
                <dt class="text-black/65">Joining Year 7</dt>
                <dd class="text-right font-bold tabular-nums">{{ form.intake ?? '—' }}</dd>
              </dl>
              <Divider />
              <div class="flex flex-col gap-2">
                <h3 class="text-sm font-bold">Sign-off</h3>
                <p class="text-sm text-black/65">Starting the year needs one of these people.</p>
                <AvatarGroup :users="signOff" size="sm" label="People who can sign off" />
              </div>
            </Card>
          </div>
          </div>
        </div>
      </AppShell>`,
  }),
};
