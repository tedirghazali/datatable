import { defineCustomElement } from 'vue'
import VueDataTable from '../vue/components/DataTable.vue'

export const DataTable = defineCustomElement(VueDataTable)

export function useTedirTable() {
  customElements.define('data-table', DataTable)
}
