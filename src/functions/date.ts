import {format} from 'date-fns'

export function getFormattedDateTime(date: Date = new Date()) {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}