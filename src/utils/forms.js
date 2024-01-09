
export const userRegistration = [
    {name: 'email', type: 'email', label: 'Email', placeholder: 'Enter email'},
    {name: 'password', type: 'password', label: 'Password', placeholder: 'Enter password'},
    {
        name: 'roles',
        type: 'dropdown',
        label: 'Roles',
        options: [
            {value: 'admin', label: 'Admin'},
            {value: 'nurse', label: 'Nurse'},
            {value: 'doctor', label: 'Doctor'}
        ]
    }
]

export const generateOpdForms = (physicianList) => {
    const phyisicianOptions = physicianList?.map(ph => ({
        value: ph.user_id,
        label: `Dr. ${ph.identity?.first_name} ${ph.identity?.last_name}`,
    }))

    return [
        {name: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Type...'},
        {name: 'first_name', type: 'text', label: 'Given Name', placeholder: 'Type...'},
        {name: 'middle_name', type: 'text', label: 'Middle Name', placeholder: 'Type...'},
        {name: 'birth_date', type: 'date', label: 'Birthdate'},
        {name: 'age', type: 'text', value: null, label: 'Age', disabled: true},
        {
            name: 'gender',
            type: 'dropdown',
            label: 'Gender',
            options: [
                {value: 'male', label: 'Male'},
                {value: 'female', label: 'Female'}
            ]
        },
        {
            name: 'admiting_physician',
            type: 'dropdown',
            label: 'Physician',
            options: phyisicianOptions
        },
        {name: 'standard_charge', type: 'text', value: null, label: 'Standard Charge', disabled: true}
    ]
}

export const generateIpdForms = (physicianList, activeBedList) => {
    const physicOptions = physicianList?.map(ph => ({
        value: ph.user_id,
        label: `Dr. ${ph.identity?.first_name} ${ph.identity?.last_name}`,
    }))

    const bedOptions = activeBedList?.map(bed => ({
        value: bed.id,
        label: `${bed.name} (${bed.bed_group?.name} : ${bed.bed_group?.bed_floor?.floor})`
    })) 

    return [
        {name: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Type...'},
        {name: 'first_name', type: 'text', label: 'Given Name', placeholder: 'Type...'},
        {name: 'middle_name', type: 'text', label: 'Middle Name', placeholder: 'Type...'},
        {
            name: 'bed', 
            type: 'dropdown', 
            label: 'Bed', 
            options: bedOptions, 
        },
        {name: 'birth_date', type: 'date', label: 'Birthdate'},
        {name: 'age', type: 'text', label: 'Age', disabled: true},
        {
            name: 'gender',
            type: 'dropdown',
            label: 'Gender',
            options: [
                {value: 'male', label: 'Male'},
                {value: 'female', label: 'Female'}
            ]
        },
        {
            name: 'admiting_physician',
            type: 'dropdown',
            label: 'Physician',
            options: physicOptions
        },
        {name: 'standard_charge', type: 'text', label: 'Standard Charge', disabled: true}
    ]
}

export const generateInfoForms = (formData, province, municipality, barangay, icd10code) => {
    const provOptions = province?.map(data => ({
        label: data.name,
        value: data.code
    })) 

    const brgyOptions = barangay?.map(data => ({
        label: data.name,
        value: data.code
    })) 

    const municipalOptions = municipality?.map(data => ({
        label: data.name,
        value: data.code
    })) 

    const icd10CodeOptions = icd10code?.map(data => ({
        label: `${icd.icd10_code} ${icd.icd10_desc}`,
        value: data.icd10_code
    })) 

    return [
        {name: 'last_name', type: 'text', value: formData.last_name, label: 'Last Name', placeholder: 'Type...'},
        {name: 'first_name', type: 'text', value: formData.first_name, label: 'Given Name', placeholder: 'Type...'},
        {name: 'middle_name', type: 'text', value: formData.middle_name, label: 'Middle Name', placeholder: 'Type...'},
        {name: 'email', type: 'email', value: formData.email, label: 'Email', placeholder: 'Type...'},
        {name: 'birth_date', type: 'date', value: formData.email, label: 'Birthdate'},
        {name: 'birth_place', type: 'text', value: formData.birth_place, label: 'Birth Place', placeholder: 'Type...'},
        {
            name: 'gender',
            type: 'dropdown',
            label: 'Gender',
            value: formData.gender,
            options: [
                {value: 'male', label: 'Male'},
                {value: 'female', label: 'Female'}
            ]
        },
        {
            name: 'civil_status',
            type: 'dropdown',
            label: 'Civil Status',
            value: formData.civil_status,
            options: [
                {value: "s", label: "Single"},
                {value: "m", label: "Married"},
                {value: "sep", label: "Separated"},
                {value: "w", label: "Widow"}
            ]
        },
        {name: 'contact_no', type: 'number', label: 'Contact No', value:formData.contact_no},
        {name: 'age', type: 'text', label: 'Age', disabled: true},
        {
            name: 'province',
            type: 'dropdown',
            label: 'Province',
            value: formData.province,
            options: provOptions
        },
        {
            name: 'municipality',
            type: 'dropdown',
            label: 'Municipality',
            value: formData.municipality,
            options: municipalOptions
        },
        {
            name: 'barangay',
            type: 'dropdown',
            label: 'Barangay',
            value: formData.barangay,
            options: brgyOptions
        },
        {name: 'street', type: 'text', value: formData.street, label: 'Street', placeholder: 'Type...'},
        {name: 'no_blk_lot', type: 'number', value: formData.no_blk_lot, label: 'No/Blk/Lot', placeholder: 'Type...'},
        {name: 'nationality', type: 'text', value: formData.nationality, label: 'Nationality', placeholder: 'Type...'},
        {name: 'religion', type: 'text', value: formData.religion, label: 'Religion', placeholder: 'Type...'},
        // employer details
        {name: 'occupation', type: 'text', value: formData.occupation, label: 'Occupation', placeholder: 'Type...'},
        {name: 'employer_name', type: 'text', value: formData.employer_name, label: 'Employer', placeholder: 'Type...'},
        {name: 'employer_address', type: 'text', value: formData.employer_address, label: 'Employer Address', placeholder: 'Type...'},
        {name: 'employer_contact', type: 'number', value: formData.contact, label: 'Employer Contact', placeholder: 'Type...'},
        // family details
        {name: 'father_name', type: 'text', value: formData.father_name, label: 'Father Name', placeholder: 'Type...'},
        {name: 'father_address', type: 'text', value: formData.father_address, label: 'Father Address', placeholder: 'Type...'},
        {name: 'father_contact', type: 'text', value: formData.father_address, label: 'Father Contact', placeholder: 'Type...'},
        {name: 'mother_name', type: 'text', value: formData.mother_name, label: 'Mother Name', placeholder: 'Type...'},
        {name: 'mother_address', type: 'text', value: formData.mother_address, label: 'Mother Address', placeholder: 'Type...'},
        {name: 'mother_contact', type: 'text', value: formData.mother_contact, label: 'Mother Contact', placeholder: 'Type...'},
        {name: 'spouse_name', type: 'text', value: formData.spouse_name, label: 'Spouse Name', placeholder: 'Type...'},
        {name: 'spouse_address', type: 'text', value: formData.spouse_address, label: 'Spouse Address', placeholder: 'Type...'},
        {name: 'spouse_contact', type: 'text', value: formData.spouse_contact, label: 'Spouse Contact', placeholder: 'Type...'},

        // patient details
        {name: 'admission_date', type: 'date', value: formData.admission_date, label: 'Admission Date | Time'},
        {name: 'discharge_date', type: 'date', value: formData.discharge_date, label: 'Discharge Date | Time'},
        {name: 'total_no_day', type: 'text', value: formData.total_no_day, label: 'Total No of Day', disabled: true},
        {name: 'admitting_physician', type: 'text', value: formData.admitting_physician, label: 'Admitting Physician', disabled: true},
        {name: 'admitting_clerk', type: 'text', value: formData.admitting_clerk, label: 'Admitting Clerk', disabled: true},
        {name: 'type_visit', type: 'text', value: formData.type_visit, label: 'Type of Admission', disabled: true},
        {name: 'referred_by', type: 'text', value: formData.referred_by, label: 'Referred By (Physician/Health Facility)', placeholder: 'Type...'},
        {name: 'soc_serv_classification', type: 'checkbox', category: 'socserv', value: formData.soc_serv_classification, label: 'Social Service Classification'},
        {name: 'allergic_to', type: 'text', value: formData.allergic_to, label: 'Allergic To', placeholder: 'Type..'},
        {name: 'hospitalization_plan', type: 'text', value: formData.hospitalization_plan, label: 'Hospitalization Plan', placeholder: 'Type..'},
        {name: 'health_insurance_name', type: 'text', value: formData.health_insurance_name, label: 'Health Insurance Name', placeholder: 'Type..'},
        {name: 'phic', type: 'checkbox', category: 'phic', value: formData.phic, label: 'PHIC'},
        {name: 'data_furnished_by', type: 'text', value: formData.data_furnished_by, label: 'Data Furnished By', disabled: true},
        {name: 'address_of_informant', type: 'text', value: formData.address_of_informant, label: 'Address of Informant', placeholder: 'Type..'},
        {name: 'relation_to_patient', type: 'text', value: formData.relation_to_patient, label: 'Relation to Patient', placeholder: 'Type..'},

        // other patient details
        {name: 'admission_diagnosis', type: 'textarea', value: formData.admission_diagnosis, label: 'Admission Diagnosis', placeholder: 'Type...'},
        {name: 'discharge_diagnosis', type: 'textarea', value: formData.discharge_diagnosis, label: 'Discharge Diagnosis', placeholder: 'Type Principal Diagnosis/Other Diagnosis'},
        {name: 'principal_opt_proc', type: 'textarea', value: formData.principal_opt_proc, label: 'Principal Operation/Procedures', placeholder: 'Type...'},
        {name: 'other_opt_proc', type: 'textarea', value: formData.other_opt_proc, label: 'Other Operation/Procedures', placeholder: 'Type...'},
        {name: 'accident_injury_poison', type: 'textarea', value: formData.accident_injury_poison, label: 'Accident/Injuries/Poisoning', placeholder: 'Type...'},
        {
            name: 'icdo10_code',
            type: 'dropdown',
            label: 'ICD/RUV CODE',
            value: formData.icd10_code,
            options: icd10CodeOptions
        },
        {name: 'disposition', type: 'checkbox', category: 'disposition', value: formData.disposition, label: 'Disposition'},
    ]
}