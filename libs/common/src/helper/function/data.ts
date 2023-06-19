interface BaseData {
  id: number
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export function prepareData<Type extends BaseData>(row: Type): Omit<Type, 'updated_at' | 'deleted_at'> {
  const {updated_at, deleted_at, ...data} = row
  return {...data}
}
