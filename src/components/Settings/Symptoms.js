import React, { useState, useEffect } from "react"
import SearchItemPage from "../SearchItemPage"
import Modal from "../Modal"
import Table from "../Table"
import { useComponentContext } from "@/utils/context"

const symptomsHead = [
    {symptoms_head: "Allergy", symptoms_type: "", symptoms_description: ""}
]

const symptomsType = [
    {symptoms_head: "Allergy"}
]

const renderModalContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Head</label>
                        <input type="text" placeholder="Enter symptoms" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Type</label>
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

        case 'tab2':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Type</label>
                        <input type="text" placeholder="Enter charge type" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>
                </div>
            )
        
        default:
            return null
    }
}


const renderTableContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <Table 
                    title="User List" 
                    tableData={symptomsHead} 
                    action={false}
                    tableHeader={Object.keys(symptomsHead[0])}
                    // isLoading={userListLoading}
                />
            )

        case 'tab2':
            return (
                <Table 
                    title="User List" 
                    tableData={symptomsType} 
                    action={false}
                    tableHeader={Object.keys(symptomsType[0])}
                    // isLoading={userListLoading}
                />
            )

        default:
            return null
    }
}

const Symptoms = ({slug}) => {
    const [activeTab, setActiveTab] = useState('tab1')
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const componentContext = useComponentContext()
    const [state, setState] = useState({
        selectedTd: null,
        isShowedForm: false,
        selectedMedicine: null,
    })

    const handleOnClick = (data) => {
        switch(data.type) {
            case 'tabClicked':
                setActiveTab(data.value)
                break
            case 'rowClicked':
                setState(prev => ({
                    ...prev,
                    isShowedForm: true,
                    selectedTd: data.value
                }))
                break
            case 'backBtn':
                setState(prev => ({
                    ...prev,
                    isShowedForm: false,
                    selectedTd: null,
                }))
                break

            case 'submitMedicine':
                componentContext?.onSubmitData({type: data.type, value: data.value})
                setState(prev => ({
                    ...prev,
                    isShowedForm: false,
                    selectedTd: null,
                }))
            default:
                break
        }
    }

    const renderTableContent = (data) => {
        return (
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        {data.tableHeader?.map((tblHeader, tblHeaderIndex) => (
                            <th key={tblHeaderIndex} className="px-6 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tblHeader}</th>
                        ))}
                    </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.tableData.length === 0 ? (
                        <tr>
                            <td colSpan={data.tableHeader?.length + 1} className="px-6 py-2 text-center">
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        data.tableData.map((tblBody, tblBodyIndex) => (
                            <tr key={tblBody.id} onClick={() => {handleOnClick({type: "rowClicked", value: tblBody})}} className="hover:bg-gray-200">
                                {data.tableHeader?.map((tblHeader) => (
                                    <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm cursor-pointer">{tblBody[tblHeader]}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        )
    }

    const renderContent = (data) => {
        switch(data) {
            case 'tab1':
                return (
                    renderTableContent({
                        tableData: componentContext?.state?.symptomsData,
                        tableHeader: componentContext?.state?.header
                    })
                )
                
            default:
                return null
        }
    }

    return (
        <div>
            {renderContent(componentContext?.state?.activeTab)}
        </div>
    )
}

export default Symptoms