var D = require('date-fns')
var R = require('ramda')

const leftPad = (str, length = 2) =>
  str.length < length ? leftPad(' ' + str, length) : str

const centerPad = (str, length = 2) =>
  str.length < length ? centerPad(' ' + str + ' ', length) : str

const showMonth = (date) => {
  const days = D.eachDay(
    D.startOfWeek(D.startOfMonth(date)),
    D.endOfWeek(D.endOfMonth(date))
  )

  const weeksOfDays = R.splitEvery(7, days).map(week =>
    week.map(day => D.format(day, 'D')))

  const result =
    weeksOfDays.map(week =>
      week.map(day =>
        leftPad(day)
      ).join(' ')
    ).join('\n')

  const header = 'Su Mo Tu We Th Fr Sa'
  const title = D.format(date, 'MMMM YYYY')

  console.log(centerPad(title, 19))
  console.log(header)
  console.log(result)
}

const showYear = (date) => {
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const year = D.getYear(date)
  R.forEach(
    month => {
      showMonth(new Date(year, month))
      console.log('')
    },
    months
  )
}

const input = process.argv.slice(2)

let date = new Date()
let shouldShowYear = false

if (input.length === 1) {
  // TODO validate year number
  // 2016 (year only)
  date = new Date(input[0], 0, 1)
  shouldShowYear = true
}

if (input.length === 2) {
  // TODO validate month number (or string)
  // TODO validate year number
  // 1 2016 (month and year)
  // jan 2016 (month and year)
  // january 2016 (month and year)
  date = new Date(input[1], input[0], 0)
  shouldShowYear = false
}

if (shouldShowYear) {
  showYear(date)
} else {
  showMonth(date)
}
