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
            <input type="checkbox">
          </template>
          <template v-else>{{ col.text }}</template>
        </th>
      </tr>
      <template v-if="filter">
        <tr>
          <th v-for="(col, ind) in columns" :key="'filter-'+ind">
            <div v-if="col.filter === true">
              <template v-if="col.filterType === 'select'">
                <select>
                  <option></option>
                </select>
              </template>
              <template v-else>
                <input type="text" :ref="'filter-'+col.prop" class="input" @keyup.enter="filterMap[col.prop] = $refs['filter-'+col.prop].value; emit('filter', filterMap)">
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
            <input type="checkbox" :value="entry[col.prop]" @click="checkedList.push(entry); emit('checklist', checkedList)">
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
