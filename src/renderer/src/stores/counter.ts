import pinia from '@renderer/stores'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const increment = () => count.value++
  const decrement = () => count.value--

  return {
    count,

    increment,
    decrement
  }
})

export const useCounterStoreWithOut = () => useCounterStore(pinia)
