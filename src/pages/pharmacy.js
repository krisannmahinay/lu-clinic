import { useState, useEffect } from 'react'
import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import withAuth from './withAuth'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import SearchItemPage from '@/components/SearchItemPage'
import Alert from '@/components/Alert'
import Modal from '@/components/Modal'
import Select from 'react-select'

const pharmacyData = [
    {medicine_name: "10CC DISPOSABLE SYRINGE BM", medical_company: "", medical_composition: "", medical_category: "Medicine", medicine_group: "", unit: 1, available_qty: ""},
    {medicine_name: "1CC BD DISPOSABLE SYRING", medical_company: "BD", medical_composition: "SYRING", medical_category: "Medicine", medicine_group: "SURGICAL", unit: 1, available_qty: ""},
    {medicine_name: "1CC BD DISPOSABLE SYRING", medical_company: "BD", medical_composition: "SYRING", medical_category: "Medicine", medicine_group: "SURGICAL", unit: 1, available_qty: ""},
] 

const medCategoryData = [
    {label: "Medicine", value: "medical"},
    {label: "Surgical", value: "surgical"}
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

const Pharmacy = () => {
    const moduleId = "pharmacy"
    const menuGroup = "dashboard"
    
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState([])
    // const [totalPages, setTotalPages] = useState(0)

    const handleSearch = (q) => {
        setSearchQuery(q)
    }

    const handleNewPage = (newPage) => {
        setCurrentPage(newPage)
        // setRefetchData(true)
        // setItemsPerPage(prev => prev + 1)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
    }

    const handleExportToPDF = () => {
        
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleRefetch = () => {
        setItemsPerPage(prev => prev + 1)
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
    }

    const handleMedCategory = () => {

    }

    const labelCss = "ml-2 mb-2 text-gray-500 font-bold uppercase text-xs"
    const renderContentBySlug = (slug) => {
        switch(slug) {
            case 'pharmacy':
                return (
                    <div className="w-full">
                        <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Medicine Name</label>
                                <input type="text" name="medName" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className={labelCss}>Medicine Category</label>
                                <Select 
                                    options={medCategoryData?.map(med => ({ value: med.value, label: med.label }))}
                                    onChange={handleMedCategory}
                                    isSearchable={true}
                                    isClearable={true}
                                    placeholder="Select option..."
                                    classNamePrefix="react-select"
                                    styles={styleDropdown} 
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Medicine Company</label>
                                <input type="text" name="medCompany" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Medicine Composition</label>
                                <input type="text" name="medCompose" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Medicine Group</label>
                                <input type="text" name="medGroup" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Unit</label>
                                <input type="text" name="medUnit" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Min Level</label>
                                <input type="text" name="medMinLevel" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Re-Order Level</label>
                                <input type="text" name="medReOrder" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">VAT(%)</label>
                                <input type="text" name="medVat" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Unit/Packing</label>
                                <input type="text" name="medMinLevel" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">VAT A/C</label>
                                <input type="text" name="medReOrder" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Note</label>
                                <textarea type="text" name="medVat" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
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
            moduleId={moduleId}
            menuGroup={menuGroup}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pharmacy
                </h2>
            }>
            <Head>
                <title>Pharmacy</title>
            </Head>

            <div className="pt-[8rem]">
                {alertMessage &&
                    <Alert 
                        alertType={alertType}
                        isOpen={alertType !== ""}
                        onClose={handleAlertClose}
                        message={alertMessage} 
                    /> 
                }

                <Modal 
                    // title={title}
                    slug={moduleId} 
                    isOpen={isModalOpen} 
                    onClose={closeModal}
                    onSuccess={handleRefetch}
                    onSetAlertType={(data) => setAlertType(data)}
                    onSetAlertMessage={(data) => setAlertMessage(data)}
                    // permission={permission} 
                    // selectedRowId={selectedRows}
                >
                    {renderContentBySlug(moduleId)}
                </Modal>

                <>
                    <SearchItemPage
                        action={true}
                        onExportToPDF={handleExportToPDF}
                        onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                        onCurrentPage={(page) => handleCurrentPage(page)}
                        // onSearchResults={(results) => handleSearchResults(results)}
                        onSearch={(q) => handleSearch(q)}
                        onAddClicked={() => setIsModalOpen(true)}
                    />
                    
                    <Table 
                        title="User List" 
                        tableData={pharmacyData} 
                        tableHeader={Object.keys(pharmacyData[0])}
                        // isLoading={userListLoading}
                        // onOpenModal={(id) => setModalId(id)}
                    />

                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={currentPage}
                        // onPageChange={newPage => setCurrentPage(newPage)}
                        onPageChange={(newPage) => handleNewPage(newPage)}
                    />
                </>
            </div>
        </AppLayout>
    )
}

export default withAuth(Pharmacy)