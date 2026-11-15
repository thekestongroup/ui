import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Ban, Building2, CalendarCog, KeyRound, Layers, LockOpen, LogOut, Pencil, Trash2, UserPlus, Users, UsersRound, X } from "@lucide/vue";
import AvatarGroup from "../AvatarGroup/AvatarGroup.vue";
import Badge from "../Badge/Badge.vue";
import Button from "../Button/Button.vue";
import PageHeader from "./PageHeader.vue";

const meta = {
  title: "Components/Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "New School Year Setup",
    description: "Set up 2027–28 before the summer. Nothing changes for staff or students until you start the new year.",
    breadcrumb: [
      { label: "School", icon: Building2 },
      { label: "School Structure", icon: Layers, href: "#" },
      { label: "New School Year Setup", icon: CalendarCog },
    ],
  },
  render: (args) => ({
    components: { PageHeader, Badge, Button },
    setup: () => ({ args }),
    template: `
      <PageHeader v-bind="args">
        <template #badge><Badge>Draft</Badge></template>
        <template #actions>
          <Button>Save draft</Button>
          <Button variant="primary">Start new year</Button>
        </template>
      </PageHeader>`,
  }),
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Breadcrumb, title with a status badge, description and actions. Narrow the preview to see the actions wrap. */
export const Default: Story = {};

/** A top-level page: just the title and its main action (no breadcrumb for a single step). */
export const TopLevel: Story = {
  args: { title: "Applications", description: undefined, breadcrumb: [{ label: "Applications" }] },
  render: (args) => ({
    components: { PageHeader, Button, UserPlus },
    setup: () => ({ args }),
    template: `
      <PageHeader v-bind="args">
        <template #actions>
          <Button variant="primary"><template #leading><UserPlus /></template>New application</Button>
        </template>
      </PageHeader>`,
  }),
};

/** Who's involved, as an AvatarGroup beside the actions. */
export const WithPeople: Story = {
  render: (args) => ({
    components: { PageHeader, Badge, Button, AvatarGroup },
    setup: () => ({
      args,
      people: [
        { name: "Ben Blissett", role: "Head of Year 9", email: "ben.blissett@keston.school" },
        { name: "Zara Khan", role: "Deputy Head", email: "zara.khan@keston.school" },
        { name: "Oscar Hughes", role: "Data Manager", email: "oscar.hughes@keston.school" },
      ],
    }),
    template: `
      <PageHeader v-bind="args">
        <template #badge><Badge>Draft</Badge></template>
        <template #actions>
          <AvatarGroup :users="people" size="sm" label="Editing with you" class="mr-2" />
          <Button>Save draft</Button>
          <Button variant="primary">Start new year</Button>
        </template>
      </PageHeader>`,
  }),
};

/**
 * A record's everyday actions in the toolbar under the title, with the main
 * action on the right. Narrow the preview to see the toolbar wrap.
 */
export const WithToolbar: Story = {
  args: {
    title: "Jo Bloggs",
    description: "jo.bloggs@keston.school",
    breadcrumb: [
      { label: "Users", icon: Users, href: "#" },
      { label: "Jo Bloggs" },
    ],
    toolbar: [
      { label: "Reset password", icon: KeyRound, onSelect: () => {} },
      { label: "Unblock sign-in", icon: LockOpen, onSelect: () => {} },
      { label: "Sign out everywhere", icon: LogOut, onSelect: () => {} },
      { label: "Delete user", icon: Trash2, onSelect: () => {} },
    ],
  },
  render: (args) => ({
    components: { PageHeader, Badge, Button, Pencil },
    setup: () => ({ args }),
    template: `
      <PageHeader v-bind="args">
        <template #badge><Badge>Disabled</Badge></template>
        <template #actions>
          <Button variant="primary"><template #leading><Pencil /></template>Edit user</Button>
        </template>
      </PageHeader>`,
  }),
};

/**
 * Something before the buttons (`toolbar-start`), e.g. how many rows are
 * ticked. Narrow the preview: actions that don't fit move into the "⋯" menu
 * at the end, and come back as it widens.
 */
export const ToolbarWithSelection: Story = {
  args: {
    title: "Users",
    description: undefined,
    breadcrumb: undefined,
    toolbar: [
      { label: "Reset password", icon: KeyRound, onSelect: () => {} },
      { label: "Change sign-in status", icon: Ban, onSelect: () => {} },
      { label: "Manage group memberships", icon: UsersRound, onSelect: () => {} },
      { label: "Delete users", icon: Trash2, onSelect: () => {} },
      { label: "Clear selection", icon: X, onSelect: () => {} },
    ],
  },
  render: (args) => ({
    components: { PageHeader },
    setup: () => ({ args }),
    template: `
      <PageHeader v-bind="args">
        <template #toolbar-start>2 users selected</template>
      </PageHeader>`,
  }),
};
