import { computed, Ref } from 'vue'

export default function useFilter(getEntries: Ref<any[]>, getSearch: Ref<string>, getFilter: Ref<any>) {
  
  const searchedEntries = computed<any[]>(() => {
    let newEntries: any[] = []
    if(getSearch.value.length > 1) {
      newEntries = getEntries.value.filter((obj: any) => {
        for(const key of Object.keys(obj)) {
          if(isNaN(obj[key]) === false && Number(obj[key]) === Number(getSearch.value)) {
            return true
          } else if(typeof obj[key] === 'string' && obj[key].toLowerCase().includes(getSearch.value.toLowerCase())) {
            return true
          }
        }
        return false
      })
    } else {
      newEntries = getEntries.value
    }
    return newEntries
  })
  
  const getCleanFilter = computed<any>(() => {
    const newObj: any = {}
    const newSet = new Set(['', 0, null, undefined])
    for(const key of Object.keys(getFilter.value)) {
      if(!newSet.has(getFilter.value[key])) {
        newObj[key] = getFilter.value[key]
      }
    } 
    return newObj
  })
  
  const filteredEntries = computed<any[]>(() => {
    let newEntries: any[] = searchedEntries.value
    //@ts-ignore
    for(const ftrKey of Object.keys(getCleanFilter.value)) {
      newEntries = newEntries.filter((obj: any) => {
        if(ftrKey in obj) {
          if(isNaN(obj[ftrKey]) === false && Number(obj[ftrKey]) === Number(getCleanFilter.value[ftrKey])) {
            return true
          } else if(typeof obj[ftrKey] === 'string' && obj[ftrKey].toLowerCase().includes(getCleanFilter.value[ftrKey].toLowerCase())) {
            return true
          }
        }
        return false
      })
    }
    return newEntries
  })
  
  return {
    searchedEntries,
    getCleanFilter,
    filteredEntries
  }
}
