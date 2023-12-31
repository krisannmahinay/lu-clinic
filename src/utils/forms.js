
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
        label: `${bed.name} | ${bed.bed_group?.name} - ${bed.bed_group?.bed_floor?.floor}`
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

export const generateInfoForms = (formData, province, municipality, barangay) => {
    console.log(formData)
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
        {name: 'no_blk_lot', type: 'text', value: formData.no_blk_lot, label: 'No/Blk/Lot', placeholder: 'Type...'},
    ]
}

