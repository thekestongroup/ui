import { createToastManager } from 'reka-ui'

const manager = createToastManager()

export const toast = {
  add: manager.add,
  update: manager.update,
  close: manager.close,
  promise: manager.promise,
}

export const toastManager = manager

export type {
  ToastObject,
  ToastAddOptions,
  ToastUpdateOptions,
  ToastPromiseOptions,
} from 'reka-ui'
