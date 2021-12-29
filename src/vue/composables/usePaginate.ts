import { computed, Ref } from 'vue'

export default function usePaginate(getEntries: Ref<any[]>, getLimitPerPage: Ref<number>, getCurrentPage: Ref<number>, getEllipsis: Ref<number>) {
  
  const getOffset = computed<number>(() => {
    return (getLimitPerPage.value * getCurrentPage.value) - (getLimitPerPage.value - 1)
  })
  
  const getPages = computed<number>(() => {
    return Math.ceil(getEntries.value.length / getLimitPerPage.value)
  })
  
  const paginatedEntries = computed<any[]>(() => {
    return getEntries.value.slice(getOffset.value - 1, getLimitPerPage.value * getCurrentPage.value)
  })
  
  const getPageInfo = computed<any>(() => {
    return {
      start: getOffset.value,
      end: getLimitPerPage.value * getCurrentPage.value,
      length: getEntries.value.length
    }
  })
  
  const getPagination = computed<any[]>(() => {
    let pagiArray = []
    const maxPages = (getPages.value < getCurrentPage.value) ? getPages.value : getCurrentPage.value
    const minPages = (getCurrentPage.value < 1) ? 1 : getCurrentPage.value
    const pageAddition = maxPages + getEllipsis.value
    const pageSubtraction = minPages - getEllipsis.value
    if(getEllipsis.value === 0) {
      for(let i = 1; i <= getPages.value; i++) {
        pagiArray.push(i)
      }
    } else {
      if(minPages > 1) {
        for(let i = pageSubtraction; i < minPages; i++) {
          pagiArray.push(i)
        }
      }
    
      for(let i = maxPages; i <= pageAddition; i++) {
        pagiArray.push(i)
      }
    }
    const filterNegative = pagiArray.filter((num: number) => num > 0)
    const filterMax = filterNegative.filter((num: number) => num <= getPages.value)
    if(pageAddition < getPages.value && getEllipsis.value !== 0) {
      filterMax.push('...')
    }
    if(pageSubtraction > 1 && getEllipsis.value !== 0) {
      filterMax.unshift('...')
    }
    return filterMax
  })
  
  return {
    getOffset,
    getPages,
    paginatedEntries,
    getPageInfo,
    getPagination
  }
}
