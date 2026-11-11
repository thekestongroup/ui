import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import Button from "../Button/Button.vue";
import Header from "../Header/Header.vue";
import Notification from "./Notification.vue";
import NotificationPane from "./NotificationPane.vue";
import Toaster from "./Toaster.vue";
import { createNotifications, type NotificationInput } from "./notifications";
import { passwordExpiry, sampleNotifications } from "./notification.samples";

// Cards and rows on the page background, at a toast's width. Header stories
// use their own (full width), so this is per story rather than in meta.
const narrow = () => ({ template: '<div class="bg-background p-6"><div class="max-w-sm"><story /></div></div>' });

const meta = {
  title: "Components/Overlay/Notification",
  component: Notification,
  tags: ["autodocs"],
  parameters: { backgrounds: { disable: true } },
  argTypes: {
    type: { options: ["info", "success", "warning", "error"], control: { type: "inline-radio" } },
    appearance: { options: ["card", "row"], control: { type: "inline-radio" } },
    description: { control: "text" },
  },
  args: {
    type: "warning",
    title: "Password Expiry",
    description: passwordExpiry.description,
    action: passwordExpiry.action,
    appearance: "card",
    dismissible: true,
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One notification. The description is a render function, so "7 days" can be bold. */
export const Default: Story = { decorators: [narrow] };

/** Each type: its icon and colour. Screen readers hear the type before the title ("Warning: …"). */
export const Types: Story = {
  decorators: [narrow],
  render: () => ({
    components: { Notification },
    template: `
      <div class="flex flex-col gap-3">
        <Notification type="info" title="New application" description="Amelia Clarke applied for Year 7." />
        <Notification type="success" title="Timetable published" description="Staff and students can now see it." />
        <Notification type="warning" title="Password Expiry" description="Your password expires in 7 days." :action="{ label: 'Change password' }" />
        <Notification type="error" title="Census upload failed" description="The file has 3 errors." :action="{ label: 'View errors' }" />
      </div>`,
  }),
};

/**
 * compact: one line, for quick confirmations. The action (e.g. Undo) sits on
 * the right, before the ×. As a toast it's the same width as the others,
 * just shorter; with an action it stays 10 seconds.
 */
export const Compact: Story = {
  decorators: [narrow],
  render: () => ({
    components: { Notification },
    template: `
      <div class="flex flex-col gap-3">
        <Notification compact type="success" title="Student disabled" :action="{ label: 'Undo' }" />
        <Notification compact type="success" title="Changes saved" />
        <Notification compact type="info" title="Link copied" :dismissible="false" />
        <Notification compact type="error" title="Couldn't save" :action="{ label: 'Retry' }" />
      </div>`,
  }),
};

/** The row appearance, as in the pane: the time, and a dot when unread. */
export const Rows: Story = {
  decorators: [narrow],
  render: () => ({
    components: { Notification },
    setup: () => ({ items: createNotifications(sampleNotifications()).items }),
    template: `
      <ul class="rounded border border-black/15 bg-white">
        <li v-for="item in items" :key="item.id" class="border-b border-black/15 last:border-b-0">
          <Notification appearance="row" v-bind="item" :created-at="item.createdAt" :unread="!item.read" />
        </li>
      </ul>`,
  }),
};

/**
 * The bell in the Header. Open it to see past notifications: × removes one,
 * Clear all removes them all, and closing it marks them read.
 */
export const Pane: Story = {
  parameters: { layout: "fullscreen" },
  decorators: [() => ({ template: '<div class="min-h-dvh bg-background"><story /></div>' })],
  render: () => ({
    components: { Header, NotificationPane },
    setup: () => ({ notifications: createNotifications(sampleNotifications()) }),
    template: `
      <Header title="Keston School Admin" :user="{ name: 'Ben Smith', email: 'ben.smith@keston.school' }">
        <template #trailing><NotificationPane :notifications="notifications" /></template>
      </Header>`,
  }),
};

/** Nothing to show. */
export const PaneEmpty: Story = {
  ...Pane,
  render: () => ({
    components: { Header, NotificationPane },
    setup: () => ({ notifications: createNotifications(), open: ref(true) }),
    template: `
      <Header title="Keston School Admin">
        <template #trailing><NotificationPane v-model:open="open" :notifications="notifications" /></template>
      </Header>`,
  }),
};

/**
 * Try notifications: each button calls notify(). They slide up from the
 * bottom right, pushing the others up, and go into the pane. Past 320px tall
 * the older ones collapse into a stack; hover the toasts (or press F8) to
 * spread them out. If there are more than fit on the screen, "+N more" at
 * the end opens the pane (try Error, then Five at once, twice).
 * Info and success close after 6 seconds; ones with an action, and errors,
 * stay until closed. Hover to pause. Swipe right to close. F8 jumps to them.
 */
export const Playground: Story = {
  parameters: { layout: "fullscreen" },
  decorators: [() => ({ template: '<div class="min-h-dvh bg-background"><story /></div>' })],
  render: () => ({
    components: { Button, Header, NotificationPane, Toaster },
    setup() {
      const notifications = createNotifications(sampleNotifications());
      const samples: Record<string, NotificationInput> = {
        info: { type: "info", title: "New application", description: "Noah Patel applied for Year 9." },
        success: { type: "success", title: "Changes saved", description: "Term dates for 2027–28 are updated." },
        warning: passwordExpiry,
        error: {
          type: "error",
          title: "Couldn't send the newsletter",
          description: () => ["The mail server didn't respond. ", h("b", "Nothing was sent"), "."],
          action: { label: "Try again" },
        },
      };
      let n = 0;
      const burst = () =>
        ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11"].forEach((year, i) =>
          setTimeout(() => notifications.notify({ type: "success", title: `${year} reports sent`, description: `${28 + i} reports emailed to parents.` }), i * 150),
        );
      const quiet = () => notifications.notify({ title: `Background sync ${++n} finished` }, { toast: false });
      const disable = () => {
        const id = notifications.notify({
          type: "success",
          title: "Student disabled",
          compact: true,
          action: {
            label: "Undo",
            onSelect: () => {
              notifications.dismiss(id);
              notifications.notify({ type: "info", title: "Student enabled again", compact: true });
            },
          },
        });
      };
      return { notifications, samples, burst, quiet, disable };
    },
    template: `
      <Header title="Keston School Admin" :user="{ name: 'Ben Smith', email: 'ben.smith@keston.school' }">
        <template #trailing><NotificationPane :notifications="notifications" /></template>
      </Header>
      <div class="flex flex-col gap-4 p-6">
        <p class="max-w-prose text-sm text-black/65">Each button sends a notification. It pops up as a toast and is added to the bell.</p>
        <div class="flex flex-wrap gap-2">
          <Button @click="notifications.notify(samples.info)">Info</Button>
          <Button @click="notifications.notify(samples.success)">Success</Button>
          <Button @click="notifications.notify(samples.warning)">Warning (Password Expiry)</Button>
          <Button @click="notifications.notify(samples.error)">Error</Button>
          <Button @click="burst">Five at once</Button>
          <Button @click="disable">Compact with Undo</Button>
          <Button @click="quiet">Pane only (no toast)</Button>
        </div>
      </div>
      <Toaster :notifications="notifications" />`,
  }),
};

/** Toasts can also sit top right, under the Header. */
export const ToasterTopRight: Story = {
  ...Playground,
  render: (args, context) => {
    const story = (Playground.render as (a: typeof args, c: typeof context) => { template: string })(args, context);
    return { ...story, template: story.template.replace("<Toaster ", '<Toaster position="top-right" ') };
  },
};
