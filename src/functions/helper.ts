interface BaseData {
  updatedAt: Date
  deletedAt: Date
}

export function prepareData<Type extends BaseData>(row: Type) {
  const {updatedAt, deletedAt, ...data} = row
  return {...data}
}

export function isEmptyObject(object: object) {
  return object
    && Object.keys(object).length === 0
    && Object.getPrototypeOf(object) === Object.prototype
}
