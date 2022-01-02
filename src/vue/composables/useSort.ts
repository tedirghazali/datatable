import { computed, Ref } from 'vue'

export default function useFilter(getEntries: Ref<any[]>, getSort: Ref<any>) {
  
  const sortedEntries = computed<any[]>(() => {
    let newEntries: any[] = getEntries.value
    if('by' in getSort.value && getSort.value.by !== '') {
      newEntries.sort((a: any, b: any) => {
        if(getSort.value.col in a && getSort.value.col in b) {
          if(isNaN(a[getSort.value.col]) === false && isNaN(b[getSort.value.col]) === false) {
            return (getSort.value.by === 'asc') ? Number(a[getSort.value.col]) - Number(b[getSort.value.col]) : Number(b[getSort.value.col]) - Number(a[getSort.value.col])
          } else if(typeof a[getSort.value.col] === 'string' && typeof b[getSort.value.col] === 'string') {
            return (getSort.value.by === 'asc') ? a[getSort.value.col].localeCompare(b[getSort.value.col]) : b[getSort.value.col].localeCompare(a[getSort.value.col])
          }
        }
      })
    }
    return newEntries
  })
  
  return {
    sortedEntries
  }
}
