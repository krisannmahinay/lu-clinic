
import React, { useState, useEffect, useCallback, useMemo, useRef, createContext } from "react"
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import { debounce, update } from 'lodash'

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

import { FormContext } from "@/utils/context"

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


const useRenderCount = () => {
    const renderCountRef = useRef(0)
    renderCountRef.current++
    console.log(`Rendered ${renderCountRef.current} times`)
}

const PatientInformation = ({ipdForms, opdForms, patientDataMaster, icd10Data}) => {
    useRenderCount()
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
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const [formData, setFormData] = useState({
        // last_name: "",
        // first_name: "",
        // middle_name: "",
        // email: "",
        // birth_date: "",
        // birth_place: "",
        // gender: "",
        // civil_status: "",
        // contact_no: "",
        // age: 0,
        // province: "",
        // municipality: "",
        // barangay: "",
        // street: "",
        // no_blk_lot: "",
        // nationality: "",
        // religion: "",
        // occupation: "",
        // employer_name: "",
        // employer_address: "",
        // employer_contact: "",
        // father_name: "",
        // father_address: "",
        // father_contact: "",
        // mother_name: "",
        // mother_address: "",
        // mother_contact: "",
        // spouse_name: "",
        // spouse_address: "",
        // spouse_contact: "",
        // admission_date: "",
        // discharge_date: "",
        // total_no_day: "",
        // admitting_physician: "",
        // admitting_clerk: "",
        // type_visit: "",
        // referred_by: "",
        // soc_serv_classification: "",
        // allergic_to: "",
        // hospitalization_plan: "",
        // health_insurance_name: "",
        // phic: "",
        // data_furnished_by: "",
        // address_of_informant: "",
        // relation_to_patient: "",
        // admission_diagnosis: "",
        // discharge_diagnosis: "",
        // principal_opt_proc: "",
        // other_opt_proc: "",
        // accident_injury_poison: "",
        // icdo10_code: "",
        // disposition: "",

        // last_name: "",
        // first_name: "",
        // middle_name: "",
        // gender: "",
        // birth_date: "",
        // age: 0,
        // patient_id: "",
        // patient_hrn: "",
        // date_visit: "",
        // type_visit: "",
        // admission_date: "",
        // discharge_date: "",
        // refered_by: "",
        // total_no_day: 0,
        // admitting_physician: "",
        // admitting_clerk: "",
        // soc_serv_classification: "",
        // allergic_to: "",
        // hospitalization_plan: "",
        // health_insurance_name: "",
        // phic: "",
        // address_of_informant: "",
        // relation_to_patient: "",
        // admission_diagnosis: "",
        // icd10_code: "",
        // disposition: "",
        // soap_subj_symptoms: "",
        // soap_obj_findings: "",
        // soap_assessment: "",
        // soap_plan: "",
        // vital_bp: 0,
        // vital_hr: 0,
        // vital_temp: 0,
        // vital_height: 0,
        // vital_weight: 0,
        // vital_bmi: 0,
        // case_number: "",
        // bed_id: "",
        // kin_to_notif: "",
        // kintonotif_relationship: "",
        // kintonotif_address: "",
        // kintonotif_contact_no: "",
        // data_furnished_by: "",
        // dfby_relation_to_patient: "",
        // dfby_address: "",
        // dfby_contact_no: "",
        // date_surgery: "",
        // principal_opt_proc_code: "",
        // other_opt_proc_code: "",
        // rvs_code: "",
        // allegic_to: "",
        // name_surgeon: "",
        // type_of_anesthesia: "",
        // principal_diagnosis: "",
        // other_diagnosis: "",
        // name_physician: ""
    })  
    
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


    useEffect(() => {
        if (provinceData) {
            const options = provinceData.map(item => ({
                value: item.code,
                label: item.name
            }))
            setInitialOptions(options)
        }
    }, [])

    const generatedInfoForms = useMemo(() => {
        return generateInfoForms()
    }, [])

    const handleCheckbox = (moduleId) => {
        if(checkedItem.includes(moduleId)) {
            setCheckedItem(checkedItem.filter((checked) => checked !== moduleId))
            
        } else {
            setCheckedItem([...checkedItem, moduleId])
        }
    }

    // const handleFieldChange = useCallback((e) => {
    //     const { name, value } = e.target
    //     setFormData(prevData => ({
    //         ...prevData, 
    //         [name]: value
    //     }))
    // }, [autoSave, formData])

    const autoSave = debounce(async (newData) => {
        try {
            // console.log(newData)
            // await autoSaveData(newData)
            // console.log("it works!")
        } catch(err) {
            // console.log(err)
        }
    })

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

    const handleOnSelect = (data) => {
        console.log(data)
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
        <div className="border-none overflow-hidden disable-selecting-text py-2 px-4">
            {/* <h3 className="text-gray-400 text-center font-bold uppercase text-medium">Part I</h3>
            <hr className="drop-shadow-md"/> */}
            <div className="lg:ml-[10rem] lg:mr-[10rem] :ml-0 md:mr-0 pb-7">
                {/* <Form
                    initialFields={personInfo}
                    enableAutoSave={true}
                    onFormChange={handleFormChange}
                    onClick={setIsModalOpen(true)}
                    onEditForm={(e, rowIndex, fieldName) => handleEditForm(e, rowIndex, fieldName)}
                    onSuccess={handleRefetch}
                    onCloseSlider={() => setActiveContent("yellow")}
                    onLoading={(data) => setBtnSpinner(data)}
                    onSetAlertType={(data) => setAlertType(data)}
                    onSetAlertMessage={(data) => setAlertMessage(data)}
                /> */}
                <FormContext.Provider value={{ 
                    data: patientDataMaster, 
                    initialFields: generatedInfoForms, 
                    provinceData: provinceData,
                    municipalityData: municipalityData,
                    barangayData: barangayData,
                    enableAutoSave: true, 
                    onSelectProvince: handleOnSelect
                }}>
                    <Form />
                </FormContext.Provider>
            </div>
        </div>
    )
}

export default React.memo(PatientInformation)