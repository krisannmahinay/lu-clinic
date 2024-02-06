import { useRouter } from 'next/router'
import React, { 
    useImperativeHandle, 
    forwardRef, 
    useEffect, 
    useState, 
    useCallback, 
    useMemo, 
    useRef, 
    useContext,
    memo
} from 'react'
import { 
    useCreateUserBatchMutation, 
    useCreateBulkMutation 
} from '@/service/settingService'
import { useGetPhysicianChargeQuery } from '@/service/patientService'
import Select from 'react-select'
import Modal from './Modal'
import { useComponentContext, useFormContext, useModalContext } from '@/utils/context'
import { generateInfoForms } from '@/utils/forms'


const styleDropdown = {
    control: (provided) => ({
        ...provided,
        // border: '1px solid gray',
        margin: 0,
        padding: 0,
        boxShadow: 'none',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        backgroundColor: 'rgb(243 244 246)',
        '&:hover': {
          borderColor: 'gray',
          border: '1px solid gray'
        },
        '&:focus': {
            border: 'none'
        }
      }),
      input: (provided) => ({
        ...provided,
        inputOutline: 'none',
      }),
}

const dispositionArray = [
    { name: 'improved', label: 'Improved'},
    { name: 'unimproved', label: 'Unimproved'},
    { name: 'transferred', label: 'Transferred'},
    { name: 'hama', label: 'HAMA'},
    { name: 'absconded', label: 'Absconded'},
    { name: 'expired', label: 'Expired'},
    { name: 'u48h', label: 'under 48 hours', parent: 'expired'},
    { name: 'm48h', label: 'more than 48 hours', parent: 'expired'}
]

const Form = forwardRef(({
        onClickFAB,
        initialFields = [], 
        loginBtn,
        onFormChange,
        onSuccess, 
        onCloseSlider,
        onSetAlertMessage,
        onSetAlertType,
        onLoading,
        enableAutoSave,
        enableAddRow,
        onEditForm,
        onClick,
        style
    }, ref) => {

    const modalContext = useModalContext()
    const context = useFormContext()
    const componentContext = useComponentContext()
    const router = useRouter()
    const [formData, setFormData] = useState([])
    const [idCounter, setIdCounter] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [updatedFormData, setUpdatedFormData] = useState([])
    
    const [alertType, setAlertType] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState([])
    const [resetFormTimer, setResetFormTimer] = useState(false)

    const [physicianChargeId, setPhysicianChargeId] = useState(0)
    
    const [createBulk, { 
        isLoading: createBulkLoading, 
        isError, 
        error, 
        isSuccess: createUserSuccess 
    }] = useCreateBulkMutation()

    const { data: physicianChargeMaster } = useGetPhysicianChargeQuery()

    // console.log(modalContext?.state?.profileData.patient_id)

    useImperativeHandle(context?.ref, () => ({
        handleSubmit: (actionType) => handleSubmit(actionType),
        handleAddRow
    }))

    const handleGetValueField = (field, contextData) => {
        const value = context?.initialFields?.find((f) => f.name === field.name)?.value ||
        field.name in contextData?.user_data_info
            ? context?.data?.user_data_info?.[field.name]
            // : field.name === 'last_name' ? contextData?.last_name
            : field.name === 'admission_date' ? contextData?.admission_date
            : field.name === 'discharge_date' ? contextData?.discharge_date
            : field.name === 'total_no_day' ? contextData?.total_no_day
            : field.name === 'admitting_physician' ? `Dr. ${contextData?.physician_data_info?.first_name} ${contextData?.physician_data_info?.last_name}`
            : field.name === 'province' ? contextData?.user_data_info?.province || processFormData?.find((f) => f.name === field.name)?.value
            : '' 
        console.log(contextData?.last_name)
        return value
    }
    
    const formFields = useMemo(
        () => {
            const fields = context?.data ? generateInfoForms(context?.data, context?.provinceData, context?.municipalityData, context?.barangayData) : []
            return fields.map((field) => ({
                ...field,
                value: handleGetValueField(field, context?.data)
            }))
        }, [context?.data, context?.provinceData, context?.municipalityData, context?.barangayData, context?.initialFields]
    ) 

    useEffect(() => {
        const initialFields = formFields.length > 0
            ? formFields.map((field) => {
                return field
            })
            : context?.initialFields?.reduce((acc, field) => ({
                ...acc, [field.name]: ''  
            }), {})

        
        setFormData([{
            id: '_' + Date.now() + Math.random(), 
            patientId: modalContext?.state?.profileData.patient_id || '',
            fields: initialFields
        }])

        let timer
        if(resetFormTimer) {
            timer = setTimeout(() => {
                context?.onCloseSlider?.()
                handleResetForm()
                setResetFormTimer(false)
            }, 500)
        }

        return () => {
            if(timer) {
                clearTimeout(timer)
            }
        }
    }, [formFields, resetFormTimer, context?.data])

    const processFormData = useMemo(() => {
        const updatedFields = formData.flatMap((row) =>
            row.fields && Array.isArray(row.fields)
                ? row.fields.map(({ name, value }) => ({ name, value }))
                : [] 
        )
        
        return updatedFields
    },[formData])

    
    // console.log(formData)

    // const memoizedSelectValue = useMemo(() => {
    //     return (field, row) => {
    //         if(field.options) {
    //             return field.options.find(option =>
    //                 option.value === processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]
    //             )
    //         }
    //     }
    // }, [processFormData])

    // const handleSelectValue = memoizedSelectValue

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

    const calculateBMI = (ht, wt) => {
        if (ht && wt) {
            const heightInMeters = ht / 100 // assuming height is in centimeters
            const computedBMI = wt / (heightInMeters * heightInMeters)
            return computedBMI.toFixed(2)
        } else {
            return null
        }
    }
    
    // console.log(formData)

    const handleInputChange = useCallback((e, rowIndex, fieldName) => {
        setFormData((prev) => {
            const updatedRow = { ...prev[rowIndex] }
            const updatedFields = { ...updatedRow.fields }
            if(fieldName === 'birth_date') {
                const age = calculatedAge(e.target.value)
                updatedFields.age = age
                updatedFields.birth_date = e.target.value
            } else if(fieldName === 'vs_height' || fieldName === 'vs_weight') {
                const ht = updatedFields.vs_height || ''
                const wt = updatedFields.vs_weight || ''
                const calculatedBMI = calculateBMI(ht, wt)
                updatedFields.vs_bmi = calculatedBMI || ''
                updatedFields[fieldName] = e.target.value
            } else if(fieldName === 'admitting_physician') {
                updatedFields[fieldName] = e?.value
                updatedFields.standard_charge = physicianChargeMaster?.find((charge) => charge.doctor_id === e?.value)?.standard_charge
            } else if (['gender', 'roles', 'bed', 'bed_type', 'bed_group', 'bed_floor', 'charge_type', 'charge_category', 'doctor_opd'].includes(fieldName)) {
                updatedFields[fieldName] = e?.value
            } else if(fieldName === 'province') {
                updatedFields.province = e?.value
                context?.onSelectedProvince(e?.value)
            } else if(fieldName === 'municipality') {
                updatedFields.municipality = e?.value
                context?.onSelectedMunicipality(e?.value)
            } else if(fieldName === 'barangay') {
                updatedFields.barangay = e?.value
            } else {
                const { value, type, checked } = e?.target
                const fieldValue = type === 'checkbox' ? checked : value
                updatedFields[fieldName] = fieldValue
            }
            updatedRow.fields = updatedFields
            return [
                ...prev.slice(0, rowIndex),
                updatedRow,
                ...prev.slice(rowIndex + 1)
            ]
        })
    }, [physicianChargeMaster])
 
    const handleResetForm = () => {
        setFormData([{ 
            id: '_' + Date.now() + Math.random(), 
            fields: context?.initialFields.reduce((acc, field) => ({ 
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
        const newRow = { ...context?.initialFields[0], id: idCounter }
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
    
    const handleSubmit = (actionType) => {
        createBulk({actionType: actionType, data: formData})
            .unwrap()
            .then(response => {
                if(response.status === "success") {
                    context.onLoading(true)
                    setResetFormTimer(true)
                    context.onSuccess(1)
                }
            })
            .catch(error => {
                if(error.status === 500) {
                    console.log(error)
                    context?.onAlert({msg: "Unsuccessfull", type: "error"})
                    // onSetAlertType("error")
                    // onSetAlertMessage("Unsuccessful")
                    // setAlertMessage("Unsuccessful")
                    // setAlertOpen(true)
                }
            })
    }

     const handleOnClick = (data) => {
        if(data.action === 'clickedFas') {
            onClick()
        } else if(data.action === 'clickedModal') {
            setModalOpen(true)
            context?.onModalOpen(data)
        } else {

        }
     }

     const renderForm = (row, rowIndex) => {
        return context?.initialFields?.map((field, index) => (
            <div key={field.name}>
                {field.name === "last_name" && (
                    <div>
                        <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">Person Details</h3>
                        <hr className="drop-shadow-md pb-5"/>
                    </div>
                )}

                {field.name === "admission_date" && (
                    <div>
                        <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">Patient Information</h3>
                        <hr className="drop-shadow-md py-6"/>
                    </div>
                )}

                {field.name === "soap_subj_symptoms" && field.category === 'with_modal' && (
                    <div>
                        <div className="flex justify-center gap-4 py-6">
                            <div className="pt-2"><h3 className="text-gray-400 text-center font-bold uppercase text-medium">Doctor's Notes</h3></div>
                            <div>
                                <button onClick={() => handleOnClick({action:'clickedFas'})} title="Doctor Request's" className="fixed p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg focus:outline-none">
                                    <svg fill="#ffffff" height={20} width={20} version="1.1" id="Capa_1" viewBox="0 0 201.324 201.324" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" stroke="#ffffff">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.805296"></g>
                                        <g id="SVGRepo_iconCarrier"> <circle cx="95.596" cy="10.083" r="10.083"></circle> <circle cx="149.018" cy="10.083" r="10.083"></circle> 
                                            <path d="M179.06,19.254c-5.123-8.873-14.298-14.17-24.544-14.17v10c6.631,0,12.568,3.428,15.884,9.17 c3.316,5.743,3.316,12.599,0.001,18.342l-32.122,55.636c-3.315,5.742-9.253,9.17-15.884,9.171c-6.631,0-12.569-3.428-15.885-9.171 L74.389,42.595c-3.315-5.742-3.315-12.599,0-18.341s9.254-9.171,15.885-9.171v-10c-10.246,0-19.422,5.297-24.545,14.171 s-5.123,19.468,0,28.341l32.121,55.636c4.272,7.399,11.366,12.299,19.545,13.727v26.832c0,26.211-15.473,47.535-34.492,47.535 c-19.019,0-34.491-21.324-34.491-47.535v-31.948C59.802,109.52,68.4,99.424,68.4,87.356c0-13.779-11.21-24.989-24.989-24.989 s-24.989,11.21-24.989,24.989c0,12.067,8.598,22.163,19.989,24.486v31.948c0,31.725,19.959,57.535,44.492,57.535 c24.532,0,44.491-25.81,44.491-57.535v-26.832c8.178-1.428,15.273-6.328,19.544-13.727l32.122-55.636 C184.184,38.722,184.184,28.127,179.06,19.254z">

                                            </path> 
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <hr className="drop-shadow-md py-6"/>
                    </div>
                )}

                {field.type === "text" && !field.disabled && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className=" text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>
                        <div className="w-3/5">
                            <input
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                onClick={field.category === 'with_modal' ? () => handleOnClick({action:'clickedModal', field:field, modalState: true}) : undefined}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder={field.placeholder}
                            />
                        </div>
                    </div>
                )}

                {field.type === "text" && field.disabled && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>
                        
                        <div className="w-3/5">
                            <input
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                className=" bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                placeholder={field.placeholder}
                                disabled
                            />
                        </div>
                    </div>
                )}

                {field.type === 'datetime-local' && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>
                        
                        <div className="w-3/5">
                            <input
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                className=" border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder={field.placeholder}
                            />
                        </div>
                    </div>
                )}

                {field.type === "password" && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>
                        
                        <div className="w-3/5">
                            <input
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder={field.placeholder}
                            />
                        </div>
                    </div>
                )}

                {field.type === 'email' && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>

                        <div className="w-3/5">
                            <input
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder={field.placeholder}
                            />
                        </div>
                    </div>
                )}

                {field.type === 'date' && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>

                        <div className="w-3/5">
                            <input
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none"
                                placeholder={field.placeholder}
                            />
                        </div>
                    </div>
                )}

                {field.type === 'checkbox' && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>

                        <div className="w-3/5">
                            {field.category === 'socserv' ? (
                                <div  className="flex flex-row mt-2 space-x-3">
                                {['a', 'b', 'c1', 'c2', 'c3', 'd'].map(service => (
                                    <div className="flex items-center space-x-1">
                                        <input
                                            key={service}
                                            type={field.type}
                                            id={field.name}
                                            name={field.name}
                                            // checked={}
                                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                            className="w-5 h-5"
                                            placeholder={field.placeholder}
                                            />
                                        <label className="text-gray-500 font-bold text-xs">{service.toUpperCase()}</label>  
                                    </div>
                                ))}
                                </div>
                            ) : field.category === 'phic' ? (
                                <div  className="flex flex-row mt-2 space-x-3">
                                {['sss', 'sss_dependent', 'gsis', 'gsis_dependent'].map(service => (
                                    <div className="flex items-center space-x-1">
                                        <input
                                            key={service}
                                            type={field.type}
                                            id={field.name}
                                            name={field.name}
                                            // checked={}
                                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                            className="w-5 h-5"
                                            placeholder={field.placeholder}
                                            />
                                        <label className="text-gray-500 font-bold text-xs">{service.toUpperCase()}</label>  
                                    </div>
                                ))}
                                </div>
                            ) : field.category === 'disposition'  ? (
                                <div  className="flex flex-row mt-2 space-x-3">
                                    {dispositionArray.map(dispo => (
                                        <div key={dispo} className={`flex items-center space-x-1 ${dispo.parent ? "ml-16" : ""}`}>
                                            {(!dispo.parent || field.value === dispo.parent) && (
                                                <>
                                                    <input
                                                        type={field.type}
                                                        id={field.name}
                                                        name={field.name}
                                                        checked={field.value === dispo.name}
                                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                                        className="w-5 h-5"
                                                        />
                                                    <label className="text-gray-500 font-bold text-xs">{dispo.label}</label>
                                                </>
                                            )} 
                                        </div>
                                    ))}
                                </div>
                            ) : ( "" )}
                        </div>
                    </div>
                )}

                {field.type === 'number' && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">
                                {field.label}
                            </label>
                        </div>
                        <div className="w-3/5">
                            <input
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder={field.placeholder}
                            />
                        </div>
                    </div>
                )}

                {field.type === 'dropdown' && (
                    <div className="flex flex-row items-center z-50">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">{field.label}:</label>
                        </div>
                        <div className="w-3/5">
                            <Select 
                                options={field.options?.map(option => ({ 
                                    value: option.value,    
                                    label: option.label,
                                    isDisabled: option.isDisabled
                                }))}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                isSearchable={true}
                                isClearable={true}
                                placeholder={`Select ${field.label.toLowerCase()}...`}
                                classNamePrefix=""
                                styles={styleDropdown}
                                value={field.options?.find(option => 
                                    option.value === processFormData?.find((f) => f.name === field.name)?.value
                                )}
                                getOptionLabel={(option) => (
                                    <div className="">
                                        {option.isDisabled ? (
                                            <p className="text-sm text-red-500 cursor-not-allowed ">{option.label} (not available)</p>
                                        ) : (
                                            option.label
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}

                {field.type === 'textarea' && (
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4">
                            <label htmlFor={field.name} className="block text-gray-500 font-medium text-sm capitalize">{field.label}:</label>
                        </div>
                        <div className="w-3/5">
                            <textarea
                                required
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={processFormData?.find((f) => f.name === field.name)?.value || row.fields[field.name]}
                                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                                placeholder={field.placeholder}
                            />
                        </div>
                    </div>
                )}
            </div>
        ))
     }
 
     return (
         <>
         
         {/* <div className={`fixed inset-0 p-4 h-dvh w-full bg-black opacity-50 transition-opacity ${modalOpen ? 'visible' : 'hidden'}`}></div>
         <Modal
            isOpen={modalOpen} 
         /> */}
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
                     {formData?.map((row, rowIndex) => (
                        <div>
                            <div className={`${context.enableAddRow ? 'bg-white border border-gray-300 rounded py-5' : ''}`}>
                                <div key={row.id} className="flex gap-4">
                                    <div className="md:flex md:flex-col  w-full gap-4">
                                        {context.title !== undefined ? (
                                            <div>
                                                <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-3">{context.title}</h3>
                                                <hr className="drop-shadow-md pb-5"/>
                                            </div>
                                        ) : ""}
                                        {renderForm(row, rowIndex)}
                                    </div>

                                    {formData?.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRow(rowIndex)}
                                            className="static w-10  hover:bg-gray-200 rounded-md px-2 py-40 focus:outline-none text-[#cb4949] "
                                        >
                                            <svg fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </div> 
                                
                            </div>
                            <br/>
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