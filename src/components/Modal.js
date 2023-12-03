import React,{ 
    useImperativeHandle, 
    forwardRef, 
    useMemo, 
    useState, 
    useRef, 
    useEffect
} from "react"
import NavTab from "./NavTab"
import { useDispatch } from 'react-redux'
import { useRouter } from "next/router"
import Select from 'react-select'

import Form from "./Form"

import { 
    useGrantUserModuleMutation, 
    useGetUserByIdQuery
} from "@/service/authService"
import { authApi } from "@/service/authService"
import Timer from "./Timer"



const genderOPD = [
    {value: "male", label: "Male", },
    {value: "female", label: "Female"},
]

const physicianOPD = [
    {id: 1, physician_charge: 1000, user_id: "QOS-P2SXCL134", name: "Dr John Smith"},
    {id: 2, physician_charge: 1500, user_id: "QOS-P2SXCL135", name: "Dr John Doe"},
]

const ancillaryOPD = [
    {id:1, label: "None", value: "none"},
    {id:2, label: "ECG", value: "ecg"},
    {id:3, label: "X-RAY", value: "xray"},
    {id:4, label: "Ultrasound", value: "ultrasound"},
]

const dispositionOPD = [
    {id:1, label: "Admission", value: "admission"},
    {id:2, label: "Discharged", value: "discharged"},
]

// const bedGroup = [
//     {}
// ]

const bedType = [
    {id: 1, bed_type: "Ward"},
    {id: 2, bed_type: "Room"},
    {id: 3, bed_type: "Bed"}
]

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

const bedRoomData = [
    {id:1, type: "ward", roomNo: 2, description: "Wider room", status: "available"},
    {id:2, type: "ward", roomNo: 3, description: "Wider room with aircon", status: "available"},
    {id:3, type: "bed", roomNo: 1, description: "With more patients", status: "available"},
    {id:4, type: "bed", roomNo: 2, description: "Wider room with aircon", status: "available"},
    {id:5, type: "bed", roomNo: 3, description: "Wider bed with aircon", status: "available"},
    {id:6, type: "bed", roomNo: 4, description: "Wider bed ", status: "occupied"}
]

const labelCss = "ml-2 mb-2 text-gray-500 font-bold uppercase text-xs"

const Modal = ({
        data,
        isOpen, 
        onClose, 
        permission, 
        moduleData, 
        slug, 
        selectedRowId, 
        tabNumber, 
        onSuccess,
        openId,
        onSetAlertMessage,
        onSetAlertType,
        patientData,
        children,
        ...props
    }) => {
        
    const router = useRouter()
    const formRef = useRef(null)
    const dispatch = useDispatch()
    const [checkedItem, setCheckedItem] = useState([])
    const [activeTab, setActiveTab] = useState('tab1')
    const [navTab, setNavTab] = useState([])
    const [triggerSubmit, setTriggerSubmit] = useState(false)
    const [openModalId, setOpenModalId] = useState("")
    const [selectedType, setSelectedType] = useState(null)

    const [currentTime, setCurrentTime] = useState(new Date())
    const [savedDate, setSavedDate] = useState(null)
    const [savedTime, setSavedTime] = useState(null)

    const [formData, setFormData] = useState({
        last_name: "",
        first_name: "",
        middle_name: "",
        gender: "",
        physician: "",
        standard_charge: "",
        birthday: "",
        age: ""
    })
    
    // console.log(data)
    useEffect(() => {
        if(data) {
            setFormData({
                last_name: data?.patient_identity?.last_name || "",
                first_name: data?.patient_identity?.first_name || "",
                middle_name: data?.patient_identity?.middle_name || "",
                gender: data?.patient_identity?.gender || "",
                physician: data?.physician_identity?.user_id || "",
                standard_charge: "",
                birthday: data?.patient_identity?.birth_date || "",
                age: data?.patient_identity?.age || ""
            })
        }
    },[data])
    
    const [grantUserModule, { isLoading, isError, error, isSuccess }] = useGrantUserModuleMutation()
    const { data: userDetails, isError: dataError, refetch: refetchUserDetails } = useGetUserByIdQuery({
        user_id: openId
    })

    // console.log(moduleData)
    
    const groupModules = useMemo(() => {
        // return module
        //     ?.filter(module => (module.type === 'sub' || module.type === "") && module.grant?.menu_group)
        //     .reduce((groups, module) => {
        //         const { menu_group } = module.grant || {}
        //         if(!groups[menu_group]) {
        //             groups[menu_group] = []
        //         }
        //         if(module.type === "") {
        //             groups[menu_group].unshift(module)
        //         } else {
        //             groups[menu_group].push(module)
        //         }

        //         return groups
        //     }, {})
    }, [module])
        
    // const groupModules = module
    //     ?.filter(module => (module.type === 'sub' || module.type === "") && module.grant?.menu_group)
    //     .reduce((groups, module) => {
    //         const { menu_group } = module.grant || {}
    //         if(!groups[menu_group]) {
    //             groups[menu_group] = []
    //         }
    //         if(module.type === "") {
    //             groups[menu_group].unshift(module)
    //         } else {
    //             groups[menu_group].push(module)
    //         }

    //         return groups
    //     }, {})
        
    const handleCheckbox = (moduleId) => {
        const correspondingModule = Object.values(groupModules).flat().find(mod => mod.module_id === moduleId)
        const { menu_group } = correspondingModule.grant || {}
        
        setCheckedItem(prevItems => {
            // Make a copy of the current items
            const updatedItems = { ...prevItems }
            const currentGroupItems = updatedItems[menu_group] || []
            
            if (currentGroupItems.includes(moduleId)) {
                // If moduleId is already present, remove it
                updatedItems[menu_group] = currentGroupItems.filter(item => item !== moduleId)
            } else {
                // Add moduleId to the menu_group
                updatedItems[menu_group] = [...currentGroupItems, moduleId]
            }
    
            return updatedItems
        })
    }


    const handleRoomChange = (type) => {
        if (selectedType === type) {
            setSelectedType(null) // Uncheck if already checked
        } else {
            // const extractRm = bedRoomData.map
            setSelectedType(type)

        }
    }

    const handleSelectedType = () => {

    }

    const handleFieldChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData, 
            [name]: value
        }))
    }

    const handleGenderOPD = (selectedOption) => {
        setFormData({
            ...formData,
            gender: selectedOption?.value
        })
    }

    const handlePhysicianOPD = (selectedOption) => {
        setFormData({
            ...formData,
            physician: selectedOption?.label,
            standard_charge: selectedOption?.charge
        })
    }

    const handleBirthdateOPD = (e) => {
        const birth = new Date(e.target.value)
        const today = new Date()
        let calculatedAge = today.getFullYear() - birth.getFullYear() - (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0)

        setFormData({
            ...formData,
            birthday: birth,
            age: calculatedAge
        })
    }

    const handleDispositionOPD = () => {

    }

    const handleAncillaryOPD = () => {

    }
    
    const userData = userDetails?.user[0] ?? []
    
    // const excludeDashboard = ["dashboard"]
    // const dashboard = (groupModules?.dashboard || []).filter(module => !excludeDashboard.includes(module.module_id))
    
    // const excludePatient = ["dashboard", "patients"]
    // const patients = (groupModules?.patients || []).filter(module => !excludePatient.includes(module.module_id))
    // const excluceInventory = ["inventory"]
    // const inventory = (groupModules?.inventory || []).filter(module => !excluceInventory.includes(module.module_id))

    // const excludeSettings = ["dashboard", "inventory", "radiology", "panthology", "pharmacy", "settings", "patients"]
    // const settings = (groupModules?.settings || []).filter(module => !excludeSettings.includes(module.module_id))

    const handleCheckedData = (data) => {
        setNavTab(data)
    }

    const handleClose = () => {
        onClose()
        setCheckedItem([])
        setFormData({})
        // dispatch(authApi.util.invalidateTags([{ type: 'UserDetails', id: 'LIST' }]));
    }

    const handleCloseModal = (data) => {
        data !== null && (
            handleClose(),
            onSetAlertType(data)
        )
    }

    const moduleClose = () => {
        onClose()
    }

    const renderUpdateForm = () => {
        
    }

    const handleSave = () => {
        // e.preventDefault()
        if(slug === "out-patient") {
            console.log(formData)
        }
        
        if(groupModules) {
        //     grantUserModule({checkedItem, identity_id:selectedRowId})
        //     .unwrap()
        //     .then(response => {
        //         if(response.status === "success") {
        //             onSetAlertType("success")
        //             onSetAlertMessage(response.message)
        //             setAlertOpen(true)
        //             setFormData([])
        //             moduleClose()
        //         }
        //     })
        //     .catch(error => {
        //         // console.log(error)
        //         if(error.status === 500) {
        //             onSetAlertType("error")
        //             onSetAlertMessage("Unsuccessful")
        //             setAlertOpen(true)
        //         }
        //     })
        }

        if(slug === "settings") {
            formRef.current.handleSubmit()
        }
    }

    return (
        <div className={`fixed inset-0 flex top-0 p-4 items-center justify-center z-50 ${isOpen ? 'visible': 'hidden'}`}>
            <div className={`fixed inset-0 top- p-4 bg-black opacity-50 transition-opacity ${isOpen ? 'visible' : 'hidden'}`}></div>
            <div className={`bg-white p-6 rounded shadow-md z-50 transition-opacity ${isOpen ? 'visible' : 'hidden'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold"></h2>
                    {/* <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12">
                            </path>
                        </svg>
                    </button> */}
                </div>
                <div className="w-full">
                
                {groupModules && (
                    <>
                        {/* <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Dashboard
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Inventory
                                    </button>
                                    {userData.roles === "x" && (
                                        <button 
                                            onClick={() => setActiveTab('tab3')}
                                            className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Settings
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>Patients
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                            {dashboard.map((item) => (
                                                <li key={item.module_id}>
                                                    <div className="flex items-center space-x-3 p-2 ">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-4 h-4"
                                                            name={`grant_${item.module_id}`}
                                                            value={item.module_id}
                                                            checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                            onChange={() => handleCheckbox(item.module_id)}
                                                        />
                                                        <p className="text-medium text-gray-500">{item.name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                            {inventory.map((item) => (
                                                
                                                <li key={item.module_id}>
                                                    <div className="flex items-center space-x-3 p-2  ">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-4 h-4"
                                                            name={`grant_${item.module_id}`}
                                                            value={item.module_id}
                                                            checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                            onChange={() => handleCheckbox(item.module_id)}
                                                        />
                                                        <p className="text-medium text-gray-500">{item.name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {activeTab === 'tab3' && (
                                        <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                            {settings.map((item) => (
                                                
                                                <li key={item.module_id}>
                                                    <div className="flex items-center space-x-3 p-2 ">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-4 h-4"
                                                            name={`grant_${item.module_id}`}
                                                            value={item.module_id}
                                                            
                                                            checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                            onChange={() => handleCheckbox(item.module_id)}
                                                        />
                                                        <p className="text-medium text-gray-500">{item.name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {activeTab === 'tab4' && (
                                        <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                            {patients.map((item) => (
                                                
                                                <li key={item.module_id}>
                                                    <div className="flex items-center space-x-3 p-2 ">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-4 h-4"
                                                            name={`grant_${item.module_id}`}
                                                            value={item.module_id}
                                                            checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                            onChange={() => handleCheckbox(item.module_id)}
                                                        />
                                                        <p className="text-medium text-gray-500">{item.name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div> */}
                    </>
                )}

                {slug === 'pharmacy' && (
                    tabNumber === 'tab1' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Category Name</label>
                                    <input type="text" placeholder="Enter symptoms" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab2' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Supplier Name</label>
                                    <input type="text" placeholder="Enter supplier name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Supplier Contact</label>
                                    <input type="text" placeholder="Enter supplier contact" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Contact Person Name</label>
                                    <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Contact Person Phone</label>
                                    <input type="text" placeholder="Enter person contact" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Address</label>
                                    <input type="text" placeholder="Enter address" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    )  : null
                )}

                {slug === 'settings' && (
                    <div className="max-h-[40vh] overflow-y-auto scroll-custom">
                        <Form 
                            ref={formRef} 
                            initialFields={props.initialFields}
                            addUserBtn={props.addUserBtn}
                            onSuccess={props.handleRefetch}
                            onSetAlertMessage={onSetAlertMessage}
                            onSetAlertType={(data) => handleCloseModal(data)}
                        />
                    </div>
                )}

                {slug === 'out-patient' && (
                    <div className="w-full">
                        <div className="flex flex-col w-full mb-4">
                            <label className={labelCss}>DATE | TIME - <Timer /></label>
                            {/* <input type="text" placeholder="Enter code" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" /> */}
                        </div>

                        <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                            <div className="flex flex-col w-full">
                                <label className={labelCss}>LAST NAME</label>
                                <input type="text" name="last_name" value={formData.last_name} onChange={(e) => handleFieldChange(e)} placeholder="Enter last name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className={labelCss}>GIVEN NAME</label>
                                <input type="text" name="first_name" value={formData.first_name} onChange={(e) => handleFieldChange(e)}  placeholder="Enter given name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className={labelCss}>MIDDLE NAME</label>
                                <input type="text" name="middle_name" value={formData.middle_name} onChange={(e) => handleFieldChange(e)}  placeholder="Enter given name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                            <div className="flex flex-col w-full">
                                <label className={labelCss}>Birthday</label>
                                <input type="date" name="birthday" value={
                                    formData.birthday ? new Date(formData.birthday).toISOString().substring(0, 10) : ""
                                } onChange={(e) => handleBirthdateOPD(e)} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full mb-4">
                                <label className={labelCss}>Age</label>
                                <input type="text" value={formData.age} onChange={(e) => handleFieldChange(e)} className="border-none bg-gray-200 px-3 py-2 focus:outline-none" disabled/>
                            </div>

                            <div className="flex flex-col w-full">
                                <label className={labelCss}>Gender</label>
                                <Select 
                                    options={
                                        genderOPD?.map(genderopd => ({ 
                                            value: genderopd.value, 
                                            label: genderopd.label 
                                        }))}
                                    onChange={handleGenderOPD}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder="Select gender..."
                                    classNamePrefix="react-select"
                                    styles={styleDropdown} 
                                    
                                />
                            </div>
                            
                        </div>

                        <div className="flex flex-col w-full mb-4 gap-4 sm:flex-row">
                            <div className="flex flex-col w-full">

                                <label className={labelCss}>Physician</label>
                                <Select 
                                    options={
                                        physicianOPD?.map(physic => ({ 
                                            value: physic.user_id, 
                                            label: physic.name, 
                                            charge: physic.physician_charge 
                                        }))}
                                    onChange={handlePhysicianOPD}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder="Select physician..."
                                    classNamePrefix="react-select"
                                    styles={styleDropdown} 
                                />
                            </div>
                            
                            <div className="flex flex-col w-full">
                                <label className={labelCss}>Standard Charge</label>
                                <input type="text" value={formData.standard_charge} onChange={(e) => handleFieldChange(e)} className="border-none bg-gray-200 px-3 py-2 focus:outline-none" disabled/>
                            </div>

                        </div>
                    </div>
                )}
                
                {children}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-500"
                        onClick={handleSave}
                        disabled
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Modal