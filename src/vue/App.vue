<script setup lang="ts">
import { ref } from 'vue'
import DataTable from './components/DataTable.vue'
import entries from './models/entries'

const columns = [
  { prop: 'id', text: 'ID', type: 'checkbox' },
  { prop: 'name', text: 'Name', type: 'text', filter: true },
  { prop: 'position', text: 'Position', type: 'text', filter: true, filterType: 'select' },
  { prop: 'office', text: 'Office', type: 'text', filter: true, filterType: 'select' },
  { prop: 'extension', text: 'Exten.', type: 'text', filter: true },
  { prop: 'startdate', text: 'Start Date', type: 'text', filter: true },
  { prop: 'salary', text: 'Salary', type: 'text', filter: true },
  { prop: 'action', text: 'Action', type: 'slot', sort: false }
]

const pressButton = (val) => {
  alert(JSON.stringify(val))
}
</script>

<template>
  <div class="container mt-30px">
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
@use base;
@use container;
@use form {
  field: button;
}
</style>
