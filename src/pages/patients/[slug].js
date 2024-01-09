import Head from 'next/head'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import AppLayout from "@/components/Layouts/AppLayout"
import NavTab from "@/components/NavTab"
import Form from '@/components/Form'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import SearchExport from '@/components/SearchExport'
import Dropdown from '@/components/Dropdown'
import Button from '@/components/Button'
import ItemPerPage from '@/components/ItemPerPage'
import { DropdownExport, DropdownRowMenu } from '@/components/DropdownLink'
import { 
    useGetPatientListQuery,
    useGetOutPatientListQuery,
    useGetPhysicianListQuery,
    useGetPathologyListQuery,
    useGetPathologyCategoryListQuery,
    useGetMedicineListQuery,
    useGetIcd10ListQuery,
    useGetActiveBedListQuery
} from '@/service/patientService'
import { 
    useGetModuleListQuery,
    useCreateBulkMutation
} from '@/service/settingService'

import Alert from '@/components/Alert'
import Tabs from '@/components/Tabs'
import PatientInformation from '@/components/Patient/OPD/PatientInformation'
import Soap from '@/components/Patient/OPD/Soap'
import LabResult from '@/components/Patient/OPD/LabResult'
import ImagingResult from '@/components/ImagingResult'
import Prescription from '@/components/Prescription'
import ProfileInformation from '@/components/ProfileInformation'
import Profile from '@/components/Profile'
import { generateOpdForms, generateIpdForms } from '@/utils/forms' 
import SkeletonScreen from '@/components/SkeletonScreen'

const patientOPD = [
    {
        time_in: "1440",
        patient_id: "PAT-230818XY2A",
        patient_name: "John Doe",
        age: 20,
        gender: "Male",
        phone: "092222222222",
        physician: "Dr Smith",
    },
    
    {
        time_in: "1533",
        patient_id: "PAT-230818XYA2",
        patient_name: "John Doe",
        age: 27,
        gender: "Male",
        phone: "092222222222",
        physician: "Dr Smith",
    }
]

const patientIPD = [
    {
        time_in: "1533",
        patient_id: "PAT-230818XYA2",
        patient_name: "John Doe",
        age: 27,
        gender: "Male",
        phone: "092222222222",
        room_number: "02",
        physician: "Dr Smith",
    },
    {
        time_in: "1440",
        patient_id: "PAT-230818XY2A",
        patient_name: "John Doe",
        age: 27,
        gender: "Male",
        phone: "092222222222",
        room_number: "WARD BED#2",
        physician: "Dr Smith",
    }
]

const soapData = [
    {
        hematology: [
            // {id:1, type:"hematology", name: "Complete Blood Count with platelet count(CBC with platelet)"},
            // {id:2, type:"hematology", name: "Peripheral Blood Smear"},
            // {id:3, type:"hematology", name: "Clotting Time(CT)"},
            // {id:4, type:"hematology", name: "Bleeding Time(BT)"},
            // {id:5, type:"hematology", name: "Prothrombin Time(PT)"},
            // {id:6, type:"hematology", name: "Partial Thromboplastin Time(PTT)"},
            // {id:7, type:"hematology", name: "Dengue NS1"},
            // {id:8, type:"hematology", name: "Crossmatching"},
            // {id:9, type:"hematology", name: "Blood Typing"},
            // {id:10, type:"hematology", name: "Others"}
        ], 
        urine_stool_studies: [
            // {id:11, type:"stool", name: "Urinalysis(midstream, clean catch)"},
            // {id:12, type:"stool", name: "Pregnancy Test"},
            // {id:13, type:"stool", name: "Fecalysis"},
            // {id:14, type:"stool", name: "Others"},
        ],
        cardiac_studies: [
            // {id:15, type:"cardiac", name: "Electrocardiogram(ECG)"},
            // {id:16, type:"cardiac", name: "Others",}
        ], 
        chemistry: [
            // {id:17, type:"chemistry", name: "Lipid Profile"},
            // {id:18, type:"chemistry", name: "Serum Sodium(Na)"},
            // {id:19, type:"chemistry", name: "Serum Potassium(K)"},
            // {id:20, type:"chemistry", name: "Blood Urea Nitrogen(BUN)"},
            // {id:21, type:"chemistry", name: "Ionized Calcium(iCa)"},
            // {id:22, type:"chemistry", name: "Uric Acid"},
            // {id:23, type:"chemistry", name: "ALT/SGPT"},
            // {id:24, type:"chemistry", name: "AST/SGOT"},
            // {id:25, type:"chemistry", name: "Hepatitis Test"},
            // {id:26, type:"chemistry", name: "Syphilis"},
            // {id:27, type:"chemistry", name: "TSH"},
            // {id:28, type:"chemistry", name: "Ft4"},
            // {id:29, type:"chemistry", name: "Ft3"},
            // {id:30, type:"chemistry", name: "TT4"},
            // {id:31, type:"chemistry", name: "TT3"},
            // {id:32, type:"chemistry", name: "PSA"},
            // {id:33, type:"chemistry", name: "Rapid Antigen Test(COVID-19)"},
            // {id:45, type:"chemistry", name: "Others"},
        ],
        glucose: [
            // {id:46, type:"glucose", name: "Fasting Blood Sugar(FBS)"},
            // {id:47, type:"glucose", name: "Hba1c"},
            // {id:48, type:"glucose", name: "Random Blood Sugar"},
            // {id:49, type:"glucose", name: "75g Oral Glucose Tolerance Test(OGTT)"},
            // {id:50, type:"glucose", name: "Others"}
        ]
    }
]

const soapHeaders = [
    "hematology",
    "urine_stool_studies",
    "cardiac_studies",
    "chemistry",
    "glucose",
]

const dummyData = [
    {id:1, name: "Paracetamol"},
    {id:2, name: "Other Medicine"},
    {id:3, name: "Test Medicine2"},
    {id:4, name: "Test Medicine5"},
    {id:5, name: "Test Medicine6"},
    {id:6, name: "Test Medicine7"},
    {id:7, name: "Test Medicine7"},
    {id:8, name: "Test Medicine7"},
    {id:9, name: "Test Medicine7"},
    {id:10, name: "Test Medicine7"},
    {id:11, name: "Test Medicine7"},
    {id:12, name: "Test Medicine7"},
    {id:13, name: "Test Medicine7"},
    {id:14, name: "Test Medicine7"},
    {id:15, name: "Test Medicine7"},
    {id:16, name: "Test Medicine7"},
]

const SubModule = () => {
    const formRef = useRef(null)
    const router = useRouter()
    const { slug } = router.query
    const menuGroup = "patients"
    const [activeTab, setActiveTab] = useState('tab1')
    const [tableHeader, setTableHeader] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeContent, setActiveContent] = useState("yellow")
    const [btnSpinner, setBtnSpinner] = useState(false)
    const [updateForm, setUpdateForm] = useState({})
    const [contentType, setContentType] = useState("")
    const [selectedInformation, setSelectedInformation] = useState({})
    const [searchMedicine, setSearchMedicine] = useState("")
    const [refetchRTK, setRefetchRTK] = useState(false)
    const [checked, setChecked] = useState([])
    const [profileData, setProfileData] = useState({})
    const [checkIds, setCheckIds] = useState(0)
    const [isOptionDisabled, setIsOptionDisabled] = useState(true)
    const [isOptionEditDisabled, setIsOptionEditDisabled] = useState(true)
    const [fab, setFab] = useState(false)
    const [isDrDrawerOpen, setIsDrDrawerOpen] = useState(false)
    const [testsData, setTestsData] = useState({})
    const [openCategory, setOpenCategory] = useState(null)
    const [drRequestForms, setDrRequestForms] = useState([])

    const [pageTitle, setPageTitle] = useState("")
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    const [contentHeight, setContentHeight] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [opdForms, setOpdForms] = useState([])
    const [ipdForms, setIpdForms] = useState([])
    const [checkedItem, setCheckedItem] = useState([])
    
    const { 
        isLoading: moduleListLoading
    } = useGetModuleListQuery()

    const {
        data: patientList, 
        isLoading: patientListLoading, 
        isError: userErr, 
        error, 
        isSuccess: patientSuccess 
    } = useGetPatientListQuery({
        slug: slug,
        items: itemsPerPage,
        page: currentPage,
        keywords: searchQuery,
        patientType: 'opd'
    }, {
        enabled: !!searchQuery,
        enabled: !!itemsPerPage
    })

    const [createBulk, { 
        isLoading: createBulkLoading, 
        isSuccess: createUserSuccess 
    }] = useCreateBulkMutation()

    const { data: activeBedList } = useGetActiveBedListQuery(undefined, {skip: !refetchRTK})
    const { data: physicianList } = useGetPhysicianListQuery(undefined, {skip: !refetchRTK})
    const { data: icd10List } = useGetIcd10ListQuery(undefined, {skip: !refetchRTK})
    const { data: medicineList } = useGetMedicineListQuery(
        undefined, {
            skip: !refetchRTK
    }, {
        keywords: searchMedicine
    }, {
        enabled: !!searchMedicine
    })
    const { data: pathologyList } = useGetPathologyListQuery()
    const { data: pathologyCategoryList } = useGetPathologyCategoryListQuery()
    const patientData = patientList?.data ?? []
    const pagination = patientList?.pagination ?? []
    const header = patientList?.columns ?? []

    // const panthologyCategoryListData = pathologyCategoryList?.map(el => el.category_name)

    const formatTitlePages = (str) => {
        return str
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
    }

    useEffect(() => {
        if(pathologyCategoryList && pathologyList) {
            const pathologyData = pathologyCategoryList?.reduce((acc, category) => {
                acc[category.category_name] = pathologyList?.filter(test => test.patho_category_id === category.id)
                return acc
            }, {})

            setTestsData(pathologyData)
        }

        if(slug) {
            setPageTitle(formatTitlePages(slug))
        }

        const calculateHeight = () => {
            const windowHeight = window.innerHeight
            setContentHeight(windowHeight)
        }
        calculateHeight()

        // Recalculate height on window resize
        window.addEventListener('resize', calculateHeight)
        return () => {
            window.removeEventListener('resize', calculateHeight)
        }
    }, [pathologyCategoryList, pathologyList])

    useEffect(() => {
        // const newRows = new Set()

        // userData.forEach((row, index) => {
        //     if(isRowNew(row.created_at)) {
        //         newRows.add(index)
        //     }
        // })

        // setHighlightedRows(newRows)
        
        // console.log(highlightedRows)

        // const highlightTimeout = setTimeout(() => {
        //     setHighlightedRows(new Set())
        // }, 2000) //clear the highlights after .5milliseconds
        if(physicianList) {
            const opd = generateOpdForms(physicianList)
            setOpdForms(opd)
        }

        if(physicianList && activeBedList) {
            const ipd = generateIpdForms(physicianList, activeBedList)
            setIpdForms(ipd)
        }

        let spinnerTimer
        if(btnSpinner) {
            spinnerTimer = setTimeout(() => {
                setBtnSpinner(false)
            }, 500)
        }

        return () => {
            if(spinnerTimer) {
                clearTimeout(spinnerTimer)
            }
        }

    }, [btnSpinner, physicianList])

    const organizedData = {}

    pathologyList?.forEach(item => {
        const category = item.panthology_category?.category_name || 'unknown'
        if(!organizedData[category]) {
            organizedData[category] = []
        }

        organizedData[category].push({
            id: item.id,
            type: category,
            name: item.test_name
        })
    })

    const resultData = Object.keys(organizedData).map(category => ({
        [category]: organizedData[category]
    }))

    console.log(testsData)

    // const organizedData = pathologyList?.reduce((acc, item) => {
    //     const category = item.panthology_category?.category_name || 'unknown'
    //     if (!acc[category]) {
    //         acc[category] = []
    //     }
    //     acc[category].push({
    //         id: item.id,
    //         type: category,
    //         name: item.test_name,
    //     })
    //     return acc
    // }, {})

    // const mergedData = [{ ...organizedData, ...soapData[0]}]
    // console.log(mergedData)

    // console.log(activeBedList)

    const handleExportToPDF = () => {
        
    }
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(e.target.value)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleSubmitButton = (slug) => {
        if(slug === 'out-patient') {
            formRef.current.handleSubmit('createOutPatient')
        } else if (slug === 'in-patient') {

        } else if(slug === 'doctor-request') {
            createBulk({actionType: 'createDoctorRequest', data: drRequestForms})
                .unwrap()
                .then(response => {
                    if(response.status === "success") {
                        setBtnSpinner(true)
                    }
                })
                .catch(error => {
                    //  console.log(error)
                    if(error.status === 500) {
                        setAlertType("error")
                        setAlertMessage("Unsuccessful")
                        setAlertOpen(true)
                    }
                })
        }
    }

    const handleSearchMedQuery = (e) => {
        setSearchMedicine(e)
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
    }

    const handleActiveContent = (type, data) => {
        setSelectedInformation(data)
        setActiveContent("green")
        setContentType(type)
    }

    const handleRefetch = () => {
        setItemsPerPage(prev => prev + 1)
    }

    const handleOpenModal = (e, userId) => {
        e.stopPropagation()
        const patienData = patientData?.find(e => e.patient_identity?.user_id === userId)
        setUpdateForm(patienData)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        // setSelectedRows([])
        setIsModalOpen(false)
    }

    const handleNewPage = (newPage) => {
        setCurrentPage(newPage)
    }

    const tabsConfig = [
        {
            id: 'tab1',
            label: 'Patient Information and Consent',
            content: () => <PatientInformation
                                patientDataMaster={profileData}
                                icd10Data={icd10List}
                            />
        },
        {
            id: 'tab2',
            label: 'S.O.A.P',
            content: () => <Soap 
                                soapData={soapData} 
                                soapHeaders={soapHeaders} 
                                dummyData={dummyData}
                                medicineMaster={medicineList}
                                onSearchQuery={(data) => handleSearchMedQuery(data)}
                            />
        },
        {
            id: 'tab3',
            label: 'Laboratory Results',
            content: () => <LabResult />
        },
        {
            id: 'tab4',
            label: 'Imaging Results',
            content: () => <ImagingResult />
        },
        {
            id: 'tab5',
            label: 'Prescription',
            content: () => <Prescription />
        }
    ]

    const handleActiveTab = (id) => {
        setActiveTab(id)
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = patientData?.map((pd) => pd.id) // assuming each patientData has a unique id
            setChecked(allIds)
        } else {
            setChecked([])
        }
    }

    const handleRowSelect = (e, id) => {
        e.stopPropagation()
        const newChecked = e.target.checked
            ? [...checked, id]
            : checked.filter((sid) => sid !== id)
        
        setChecked(newChecked)
    }

    // const isOptionDisabled = checked.length === 0
    
    const handleRowMenu = (e) => {
        e.stopPropagation()
    }

    const handleOnchecked = (data) => {
        setIsOptionEditDisabled(data.length > 1)
        setIsOptionDisabled(data.length === 0)
    }

    console.log(drRequestForms)

    const handleCheckbox = (testId, isChecked) => {
        if(isChecked) {
            setDrRequestForms(prevForms => [...prevForms, {
                patient_id: profileData?.patient_id,
                physician_id: profileData?.admitting_physician,
                test_id: testId,

            }])
        } else {
            setDrRequestForms(prevForms => prevForms.filter(form => form.test_id !== testId))
        }
        // if(checkedItem.includes(id)) {
        //     setCheckedItem((prevChecked) => prevChecked.filter((itemId) => itemId !== id))
        // } else {
        //     setCheckedItem((prevChecked) => [...prevChecked, id])
        // }
    }

    const handleOnclick = (type, data) => {
        switch(type) {
            case 'addRowBtn':
                formRef.current.handleAddRow()
                break

            case 'addUserBtn':
                formRef.current.handleSubmit('createUser')
                break

            case 'closeDrawer':
                setActiveContent("yellow")
                // setProfileData([])
                break

            case 'editUserBtn':
                setProfileData(data)
                setActiveContent("green")
                setContentType("editUser")
                break

            case 'clickedRows':
                setProfileData(data)
                setActiveContent("green")
                setContentType("tableRow")
                break

            default:
                break
        }
    }

    const renderTableContent = () => {
        return (
            patientListLoading ? (
                <div className="grid p-3 gap-y-2">
                    <div className="flex space-x-3">
                        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>

                    </div>
                    <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    checked={checked.length === patientData.length && patientData.length !== 0}
                                    onChange={handleSelectAll}
                                />
                            </th>

                            {header.map((tblHeader, tblHeaderIndex) => (
                                // console.log(tblHeaderIndex)
                                <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {tblHeader === 'id' ? (
                                        'patient_id'
                                    ) : tblHeader === 'patient_id' ? (
                                        'patient_name'
                                    ) : tblHeader === 'admitting_physician' ? (
                                        'physician'
                                    ) : tblHeader === 'created_at' ? (
                                        'time_in'
                                    ) : (
                                        tblHeader
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patientData.length === 0 ? (
                            <tr>
                                <td colSpan={header.length + 1} className="px-6 py-2 text-center">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            patientData.map((tblBody, tblBodyIndex) => (
                                // console.log(tblBody)
                                // <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
                                <tr key={tblBody.id} className="hover:bg-gray-200 hover:cursor-pointer" onClick={() => {
                                    handleActiveContent('tableRow', tblBody),
                                    setRefetchRTK(true)
                                }}>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm">
                                        <input
                                            type="checkbox"
                                            checked={checked.includes(tblBody.id)}
                                            onClick={(e) => handleRowSelect(e, tblBody.id)}
                                        />
                                    </td>

                                    {header.map((tblHeader) => (
                                        <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm">
                                            {tblHeader === 'admitting_physician' ? (
                                                `Dr. ${tblBody?.physician_identity?.first_name} ${tblBody?.physician_identity?.last_name}`
                                            ) : tblHeader === 'id' ? (
                                                tblBody?.patient_id
                                            ) : tblHeader === 'patient_id' ? (
                                                `${tblBody?.patient_identity?.first_name} ${tblBody?.patient_identity?.last_name}`
                                            ) : (
                                                tblBody[tblHeader]
                                            )}
                                        </td>
                                    ))}
                                    
                                    {/* <td className="relative px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                                        <div>
                                            <Dropdown
                                                align="right"
                                                width="48"
                                                trigger={
                                                    <button className="action-icon hidden absolute" onClick={(e) => handleRowMenu(e)}>
                                                        <svg dataSlot="icon" fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6 text-gray-700 rounded-full border border-gray-700 bg-white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                            <path clipRule="evenodd" fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                                                        </svg>
                                                    </button>
                                                }>
                                                <DropdownExport>
                                                    Re-Visit
                                                </DropdownExport>
                                            </Dropdown>
                                        </div>
                                    </td> */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )
        )
    }

    const renderContent = (slug) => {
        switch(slug) {
            case 'in-patient':
                return moduleListLoading ? (
                    <SkeletonScreen loadingType="table"/>
                ) : (
                    <div>
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                        <div className="font-bold text-xl mb-2 uppercase text-gray-600">In Patient</div>
                            <div className="flex justify-between py-1">
                                <Button
                                    btnIcon="add"
                                    onClick={() => {
                                        handleActiveContent('addRow', '')
                                        setRefetchRTK(true)
                                    }}
                                >
                                Add
                                </Button>

                                <SearchExport>
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                // onChange={e => setSearchQuery(e.target.value)}
                                                onChange={(e) => handleSearch(e)}
                                                className="border border-gray-300 w-full px-2 py-1 rounded focus:outline-none text-sm flex-grow pl-10"
                                                placeholder="Search..."
                                            />
                                            <svg fill="none" stroke="currentColor" className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                            </svg>
                                        </div>

                                        <Dropdown
                                            align="right"
                                            width="48"
                                            trigger={
                                                <button className="border border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none" aria-labelledby="Export">
                                                    <svg fill="none" stroke="currentColor" className="h-5 w-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                    </svg>
                                                </button>
                                            }>
                                            <DropdownExport>
                                                Export as PDF
                                            </DropdownExport>
                                            <DropdownExport>
                                                Export as JSON
                                            </DropdownExport>
                                        </Dropdown>
                                    </div>
                                </SearchExport>
                            </div>
                            
                            
                            <div className="bg-white overflow-hidden border border-gray-300 rounded">
                                <Table
                                    tableHeader={header}
                                    tableData={patientData}
                                    isLoading={patientListLoading}
                                    onChecked={(data) => handleOnchecked(data)}
                                    onClick={(data) => handleOnclick('clickedRows', data)}
                                    onEdit={(id) => setCheckIds(id)} 
                                />
                            </div>

                            {/* <Table 
                                title="Patient List" 
                                action={false}
                                slug={slug}
                                tableHeader={Object.keys(patientIPD[0])}
                                tableData={patientIPD} 
                            /> */}

                            <div className="flex flex-wrap py-1">
                                <div className="flex items-center justify-center flex-grow">
                                    <Pagination 
                                        currentPage={currentPage} 
                                        totalPages={totalPages}
                                        // onPageChange={newPage => setCurrentPage(newPage)}
                                        onPageChange={(newPage) => handleNewPage(newPage)}
                                    />
                                </div>

                                <ItemPerPage className="flex flex-grow">
                                    <div className="flex items-center justify-end">
                                        <span className="mr-2 mx-2 text-gray-500 uppercase font-medium text-xs">Per Page:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => handleItemsPerPageChange(e)}
                                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                        </select>
                                    </div>
                                </ItemPerPage>
                            </div>
                        </div>
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0 ' : 'translate-x-full'}  absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                            {contentType === 'addRow' && (
                                <>
                                    <div className="font-bold text-lg mb-2 uppercase text-gray-600">Add In Patient</div>
                                    <div className="flex justify-between py-2">
                                        <Button
                                            paddingY="2"
                                            btnIcon="close"
                                            onClick={() => setActiveContent("yellow")}
                                        >
                                            Close
                                        </Button>

                                        <div className="flex gap-2">
                                            <Button
                                                bgColor={btnSpinner ? 'disable': 'emerald'}
                                                btnIcon={btnSpinner ? 'disable': 'submit'}
                                                btnLoading={btnSpinner}
                                                onClick={() => handleSubmitButton(slug)}
                                            >
                                                {btnSpinner ? '' : 'Submit'}
                                            </Button>
                                        </div>
                                    </div>

                                    <Form 
                                        ref={formRef} 
                                        initialFields={ipdForms}
                                        onSuccess={handleRefetch}
                                        onLoading={(data) => setBtnSpinner(data)}
                                        onSetAlertType={(data) => setAlertType(data)}
                                        onCloseSlider={() => setActiveContent("yellow")}
                                        onSetAlertMessage={(data) => setAlertMessage(data)}
                                    />
                                </>
                            )}             
                        </div>
                    </div>
                )
            case 'out-patient':
                return moduleListLoading ? (
                    <SkeletonScreen loadingType="table"/>
                ) : (
                    <div>
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                        <div className="font-medium text-xl mb-2 text-gray-600">Out Patient</div>
                            <div className="flex justify-between py-1">
                                <div className="flex space-x-1">
                                    <Button
                                        btnIcon="add"
                                        onClick={() => {
                                            handleActiveContent('addRow', ''),
                                            setRefetchRTK(true)
                                        }}
                                    >
                                    Add
                                    </Button>
                                    
                                    <Dropdown
                                        align="left"
                                        width="48"
                                        trigger={
                                            <button onClick="" className={`${isOptionDisabled ? 'bg-gray-300' : 'bg-indigo-500 hover:bg-indigo-600'} flex items-center text-white text-sm px-2 gap-2 rounded focus:outline-none`} disabled={isOptionDisabled}>
                                                <svg dataSlot="icon" fill="none" className="h-4 w-4" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                                </svg>

                                                Options
                                            </button>
                                        }>
                                        <DropdownExport>
                                            Re-Visit
                                        </DropdownExport>
                                        <DropdownExport>
                                            Admit
                                        </DropdownExport>
                                    </Dropdown>

                                    
                                    
                                </div>

                                <SearchExport>
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                // onChange={e => setSearchQuery(e.target.value)}
                                                onChange={(e) => handleSearch(e)}
                                                className="border border-gray-300 w-full px-2 py-1 rounded focus:outline-none text-sm flex-grow pl-10"
                                                placeholder="Search..."
                                            />
                                            <svg fill="none" stroke="currentColor" className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                            </svg>
                                        </div>

                                        <Dropdown
                                            align="right"
                                            width="48"
                                            trigger={
                                                <button className="border border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none" aria-labelledby="Export">
                                                    <svg fill="none" stroke="currentColor" className="h-5 w-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                    </svg>
                                                </button>
                                            }>
                                            <DropdownExport>
                                                Export as PDF
                                            </DropdownExport>
                                            <DropdownExport>
                                                Export as JSON
                                            </DropdownExport>
                                        </Dropdown>
                                    </div>
                                </SearchExport>
                            </div>

                            <div className="bg-white overflow-hidden border border-gray-300 rounded">
                                <Table
                                    tableHeader={header}
                                    tableData={patientData}
                                    isLoading={patientListLoading}
                                    onChecked={(data) => handleOnchecked(data)}
                                    onClick={(data) => handleOnclick('clickedRows', data)}
                                    onEdit={(id) => setCheckIds(id)} 
                                />
                            </div>

                            <div className="flex flex-wrap py-1">
                                <div className="flex items-center justify-center flex-grow">
                                    <Pagination 
                                        currentPage={pagination.current_page} 
                                        totalPages={pagination.total_pages}
                                        // onPageChange={newPage => setCurrentPage(newPage)}
                                        onPageChange={(newPage) => handleNewPage(newPage)}
                                    />
                                </div>

                                <ItemPerPage className="flex flex-grow">
                                    <div className="flex items-center justify-end">
                                        <span className="mr-2 mx-2 text-gray-500 uppercase font-medium text-xs">Per Page:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => handleItemsPerPageChange(e)}
                                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                        </select>
                                    </div>
                                </ItemPerPage>
                            </div>
                        </div>

                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0 ' : 'translate-x-full'}  absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                            {contentType === 'addRow' && (
                                <>
                                    <div className="font-medium text-xl mb-2 text-gray-600">Add Out Patient</div>
                                    <div className="flex justify-between py-2">
                                        <Button
                                            paddingY="2"
                                            btnIcon="close"
                                            onClick={() => {
                                                setActiveContent("yellow"),
                                                setRefetchRTK(false)
                                            }}
                                        >
                                            Close
                                        </Button>

                                        <div className="flex gap-2">
                                            <Button
                                                bgColor="indigo"
                                                btnIcon="add"
                                                onClick={() => formRef.current.handleAddRow()}
                                            >
                                                Add Row
                                            </Button>

                                            <Button
                                                bgColor={btnSpinner ? 'disable': 'emerald'}
                                                btnIcon={btnSpinner ? 'disable': 'submit'}
                                                btnLoading={btnSpinner}
                                                onClick={() => handleSubmitButton(slug)}
                                            >
                                                {btnSpinner ? '' : 'Submit'}
                                            </Button>
                                        </div>
                                    </div>


                                    <Form 
                                        ref={formRef} 
                                        initialFields={opdForms}
                                        enableAutoSave={false}
                                        enableAddRow={true}
                                        onSuccess={handleRefetch}
                                        onLoading={(data) => setBtnSpinner(data)}
                                        onSetAlertType={(data) => setAlertType(data)}
                                        onCloseSlider={() => setActiveContent("yellow")}
                                        onSetAlertMessage={(data) => setAlertMessage(data)}
                                    />

                                </>
                            )}
                            {contentType === 'tableRow' && (
                                <>
                                    <div className="flex items-center py-2">
                                        <Button
                                            paddingY="2"
                                            btnIcon="close"
                                            onClick={() => {
                                                setActiveContent("yellow")
                                                setRefetchRTK(false)
                                            }}
                                            >
                                            Close
                                        </Button>

                                        <div className="-space-x-5 border border-gray-300 rounded mb-2 w-full">
                                            <Profile data={profileData}/>
                                        </div>
                                        
                                    </div>


                                    <Tabs
                                        tabsConfig={tabsConfig}
                                        onActiveTab={(id) => handleActiveTab(id)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )
        default:
            return null
        }
    }

    return (
        <AppLayout
            moduleId={slug}
            menuGroup={menuGroup}
            isLoading={moduleListLoading}>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            
            <div className="container mx-auto">
                <div className="relative overflow-x-hidden" style={{ height: `${contentHeight}px` }}>
                    <Modal 
                        // title={title}
                        // charges={true} 
                        slug={slug}
                        isOpen={isModalOpen}
                        data={updateForm}
                        onClose={closeModal}
                        // permission={permission} 
                        // selectedRowId={selectedRows}
                    />

                    {alertMessage &&
                        <Alert 
                            alertType={alertType}
                            isOpen={alertType !== ""}
                            onClose={handleAlertClose}
                            message={alertMessage} 
                        /> 
                    }

                    {renderContent(slug)}
                </div>
            </div>

            {activeTab === 'tab2' && (
                <div className="fixed bottom-4 right-5 z-50">
                    <button onClick={() => setIsDrDrawerOpen(!isDrDrawerOpen)} title="Doctor Request's" className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg focus:outline-none">
                    <svg fill="#ffffff" height={20} width={20} version="1.1" id="Capa_1" viewBox="0 0 201.324 201.324" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" stroke="#ffffff">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.805296"></g>
                        <g id="SVGRepo_iconCarrier"> <circle cx="95.596" cy="10.083" r="10.083"></circle> <circle cx="149.018" cy="10.083" r="10.083"></circle> 
                            <path d="M179.06,19.254c-5.123-8.873-14.298-14.17-24.544-14.17v10c6.631,0,12.568,3.428,15.884,9.17 c3.316,5.743,3.316,12.599,0.001,18.342l-32.122,55.636c-3.315,5.742-9.253,9.17-15.884,9.171c-6.631,0-12.569-3.428-15.885-9.171 L74.389,42.595c-3.315-5.742-3.315-12.599,0-18.341s9.254-9.171,15.885-9.171v-10c-10.246,0-19.422,5.297-24.545,14.171 s-5.123,19.468,0,28.341l32.121,55.636c4.272,7.399,11.366,12.299,19.545,13.727v26.832c0,26.211-15.473,47.535-34.492,47.535 c-19.019,0-34.491-21.324-34.491-47.535v-31.948C59.802,109.52,68.4,99.424,68.4,87.356c0-13.779-11.21-24.989-24.989-24.989 s-24.989,11.21-24.989,24.989c0,12.067,8.598,22.163,19.989,24.486v31.948c0,31.725,19.959,57.535,44.492,57.535 c24.532,0,44.491-25.81,44.491-57.535v-26.832c8.178-1.428,15.273-6.328,19.544-13.727l32.122-55.636 C184.184,38.722,184.184,28.127,179.06,19.254z">

                            </path> 
                        </g>
                    </svg>
                    </button>
                </div>
            )}

            {isDrDrawerOpen && (
                <div>
                    <div className={`fixed inset-0 top-0 p-4 bg-black opacity-50 transition-opacity ${isDrDrawerOpen ? 'visible' : 'hidden'}`}></div>
                    <div className={`fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto bg-white w-80 transition-transform duration-500 ease-in-out ${isDrDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <button 
                            onClick={() => setIsDrDrawerOpen(!isDrDrawerOpen)}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close menu</span>
                        </button>

                        <div className="pt-7">
                            {Object.entries(testsData).map(([category, tests]) => (
                                <div key={category}>
                                    <div className="bg-gray-200">
                                        <button onClick={() => setOpenCategory(openCategory === category ? null : category)} className="text-gray-500 font-medium p-2 font-bold uppercase text-xs">
                                            {category}
                                        </button>
                                    </div>

                                    <div style={{ display: openCategory === category ? 'block' : 'none' }}>
                                        {tests.map(test => (
                                            <ul className="space-y-2 align-top divide-y">
                                                <li key={test.id}>
                                                    <div className="flex items-center space-x-4">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-3 h-3"
                                                            // name=""
                                                            // value={test.id}
                                                            // checked={checkedItem.includes(test.id)}
                                                            onChange={(e) => handleCheckbox(test.id, e.target.checked)}
                                                        />
                                                        <p className="text-sm text-gray-500">{test.test_name}</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <Button
                                bgColor={btnSpinner ? 'disable': 'emerald'}
                                btnIcon={btnSpinner ? 'disable': 'submit'}
                                btnLoading={btnSpinner}
                                onClick={() => handleSubmitButton("doctor-request")}
                            >
                                {btnSpinner ? '' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}

export default SubModule