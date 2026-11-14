import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { AppWindow, BellOff, Inbox, SearchX, Users } from "@lucide/vue";
import Button from "../Button/Button.vue";
import Card from "../Card/Card.vue";
import EmptyState from "./EmptyState.vue";

const meta = {
  title: "Components/Data/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["sm", "md"], control: { type: "inline-radio" } },
    headingLevel: { options: [undefined, 2, 3, 4], control: { type: "select" } },
    icon: { control: false },
  },
  args: {
    title: "No connected apps",
    description: "When you sign in to an app with your Keston account, it'll show here and you can remove its access.",
    icon: AppWindow,
    size: "md",
  },
  render: (args) => ({
    components: { EmptyState, Card },
    setup: () => ({ args }),
    template: `<Card><EmptyState v-bind="args" /></Card>`,
  }),
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. In a Card, as on a page with nothing in it yet. */
export const Default: Story = {};

/** With what to do next, in the actions slot. */
export const WithAction: Story = {
  args: {
    title: "No students in this class",
    description: "Add students one by one, or import them from a spreadsheet.",
    icon: Users,
  },
  render: (args) => ({
    components: { EmptyState, Card, Button },
    setup: () => ({ args }),
    template: `
      <Card>
        <EmptyState v-bind="args">
          <template #actions>
            <Button>Import</Button>
            <Button variant="primary">Add a student</Button>
          </template>
        </EmptyState>
      </Card>`,
  }),
};

/** Nothing matched a search or filter: say so, and offer a way back. */
export const NoResults: Story = {
  args: {
    title: "No results for “Smyth”",
    description: "Check the spelling, or search by student number instead.",
    icon: SearchX,
  },
  render: (args) => ({
    components: { EmptyState, Card, Button },
    setup: () => ({ args }),
    template: `
      <Card>
        <EmptyState v-bind="args">
          <template #actions><Button>Clear search</Button></template>
        </EmptyState>
      </Card>`,
  }),
};

/** Both sizes: md for a Card or page, sm for panels, popovers and tables. */
export const Sizes: Story = {
  render: () => ({
    components: { EmptyState, Card },
    setup: () => ({ Inbox, BellOff }),
    template: `
      <div class="grid gap-4 sm:grid-cols-2">
        <Card title="md">
          <EmptyState :icon="Inbox" title="No messages" description="Messages from families show here." />
        </Card>
        <Card title="sm">
          <EmptyState size="sm" :icon="BellOff" description="You're all caught up." />
        </Card>
      </div>`,
  }),
};

/**
 * Filling a page's main area: give the title a heading level so it's in the
 * page outline (screen readers can jump to it).
 */
export const AsHeading: Story = {
  args: { headingLevel: 2 },
};
