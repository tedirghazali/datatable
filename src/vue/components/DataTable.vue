<script setup lang="ts">
import { ref, toRef, computed, watch } from 'vue'
import useTable from '../composables/useTable'
import useFilter from '../composables/useFilter'
import useSort from '../composables/useSort'
import usePaginate from '../composables/usePaginate'
import PaginationBox from './PaginationBox.vue'

const props = defineProps<{ 
  columns: Array<any>,
  filterBy?: string,
  filterDelay?: number,
  sortBy?: Array<string>,
  entries: Array<any>,
  footers?: Array<any[]>,
  placeholder?: string,
  translate?: any,
  checks?: Array<any>,
  checkprop?: string
}>()

const emit = defineEmits<{
  (e: 'checklist', rows: any[]): void,
  (e: 'filter', columns: any): void,
  (e: 'sort', value: any): void
}>()

const limitPerPage = ref<number>(10)
const currentPage = ref<number>(1)
const ellipsis = ref<number>(2)
const search = ref<string>('')
const filter = ref<any>({})
const sort = ref<any>({
  col: props?.sortBy?.[0] || props.columns?.[0]?.prop || '',
  by: props?.sortBy?.[1] || 'desc'
})

const { getColumnProperties, getColumnData } = useTable(toRef(props, 'columns'), toRef(props, 'entries'))
const { filteredEntries } = useFilter(toRef(props, 'entries'), search, filter)
const { sortedEntries } = useSort(filteredEntries, sort)
const { getOffset, getPages, paginatedEntries, getPagination, getPageInfo } = usePaginate(sortedEntries, limitPerPage, currentPage, ellipsis)

const checkedAll = ref<any>(null)
const checkedAllBoolean = ref<boolean>(false)
const checkedRefs = ref<any[]>([])
const setCheckedRef = (el: any) => {
  if (el) {
    checkedRefs.value.push(el)
  }
}
const checks = ref<any[]>(props?.checks || [])
watch(() => props?.checks, () => {
  checks.value = props?.checks || []
  if(props?.checkprop) {
    let limitChecks = Number(props.entries.length) < Number(limitPerPage.value) ? Number(props.entries.length) : Number(limitPerPage.value)
    //@ts-ignore
    if(Number(paginatedEntries.value.filter((i: any) => checks.value.includes(i[props.checkprop])).length) === Number(limitChecks)) {
      if(checkedAll.value) {
        checkedAll.value.checked = true
      }
      checkedAllBoolean.value = true
    } else {
      if(checkedAll.value) {
        checkedAll.value.checked = false
      }
      checkedAllBoolean.value = false
    }
  }
})

const checkedRows = (e: any, colProp: string) => {
  if(e.target.checked === true) {
    //@ts-ignore
    checks.value = paginatedEntries.value.map((mi: any) => mi[colProp])
    checkedAllBoolean.value = true
  } else { 
    checks.value = [] 
    checkedAllBoolean.value = false
  }
  emit('checklist', checks.value)
}
const removeChecked = (item: string | number | any) => {
  //@ts-ignore
  const getIndex = checks.value.findIndex((fi: string | number | any) => fi === item)
  checks.value.splice(getIndex, 1)
}

const singleCheck = (e: any, entryProp: string | number, colProp: string) => {
  if(e.target.checked === true && !checks.value.includes(entryProp)) { 
    checks.value.push(entryProp) 
  } else { 
    removeChecked(entryProp)
  }
  let limitChecks = Number(props.entries.length) < Number(limitPerPage.value) ? Number(props.entries.length) : Number(limitPerPage.value)
  if(Number(paginatedEntries.value.filter((i: any) => checks.value.includes(i[colProp])).length) === Number(limitChecks)) {
    if(checkedAll.value) {
      checkedAll.value.checked = true
    }
    checkedAllBoolean.value = true
  } else {
    if(checkedAll.value) {
      checkedAll.value.checked = false
    }
    checkedAllBoolean.value = false
  }
  emit('checklist', checks.value)
}

const filterColumns = (columns: any) => {
  filter.value = columns
  emit('filter', filter.value)
}
const sortColumns = (value: any) => {
  sort.value = value
  emit('sort', sort.value)
}

const searchBy = ref<string>('')
const searchRef = ref<any>(null)
const searchTimer = ref<any>(undefined)
const searchHandler = () => {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    search.value = ''
    filter.value = {}
    if(searchRef.value?.value) {
      if(searchBy.value !== '') {
        filter.value[searchBy.value] = searchRef.value.value
      } else {
        search.value = searchRef.value.value
      }
      resetPage()
    }
  }, (props?.filterDelay || 500))
}

const resetPage = () => {
  if(currentPage.value >= getPages.value) {
    currentPage.value = getPages.value
  }
}

const filterByInput = ref<any>({})
const filterTimer = ref<any>(undefined)
const filterHandler = (propVal: string) => {
  clearTimeout(filterTimer.value)
  filterTimer.value = setTimeout(() => {
    filter.value[propVal] = ''
    if(filterByInput.value?.[propVal] && filterByInput.value?.[propVal] !== '') {
      filter.value[propVal] = filterByInput.value[propVal]
    }
    emit('filter', filter.value) 
    resetPage()
  }, (props?.filterDelay || 1000))
}
</script>

<template>
  <div class="card cardBody dataTable">
    <slot name="header"></slot>
    <div class="dataTableHeader">
      <div class="group">
        <span class="button groupItem">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="pointerEvents-none bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </span>
        <input type="search" ref="searchRef" @input="searchHandler" @keyup.enter="searchHandler" class="input groupItem">
        <select v-if="filterBy === 'search'" v-model="searchBy" @change="searchHandler" class="select groupItem dataTableSearchBy">
          <option value="">{{ translate?.all || 'All' }}</option>
          <template v-for="(col, ind) in columns" :key="ind">
            <option v-if="col?.filter" :value="col.prop">{{ col.text }}</option>
          </template>
        </select>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="tableResponsive">
      <table class="table tableList dataTableBody">
        <thead>
          <tr>
            <th v-for="(col, ind) in columns" :key="'col-'+ind" :style="{'text-align': col?.align, width: col?.width}">
              <div class="check" v-if="col.type === 'checkbox'">
                <input type="checkbox" ref="checkedAll" class="checkInput" @change="checkedRows($event, col.prop)" :checked="checkedAllBoolean">
              </div>
              <template v-else-if="col.sort === false">
                <span>{{ col.text }}</span>
              </template>
              <template v-else>
                <div class="dataTableSort">
                  <span>{{ col.text }}</span>
                  <span v-if="sort.col === col.prop && sort.by === 'asc'" @click="sort.col = col.prop; sort.by = 'desc'; emit('sort', sort);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down tableEvent" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                      <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                    </svg>
                  </span>
                  <span v-else-if="sort.col === col.prop && sort.by === 'desc'" @click="sort.col = col.prop; sort.by = 'asc'; emit('sort', sort);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-up-alt tableEvent" viewBox="0 0 16 16">
                      <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>
                      <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"/>
                      <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                    </svg>
                  </span>
                  <span v-else @click="sort.col = col.prop; sort.by = 'asc'; emit('sort', sort);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-numeric-up tableEvent" viewBox="0 0 16 16">
                      <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"></path>
                      <g transform="translate(7 0)">
                        <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </template>
            </th>
          </tr>
          <template v-if="filterBy === 'column' || filterBy === 'filter'">
            <tr>
              <th v-for="(col, ind) in columns" :key="'filter-'+ind">
                <div v-if="col.filter === true && 'prop' in col">
                  <template v-if="col.filterType === 'select'">
                    <select class="select" v-model="filter[col.prop]" @change="emit('filter', filter); resetPage();">
                      <option value="" selected></option>
                      <option v-for="(tkCol, tkInd) in getColumnData(col.prop)" :key="tkInd" :value="tkCol">{{ tkCol }}</option>
                    </select>
                  </template>
                  <template v-else>
                    <input type="text" v-model="filterByInput[col.prop]" class="input" @input="filterHandler(col.prop)">
                  </template>
                </div>
              </th>
            </tr>
          </template>
        </thead>
        <tbody :style="{height: (paginatedEntries.length <= 4 ? 240 : (Number(paginatedEntries.length) * 60)) + 'px'}">
          <tr v-if="Number(paginatedEntries.length) === 0">
            <td :colspan="columns.length" class="dataTableEmpty">{{ placeholder || 'The data on this page is not yet available.' }}</td>
          </tr>
          <tr v-for="(entry, index) in paginatedEntries" :key="'entry-'+index">
            <td v-for="(col, ind) in columns" :key="'col-'+ind" :style="{'text-align': col?.align, width: col?.width, ...(col?.style ?? {})}">
              <template v-if="col.type === 'slot'">
                <slot :name="col.prop" :entry="entry" :index="index"></slot>
              </template>
              <div class="check" v-else-if="col.type === 'checkbox'">
                <input type="checkbox" class="checkInput" :ref="setCheckedRef" :value="entry[col.prop]" :checked="checks.includes(entry[col.prop])" @change="singleCheck($event, entry[col.prop], col.prop)">
              </div>
              <template v-else>{{ entry[col.prop] }}</template>
            </td>
          </tr>
          <template v-if="Number(entries.length) >= 1 && Number(entries.length) <= 3">
            <tr v-for="num in (4 - Number(entries.length))" style="height: 60px;">
              <td v-if="num === 1" :rowspan="4 - Number(entries.length)" :colspan="columns.length"></td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if="footers && Array.isArray(footers[0])">
          <tr v-for="(footer, index) in footers" :key="'row-'+index">
            <th v-for="(foot, ind) in footer" :key="'foot-'+ind">
              <template v-if="foot.type === 'slot'">
                <slot :value="foot.value" :options="foot.options"></slot>
              </template>
              <template v-else>{{ foot.text }}</template>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="dataTableFooter">
      <div class="dataTableLimit">
        <div class="dataTableSelect">
          <select v-model="limitPerPage" class="select" @change="resetPage();">
            <option :value="5">5</option>
            <option :value="7">7</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
        <div class="dataTableInfo">{{ translate?.from || 'from' }} {{ getPageInfo.start }} {{ translate?.to || 'to' }} {{ getPageInfo.end }} {{ translate?.of || 'of' }} {{getPageInfo.length }}</div>
      </div>
      <PaginationBox v-model="currentPage" :pages="getPages" :items="getPagination" />
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped>
@use card;
@use form;
@use table;
@use dataTable;
</style>
