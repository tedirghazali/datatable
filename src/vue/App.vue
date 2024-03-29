<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ServerTable from './components/ServerTable.vue'
import DataTable from './components/DataTable.vue'
import entries from './models/entries'

const columns = [
  { prop: 'id', text: 'ID', type: 'checkbox' },
  { prop: 'name', text: 'Name', type: 'text', filter: true },
  { prop: 'position', text: 'Position', type: 'text', filter: true, filterType: 'select' },
  { prop: 'office', text: 'Office', type: 'text', filter: true },
  { prop: 'extension', text: 'Exten.', type: 'text', filter: true },
  { prop: 'startdate', text: 'Start Date', type: 'text', filter: true },
  { prop: 'salary', text: 'Salary', type: 'text', filter: true },
  { prop: 'action', text: 'Action', type: 'slot', sort: false, align: 'right', width: '160px' }
]

const total = ref(1)
const columnData = ref({})

const limit = ref(10)
const offset = ref(0)
const search = ref('')
const filter = ref({
  name: '',
  position: '',
  office: '',
  extension: '',
  startdate: '',
  salary: ''
})
const sort = ref<any>({
  col: 'id',
  by: 'asc'
})

const allData = ref<any>({
  limit: 10,
  page: 1,
  offset: 0,
  search: '',
  searchBy: '',
  filter: {
    name: '',
    position: '',
    office: '',
    extension: '',
    startdate: '',
    salary: ''
  },
  sort: 'id',
  sortBy: 'desc',
  total: 1,
  length: 10,
  from: 1,
  to: 10
})

const getEntries = ref(entries.slice(0, 10))
const setEntries = async () => {
  const response = await fetch(`http://localhost:3000/?limit=${limit.value}&offset=${offset.value}&sort_col=${sort.value.col}&sort_by=${sort.value.by}&search=${search.value}&filter_name=${filter.value.name}&filter_position=${filter.value.position}&filter_office=${filter.value.office}&filter_extension=${filter.value.extension}&filter_startdate=${filter.value.startdate}&filter_salary=${filter.value.salary}`)
  const json = await response.json()
  getEntries.value = json.entries || []
  columnData.value = json.columns || {}
  total.value = json.total || 1
}
//onMounted(setEntries)

//watch(allData, setEntries)

const pressButton = (val: any) => {
  alert(JSON.stringify(val))
}

const checks = ref<any[]>([1, 3])
const checkLists = (val: any[]) => {
  checks.value = val
  console.log(checks.value)
}

const serverHandler = (val: any) => {
  console.log(val)
}
</script>

<template>
  <div class="container my-30px">
    <h2>DataTable</h2>
    <DataTable :columns="columns" :entries="entries" filterBy="column" :sortBy="['id', 'asc']" @checklist="checkLists" :checks="checks">
      <template #default>
        <div class="d-flex gap-5px">
          <button type="button" @click="pressButton(['add new'])" class="button primary-light bdColor-darken(primary,20) hover:primary-dark-20">Add New</button>
        </div>
      </template>
      <template v-slot:action="{ entry }">
        <div class="d-flex gap-5px">
          <button type="button" @click="pressButton(entry)" class="button warning-light bdColor-darken(warning,20) hover:warning-dark-20">Edit</button>
          <button type="button" @click="pressButton(entry)" class="button danger-light bdColor-darken(danger,20) hover:danger-dark-20">Delete</button>
        </div>
      </template>
    </DataTable>
    <p><br /></p>
    <h2>ServerTable</h2>
    <ServerTable v-model="allData" :columns="columns" :entries="getEntries" :select="columnData" filterBy="search" @handler="serverHandler" @checklist="checkLists" :checks="checks" checkprop="id">
      <template #default>
        <div class="d-flex gap-5px">
          <button type="button" @click="pressButton(['add new'])" class="button primary-light bdColor-darken(primary,20) hover:primary-dark-20">Add New</button>
        </div>
      </template>
      <template v-slot:action="{ entry }">
        <div class="d-flex gap-5px">
          <button type="button" @click="pressButton(entry)" class="button warning-light bdColor-darken(warning,20) hover:warning-dark-20">Edit</button>
          <button type="button" @click="pressButton(entry)" class="button danger-light bdColor-darken(danger,20) hover:danger-dark-20">Delete</button>
        </div>
      </template>
    </ServerTable>
  </div>
</template>

<style>
@use form {
  field: button;
}
</style>
