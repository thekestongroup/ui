import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import SettingsRow from "./SettingsRow.vue";
import Card from "../Card/Card.vue";
import Select from "../Select/Select.vue";
import InputNumber from "../InputNumber/InputNumber.vue";
import Switch from "../Switch/Switch.vue";
import Divider from "../Divider/Divider.vue";

const meta = {
  title: "Components/Layout/SettingsRow",
  component: SettingsRow,
  tags: ["autodocs"],
  args: {
    label: "Multi-factor authentication",
    description: "Recommended for security. All users must verify with a second factor when they sign in.",
  },
  decorators: [() => ({ template: '<div class="max-w-3xl"><story /></div>' })],
  render: (args) => ({
    components: { SettingsRow, Select },
    setup: () => ({ args, mode: ref("required") }),
    template: `
      <SettingsRow v-bind="args">
        <Select v-model="mode" :label="args.label" hide-label :options="[
          { label: 'Off', value: 'off' },
          { label: 'Require MFA', value: 'required' },
          { label: 'Custom rules', value: 'custom' },
        ]" />
      </SettingsRow>`,
  }),
} satisfies Meta<typeof SettingsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Label and description on the left, the control on the right. It stacks on narrow screens. */
export const Default: Story = {};

/** Several settings in a Card, with a Divider between them. */
export const InACard: Story = {
  render: () => ({
    components: { SettingsRow, Select, InputNumber, Switch, Card, Divider },
    setup: () => ({ mode: ref("required"), days: ref(14), everyone: ref(true) }),
    template: `
      <Card class="flex flex-col gap-6 p-6">
        <SettingsRow label="Multi-factor authentication" description="All users must verify with a second factor when they sign in.">
          <Select v-model="mode" label="Multi-factor authentication" hide-label :options="[{ label: 'Off', value: 'off' }, { label: 'Require MFA', value: 'required' }]" />
        </SettingsRow>
        <Divider />
        <SettingsRow label="Grace period" description="How many days people have to set it up before it's enforced.">
          <InputNumber v-model="days" label="Grace period" hide-label :min="0" :max="90" />
        </SettingsRow>
        <Divider />
        <SettingsRow label="Remind people" description="Show a reminder each time they sign in during the grace period.">
          <Switch v-model="everyone" label="Remind people" hide-label />
        </SettingsRow>
      </Card>`,
  }),
};
