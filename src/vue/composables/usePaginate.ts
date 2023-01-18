import { computed, Ref } from 'vue'

export default function usePaginate(getEntries: Ref<any[]>, getLimitPerPage: Ref<number>, getCurrentPage: Ref<number>, getEllipsis: Ref<number>) {
  
  const getOffset = computed<number>(() => {
    return (getLimitPerPage.value * getCurrentPage.value) - (getLimitPerPage.value - 1)
  })
  
  const getPages = computed<number>(() => {
    let newPages: number = Math.ceil(getEntries.value.length / getLimitPerPage.value)
    if(newPages < 1) {
      newPages = 1
    }
    return newPages
  })
  
  const paginatedEntries = computed<any[]>(() => {
    return getEntries.value.slice(getOffset.value - 1, getLimitPerPage.value * getCurrentPage.value)
  })
  
  const getPageInfo = computed<any>(() => {
    const getEnd = getLimitPerPage.value * getCurrentPage.value
    return {
      start: getOffset.value,
      end: (getEnd < getEntries.value.length) ? getEnd : getEntries.value.length,
      length: getEntries.value.length
    }
  })
  
  const getPagination = computed<any[]>(() => {
    let pagiArray: any[] = []
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
    const filterNegative = pagiArray.filter((num: any) => Number(num) > 0)
    const filterMax = filterNegative.filter((num: any) => Number(num) <= getPages.value)
    if(pageAddition < getPages.value && getEllipsis.value !== 0) {
      filterMax.push('...')
    }
    if(pageSubtraction > 1 && getEllipsis.value !== 0) {
      filterMax.unshift('...')
    }
    return filterMax
  })
   
  const handleEllipsis = (page: number, ellipsis: number) => {
    let newEllipsis: number = ellipsis
    let divideNum: number = Math.floor(Number(ellipsis) / 2)
    let currentEllipsis: number = ellipsis
    if(Number(ellipsis) % 2 === 0) { //check if even/odd number
      currentEllipsis = Number(ellipsis) + 1
    }
    if(Number(page) <= divideNum) {
      newEllipsis = currentEllipsis - (Number(page) - 1)
    } else {
      newEllipsis = divideNum
    }
    return newEllipsis
  }
  
  return {
    getOffset,
    getPages,
    paginatedEntries,
    getPageInfo,
    getPagination,
    handleEllipsis
  }
}
