import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  Inbox,
  LayoutDashboard,
  Mail,
  Pencil,
  Phone,
  Settings,
  Users,
} from "@lucide/vue";
import { computed, reactive, ref, watch } from "vue";
import Age from "../components/Age/Age.vue";
import AppShell from "../components/AppShell/AppShell.vue";
import Avatar from "../components/Avatar/Avatar.vue";
import Badge, { type BadgeProps } from "../components/Badge/Badge.vue";
import Button, { type ButtonStatus } from "../components/Button/Button.vue";
import Calendar from "../components/Calendar/Calendar.vue";
import Card from "../components/Card/Card.vue";
import Checkbox from "../components/Checkbox/Checkbox.vue";
import Checklist from "../components/Checklist/Checklist.vue";
import Divider from "../components/Divider/Divider.vue";
import InfoTip from "../components/InfoTip/InfoTip.vue";
import InputRichText, { type InputRichTextProps } from "../components/InputRichText/InputRichText.vue";
import NotificationPane from "../components/Notification/NotificationPane.vue";
import Toaster from "../components/Notification/Toaster.vue";
import { createNotifications } from "../components/Notification/notifications";
import { sampleNotifications } from "../components/Notification/notification.samples";
import PageHeader from "../components/PageHeader/PageHeader.vue";
import RadioGroup from "../components/RadioGroup/RadioGroup.vue";
import RelativeTime from "../components/RelativeTime/RelativeTime.vue";
import Select from "../components/Select/Select.vue";
import Slideover from "../components/Slideover/Slideover.vue";
import StatTile from "../components/StatTile/StatTile.vue";
import SummaryList from "../components/SummaryList/SummaryList.vue";
import Switch, { type SwitchProps } from "../components/Switch/Switch.vue";
import Table from "../components/Table/Table.vue";
import type { TableColumn } from "../components/Table/table";
import type { SidebarSection } from "../components/Sidebar/Sidebar.vue";

/**
 * More whole pages, each built only from library components: a student's
 * record, reviewing an application, booking an interview, and notification
 * settings. Not part of the library itself.
 */
const meta = {
  title: "Examples/School pages",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const user = { name: "Ben Smith", email: "ben.smith@keston.school", organisation: "The Keston School" };

const shared = {
  AppShell,
  NotificationPane,
  Toaster,
  PageHeader,
  Button,
  Card,
  Badge,
};

const bell = `<template #header-trailing><NotificationPane :notifications="notifications" /></template>`;
const toaster = `<Toaster :notifications="notifications" />`;

/** The sidebar with one page marked as current. */
function sidebar(sections: SidebarSection[], current: string): SidebarSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item, active: item.label === current })),
  }));
}

const studentsSidebar: SidebarSection[] = [
  {
    items: [
      { label: "Home", icon: LayoutDashboard },
      { label: "Students", icon: Users },
      { label: "Attendance", icon: ClipboardCheck },
      { label: "Documents", icon: FileText },
    ],
  },
  { label: "Admin", items: [{ label: "Settings", icon: Settings }] },
];

const admissionsSidebar: SidebarSection[] = [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Applications", icon: Inbox, badge: 12 },
      { label: "Interviews", icon: CalendarDays },
      { label: "Offers", icon: ClipboardCheck },
    ],
  },
  { label: "Admin", items: [{ label: "Settings", icon: Settings }] },
];

// Fixed "now", so relative times read the same every time the story opens.
const now = new Date(2026, 10, 11, 14, 30);
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000);

// ── Student record ──────────────────────────────────────────────────────────

/**
 * One student's record: who they are, how they're doing, who to contact,
 * and staff notes that save as you type. The page header carries the
 * student's photo (initials here), year and house; the rest is Cards on a
 * two-column grid that stacks on narrow screens.
 */
export const StudentRecord: Story = {
  render: () => ({
    components: { ...shared, Age, Avatar, Divider, InfoTip, InputRichText, RelativeTime, StatTile, SummaryList, Mail, Pencil, Phone },
    setup() {
      const notifications = createNotifications(sampleNotifications());
      const student = { name: "Ada Okafor", role: "Year 9 · Hawking House" };

      const details = [
        { label: "Date of birth", value: "26 January 2012" },
        { label: "Tutor group", value: "9H2 · Mr Patel" },
        { label: "House", value: "Hawking" },
        { label: "Student ID", value: "KS-20491" },
        { label: "Free school meals", value: "Yes", description: "Eligible since September 2024" },
        { label: "Medical", value: "Nut allergy", description: "Carries an adrenaline pen" },
      ];

      const contacts = [
        { name: "Grace Okafor", relation: "Mother · lives with Ada", phone: "07700 900184", email: "grace.okafor@example.com", primary: true },
        { name: "Daniel Okafor", relation: "Father", phone: "07700 900662", email: "d.okafor@example.com", primary: false },
      ];

      const activity = [
        { text: "Merit for science homework", by: "Ms Hughes", at: hoursAgo(3) },
        { text: "Late to registration (bus)", by: "Mr Patel", at: hoursAgo(27) },
        { text: "Medical form updated", by: "Grace Okafor", at: hoursAgo(75) },
      ];

      // Notes save a moment after typing stops.
      const notes = ref(
        "<p>Settled in well after moving from Riverside. <strong>Nut allergy</strong>: kitchen and trip leaders told.</p><p>Mum prefers calls after 3pm, <em>not</em> on Fridays.</p>",
      );
      const notesStatus = ref<InputRichTextProps["status"]>();
      const notesText = ref<string>();
      let timer: ReturnType<typeof setTimeout> | undefined;
      watch(notes, () => {
        clearTimeout(timer);
        notesStatus.value = "loading";
        notesText.value = "Saving…";
        timer = setTimeout(() => {
          notesStatus.value = "success";
          notesText.value = "Saved";
        }, 900);
      });

      return {
        nav: sidebar(studentsSidebar, "Students"),
        user,
        notifications,
        student,
        details,
        contacts,
        activity,
        notes,
        notesStatus,
        notesText,
        now,
        trail: [{ label: "Students", href: "#" }, { label: "Year 9", href: "#" }, { label: "Ada Okafor" }],
      };
    },
    template: `
      <AppShell title="Keston Students" :sections="nav" :user="user">
        ${bell}
        <div class="flex flex-col gap-6 p-4 sm:p-6">
          <PageHeader :title="student.name" :breadcrumb="trail">
            <template #badge>
              <Badge color="blue">Year 9</Badge>
            </template>
            <template #description>
              <span class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Hawking House</span>
                <span aria-hidden="true">·</span>
                <span>Age <Age birth-date="2012-01-26" :now="now" /></span>
              </span>
            </template>
            <template #actions>
              <Button><template #leading><Mail /></template>Email family</Button>
              <Button variant="primary"><template #leading><Pencil /></template>Edit details</Button>
            </template>
          </PageHeader>

          <div class="@container">
            <div class="grid grid-cols-1 items-start gap-6 @4xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div class="flex flex-col gap-6">
                <!-- This term at a glance -->
                <div class="grid grid-cols-1 gap-4 @lg:grid-cols-3">
                  <StatTile label="Attendance" value="96.4%" change="+1.2%" change-label="on last term" trend="up">
                    <template #footer>
                      <span class="flex items-center gap-1 text-xs text-black/65">
                        This term
                        <InfoTip label="About attendance" text="Sessions attended as a share of possible sessions. Authorised absences count against it." />
                      </span>
                    </template>
                  </StatTile>
                  <StatTile label="Merits" value="14" change="+3" change-label="this week" trend="up" />
                  <StatTile label="Late marks" value="2" trend="flat" />
                </div>

                <Card title="Details">
                  <SummaryList :items="details" />
                </Card>

                <Card title="Staff notes" description="Seen by staff only, not by the family.">
                  <InputRichText
                    v-model="notes"
                    label="Notes on Ada Okafor"
                    :status="notesStatus"
                    :status-text="notesText"
                    placeholder="Add a note…"
                  />
                </Card>
              </div>

              <div class="flex flex-col gap-6">
                <Card title="Contacts" padding="sm">
                  <template v-for="(contact, i) in contacts" :key="contact.name">
                    <Divider v-if="i > 0" />
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center gap-2">
                        <Avatar :user="{ name: contact.name }" size="sm" decorative />
                        <div class="flex min-w-0 flex-col">
                          <span class="flex items-center gap-2 text-sm font-bold">
                            {{ contact.name }}
                            <Badge v-if="contact.primary" size="sm">Primary</Badge>
                          </span>
                          <span class="text-xs text-black/65">{{ contact.relation }}</span>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <Button size="sm"><template #leading><Phone /></template>{{ contact.phone }}</Button>
                        <Button size="sm"><template #leading><Mail /></template>Email</Button>
                      </div>
                    </div>
                  </template>
                </Card>

                <Card title="Recent activity" padding="sm">
                  <ul class="flex flex-col gap-3 text-sm">
                    <li v-for="item in activity" :key="item.text" class="flex flex-col gap-0.5">
                      <span>{{ item.text }}</span>
                      <span class="text-xs text-black/65">{{ item.by }} · <RelativeTime :date="item.at" :now="now" /></span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
      ${toaster}`,
  }),
};

// ── Application review ──────────────────────────────────────────────────────

type Status = "New" | "Awaiting documents" | "Interview" | "Offered" | "Declined";
const statusColour: Record<Status, BadgeProps["color"]> = {
  New: "blue",
  "Awaiting documents": "yellow",
  Interview: "blue",
  Offered: "green",
  Declined: "basic",
};

interface Application {
  id: string;
  name: string;
  entry: string;
  submitted: Date;
  status: Status;
  documents: { address: boolean; report: boolean; medical: boolean };
  sibling: boolean;
  currentSchool: string;
}

/**
 * Working through applications: a sortable Table, and "Review" opens a
 * Slideover with the application, which documents are in, a decision, and
 * notes. Recording a decision updates the row and confirms with a toast.
 */
export const ApplicationReview: Story = {
  render: () => ({
    components: { ...shared, Checkbox, Checklist, InputRichText, RadioGroup, RelativeTime, Slideover, StatTile, SummaryList, Table },
    setup() {
      const notifications = createNotifications(sampleNotifications());
      const application = (
        id: string, name: string, entry: string, hours: number, status: Status,
        documents: Application["documents"], sibling: boolean, currentSchool: string,
      ): Application => ({ id, name, entry, submitted: hoursAgo(hours), status, documents, sibling, currentSchool });

      const all = { address: true, report: true, medical: true };
      const applications = reactive<Application[]>([
        application("A-1042", "Ethan Clarke", "Year 7, Sept 2027", 2, "New", all, true, "St Mary's Primary"),
        application("A-1041", "Maya Patel", "Year 7, Sept 2027", 20, "Awaiting documents", { address: true, report: false, medical: false }, false, "Riverside Primary"),
        application("A-1039", "Noah Wilson", "Year 12, Sept 2027", 50, "Interview", all, false, "Northfield Academy"),
        application("A-1036", "Isla Hughes", "Year 7, Sept 2027", 96, "Offered", all, true, "Oak Lane Primary"),
        application("A-1031", "Leo Thompson", "Year 9, Jan 2027", 170, "Declined", { address: true, report: true, medical: false }, false, "Home educated"),
        application("A-1030", "Zara Ahmed", "Year 7, Sept 2027", 190, "New", { address: true, report: true, medical: false }, false, "St Mary's Primary"),
      ]);

      const columns: TableColumn<Application>[] = [
        { key: "name", label: "Applicant", rowHeader: true, sortable: true },
        { key: "entry", label: "Entry", sortable: true },
        { key: "submitted", label: "Submitted", sortable: true, sortValue: (row) => row.submitted.getTime() },
        { key: "status", label: "Status", sortable: true },
        { key: "review", label: "Review", hideLabel: true, align: "end" },
      ];
      const sort = ref({ key: "submitted", direction: "desc" as const });

      const count = (status: Status) => applications.filter((a) => a.status === status).length;
      const stats = computed(() => [
        { label: "New", value: count("New") },
        { label: "Awaiting documents", value: count("Awaiting documents") },
        { label: "Interviews booked", value: count("Interview") },
      ]);

      // ── The application being reviewed
      const open = ref(false);
      const reviewing = ref<Application>();
      const decision = ref<string>();
      const notes = ref("");
      const tellFamily = ref(true);
      const tried = ref(false);
      const saving = ref<ButtonStatus>("idle");

      function review(row: Application) {
        reviewing.value = row;
        decision.value = undefined;
        notes.value = "";
        tellFamily.value = true;
        tried.value = false;
        saving.value = "idle";
        open.value = true;
      }

      const summary = computed(() => {
        const a = reviewing.value;
        if (!a) return [];
        return [
          { label: "Entry", value: a.entry },
          { label: "Current school", value: a.currentSchool },
          { label: "Sibling at Keston", value: a.sibling ? "Yes" : "No", description: a.sibling ? "Priority under the admissions policy" : undefined },
          { label: "Reference", value: a.id },
        ];
      });
      const documents = computed(() => {
        const d = reviewing.value?.documents;
        if (!d) return [];
        return [
          { label: "Proof of address", done: d.address },
          { label: "School report", done: d.report },
          { label: "Medical form", done: d.medical },
        ];
      });
      const missing = computed(() => documents.value.filter((d) => !d.done).length);

      const decisions = computed(() => [
        { label: "Invite to interview", value: "Interview", description: "The family is sent a link to book a slot" },
        { label: "Make an offer", value: "Offered", description: "Offers can be made without an interview for Year 7" },
        {
          label: "Ask for documents",
          value: "Awaiting documents",
          description: missing.value ? `${missing.value} missing` : "Nothing is missing",
          disabled: !missing.value,
        },
        { label: "Decline", value: "Declined", description: "Explain why in the notes; the family sees a standard letter" },
      ]);
      const decisionError = computed(() => (tried.value && !decision.value ? "Choose a decision" : undefined));
      const notesError = computed(() =>
        tried.value && decision.value === "Declined" && !notes.value ? "Add a note explaining why" : undefined,
      );

      function record() {
        tried.value = true;
        if (decisionError.value || notesError.value) return;
        saving.value = "loading";
        setTimeout(() => {
          const a = reviewing.value!;
          a.status = decision.value as Status;
          saving.value = "success";
          setTimeout(() => {
            open.value = false;
            notifications.notify({
              type: "success",
              title: `${a.name}: ${a.status === "Interview" ? "invited to interview" : a.status.toLowerCase()}`,
              description: tellFamily.value ? "The family has been emailed." : "The family hasn't been told yet.",
            });
          }, 600);
        }, 900);
      }

      return {
        nav: sidebar(admissionsSidebar, "Applications"),
        user, notifications, applications, columns, sort, stats, statusColour, now,
        open, reviewing, decision, decisions, notes, tellFamily, saving, summary, documents, decisionError, notesError, review, record,
      };
    },
    template: `
      <AppShell title="Keston Admissions" :sections="nav" :user="user">
        ${bell}
        <div class="flex flex-col gap-6 p-4 sm:p-6">
          <PageHeader title="Applications" description="Applications for entry in 2027. Newest first." />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile v-for="stat in stats" :key="stat.label" v-bind="stat" />
          </div>

          <Card padding="none">
            <Table v-model:sort="sort" :columns="columns" :rows="applications" row-key="id" caption="Applications">
              <template #cell-submitted="{ row }"><span class="text-black/65"><RelativeTime :date="row.submitted" :now="now" /></span></template>
              <template #cell-status="{ row }"><Badge :color="statusColour[row.status]" size="sm">{{ row.status }}</Badge></template>
              <template #cell-review="{ row }">
                <Button size="sm" :aria-label="'Review ' + row.name" @click="review(row)">Review</Button>
              </template>
            </Table>
          </Card>
        </div>

        <Slideover
          v-model:open="open"
          :title="reviewing?.name"
          :description="reviewing ? reviewing.entry + ' · submitted ' + reviewing.submitted.toLocaleDateString('en-GB', { dateStyle: 'long' }) : ''"
        >
          <template #body>
            <div v-if="reviewing" class="flex flex-col gap-6">
              <SummaryList :items="summary" layout="compact" />

              <div class="flex flex-col gap-2">
                <h3 class="text-sm font-bold">Documents</h3>
                <Checklist :items="documents" />
              </div>

              <RadioGroup v-model="decision" label="Decision" :options="decisions" :error-text="decisionError" required />

              <InputRichText v-model="notes" label="Notes" helper="Seen by admissions staff only." placeholder="Why this decision?" :error-text="notesError" />

              <Checkbox v-model="tellFamily" label="Email the family now" description="Otherwise they're told when decisions are published on 1 March." />
            </div>
          </template>
          <template #footer="{ close }">
            <Button @click="close">Cancel</Button>
            <Button variant="primary" v-model:status="saving" loading-text="Saving…" success-text="Saved" @click="record">Record decision</Button>
          </template>
        </Slideover>
      </AppShell>
      ${toaster}`,
  }),
};

// ── Interview booking ───────────────────────────────────────────────────────

const slotTimes = ["09:00", "09:45", "10:30", "11:15", "13:30", "14:15", "15:00"];
// Which slots are already taken, by day of the month (fake data).
const taken = (day: number) => slotTimes.filter((_, i) => (day * 3 + i) % 4 === 0);

/**
 * Booking an interview: choose a day on the Calendar (weekdays this term
 * only), then a free slot and who's interviewing. The summary follows along,
 * and booking confirms with a toast.
 */
export const InterviewBooking: Story = {
  render: () => ({
    components: { ...shared, Calendar, Checkbox, RadioGroup, Select, SummaryList },
    setup() {
      const notifications = createNotifications(sampleNotifications());
      const day = ref<string>("2026-11-18");
      const slot = ref<string>();
      const interviewer = ref<string>();
      const virtual = ref(false);
      const tried = ref(false);
      const status = ref<ButtonStatus>("idle");

      const date = computed(() => (day.value ? new Date(day.value + "T00:00") : undefined));
      const weekend = computed(() => !!date.value && [0, 6].includes(date.value.getDay()));
      const dayLabel = computed(() => date.value?.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }));

      const slots = computed(() => {
        if (!date.value || weekend.value) return [];
        const busy = taken(date.value.getDate());
        return slotTimes.map((time) => ({
          label: time,
          value: time,
          description: busy.includes(time) ? "Booked" : "45 minutes",
          disabled: busy.includes(time),
        }));
      });
      watch(day, () => (slot.value = undefined));

      const interviewers = [
        { label: "Mrs Hughes", value: "hughes", description: "Head of Year 7" },
        { label: "Mr Patel", value: "patel", description: "Deputy Head" },
        { label: "Ms Clarke", value: "clarke", description: "Head of Sixth Form" },
      ];

      const summary = computed(() => [
        { label: "Applicant", value: "Noah Wilson" },
        { label: "Day", value: dayLabel.value ?? null },
        { label: "Time", value: slot.value ?? null },
        { label: "Interviewer", value: interviewers.find((i) => i.value === interviewer.value)?.label ?? null },
        { label: "Where", value: virtual.value ? "Video call" : "Main reception" },
      ]);

      const slotError = computed(() => (tried.value && !slot.value ? "Choose a time" : undefined));
      const interviewerError = computed(() => (tried.value && !interviewer.value ? "Choose who's interviewing" : undefined));

      function book() {
        tried.value = true;
        if (slotError.value || interviewerError.value) return;
        status.value = "loading";
        setTimeout(() => {
          status.value = "success";
          notifications.notify({ type: "success", title: "Interview booked", description: `Noah Wilson, ${dayLabel.value} at ${slot.value}. The family has been emailed.` });
        }, 900);
      }

      return {
        nav: sidebar(admissionsSidebar, "Interviews"),
        user, notifications, day, slot, slots, weekend, dayLabel, interviewer, interviewers, virtual, summary, slotError, interviewerError, status, book,
        trail: [{ label: "Interviews", href: "#" }, { label: "Book an interview" }],
      };
    },
    template: `
      <AppShell title="Keston Admissions" :sections="nav" :user="user">
        ${bell}
        <div class="flex flex-col gap-6 p-4 sm:p-6">
          <PageHeader title="Book an interview" description="Noah Wilson · Year 12, September 2027" :breadcrumb="trail" />

          <div class="@container">
            <div class="grid grid-cols-1 items-start gap-6 @4xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
              <!-- A fixed column: a Card is a size container, so it can't be
                   sized by its content (the calendar) in an auto column. -->
              <Card title="Day">
                <Calendar v-model="day" min="2026-11-12" max="2026-12-18" />
              </Card>

              <Card :title="dayLabel ? 'Times on ' + dayLabel : 'Times'">
                <p v-if="weekend" class="text-sm text-black/65">No interviews at weekends. Choose a weekday.</p>
                <template v-else>
                  <RadioGroup v-model="slot" label="Time" :options="slots" :error-text="slotError" />
                  <Select v-model="interviewer" label="Interviewer" :options="interviewers" placeholder="Choose…" :error-text="interviewerError" />
                  <Checkbox v-model="virtual" label="Video call" description="The link is sent with the confirmation." />
                </template>
              </Card>

              <Card as="aside" title="Booking" padding="sm" class="@4xl:sticky @4xl:top-18">
                <SummaryList :items="summary" layout="compact" />
                <Button variant="primary" class="w-full" :disabled="weekend" v-model:status="status" loading-text="Booking…" success-text="Booked" @click="book">
                  Book interview
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
      ${toaster}`,
  }),
};

// ── Notification settings ───────────────────────────────────────────────────

/**
 * A settings page of Switches that save as soon as they're flipped (every
 * fourth save fails, to show the error), with a RadioGroup for how often
 * the summary email comes. No Save button: each setting confirms itself.
 */
export const NotificationSettings: Story = {
  render: () => ({
    components: { ...shared, RadioGroup, Switch },
    setup() {
      const notifications = createNotifications(sampleNotifications());

      type Setting = { key: string; label: string; description: string; on: boolean; status?: SwitchProps["status"]; statusText?: string };
      const groups = reactive([
        {
          title: "Applications",
          settings: [
            { key: "new", label: "New applications", description: "As soon as one is submitted.", on: true },
            { key: "documents", label: "Documents uploaded", description: "When a family uploads something you asked for.", on: true },
            { key: "withdrawn", label: "Applications withdrawn", description: "", on: false },
          ] as Setting[],
        },
        {
          title: "Interviews",
          settings: [
            { key: "booked", label: "Interviews booked", description: "When a family books one of your slots.", on: true },
            { key: "reminder", label: "Reminders", description: "The day before, at 8am.", on: true },
          ] as Setting[],
        },
      ]);

      let saves = 0;
      function save(setting: Setting, next: boolean) {
        setting.status = "loading";
        setting.statusText = "Saving…";
        setTimeout(() => {
          if (++saves % 4 === 0) {
            setting.on = !next;
            setting.status = "error";
            setting.statusText = "Couldn't save. Try again.";
            return;
          }
          setting.status = "success";
          setting.statusText = "Saved";
          setTimeout(() => {
            if (setting.status === "success") setting.status = setting.statusText = undefined;
          }, 2000);
        }, 700);
      }

      const digest = ref("daily");
      const digestOptions = [
        { label: "Every morning", value: "daily", description: "At 7am, if anything happened" },
        { label: "Every Monday", value: "weekly" },
        { label: "Never", value: "never", description: "You'll still get the notifications above" },
      ];
      watch(digest, () => notifications.notify({ type: "success", title: "Summary email updated", compact: true }));

      return {
        nav: sidebar(admissionsSidebar, "Settings"),
        user, notifications, groups, save, digest, digestOptions,
        trail: [{ label: "Settings", href: "#" }, { label: "Notifications" }],
      };
    },
    template: `
      <AppShell title="Keston Admissions" :sections="nav" :user="user">
        ${bell}
        <div class="flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
          <PageHeader title="Notifications" description="What you're told about, and how. These are just for you." :breadcrumb="trail" />

          <Card v-for="group in groups" :key="group.title" :title="group.title">
            <div class="flex flex-col gap-4">
              <Switch
                v-for="setting in group.settings"
                :key="setting.key"
                v-model="setting.on"
                :label="setting.label"
                :description="setting.description || undefined"
                :status="setting.status"
                :status-text="setting.statusText"
                @update:model-value="save(setting, $event)"
              />
            </div>
          </Card>

          <Card title="Summary email">
            <RadioGroup v-model="digest" label="How often" :options="digestOptions" />
          </Card>
        </div>
      </AppShell>
      ${toaster}`,
  }),
};
