var D = require('date-fns')
var R = require('ramda')

const MONTHS = {
  'jan': 1,
  'feb': 2,
  'mar': 3,
  'apr': 4,
  'may': 5,
  'jun': 6,
  'jul': 7,
  'aug': 8,
  'sep': 9,
  'oct': 10,
  'nov': 11,
  'dec': 12
}

const leftPad = (str, length = 2) =>
  str.length < length ? leftPad(' ' + str, length) : str

const centerPad = (str, length = 2) =>
  str.length < length ? centerPad(' ' + str + ' ', length) : str

const parseYear = (input) => {
  let yearAsInt = parseInt(input, 10)
  if (yearAsInt >= 1 && yearAsInt < 9999) {
    return yearAsInt
  }

  return null
}

const parseMonth = (input) => {
  let monthAsInt = parseInt(input, 10)
  if (monthAsInt >= 1 && monthAsInt <= 12) {
    return monthAsInt
  }

  let firstThreeCharacters = input.toLowerCase().slice(0, 3)
  let monthFromString = MONTHS[firstThreeCharacters]
  if (monthFromString) {
    return monthFromString
  }

  return null
}

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

const main = () => {
  const input = process.argv.slice(2)

  let date = new Date()
  let shouldShowYear = false

  // e.g.:
  // 2017 (year)
  if (input.length === 1) {
    let year = parseYear(input[0])
    if (!year) {
      console.log(`calx: ${year} 0 not in range 1..9999`)
      return
    }

    date = new Date(year, 0, 1)
    shouldShowYear = true
  }

  // e.g.:
  // 1 2016 (month and year)
  // jan 2016 (month and year)
  // january 2016 (month and year)
  if (input.length === 2) {
    let month = parseMonth(input[0])
    let year = parseYear(input[1])

    if (!month) {
      console.log(`calx: ${month} is neither a month number (1..12) nor a name`)
      return
    }
    if (!year) {
      console.log(`calx: ${year} 0 not in range 1..9999`)
      return
    }

    date = new Date(year, month, 0)
    shouldShowYear = false
  }

  if (shouldShowYear) {
    showYear(date)
  } else {
    showMonth(date)
  }
}

main()
