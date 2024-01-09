
import { useState, useEffect, useCallback } from "react"
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import { debounce } from 'lodash'

import { useGetCountryDataQuery } from '@/service/countryService'
import { 
    useGetProvinceDataQuery, 
    useGetMunicipalityDataQuery, 
    useGetBarangayDataQuery 
} from '@/service/psgcService'
import { useAutoSaveDataMutation } from '@/service/patientService'
import { useGetICDDataQuery } from '@/service/icdService'
import Form from "@/components/Form"
import { 
    generateInfoForms, 
    generateOtherPatientForms, 
    generatePatientForms 
} from "@/utils/forms"

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

const PatientInformation = ({ipdForms, opdForms, patientDataMaster, icd10Data}) => {
    const [formData, setFormData] = useState({
        last_name: "",
        first_name: "",
        middle_name: "",
        email: "",
        birth_date: "",
        birth_place: "",
        gender: "",
        civil_status: "",
        contact_no: 0,
        age: 0,
        province: "",
        municipality: "",
        barangay: "",
        street: "",
        no_blk_lot: 0,
        nationality: "",
        religion: "",
        occupation: "",
        employer_name: "",
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
        admission_date: "",
        discharge_date: "",
        total_no_day: "",
        admitting_physician: "",
        admitting_clerk: "",
        type_visit: "",
        referred_by: "",
        soc_serv_classification: "",
        allergic_to: "",
        hospitalization_plan: "",
        health_insurance_name: "",
        phic: "",
        data_furnished_by: "",
        address_of_informant: "",
        relation_to_patient: "",
        admission_diagnosis: "",
        discharge_diagnosis: "",
        principal_opt_proc: "",
        other_opt_proc: "",
        accident_injury_poison: "",
        icdo10_code: "",
        disposition: ""
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
    const [personInfo, setPersonInfo] = useState([])
    const [patientInfo, setPatientInfo] = useState([])
    const [otherPatientInfo, setOtherPatientInfo] = useState([])
    
    const initialOpenIds = accordionItem.map(item => item.id)
    // const [accordionIdOpen, setAccordionIdOpen] = useState(initialOpenIds)
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

    console.log(patientDataMaster)

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
                last_name: patientDataMaster?.user_data_info?.last_name || "",
                first_name: patientDataMaster?.user_data_info?.first_name || "",
                middle_name: patientDataMaster?.user_data_info?.middle_name || "",
                gender: patientDataMaster?.user_data_info?.gender || "",
                birth_date: patientDataMaster?.user_data_info?.birth_date || "",
                age: patientDataMaster?.user_data_info?.age || "",
                patient_id: patientDataMaster?.patient_id || "",
                patient_hrn: patientDataMaster?.patient_hrn || "",
                date_visit: patientDataMaster?.date_visit || "",
                type_visit: patientDataMaster?.type_visit || "",
                admission_date: patientDataMaster?.admission_date || "",
                discharge_date: patientDataMaster?.discharge_date || "",
                refered_by: patientDataMaster?.refered_by || "",
                total_no_day: patientDataMaster?.total_no_day || "",
                admitting_physician: `Dr. ${patientDataMaster?.physician_data_info?.first_name} ${patientDataMaster?.physician_data_info?.last_name}` || "",
                admitting_clerk: `${patientDataMaster?.clerk_data_info?.last_name} ${patientDataMaster?.clerk_data_info?.first_name}` || "",
                soc_serv_classification: patientDataMaster?.soc_serv_classification || "",
                allergic_to: patientDataMaster?.allergic_to || "",
                hospitalization_plan: patientDataMaster?.hospitalization_plan || "",
                health_insurance_name: patientDataMaster?.health_insurance_name || "",
                phic: patientDataMaster?.phic || "",
                address_of_informant: patientDataMaster?.address_of_informant || "",
                relation_to_patient: patientDataMaster?.relation_to_patient || "",
                admission_diagnosis: patientDataMaster?.admission_diagnosis || "",
                icd10_code: patientDataMaster?.icd10_code || "",
                disposition: patientDataMaster?.disposition || "",
                soap_subj_symptoms: patientDataMaster?.soap_subj_symptoms || "",
                soap_obj_findings: patientDataMaster?.soap_obj_findings || "",
                soap_assessment: patientDataMaster?.soap_assessment || "",
                soap_plan: patientDataMaster?.soap_plan || "",
                vital_bp: patientDataMaster?.vital_bp || "",
                vital_hr: patientDataMaster?.vital_hr || "",
                vital_temp: patientDataMaster?.vital_temp || "",
                vital_height: patientDataMaster?.vital_height || "",
                vital_weight: patientDataMaster?.vital_weight || "",
                vital_bmi: patientDataMaster?.vital_bmi || "",

            })
        }   

    }, [provinceData, userDetails, patientDataMaster])

    useEffect(() => {
        if(formData) {
            const data = generateInfoForms(formData, provinceData, municipalityData, barangayData)
            setPersonInfo(data)
        }
    }, [formData])


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
        <div className="">
            <div className="border-none overflow-hidden disable-selecting-text py-2 px-4">
                {/* <h3 className="text-gray-400 text-center font-bold uppercase text-medium">Part I</h3>
                <hr className="drop-shadow-md"/> */}
                <div className="lg:ml-[10rem] lg:mr-[10rem] :ml-0 md:mr-0 pb-7">
                    <Form
                        initialFields={personInfo}
                        enableAutoSave={true}
                        // onSuccess={handleRefetch}
                        // onCloseSlider={() => setActiveContent("yellow")}
                        // onLoading={(data) => setBtnSpinner(data)}
                        // onSetAlertType={(data) => setAlertType(data)}
                        // onSetAlertMessage={(data) => setAlertMessage(data)}
                    />
                </div>
            </div>
        </div>
    )
}

export default PatientInformation