<script setup lang="ts">
import { ref, toRef, computed } from 'vue'
import { useTable, useFilter, useSort, usePaginate } from 'alga-vue'
import PaginationBox from './PaginationBox.vue'

const props = defineProps<{ 
  columns: Array<any>,
  filter?: boolean,
  entries: Array<any>,
  footers?: Array<any[]>,
  server?: boolean
}>()

const emit = defineEmits<{
  (e: 'checklist', rows: any[]): void,
  (e: 'filter', columns: any): void,
  (e: 'sort', value: any): void
}>()

const getLimitPerPage = ref<number>(10)
const getCurrentPage = ref<number>(1)
const getEllipsis = ref<number>(2)
const getSearch = ref<string>('')
const getFilter = ref<any>({})
const getSort = ref<any>({
  col: props.columns?.[0]?.prop || '',
  by: 'asc'
})

const { getColumnProperties, getColumnData } = useTable(toRef(props, 'columns'), toRef(props, 'entries'))
const { filteredEntries } = useFilter(toRef(props, 'entries'), getSearch, getFilter)
const { sortedEntries } = useSort(filteredEntries, getSort)
const { getOffset, getPages, paginatedEntries, getPagination, getPageInfo } = usePaginate(sortedEntries, getLimitPerPage, getCurrentPage, getEllipsis)

const renderEntries = computed(() => {
  let newEntries = paginatedEntries.value || []
  if(props?.server) {
    newEntries = props?.entries || []
  }
  return newEntries
})

const checkedAll = ref<any>(null)
const checkedRefs = ref<any[]>([])
const setCheckedRef = (el: any) => {
  if (el) {
    checkedRefs.value.push(el)
  }
}
const checks = ref<any[]>([])
const checkedRows = (rows: any[]) => {
  checks.value = rows
  emit('checklist', checks.value)
}
const flatByProp = (prop: string) => {
  //@ts-ignore
  return props.entries.map((mi: any) => mi[prop])
}
const removeChecked = (item: string | number | any) => {
  //@ts-ignore
  const getIndex = checks.value.findIndex((fi: string | number | any) => fi === item)
  checks.value.splice(getIndex, 1)
}

const filterColumns = (columns: any) => {
  getFilter.value = columns
  emit('filter', getFilter.value)
}
const sortColumns = (value: any) => {
  getSort.value = value
  emit('sort', getSort.value)
}
</script>

<template>
  <div class="dataTable">
    <div class="dataTableHeader">
      <div></div>
      <div>
        <input type="text" v-model="getSearch" class="input" placeholder="Search here...">
      </div>
    </div>
    <div class="dataTableBody">
      <table class="table tableBorder">
        <thead>
          <tr>
            <th v-for="(col, ind) in columns" :key="'col-'+ind">
              <div class="check" v-if="col.type === 'checkbox'">
                <input type="checkbox" ref="checkedAll" class="checkInput" @click="checks = (checkedAll.checked === true) ? flatByProp(col.prop) : []">
              </div>
              <template v-else>
                <div class="dataTableSort">
                  <span>{{ col.text }}</span>
                  <span v-if="getSort.col === col.prop && getSort.by === 'asc'" @click="getSort.col = col.prop; getSort.by = 'desc'; emit('sort', getSort);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down tableEvent" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                      <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                    </svg>
                  </span>
                  <span v-else-if="getSort.col === col.prop && getSort.by === 'desc'" @click="getSort.col = col.prop; getSort.by = 'asc'; emit('sort', getSort);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-up-alt tableEvent" viewBox="0 0 16 16">
                      <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>
                      <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"/>
                      <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                    </svg>
                  </span>
                  <span v-else @click="getSort.col = col.prop; getSort.by = 'asc'; emit('sort', getSort);">
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
          <template v-if="filter">
            <tr>
              <th v-for="(col, ind) in columns" :key="'filter-'+ind">
                <div v-if="col.filter === true && 'prop' in col">
                  <template v-if="col.filterType === 'select'">
                    <select class="select" v-model="getFilter[col.prop]" @change="emit('filter', getFilter)">
                      <option value="" selected></option>
                      <option v-for="(tkCol, tkInd) in getColumnData(col.prop)" :key="tkInd" :value="tkCol">{{ tkCol }}</option>
                    </select>
                  </template>
                  <template v-else>
                    <input type="text" v-model="getFilter[col.prop]" class="input" @input="emit('filter', getFilter)">
                  </template>
                </div>
              </th>
            </tr>
          </template>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in renderEntries" :key="'entry-'+index">
            <td v-for="(col, ind) in columns" :key="'col-'+ind">
              <template v-if="col.type === 'slot'">
                <slot :name="col.prop" :entry="entry"></slot>
              </template>
              <div class="check" v-else-if="col.type === 'checkbox'">
                <input type="checkbox" class="checkInput" :ref="setCheckedRef" :value="entry[col.prop]" :checked="checks.includes(entry[col.prop])" @click="(checkedRefs[ind].checked === true) ? checks.push(entry[col.prop]) : removeChecked(entry[col.prop]); emit('checklist', checks)">
              </div>
              <template v-else>{{ entry[col.prop] }}</template>
            </td>
          </tr>
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
          <select v-model="getLimitPerPage" class="select">
            <option :value="5">5</option>
            <option :value="7">7</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
        <div class="dataTableInfo">from {{ getPageInfo.start }} to {{ getPageInfo.end }} of {{getPageInfo.length }}</div>
      </div>
      <PaginationBox v-model="getCurrentPage" :pages="getPages" :items="getPagination" />
    </div>
  </div>
</template>

<style scoped>
@use dataTable;
@use form {
  field: input, check;
}
@use table;
@use pagination {
  type: dense;
}
</style>
