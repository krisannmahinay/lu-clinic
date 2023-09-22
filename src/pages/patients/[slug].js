import Head from 'next/head'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AppLayout from "@/components/Layouts/AppLayout"
import NavTab from "@/components/NavTab"
import CustomCKEditor from '@/components/CustomCKEditor'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import SearchItemPage from '@/components/SearchItemPage'
import Modal from '@/components/Modal'


const SubModule = () => {
    
    const router = useRouter()
    const { slug } = router.query
    const menuGroup = "patients"
    const [activeTab, setActiveTab] = useState('tab1')
    const [tableHeader, setTableHeader] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    
    const [isModalOpen, setIsModalOpen] = useState(false)

    const patientData = [
        {
            time_in: "1440",
            patient_id: "PAT-230818XY2A",
            patient_name: "John Doe",
            age: 20,
            gender: "Male",
            phone: "092222222222",
            physician: "Dr Smith",
            ancillary: "None",
            laboratory_status: "None",
            imaging_status: "Pending",
            disposition: "Admission",
        },
        
        {
            time_in: "1533",
            patient_id: "PAT-230818XYA2",
            patient_name: "John Doe",
            age: 27,
            gender: "Male",
            phone: "092222222222",
            physician: "Dr Smith",
            ancillary: "None",
            laboratory_status: "None",
            imaging_status: "Pending",
            disposition: "Admission",
        }
    ]

    // useEffect(() => {
    //     if(Array.isArray(patientData) && patientData.length > 0) {
    //         const headers = Object.keys(patientData[0])
    //         setTableHeader(headers)
    //         // setItemsPerPage(prev => prev + 1)
    //     }
    // }, [patientData])
    const handleExportToPDF = () => {
        
    }
    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = (q) => {
        setSearchQuery(q)
    }

    const closeModal = () => {
        // setSelectedRows([])
        setIsModalOpen(false)
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

                {slug === 'out-patient' && (
                    <>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />

                        <Table 
                            title="Patient List" 
                            action={false}
                            slug={slug}
                            tableHeader={Object.keys(patientData[0])}
                            tableData={patientData} 
                        />

                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages}
                            // onPageChange={newPage => setCurrentPage(newPage)}
                            onPageChange={(newPage) => handleNewPage(newPage)}
                        />
                        
                    </>
                )}
            </div>
        </AppLayout>
    )
}

export default SubModule