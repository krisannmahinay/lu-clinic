import React, { useState, useEffect } from "react"
import SearchItemPage from "../SearchItemPage"
import Modal from "../Modal"
import Table from "../Table"

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

const renderTableContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <Table 
                    title="User List" 
                    tableData={hospitalCharge} 
                    action={false}
                    tableHeader={Object.keys(hospitalCharge[0])}
                    // isLoading={userListLoading}
                />
            )

        case 'tab2':
            return (
                <Table 
                    title="User List" 
                    tableData={hospitalChargeCategory} 
                    action={false}
                    tableHeader={Object.keys(hospitalChargeCategory[0])}
                    // isLoading={userListLoading}
                />
            )

        case 'tab3':
            return (
                <Table 
                    title="User List" 
                    tableData={hospitalOPDCharge} 
                    action={false}
                    tableHeader={Object.keys(hospitalOPDCharge[0])}
                    // isLoading={userListLoading}
                />
            )

        case 'tab4':
            return (
                <Table 
                    title="User List" 
                    tableData={hospitalEmergencyCharge} 
                    action={false}
                    tableHeader={Object.keys(hospitalEmergencyCharge[0])}
                    // isLoading={userListLoading}
                />
            )

        case 'tab5':
            return (
                <Table 
                    title="User List" 
                    tableData={hospitalChargeType} 
                    action={false}
                    tableHeader={Object.keys(hospitalChargeType[0])}
                    // isLoading={userListLoading}
                />
            )

        default:
            return null
    }
}


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

const HospitalCharge = ({slug}) => {
    const [activeTab, setActiveTab] = useState('tab1')
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = (q) => {
        setSearchQuery(q)
    }

    const handleExportToPDF = () => {
        
    }

    const closeModal = () => {
        setIsModalOpen(false)
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

            <SearchItemPage
                action={true}
                onExportToPDF={handleExportToPDF}
                onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                onCurrentPage={(page) => handleCurrentPage(page)}
                onSearch={(q) => handleSearch(q)}
                onAddClicked={() => setIsModalOpen(true)}
            />

            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border rounded-lg">
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

                    <div className="tab-content">
                        {renderTableContentByTab(activeTab)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HospitalCharge