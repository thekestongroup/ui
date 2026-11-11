import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

// One timer for the whole page, however many relative times are showing.
const now = ref(new Date())
let users = 0
let timer: ReturnType<typeof setInterval> | undefined

/** The current time, updated every 30 seconds while any component uses it. */
export function useNow(): Readonly<Ref<Date>> {
  onMounted(() => {
    if (users++ === 0) {
      now.value = new Date()
      timer = setInterval(() => (now.value = new Date()), 30_000)
    }
  })
  onBeforeUnmount(() => {
    if (--users === 0) clearInterval(timer)
  })
  return now
}
