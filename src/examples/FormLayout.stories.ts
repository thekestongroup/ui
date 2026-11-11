import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { getLocalTimeZone, today } from "@internationalized/date";
import { AtSign, IdCard } from "@lucide/vue";
import { computed, nextTick, reactive, ref } from "vue";
import Button, { type ButtonStatus } from "../components/Button/Button.vue";
import InputDate from "../components/InputDate/InputDate.vue";
import Input from "../components/Input/Input.vue";
import InputNumber from "../components/InputNumber/InputNumber.vue";

/**
 * A full form built from the library, to see how fields grow and shrink as
 * errors appear and clear. Not part of the library itself.
 *
 * - Each field is checked when you leave it, then again as you type once it
 *   shows an error (so the error clears as soon as it's fixed).
 * - "Create student" checks every field at once, shows all errors and moves
 *   focus to the first one. When everything is valid it loads, then succeeds.
 */
const meta = {
  title: "Examples/Form layout",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type FieldName = "firstName" | "lastName" | "email" | "dateOfBirth" | "yearGroup" | "studentId";

export const AddStudent: Story = {
  render: () => ({
    components: { Button, InputDate, Input, InputNumber, AtSign, IdCard },
    setup() {
      const form = reactive({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: undefined as string | undefined,
        yearGroup: undefined as number | undefined,
        studentId: "",
      });
      const errors = reactive<Partial<Record<FieldName, string>>>({});
      const status = ref<ButtonStatus>("idle");
      const formEl = ref<HTMLFormElement>();
      const todayIso = today(getLocalTimeZone()).toString();

      // Stand-ins for a schema (e.g. Zod): a message, or undefined when valid.
      const rules: Record<FieldName, () => string | undefined> = {
        firstName: () => (form.firstName.trim() ? undefined : "Enter a first name"),
        lastName: () => (form.lastName.trim() ? undefined : "Enter a last name"),
        email: () =>
          !form.email.trim()
            ? "Enter an email address"
            : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
              ? undefined
              : "Enter a valid email address, like name@school.org",
        dateOfBirth: () => (form.dateOfBirth ? undefined : "Enter a date of birth"),
        yearGroup: () =>
          form.yearGroup === undefined
            ? "Choose a year group"
            : form.yearGroup < 7 || form.yearGroup > 13
              ? "Year group must be from 7 to 13"
              : undefined,
        studentId: () =>
          !form.studentId || /^KS-\d{5}$/i.test(form.studentId)
            ? undefined
            : "Student IDs look like KS-20491",
      };

      const check = (field: FieldName) => {
        errors[field] = rules[field]();
      };
      // After an error shows, re-check while typing so it clears when fixed.
      const recheck = (field: FieldName) => {
        if (errors[field]) check(field);
      };

      const errorCount = computed(() => Object.values(errors).filter(Boolean).length);

      async function submit() {
        (Object.keys(rules) as FieldName[]).forEach(check);
        if (errorCount.value) {
          status.value = "error";
          await nextTick();
          formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
          return;
        }
        status.value = "loading";
        setTimeout(() => (status.value = "success"), 1000);
      }

      function reset() {
        Object.assign(form, { firstName: "", lastName: "", email: "", dateOfBirth: undefined, yearGroup: undefined, studentId: "" });
        (Object.keys(errors) as FieldName[]).forEach((key) => delete errors[key]);
        status.value = "idle";
      }

      return { form, errors, errorCount, status, formEl, todayIso, check, recheck, submit, reset };
    },
    template: `
      <form ref="formEl" novalidate class="flex max-w-md flex-col gap-5 text-black" @submit.prevent="submit">
        <div>
          <h2 class="text-lg">Add student</h2>
          <p class="text-sm text-black/65">Fields check themselves when you leave them. Try "Create student" with the form empty.</p>
        </div>

        <div class="grid grid-cols-2 items-start gap-3">
          <Input
            v-model="form.firstName"
            label="First name"
            autocomplete="given-name"
            :error-text="errors.firstName"
            @blur="check('firstName')"
            @input="recheck('firstName')"
          />
          <Input
            v-model="form.lastName"
            label="Last name"
            autocomplete="family-name"
            :error-text="errors.lastName"
            @blur="check('lastName')"
            @input="recheck('lastName')"
          />
        </div>

        <Input
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="name@school.org"
          autocomplete="email"
          :error-text="errors.email"
          @blur="check('email')"
          @input="recheck('email')"
        >
          <template #leading><AtSign /></template>
        </Input>

        <div class="grid grid-cols-2 items-start gap-3">
          <InputDate
            v-model="form.dateOfBirth"
            label="Date of birth"
            prefer="past"
            :max="todayIso"
            :error-text="errors.dateOfBirth"
            @update:model-value="recheck('dateOfBirth')"
          />
          <InputNumber
            v-model="form.yearGroup"
            label="Year group"
            :min="7"
            :max="13"
            :error-text="errors.yearGroup"
            @update:model-value="recheck('yearGroup')"
          />
        </div>

        <Input
          v-model="form.studentId"
          label="Student ID"
          helper="Optional. Found on the enrolment letter, e.g. KS-20491."
          helper-placement="icon"
          placeholder="KS-00000"
          :error-text="errors.studentId"
          @blur="check('studentId')"
          @input="recheck('studentId')"
        >
          <template #leading><IdCard /></template>
        </Input>

        <div class="flex justify-end gap-2 border-t border-black/15 pt-4">
          <Button @click="reset">Reset</Button>
          <Button
            v-model:status="status"
            type="submit"
            variant="primary"
            loading-text="Creating…"
            success-text="Student created"
            :error-text="errorCount === 1 ? '1 problem' : errorCount + ' problems'"
          >
            Create student
          </Button>
        </div>
      </form>`,
  }),
};
