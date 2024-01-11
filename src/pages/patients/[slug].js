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
    useGetPhysicianListQuery,
    useGetRadiologyListQuery,
    useGetRadiologyCategoryListQuery,
    useGetPathologyListQuery,
    useGetPathologyCategoryListQuery,
    useGetMedicineListQuery,
    useGetIcd10ListQuery,
    useGetActiveBedListQuery,
    useGetMedicationListQuery,
    useGetImgResultListQuery,
    useGetLabResultListQuery,
} from '@/service/patientService'
import { 
    useGetModuleListQuery,
    useCreateBulkMutation,
    useUpdateBulkMutation
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

    // medications
    const [isShowMedForm, setIsShowMedForm] = useState(false)
    const [addedMedicine, setAddedMedicine] = useState([])
    const [selectedMedicine, setSelectedMedicine] = useState(null)

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

    const [updateBulk, {isLoading: updateBulkLoading}] = useUpdateBulkMutation()

    const { data: activeBedList } = useGetActiveBedListQuery(undefined, {skip: !refetchRTK})
    const { data: physicianList } = useGetPhysicianListQuery(undefined, {skip: !refetchRTK})
    const { data: icd10List } = useGetIcd10ListQuery(undefined, {skip: !refetchRTK})
    const { data: medicationList } = useGetMedicationListQuery({
        keywords: searchMedicine,
        patient_id: profileData?.patient_id
    }, {
        enabled: !!searchMedicine
    })
    const { data: imgResultList } = useGetImgResultListQuery({ slug: 'imaging', patient_id: profileData?.patient_id })
    const { data: labResultList } = useGetLabResultListQuery({ slug: 'laboratory', patient_id: profileData?.patient_id })
    const { data: pathologyList } = useGetPathologyListQuery()
    const { data: pathologyCategoryList } = useGetPathologyCategoryListQuery()
    const { data: radiologyList } = useGetRadiologyListQuery()
    const patientData = patientList?.data ?? []
    const pagination = patientList?.pagination ?? []
    const header = patientList?.columns ?? []

    // const panthologyCategoryListData = pathologyCategoryList?.map(el => el.category_name)

    console.log(labResultList)

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

    // console.log(testsData)

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
        } else if(slug.link === 'add-medicine') {
            if (slug.qty > selectedMedicine?.medicine.quantity) {
                setAlertMessage(`Please refer to available stock (${selectedMedicine?.medicine.quantity})`)
            } else {
                updateBulk({actionType: 'updateMedication', data: selectedMedicine, id: slug.id})
                    .unwrap()
                    .then(response => {
                        if(response.status === "success") {
                            setBtnSpinner(true)
                        }
                    })
                    .catch(error => {
                         console.log(error)
                    })

                setAddedMedicine((current) => [
                    ...current, 
                    selectedMedicine
                ])
                setIsShowMedForm(false)
            }
        }
    }

    const addMedicine = (qty) => {
        // console.log(selectedMedicine)
        if (qty > selectedMedicine?.medicine.quantity) {
            
            createBulk({actionType: 'createDoctorRequest', data: drRequestForms})

            setAlertMessage(`Please refer to available stock (${selectedMedicine?.medicine.quantity})`)
        } else {
            setAddedMedicine((current) => [...current, selectedMedicine])
            setIsShowMedForm(false)
        }
    }

    const backToList = () => {
        setSelectedMedicine(null)
        setIsShowMedForm(false)
        setAlertMessage("")
    }

    // console.log(drRequestForms)

    const selectMedicine = (medicine) => {
        setSelectedMedicine(medicine)
        setIsShowMedForm(true)
    }

    const handleSearchMedQuery = (e) => {
        setSearchMedicine(e.target.value)
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
                                dummyData={dummyData}
                                // onSearchQuery={(data) => handleSearchMedQuery(data)}
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

    const handleAddMedicine = (e, fieldName) => {
        setSelectedMedicine(prevData => ({
            ...prevData,
            [fieldName]: e.target.value
        }))
    }

    const handleCheckbox = (test, isChecked, labCategory) => {
        if(isChecked) {
            setDrRequestForms(prevForms => [...prevForms, {
                patient_id: profileData?.patient_id,
                physician_id: profileData?.admitting_physician,
                test_id: test.id,
                lab_category: labCategory,
                charge: test.charge

            }])
            setIsOptionDisabled(false)
        } else {
            setDrRequestForms(prevForms => prevForms.filter(form => form.test_id !== test.id))
            setIsOptionDisabled(true)
        }
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
                            <div className={`fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto bg-white w-2/5 transition-transform duration-500 ease-in-out ${isDrDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                                <h5 id="drawer-right-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                                    <svg class="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>Doctor's Request
                                </h5>
                                <button 
                                    onClick={() => {
                                        setIsDrDrawerOpen(!isDrDrawerOpen)
                                        setDrRequestForms([])
                                        setAddedMedicine([])
                                        setAlertMessage("")
                                    }}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close menu</span>
                                </button>

                                <div className="pt-7">
                                    {Object.entries(testsData).map(([category, tests]) => (
                                        <>
                                            <div key={category} className="border border-gray-400">
                                                <div className="bg-gray-200">
                                                    <button onClick={() => setOpenCategory(openCategory === category ? null : category)} className="text-gray-500 font-medium p-2 uppercase text-xs">
                                                        {category}
                                                    </button>
                                                </div>

                                                <div style={{ display: openCategory === category ? 'block' : 'none' }} className="p-4">
                                                    <ul className="space-y-1">
                                                        {tests.map(test => (
                                                            <li key={test.id}>
                                                                <div className="flex items-center space-x-4">
                                                                    <input
                                                                        type="checkbox" 
                                                                        className="w-3 h-3"
                                                                        onChange={(e) => handleCheckbox(test, e.target.checked, 'pathology')}
                                                                    />
                                                                    <p className="text-sm text-gray-500">{test.test_name}</p>
                                                                </div>
                                                            </li>    
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </>
                                    ))}

                                    <div className="border border-gray-400">
                                        <div className="bg-gray-200">
                                            <p className="text-gray-500 font-medium p-2 uppercase text-xs">Imaging</p>
                                        </div>

                                        <ul className="space-y-1 p-4">
                                            {radiologyList?.map(test => (
                                                <li key={test.id}>
                                                    <div className="flex items-center space-x-4">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-3 h-3"
                                                            onChange={(e) => handleCheckbox(test, e.target.checked, 'radiology')}
                                                        />
                                                        <p className="text-sm text-gray-500">{test.test_name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid justify-items-center py-4">
                                        <button 
                                            onClick={() => handleSubmitButton("doctor-request")} 
                                            className={`${isOptionDisabled || btnSpinner ? 'bg-gray-300' : 'bg-emerald-500 hover:bg-emerald-600'} flex items-center text-white text-sm px-2 py-1 gap-2 rounded focus:outline-none`} 
                                            disabled={isOptionDisabled || btnSpinner}>
                                            
                                            
                                            {btnSpinner ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7 animate-spin' viewBox="0 0 100 100" fill="none">
                                                    <circle cx="50" cy="50" r="32" stroke-width="8" stroke="currentColor" strokeDasharray="50.26548245743669 50.26548245743669" fill="none" strokeLinecap="round"/>
                                                </svg>
                                            ) : (
                                                <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                                </svg>
                                            )}

                                            Submit
                                        </button>
                                    </div>

                                    <div className="border border-gray-400 ">
                                        <div className="bg-gray-200">
                                            <p className="text-gray-500 font-medium p-2 uppercase text-xs">Medications</p>
                                        </div>
                                        <div className="flex justify-center">
                                            <div className="flex-col w-full border scroll-custom">
                                                <div className="overflow-y-auto scroll-custom">
                                                    {!isShowMedForm && (
                                                        <div className="sticky top-0">
                                                            <input
                                                                type="search"
                                                                value={searchMedicine}
                                                                onChange={(e) => handleSearchMedQuery(e)}
                                                                placeholder="Search..."
                                                                className="p-1 w-full border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                                                            />
                                                            <div className="">
                                                                {medicationList?.map((data) => (
                                                                    <div
                                                                        key={data.id}
                                                                        className={`p-2 text-sm text-gray-500 ${data?.status === 'ps' ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-300 cursor-pointer' }`}
                                                                        onClick={data?.status !== 'ps' ? () => selectMedicine(data) : undefined}
                                                                    >
                                                                        {`${data?.medicine.generic_name} (${data?.dose})`}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isShowMedForm && (
                                                        <div className="p-4">
                                                            <div className="mb-4">
                                                                <label className="block text-sm font-medium text-gray-700">Brand name:</label>
                                                                <input
                                                                    type="text"
                                                                    className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                                                                    value={selectedMedicine?.medicine.brand_name}
                                                                    readOnly
                                                                    
                                                                />
                                                                <label className="block text-sm font-medium text-gray-700">Generic name:</label>
                                                                <input
                                                                    type="text"
                                                                    className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                                                                    value={selectedMedicine?.medicine.generic_name}
                                                                    readOnly
                                                                />

                                                                <label className="block text-sm font-medium text-gray-700">Dose:</label>
                                                                <input
                                                                    type="text"
                                                                    className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                                                                    value={selectedMedicine.dose}
                                                                    onChange={(e) => handleAddMedicine(e, "dose")}
                                                                />

                                                                <label className="block text-sm font-medium text-gray-700">Qty:</label>
                                                                <input
                                                                    type="number"
                                                                    className={`mt-1 block w-full p-2 border bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 ${alertMessage !== "" ? 'border-red-600' :  'border-gray-300'}`}
                                                                    value={selectedMedicine.qty}
                                                                    onChange={(e) => handleAddMedicine(e, "qty")}
                                                                />
                                                                {alertMessage && (
                                                                    <p className="text-xs text-red-600"><span class="font-medium">Error!</span> {alertMessage}</p>
                                                                )}
   

                                                                <label className="block text-sm font-medium text-gray-700">Frequency:</label>
                                                                <select 
                                                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                                                                    onChange={(e) => handleAddMedicine(e, "frequency")}>
                                                                    <option>Select options</option>
                                                                    <option value="once a day">once a day</option>
                                                                    <option value="twice a day">twice a day</option>
                                                                    <option value="every other day">every other day</option>
                                                                    <option value="every 12 hours">every 12 hours</option>
                                                                </select>

                                                                <label className="block text-sm font-medium text-gray-700">Sig:</label>
                                                                <textarea 
                                                                    type="text"
                                                                    className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                                                                    value={selectedMedicine.sig}
                                                                    onChange={(e) => handleAddMedicine(e, "sig")}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={backToList}
                                                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                                                >&larr; Back
                                                                </button>
                                                                <button
                                                                    onClick={() => handleSubmitButton({
                                                                        link: "add-medicine",
                                                                        qty: selectedMedicine.qty,
                                                                        id: selectedMedicine.id
                                                                    })}
                                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                                                                    Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-col w-full h-58 border border-l-gray-500">
                                                <div className="overflow-y-auto scroll-custom h-full">
                                                    {addedMedicine.map((data, index) => (
                                                        <div 
                                                            key={data.id} 
                                                            className="p-2 hover:bg-gray-200 cursor-pointer text-sm text-gray-500"
                                                            // onClick={() => moveItemToLeft(item.id)}
                                                        >
                                                            {`${data?.medicine.generic_name} (${data.dose})`}
                                                        </div>
                                                    ))}

                                                    {/* {medicationList?.filter(data => data.status === 'ps').map((data) => (
                                                        <div 
                                                            key={data.id} 
                                                            className="p-2 hover:bg-gray-200 cursor-pointer text-sm text-gray-500"
                                                            // onClick={() => moveItemToLeft(item.id)}
                                                        >
                                                            {`${data?.medicine.generic_name} (${data.dose})`}
                                                        </div>
                                                    ))} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    

                                    
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </AppLayout>
    )
}

export default SubModule