import {faker} from '@faker-js/faker'
import * as fs from "node:fs"
import {addSalt} from './cus_functions.js'

// PO variables
const PO_NUMBER_START = 200000
const pr_datasets = JSON.parse(fs.readFileSync('prs.json'))
const employees = JSON.parse(fs.readFileSync('employees.json'))
let po_approval_status_ = ['Approved', 'Pending', 'Rejected']
const po_approval_status_list = addSalt(po_approval_status_, po_approval_status_.length * 2, ['Approved'])
let delivery_status_ = ['Delivered', 'None-Delivered', 'Not-know']
const delivery_status_list = addSalt(delivery_status_, delivery_status_.length * 2, ['Delivered'])
let procurement_method_ = ['Direct', 'Tendor', 'Quotations']
const procurement_method_list = addSalt(procurement_method_, procurement_method_.length * 2, ['Direct'])

function createRandomPO(index) {
    const po_number = 'PO-' + (PO_NUMBER_START + index)
    const pr_number = pr_datasets[index].pr_number
    const pr_date = pr_datasets[index].pr_date
    const pr_type = pr_datasets[index].pr_type
    const quantity = pr_datasets[index].quantity
    const ordered_quantity = faker.datatype.number({min: 5, max: quantity})
    const unit_price = pr_datasets[index].unit_price
    const vendor_id = pr_datasets[index].vendor_id
    const vendor_name_en = pr_datasets[index].vendor_name_en
    const vendor_name_ar = pr_datasets[index].vendor_name_ar
    const po_date = faker.date.soon(30, pr_date)
    const po_submitted_date = faker.date.soon(10, po_date)
    const po_approval_status = faker.helpers.arrayElement(po_approval_status_list)
    const po_approved_date = po_approval_status === 'Approved' ? faker.date.soon(20, po_submitted_date) : ''
    const delivery_status = faker.helpers.arrayElement(delivery_status_list)
    const delivery_date = delivery_status === 'Delivered' ? faker.date.soon(40, po_approved_date) : ''
    const delivery_quantity = delivery_status === 'Delivered' ? faker.datatype.number({
        min: 5,
        max: ordered_quantity
    }) : 0
    const delivery_amount = delivery_quantity * unit_price
    const po_line_number = pr_datasets[index].pr_line_number
    const po_line_type = pr_datasets[index].pr_type
    const po_line_number_description = pr_datasets[index].pr_line_item_description

    return {
        po_number,
        po_date,
        po_type: pr_type,
        po_status: faker.helpers.arrayElement(['Open', 'Closed']),
        po_description: faker.commerce.productDescription(),
        ordered_quantity,
        unit_price,
        ordered_amount: ordered_quantity * unit_price,
        item_category_code: '',
        item_category_description: '',
        vendor_id,
        vendor_name_en,
        vendor_name_ar,
        po_submitted_date,
        po_submitted_by: faker.helpers.arrayElement(employees.map(e => e.employee_id)),
        po_approval_status,
        po_approved_date,
        po_approved_by: faker.helpers.arrayElement(employees.filter(e => e.department_id === 'OP-10001').map(e => e.employee_id)),
        po_buyer: faker.helpers.arrayElement(employees.filter(e => e.department_id === 'OP-10003').map(e => e.employee_id)),
        cost_center: '123456',
        delivery_date,
        delivery_status,
        delivery_quantity,
        delivery_amount,
        po_line_number,
        po_line_type,
        po_line_number_description,
        procurement_method: faker.helpers.arrayElement(procurement_method_list),
        po_currency: pr_datasets[index].currency,
        currency_exchange_rate: pr_datasets[index].currency_conversion_rate,
        pr_number,
        sourcing_reference_number: '',
        contract_number: 'CONTRACT-' + faker.datatype.bigInt(),
        receipt_date: delivery_status === 'Delivered' ? faker.date.soon(5, delivery_date) : '',
        cancelled_quantity: quantity - ordered_quantity,
        cancelled_amount: (quantity - ordered_quantity) * unit_price
    }
}


function createPOs(prs) {
    const pos = []
    for (const x of Array(prs.length).keys()) {
        pos.push(createRandomPO(x))
    }
    return pos
}

const pos = createPOs(pr_datasets)
const pos_json = JSON.stringify(pos)
fs.writeFileSync('pos.json', pos_json)