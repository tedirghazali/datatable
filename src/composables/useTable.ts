import { ref, computed, Ref } from 'vue'

export default function useTable(getHeaders: Ref<Array<any[]> | any[]>, getRows: Ref<any[]>) {

  const getColumnHeader = computed(() => {
    return getHeaders.value.map((item: any | any[]) => {
      if(Array.isArray(item)) {
        for(const i of item) {
          if(typeof i === 'object' && 'prop' in i || 'property' in i) {
            return i.prop || i.property
          } else if(typeof i === 'string') {
            return i.toLowerCase()
          }
        }
      } else if(typeof item === 'string') {
        return item.toLowerCase()
      } else if(typeof item === 'object' && 'prop' in item || 'property' in item) {
        return item.prop || item.property
      }
    })
  })

  const getColumnData = (prop: string) => {
    const takeColumn = getRows.value.map((item: any) => {
      return item[prop]
    })
    return Array.from(new Set(takeColumn))
  }
  
  return {
    getColumnHeader,
    getColumnData
  }
}
