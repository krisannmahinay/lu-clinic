import Head from 'next/head'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AppLayout from "@/components/Layouts/AppLayout"
import NavTab from "@/components/NavTab"
import CustomCKEditor from '@/components/CustomCKEditor'
import SearchItemPage from '@/components/SearchItemPage'
import { useGetUserDetailsQuery } from '@/service/authService'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import Accordion from '@/components/Accordion'
// import CKEditor from "@/components/CKEditor5"
// import Cus

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

const bedStatus = [
    {name: "Bed 1", bed_type: "Normal", bed_group: "General Ward - 1st Floor", floor: "1st Floor", status: "allotted"},
]

const bedList = [
    {name: "Bed 1", bed_type: "Normal", bed_group: "General Ward - 1st Floor"},
]

const bedType = [
    {purpose: "Normal"},
]

const bedGroup = [
    {name: "General Ward", floor: "1st Floor", description: ""},
]

const bedFloor = [
    {name: "1st Floor", description: ""},
]

const symptomsHead = [
    {symptoms_head: "Allergy", symptoms_type: "", symptoms_description: ""}
]

const symptomsType = [
    {symptoms_head: "Allergy"}
]

const panthologyCategory = [
    {category_name: ""}
]

const panthologyUnit = [
    {unit_name: ""}
]

const panthologyParams = [
    {param_name: "", reference_range:"", unit: "", description: ""}
]

const radiologyCategory = [
    {name: ""}
]

const radiologyUnit = [
    {unit_name: ""}
]

const radiologyParams = [
    {unit_name: ""}
]

const itemCategory = [
    {item_category: ""}
]

const itemStore = [
    {item_store_name: "", item_stock_code: ""}
]

const itemSupplier = [
    {item_supplier: "", contact_person: "", address: ""}
]

const SubModule = () => {
    
    const router = useRouter()
    const { slug } = router.query
    const menuGroup = "settings"
    
    const { data: data, isError: dataError, refetch: refetchUserDetails } = useGetUserDetailsQuery()

    const [activeTab, setActiveTab] = useState('tab1')
    const [editorData, setEditorData] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    
    const userDetails = data?.data ?? []

    console.log(userDetails.roles)
    
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
        // setSelectedRows([])
        setIsModalOpen(false)
    }

    // console.log(hospitalCharge)

    // useEffect(() => {
    //     setEditorLoaded(true);
    // }, [])


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
                {slug === 'system' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">System Configuration</div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>home
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>about us
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>services
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>doctors
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab5' ? 'bg-white':'bg-gray-200'}`}>contact us
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <>
                                            <div className="flex justify-items-start">
                                                <button type="button" className="bg-green-500 hover:bg-green-600 text-white ml-2 mb-4 mr-2 px-4 py-2 focus:outline-none flex items-center space-x-2 rounded">
                                                    <span>SAVE</span> 
                                                    <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>

                                                <button className="bg-sky-500 hover:bg-sky-600 text-white mb-4 mr-2 px-4 py-2 focus:outline-none flex items-center space-x-2 rounded">
                                                    <span>PUBLISHED</span> 
                                                    <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <CustomCKEditor onChange={(data) => setEditorData(data)}/>
                                        </>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <h1>tab2</h1>
                                    )}
                                    {activeTab === 'tab3' && (
                                       
                                       <h1>tab3</h1>
                                    )}
                                    {activeTab === 'tab4' && (
                                        
                                       <h1>tab4</h1>
                                    )}
                                    {activeTab === 'tab5' && (
                                        
                                       <h1>tab3</h1>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'hr' && (
                    <>
                    
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Human Resource</div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    {/* <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>hris
                                    </button> */}
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>leave type
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>department
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>designation
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>specialist
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <h1>tab1</h1>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <h1>tab2</h1>
                                    )}
                                    {activeTab === 'tab3' && (
                                       
                                       <h1>tab3</h1>
                                    )}
                                    {activeTab === 'tab4' && (
                                        
                                       <h1>tab4</h1>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'charges' && (
                    <>
                    
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Hospital Charges</div>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    {/* <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>hris
                                    </button> */}
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm rounded-tl-lg text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Charges
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Charge Category
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Doctor OPD Charge
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>Doctor Emergency Charge
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab5')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab5' ? 'bg-white':'bg-gray-200'}`}>Charge Type
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <>
                                            

                                            <Table 
                                                title="User List" 
                                                user={hospitalCharge} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(hospitalCharge[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <Table 
                                            title="User List" 
                                            user={hospitalChargeCategory} 
                                            action={false}
                                            // permission={permissionData} 
                                            // module={moduleData} 
                                            tableHeader={Object.keys(hospitalChargeCategory[0])}
                                            // isLoading={userListLoading}
                                            // onOpenModal={handleOpenModal}
                                        />
                                    )}
                                    {activeTab === 'tab3' && (
                                       
                                       <Table 
                                                title="User List" 
                                                user={hospitalOPDCharge} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(hospitalOPDCharge[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                        />
                                    )}
                                    {activeTab === 'tab4' && (
                                        
                                        <Table 
                                                title="User List" 
                                                user={hospitalEmergencyCharge} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(hospitalEmergencyCharge[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                        />
                                    )}
                                    {activeTab === 'tab5' && (
                                        
                                        <Table 
                                                title="User List" 
                                                user={hospitalChargeType} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(hospitalChargeType[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'bed' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Bed Management</div>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    {/* <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>hris
                                    </button> */}
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Bed Status
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Bed List
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Bed Type
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>Bed Group
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab5')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab5' ? 'bg-white':'bg-gray-200'}`}>Floor
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={bedStatus} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(bedStatus[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={bedList} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(bedList[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab3' && (
                                       <>
                                            <Table 
                                                title="User List" 
                                                user={bedType} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(bedType[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab4' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={bedGroup} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(bedGroup[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab5' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={bedFloor} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(bedFloor[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'symptoms' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Symptoms</div>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm rounded-tl-lg text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Symptoms Head
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Symptoms Type
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={symptomsHead} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(symptomsHead[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={symptomsType} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(symptomsType[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'pharmacy' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Pharmacy</div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Medicine Category
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Supplier
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Medicine Dosage
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>Medicine Instruction
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab4')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab5' ? 'bg-white':'bg-gray-200'}`}>Medicine Precaution
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <h1>tab1</h1>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <h1>tab2</h1>
                                    )}
                                    {activeTab === 'tab3' && (
                                       
                                       <h1>tab3</h1>
                                    )}
                                    {activeTab === 'tab4' && (
                                        
                                       <h1>tab4</h1>
                                    )}
                                    {activeTab === 'tab5' && (
                                        
                                       <h1>tab3</h1>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'panthology' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Phantology</div>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Phantology Category
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Unit
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Phantology Parameter
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={panthologyCategory} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(panthologyCategory[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={panthologyUnit} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(panthologyUnit[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab3' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={panthologyParams} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(panthologyParams[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'radiology' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Radiology</div>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Radiology Category
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Unit
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Radiology Parameter
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={radiologyCategory} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(radiologyCategory[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={radiologyUnit} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(radiologyUnit[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab3' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={radiologyParams} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(radiologyParams[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === 'item-stock' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Inventory</div>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="border rounded-lg">
                                <div className="flex justify-items-center">
                                    <button 
                                        onClick={() => setActiveTab('tab1')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Item Category
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab2')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Item Store
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tab3')}
                                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Item Supplier
                                    </button>
                                </div>
                                
                                <div className="tab-content p-2">
                                    {activeTab === 'tab1' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={itemCategory} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(itemCategory[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab2' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={itemStore} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(itemStore[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                    {activeTab === 'tab3' && (
                                        <>
                                            <Table 
                                                title="User List" 
                                                user={itemSupplier} 
                                                action={false}
                                                // permission={permissionData} 
                                                // module={moduleData} 
                                                tableHeader={Object.keys(itemSupplier[0])}
                                                // isLoading={userListLoading}
                                                // onOpenModal={handleOpenModal}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {slug === "doh-report" && (
                    
                    <div>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">DOH Annual Health Facility Statistical Report</div>
                    
                        <div className="max-h-[70vh] overflow-y-auto scroll-custom">
                            <Accordion title="General Information">
                                <p>Testing Accordion 1</p>
                            </Accordion>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

export default SubModule