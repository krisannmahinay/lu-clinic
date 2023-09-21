import Head from 'next/head'
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AppLayout from "@/components/Layouts/AppLayout"
import NavTab from "@/components/NavTab"
import CustomCKEditor from '@/components/CustomCKEditor'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import SearchItemPage from '@/components/SearchItemPage'
import HealthMonitor from '@/components/HealthMonitor'
import ReactImageZoom from 'react-image-zoom'
import ImagingResult from '@/components/ImagingResult'
import Prescription from '@/components/Prescription'
import { useGetICDDataQuery } from '@/service/icdService'
import Soap from '@/components/Patient/OPD/Soap'
import PatientInformation from '@/components/Patient/OPD/PatientInformation'


const soapData = [
    {
        hematology: [
            {id:1, type:"hematology", name: "Complete Blood Count with platelet count(CBC with platelet)"},
            {id:2, type:"hematology", name: "Peripheral Blood Smear"},
            {id:3, type:"hematology", name: "Clotting Time(CT)"},
            {id:4, type:"hematology", name: "Bleeding Time(BT)"},
            {id:5, type:"hematology", name: "Prothrombin Time(PT)"},
            {id:6, type:"hematology", name: "Partial Thromboplastin Time(PTT)"},
            {id:7, type:"hematology", name: "Dengue NS1"},
            {id:8, type:"hematology", name: "Crossmatching"},
            {id:9, type:"hematology", name: "Blood Typing"},
            {id:10, type:"hematology", name: "Others"}
        ], 
        urine_stool_studies: [
            {id:11, type:"stool", name: "Urinalysis(midstream, clean catch)"},
            {id:12, type:"stool", name: "Pregnancy Test"},
            {id:13, type:"stool", name: "Fecalysis"},
            {id:14, type:"stool", name: "Others"},
        ],
        cardiac_studies: [
            {id:15, type:"cardiac", name: "Electrocardiogram(ECG)"},
            {id:16, type:"cardiac", name: "Others",}
        ], 
        chemistry: [
            {id:17, type:"chemistry", name: "Lipid Profile"},
            {id:18, type:"chemistry", name: "Serum Sodium(Na)"},
            {id:19, type:"chemistry", name: "Serum Potassium(K)"},
            {id:20, type:"chemistry", name: "Blood Urea Nitrogen(BUN)"},
            {id:21, type:"chemistry", name: "Ionized Calcium(iCa)"},
            {id:22, type:"chemistry", name: "Uric Acid"},
            {id:23, type:"chemistry", name: "ALT/SGPT"},
            {id:24, type:"chemistry", name: "AST/SGOT"},
            {id:25, type:"chemistry", name: "Hepatitis Test"},
            {id:26, type:"chemistry", name: "Syphilis"},
            {id:27, type:"chemistry", name: "TSH"},
            {id:28, type:"chemistry", name: "Ft4"},
            {id:29, type:"chemistry", name: "Ft3"},
            {id:30, type:"chemistry", name: "TT4"},
            {id:31, type:"chemistry", name: "TT3"},
            {id:32, type:"chemistry", name: "PSA"},
            {id:33, type:"chemistry", name: "Rapid Antigen Test(COVID-19)"},
            {id:45, type:"chemistry", name: "Others"},
        ],
        glucose: [
            {id:46, type:"glucose", name: "Fasting Blood Sugar(FBS)"},
            {id:47, type:"glucose", name: "Hba1c"},
            {id:48, type:"glucose", name: "Random Blood Sugar"},
            {id:49, type:"glucose", name: "75g Oral Glucose Tolerance Test(OGTT)"},
            {id:50, type:"glucose", name: "Others"}
        ]
    }
]

const soapHeaders = [
    "hematology",
    "urine_stool_studies",
    "cardiac_studies",
    "chemistry",
    "glucose",
]

const dummyData = [
    {id:1, name: "Paracetamol"},
    {id:2, name: "Other Medicine"},
    {id:3, name: "Test Medicine2"},
    {id:4, name: "Test Medicine5"},
    {id:5, name: "Test Medicine6"},
    {id:6, name: "Test Medicine7"},
    {id:7, name: "Test Medicine7"},
    {id:8, name: "Test Medicine7"},
    {id:9, name: "Test Medicine7"},
    {id:10, name: "Test Medicine7"},
    {id:11, name: "Test Medicine7"},
    {id:12, name: "Test Medicine7"},
    {id:13, name: "Test Medicine7"},
    {id:14, name: "Test Medicine7"},
    {id:15, name: "Test Medicine7"},
    {id:16, name: "Test Medicine7"},
]

const labResults = [
    {
        user_id: "",
        test_name: "Hemoglobin",
        result: 12,
        normal_range: "11.0 - 16.0",
        unit: "g/dL",
        date_examination: "06 Aug 2023 09:00AM"
    },
    
    {
        user_id: "",
        test_name: "RBC",
        result: "3.3",
        normal_range: "3.5-5.50",
        unit: "10^6/uL",
        date_examination: "06 Aug 2023 09:00AM"
    }
]

const imagingResults = [
    {
        imaging_type: "XRAY",
        imaging_src: "https://i.imgur.com/Ci2wzcv.jpg",
        date_examination: "06 Aug 2023 09:00AM"
    },
]

const prescriptionData = [
    {
        headerText: "Clinic Name",
        footerText: "Clinic Adrress Location"
    }
]

const icdDataHeaders = [
    "icd_codes",
    "name"
]

const SubModule = () => {
    
    const router = useRouter()
    const { slug, patients } = router.query
    const menuGroup = "patients"
    const [activeTab, setActiveTab] = useState('tab1')
    const [tableHeader, setTableHeader] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    // monitoring sheets
    const [displayedHour, setDisplayedHour] = useState('')
    const [hour, setHour] = useState('')
    const [respiratoryRate, setRespiratoryRate] = useState('')
    const [pulseRate, setPulseRate] = useState('')
    const [temperature, setTemperature] = useState('')
    const [checkedItem, setCheckedItem] = useState([])

    const [searchQuery, setSearchQuery] = useState("")

    // icd codes
    const { data: icdResultData, isLoading, isError, error, isSuccess } = useGetICDDataQuery({
        keywords: searchQuery
    }, {
        enabled: !!searchQuery
    })
    
    const icdData = (icdResultData && icdResultData[3]) ? icdResultData[3] : []

    const mappedIcdData = icdData.map(entry => {
        return icdDataHeaders.reduce((obj, header, index) => {
            obj[header] = entry[index]
            return obj
        }, {})
    })


    const handleICDSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    // console.log(soapData)
    const patientData = [
        {
            patient_name: "John Doe",
            patient_id: "PAT-230818XY2A",
            gender: "Male",
            phone: "092222222222",
            physician: "Dr Smith"
        }
    ]

    const handleCheckbox = (moduleId) => {
        if(checkedItem.includes(moduleId)) {
            setCheckedItem(checkedItem.filter((checked) => checked !== moduleId))
            // onCheckedData([...checkedItem])
            
        } else {
            setCheckedItem([...checkedItem, moduleId])
                
            // onCheckedData([...checkedItem])
        }
    }

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            { label: 'Respiratory Rate', data: [], borderColor: '#FF5733', backgroundColor: 'rgba(255, 87, 51, 0.2)' },
            { label: 'Pulse Rate', data: [], borderColor: '#33FF57', backgroundColor: 'rgba(51, 255, 87, 0.2)' },
            { label: 'Temperature', data: [], borderColor: '#3357FF', backgroundColor: 'rgba(51, 87, 255, 0.2)' }
        ]
    })

    const handleClearData = () => {
        setChartData({
            labels: [],
            datasets: [
                { label: 'Respiratory Rate', data: [], borderColor: '#FF5733', backgroundColor: 'rgba(255, 87, 51, 0.2)' },
                { label: 'Pulse Rate', data: [], borderColor: '#33FF57', backgroundColor: 'rgba(51, 255, 87, 0.2)' },
                { label: 'Temperature', data: [], borderColor: '#3357FF', backgroundColor: 'rgba(51, 87, 255, 0.2)' }
            ]
        })
    }

    const handleAddData = () => {
        setChartData(prevData => ({
            ...prevData,
            labels: [...prevData.labels, hour],
            datasets: [
                { ...prevData.datasets[0], data: [...prevData.datasets[0].data, respiratoryRate] },
                { ...prevData.datasets[1], data: [...prevData.datasets[1].data, pulseRate] },
                { ...prevData.datasets[2], data: [...prevData.datasets[2].data, temperature] }
            ]
        }))
    }

    const handleHourChange = (e) => {
        const time = e.target.value // This will give something like "16:00"
        setDisplayedHour(time)

        const militaryTime = time.replace(':', ''); // Convert it to "1600"
        console.log(militaryTime)
        setHour(militaryTime)
    }

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
            
            <div className="max-w-full sm:rounded-lg mx-8">
                <div className="flex items-center py-5">
                    <button onClick={() => router.back()} className="text-sm uppercase shadow-md bg-white text-gray-500 hover:text-gray-700 py-4 px-8 rounded-full font-medium transition duration-300">Back</button>
                    <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">{slug}</div>
                    
                    <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">PAT-230818XYA2</div>
                </div>


                <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-auto sm:w-full">
                    <div className="border rounded-lg ">
                        <div className="flex justify-items-center">
                            <button 
                                onClick={() => setActiveTab('tab1')}
                                className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 rounded-tl-lg ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Patient Information
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab2')}
                                className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>S.O.A.P
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab3')}
                                className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Laboratory Results
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab4')}
                                className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>Imaging Results
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab5')}
                                className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab5' ? 'bg-white':'bg-gray-200'}`}>Prescription
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab6')}
                                className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab6' ? 'bg-white':'bg-gray-200'}`}>Monitoring Sheets
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab7')}
                                className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab7' ? 'bg-white':'bg-gray-200'}`}>ICD Codes
                            </button>
                        </div>
                        
                        <div className="tab-content p-8 max-h-[70vh] overflow-y-auto scroll-custom">
                            {activeTab === 'tab1' && (
                                <PatientInformation />
                            )}
                            {activeTab === 'tab2' && (
                                
                                <Soap soapData={soapData} soapHeaders={soapHeaders} dummyData={dummyData} />
                            )}
                            {activeTab === 'tab3' && (
                                <>
                                    <div className="text-medium font-semibold text-center tracking-wide text-white uppercase border-b bg-green-500 px-4 py-4">
                                        <span>Date of Examination</span>
                                    </div>

                                    <Table 
                                        title="Patient List" 
                                        action={false}
                                        slug={slug}
                                        tableHeader={Object.keys(labResults[0])}
                                        user={labResults} 
                                    />
                                </>
                                
                            )}
                            {activeTab === 'tab4' && (
                                <>
                                    {/* <div className='flex space-x-3'>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                            type="submit">
                                            XRAY
                                        </button>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                            type="submit">
                                            ULTRASOUND
                                        </button>
                                    </div> */}
                                    <ImagingResult imageType="XRAY" data={imagingResults}/>
                                </>
                            )}
                            {activeTab === 'tab5' && (
                                <div>
                                    <Prescription />
                                </div>
                            )}
                            {activeTab === 'tab6' && (
                                <>
                                    <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                                        <div className="flex flex-col w-2/5">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Hour</label>
                                            <input type="time" placeholder="Enter hour" value={displayedHour} step="3600" onChange={handleHourChange} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-2/5">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Respiratory Rate</label>
                                            <input type="text" placeholder="Enter RR" value={respiratoryRate} onChange={e => setRespiratoryRate(e.target.value)} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-2/5">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Pulse Rate</label>
                                            <input type="text" placeholder="Enter PR" value={pulseRate} onChange={e => setPulseRate(e.target.value)} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-2/5">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Temperature</label>
                                            <input type="text" placeholder="Enter T" value={temperature} onChange={e => setTemperature(e.target.value)} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        
                                        <button onClick={handleAddData}>Add Data</button>
                                        <button onClick={handleClearData}>Clear Data</button>
                                    </div>
                                    <HealthMonitor data={chartData}/>
                                </>
                            )}

                            {activeTab === 'tab7' && (
                                <div>
                                    <h1>ICD Codes</h1>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        // onChange={e => setSearchQuery(e.target.value)}
                                        onChange={handleICDSearch}
                                        className="border border-gray-300 w-full px-3 py-2 focus:outline-none flex-grow pl-10"
                                        placeholder="Search..."
                                    />
                                    
                                    <Table 
                                        title="Patient List" 
                                        action={false}
                                        slug={slug}
                                        tableHeader={icdDataHeaders}
                                        user={mappedIcdData} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default SubModule

