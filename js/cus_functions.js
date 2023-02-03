/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array} {[]}
 */
export function getDates(startDate, endDate) {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }
    return dates
}

/**
 *
 * @param {Array} array
 * @param {BigInteger} length
 * @param {Array} elements
 * @returns {Array} {*}
 */
export function addSalt(array, length, elements) {
    for (let i = 0; i < length; i++) {
        for (let element of elements) {
            array.push(element)
        }
    }
    return array
}