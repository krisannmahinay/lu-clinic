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
    useGetPhysicianListQuery
} from '@/service/patientService'
import Alert from '@/components/Alert'

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
    const patientData = patientList?.data ?? []
    const pagination = patientList?.pagination ?? []
    const header = patientList?.columns ?? []

    // console.log(patientData)
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

    const handleSearch = (q) => {
        setSearchQuery(q)
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
    }

    const handleRefetch = () => {
        setItemsPerPage(prev => prev + 1)
    }

    const closeModal = () => {
        // setSelectedRows([])
        setIsModalOpen(false)
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
                                <tr key={tblBodyIndex}>
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
                                        <button title="Add Modules" type="button" onClick={() => openModal(tblBody.user_id)}>
                                            {/* <span>ADD</span> */}
                                            <svg fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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
                                        onClick={() => setActiveContent("green")}
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
                                        onOpenModal={(id) => setModalId(id)}
                                    >
                                        {renderTableContent()}
                                    </Table>
                                </div>

                                <div className="flex flex-wrap py-2">
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
                                            <span className="mr-2 mx-2 text-gray-700">Per Page:</span>
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
                <title>Laravel - {slug}</title>
            </Head>
            
            <div className="p-8">
                <Modal 
                    // title={title}
                    // charges={true} 
                    slug={slug}
                    isOpen={isModalOpen}
                    tabNumber={activeTab}
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