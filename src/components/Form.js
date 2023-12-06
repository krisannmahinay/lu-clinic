import { useRouter } from 'next/router'
import React, { useImperativeHandle, forwardRef, useEffect, useState } from 'react'
import { useCreateUserBatchMutation, useCreateBulkMutation } from '@/service/settingService'
import { useGetPhysicianChargeQuery } from '@/service/patientService'
import Select from 'react-select'

import Alert from "./Alert"

const styleDropdown = {
    control: (provided) => ({
        ...provided,
        // border: '1px solid gray',
        padding: '0.1em',
        boxShadow: 'none',
        '&:hover': {
          borderColor: 'gray',
          border: '1px solid gray'
        },
      }),
      input: (provided) => ({
        ...provided,
        inputOutline: 'none',
      }),
}

const Form = forwardRef(({
        initialFields = [], 
        loginBtn,
        onSuccess, 
        onCloseSlider,
        onSetAlertMessage,
        onSetAlertType,
        onLoading
    }, ref) => {
    const router = useRouter()
    const [formData, setFormData] = useState([])
    const [idCounter, setIdCounter] = useState(0)
    
    const [alertType, setAlertType] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState([])
    const [resetFormTimer, setResetFormTimer] = useState(false)

    const [physicianChargeId, setPhysicianChargeId] = useState(0)

    // const [createUserBatch, { 
    //     isLoading: createUserLoading, 
    //     isError, 
    //     error, 
    //     isSuccess: createUserSuccess 
    // }] = useCreateUserBatchMutation()

    const [createBulk, { 
        isLoading: createBulkLoading, 
        isError, 
        error, 
        isSuccess: createUserSuccess 
    }] = useCreateBulkMutation()

    const { data: physicianChargeMaster } = useGetPhysicianChargeQuery()

    // console.log(physicianChargeMaster[0].standard_charge)
    
    useImperativeHandle(ref, () => ({
        handleSubmit: (actionType) => handleSubmit(actionType),
        handleAddRow
    }));
 
     useEffect(() => {
        setFormData([{ 
            id: '_' + Date.now() + Math.random(), 
            fields: initialFields.reduce((acc, field) => ({ 
                ...acc, [field.name]: '' 
            }), { }) 
        }])

        let timer
        if(resetFormTimer) {
            timer = setTimeout(() => {
                onCloseSlider()
                handleResetForm()
                setResetFormTimer(false)
            }, 500)
        }

        return () => {
            if(timer) {
                clearTimeout(timer)
            }
        }
     }, [initialFields, resetFormTimer])


    const calculatedAge = (birthdate) => {
        const birthDate = new Date(birthdate)
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }
    
    
    // console.log(formData)
     const handleInputChange = (e, rowIndex, fieldName) => {
         if(fieldName === 'birth_date') {
            const age = calculatedAge(e.target.value)
            setFormData((prev) =>
                prev.map((row, index) =>
                    index === rowIndex ? { ...row, fields: {
                            ...row.fields,
                            age: age,
                            birth_date: e.target.value
                        }
                    } : row
                ) 
            )
         } else if(fieldName === 'admiting_physician') {
            if(physicianChargeMaster) {
                setFormData((prev) =>
                    prev.map((row, index) =>
                        index === rowIndex ? { ...row, fields: {
                                ...row.fields,
                                standard_charge: physicianChargeMaster?.find(
                                    charge => charge.doctor_id === e?.value
                                )?.standard_charge
                            }
                        } : row 
                    ) 
                )
            }
         } else if([
                'gender',
                'roles',
                'bed_type',
                'bed_group',
                'bed_floor',
                'charge_type',
                'charge_category',
                'doctor_opd'
            ].includes(fieldName)) {
            setFormData((prev) =>
                prev.map((row, index) =>
                    index === rowIndex ? { ...row, fields: {
                            ...row.fields,
                            [fieldName]: e?.value,
                        }
                    } : row
                ) 
            )
         } else {
             const { value, type, checked } = e.target
             const fieldValue = type === 'checkbox' ? checked : value
             setFormData((prev) =>
                 prev.map((row, index) =>
                     index === rowIndex ? { 
                        ...row, 
                        fields: {
                            ...row.fields,
                            [fieldName]: fieldValue 
                        }
                    } : row 
                 )
             )
         }
     }
 
     const handleResetForm = () => {
        setFormData([{ 
            id: '_' + Date.now() + Math.random(), 
            fields: initialFields.reduce((acc, field) => ({ 
                ...acc, [field.name]: '' 
            }), { }) 
        }])
     }

     const handleAlertClose = () => {
         setAlertType("")
         setAlertMessage([])
         setAlertOpen(false)
     }
 
     const handleAddRow = () => {
         const newRow = { ...initialFields[0], id: idCounter }
         setFormData((prev) => [
             ...prev, 
             { id: idCounter + 1, fields: []}
         ])
         setIdCounter((prevCount) => prevCount + 1)
     }
 
     const handleRemoveRow = (rowIndex) => {
         setFormData((prev) => 
             prev.filter((_, index) => index !== rowIndex))
     }

    //  const handleSubmit = () => {
    //     createUserBatch(formData)
    //         .unwrap()
    //         .then(response => {
    //             if(response.status === "success") {
    //                 onLoading(true)
    //                 setResetFormTimer(true)
    //                 onSuccess(1)
    //                 // onSetAlertType("success")
    //                 // onSetAlertMessage(response.message)
    //                 // setAlertMessage(response.message)
    //                 // setAlertOpen(true)
    //             }
    //         })
    //         .catch(error => {
    //         //  console.log(error)
    //             if(error.status === 500) {
    //                 onSetAlertType("error")
    //                 onSetAlertMessage("Unsuccessful")
    //                 setAlertMessage("Unsuccessful")
    //                 setAlertOpen(true)
    //             }
    //         })
    //  }

    //  console.log(formData)
     const handleSubmit = (actionType) => {
        createBulk({actionType: actionType, data: formData})
            .unwrap()
            .then(response => {
                if(response.status === "success") {
                    onLoading(true)
                    setResetFormTimer(true)
                    onSuccess(1)
                    // router.push('/exam')
                    // router.push()
                    // onSetAlertType("success")
                    // onSetAlertMessage(response.message)
                    // setAlertMessage(response.message)
                    // setAlertOpen(true)
                }
            })
            .catch(error => {
            //  console.log(error)
                if(error.status === 500) {
                    onSetAlertType("error")
                    onSetAlertMessage("Unsuccessful")
                    setAlertMessage("Unsuccessful")
                    setAlertOpen(true)
                }
            })
     }
 
     const renderForm = (row, rowIndex) => {
         return initialFields.map((field) => (
             <div key={field.name}>
                {field.type === "text" && !field.disabled && (
                    <div>
                        <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">
                            {field.label}
                        </label>
                        <input
                            required
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-1 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </div>
                )}

                {field.type === "text" && field.disabled && (
                    <div>
                        <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">
                            {field.label}
                        </label>
                        <input
                            required
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border-none bg-gray-200 px-3 py-1 focus:outline-none w-full"
                            placeholder={field.placeholder}
                        />
                    </div>
                )}

                {field.type === "password" && (
                    <div>
                        <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">
                            {field.label}
                        </label>
                        <input
                            required
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300 text-sm w-full px-3 py-1 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </div>
                )}


                {field.type === 'email' && (
                    <div>
                        <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">
                            {field.label}
                        </label>
                        <input
                            required
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300 text-sm w-full px-3 py-1 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </div>
                )}

                {field.type === 'date' && (
                    <div>
                        <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">
                            {field.label}
                        </label>
                        <input
                            required
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300 text-sm w-full px-3 py-1 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </div>
                )}

                {field.type === 'number' && (
                    <div>
                        <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">
                            {field.label}
                        </label>
                        <input
                            required
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300 text-sm w-full px-3 py-1 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </div>
                )}

                {field.type === 'dropdown' && (
                    <div>
                        <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">{field.label}:</label>
                        <Select 
                            options={field.options?.map(option => ({ 
                                value: option.value, 
                                label: option.label 
                            }))}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            isSearchable={true}
                            isClearable={true}
                            placeholder={`Select ${field.label.toLowerCase()}...`}
                            classNamePrefix="react-select"
                            styles={styleDropdown}
                            value={field.options?.find(option => 
                                option.value === row.fields[field.name]
                            )}
                        />
                    </div>
                )}
             </div>
         ))
     }
 
     return (
         <>
         {/* {alertMessage &&
             <Alert 
                 alertType={alertType}
                 isOpen={alertType !== ""}
                 onClose={handleAlertClose}
                 message={alertMessage} 
             /> 
         } */}
         
             <div className="tab-content p-4">
                 <form onSubmit={handleSubmit}>
                 {/* <form> */}
                     {formData.map((row, rowIndex) => (
                             <div key={row.id} className="flex gap-4">
                                <div className="grid grid-cols-3 w-full gap-4">
                                    {renderForm(row, rowIndex)}
                                </div>
                                 {formData.length > 1 && (
                                     <button
                                         type="button"
                                         onClick={() => handleRemoveRow(rowIndex)}
                                         className="ml-2  text-[#cb4949] rounded-md px-2 py-1 focus:outline-none"
                                     >
                                         <svg fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                         </svg>
                                     </button>
                                 )}
                             </div>
                         ))}
 
                     {loginBtn && (
                         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                             Login
                         </button>
                     )}
                 </form>
             </div>
         </>
     )
})

export default Form