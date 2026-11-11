import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import Switch, { type SwitchProps } from "./Switch.vue";

const meta = {
  title: "Components/Form/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    status: { options: [undefined, "error", "success", "loading"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Email me when an application arrives",
    description: "",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args, value: ref(false) }),
    template: '<Switch v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    label: "Weekly summary",
    description: "A Monday email with new applications, interviews and offers.",
  },
};

/**
 * A setting saved as soon as it's flipped: "Saving…" while it saves, then
 * "Saved". Here the save is faked with a delay, and every third one fails,
 * putting the switch back.
 */
export const SavesStraightAway: Story = {
  args: { label: "Show students' photos in registers" },
  render: (args) => ({
    components: { Switch },
    setup() {
      const value = ref(true);
      const status = ref<SwitchProps["status"]>();
      const statusText = ref<string>();
      let saves = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;
      async function save(next: boolean) {
        clearTimeout(timer);
        status.value = "loading";
        statusText.value = "Saving…";
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (++saves % 3 === 0) {
          value.value = !next;
          status.value = "error";
          statusText.value = "Couldn't save. Try again.";
          return;
        }
        status.value = "success";
        statusText.value = "Saved";
        // The confirmation goes once it's been seen.
        timer = setTimeout(() => (statusText.value = status.value = undefined), 2000);
      }
      return { args, value, status, statusText, save };
    },
    template:
      '<Switch v-bind="args" v-model="value" :status="status" :status-text="statusText" @update:model-value="save" />',
  }),
};

/** A list of settings, each with its own switch. */
export const SettingsList: Story = {
  render: () => ({
    components: { Switch },
    setup: () => ({
      settings: ref([
        { label: "New applications", description: "As soon as one is submitted.", on: true },
        { label: "Interview reminders", description: "The day before, at 8am.", on: true },
        { label: "Offers accepted", description: "", on: false },
      ]),
    }),
    template: `
      <div class="flex flex-col gap-4">
        <Switch
          v-for="setting in settings"
          :key="setting.label"
          v-model="setting.on"
          :label="setting.label"
          :description="setting.description || undefined"
        />
      </div>`,
  }),
};

export const Disabled: Story = { args: { disabled: true } };
