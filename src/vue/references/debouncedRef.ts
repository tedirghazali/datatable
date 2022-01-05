import { customRef } from 'vue'

export default function debouncedRef(value: string, delay: number = 200) {
  let timeout: any = null
  return customRef<string>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: string) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
