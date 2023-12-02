import React, { useState, useEffect, useRef } from "react"
import Table from "../Table"
import Modal from "../Modal"
import SearchItemPage from "../SearchItemPage"
import Button from "../Button"
import SearchExport from "../SearchExport"
import ItemPerPage from "../ItemPerPage"
import Pagination from "../Pagination"
import Dropdown from "../Dropdown"
import Form from "../Form"
import SkeletonScreen from "../SkeletonScreen"
import { DropdownExport } from "../DropdownLink"
import { 
    useGetBedListQuery,
    useGetBedFloorListQuery,
    useGetBedTypeListQuery,
    useGetBedGroupListQuery
} from '../../service/settingService'
import Alert from "../Alert"

const Bed = ({slug}) => {
    const fieldRef = useRef(null)
    const formRef = useRef(null)
    const [activeTab, setActiveTab] = useState('tab2')
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [activeContent, setActiveContent] = useState("yellow")
    const [btnSpinner, setBtnSpinner] = useState(false)
    const [tableHeader, setTableHeader] = useState([])
    const [floorId, setFloorId] = useState(0)
    
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")

    const { 
        data: bedData, 
        isLoading: bedLoading, 
        isError: bedError, 
        isSuccess: bedSuccess,
        // refetch
    } = useGetBedListQuery({
        items: itemsPerPage,
        tabs: activeTab,
        page: currentPage,
    },{
        enabled:!!activeTab
    })

    const { data: floorMaster } = useGetBedFloorListQuery()
    const { data: typeMaster } = useGetBedTypeListQuery()
    const { data: groupMaster } = useGetBedGroupListQuery()

    const bedMaster = bedData?.data ?? []
    const pagination = bedData?.pagination ?? []
    const header = bedData?.columns ?? []
    
    // console.log(bedLoading)

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

    // tab 2
    const bedTypeOptions = typeMaster?.map(type => ({
        value: type?.id,
        label: type?.name
    }))
    
    // tab 2
    const bedGroupOptions = groupMaster?.map(group => ({
        value: group?.id,
        label:`${group?.name} - ${group?.bed_floor?.floor}`,
    }))
    
    // tab 2
    const bedListTab = [
        {name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name'},
        {
            name: 'bed_type', 
            type: 'dropdown', 
            label: 'Bed Type',
            options: bedTypeOptions
        },
        {
            name: 'bed_group',
            type: 'dropdown',
            label: 'Bed Group',
            options: bedGroupOptions
        }
    ]

    // tab 3
    const bedTypeTab = [
        {name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name'}
    ]

    // tab 4
    const bedFloorOptions = floorMaster?.map(floor => ({
        value: floor?.id,
        label: floor?.floor
    }))
    // tab 4
    const bedGroupTab = [
        {name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name'},
        {
            name: 'bed_floor', 
            type: 'dropdown', 
            label: 'Bed Floor',
            options: bedFloorOptions
        },
        {name: 'description', type: 'text', label: 'Description', placeholder: 'Enter description'},
    ]

    // tab 5
    const bedFloorTab = [
        {name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name'},
        {name: 'description', type: 'text', label: 'Description', placeholder: 'Enter description'},
    ]

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(e.target.value)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = (q) => {
        setSearchQuery(q)
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

    const handleNewPage = (newPage) => {
        setCurrentPage(newPage)
        // setRefetchData(true)
        // setItemsPerPage(prev => prev + 1)
    }

    const handleSubmitButton = (tabs) => {
        if(tabs === 'tab5') {
            formRef.current.handleSubmit('createBedFloor')
        } else if(tabs === 'tab4') {
            formRef.current.handleSubmit('createBedGroup')
        } else if(tabs === 'tab3') {
            formRef.current.handleSubmit('createBedType')
        } else if(tabs === 'tab2') {
            formRef.current.handleSubmit('createBed')
        }
    }

    const addRow = () => {
        fieldRef.current.handleAddRow()
    }
    
    const renderTableContent = () => {
        return (
            <>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {header.filter(tblHeader => tblHeader !== 'id').map((tblHeader, tblHeaderIndex) => (
                                <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {tblHeader === 'floor_id' ? (
                                        'floor'
                                    ) : tblHeader === 'bed_type_id' ? (
                                        'bed_type'
                                    ) : tblHeader === 'bed_group_id' ? (
                                        'bed_group'
                                    ) : tblHeader === 'is_active' ? (
                                        'status'
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
                        {bedMaster.length === 0 ? (
                            <tr>
                                <td colSpan={header.length + 1} className="px-6 py-2 text-center">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            bedMaster.map((tblBody, tblBodyIndex) => (
                                // <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
                                <tr key={tblBodyIndex} className="hover:bg-gray-100">
                                    {header.filter(tblHeader => tblHeader !== 'id').map((tblHeader) => (
                                        <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm ">
                                            {tblHeader === 'floor_id' ? (
                                                tblBody?.bed_floor.floor
                                            ) : tblHeader === 'bed_type_id' ? (
                                                tblBody?.bed_type.name
                                            ) : tblHeader === 'bed_group_id' ? (
                                                `${tblBody?.bed_group.name} - ${tblBody?.bed_group?.bed_floor.floor}`
                                            ) : tblHeader === 'is_active' ? (
                                                tblBody?.is_active ? (
                                                    <span className="bg-green-400 p-1 rounded-md">Available</span>
                                                ) : (
                                                    <span className="bg-red-400 p-1 rounded-md ">Alotted</span>
                                                )
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
            </>
        )
    }

    const renderTableContentByTab = (tab) => {
        switch(tab) {
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

    const renderModalContentByTab = (tab) => {
        switch(tab) {
            case 'tab2':
                return (
                    <div className="w-80">
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                        </div>
    
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Bed Type</label>
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
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Bed Group</label>
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
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                        </div>
                    </div>
                )
    
            case 'tab4':
                return (
                    <div className="w-80">
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                        </div>
    
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Floor</label>
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
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                            <textarea type="text" placeholder="Enter description" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                        </div>
                    </div>
                )
    
            case 'tab5':
                return (
                    <div className="w-80">
                        <div className="flex flex-col w-full">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter charge type"
                                className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                            />
                        </div>
                    </div>
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
                            <div className="font-bold text-xl mb-2 uppercase text-gray-600">Bed Management</div>
                            <div className="flex justify-between py-1">
                                {activeTab !== 'tab1' && (
                                    <Button
                                        btnIcon="add"
                                        onClick={() => setActiveContent("green")}
                                    >
                                    Add
                                    </Button>
                                )}

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
                                            onClick={() => setActiveTab('tab2')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Bed List
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab3')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Bed Type
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab4')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Bed Group
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab5')}
                                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Floor
                                        </button>
                                    </div>
                                </div>

                                
                                {bedLoading ? (
                                    <div className="p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className='w-10 h-10 animate-spin text-gray-400' viewBox="0 0 100 100" fill="none">
                                            <circle cx="50" cy="50" r="32" stroke-width="8" stroke="currentColor" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round"/>
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="tab-content">
                                        {renderTableContentByTab(activeTab)}
                                    </div>
                                )}
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

                            {activeTab === 'tab2' && (
                                <Form 
                                    ref={formRef} 
                                    initialFields={bedListTab}
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
                                    initialFields={bedTypeTab}
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
                                    initialFields={bedGroupTab}
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
                                    initialFields={bedFloorTab}
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

export default Bed