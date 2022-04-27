<script setup lang="ts">
import { ref, toRef } from 'vue'
import TableBox from './TableBox.vue'
import PaginateBox from './PaginateBox.vue'
import { useFilter, useSort, usePaginate } from 'alga-vue'

const props = defineProps<{ 
  columns: Array<any>,
  filter?: boolean,
  entries: Array<any>,
  footers?: Array<any[]>,
  theme?: any
}>()

const emit = defineEmits<{
  (e: 'checklist', rows: any[]): void,
  (e: 'filter', columns: any): void,
  (e: 'sort', value: any): void
}>()

const getLimitPerPage = ref<number>(7)
const getCurrentPage = ref<number>(1)
const getEllipsis = ref<number>(2)
const getSearch = ref<string>('')
const getFilter = ref<any>({})
const getSort = ref<any>({})

const { filteredEntries } = useFilter(toRef(props, 'entries'), getSearch, getFilter)
const { sortedEntries } = useSort(filteredEntries, getSort)
const { getOffset, getPages, paginatedEntries, getPagination, getPageInfo } = usePaginate(sortedEntries, getLimitPerPage, getCurrentPage, getEllipsis)

const checks = ref<any[]>([])
const checkedRows = (rows: any[]) => {
  checks.value = rows
  emit('checklist', checks.value)
}
const filterColumns = (columns: any) => {
  getFilter.value = columns
  emit('filter', getFilter.value)
}
const sortColumns = (value: any) => {
  getSort.value = value
  emit('sort', getSort.value)
}

const theme = ref<any>({
  wrapper: {
    tableWrap: 'tableWrap',
    tableTop: 'tableTop',
    tableTopLeft: 'tableTopLeft',
    tableTopRight: 'tableTopRight',
    tableBottom: 'tableBottom',
    tableBottomLeft: 'tableBottomLeft',
    tableBottomRight: 'tableBottomRight',
    tableInfo: 'tableInfo'
  },
  input: {
    tableSearch: 'tableSearch',
    tableSelect: 'tableSelect',
    tableSelectBox: 'tableSelectBox',
    tableCheckBox: 'tableCheckBox',
    tableInputBox: 'tableInputBox'
  },
  table: {
    table: 'table tableBorder',
    tableSort: 'tableSort'
  },
  paginate: {
    paginate: 'paginate',
    paginateBox: 'paginateBox',
    paginateItem: 'paginateItem',
    paginateLink: 'paginateLink',
    paginateEvent: 'paginateEvent'
  }
})
if('theme' in props && props.theme !== undefined && props.theme !== null) {
  if('wrapper' in props.theme && 'input' in props.theme && 'table' in props.theme && 'paginate' in props.theme) {
    theme.value = {...theme.value, ...props.theme}
  }
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
      <TableBox :columns="columns" :entries="paginatedEntries" @checklist="checkedRows" :filter="filter" @filter="filterColumns" @sort="sortColumns" :rows="entries" :theme="{...theme.input, ...theme.table}" />
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
      <div>
        <PaginateBox :items="getPagination" v-model="getCurrentPage" :total="getPages" :theme="theme.paginate" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@use dataTable;
@use form {
  field: input, select;
}
</style>
