
import { useState, useEffect, useCallback } from "react"
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import { debounce } from 'lodash'

import { useGetCountryDataQuery } from '@/service/countryService'
import { useGetProvinceDataQuery, useGetMunicipalityDataQuery, useGetBarangayDataQuery } from '@/service/psgcService'
import { useAutoSaveDataMutation } from '@/service/patientService'

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
    identity: {last_name: "Doe", given_name: "John", middle_name: "", bed_rm: ""}
}

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

const PatientInformation = () => {
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

    const [lastName, setLastName] = useState(userDetails ? userDetails.identity.last_name : '')
    const [givenName, setGivenName] = useState(userDetails ? userDetails.identity.given_name : '')
    const [middleName, setMiddleName] = useState(userDetails ? userDetails.identity.middle_name : '')
    const [bedRm, setBedRm] = useState(userDetails ? userDetails.identity.bed_rm : '')

    const { data: countryData } = useGetCountryDataQuery()
    const { data: provinceData } = useGetProvinceDataQuery()
    const { data: municipalityData } = useGetMunicipalityDataQuery({provinceCode: provinceCode}, {enabled: !!provinceCode})
    const { data: barangayData } = useGetBarangayDataQuery({municipalCode: municipalCode}, {enabled: !!municipalCode})

    const [autoSaveData] = useAutoSaveDataMutation()

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

    // const handleAutoSave = debounce(async () => {
    //     const formData = {
    //         lastName,
    //         givenName,
    //         middleName,
    //         bedRm
    //     }
    //     try {
    //         await autoSaveData(formData).unwrap()
    //         console.log("it works")
    //     } catch (err) {
    //         console.log("not works:", err)
    //     }
    // }, 1000)

    // const handleChange = useCallback((e) => {
    //     const { name, value } = e.target
    //     switch (name) {
    //         case 'lastName':
    //             setLastName(value)
    //             break
    //         case 'givenName':
    //             setGivenName(value)
    //             break
    //         case 'middleName':
    //             setMiddleName(value)
    //             break
    //         case 'wardRmBed':
    //             setBedRm(value)
    //             break
    //         // ... add more fields as necessary
    //         default:
    //             break
    //     }

    //     // handleAutoSave()
    // }, [handleAutoSave])

    const handleBlur = useCallback(async () => {
        const formData = {
            lastName,
            givenName,
            middleName,
            bedRm
        }
        try {
            await autoSaveData(formData).unwrap()
            console.log("it works")
        } catch (err) {
            console.log("not works:", err)
        }
    }, [lastName, givenName, middleName, bedRm, autoSaveData])

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
    
    const handleSexChange = (selectedOption) => {
        setSelectedSex(selectedOption)
    }

    const handleCivilStatusChange = (selectedOption) => {
        setSelectedCivil(selectedOption)
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

    return (
        <div className="bg-white rounded-md  max-w-l w-full mx-auto">
            <div className=" flex justify-center items-center mb-6">
                <div className="relative rounded-full border overflow-hidden w-24 h-24">
                    <img 
                        src={imagePreviewUrl} 
                        alt="img" 
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                    {/* <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer z-0"> */}
                        <label htmlFor="photo-upload" className="cursor-pointer">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0020.07 7H21a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </label>
                        <input type="file" id="photo-upload" className="hidden" onChange={handleImageChange}/>
                    </div>
                </div>   
            </div>
            
            <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                <div className="flex flex-col w-full">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">LAST NAME</label>
                    <input type="text" name="lastName" value={lastName} onBlur={handleBlur} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">GIVEN NAME</label>
                    <input type="text" name="givenName" value={givenName} onBlur={handleBlur} onChange={(e) => setGivenName(e.target.value)} placeholder="Enter given name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">MIDDLE NAME</label>
                    <input type="text" name="middleName" value={middleName} onBlur={handleBlur} onChange={(e) => setMiddleName(e.target.value)} placeholder="Enter given name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">WARD/RM/BED/SERVICE</label>
                    <input type="text" name="wardRmBed" value={bedRm} onBlur={handleBlur} onChange={(e) => setBedRm(e.target.value)} placeholder="Enter warm/rm/bed/service" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
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
                        styles={styleDropdown} 
                    />
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
                        styles={styleDropdown} 
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
                        styles={styleDropdown} 
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
                        styles={styleDropdown} 
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
                    <Select 
                        options={genderData?.map(country => ({ value: country.value, label: country.label }))}
                        onChange={handleSexChange}
                        isSearchable={true}
                        isClearable={true}
                        placeholder="Select a gender..."
                        classNamePrefix="react-select"
                        styles={styleDropdown} 
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Civil Status</label>
                    <Select 
                        options={civilStatusData?.map(country => ({ value: country.value, label: country.label }))}
                        onChange={handleCivilStatusChange}
                        isSearchable={true}
                        isClearable={true}
                        placeholder="Select a civil status..."
                        classNamePrefix="react-select"
                        styles={styleDropdown} 
                    />
                </div>
            </div>
            
            <div className="flex gap-4 mb-2">
                <div className="flex flex-col w-full">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">Birthday</label>
                    <input type="date" value={birthDate} onChange={handleBirthDateChange} className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="ml-2 mb-2 text-gray-500 font-bold uppercase text-xs">age</label>
                    <input type="text" value={age} placeholder="Enter age" disabled className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
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
                    <input type="datetime-local" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
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
    )
}

export default PatientInformation