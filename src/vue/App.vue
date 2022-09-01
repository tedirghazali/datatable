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
  { prop: 'action', text: 'Action', type: 'slot', sort: false }
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

const getEntries = ref(entries)
const setEntries = async () => {
  const response = await fetch(`http://localhost:3000/?limit=${limit.value}&offset=${offset.value}&sort_col=${sort.value.col}&sort_by=${sort.value.by}&search=${search.value}&filter_name=${filter.value.name}&filter_position=${filter.value.position}&filter_office=${filter.value.office}&filter_extension=${filter.value.extension}&filter_startdate=${filter.value.startdate}&filter_salary=${filter.value.salary}`)
  const json = await response.json()
  getEntries.value = json.entries || []
  columnData.value = json.columns || {}
  total.value = json.total || 1
}
onMounted(setEntries)

watch(search, setEntries)
watch(filter, setEntries)
watch(sort, setEntries)

const pressButton = (val) => {
  alert(JSON.stringify(val))
}
</script>

<template>
  <div class="container mt-30px">
    <h2>ServerTable</h2>
    <ServerTable :columns="columns" :entries="getEntries" :select="columnData" :total="total" v-model:limit="limit" v-model:offset="offset" v-model:search="search" v-model:filter="filter" @handler="setEntries">
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
    <p><br /></p>
    <h2>DataTable</h2>
    <DataTable :columns="columns" :entries="entries" :filter="true">
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
  </div>
</template>

<style>
@use form {
  field: button;
}
</style>
