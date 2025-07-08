import tasks from './tasks'
import events from './events'
import gateway from './gateway'
import lint from './lint'
import other from './other'
import rules from './rules'

export default {
  ...other,
  ...events,
  ...gateway,
  ...lint,
  ...tasks,
  ...rules
}
