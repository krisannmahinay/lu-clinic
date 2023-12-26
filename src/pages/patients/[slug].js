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
    useGetOutPatientListQuery,
    useGetPhysicianListQuery,
    useGetPathologyListQuery,
    useGetPathologyCategoryListQuery,
    useGetMedicineListQuery,
    useGetIcd10ListQuery,
    useGetActiveBedListQuery
} from '@/service/patientService'
import { 
    useGetModuleListQuery
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
    
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    const [contentHeight, setContentHeight] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const { 
        isLoading: moduleListLoading
    } = useGetModuleListQuery()

    const { 
        data: patientList, 
        isLoading: patientListLoading, 
        isError: userErr, 
        error, 
        isSuccess: patientSuccess 
    } = useGetOutPatientListQuery({
        slug: slug,
        items: itemsPerPage,
        page: currentPage,
        keywords: searchQuery,
        patientType: 'opd'
    }, {
        enabled: !!searchQuery
    })


    const { data: activeBedList } = useGetActiveBedListQuery(undefined, {skip: !refetchRTK})
    const { data: physicianList } = useGetPhysicianListQuery(undefined, {skip: !refetchRTK})
    const { data: icd10List } = useGetIcd10ListQuery(undefined, {skip: !refetchRTK})
    const { data: pathologyList } = useGetPathologyListQuery(undefined, {skip: !refetchRTK})
    const { data: medicineList } = useGetMedicineListQuery(
        undefined, {
            skip: !refetchRTK
    }, {
        keywords: searchMedicine
    }, {
        enabled: !!searchMedicine
    })
    const { data: pathologyCategoryList } = useGetPathologyCategoryListQuery(undefined, {skip: !refetchRTK})
    const patientData = patientList?.data ?? []
    const pagination = patientList?.pagination ?? []
    const header = patientList?.columns ?? []

    const panthologyCategoryListData = pathologyCategoryList?.map(el => el.category_name)
    // console.log(soapData[0])

    useEffect(() => {
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
    }, [])

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
            // clearTimeout(highlightTimeout)
        }

    }, [btnSpinner])

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

    // console.log(resultData)

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

    const phyisicianOptions = physicianList?.map(ph => ({
        value: ph.user_id,
        label: `Dr. ${ph.identity?.first_name} ${ph.identity?.last_name}`,
    }))

    const activeBedOptions = activeBedList?.map(bed => ({
        value: bed.id,
        label: `${bed.name} | ${bed.bed_group?.name} - ${bed.bed_group?.bed_floor?.floor}`
    })) 

    // console.log(activeBedList)

    const opdForms = [
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

    const ipdForms = [
        {name: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Type...'},
        {name: 'first_name', type: 'text', label: 'Given Name', placeholder: 'Type...'},
        {name: 'middle_name', type: 'text', label: 'Middle Name', placeholder: 'Type...'},
        {
            name: 'bed', 
            type: 'dropdown', 
            label: 'Bed', 
            options: activeBedOptions, 
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
            options: phyisicianOptions
        },
        {name: 'standard_charge', type: 'text', label: 'Standard Charge', disabled: true}
    ]

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
                                patientDataMaster={selectedInformation}
                                icd10={icd10List}
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
        console.log(id)
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

    const isOptionDisabled = checked.length === 0
    
    const handleRowMenu = (e) => {
        e.stopPropagation()
    }

    const renderTableContent = () => {
        return (
            patientListLoading ? (
                <div className="grid p-3 gap-y-2">
                    <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
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
                return (
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

                            <Table 
                                title="Patient List" 
                                action={false}
                                slug={slug}
                                tableHeader={Object.keys(patientIPD[0])}
                                tableData={patientIPD} 
                            />

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
                                            {slug !== 'out-patient' && (
                                                <Button
                                                    bgColor="indigo"
                                                    btnIcon="add"
                                                    onClick={() => formRef.current.handleAddRow()}
                                                >
                                                    Add Row
                                                </Button>
                                            )}

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
                return (
                    <div>
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                        <div className="font-bold text-xl mb-2 uppercase text-gray-600">Out Patient</div>
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
                                    title="User List" 
                                    disableTable={true}
                                    // onOpenModal={(id) => setModalId(id)}
                                >
                                    {renderTableContent()}
                                </Table>
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
                                    <div className="font-bold text-xl mb-2 uppercase text-gray-600">Add Out Patient</div>
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
                                            {slug !== 'out-patient' && (
                                                <Button
                                                    bgColor="indigo"
                                                    btnIcon="add"
                                                    onClick={() => formRef.current.handleAddRow()}
                                                >
                                                    Add Row
                                                </Button>
                                            )}

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
                                            <Profile data={selectedInformation}/>
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
            isLoading={moduleListLoading}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {slug}
                </h2>
            }>
            
            <Head>
                <title>{slug}</title>
            </Head>
            
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
        </AppLayout>
    )
}

export default SubModule