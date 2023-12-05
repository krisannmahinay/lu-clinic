import React, { useState, useRef, useEffect } from "react"
import SearchItemPage from "../SearchItemPage"
import Modal from "../Modal"
import Form from "../Form"
import Table from "../Table"
import Button from "../Button"
import ItemPerPage from "../ItemPerPage"
import SearchExport from "../SearchExport"
import Dropdown from "../Dropdown"
import Pagination from "../Pagination"
import SkeletonScreen from "../SkeletonScreen"
import { DropdownExport } from "../DropdownLink"
import { useGetHospitalChargeQuery } from "@/service/chargeService"
import Alert from "../Alert"


const hospitalCharge = [
    {charge_category: "Category Charge 1", charge_type: "Procedures", code: "PCC11"},
    {charge_category: "Biochemistry", charge_type: "Investigations", code: "ABG's"},
    {charge_category: "General Surgery", charge_type: "Operation Theatre", code: "Knee Surgery"},
]

const hospitalChargeType = [
    {charge_type: "Procedures"},
]

const hospitalEmergencyCharge = [
    {doctor: "Procedures", standard_charge: 20},
]

const hospitalOPDCharge = [
    {doctor: "Procedures", standard_charge: 20},
]

const hospitalChargeCategory = [
    {name: "OT Charges", decscription: "OT Charges", charge_type: "Operation Theatre"},
]


const renderModalContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge Type</label>
                        <select
                            name=""
                            value=""
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                        >
                            <option value="">Select option</option>
                            <option value="">Test</option>
                            
                        </select>
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge Category</label>
                        <select
                            name=""
                            value=""
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                        >
                            <option value="">Select option</option>
                            <option value="">Test</option>
                            
                        </select>
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Code</label>
                        <input type="text" placeholder="Enter code" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Standard Charge</label>
                        <input type="text" placeholder="Enter code" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                        <textarea type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"  />
                    </div>
                </div>
            )

        case 'tab2':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                        <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                        <textarea type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"  />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge Type</label>
                        <select
                            name=""
                            value=""
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                        >
                            <option value="">Select option</option>
                            <option value="">Test</option>
                            
                        </select>
                    </div>
                </div>
            )

        case 'tab3':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Doctor</label>
                        <select
                            name=""
                            value=""
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                        >
                            <option value="">Select option</option>
                            <option value="">Test</option>
                            
                        </select>
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Standard Charge</label>
                        <input type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>
                </div>
            )

        case 'tab4':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Doctor</label>
                        <select
                            name=""
                            value=""
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                        >
                            <option value="">Select option</option>
                            <option value="">Test</option>
                            
                        </select>
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Standard Charge</label>
                        <input type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>
                </div>
            )

        case 'tab5':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge type</label>
                        <input type="text" placeholder="Enter charge type" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>
                </div>
            )

        default:
            return null
    }
}

const HospitalCharge = ({
    slug,
    hosptlChargeTypeData,
    hosptlChargeCategoryData,
    hosptlPhysicianListData
}) => {
    const formRef = useRef(null)
    const [activeTab, setActiveTab] = useState('tab1')
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [btnSpinner, setBtnSpinner] = useState(false)
    const [activeContent, setActiveContent] = useState("yellow")

    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")

    
    const { 
        data: hospitalCharge, 
        isLoading: hospitalChargeLoading, 
        isError: hospitalChargeError, 
        isSuccess: hospitalChargeSuccess,
        // refetch
    } = useGetHospitalChargeQuery({
        items: itemsPerPage,
        tabs: activeTab,
        page: currentPage,
    }, {
        enabled: !!activeTab
    })

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

    const hospitalChargeMaster = hospitalCharge?.data ?? []
    const pagination = hospitalCharge?.pagination ?? []
    const header = hospitalCharge?.columns ?? []

    // console.log(hosptlPhysicianListData)
    const chargeTypeOption = hosptlChargeTypeData?.map(type => ({
        value: type?.id,
        label: type?.name
    }))

    const chargeCategoryOption = hosptlChargeCategoryData?.map(category => ({
        value: category?.id,
        label: category?.name
    }))

    const chargeTab = [
        {
            name: 'charge_type', 
            type: 'dropdown', 
            label: 'Charge Type',
            options: chargeTypeOption
        },
        {
            name: 'charge_category',
            type: 'dropdown',
            label: 'Charge Category',
            options: chargeCategoryOption
        },
        {name: 'code', type: 'text', label: 'Code', placeholder: 'Enter code'},
        {name: 'standard_charge', type: 'number', label: 'Standard Charge', placeholder: 'Enter standard charge'}
    ]
    
    const chargeCategoryTab = [
        {name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name'},
        {name: 'description', type: 'text', label: 'Description', placeholder: 'Enter description'},
        {
            name: 'charge_type', 
            type: 'dropdown', 
            label: 'Charge Type',
            options: chargeTypeOption
        },
    ]

    // physician list
    const physicianChargeOption = hosptlPhysicianListData?.map(physician => ({
        value: physician?.user_id,
        label: `Dr. ${physician?.identity?.first_name} ${physician?.identity?.last_name}`
    }))
    
    const physicianChargeOPD = [
        {
            name: 'doctor_opd',
            type: 'dropdown',
            label: 'Doctor',
            options: physicianChargeOption
        },
        {name: 'standard_charge', type: 'number', label: 'Standard Charge', placeholder: 'Enter standard charge'}
    ]
    
    const physicianChargeER = [
        {
            name: 'doctor_er',
            type: 'dropdown',
            label: 'Doctor',
            options: physicianChargeOption
        },
        {name: 'standard_charge', type: 'number', label: 'Standard Charge', placeholder: 'Enter standard charge'}
    ]
    
    const chargeType = [
        {name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name'},
    ]
    

    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleExportToPDF = () => {
        
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
    }

    const handleRefetch = () => {
        setItemsPerPage(prev => prev + 1)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleSubmitButton = (tabs) => {
        if(tabs === 'tab1') {
            formRef.current.handleSubmit('createHosptlCharge')
        } else if(tabs === 'tab2') {
            formRef.current.handleSubmit('createHosptlChargeCat')
        } else if(tabs === 'tab3') {
            formRef.current.handleSubmit('createHosptlPhyChargeOpd')
        } else if(tabs === 'tab4') {
            formRef.current.handleSubmit('createHosptlPhyChargeEr')
        } else if(tabs === 'tab5') {
            formRef.current.handleSubmit('createHosptlChargeType')
        }
    }

    const renderTableContent = () => {
        return (
            <>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {header.filter(tblHeader => tblHeader !== 'id').map((tblHeader, tblHeaderIndex) => (
                                <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {tblHeader === 'charge_type_id' ? (
                                        'CHARGE_TYPE'
                                    ) : tblHeader === 'charge_category_id' ? (
                                        'CHARGE_CATEGORY'
                                    ) : tblHeader === 'doctor_id' ? (
                                        'doctor'
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
                        {hospitalChargeMaster.length === 0 ? (
                            <tr>
                                <td colSpan={header.length + 1} className="px-6 py-2 text-center">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            hospitalChargeMaster.map((tblBody, tblBodyIndex) => (
                                // <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
                                <tr key={tblBodyIndex}>
                                    {header.filter(tblHeader => tblHeader !== 'id').map((tblHeader) => (
                                        <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm">
                                            {tblHeader === 'charge_type_id' ? (
                                                tblBody?.charge_type?.name
                                            ) : tblHeader === 'charge_category_id' ? (
                                                tblBody?.charge_category?.name
                                            ) : tblHeader === 'doctor_id' ? (
                                                `Dr ${tblBody?.identity?.first_name} ${tblBody?.identity?.last_name}` 
                                            ) : (
                                                tblBody[tblHeader]
                                            )}
                                        </td>
                                    ))}
    
                                    <td className="px-6 py-2 whitespace-nowrap">    
                                        {/* <button title="Add Modules" type="button" onClick={() => openModal(tblBody.user_id)}> */}
                                        <button title="Add Modules" type="button">
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
            </>
        )
    }
    
    const renderTableContentByTab = (tab) => {
        switch(tab) {
            case 'tab1':
                return (
                    <Table 
                        title="User List" 
                        disableTable={true}
                        onOpenModal={(id) => setModalId(id)}
                    >
                        {renderTableContent()}
                    </Table>
                )
    
            case 'tab2':
                return (
                    <Table 
                        title="User List" 
                        disableTable={true}
                        onOpenModal={(id) => setModalId(id)}
                    >
                        {renderTableContent()}
                    </Table>
                )
    
            case 'tab3':
                return (
                    <Table 
                        title="User List" 
                        disableTable={true}
                        onOpenModal={(id) => setModalId(id)}
                    >
                        {renderTableContent()}
                    </Table>
                )
    
            case 'tab4':
                return (
                    <Table 
                        title="User List" 
                        disableTable={true}
                        onOpenModal={(id) => setModalId(id)}
                    >
                        {renderTableContent()}
                    </Table>
                )
    
            case 'tab5':
                return (
                    <Table 
                        title="User List" 
                        disableTable={true}
                        onOpenModal={(id) => setModalId(id)}
                    >
                        {renderTableContent()}
                    </Table>
                )
    
            default:
                return null
        }
    }

    const renderContent = () => {
        return (
            <>
                <div className="flex relative overflow-hidden h-screen">
                    <div className="absolute inset-0 w-full">
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0`}>
                            <div className="font-bold text-xl mb-2 uppercase text-gray-600">Hospital Charges</div>
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
                                <div className="flex justify-items-center">
                                    <div className="rounded-tl-lg py-3 ml-3">
                                        <button 
                                            onClick={() => setActiveTab('tab1')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Charges
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab2')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Charge Category
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab3')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Doctor OPD Charge
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab4')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Doctor Emergency Charge
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab5')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Charge Type
                                        </button>
                                    </div>
                                </div>

                                {hospitalChargeLoading ? (
                                    <div className="grid p-3 gap-y-2">
                                        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="tab-content">
                                        {renderTableContentByTab(activeTab)}
                                    </div>
                                )}
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
                                        onClick={() => handleSubmitButton(activeTab)}
                                    >
                                        {btnSpinner ? '' : 'Submit'}
                                    </Button>
                                </div>
                            </div>

                            {activeTab === 'tab1' && (
                                <Form 
                                    ref={formRef} 
                                    initialFields={chargeTab}
                                    onSuccess={handleRefetch}
                                    onLoading={(data) => setBtnSpinner(data)}
                                    onSetAlertType={(data) => setAlertType(data)}
                                    onCloseSlider={() => setActiveContent("yellow")}
                                    onSetAlertMessage={(data) => setAlertMessage(data)}
                                />
                            )}

                            {activeTab === 'tab2' && (
                                <Form 
                                    ref={formRef} 
                                    initialFields={chargeCategoryTab}
                                    onSuccess={handleRefetch}
                                    onLoading={(data) => setBtnSpinner(data)}
                                    onSetAlertType={(data) => setAlertType(data)}
                                    onCloseSlider={() => setActiveContent("yellow")}
                                    onSetAlertMessage={(data) => setAlertMessage(data)}
                                />
                            )}

                            {activeTab === 'tab3' && (
                                <Form 
                                    ref={formRef} 
                                    initialFields={physicianChargeOPD}
                                    onSuccess={handleRefetch}
                                    onLoading={(data) => setBtnSpinner(data)}
                                    onSetAlertType={(data) => setAlertType(data)}
                                    onCloseSlider={() => setActiveContent("yellow")}
                                    onSetAlertMessage={(data) => setAlertMessage(data)}
                                />
                            )}

                            {activeTab === 'tab4' && (
                                <Form 
                                    ref={formRef} 
                                    initialFields={physicianChargeER}
                                    onSuccess={handleRefetch}
                                    onLoading={(data) => setBtnSpinner(data)}
                                    onSetAlertType={(data) => setAlertType(data)}
                                    onCloseSlider={() => setActiveContent("yellow")}
                                    onSetAlertMessage={(data) => setAlertMessage(data)}
                                />
                            )}

                            {activeTab === 'tab5' && (
                                <Form 
                                    ref={formRef} 
                                    initialFields={chargeType}
                                    onSuccess={handleRefetch}
                                    onLoading={(data) => setBtnSpinner(data)}
                                    onSetAlertType={(data) => setAlertType(data)}
                                    onCloseSlider={() => setActiveContent("yellow")}
                                    onSetAlertMessage={(data) => setAlertMessage(data)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div>
            <Modal 
                slug={slug}
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {renderModalContentByTab(activeTab)}
            </Modal>

            {alertMessage &&
                <Alert 
                    alertType={alertType}
                    isOpen={alertType !== ""}
                    onClose={handleAlertClose}
                    message={alertMessage} 
                /> 
            }


            {renderContent()}
            
        </div>
    )
}

export default HospitalCharge