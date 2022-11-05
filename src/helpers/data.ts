interface BaseData {
  updatedAt: Date
  deletedAt: Date
}

export function prepareData<Type extends BaseData>(row: Type) {
  const {updatedAt, deletedAt, ...data} = row
  return {...data}
}
