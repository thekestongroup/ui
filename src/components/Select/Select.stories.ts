import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { AtSign, Bell, BellOff, BookOpen, Calculator, CalendarDays, FlaskConical, Globe, GraduationCap, Mail, Music, Palette, School, Users } from "@lucide/vue";
import { ref } from "vue";
import Select, { type SelectValueType } from "./Select.vue";

const yearGroups = ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"];

const meta = {
  title: "Components/Select",
  component: Select,
  // The docs page is Select.mdx (sizes, typography, behaviour), not autodocs.
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Year group",
    options: yearGroups,
    searchable: false,
    multiple: false,
    helper: "",
    helperPlacement: "below",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  render: (args) => ({
    components: { Select },
    setup() {
      const value = ref<SelectValueType | SelectValueType[]>();
      return { args, value };
    },
    template: `
      <Select v-bind="args" v-model="value" />
      <p class="mt-4 text-xs text-black/65">Value: {{ value === undefined ? "undefined" : JSON.stringify(value) }}</p>`,
  }),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. Options can be plain strings. */
export const Default: Story = {};

export const WithHelper: Story = {
  args: { helper: "The year group the student is joining in September." },
};

/** Options as objects, with icons and a disabled option. The chosen option's icon shows in the field. */
export const WithIcons: Story = {
  args: {
    label: "Subject",
    options: [
      { label: "English", value: "english", icon: BookOpen },
      { label: "Maths", value: "maths", icon: Calculator },
      { label: "Science", value: "science", icon: FlaskConical },
      { label: "Geography", value: "geography", icon: Globe },
      { label: "Art", value: "art", icon: Palette },
      { label: "Music", value: "music", icon: Music, disabled: true },
    ],
  },
};

/**
 * Every option needs a label; a description and an icon are optional.
 * Descriptions can vary per option, but give every option an icon or none,
 * so the labels line up. Only the label (and icon) show in the field once chosen.
 */
export const WithDescriptions: Story = {
  args: {
    label: "Notifications",
    options: [
      { label: "Everything", value: "all", description: "Messages, mentions and every update to your classes.", icon: Bell },
      { label: "Mentions only", value: "mentions", description: "When someone mentions you or replies to you.", icon: AtSign },
      { label: "Daily summary", value: "daily", description: "One email each morning.", icon: Mail },
      { label: "Weekly summary", value: "weekly", icon: CalendarDays },
      { label: "Off", value: "off", icon: BellOff },
    ],
  },
};

/** Label and description, no icons. */
export const WithDescriptionsNoIcons: Story = {
  args: {
    label: "Term",
    options: [
      { label: "Autumn", value: "autumn", description: "September to December" },
      { label: "Spring", value: "spring", description: "January to April" },
      { label: "Summer", value: "summer", description: "April to July" },
      { label: "Whole year", value: "year" },
    ],
  },
};

/** Options grouped under headings. */
export const Groups: Story = {
  args: {
    label: "Year group",
    options: [],
    groups: [
      { label: "Key Stage 3", options: ["Year 7", "Year 8", "Year 9"] },
      { label: "Key Stage 4", options: ["Year 10", "Year 11"] },
      { label: "Sixth form", options: ["Year 12", "Year 13"] },
    ],
  },
};

/** A long list scrolls inside the panel, which never runs off the screen. */
export const LongList: Story = {
  args: {
    label: "Country",
    options: [
      "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt",
      "Finland", "France", "Germany", "Greece", "India", "Ireland", "Italy", "Japan",
      "Kenya", "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway", "Poland",
      "Portugal", "Singapore", "South Africa", "Spain", "Sweden", "Switzerland",
      "United Kingdom", "United States",
    ],
  },
};

/** Type to filter: matches anywhere in the label, ignoring case and accents. */
export const Searchable: Story = {
  args: { ...LongList.args, searchable: true },
};

/** Group headings can have an icon too. */
export const GroupsWithIcons: Story = {
  args: {
    label: "Subject",
    options: [],
    groups: [
      { label: "Core", icon: BookOpen, options: ["English", "Maths", "Science"] },
      { label: "Humanities", icon: Globe, options: ["Geography", "History", "Religious studies"] },
      { label: "Creative", icon: Palette, options: ["Art", "Drama", "Music"] },
    ],
  },
};

/** Searching grouped options: groups with no matches are hidden. */
export const SearchableGroups: Story = {
  args: { ...Groups.args, searchable: true },
};

// Classes › year › class › student, plus a top-level option and a second branch.
const student = (name: string) => ({ label: name, value: name.toLowerCase().replace(/ /g, "-") });
const classTree = [
  { label: "Whole school", value: "school", icon: School, description: "Every student" },
  {
    label: "Classes",
    icon: Users,
    description: "Choose a year, then a class",
    children: [
      {
        label: "Year 7",
        children: [
          { label: "7X/En1", children: ["Ava Patel", "Leo Wright", "Mia Chen"].map(student) },
          { label: "7Y/En2", children: ["Noah Evans", "Isla Ahmed"].map(student) },
        ],
      },
      {
        label: "Year 8",
        children: [
          { label: "11Y/En2", children: ["Ben Blissett", "Zara Khan", "Oscar Hughes"].map(student) },
          // Ben is in two classes: the same value, so ticking him in one ticks him in both.
          { label: "8X/Ma1", children: ["Ben Blissett", "Freya Lewis", "Ethan Price"].map(student) },
        ],
      },
    ],
  },
  {
    label: "Tutor groups",
    icon: GraduationCap,
    children: [
      { label: "Tutor 7A", children: ["Ava Patel", "Noah Evans"].map(student) },
    ],
  },
];

/**
 * Options with `children` open a level instead of being chosen, with a back
 * row (‹ Year 8) at the top. → opens, ← goes back. The field shows only the
 * chosen option; reopening starts at its level.
 */
export const Nested: Story = {
  args: { label: "Recipient", options: classTree },
};

/** Searching a nested list looks through every level and shows each match's path. */
export const NestedSearchable: Story = {
  args: { label: "Recipient", options: classTree, searchable: true },
};

/**
 * Choose several: the list stays open while ticking, and the chosen options
 * show as chips, wrapping onto more lines. Untick an option to remove it.
 */
export const Multiple: Story = {
  args: { ...WithIcons.args, label: "Subjects", multiple: true },
};

/**
 * Searchable and multiple: type to filter, Enter ticks and clears the search.
 * × on a chip removes it; Backspace in the empty box removes the last one.
 */
export const MultipleSearchable: Story = {
  args: { ...LongList.args, label: "Countries", multiple: true, searchable: true },
};

/**
 * Several people from anywhere in a nested list. The same person can be in
 * several places (Ben is in 11Y/En2 and 8X/Ma1, Ava and Noah in a class and a
 * tutor group): they share a value, so they're chosen once, ticked everywhere
 * they appear, and shown as one chip.
 */
export const MultipleNested: Story = {
  args: { label: "Recipients", options: classTree, multiple: true, searchable: true },
};

export const Error: Story = {
  args: { errorText: "Choose a year group" },
};

export const Disabled: Story = { args: { disabled: true } };
