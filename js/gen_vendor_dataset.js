import {faker} from '@faker-js/faker'
import * as fun from "./cus_functions.js"
import * as fs from "node:fs"
import {addSalt} from "./cus_functions.js"

// Vendor table variable
const vendor_id_start = 100000
const REGISTRATION_DATE_START = '2018-01-01'
const REGISTRATION_DATE_END = '2018-12-31'
let supplier_registration_status = ['Registered', 'Pending', 'Expired']
const SUPPLIER_REGISTRATION_STATUS = addSalt(supplier_registration_status, supplier_registration_status.length, ['Registered'])
let supplier_qualification_status = ['Qualified', 'Pending']
const SUPPLIER_QUALIFICATION_STATUS = addSalt(supplier_qualification_status, supplier_qualification_status.length, ['Qualified'])
let trade_license_type = ['Commercial', 'Industrial']
const TRADE_LICENSE_TYPE = addSalt(trade_license_type, trade_license_type.length, ['Commercial'])
const TRADE_LICENSE_ISSUING_AUTHORITY = ['ABC', 'ABD', 'DST', 'GTG', 'HJI']
const VENDOR_TYPE = ['International', 'Free Zone']
const countries = JSON.parse(fs.readFileSync('../res/countries.json'))
const states = JSON.parse(fs.readFileSync('../res/states.json'))
const cities = JSON.parse(fs.readFileSync('../res/cities.json'))
const employees = JSON.parse(fs.readFileSync('employees.json'))
const country_codes_list = countries.map(e => e.country_code)
const country_codes = fun.addSalt(country_codes_list, country_codes_list.length, ['ARE'])
const IBAN_LIST = ['AE', 'GB', 'DE']

/**
 *
 * @param index
 * @returns {{vendor_country_code: *, registration_date: Date, contact_phone: string, vendor_name_ar: string, vendor_id: string, vendor_name_en: string, vendor_country_en: *}}
 */
function createRandomVendor(index) {
    const vendor_id = 'VEN-' + (vendor_id_start + index)
    const vendor_name_en = faker.company.name()
    const registration_date = faker.date.between(REGISTRATION_DATE_START, REGISTRATION_DATE_END)
    const vendor_country_code = faker.helpers.arrayElement(country_codes)
    const vendor_country_en = (countries.filter(e => {
        return e.country_code === vendor_country_code
    }))[0].country_name
    const phone_code = (countries.filter(e => {
        return e.country_code === vendor_country_code
    }))[0].phone_code
    const country_code_two = (countries.filter(e => {
        return e.country_code === vendor_country_code
    }))[0].country_code_two.toLowerCase()
    const vendor_states_list = (states.filter(e => {
        return e.country_code === vendor_country_code
    })).map(e => e.states_name)
    const vendor_state = faker.helpers.arrayElement(vendor_states_list)
    const vendor_city_list = (cities.filter(e => {
        return e.states_name === vendor_state
    })).map(e => e.city_name)
    const vendor_city = faker.helpers.arrayElement(vendor_city_list)
    const vendor_address = faker.address.streetAddress().concat(', ', vendor_city, ', ', vendor_state, ', ', vendor_country_en)
    const owner_gender = faker.name.gender()
    const contact_gender = faker.name.gender()
    const owner_first_name = faker.name.firstName(owner_gender)
    const owner_last_name = faker.name.lastName(owner_gender)
    const contact_first_name = faker.name.firstName(contact_gender)
    const contact_last_name = faker.name.lastName(contact_gender)
    const email_provider = vendor_name_en.trim().split(' ')[0].replace(/([',])/, '').toLowerCase().concat('.', country_code_two)
    const iban_code = IBAN_LIST.filter(e => e === country_code_two.toUpperCase())[0]
    const created_date = faker.date.soon(100, registration_date)
    const last_updated_date = faker.date.soon(100, created_date)
    // const test = employees.filter(e => e.department_id === 'OP-100000').map(e => e.employee_id)

    return {
        vendor_id,
        vendor_name_en,
        vendor_name_ar: '',
        registration_date,
        supplier_registration_status: faker.helpers.arrayElement(SUPPLIER_REGISTRATION_STATUS),
        supplier_qualification_status: faker.helpers.arrayElement(SUPPLIER_QUALIFICATION_STATUS),
        trade_license_number: country_code_two.toUpperCase().concat('-', faker.datatype.number().toString()),
        trade_license_type: faker.helpers.arrayElement(TRADE_LICENSE_TYPE),
        trade_license_expiry_date: faker.date.future(10, registration_date),
        trade_license_issuing_authority: faker.helpers.arrayElement(TRADE_LICENSE_ISSUING_AUTHORITY),
        supplier_tax_registration_number: country_code_two.toUpperCase().concat('-TAX-', faker.datatype.number().toString()),
        vendor_type: faker.helpers.arrayElement(VENDOR_TYPE),
        owner_name_en: owner_first_name.concat(' ', owner_last_name),
        owner_name_ar: '',
        contact_name_en: contact_first_name.concat(' ', contact_last_name),
        contact_name_ar: '',
        contact_phone: faker.phone.number(phone_code + '#########'),
        contact_email: faker.internet.email(contact_first_name, contact_last_name, email_provider),
        vendor_country_code,
        vendor_country_en,
        vendor_state,
        vendor_city,
        vendor_address,
        vendor_po_box: faker.helpers.arrayElement(['PO.BOX '.concat(faker.datatype.number()), '', '']),
        vendor_iban_number: iban_code === '' ? '' : faker.helpers.arrayElement([faker.finance.iban(false, iban_code), '']),
        vendor_swift_code: faker.finance.bic(),
        created_date,
        // created_by: '',
        created_by: faker.helpers.arrayElement(employees.filter(e => e.department_id === 'OP-100000').map(e => e.employee_id)),
        last_updated_date,
        // last_update_by: ''
        last_updated_by: faker.helpers.arrayElement(employees.filter(e => e.department_id === 'OP-100000').map(e => e.employee_id))
    };
}


/**
 *
 * @param size the records of fake vendor data you need to generate
 * @returns {[]} the list of vendor objs
 */
function createVendors(size = 10) {
    const vendors = []
    for (const x of Array(size).keys()) {
        vendors.push(createRandomVendor(x))
    }
    return vendors
}

let vendors = createVendors(1000)
let vendors_json = JSON.stringify(vendors)
fs.writeFileSync('vendors.json', vendors_json)