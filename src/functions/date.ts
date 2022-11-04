import {format} from 'date-fns'

export function getFormattedDateTime(date: Date = new Date()) {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

interface BaseData {
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export function prepareData<Type extends BaseData>(row: Type) {
  const {updatedAt, deletedAt, ...data} = row
  const createdAt = getFormattedDateTime(row.createdAt)

  return {...data, createdAt: createdAt}
}
