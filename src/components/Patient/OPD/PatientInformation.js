
import { useState, useEffect, useCallback } from "react"
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import { debounce } from 'lodash'

import { useGetCountryDataQuery } from '@/service/countryService'
import { useGetProvinceDataQuery, useGetMunicipalityDataQuery, useGetBarangayDataQuery } from '@/service/psgcService'
import { useAutoSaveDataMutation } from '@/service/patientService'
import { useGetICDDataQuery } from '@/service/icdService'

const genderData = [
    {value: "male", label: "Male"},
    {value: "female", label: "Female"}
]

const civilStatusData = [
    {value: "s", label: "Single"},
    {value: "m", label: "Married"},
    {value: "sep", label: "Separated"},
    {value: "w", label: "Widow"}
]

const dispositionData = [
    { id: 1, name: "Improved" },
    { id: 2, name: "Uinmproved" },
    { id: 3, name: "Transferred" },
    { id: 4, name: "HAMA" },
    { id: 5, name: "Absconded" },
    { id: 6, name: "Expired" },
]

const userDetails = {
    identity: {last_name: "Doe", given_name: "John", middle_name: "", ward_bed_rm: ""}
}

const accordionItem = [
    {
        id:1,
        title: "PART I" 
    }, 
    {
        id:2,
        title: "PART II"
    },
    {
        id:3,
        title: "PART III"
    }
]


// console.log(userDetails.identity)

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

const icdDataHeaders = [
    "icd_codes",
    "name"
]

const labelCss = "ml-2 mb-2 text-gray-500 font-medium capitalize text-sm"

const custom_label_style = "block text-gray-500 font-medium text-sm mt-4 capitalize"
const custom_form_field_style = "border border-gray-200 px-3 py-1 focus:border-gray-500 bg-gray-200 focus:outline-none w-full"

const PatientInformation = ({ipdForms, opdForms, patientDataMaster, icd10}) => {
    const [formData, setFormData] = useState({
        last_name: "",
        first_name: "",
        middle_name: "",
        ward_bed_rm: "",
        country: "",
        province: "",
        state_municipality: "",
        barangay: "",
        street: "",
        no_blk_lot: "",
        telNo: "",
        sex: "",
        civil_status: "",
        birth_date: "",
        age: "",
        birth_place: "",
        nationality: "",
        religion: "",
        occupation: "",
        employer: "",
        employer_address: "",
        employer_contact: "",
        father_name: "",
        father_address: "",
        father_contact: "",
        mother_name: "",
        mother_address: "",
        mother_contact: "",
        spouse_name: "",
        spouse_address: "",
        spouse_contact: "",

        admitting_physician: "",
        admitting_clerk: "",

    })  

    const [imagePreviewUrl, setImagePreviewUrl] = useState('/path/to/default-photo.png')
    const [selectedProvince, setSelectedProvince] = useState(null)
    const [selectedMunicipal, setSelectedMunicipal] = useState(null)
    const [selectedBarangay, setSelectedBarangay] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedSex, setSelectedSex] = useState(null)
    const [selectedCivil, setSelectedCivil] = useState(null)
    const [birthDate, setBirthDate] = useState("")
    const [age, setAge] = useState("")
    const [provinceCode, setProvinceCode] = useState(null)
    const [municipalCode, setMunicipalCode] = useState(null)
    const [initialOptions, setInitialOptions] = useState([]) 
    const [checkedItem, setCheckedItem] = useState([])
    const [selectedSocService, setSelectedSocService] = useState(null)
    const [selectedGovType, setSelectedGovType] = useState(null)
    const [selectedDisposition, setSelectedDisposition] = useState(null)
    const [selectedType, setSelectedType] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    
    const initialOpenIds = accordionItem.map(item => item.id)
    const [accordionIdOpen, setAccordionIdOpen] = useState(initialOpenIds)

    const { data: countryData } = useGetCountryDataQuery()
    const { data: provinceData } = useGetProvinceDataQuery()
    const { data: municipalityData } = useGetMunicipalityDataQuery({provinceCode: provinceCode}, {enabled: !!provinceCode})
    const { data: barangayData } = useGetBarangayDataQuery({municipalCode: municipalCode}, {enabled: !!municipalCode})

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

    const [autoSaveData] = useAutoSaveDataMutation()

    // console.log(icd10)

    useEffect(() => {
        if (provinceData) {
            const options = provinceData.map(item => ({
                value: item.code,
                label: item.name
            }))
            setInitialOptions(options)
        }
        if (userDetails) {
            setFormData(userDetails?.identity)
        }
        if(patientDataMaster) {
            setFormData({
                last_name: patientDataMaster?.patient_identity?.last_name || "",
                first_name: patientDataMaster?.patient_identity?.first_name || "",
                middle_name: patientDataMaster?.patient_identity?.middle_name || "",
                gender: patientDataMaster?.patient_identity?.gender || "",
                admitting_physician: `Dr. ${patientDataMaster?.physician_identity?.first_name} ${patientDataMaster?.physician_identity?.last_name}` || "",
                standard_charge: "",
                birth_date: patientDataMaster?.patient_identity?.birth_date || "",
                age: patientDataMaster?.patient_identity?.age || ""
            })
        }   
    }, [provinceData, userDetails, patientDataMaster])

    console.log(patientDataMaster)

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

    const handleGovType = (type) => {
        if(selectedGovType === type) {
            setSelectedGovType(null)
        } else {
            setSelectedGovType(type)
        }
    }

    const handleSocService = (type) => {
        if (selectedSocService === type) {
            setSelectedSocService(null) // Uncheck if already checked
        } else {
            // const extractRm = bedRoomData.map
            setSelectedSocService(type)

        }
    }

    const handleDisposition = (type) => {
        if(selectedDisposition === type) {
            setSelectedDisposition(null)
        } else {
            setSelectedDisposition(type)
        }
    }

    const autoSave = debounce(async (newData) => {
        try {
            console.log(newData)
            // await autoSaveData(newData)
            console.log("it works!")
        } catch(err) {
            console.log(err)
        }
    })

    const handleFieldChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData, 
            [name]: value
        }))
        autoSave({...formData, [name]: value})
    }, [autoSave, formData])

    const handleProvinceChange = (selectedOption) => {
        setSelectedProvince(selectedOption?.label)
        setProvinceCode(selectedOption?.value)
    }

    const handleMunicipalityChange = (selectedOption) => {
        setSelectedMunicipal(selectedOption?.label)
        setMunicipalCode(selectedOption?.value)
        setFormData(prevData => ({
            ...prevData,
            state_municipality: selectedOption?.value
            
        }))
    }

    const handleBarangayChange = (selectedOption) => {
        setSelectedBarangay(selectedOption?.label)
    }

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption?.label)
    }
    
    const handleSexChange = (selectedOption) => {
        setSelectedSex(selectedOption)
    }

    const handleCivilStatusChange = (selectedOption) => {
        setSelectedCivil(selectedOption)
    }

    const handleSearchICD = (keywords) => {
        setSearchQuery(keywords)
    }

    const handleCheckbox = (moduleId) => {
        if(checkedItem.includes(moduleId)) {
            setCheckedItem(checkedItem.filter((checked) => checked !== moduleId))
            
        } else {
            setCheckedItem([...checkedItem, moduleId])
        }
    }

    const handleBirthDateChange = (e) => {
        setBirthDate(e.target.value)
        const birth = new Date(e.target.value)
        const today = new Date()
        let calculatedAge = today.getFullYear() - birth.getFullYear() - (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0)
        setAge(calculatedAge)
    }

    const handleImageChange = async (e) => {
        e.preventDefault()
    
        const file = e.target.files[0]
        const reader = new FileReader()
    
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result)
          // Handle autosave here. 
          // If you're using something like Axios, it could be axios.post('/path/to/upload', file);
          // If you're using Next.js's API routes, it could be a fetch to your API route.
        }
    
        if (file) {
          reader.readAsDataURL(file)
        }
    }

    const toggleAccordion = (id) => {
        setAccordionIdOpen(prevState => {
            if (prevState.includes(id)) {
                return prevState.filter(accordionId => accordionId !== id)
            } else {
                return [...prevState, id]
            }
        })
    }

    return (
        <div className="space-y-4">
                {accordionItem.map(item => (
                    <div key={item.id} className="border-none overflow-hidden disable-selecting-text sm:ml-[10rem] mr-[10rem] py-2 px-4">
                        <div 
                            className="cursor-pointer text-center bg-[#15803d] p-4" 
                            onClick={() => toggleAccordion(item.id)}
                        >
                            <h3 className="text-white font-bold uppercase text-xs">{item.title}</h3>
                        </div>
                        
                        <div className=" ">
                            {accordionIdOpen.includes(item.id) && (
                                item.id === 1 ? (
                                    <>
                                    <div className="py-3 space-y-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>last name: </label>
                                                <input 
                                                    type="text" 
                                                    name="last_name"
                                                    value={formData.last_name} 
                                                    onChange={(e) => handleFieldChange(e)} 
                                                    className={custom_form_field_style}
                                                />
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>given name: </label>
                                                <input 
                                                    type="text" 
                                                    name="first_name"
                                                    value={formData.first_name} 
                                                    onChange={(e) => handleFieldChange(e)} 
                                                    className={custom_form_field_style}
                                                />
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>middle name: </label>
                                                <input 
                                                    type="text" 
                                                    name="middle_name"
                                                    value={formData.middle_name} 
                                                    onChange={(e) => handleFieldChange(e)} 
                                                    className={custom_form_field_style}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>ward-rm-bed</label>
                                                <input 
                                                    type="text" 
                                                    name="ward_bed_rm"
                                                    value={formData.ward_bed_rm} 
                                                    onChange={(e) => handleFieldChange(e)} 
                                                    className={custom_form_field_style}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className={custom_label_style}>country</label>
                                                <div className="w-full">
                                                    <Select 
                                                        options={countryData?.map(country => ({ value: country.name, label: country.name }))}
                                                        onChange={handleCountryChange}
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        placeholder="Select a country..."
                                                        classNamePrefix="react-select"
                                                        styles={styleDropdown} 
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>province</label>
                                                <div className="w-full">
                                                    <AsyncSelect 
                                                        cacheOptions
                                                        loadOptions={loadProvince}
                                                        defaultOptions={initialOptions}
                                                        onChange={handleProvinceChange}
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        placeholder="Select a province..."
                                                        classNamePrefix="react-select"
                                                        styles={styleDropdown}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>state/municipality</label>
                                                <div className="w-full">
                                                    <Select 
                                                        options={municipalityData?.map(barangay => ({ value: barangay.code, label: barangay.name }))}
                                                        onChange={handleMunicipalityChange}
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        placeholder="Select a state..."
                                                        classNamePrefix="react-select"
                                                        styles={styleDropdown} 
                                                        value={municipalityData?.find(data =>
                                                            data.value === formData.state_municipality 
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>barangay</label>
                                                <div className="w-full">
                                                    <Select 
                                                        options={barangayData?.map(barangay => ({ value: barangay.code, label: barangay.name }))}
                                                        onChange={handleBarangayChange}
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        placeholder="Select a barangay..."
                                                        classNamePrefix="react-select"
                                                        styles={styleDropdown} 
                                                        value={barangayData?.find(data =>
                                                            data.value === formData.barangay 
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>street</label>
                                                <input type="text" placeholder="Enter street" className={custom_form_field_style}/>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>No/blk/lot</label>
                                                <input type="text" placeholder="Enter no" className={custom_form_field_style}/>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>Mobile No.</label>
                                                <input type="text" placeholder="Enter Mobile No." className={custom_form_field_style}/>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>Sex</label>
                                                <div className="w-full">
                                                    <Select 
                                                        options={genderData?.map(gender => ({ value: gender.value, label: gender.label }))}
                                                        onChange={handleSexChange}
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        placeholder="Select a gender..."
                                                        classNamePrefix="react-select"
                                                        styles={styleDropdown}
                                                        value={genderData?.find(data =>
                                                            data.value === formData.gender 
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>Civil Status</label>
                                                <div className="w-full">
                                                    <Select 
                                                        options={civilStatusData?.map(country => ({ value: country.value, label: country.label }))}
                                                        onChange={handleCivilStatusChange}
                                                        isSearchable={true}
                                                        isClearable={true}
                                                        placeholder="Select a civil status..."
                                                        classNamePrefix="react-select"
                                                        styles={styleDropdown} 
                                                        value={formData.civil_status}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>Birthday</label>
                                                <input type="date" value={formData.birth_date} onChange={handleBirthDateChange} className={custom_form_field_style}/>
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>age</label>
                                                <input type="text" value={formData.age} disabled className="border-none bg-gray-200 px-3 py-2 focus:outline-none w-full"/>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>birth place</label>
                                                <input type="text" placeholder="Enter birth-place" className={custom_form_field_style}/>
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>nationality</label>
                                                <input type="text" placeholder="Enter nationality" className={custom_form_field_style}/>
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>religion</label>
                                                <input type="text" placeholder="Enter religion" className={custom_form_field_style}/>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>occupation</label>
                                                <input type="text" placeholder="Enter occupation" className={custom_form_field_style}/>
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>employer (Type of Business)</label>
                                                <input type="text" placeholder="Enter employer" className={custom_form_field_style}/>
                                            </div>

                                            <div>
                                                <label className={custom_label_style}>address</label>
                                                <input type="text" placeholder="Enter address" className={custom_form_field_style}/>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>Mobile no</label>
                                                <input type="text" placeholder="Enter Mobile no" className={custom_form_field_style}/>
                                            </div>
                                            {ipdForms && (
                                                <>
                                                    <div>
                                                        <label className={custom_label_style}>Next of Kin or Whom to Notify</label>
                                                        <input type="text" placeholder="Enter fathers name" className={custom_form_field_style}/>
                                                    </div>

                                                    <div>
                                                        <label className={custom_label_style}>Relationship</label>
                                                        <input type="text" placeholder="Enter address" className={custom_form_field_style}/>
                                                    </div>

                                                    <div>
                                                        <label className={custom_label_style}>Address</label>
                                                        <input type="text" placeholder="Enter Mobile no" className={custom_form_field_style}/>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className={custom_label_style}>Contact No</label>
                                                        <input type="text" placeholder="Enter Mobile no" className={custom_form_field_style}/>
                                                    </div>
                                                </>
                                            )}
                                            <div>
                                                <label className={custom_label_style}>fathers name</label>
                                                <input type="text" placeholder="Enter fathers name" className={custom_form_field_style}/>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>address</label>
                                                <input type="text" placeholder="Enter address" className={custom_form_field_style}/>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>Mobile no</label>
                                                <input type="text" placeholder="Enter Mobile no" className={custom_form_field_style}/>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>mothers (Maiden) NAME</label>
                                                <input type="text" placeholder="Enter mothers name" className={custom_form_field_style}/>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>address</label>
                                                <input type="text" placeholder="Enter address" className={custom_form_field_style}/>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>Mobile no</label>
                                                <input type="text" placeholder="Enter Mobile no" className={custom_form_field_style}/>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>spouse name</label>
                                                <input type="text" placeholder="Enter spouse name" className={custom_form_field_style}/>
                                            </div>
                                            <div>
                                                <label className={custom_label_style}>address</label>
                                                <input type="text" placeholder="Enter address" className={custom_form_field_style}/>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className={custom_label_style}>Mobile no</label>
                                                <input type="text" placeholder="Enter number" className={custom_form_field_style}/>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                ) : item.id === 2 ? (
                                    <>
                                        <div className="py-3 space-y-2">
                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    <label className={custom_label_style}>Admission</label>
                                                    <input type="datetime-local" className={custom_form_field_style}/>
                                                </div>

                                                <div>
                                                    <label className={custom_label_style}>discharge</label>
                                                    <input type="datetime-local" className={custom_form_field_style}/>
                                                </div>

                                                <div>
                                                    <label className={custom_label_style}>total days</label>
                                                    <input type="text" className="border-none bg-gray-200 px-3 py-2 focus:outline-none w-full" disabled/>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    <label className={custom_label_style}>Admitting Clerk</label>
                                                    <input type="text" value={formData.admitting_clerk} className={custom_form_field_style}/>
                                                </div>
                                                <div>
                                                    <label className={custom_label_style}>admitting physician</label>
                                                    <input type="text" placeholder="" value={formData.admitting_physician} className={custom_form_field_style}/>
                                                </div>
                                                <div>
                                                    <label className={custom_label_style}>Type of Admission</label>
                                                    <input type="text" placeholder="" className={custom_form_field_style}/>
                                                </div>
                                                <div>
                                                    <label className={custom_label_style}>Refered by (Physician/Health Facility)</label>
                                                    <input type="text" placeholder="" className={custom_form_field_style}/>
                                                </div>
                                            </div>
                                        </div>

                                     <div className="py-4 space-y-2">
                                         {/* <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Admission</label>
                                             <input type="datetime-local" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">discharge</label>
                                             <input type="datetime-local" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">TOTAL NO. OF DAY</label>
                                             <input type="text" className="border-none bg-gray-200 px-3 py-2 focus:outline-none w-1/2" disabled/>
                                         </div>
                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">ADMITTING PHYSICIAN</label>
                                             <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Admitting Clerk</label>
                                             <input type="text" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>
                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">ADMITTING PHYSICIAN</label>
                                             <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>
                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Type of Admission</label>
                                             <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>
                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Refered by (Physician/Health Facility)</label>
                                             <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>
                                      
                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Social Service Classification</label>
                                             <div className="flex w-1/2 ml-2 space-x-3">
                                                 <input className="w-5 h-5" type="checkbox" checked={selectedSocService === 'a'} onChange={() => handleSocService('a')} />
                                                 <label className={labelCss}>A</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedSocService === 'b'} onChange={() => handleSocService('b')} />
                                                 <label className={labelCss}>B</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedSocService === 'c1'} onChange={() => handleSocService('c1')} />
                                                 <label className={labelCss}>C1</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedSocService === 'c2'} onChange={() => handleSocService('c2')} />
                                                 <label className={labelCss}>C2</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedSocService === 'c3'} onChange={() => handleSocService('c3')} />
                                                 <label className={labelCss}>C3</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedSocService === 'd'} onChange={() => handleSocService('d')} />
                                                 <label className={labelCss}>D</label>
                                             </div>
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Hospitalization Plan (Company/Industrial Name)</label>
                                             <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Health Insurance Name</label>
                                             <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2"/>
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">PHIC</label>
                                             <div className="flex w-1/2 ml-2 space-x-3">
                                                 <input className="w-5 h-5" type="checkbox" checked={selectedGovType === 'sss'} onChange={() => handleGovType('sss')} />
                                                 <label className={labelCss}>SSS</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedGovType === 'sss_dependent'} onChange={() => handleGovType('sss_dependent')} />
                                                 <label className={labelCss}>SSS Dependent</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedGovType === 'gsis'} onChange={() => handleGovType('gsis')} />
                                                 <label className={labelCss}>GSIS</label>

                                                 <input className="w-5 h-5" type="checkbox" checked={selectedGovType === 'gsis_dependent'} onChange={() => handleGovType('gsis_dependent')} />
                                                 <label className={labelCss}>GSIS Dependent</label>
                                             </div>
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Data Furnished By</label>
                                             <input type="text" className="border-none bg-gray-200 px-3 py-2 focus:outline-none w-1/2" disabled/>
                                         </div>
                                      
                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Address of Informant</label>
                                             <input type="text" placeholder="Enter address" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2" />
                                         </div>

                                         <div className="flex items-center justify-between">
                                             <label className="ml-2 text-gray-500 font-bold uppercase text-xs">Contact No</label>
                                             <input type="text" placeholder="Enter number" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-1/2" />
                                         </div> */}
                                     </div>
                                    </>

                                ) : item.id === 3 ? (
                                    <>
                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Admission Diagnosis:</label>
                                            <textarea 
                                                className={`${custom_form_field_style} h-40`}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Discharge Diagnosis:</label>
                                            <textarea 
                                                className={`${custom_form_field_style} h-40`}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Principal Diagnosis:</label>
                                            <textarea 
                                                className={`${custom_form_field_style} h-40`}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Other Diagnosis:</label>
                                            <textarea 
                                                className={`${custom_form_field_style} h-40`}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Principal Operation/s Procedures:</label>
                                            <textarea 
                                                className={`${custom_form_field_style} h-40`}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Other Operation/s or Procedures:</label>
                                            <textarea 
                                                className={`${custom_form_field_style} h-40`}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>ICD Codes:</label>
                                            <div className="w-full">
                                                <Select 
                                                    options={icd10?.map(icd => ({ 
                                                        value: icd.icd10_code, 
                                                        label: `${icd.icd10_code} ${icd.icd10_desc}` 
                                                    }))}
                                                    onInputChange={handleSearchICD}
                                                    isSearchable={true}
                                                    isClearable={true}
                                                    placeholder="Search for icd..."
                                                    classNamePrefix="react-select"
                                                    styles={styleDropdown} 
                                                />
                                            </div>
                                        </div>

                                        
                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Accident/Injuries/Poisoning:</label>
                                            <textarea 
                                                className={`${custom_form_field_style} h-40`}
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label className={custom_label_style}>Disposition:</label>
                                            <div className="flex flex-col w-1/2 mb-4">
                                                <div className="flex ml-2 space-x-2">
                                                    <input  className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'improved'} onChange={() => handleDisposition('improved')} />
                                                    <label className={labelCss}>Improved</label>
                                                </div>
                                                
                                                <div className="flex ml-2 space-x-2">
                                                    <input className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'unimproved'} onChange={() => handleDisposition('unimproved')} />
                                                    <label className={labelCss}>Unimproved</label>
                                                </div>
                                                <div className="flex ml-2 space-x-2">
                                                    <input className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'transferred'} onChange={() => handleDisposition('transferred')} />
                                                    <label className={labelCss}>Transferred</label>
                                                </div>
                                                <div className="flex ml-2 space-x-2">
                                                    <input className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'hama'} onChange={() => handleDisposition('hama')} />
                                                    <label className={labelCss}>HAMA</label>
                                                </div>
                                                <div className="flex ml-2 space-x-2">
                                                    <input className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'absconded'} onChange={() => handleDisposition('absconded')} />
                                                    <label className={labelCss}>Absconded</label>
                                                </div>
                                                <div className="flex ml-2 space-x-2">
                                                    <input className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'expired' || selectedDisposition === "u48h" || selectedDisposition === "m48h"} onChange={() => handleDisposition('expired')} />
                                                    <label className={labelCss}>Expired</label>
                                                </div>
                                                {(selectedDisposition === "expired" || selectedDisposition === "u48h" || selectedDisposition === "m48h") && (
                                                    <>
                                                        <div className="flex ml-6 space-x-2">
                                                            <input className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'u48h'} onChange={() => handleDisposition('u48h')} />
                                                            <label className={labelCss}>under 48 hours</label>
                                                        </div>
                                                        
                                                        <div className="flex ml-6 space-x-2">
                                                            <input className="w-5 h-5" type="checkbox" checked={selectedDisposition === 'm48h'} onChange={() => handleDisposition('m48h')} />
                                                            <label className={labelCss}>more than 48 hours</label>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : ""
                            
                            )}  
                        </div>
                    </div>
                ))}
                
        </div>
    )
}

export default PatientInformation