<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
//@ts-ignore
import { pages } from 'alga-js/array'
import PaginationBox from './PaginationBox.vue'

const props = defineProps<{ 
  modelValue: any,
  columns: Array<any>,
  entries: Array<any>,
  select?: any,
  filterBy?: string,
  filterDelay?: number,
  footers?: Array<any[]>,
  placeholder?: string,
  translate?: any,
  checks?: Array<any>,
  checkprop?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void,
  (e: 'checklist', rows: any[]): void,
  (e: 'handler', value: any): void
}>()

const getColumns = ref(props?.columns ||[])
watch(() => props?.columns, () => {
  getColumns.value = props.columns
})

const limitPerPage = ref<number>(props.modelValue?.limit || 10)
const currentPage = ref<number>(props.modelValue?.page || 1)
const ellipsis = ref<number>(props.modelValue?.ellipsis || 2)
const search = ref<string>(props.modelValue?.search || '')
const searchBy = ref<string>(props.modelValue?.searchBy || '')
const searchRef = ref<any>(null)
const filter = ref<any>(props.modelValue?.filter || {})
const sort = ref<any>({
  col: props.modelValue?.sort || props.columns?.[0]?.prop || '',
  by: props.modelValue?.sortBy || ''
})

watch(() => props.modelValue, () => {
  sort.value = {
    col: props.modelValue?.sort || props.columns?.[0]?.prop || '',
    by: props.modelValue?.sortBy || ''
  }
  search.value = props.modelValue?.search || ''
  searchBy.value = props.modelValue?.searchBy || ''
  if(searchRef.value !== null) {
    searchRef.value.value = search.value
  }
})

onMounted(() => {
  if(searchRef.value !== null) {
    searchRef.value.value = props.modelValue?.search || ''
  }
})

const getOffset = computed(() => {
  return (Number(limitPerPage.value) * Number(currentPage.value)) - Number(limitPerPage.value)
})

const getPages = computed(() => {
  return pages(props.modelValue?.total, limitPerPage.value)
})

const searchTimer = ref<any>(undefined)
const searchHandler = () => {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    search.value = ''
    filter.value = {}
    if(searchRef.value) {
      if(searchBy.value !== '') {
        filter.value[searchBy.value] = searchRef.value?.value || ''
      } else {
        search.value = searchRef.value?.value || ''
      }
      resetPage()
      refresh()
    }
  }, (props?.filterDelay || 1000))
}

const refresh = () => {
  const newInfo = {
    limit: limitPerPage.value,
    page: currentPage.value,
    offset: getOffset.value,
    search: search.value,
    searchBy: searchBy.value,
    filter: filter.value,
    sort: sort.value.col,
    sortBy: sort.value.by,
    total: props.modelValue?.total,
    length: props.modelValue?.length,
    from: props.modelValue?.from,
    to: props.modelValue?.to
  }
  emit('update:modelValue', newInfo)
  emit('handler', newInfo)
}

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
  if(props.entries && props?.checkprop) {
    let limitChecks = Number(props.entries.length) < Number(limitPerPage.value) ? Number(props.entries.length) : Number(limitPerPage.value)
    //@ts-ignore
    if(Number(props.entries.filter((i: any) => checks.value.includes(i[props.checkprop])).length) === Number(limitChecks)) {
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

const checkRows = (e: any, colProp: string) => {
  if(e.target.checked === true) {
    checks.value = props.entries.map((mi: any) => mi[colProp])
    checkedAllBoolean.value = true
  } else {
    checks.value = []
    checkedAllBoolean.value = false
  }
  refresh()
  emit('checklist', checks.value)
}

const checkSingleRow = (colProp: string) => {
  let limitChecks = Number(props.entries.length) < Number(limitPerPage.value) ? Number(props.entries.length) : Number(limitPerPage.value)
  if(Number(props.entries.filter((i: any) => checks.value.includes(i[colProp])).length) === Number(limitChecks)) {
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

const removeChecked = (item: string | number | any) => {
  //@ts-ignore
  const getIndex = checks.value.findIndex((fi: string | number | any) => fi === item)
  checks.value.splice(getIndex, 1)
}

const resetPage = () => {
  currentPage.value = 1
}

const filterTimer = ref<any>(undefined)
const filterHandler = (propVal: string) => {
  clearTimeout(filterTimer.value)
  filterTimer.value = setTimeout(() => {
    resetPage()
    refresh()
  }, (props?.filterDelay || 1000))
}
</script>

<template>
  <div class="card cardBody dataTable">
    <slot name="header"></slot>
    <div class="dataTableHeader">
      <div class="group">
        <span class="button groupItem">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="dataTableEvent bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </span>
        <input type="search" ref="searchRef" @input="searchHandler" @keyup.enter="searchHandler" class="input groupItem">
        <select v-if="filterBy === 'search'" v-model="searchBy" @change="searchHandler" class="select groupItem dataTableSearchBy">
          <option value="">{{ translate?.all || 'All' }}</option>
          <template v-for="(col, ind) in getColumns" :key="ind">
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
            <th v-for="(col, ind) in getColumns" :key="'col-'+ind" :style="{'text-align': col?.align, width: col?.width}">
              <div class="check" v-if="col.type === 'checkbox'">
                <input type="checkbox" ref="checkedAll" class="checkInput" @click.self="checkRows($event, col.prop)" :checked="checkedAllBoolean">
              </div>
              <template v-else-if="col.sort === false">
                <span>{{ col.text }}</span>
              </template>
              <template v-else>
                <div class="dataTableSort">
                  <span>{{ col.text }}</span>
                  <span v-if="sort.col === col.prop && sort.by === 'asc'" @click.self="sort.col = col.prop; sort.by = 'desc'; refresh();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down dataTableEvent" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                      <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                    </svg>
                  </span>
                  <span v-else-if="sort.col === col.prop && sort.by === 'desc'" @click.self="sort.col = col.prop; sort.by = ''; refresh();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-up-alt dataTableEvent" viewBox="0 0 16 16">
                      <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>
                      <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"/>
                      <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                    </svg>
                  </span>
                  <span v-else @click.self="sort.col = col.prop; sort.by = 'asc'; refresh();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-numeric-up dataTableEvent" viewBox="0 0 16 16">
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
              <th v-for="(col, ind) in getColumns" :key="'filter-'+ind">
                <div v-if="col.filter === true && 'prop' in col">
                  <template v-if="col.filterType === 'select'">
                    <select class="select" v-model="filter[col.prop]" @change="resetPage(); refresh();">
                      <option value="" selected></option>
                      <option v-for="(tkCol, tkInd) in (select[col.prop] || [])" :key="tkInd" :value="tkCol">{{ tkCol }}</option>
                    </select>
                  </template>
                  <template v-else>
                    <input type="text" v-model="filter[col.prop]" class="input" @input="filterHandler(col.prop)">
                  </template>
                </div>
              </th>
            </tr>
          </template>
        </thead>
        <tbody :style="{height: (entries.length <= 4 ? 240 : (Number(entries.length) * 60)) + 'px'}">
          <tr v-if="Number(entries.length) === 0">
            <td :colspan="getColumns.length" class="dataTableEmpty">{{ placeholder || 'The data on this page is not yet available.' }}</td>
          </tr>
          <tr v-for="(entry, index) in entries" :key="'entry-'+index">
            <td v-for="(col, ind) in getColumns" :key="'col-'+ind" :style="{'text-align': col?.align, width: col?.width}">
              <template v-if="col.type === 'slot'">
                <slot :name="col.prop" :entry="entry" :index="index"></slot>
              </template>
              <div class="check" v-else-if="col.type === 'checkbox'">
                <input type="checkbox" class="checkInput" :ref="setCheckedRef" :value="entry[col.prop]" :checked="checks.includes(entry[col.prop])" @click.self="(!checks.includes(entry[col.prop])) ? checks.push(entry[col.prop]) : removeChecked(entry[col.prop]); checkSingleRow(col.prop);">
              </div>
              <template v-else>{{ entry[col.prop] }}</template>
            </td>
          </tr>
          <template v-if="Number(entries.length) >= 1 && Number(entries.length) <= 3">
            <tr v-for="num in (4 - Number(entries.length))" style="height: 60px;">
              <td v-if="num === 1" :rowspan="4 - Number(entries.length)" :colspan="getColumns.length"></td>
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
          <select v-model="limitPerPage" @change="resetPage(); refresh();" class="select">
            <option :value="5">5</option>
            <option :value="7">7</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
        <div class="dataTableInfo" v-show="modelValue.length > 0">{{ translate?.from || 'from' }} {{ modelValue.from }} {{ translate?.to || 'to' }} {{ (Number(modelValue.length) <= Number(modelValue.to)) ? modelValue.length : modelValue.to }} {{ translate?.of || 'of' }} {{ modelValue.length }}</div>
      </div>
      <PaginationBox v-model="currentPage" :pages="getPages" @handler="refresh" />
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
