import {faker} from '@faker-js/faker'
import * as fun from "./cus_functions.js"
import * as fs from "node:fs"
import {addSalt} from "./cus_functions.js"

// Employee table variable
const employee_id_start = 10000
const employee_effective_start_date = '2018-01-01'
const employee_effective_end_date = '2019-12-31'
const departments = JSON.parse(fs.readFileSync('../res/department.json'))
const department_list
    = departments.map(e => e.name)
const education_list = ['Primary', 'Secondary', 'Associate', 'Bachelor', 'Master', 'Doctoral', 'others']
const countries = JSON.parse(fs.readFileSync('../res/countries.json'))
const country_codes_list = countries.map(e => e.country_code)
const country_codes = fun.addSalt(country_codes_list, country_codes_list.length, ['ARE'])
const marital_status_data = ['Married', 'Single', 'Widow', 'Divorced']
const marital_status_list = addSalt(marital_status_data, marital_status_data.length, ['Married'])


/**
 *
 * @param index
 */
function createRandomEmployee(index) {
    const employee_id = 'EMP-' + (employee_id_start + index)
    const effective_start_date = faker.date.between(employee_effective_start_date, employee_effective_end_date)
    const effective_end_date = faker.date.future(10, effective_start_date)
    const gender = faker.name.sex()
    const employee_first_name = faker.name.firstName(gender)
    const employee_last_name = faker.name.lastName(gender)
    const hire_date = faker.date.soon(30, effective_start_date)
    const termination_date = faker.date.future(10, hire_date)
    const eid = '78419'.concat(faker.datatype.bigInt(1000000000, 9999999999).toString())
    const country_code = faker.helpers.arrayElement(country_codes)
    const nationality_en = countries.filter(e => e.country_code === country_code)[0].country_name
    const marital_status = faker.helpers.arrayElement(marital_status_list)
    const department_name_en = faker.helpers.arrayElement(department_list)
    const department_id = department_name_en.substring(0, 2).toUpperCase().concat('-100000')
    const job_title_en = faker.helpers.arrayElement(departments.filter(e => e.name === department_name_en)[0].jobTitles)
    const city = faker.helpers.arrayElement(['Abu Dhabi', 'Al Ain', 'Al Dhafra'])


    return {
        employee_id,
        effective_start_date,
        effective_end_date,
        employee_name_en: employee_first_name.concat(' ', employee_last_name),
        employee_name_ar: '',
        hire_date,
        termination_date,
        eid,
        nationality_en,
        nationality_ar: '',
        birth_date: faker.date.birthdate({min: 1950, max: 2000, mode: 'year'}),
        gender,
        marital_status,
        child_count: faker.datatype.bigInt(0, 8).toString(),
        education_level_en: faker.helpers.arrayElement(education_list),
        education_level_ar: '',
        job_title_en,
        job_title_ar: '',
        grade: faker.datatype.bigInt(1,15).toString(),
        employee_contract_type: faker.helpers.arrayElement(['Permanent', 'Outsource']),
        phone: faker.phone.number('971'+'#########'),
        email: faker.internet.email(employee_first_name, employee_last_name, 'example.gov.ae'),
        address: faker.address.streetAddress(),
        city,
        bank_account_number: faker.finance.iban(false, 'AE'),
        bank_name: faker.helpers.arrayElement(['ABCD', 'HSBC', 'AIB', 'NBD']),
        supervisor_employee_id: '',
        supervisor_name_en: '',
        supervisor_name_ar: '',
        entity_id: 'ADTEST-00001',
        entity_name_en: 'ADTEST',
        entity_name_ar: '',
        sector_id: '',
        sector_name_en: '',
        sector_name_ar: '',
        division_id: '',
        division_name_en: '',
        division_name_ar: '',
        department_id,
        department_name_en,
        department_name_ar: '',
        section_id: '',
        section_name_en: '',
        section_name_ar: '',
        location: city,
        active_employee: 'Y',
        last_updated_date: faker.date.soon(100, hire_date)
    };
}

function createEmployees(size = 10) {
    const employees = []
    for (const x of Array(size).keys()) {
        employees.push(createRandomEmployee(x))
    }
    return employees
}

let employees = createEmployees(100)
let employees_json = JSON.stringify(employees)
fs.writeFileSync('employees.json', employees_json)