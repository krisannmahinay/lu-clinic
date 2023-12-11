import Head from 'next/head'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import AppLayout from "@/components/Layouts/AppLayout"
import NavTab from "@/components/NavTab"
import CustomCKEditor from '@/components/CustomCKEditor'
import Form from '@/components/Form'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import SearchExport from '@/components/SearchExport'
import Dropdown from '@/components/Dropdown'
import Button from '@/components/Button'
import ItemPerPage from '@/components/ItemPerPage'
import SkeletonScreen from '@/components/SkeletonScreen'
import { DropdownExport } from '@/components/DropdownLink'
import { 
    useGetOutPatientListQuery,
    useGetPhysicianListQuery,
    useGetPathologyListQuery,
    useGetPathologyCategoryListQuery,
    useGetMedicineListQuery,
    useGetIcd10ListQuery
} from '@/service/patientService'
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
            {id:1, type:"hematology", name: "Complete Blood Count with platelet count(CBC with platelet)"},
            {id:2, type:"hematology", name: "Peripheral Blood Smear"},
            {id:3, type:"hematology", name: "Clotting Time(CT)"},
            {id:4, type:"hematology", name: "Bleeding Time(BT)"},
            {id:5, type:"hematology", name: "Prothrombin Time(PT)"},
            {id:6, type:"hematology", name: "Partial Thromboplastin Time(PTT)"},
            {id:7, type:"hematology", name: "Dengue NS1"},
            {id:8, type:"hematology", name: "Crossmatching"},
            {id:9, type:"hematology", name: "Blood Typing"},
            {id:10, type:"hematology", name: "Others"}
        ], 
        urine_stool_studies: [
            {id:11, type:"stool", name: "Urinalysis(midstream, clean catch)"},
            {id:12, type:"stool", name: "Pregnancy Test"},
            {id:13, type:"stool", name: "Fecalysis"},
            {id:14, type:"stool", name: "Others"},
        ],
        cardiac_studies: [
            {id:15, type:"cardiac", name: "Electrocardiogram(ECG)"},
            {id:16, type:"cardiac", name: "Others",}
        ], 
        chemistry: [
            {id:17, type:"chemistry", name: "Lipid Profile"},
            {id:18, type:"chemistry", name: "Serum Sodium(Na)"},
            {id:19, type:"chemistry", name: "Serum Potassium(K)"},
            {id:20, type:"chemistry", name: "Blood Urea Nitrogen(BUN)"},
            {id:21, type:"chemistry", name: "Ionized Calcium(iCa)"},
            {id:22, type:"chemistry", name: "Uric Acid"},
            {id:23, type:"chemistry", name: "ALT/SGPT"},
            {id:24, type:"chemistry", name: "AST/SGOT"},
            {id:25, type:"chemistry", name: "Hepatitis Test"},
            {id:26, type:"chemistry", name: "Syphilis"},
            {id:27, type:"chemistry", name: "TSH"},
            {id:28, type:"chemistry", name: "Ft4"},
            {id:29, type:"chemistry", name: "Ft3"},
            {id:30, type:"chemistry", name: "TT4"},
            {id:31, type:"chemistry", name: "TT3"},
            {id:32, type:"chemistry", name: "PSA"},
            {id:33, type:"chemistry", name: "Rapid Antigen Test(COVID-19)"},
            {id:45, type:"chemistry", name: "Others"},
        ],
        glucose: [
            {id:46, type:"glucose", name: "Fasting Blood Sugar(FBS)"},
            {id:47, type:"glucose", name: "Hba1c"},
            {id:48, type:"glucose", name: "Random Blood Sugar"},
            {id:49, type:"glucose", name: "75g Oral Glucose Tolerance Test(OGTT)"},
            {id:50, type:"glucose", name: "Others"}
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
    
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const { data: physicianList } = useGetPhysicianListQuery()
    const { data: icd10List } = useGetIcd10ListQuery()
    const { data: pathologyList } = useGetPathologyListQuery()
    const { data: medicineList } = useGetMedicineListQuery({
        keywords: searchMedicine
    }, {
        enabled: !!searchMedicine
    })
    const { data: pathologyCategoryList } = useGetPathologyCategoryListQuery()
    const patientData = patientList?.data ?? []
    const pagination = patientList?.pagination ?? []
    const header = patientList?.columns ?? []

    // console.log(pathologyList)
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

    const phyisicianOptions = physicianList?.map(ph => ({
        value: ph.user_id,
        label: `Dr. ${ph.identity?.first_name} ${ph.identity?.last_name}`,
    }))

    console.log(phyisicianOptions)

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

                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
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
                                <tr key={tblBodyIndex} className="hover:bg-gray-200 hover:cursor-pointer" onClick={() => handleActiveContent('tableRow', tblBody)}>
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

                                    <td className="px-6 py-2 whitespace-nowrap">    
                                        {/* <button title="delete" type="button" onClick={(e) => handleOpenModal(e,tblBody?.patient_identity?.user_id)}> */}
                                        <button title="delete" type="button">
                                            {/* <span>ADD</span> */}
                                            <svg fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                         </svg>
                                        </button>
                                    </td>
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
                    <div className="flex relative overflow-hidden h-screen">
                        <div className="absolute inset-0 w-full">

                        </div>
                    </div>
                )
            case 'out-patient':
                return (
                    <div className="flex relative overflow-hidden h-screen">
                        <div className="absolute inset-0 w-full">
                            <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0`}>
                                <div className="font-bold text-xl mb-2 uppercase text-gray-600">Out Patient</div>
                                <div className="flex justify-between py-1">
                                    <Button
                                        btnIcon="add"
                                        onClick={() => handleActiveContent('addRow', '')}
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

                            <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0`}>
                                {contentType === 'addRow' && (
                                    <>
                                        <div className="font-bold text-xl mb-2 uppercase text-gray-600">Add Out Patient</div>
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
                                                onClick={() => setActiveContent("yellow")}
                                                >
                                                Close
                                            </Button>

                                            <div className="-space-x-5 border border-gray-300 rounded mb-2 w-full">
                                                <Profile data={selectedInformation}/>
                                            </div>
                                            
                                        </div>


                                        <Tabs
                                            tabsConfig={tabsConfig} 
                                        />
                                    </>
                                )}
                            </div>
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
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {slug}
                </h2>
            }>
            
            <Head>
                <title>{slug}</title>
            </Head>
            
            <div className="p-8">
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

                {slug === 'in-patient' && (
                     <>
                        <div className="flex justify-between py-4">
                            <Button>
                                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:outline-none px-4">
                                    <svg width="20" height="20" className="mr-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Add
                                </button>
                            </Button>

                            <SearchExport>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            // onChange={e => setSearchQuery(e.target.value)}
                                            onChange={handleSearch}
                                            className="border border-gray-300 w-full px-2 py-2 focus:outline-none flex-grow pl-10"
                                            placeholder="Search..."
                                        />
                                        <svg fill="none" stroke="currentColor" className="mx-2 h-6 w-6 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                    </div>

                                    <Dropdown
                                        align="right"
                                        width="48"
                                        trigger={
                                            <button className="border border-gray-300 bg-white rounded px-4 py-2 ml-4 focus:outline-none" aria-labelledby="Export">
                                                <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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


                    <div className="flex flex-wrap py-4">
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
                                <span className="mr-2 mx-2 text-gray-700">Per Page:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                        </ItemPerPage>
                    </div>
                 </>
                )}
            </div>
        </AppLayout>
    )
}

export default SubModule