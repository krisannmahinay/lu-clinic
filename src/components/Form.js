import React, { useImperativeHandle, forwardRef, useEffect, useState } from 'react'
import { useCreateUserBatchMutation } from '@/service/settingService'
import Alert from "./Alert"

const Form = forwardRef(({
        initialFields = [], 
        loginBtn,
        onSuccess, 
        onCloseSlider,
        onSetAlertMessage,
        onSetAlertType,
        onLoading
    }, ref) => {
     const [formData, setFormData] = useState([])
     const [idCounter, setIdCounter] = useState(0)
     
     const [alertType, setAlertType] = useState("")
     const [alertOpen, setAlertOpen] = useState(false)
     const [alertMessage, setAlertMessage] = useState([])
     const [resetFormTimer, setResetFormTimer] = useState(false)
     const [createUserBatch, { isLoading: createUserLoading, isError, error, isSuccess: createUserSuccess }] = useCreateUserBatchMutation()


    useImperativeHandle(ref, () => ({
        handleSubmit,
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
                onCloseSlider(),
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
 
     const handleInputChange = (e, rowIndex, fieldName) => {
         const { value, type, checked } = e.target
         const fieldValue = type === 'checkbox' ? checked : value
         setFormData((prev) =>
             prev.map((row, index) =>
                 index === rowIndex ? { ...row, fields: {...row.fields, [fieldName]: fieldValue }} : row 
             )
         )
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

     const handleSubmit = () => {
        //  e.preventDefault()
        createUserBatch(formData)
            .unwrap()
            .then(response => {
                if(response.status === "success") {
                    onLoading(true)
                    setResetFormTimer(true)
                    onSuccess(1)
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
             <div key={field.name} className="w-full mb-4">
                 {field.type === "text" && (
                     <>
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
                     </>
                 )}
 
                 {field.type === "password" && (
                     <>
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
                     </>
                 )}
 
 
                 {field.type === 'email' && (
                     <>
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
                     </>
                 )}
 
                 {field.type === 'dropdown' && (
                     <>
                         <label htmlFor={field.name} className="block text-gray-500 font-bold text-xs mb-2 uppercase">{field.label}:</label>
                         <select
                             name={field.name}
                             value={row.fields[field.name]}
                             onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                             className="border border-gray-300 text-sm w-full px-3 py-1 focus:outline-none"
                         >
                             <option value="">Select option</option>
                             {field.options.map((option) => (
                                 <option key={option.value} value={option.value}>
                                     {option.label}
                                 </option>
                             ))}
                         </select>
                     </>
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
                             <div key={row.id} className="flex gap-2 justify-between">
                                 {renderForm(row, rowIndex)}
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