import Head from 'next/head'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AppLayout from "@/components/Layouts/AppLayout"
import NavTab from "@/components/NavTab"
import CustomCKEditor from '@/components/CustomCKEditor'
import SearchItemPage from '@/components/SearchItemPage'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import Accordion from '@/components/Accordion'
import Bed from '@/components/Settings/Bed'
import HospitalCharge from '@/components/Settings/HospitalCharge'
import Symptoms from '@/components/Settings/Symptoms'
import HumanResource from '@/components/Settings/HumanResource'
import Pharmacy from '@/components/Settings/Pharmacy'
import Phantology from '@/components/Settings/Phantology'
import Radiology from '@/components/Settings/Radiology'
import System from '@/components/Settings/System'
import { useGetPhysicianListQuery } from '@/service/patientService'
import { useGetUserDetailsQuery} from '@/service/authService'
import { 
    useGetHosptlChargeQuery,
    useGetHosptlChargeTypeQuery, 
    useGetHosptlChargeCategoryQuery, 
} from '@/service/settingService'


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
    
    const { 
        data: data, 
        isError: dataError, 
        refetch: refetchUserDetails 
    } = useGetUserDetailsQuery()
    
    const {data: hosptlChargeMaster} = useGetHosptlChargeQuery()
    const {data: hosptlChargeTypeMaster} = useGetHosptlChargeTypeQuery()
    const {data: hosptlChargeCategoryMaster} = useGetHosptlChargeCategoryQuery()
    const {data: hosptlPhysicianListMaster} = useGetPhysicianListQuery()

    const [activeTab, setActiveTab] = useState('tab1')
    const [editorData, setEditorData] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    console.log(hosptlChargeCategoryMaster)
    
    const userDetails = data?.data ?? []

    // console.log(userDetails.roles)
    
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

    // for refactor this code
    const renderContent = (slug) => {
        switch(slug) {
            case 'system':
                return (
                    <div>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">System Configuration</div>
                        <System slug={slug}/>
                    </div>
                )
            
            case 'hr':
                return (
                    <div>

                    </div>
                )
            case 'charges':
                return (
                    <div>
                        
                    </div>
                )
            case 'bed':
                return (
                    <div>
                        
                    </div>
                )
            case 'symptoms':
                return (
                    <div>
                        
                    </div>
                )
            case 'pharmacy-config':
                return (
                    <div>
                        
                    </div>
                )
            case 'panthology':
                return (
                    <div>
                        
                    </div>
                )
            case 'radiology':
                return (
                    <div>
                        
                    </div>
                )
            case 'item-stock':
                return (
                    <div>
                        
                    </div>
                )
            case 'doh-report':
                return (
                    <div>
                        
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
                {slug === 'system' && (
                    <>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">System Configuration</div>
                        <System slug={slug}/>
                    </>
                )}

                {slug === 'hr' && (
                    <div>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Human Resource</div>
                        <HumanResource slug={slug}/>
                    </div>
                )}

                {slug === 'charges' && (
                    <div>
                        <HospitalCharge 
                            slug={slug}
                            hosptlChargeTypeData={hosptlChargeTypeMaster}
                            hosptlChargeCategoryData={hosptlChargeCategoryMaster}
                            hosptlPhysicianListData={hosptlPhysicianListMaster}
                        />
                    </div>
                )}

                {slug === 'bed' && (
                   <div>
                        <Bed slug={slug}/>
                   </div>
                )}

                {slug === 'symptoms' && (
                    <div>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Symptoms</div>
                        <Symptoms slug={slug}/>
                    </div>
                )}

                {slug === 'pharmacy-config' && (
                    <div>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Pharmacy</div>
                        <Pharmacy slug={slug}/>
                    </div>
                )}

                {slug === 'panthology' && (
                    <div>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Phantology</div>
                        <Phantology slug={slug}/>
                    </div>
                )}

                {slug === 'radiology' && (
                    <div>
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Radiology</div>
                        <Radiology slug={slug}/>
                    </div>
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
                                                tableData={itemCategory} 
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
                                                tableData={itemStore} 
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
                                                tableData={itemSupplier} 
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