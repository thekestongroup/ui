import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { Ellipsis } from "@lucide/vue";
import Badge from "../Badge/Badge.vue";
import Button from "../Button/Button.vue";
import Card from "../Card/Card.vue";
import Table, { type TableProps } from "./Table.vue";
import type { TableColumn, TableSort } from "./table";

type Applicant = {
  id: number;
  name: string;
  year: string;
  applied: Date;
  score: number | null;
  status: "Offered" | "Interview" | "Waiting list" | "Declined";
};

const statusColors = { Offered: "green", Interview: "blue", "Waiting list": "yellow", Declined: "basic" } as const;

const applicants: Applicant[] = [
  { id: 1, name: "Amelia Clarke", year: "Year 7", applied: new Date(2026, 9, 3), score: 87, status: "Offered" },
  { id: 2, name: "Noah Patel", year: "Year 9", applied: new Date(2026, 9, 12), score: 74, status: "Interview" },
  { id: 3, name: "Isla Hughes", year: "Year 12", applied: new Date(2026, 8, 28), score: null, status: "Waiting list" },
  { id: 4, name: "Leo Okafor", year: "Year 7", applied: new Date(2026, 9, 19), score: 91, status: "Offered" },
  { id: 5, name: "Freya Lewis", year: "Year 10", applied: new Date(2026, 9, 7), score: 62, status: "Declined" },
  { id: 6, name: "Arjun Shah", year: "Year 8", applied: new Date(2026, 9, 21), score: 79, status: "Interview" },
];

const columns: TableColumn<Applicant>[] = [
  { key: "name", label: "Applicant", sortable: true, rowHeader: true },
  { key: "year", label: "Year group", sortable: true },
  { key: "applied", label: "Applied", sortable: true },
  { key: "score", label: "Score", sortable: true, align: "end" },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions", hideLabel: true, align: "end" },
];

const date = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const meta = {
  title: "Components/Data/Table",
  // A generic component, which Meta<typeof Table> can't describe, so the args are typed by its props.
  component: Table as any,
  tags: ["autodocs"],
  parameters: { backgrounds: { disable: true } },
  argTypes: { size: { options: ["md", "sm"], control: { type: "inline-radio" } } },
  args: {
    columns: columns as TableColumn[],
    rows: applicants,
    rowKey: "id",
    caption: "Applications for September 2027",
    size: "md",
    loading: false,
    stickyHeader: false,
    showCaption: false,
  },
  decorators: [() => ({ template: '<div class="bg-background p-6"><story /></div>' })],
  render: (args) => ({
    components: { Table, Card, Badge, Button, Ellipsis },
    setup: () => ({ args, statusColors, date }),
    template: `
      <Card padding="none">
        <Table v-bind="args">
          <template #cell-applied="{ value }">{{ date(value) }}</template>
          <template #cell-score="{ value }">{{ value ?? '—' }}</template>
          <template #cell-status="{ value }"><Badge size="sm" :color="statusColors[value]">{{ value }}</Badge></template>
          <template #cell-actions="{ row }">
            <Button variant="ghost" size="sm" square :aria-label="'More for ' + row.name"><Ellipsis /></Button>
          </template>
        </Table>
      </Card>`,
  }),
} satisfies Meta<TableProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. Click a heading to sort: ascending, descending, then back to the original order. */
export const Default: Story = {};

/** Plain text cells, no slots: the simplest table. */
export const Simple: Story = {
  args: {
    columns: [
      { key: "name", label: "Class", rowHeader: true },
      { key: "teacher", label: "Teacher" },
      { key: "room", label: "Room" },
      { key: "students", label: "Students", align: "end" },
    ],
    rows: [
      { name: "8Y/En1", teacher: "Ms Rahman", room: "E12", students: 28 },
      { name: "8Y/En2", teacher: "Mr Blissett", room: "E14", students: 27 },
      { name: "8Y/Ma1", teacher: "Mrs Okoro", room: "M3", students: 30 },
    ],
    rowKey: "name",
    caption: "Year 8 classes",
  },
  render: (args) => ({
    components: { Table, Card },
    setup: () => ({ args }),
    template: `<Card padding="none"><Table v-bind="args" /></Card>`,
  }),
};

/** In a titled Card: the card names the section, the caption names the table. */
export const InCard: Story = {
  render: (args) => ({
    components: { Table, Card, Badge, Button },
    setup: () => ({ args, statusColors, date }),
    template: `
      <Card title="Applications" description="6 for September 2027" padding="none" :ui="{ header: 'px-4 pt-4 sm:px-6 sm:pt-6' }">
        <template #actions><Button size="sm">Export</Button></template>
        <Table v-bind="args" :columns="args.columns.slice(0, 5)">
          <template #cell-applied="{ value }">{{ date(value) }}</template>
          <template #cell-score="{ value }">{{ value ?? '—' }}</template>
          <template #cell-status="{ value }"><Badge size="sm" :color="statusColors[value]">{{ value }}</Badge></template>
        </Table>
      </Card>`,
  }),
};

/** size="sm": 8px above and below each cell, for dense tables. */
export const Small: Story = { args: { size: "sm" } };

/** A footer row for totals, in a `<tfoot>`. */
export const WithTotals: Story = {
  args: {
    columns: [
      { key: "item", label: "Item", rowHeader: true },
      { key: "qty", label: "Qty", align: "end" },
      { key: "amount", label: "Amount", align: "end" },
    ],
    rows: [
      { item: "Autumn term fees", qty: 1, amount: "£6,450.00" },
      { item: "Lunches", qty: 62, amount: "£186.00" },
      { item: "Geography trip", qty: 1, amount: "£45.00" },
    ],
    rowKey: "item",
    caption: "Invoice INV-2027-0142",
  },
  render: (args) => ({
    components: { Table, Card },
    setup: () => ({ args }),
    template: `
      <Card padding="none" class="max-w-lg">
        <Table v-bind="args">
          <template #footer>
            <tr><th scope="row" class="text-left">Total</th><td></td><td class="text-right tabular-nums">£6,681.00</td></tr>
          </template>
        </Table>
      </Card>`,
  }),
};

/** A long table that scrolls inside a fixed height, keeping the header in view. */
export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
    class: "max-h-72",
    rows: Array.from({ length: 24 }, (_, i) => ({ ...applicants[i % 6], id: i + 1 })),
  },
};

/** No rows yet, with a custom empty message. */
export const Empty: Story = {
  args: { rows: [] },
  render: (args) => ({
    components: { Table, Card, Button },
    setup: () => ({ args }),
    template: `
      <Card padding="none">
        <Table v-bind="args">
          <template #empty>
            <div class="flex flex-col items-center gap-3">
              <span>No applications yet.</span>
              <Button size="sm">Share the application form</Button>
            </div>
          </template>
        </Table>
      </Card>`,
  }),
};

/** Loading with no rows shows a spinner; with rows (refreshing) dims them. */
export const Loading: Story = { args: { rows: [], loading: true } };

/** manualSort: the table only reports the sort, e.g. to fetch sorted rows from the server. */
export const ManualSort: Story = {
  render: (args) => ({
    components: { Table, Card },
    setup() {
      const sort = ref<TableSort | null>({ key: "name", direction: "asc" });
      return { args, sort, date };
    },
    template: `
      <div class="flex flex-col gap-3">
        <p class="text-sm">sort: <code>{{ JSON.stringify(sort) }}</code> (rows not re-ordered)</p>
        <Card padding="none">
          <Table v-bind="args" :columns="args.columns.slice(0, 4)" v-model:sort="sort" manual-sort>
            <template #cell-applied="{ value }">{{ date(value) }}</template>
          </Table>
        </Card>
      </div>`,
  }),
};
