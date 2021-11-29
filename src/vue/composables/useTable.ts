import { ref, computed, Ref } from 'vue'

export default function useTable(getColumns: Ref<any[]>, getRows: Ref<any[]>) {

  const getColumnProperties = computed(() => {
    return getColumns.value.map((item: any) => {
      if(typeof item === 'object' && 'prop' in item || 'property' in item) {
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
    getColumnProperties,
    getColumnData
  }
}
