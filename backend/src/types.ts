export interface QueryFilters {
  // eslint-disable-next-line @typescript-eslint/ban-types
  clienteId?: {}
  data?: {
    $gte?: Date
    $lte?: Date
  }
}
