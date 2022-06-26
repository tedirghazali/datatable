import { defineCustomElement } from 'vue'
import VueDataTable from '../vue/components/DataTable.vue'
import VuePaginationBox from '../vue/components/PaginationBox.vue'

export const DataTable = defineCustomElement(VueDataTable)
export const PaginationBox = defineCustomElement(VuePaginationBox)

export function useTedirTable() {
  customElements.define('data-table', DataTable)
  customElements.define('pagination-box', PaginationBox)
}
