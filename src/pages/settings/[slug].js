import Head from 'next/head'
import { useState, useEffect, useMemo, useRef } from "react"
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
import { 
    useGetMedicineListQuery, 
    useGetPhysicianListQuery,
    useGetFilteredMedicineListQuery,
    useGetMedicineFormListQuery,
    useGetMedicineFrequencyListQuery,
} from '@/service/patientService'

import { 
    useGetUserDetailsQuery
} from '@/service/authService'

import { 
    useGetHosptlChargeQuery,
    useGetHosptlChargeTypeQuery, 
    useGetHosptlChargeCategoryQuery, 
    useUpdateBulkMutation
} from '@/service/settingService'

import {
    useGetStatisticalReportQuery,
    useGetInfoClassificationQuery
} from '@/service/dohService'

import DOHReport from '@/components/Settings/DOHReport'
import { ComponentContext, FormContext } from '@/utils/context'
import Button from '@/components/Button'
import SearchExport from '@/components/SearchExport'
import Dropdown from '@/components/Dropdown'
import { DropdownExport } from '@/components/DropdownLink'
import Tabs from '@/components/Tabs'
import Pagination from '@/components/Pagination'
import ItemPerPage from '@/components/ItemPerPage'
import Form from '@/components/Form'


const itemCategory = [
    {item_category: ""}
]

const itemStore = [
    {item_store_name: "", item_stock_code: ""}
]

const itemSupplier = [
    {item_supplier: "", contact_person: "", address: ""}
]

const medicineForm = [
    {name: 'brand_name', type: 'text', label: 'Brand Name', placeholder: 'Type...'},
    {name: 'generic_name', type: 'text', label: 'Generic Name', placeholder: 'Type...'},
    {name: 'dosage', type: 'text', label: 'Dosage', placeholder: 'Type...'},
    {name: 'duration_from', type: 'date', label: 'Duration From', placeholder: 'Type...'},
    {name: 'duration_to', type: 'date', label: 'Duration To', placeholder: 'Type...'},
    {name: 'amount', type: 'number', label: 'Amount', placeholder: 'Type...'},
    {name: 'quantity', type: 'number', label: 'Quantity', placeholder: 'Type...'},
]

const medicineForm2 = [
    {name: 'name', type: 'text', label: 'Name', placeholder: 'Type...'},
]

const medicineFrequency = [
    {name: 'name', type: 'text', label: 'Name', placeholder: 'Type...'}
]

const SubModule = () => {
    const formRef = useRef(null)
    const router = useRouter()
    const { slug } = router.query
    const menuGroup = "settings"
    const [accordionSlug, setAccordionSlug] = useState("")
    
    const { 
        data: data, 
        isError: dataError, 
        refetch: refetchUserDetails 
    } = useGetUserDetailsQuery()
    
    const hospitalChargeSlug = slug === 'charges'
    const dohReportSlug = slug === 'doh-report'
    // const hospitalChargeSlug = slug === 'charges'

    const {data: hosptlChargeMaster} = useGetHosptlChargeQuery()
    const {data: hosptlChargeTypeMaster} = useGetHosptlChargeTypeQuery(undefined, {skip: !hospitalChargeSlug})
    const {data: hosptlChargeCategoryMaster} = useGetHosptlChargeCategoryQuery(undefined, {skip: !hospitalChargeSlug})
    const {data: hosptlPhysicianListMaster} = useGetPhysicianListQuery(undefined, {skip: !hospitalChargeSlug})
    const {data: statisticalReport} = useGetInfoClassificationQuery(undefined, {skip: !dohReportSlug})

    // console.log(statisticalReport?.data)
    const [activeTab, setActiveTab] = useState('tab1')
    const [editorData, setEditorData] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [pageTitle, setPageTitle] = useState("")
    // const [activeContent, setActiveContent] = useState("yellow")
    const [state, setState] = useState({
        activeContent: 'yellow',
        searchQuery: '',
        contentHeight: 0,
        activeTab: 'tab1',
        contentType: '',
        itemsPerPage: 5,
        currentPage: 1,
        medicineSlug: '',
        btnSpinner: false,
        alertType: "",
        alertMessage: ""

    })

    const { 
        data: medicineList, 
        refetch: medicineRefetch 
    } = useGetFilteredMedicineListQuery({
        items: state?.itemsPerPage,
        page: state?.currentPage,
        keywords: state?.searchQuery,
        tabs: state?.activeTab
    }, {
        enabled: !!state?.searchQuery && !!state?.activeTab
    })

    const [updateBulk, {isLoading: updateBulkLoading}] = useUpdateBulkMutation()

    
    const { medicineData, pagination, header } = useMemo(() => {
        const medicine = medicineList?.data ?? []
        const paginationInfo = medicineList?.pagination ?? []
        const headers = medicineList?.columns ?? []

        return {
            medicineData: medicine,
            pagination: paginationInfo,
            header: headers
        }
    },[medicineList]) 

    // console.log(medicineList)
    
    const userDetails = data?.data ?? []
    // const header = statisticalReport?.data[0] ?? []

    // console.log(userDetails.roles)
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const formatTitlePages = (str) => {
        return str
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
    }

    useEffect(() => {
        const calculateHeight = () => {
            const windowHeight = window.innerHeight
            setState(prev => ({
                ...prev,
                contentHeight: windowHeight
            }))
        }
        calculateHeight()

        if(slug) {
            setPageTitle(formatTitlePages(slug))
        }
        let spinnerTimer
        if(state.btnSpinner) {
            spinnerTimer = setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    btnSpinner: false
                }))
            }, 500)
        }

        // Recalculate height on window resize
        window.addEventListener('resize', calculateHeight)
        return () => {
            if(spinnerTimer) {
                clearTimeout(spinnerTimer)
            } 
            window.removeEventListener('resize', calculateHeight)
        }
    }, [state.btnSpinner])
    
    const handleAccordion = (data) => {
        setAccordionSlug(data)
    }

    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = (q) => {
        setSearchQuery({searchQuery: q})
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

    const handleOnChange = (data) => {
        switch(data.type) {
            case 'search':
                setState(prev => ({
                    ...prev,
                    searchQuery: data.value
                }))
                break
            case 'itemsPerPageChange':
                setState(prev => ({
                    ...prev,
                    itemsPerPage: data.value
                }))
                break
            
            case 'newPage':
                setState(prev => ({
                    ...prev,
                    currentPage: data.value
                }))
                

            default:
                break
        }
    }

    const handleOnClick = (data) => {
        switch(data.type) {
            case 'tabClicked':
                setState(prev => ({
                    ...prev,
                    activeTab: data.value,
                }))
                break
            case 'addCharges':
                setState(prev => ({
                    ...prev,
                    activeContent: data.value,
                    contentType: "addRow"
                }))
                break

            case 'closeDrawer':
                setState(prev => ({
                    ...prev,
                    activeContent: data.value
                }))
            
            default:
                break
        }
    }

    const handleSubmitButton = (data) => {
        switch(data.type) {
            case 'submitMedicine':
                updateBulk({actionType: 'updateMedicines', data: data.value, id: data.value.id})
                    .unwrap()
                    .then(response => {
                        if(response.status === "success") {
                            medicineRefetch()
                        }
                    })
                    .catch(error => {
                        //  console.log(error)
                    })
                break
            
            case 'submit':
                // console.log(`${data.value} it works`)
                if(data.value === 'tab1') {
                    formRef.current.handleSubmit('createMedicine')
                } else if(data.value === 'tab2') {
                    formRef.current.handleSubmit('createMedicineForm')
                } else if(data.value === 'tab3') {
                    formRef.current.handleSubmit('createMedicineFrequency')
                }
                break

            default:
                break
        }
    }

    const handleRefetch = () => {
        setState(prev => ({...prev, itemsPerPage: + 5}))
    }

    const handleAlertClose = () => {
        setState(prev => ({...prev, alertType: ""}))
        setState(prev => ({...prev, alertMessage: ""}))
    }

    const pharmacyTabs = [{
            id: 'tab1',
            label: 'Medicine',
            content: () => (
                <ComponentContext.Provider value={{
                    state: {
                        activeTab: state.activeTab,
                        medicine: medicineData,
                        header: header
                    },
                    onSubmitData: (data) => handleSubmitButton(data)
                }}>
                    <Pharmacy />
                </ComponentContext.Provider>
            ) 
        }, {
            id: 'tab2',
            label: 'Medicine Form',
            content: () => (
                <ComponentContext.Provider value={{
                    state: {
                        activeTab: state.activeTab,
                        medicine: medicineData,
                        header: header
                    },
                    onSubmitData: (data) => handleSubmitButton(data)
                }}>
                    <Pharmacy />
                </ComponentContext.Provider>
            )
        }, {
            id: 'tab3',
            label: 'Medicine Frequency',
            content: () => (
                <ComponentContext.Provider value={{
                    state: {
                        activeTab: state.activeTab,
                        medicine: medicineData,
                        header: header
                    },
                    onSubmitData: (data) => handleSubmitButton(data)
                }}>
                    <Pharmacy />
                </ComponentContext.Provider>
            )
        },  {
            id: 'tab4',
            label: 'Category',
            content: () => (
                <div></div>
            ) 
        }, {
            id: 'tab5',
            label: 'Supplier',
            content: () => (
                <div></div>
            ) 
        }
    ]
    
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
                        <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Human Resource</div>
                        <HumanResource slug={slug}/>
                    </div>
                )
            case 'charges':
                return (
                    <div>
                        <HospitalCharge 
                            slug={slug}
                            hosptlChargeTypeData={hosptlChargeTypeMaster}
                            hosptlChargeCategoryData={hosptlChargeCategoryMaster}
                            hosptlPhysicianListData={hosptlPhysicianListMaster}
                        />
                    </div>
                )
            case 'bed':
                return (
                    <div>
                        <Bed slug={slug}/>
                    </div>
                )
            case 'symptoms':
                return (
                    <div>
                        <Symptoms slug={slug}/>
                    </div>
                )
            case 'pharmacy-config':
                return (
                    <div>
                        {/* <Pharmacy slug={slug}/> */}
                        <div className={`transition-transform duration-500 ease-in-out ${state.activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${state.contentHeight}px`, overflowY: 'auto' }}>
                            <div className="font-bold text-xl mb-2 text-gray-600">Pharmacy</div>
                            <div className="flex justify-between py-1">
                                <Button
                                    btnIcon="add"
                                    onClick={() => handleOnClick({type: "addCharges", value: "green"})}>
                                    Add
                                </Button>

                                
                                <SearchExport>
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={state.searchQuery}
                                                onChange={(e) => handleOnChange({type: "search", value: e.target.value})}
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
                                        </Dropdown>
                                    </div>
                                </SearchExport>
                            </div>

                            <Tabs
                                tabsConfig={pharmacyTabs} 
                                onActiveTab={(id) => handleOnClick({type: "tabClicked", value: id})}
                            />

                            <div className="flex flex-wrap py-1">
                                <div className="flex items-center justify-center flex-grow">
                                    <Pagination 
                                        currentPage={pagination.current_page} 
                                        totalPages={pagination.total_pages}
                                        // onPageChange={newPage => setCurrentPage(newPage)}
                                        onPageChange={(newPage) => handleOnChange({type:"newPage", value:newPage})}
                                    />
                                </div>

                                <ItemPerPage className="flex flex-grow">
                                    <div className="flex items-center justify-end">
                                        <span className="mr-2 mx-2 text-gray-500 uppercase font-medium text-xs">Per Page:</span>
                                        <select
                                            value={state.itemsPerPage}
                                            onChange={(e) => handleOnChange({type: "itemsPerPageChange", value: e.target.value})}
                                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                        </select>
                                    </div>
                                </ItemPerPage>
                            </div>
                        </div>
                        <div className={`transition-transform duration-500 ease-in-out ${state.activeContent === 'green' ? 'translate-y-0 ' : 'translate-x-full'}  absolute inset-0 pt-[3.5rem]`} style={{ height: `${state.contentHeight}px`, overflowY: 'auto' }}>
                            {state.contentType === 'addRow' && (
                                <>
                                    <div className="font-bold text-lg mb-2 text-gray-600 pt-10 px-4">
                                        Add {state.activeTab === 'tab1' ? 'Medicine' : state.activeTab === 'tab2' ? 'Medicine Form' : state.activeTab === 'tab3' ? 'Medicine Frequency' : state.activeTab === 'tab4' ? 'Category' : state.activeTab === 'tab5' ? 'Supplier' : ''}
                                    </div>
                                    <div className="flex justify-between py-2 px-4">
                                        <Button
                                            paddingY="2"
                                            btnIcon="close"
                                            onClick={() => handleOnClick({type: "closeDrawer", value: "yellow"})}
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
                                                bgColor={state.btnSpinner ? 'disable': 'emerald'}
                                                btnIcon={state.btnSpinner ? 'disable': 'submit'}
                                                btnLoading={state.btnSpinner}
                                                onClick={() => handleSubmitButton({type: "submit", value: state.activeTab})}
                                            >
                                                {state.btnSpinner ? '' : 'Submit'}
                                            </Button>
                                        </div>
                                    </div>

                                    <FormContext.Provider value={{
                                        title: state.activeTab === 'tab1' ? 'Medicine' 
                                             : state.activeTab === 'tab2' ? 'Medicine Form' 
                                             : state.activeTab === 'tab3' ? 'Medicine Frequency' 
                                             : '',
                                        ref: formRef,
                                        initialFields: state.activeTab === 'tab1' ? medicineForm 
                                                     : state.activeTab === 'tab2' ? medicineForm2 
                                                     : state.activeTab === 'tab3' ? medicineFrequency 
                                                     : '',
                                        enableAddRow: true,
                                        onSuccess: handleRefetch,
                                        onLoading: (data) => setState(prev => ({...prev, btnSpinner: data})),
                                        onSetAlertType: (data) => setState(prev => ({...prev, alertType: data})),
                                        onCloseSlider: () => setState(prev => ({...prev, activeContent: "yellow"})),
                                        onAlert: (data) => {
                                            setState(prev => ({...prev, alertMessage: data.msg}))
                                            setState(prev => ({...prev, alertType: data.type}))
                                        }
                                    }}>
                                        <Form />
                                    </FormContext.Provider>
                                </>
                            )}
                        </div>
                    </div>
                )
            case 'panthology':
                return (
                    <div>
                        <Phantology slug={slug}/>
                    </div>
                )
            case 'radiology':
                return (
                    <div>
                        <Radiology slug={slug}/>
                    </div>
                )
            case 'item-stock':
                return (
                    <div>
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
                    </div>
                )
            case 'doh-report':
                return (
                    <div>
                        <DOHReport 
                            onAccordionClicked={(data) => handleAccordion(data)}
                            dohData={statisticalReport?.data}
                        />
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
                <title>{pageTitle}</title>
            </Head>

            <div className="pl-[5rem] pr-[5rem]">
                <div className="relative overflow-x-hidden" style={{ height: `${state.contentHeight}px` }}>
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
                    {state.alertMessage &&
                        <Alert 
                            alertType={state.alertType}
                            isOpen={state.alertType !== ""}
                            onClose={handleAlertClose}
                            message={state.alertMessage} 
                        /> 
                    }
                    
                    {renderContent(slug)}
                </div>
            </div>
        </AppLayout>
    )
}

export default SubModule