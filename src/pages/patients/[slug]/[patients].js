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
import AsyncSelect from 'react-select/async'
import Select from 'react-select'

import { useGetICDDataQuery } from '@/service/icdService'
import { useGetCountryDataQuery } from '@/service/countryService'
import { useGetProvinceDataQuery, useGetMunicipalityDataQuery, useGetBarangayDataQuery } from '@/service/psgcService'


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

// console.log(icdDataHeaders)


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
    
    const [initialOptions, setInitialOptions] = useState([]) 

    // prescription
    const [leftItems, setLeftItems] = useState(dummyData)
    const [rightItems, setRightItems] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    // patient information and consent
    const [selectedProvince, setSelectedProvince] = useState(null)
    const [selectedMunicipal, setSelectedMunicipal] = useState(null)
    const [selectedBarangay, setSelectedBarangay] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [provinceCode, setProvinceCode] = useState(null)
    const [municipalCode, setMunicipalCode] = useState(null)

    const { data: countryData } = useGetCountryDataQuery()
    const { data: provinceData } = useGetProvinceDataQuery()
    const { data: municipalityData } = useGetMunicipalityDataQuery({provinceCode: provinceCode}, {enabled: !!provinceCode})
    const { data: barangayData } = useGetBarangayDataQuery({municipalCode: municipalCode}, {enabled: !!municipalCode})

    useEffect(() => {
        if (provinceData) {
            const options = provinceData.map(item => ({
                value: item.code,
                label: item.name
            }))
            setInitialOptions(options)
        }
    }, [provinceData])


    const filterProvinceData = provinceData ?? []
    const loadProvince = (inputValue, callback) => {
        // Simulate an async search with a timeout. Replace this with your actual API call.
        setTimeout(() => {
            const filteredData = filterProvinceData.filter(item => 
                item.name.toLowerCase().includes(inputValue.toLowerCase())
            )

            const options = filteredData.map(item => ({
                value: item.code,
                label: item.name
            }))
            callback(options)
        }, 1000)
    }

    const handleProvinceChange = (selectedOption) => {
        setSelectedProvince(selectedOption?.label)
        setProvinceCode(selectedOption?.value)
    }

    const handleMunicipalityChange = (selectedOption) => {
        setSelectedMunicipal(selectedOption?.label)
        setMunicipalCode(selectedOption?.value)
    }

    const handleBarangayChange = (selectedOption) => {
        setSelectedBarangay(selectedOption?.label)
    }

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption?.label)
    }
    
    // console.log(provinceData.name)

    // icd codes
    const { data: icdResultData, isLoading, isError, error, isSuccess } = useGetICDDataQuery({
        keywords: searchQuery
    }, {
        enabled: !!searchQuery
    })
    
    // console.log(icdResultData)
    
    // const userData = userList?.userList ?? []
    
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
    
    const moveItemToRight = (id) => {
        const item = leftItems.find(item => item.id === id)
        setLeftItems(prev => prev.filter(item => item.id !== id))
        setRightItems(prev => [...prev, item])
    }

    const moveItemToLeft = (id) => {
        const item = rightItems.find(item => item.id === id)
        setRightItems(prev => prev.filter(item => item.id !== id))
        setLeftItems(prev => [...prev, item])
    }

    const customDropdown = {
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

    const dispositionData = [
        { id: 1, name: "Improved" },
        { id: 2, name: "Uinmproved" },
        { id: 3, name: "Transferred" },
        { id: 4, name: "HAMA" },
        { id: 5, name: "Absconded" },
        { id: 6, name: "Expired" },
    ]

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
                                <div className="bg-white rounded-md  max-w-l w-full mx-auto">
                                    <div className="flex justify-center items-center mb-6">
                                        <div className="relative rounded-full border overflow-hidden w-24 h-24">
                                        <img 
                                            src="/path/to/default-photo.png" 
                                            alt="Patient Photo" 
                                            className="w-full h-full object-cover" 
                                        />
                                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer z-0">
                                            <label htmlFor="photo-upload">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0020.07 7H21a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                            </label>
                                            <input type="file" id="photo-upload" className="hidden" />
                                        </div>
                                        </div>
                                    </div>

                                    
                                    <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                                        
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">LAST NAME</label>
                                            <input type="text" placeholder="Enter last name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">GIVEN NAME</label>
                                            <input type="text" placeholder="Enter given name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">MIDDLE NAME</label>
                                            <input type="text" placeholder="Enter given name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">WARD/RM/BED/SERVICE</label>
                                            <input type="text" placeholder="Enter warm/rm/bed/service" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mb-2">
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">COUNTRY</label>
                                            <Select 
                                                options={countryData?.map(country => ({ value: country.name, label: country.name }))}
                                                onChange={handleCountryChange}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder="Select a country..."
                                                classNamePrefix="react-select"
                                                styles={customDropdown} 
                                            />
                                            {/* <input type="text" placeholder="Enter country" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" /> */}
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">PROVINCE</label>
                                            <AsyncSelect 
                                                cacheOptions
                                                loadOptions={loadProvince}
                                                defaultOptions={initialOptions}
                                                onChange={handleProvinceChange}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder="Select a province..."
                                                classNamePrefix="react-select"
                                                styles={customDropdown} 
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">STATE/MUNICIPALITY</label>
                                            <Select 
                                                options={municipalityData?.map(barangay => ({ value: barangay.code, label: barangay.name }))}
                                                onChange={handleMunicipalityChange}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder="Select a state..."
                                                classNamePrefix="react-select"
                                                styles={customDropdown} 
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">BARANGAY</label>
                                            <Select 
                                                options={barangayData?.map(barangay => ({ value: barangay.code, label: barangay.name }))}
                                                onChange={handleBarangayChange}
                                                isSearchable={true}
                                                isClearable={true}
                                                placeholder="Select a barangay..."
                                                classNamePrefix="react-select"
                                                styles={customDropdown} 
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">STREET</label>
                                            <input type="text" placeholder="Enter street" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">No/blk/lot</label>
                                            <input type="text" placeholder="Enter no" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        
                                    </div>

                                    <div className="flex gap-4 mb-2">
                                        
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">TEL no./CP no.</label>
                                            <input type="text" placeholder="Enter tel no./cp no." className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Sex</label>
                                            <input type="text" placeholder="Enter sex" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Civil Status</label>
                                            <input type="text" placeholder="Enter civil status" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4 mb-2">
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Birthday</label>
                                            <input type="date" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">age</label>
                                            <input type="text" placeholder="Enter age" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">birth place</label>
                                            <input type="text" placeholder="Enter birth-place" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">nationality</label>
                                            <input type="text" placeholder="Enter nationality" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">religion</label>
                                            <input type="text" placeholder="Enter religion" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">occupation</label>
                                            <input type="text" placeholder="Enter occupation" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mb-2">
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">EMPLOYER (Type of Business)</label>
                                            <input type="text" placeholder="Enter employer" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">ADDRESS</label>
                                            <input type="text" placeholder="Enter address" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">TEL NO/CP NO</label>
                                            <input type="text" placeholder="Enter tel no/cp no" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mb-2">
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">FATHERS NAME</label>
                                            <input type="text" placeholder="Enter fathers name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">ADDRESS</label>
                                            <input type="text" placeholder="Enter address" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">TEL NO/CP NO</label>
                                            <input type="text" placeholder="Enter tel no/cp no" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mb-2">
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">MOTHERS (Maiden) NAME</label>
                                            <input type="text" placeholder="Enter mothers name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">ADDRESS</label>
                                            <input type="text" placeholder="Enter address" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">TEL NO/CP NO</label>
                                            <input type="text" placeholder="Enter tel no/cp no" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mb-2">
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">SPOUSE NAME</label>
                                            <input type="text" placeholder="Enter spouse name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">ADDRESS</label>
                                            <input type="text" placeholder="Enter address" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">TEL NO/CP NO</label>
                                            <input type="text" placeholder="Enter number" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Admission</label>
                                            <input type="date" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">discharge</label>
                                            <input type="date" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">TOTAL NO. OF DAY</label>
                                            <input type="text" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">ADMITTING PHYSICIAN</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Admitting Clerk</label>
                                            <input type="text" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">ADMITTING PHYSICIAN</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Type of Admission</label>
                                            <input type="text" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Referred by (Physician/ Health Facility)</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Data furnished by</label>
                                            <input type="text" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Address of Informant</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Relation to Patient</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Admission Diagnosis</label>
                                            <textarea type="text" placeholder="Enter Diagnosis" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"/>
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Discharge Diagnosis</label>
                                            <textarea type="text" placeholder="Enter Principal Diagnosis" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none mb-4"/>
                                            <textarea type="text" placeholder="Enter Other Diagnosis" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">ICD/RUV Code</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Principal Operation/Procedures</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Other Operation's or Procedures</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Accident/injuries/poisoning</label>
                                            <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex  gap-4 mb-2">
                                        <div className="flex flex-col w-full mb-4">
                                            <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Disposition</label>
                                            <ul className="">
                                                {dispositionData.map((item) => (
                                                    
                                                    <li key={item.id}>
                                                        <div className="flex items-center space-x-4 p-4 ">
                                                            <input
                                                                type="checkbox" 
                                                                className="w-5 h-5"
                                                                name=""
                                                                value={item.id}
                                                                checked={checkedItem.includes(item.id)}
                                                                onChange={() => handleCheckbox(item.id)}
                                                            />
                                                            <p className="text-lg text-gray-500">{item.name}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                </div>
                            )}
                            {activeTab === 'tab2' && (
                                <>
                                    <div className="flex w-full overflow-x-auto scroll-custom shadow-xs">
                                        <table className="min-w-full border-collapse border border-slate-500 ">
                                            <thead>
                                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">

                                                {soapHeaders.map((tblHeader, tblHeaderIndex) => (
                                                    <th key={tblHeaderIndex} className="px-4 py-3 border border-slate-600">
                                                        {tblHeader}
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y">
                                                {soapData.map((tblBody, tblBodyIndex) => (
                                                    <tr className="text-gray-700" key={tblBodyIndex}>
                                                        {soapHeaders.map((tblHeader) => (
                                                            <td key={tblHeader} className="px-2 py-2 border border-slate-700">
                                                                <ul className="space-y-2 align-top max-h-40 overflow-y-auto scroll-custom divide-y">
                                                                    {tblBody[tblHeader].map((item) => (
                                                                        
                                                                        <li key={item.id}>
                                                                            <div className="flex items-center space-x-4  ">
                                                                                <input
                                                                                    type="checkbox" 
                                                                                    className="w-3 h-3"
                                                                                    name=""
                                                                                    value={item.id}
                                                                                    checked={checkedItem.includes(item.id)}
                                                                                    onChange={() => handleCheckbox(item.id)}
                                                                                />
                                                                                <p className="text-sm text-gray-500">{item.name}</p>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <table className="w-1/2 border-collapse border border-slate-500 ">
                                            <thead>
                                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                                                    <th className="px-4 py-3 border border-slate-600">IMAGING</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y">
                                                <tr>
                                                    <td className="px-2 py-2 border border-slate-700">
                                                        <ul className="space-y-2 align-top max-h-40 overflow-y-auto scroll-custom divide-y">
                                                            <li>
                                                                <div className="flex items-center space-x-4  ">
                                                                    <input
                                                                        type="checkbox" 
                                                                        className="w-3 h-3"
                                                                        name=""
                                                                        value=""
                                                                        // checked={checkedItem.includes(item.id)}
                                                                        // onChange={() => handleCheckbox(item.id)}
                                                                    />
                                                                    <p className="text-sm text-gray-500">XRAY</p>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="flex items-center space-x-4  ">
                                                                    <input
                                                                        type="checkbox" 
                                                                        className="w-3 h-3"
                                                                        name=""
                                                                        value=""
                                                                        // checked={checkedItem.includes(item.id)}
                                                                        // onChange={() => handleCheckbox(item.id)}
                                                                    />
                                                                    <p className="text-sm text-gray-500">ULTRASOUND</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="min-w-full border-collapse border border-slate-500 ">
                                            <thead>
                                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                                                    <th className="px-4 py-3 border border-slate-600">MEDICATIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y">
                                                <tr>
                                                    <div className="flex justify-center space-x-10 max-h-40 scroll-custom">
                                                        <div className="flex-col w-full h-40 border border-r-slate-600">
                                                            {/* <div className="border-b p-2">
                                                                <input 
                                                                    className="w-full p-2 border rounded" 
                                                                    placeholder="search bar"
                                                                />
                                                            </div> */}
                                                            <div className="overflow-y-auto scroll-custom h-full">
                                                                {leftItems.map(item => (
                                                                    <div 
                                                                        key={item.id} 
                                                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                                                        onClick={() => moveItemToRight(item.id)}
                                                                    >
                                                                    {item.name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex-col w-full h-58 border border-l-slate-600">
                                                            <div className="overflow-y-auto scroll-custom h-full">
                                                                {rightItems.map(item => (
                                                                    <div 
                                                                        key={item.id} 
                                                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                                                        onClick={() => moveItemToLeft(item.id)}
                                                                    >
                                                                    {item.name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-10">
                                        <div className="text-medium font-semibold text-center tracking-wide text-white uppercase border-b bg-green-500 px-4 py-4">
                                            <span>Doctor's notes</span>
                                        </div>

                                        <div>
                                            <div className="flex flex-col w-full">
                                                <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Subjective Symptoms:</label>
                                                <textarea 
                                                    className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                                                />
                                            </div>

                                            <div className="flex flex-col w-full">
                                                <div className="flex justify-between my-5">
                                                    <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Objective Findings:</label>
                                                    
                                                    <div>
                                                        <span className='ml-2 mb-2 mt-4 text-gray-700 uppercase font-bold text-sm'>Vitals:</span>

                                                        <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">BP: </label>
                                                        <input type="text" placeholder="Enter BP" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>

                                                        <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">HR: </label>
                                                        <input type="text" placeholder="Enter HR" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                                        
                                                        <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">Temp: </label>
                                                        <input type="text" placeholder="Enter Temp" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>

                                                        <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">O2 Sat: </label>
                                                        <input type="text" placeholder="Enter O2 Sat" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                                        
                                                        <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">Ht: </label>
                                                        <input type="text" placeholder="Enter Ht" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                                        
                                                        <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">Wt: </label>
                                                        <input type="text" placeholder="Enter Wt" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                                        
                                                        <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">BMI: </label>
                                                        <input type="text" placeholder="Enter BMI" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                                    </div>
                                                </div>

                                                <textarea 
                                                    className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                                                />
                                            </div>

                                            <div className="flex flex-col w-full">
                                                <div className="flex justify-between my-2">
                                                    <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Assesment:</label>
                                                </div>

                                                <textarea 
                                                    className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                                                />
                                            </div>

                                            <div className="flex flex-col w-full">
                                                <div className="flex justify-between my-2">
                                                    <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Plan:</label>
                                                </div>

                                                <textarea 
                                                    className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
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
                                    <ImagingResult imageType="XRAY" data={imagingResults}/>
                                </>
                            )}
                            {activeTab === 'tab5' && (
                                <div>
                                    {/* <button>GeneratePDF</button> */}
                                    {/* <Prescription data={prescriptionData}/> */}
                                    <Prescription />
                                </div>
                                // <div className="border p-4">
                                //     <div className="flex justify-between">
                                //         <img src="/path-to-logo.png" alt="Hospital Logo" className="h-16 w-16"/>
                                //         <div>
                                //             <h1 className="text-xl font-bold">Hospital Name</h1>
                                //             <p>Address</p>
                                //             <p>Contact Number</p>
                                //         </div>
                                //     </div>
                                    
                                //     <div className="my-4">
                                //         <p>Name: _____________________________ Date: ____________</p>
                                //         <p>Age and Gender: _____________________________</p>
                                //     </div>
                                    
                                //     <h2 className="text-center font-bold text-xl">REQUEST FORM</h2>
                                    
                                //     <table className="w-full mt-4 border">
                                //         {/* // ... Your table rows and columns with checkboxes and data ... */}
                                //     </table>
                                    
                                //     {/* // ... The rest of your components such as X-ray, ULTRASOUND, etc... */}
                                    
                                //     <div className="mt-4">
                                //         <h3>INSTRUCTIONS</h3>
                                //         <ul>
                                //             <li>data from textarea</li>
                                //             <li>data2 from textarea</li>
                                //             <li>data3 from textarea</li>
                                //         </ul>
                                //     </div>
                                    
                                //     <div className="mt-4">
                                //         <p>PRC No: ________________</p>
                                //         <p>PTR No: ________________</p>
                                //     </div>
                                // </div>
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

