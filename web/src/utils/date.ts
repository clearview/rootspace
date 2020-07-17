function msToSecond (ms: number) {
  return Math.round(ms / 1000)
}
function msToMinute (ms: number) {
  return Math.round(ms / 1000 / 60)
}
function msToHour (ms: number) {
  return Math.round(ms / 1000 / 60 / 60)
}
function msToDay (ms: number) {
  return Math.round(ms / 1000 / 60 / 60 / 24)
}

function formatAmPm (hour: number, minute: number) {
  const ampm = hour >= 12 ? 'pm' : 'am'
  hour = hour % 12
  hour = hour || 12
  return `${hour}:${minute < 10 ? '0' + minute : minute} ${ampm}`
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function formatRelativeTo (from: Date, to: Date) {
  const justNow = msToSecond(to.getTime() - from.getTime()) < 60
  if (justNow) {
    return 'Just now'
  }
  const mins = msToMinute(to.getTime() - from.getTime())
  if (mins < 3) {
    return 'Few mins ago'
  }
  if (mins < 60) {
    return `${mins}mins ago`
  }
  const hours = msToHour(to.getTime() - from.getTime())
  if (hours < 2) {
    return 'an hour ago'
  }
  if (hours < 24) {
    return `${hours}h ago`
  }
  const days = msToDay(to.getTime() - from.getTime())
  if (days < 2) {
    return 'Yesterday'
  }

  return `${dayNames[from.getDay()]}, ${monthNames[from.getMonth()]} ${from.getDate()} at ${formatAmPm(from.getHours(), from.getMinutes())}`
}
