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
  { prop: 'action', text: 'Action', type: 'slot' }
]
</script>

<template>
  <div class="container mt-30px">
    <DataTable :columns="columns" :entries="entries" :filter="true">
      <template v-slot:action="slotProps">
        <div class="d-flex gap-5px">
          <p>{{ slotProps.entry.id }}</p>
          <button type="button" class="button">Edit</button>
          <button type="button" class="button">Delete</button>
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
