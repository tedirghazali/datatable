<script setup lang="ts">
import { ref, reactive, toRef } from 'vue'
import useTable from '../composables/useTable'

const props = defineProps<{ 
  columns: Array<any>,
  filter?: boolean,
  entries: Array<any>,
  rows: Array<any>,
  footers?: Array<any[]>,
  theme?: any
}>()

const emit = defineEmits<{
  (e: 'checklist', rows: any[]): void,
  (e: 'filter', columns: any): void,
  (e: 'sort', value: any): void
}>()

const sort = reactive<{col: string, by: string}>({
  col: '',
  by: ''
})
//@ts-ignore
const { getColumnProperties, getColumnData } = useTable(toRef(props, 'columns'), toRef(props, 'rows'))

const checkedList = ref<any[]>([])
const checkedAll = ref<any>(null)
const checkedRefs = ref<any[]>([])
const setCheckedRef = (el: any) => {
  if (el) {
    checkedRefs.value.push(el)
  }
}

const filterMap = ref<any>({})
for(const column of props.columns) {
  if('prop' in column) {
    filterMap.value[column.prop] = ''
  }
}

const flatByProp = (prop: string) => {
  //@ts-ignore
  return props.entries.map((mi: any) => mi[prop])
}

const removeChecked = (item: string | number | any) => {
  //@ts-ignore
  const getIndex = checkedList.value.findIndex((fi: string | number | any) => fi === item)
  checkedList.value.splice(getIndex, 1)
}

const theme = ref<any>({
  table: 'table tableBorder',
  tableSort: 'tableSort',
  tableSearch: 'tableSearch',
  tableSelect: 'tableSelect',
  tableSelectBox: 'tableSelectBox',
  tableCheckBox: 'tableCheckBox',
  tableInputBox: 'tableInputBox'
})
if('theme' in props && props.theme !== undefined && props.theme !== null) {
  theme.value = {...theme.value, ...props.theme}
}
</script>

<template>
  <table :class="theme.table">
    <thead>
      <tr>
        <th v-for="(col, ind) in columns" :key="'col-'+ind">
          <template v-if="col.type === 'checkbox'">
            <input type="checkbox" ref="checkedAll" :class="theme.tableCheckBox" @click="checkedList = (checkedAll.checked === true) ? flatByProp(col.prop) : []">
          </template>
          <template v-else>
            <div :class="theme.tableSort">
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
      <template v-if="filter">
        <tr>
          <th v-for="(col, ind) in columns" :key="'filter-'+ind">
            <div v-if="col.filter === true && 'prop' in col">
              <div :class="theme.tableSelect" v-if="col.filterType === 'select'">
                <select :class="theme.tableSelectBox" v-model="filterMap[col.prop]" @change="emit('filter', filterMap)">
                  <option value="" selected></option>
                  <option v-for="(tkCol, tkInd) in getColumnData(col.prop)" :key="tkInd" :value="tkCol">{{ tkCol }}</option>
                </select>
              </div>
              <template v-else>
                <input type="text" v-model="filterMap[col.prop]" :class="theme.tableInputBox" @input="emit('filter', filterMap)">
              </template>
            </div>
          </th>
        </tr>
      </template>
    </thead>
    <tbody>
      <tr v-for="(entry, index) in entries" :key="'entry-'+index">
        <td v-for="(col, ind) in columns" :key="'col-'+ind">
          <template v-if="col.type === 'component'">
            <component :is="col.component" :entry="entry"></component>
          </template>
          <template v-else-if="col.type === 'checkbox'">
            <input type="checkbox" :class="theme.tableCheckBox" :ref="setCheckedRef" :value="entry[col.prop]" :checked="checkedList.includes(entry[col.prop])" @click="(checkedRefs[ind].checked === true) ? checkedList.push(entry[col.prop]) : removeChecked(entry[col.prop]); emit('checklist', checkedList)">
          </template>
          <template v-else>{{ entry[col.prop] }}</template>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="footers && Array.isArray(footers[0])">
      <tr v-for="(footer, index) in footers" :key="'row-'+index">
        <th v-for="(foot, ind) in footer" :key="'foot-'+ind">
          <template v-if="foot.type === 'component'">
            <component :is="foot.component" v-model="foot.value" :options="foot.options"></component>
          </template>
          <template v-else>{{ foot.text }}</template>
        </th>
      </tr>
    </tfoot>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
    
.table tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}
    
.table thead {
  border-bottom: 2px solid rgba(0, 0, 0, 0.15);
}
    
.table tfoot {
  border-top: 2px solid rgba(0, 0, 0, 0.15);
}
    
.table tr:last-child {
  border-bottom-width: 0px;
}
    
.table tr th, .table tr td {
  text-align: left;
  vertical-align: top;
  padding: 0.75rem;
}
    
.tableBorder {
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}
    
.tableBorder th, .tableBorder td {
  border-left: 1px solid rgba(0, 0, 0, 0.15);
}
    
.tableResponsive {
  overflow-x: auto;
}

.tableSort {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tableInputBox {
  position: relative;
  display: block;
  border: 0.0625rem solid rgba(0, 0, 0, 0.15);
  padding: 0.15rem 1rem;
  border-radius: 1rem;
  width: 100%;
  line-height: 2rem;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
  appearance: none;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 400;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.tableSelectBox {
  position: relative;
  display: block;
  background: #fff;
  border: 0.0625rem solid rgba(0, 0, 0, 0.15);
  padding: 0.15rem 1rem;
  border-radius: 1rem;
  width: 100%;
  line-height: 2rem;
  box-sizing: border-box;
  cursor: pointer;
  font-family: inherit;
  outline: none;
  user-select: none;
  appearance: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 400;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.tableSelect {
  position: relative;
}

.tableSelect::after {
  border-bottom: 2px solid rgba(0, 0, 0, 0.15);
  border-right: 2px solid rgba(0, 0, 0, 0.15);
  content: '';
  display: block;
  height: 8px;
  margin-top: -6px;
  pointer-events: none;
  position: absolute;
  right: 8px;
  top: 50%;
  margin-right: 10px;
  -webkit-transform-origin: 66% 66%;
  -ms-transform-origin: 66% 66%;
  transform-origin: 66% 66%;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-transition: all 0.15s ease-in-out;
  transition: all 0.15s ease-in-out;
  width: 8px;
}

.tableCheck {
  display: flex;
  align-items: center;
  min-height: 1.3125rem;
  padding-left: 1.5em;
}
.tableCheckBox {
  width: 1rem;
  height: 1rem;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid rgba(0, 0, 0, 0.15);
  appearance: none;
  color-adjust: exact;
  border-radius: 0.15rem;
}
.tableCheckBox:checked {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
  background-color: rgba(0, 0, 0, 0.25);
}
.tableCheck .tableCheckBox {
  float: left;
  margin-left: -1.5em;
}
.tableCheckLabel {
  margin-left: 0.3125rem;
  display: inline-block;
}

.tableEvent {
  pointer-events: none;
}
</style>
