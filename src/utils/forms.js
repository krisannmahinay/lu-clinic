
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
            options: phyisicianOptions
        },
        {name: 'standard_charge', type: 'text', label: 'Standard Charge', disabled: true}
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

