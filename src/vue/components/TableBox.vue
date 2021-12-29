<script setup lang="ts">
import { ref, toRef } from 'vue'
import useTable from '../composables/useTable'

const props = defineProps<{ 
  columns: Array<any>,
  filter?: boolean,
  entries: Array<any>,
  footers?: Array<any[]>,
}>()

const emit = defineEmits<{
  (e: 'checklist', rows: any[]): void,
  (e: 'filter', columns: any): void
}>()

const { getColumnProperties, getColumnData } = useTable(toRef(props, 'columns'), toRef(props, 'entries'))

const checkedList = ref([])
const filterMap = ref({})
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(col, ind) in columns" :key="'col-'+ind">
          <template v-if="col.type === 'checkbox'">
            <input type="checkbox" class="tableCheckInput">
          </template>
          <template v-else>{{ col.text }}</template>
        </th>
      </tr>
      <template v-if="filter">
        <tr>
          <th v-for="(col, ind) in columns" :key="'filter-'+ind">
            <div v-if="col.filter === true">
              <template v-if="col.filterType === 'select'">
                <select class="tableSelect">
                  <option></option>
                </select>
              </template>
              <template v-else>
                <input type="text" :ref="'filter-'+col.prop" class="tableInput" @input="filterMap[col.prop] = $refs['filter-'+col.prop].value; emit('filter', filterMap)" placeholder="Press enter key">
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
            <component :is="col.component" v-model="col.value" :options="col.options"></component>
          </template>
          <template v-else-if="col.type === 'checkbox'">
            <input type="checkbox" class="tableCheckInput" :value="entry[col.prop]" @click="checkedList.push(entry); emit('checklist', checkedList)">
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
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
    
.tableBorder th, .tableBorder td {
  border-left: 1px solid rgba(0, 0, 0, 0.25);
}
    
.tableResponsive {
  overflow-x: auto;
}

.tableInput {
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

.tableSelect {
  position: relative;
  display: block;
  border: 0.0625rem solid rgba(0, 0, 0, 0.15);
  padding: 0.3125rem 1.25rem;
  border-radius: 1rem;
  width: 100%;
  min-height: 44px;
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

.tableSelect::after {
  border-bottom: 3px solid rgba(0, 0, 0, 0.15);
  border-right: 3px solid rgba(0, 0, 0, 0.15);
  content: '';
  display: block;
  height: 10px;
  margin-top: -6px;
  pointer-events: none;
  position: absolute;
  right: 8px;
  top: 45%;
  margin-right: 10px;
  -webkit-transform-origin: 66% 66%;
  -ms-transform-origin: 66% 66%;
  transform-origin: 66% 66%;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-transition: all 0.15s ease-in-out;
  transition: all 0.15s ease-in-out;
  width: 10px;
}
.tableCheck {
  display: flex;
  align-items: center;
  min-height: 1.3125rem;
  padding-left: 1.5em;
}
.tableCheckInput {
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
.tableCheckInput:checked {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
  background-color: rgba(0, 0, 0, 0.25);
}
.tableCheck .selectCheckInput {
  float: left;
  margin-left: -1.5em;
}
.tableCheckLabel {
  margin-left: 0.3125rem;
  display: inline-block;
}
</style>
