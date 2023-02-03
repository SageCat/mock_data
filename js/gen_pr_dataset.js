import {faker} from '@faker-js/faker'
import * as fs from "node:fs"
import {addSalt} from './cus_functions.js'

// PR variables
const vendors = JSON.parse(fs.readFileSync('vendors.json'))
const vendor_id_list = vendors.map(e => e.vendor_id)
const employees = JSON.parse(fs.readFileSync('employees.json'))
const employees_id_list = employees.map(e => e.employee_id)
const currency_json = JSON.parse(fs.readFileSync('../res/currency.json'))
const currency_list = addSalt(Object.keys(currency_json), Object.keys(currency_json).length, ['AED', 'USD'])
const PR_NUMBER_START = 100000000
const PR_LINE_TYPE = ['Raw Materials', 'Finished Goods', 'Miscellaneous', 'Capital Equipment']
const PR_TYPE = ['Standard Purchase', 'Capital Expenditures', 'Project-related Purchase', 'MRO', 'Inventory Replenishment']
const PR_DATE_START = '2019-01-01'
const PR_DATE_END = '2020-12-31'
const TEMP_PR_APPROVAL_STATUS_LIST = ['Approved', 'Pending', 'Rejected']
const PR_APPROVAL_STATUS_LIST = addSalt(TEMP_PR_APPROVAL_STATUS_LIST, TEMP_PR_APPROVAL_STATUS_LIST.length, ['Approved'])

/**
 * @param index
 */
function createRandomPR(index) {
    const pr_number = 'PR-' + (PR_NUMBER_START + index)
    const pr_line_number = faker.datatype.bigInt(1, 9).toString()
    const pr_date = faker.date.between(PR_DATE_START, PR_DATE_END)
    const quantity = faker.datatype.number({min: 5, max: 100})
    const unit_price = faker.commerce.price()
    const pr_amount = quantity * unit_price
    const currency = faker.helpers.arrayElement(currency_list)
    const currency_conversion_rate = currency_json['AED'] / currency_json[currency]
    const vendor_id = faker.helpers.arrayElement(vendor_id_list)
    const vendor_name_en = vendors.filter(e => e.vendor_id === vendor_id)[0].vendor_name_en
    const pr_requested_date = faker.date.between(PR_DATE_START, PR_DATE_END)
    const pr_requestor_id = faker.helpers.arrayElement(employees_id_list)
    const pr_requested_by = employees.filter(e => e.employee_id === pr_requestor_id)[0].employee_name_en
    const pr_requestor_department = employees.filter(e => e.employee_id === pr_requestor_id)[0].department_name_en
    const pr_approval_status = faker.helpers.arrayElement(PR_APPROVAL_STATUS_LIST)
    const pr_approved_date = pr_approval_status === 'Approved' ? faker.date.soon(30, pr_requested_date) : ''
    const pr_approved_by = faker.helpers.arrayElement(employees.filter(e => e.department_id === 'OP-10004').map(e => e.employee_id))
    const need_by_date = faker.date.soon(60, pr_requested_date)
    const created_date = faker.date.soon(10, pr_requested_date)
    const created_by = faker.helpers.arrayElement(employees_id_list)
    const last_updated_date = faker.date.soon(30, created_date)
    const last_updated_by = faker.helpers.arrayElement(employees_id_list)

    return {
        pr_number,
        pr_line_number,
        pr_line_type: faker.helpers.arrayElement(PR_LINE_TYPE),
        pr_line_item: faker.commerce.productName(),
        pr_line_item_description: faker.commerce.productDescription(),
        pr_date,
        pr_type: faker.helpers.arrayElement(PR_TYPE),
        pr_description: '',
        quantity,
        unit_price,
        pr_amount,
        currency,
        currency_conversion_rate,
        pr_item_category_code: '',
        pr_item_category_description: '',
        vendor_id,
        vendor_name_en,
        vendor_name_ar: '',
        pr_requested_date,
        pr_requestor_id,
        pr_requested_by,
        pr_requestor_department,
        pr_approval_status,
        pr_approved_date,
        pr_approved_by,
        need_by_date,
        pr_status: pr_approval_status,
        created_date,
        created_by,
        last_updated_by,
        last_updated_date
    };
}

function createPRs(size = 10) {
    const prs = []
    for (const x of Array(size).keys()) {
        prs.push(createRandomPR(x))
    }
    return prs
}

let prs = createPRs(10000)
let prs_json = JSON.stringify(prs)
fs.writeFileSync('prs.json', prs_json)
