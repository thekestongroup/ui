import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { AppWindow, UserRound } from "@lucide/vue";
import { ref } from "vue";
import Card from "../Card/Card.vue";
import Tabs from "./Tabs.vue";

const meta = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "User details",
    tabs: [
      { value: "account", label: "Account", icon: UserRound },
      { value: "licences", label: "Licences & Apps", icon: AppWindow },
    ],
  },
  render: (args) => ({
    components: { Tabs, Card },
    setup: () => ({ args, tab: ref("account") }),
    template: `
      <Tabs v-bind="args" v-model="tab">
        <template #account><Card title="Profile">Name, email, password and MFA.</Card></template>
        <template #licences><Card title="Licences">Keston Work, and which apps they have.</Card></template>
      </Tabs>`,
  }),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A user's page: Account, and Licences & Apps. Arrow keys move between tabs. */
export const Default: Story = {};

/** Without icons, with more tabs, one turned off. Narrow the preview to see the list scroll. */
export const Plain: Story = {
  args: {
    label: "Organisation",
    tabs: [
      { value: "account", label: "Overview" },
      { value: "licences", label: "Users" },
      { value: "groups", label: "Groups" },
      { value: "billing", label: "Billing", disabled: true },
    ],
  },
};
