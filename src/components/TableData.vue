<script setup lang="ts">
import { toRef } from 'vue'
import useTable from '../composables/useTable'

const props = defineProps<{ 
  columns: Array<any[] | any>,
  entries: Array<any>,
  footers?: Array<any[]>,
}>()

const { getColumnHeader, getColumnData } = useTable(toRef(props, 'columns'), toRef(props, 'entries'))

console.log(getColumnHeader.value)
</script>

<template>
  <table class="table">
    <thead>
      <template v-if="Array.isArray(columns[0])">
        <tr v-for="(column, index) in columns" :key="'row-'+index">
          <th v-for="(col, ind) in column" :key="'col-'+ind">
            <template v-if="col.type === 'component'"></template>
            <template v-else-if="col.type === 'checkbox'"></template>
            <template v-else-if="col.type === 'input'"></template>
            <template v-else-if="col.type === 'select'"></template>
            <template v-else>{{ col.text }}</template>
          </th>
        </tr>
      </template>
      <template v-else-if="typeof columns[0] === 'string' || typeof columns[0] === 'number'">
        <tr>
          <th v-for="(col, ind) in columns" :key="'col-'+ind">{{ col }}</th>
        </tr>
      </template>
      <template v-else>
        <tr>
          <th v-for="(col, ind) in columns" :key="'col-'+ind">{{ col.text }}
            <template v-if="col.type === 'component'">
              <component :is="col.component" v-model="col.value" :options="col.options"></component>
            </template>
            <template v-else-if="col.type === 'checkbox'"></template>
            <template v-else-if="col.type === 'input'"></template>
            <template v-else-if="col.type === 'select'"></template>
            <template v-else>{{ col.text }}</template>
          </th>
        </tr>
      </template>
    </thead>
    <tbody>
      <tr v-for="(entry, index) in entries" :key="'entry-'+index">
        <td v-for="(col, ind) in getColumnHeader" :key="'col-'+ind">
          <template v-if="typeof col === 'object' && 'type' in col">
            <template v-if="col.type === 'component'">
              <component :is="col.component" v-model="col.value" :options="col.options"></component>
            </template>
            <template v-else-if="col.type === 'checkbox'"></template>
          </template>
          <template v-else>{{ entry[col] }}</template>
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
