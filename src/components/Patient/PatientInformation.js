import { useComponentContext, useModalContext } from "@/utils/context"
import { useCallback, useEffect, useState } from "react"
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { 
    useAutoSaveDataMutation
} from '@/service/patientService'

const styleDropdown = {
    control: (provided) => ({
        ...provided,
        // border: '1px solid gray',
        margin: 0,
        padding: 0,
        boxShadow: 'none',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        backgroundColor: 'rgb(243 244 246)',
        '&:hover': {
          borderColor: 'gray',
          border: '1px solid gray'
        },
        '&:focus': {
            border: 'none'
        }
      }),
      input: (provided) => ({
        ...provided,
        inputOutline: 'none',
      })
}

const genderOption = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'}
]

const civilStatusOption = [
    {value: "s", label: "Single"},
    {value: "m", label: "Married"},
    {value: "sep", label: "Separated"},
    {value: "w", label: "Widow"}
]

const dispositionArray = [
    { name: 'improved', label: 'Improved'},
    { name: 'unimproved', label: 'Unimproved'},
    { name: 'transferred', label: 'Transferred'},
    { name: 'hama', label: 'HAMA'},
    { name: 'absconded', label: 'Absconded'},
    { name: 'expired', label: 'Expired'},
    { name: 'u48h', label: 'under 48 hours', parent: 'expired'},
    { name: 'm48h', label: 'more than 48 hours', parent: 'expired'}
]

const PatientInformation = () => {
    const componentContext = useComponentContext()
    const modalContext = useModalContext()
    const icdCode = componentContext?.state?.clickedValue?.icd10_code
    const poptProcedure = componentContext?.state?.clickedValue?.popt_proc
    const ooptProcedure = componentContext?.state?.clickedValue?.oopt_proc
    const userDetails = componentContext?.state?.userDetails
    const clerkData = componentContext?.state?.profileData?.clerk_data_info
    const physicianData = componentContext?.state?.profileData?.physician_data_info
    const profileData = componentContext?.state?.profileData?.user_data_info
    const patientData = componentContext?.state?.profileData
    const provinceData = componentContext?.state?.provinceData
    const municipalityData = componentContext?.state?.municipalityData
    const barangayData = componentContext?.state?.barangayData
    const [addressTickBox, setAddressTickBox] = useState({
        fatherAddressTick: false,
        motherAddressTick: false,
        spouseAddressTick: false
    })
    const [socServiceTickBox, setSocServiceTickBox] = useState(null)
    const [phicTickBox, setPhicTickBox] = useState(null)
    const [formData, setFormData] = useState({
        last_name: "",
        first_name: "",
        middle_name: "",
        email: "",
        birth_date: "",
        birth_place: "",
        gender: "",
        civil_status: "",
        contact_no: "",
        age: 0,
        province: "",
        municipality: "",
        barangay: "",
        street: "",
        no_blk_lot: "",
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
        principal_opt_code: "",
        principal_opt_desc: "",
        other_opt_code: "",
        other_opt_desc: "",
        accident_injury_poison: "",
        // icdo10_code: "",
        // disposition: "",
    })

    useEffect(() => {
        if(profileData && patientData && userDetails && clerkData) {
            setFormData({
                // personal information
                last_name: profileData.last_name || "",
                first_name: profileData.first_name || "",
                middle_name: profileData.middle_name || "",
                gender: profileData.gender || "",
                birth_date: profileData.birth_date || "",
                birth_place: profileData.birth_place || "",
                gender: profileData.gender || "",
                civil_status: profileData.civil_status || "",
                contact_no: profileData.contact_no || "",
                age: profileData.age || "",
                province: profileData.province || "",
                municipality: profileData.municipality || "",
                barangay: profileData.barangay || "",
                street: profileData.street || "",
                no_blk_lot: profileData.no_blk_lot || "",
                nationality: profileData.nationality || "",
                religion: profileData.religion || "",
                father_name: profileData.father_name || "",
                father_address: profileData.father_address || "",
                father_contact: profileData.father_contact || "",
                mother_name: profileData.mother_name || "",
                mother_address: profileData.mother_address || "",
                mother_contact: profileData.mother_contact || "",
                spouse_name: profileData.spouse_name || "",
                spouse_address: profileData.spouse_address || "",
                spouse_contact: profileData.spouse_contact || "",
                occupation: profileData.occupation || "",
                employer_name: profileData.employer_name || "",
                employer_address: profileData.employer_address || "",
                employer_contact: profileData.employer_contact || "",
                // patient information
                admission_date: patientData.admission_date || "",
                discharge_date: patientData.discharge_date || "",
                total_no_day: patientData.total_no_day || "",
                admitting_physician: `Dr. ${physicianData?.first_name} ${physicianData?.last_name}` || "",
                admitting_clerk: clerkData?.first_name + clerkData?.last_name || "",
                type_visit: patientData.type_visit === 'new_ipd' ? 'NEW' 
                                : profileData.type_visit === 'revisit_ipd' ? 'REVISIT'  
                                : profileData.type_visit === 'new_opd' ?  'NEW'
                                : profileData.type_visit === 'revisit_opd' ? 'REVISIT' 
                                : profileData.type_visit === 'former_opd' ? 'FORMER OPD' 
                                : '',
                referred_by: patientData.referred_by || "",
                soc_serv_classification: patientData.soc_serv_classification || "",
                allergic_to: patientData.allergic_to || "",
                hospitalization_plan: patientData.hospitalization_plan || "",
                health_insurance_name: patientData.health_insurance_name || "",
                phic: patientData.phic || "",
                data_furnished_by: userDetails.personal_information?.first_name + userDetails.personal_information?.last_name || "",
                address_of_informant: patientData.address_of_informant || "",
                relation_to_patient: patientData.relation_to_patient || "",
                admission_diagnosis: patientData.admission_diagnosis || "",
                discharge_diagnosis: patientData.discharge_diagnosis || "",
                // principal_opt_code: poptProcedure?.code || "",
                // principal_opt_desc:  poptProcedure?.description || "",
                principal_opt_code: poptProcedure?.code || "",
                principal_opt_desc:  poptProcedure?.description || "",
                other_opt_code: ooptProcedure?.code || "",
                other_opt_desc: ooptProcedure?.description || "",
                accident_injury_poison: patientData.accident_injury_poison || "",
                icd10_code: icdCode?.code || "",
                icd10_desc: icdCode?.description || "",
            })
        }

    }, [profileData, patientData, userDetails, clerkData])

    console.log(patientData)
    
    const [autoSaveData] = useAutoSaveDataMutation()
    
    const handleBlur = useCallback(async () => {
        componentContext?.onAutoSave({type:'updatePatientDetails', value:formData})
    }, [formData, componentContext])

    const calculatedAge = (birthdate) => {
        const birthDate = new Date(birthdate)
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const calculateTotalNoDay = (admissionDate, dischargeDate) => {
        if(!admissionDate || !dischargeDate) {
            return 0
        }
        const admissionDateTime = new Date(admissionDate)
        const dischargeDateTime = new Date(dischargeDate)
        const diffInMilliseconds = dischargeDateTime.getTime() - admissionDateTime.getTime()
        const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))
        return diffInDays
    }

    const handleOnChange = (data) => {
        const municipalityName = municipalityData?.find(option => option.code === profileData?.municipality)?.name
        const barangayName = barangayData?.find(option => option.code === profileData?.barangay)?.name
        const provinceName = provinceData?.find(option => option.code === profileData?.province)?.name
        switch(data.type) {
            case 'last_name':
            case 'first_name':
            case 'middle_name':
            case 'gender':
            case 'civil_status':
            case 'contact_no':
            case 'street':
            case 'no_blk_lot':
            case 'nationality':
            case 'religion':
            case 'occupation':
            case 'employer_name':
            case 'employer_address':
            case 'employer_contact':
            case 'father_name':
            case 'father_address':
            case 'father_contact':
            case 'mother_name':
            case 'mother_address':
            case 'mother_contact':
            case 'spouse_name':
            case 'spouse_address':
            case 'spouse_contact':
            case 'type_visit':
            case 'referred_by':
            case 'allergic_to':
            case 'hospitalization_plan':
            case 'health_insurance_name':
            case 'address_of_informant':
            case 'relation_to_patient':
            case 'admission_diagnosis':
            case 'discharge_diagnosis':
            case 'data_furnished_by':
            case 'accident_injury_poison':
                setFormData((prev) => ({
                    ...prev,
                    [data.type]: data.value,
                    total_no_day: calculateTotalNoDay(prev.admission_date, prev.discharge_date)
                }))
                break

            
            case 'icd10_code':
                setFormData((prev) => ({
                    ...prev,
                    icd10_code: data.code,
                    icd10_desc: data.description,
                }))
                // if(componentContext?.state?.clickedValue?.popt_proc?.type === 'icd10_code') {
                    
                // }
                break

            case 'principal_opt_code':
                setFormData((prev) => ({
                    ...prev,
                    principal_opt_code: data.code,
                    principal_opt_desc: data.description,
                }))
                // if(componentContext?.state?.clickedValue?.popt_proc?.type === 'popt_proc') {
                    
                // }
                break

            case 'other_opt_code':
                setFormData((prev) => ({
                    ...prev,
                    other_opt_code: data.code,
                    other_opt_desc: data.description,
                }))
                // if(componentContext?.state?.clickedValue?.popt_proc?.type === 'popt_proc') {
                    
                // }
                break
                
            case 'admission_date':
            case 'discharge_date':
                const formatDate = `${data.value}:00`
                const reformatDate = formatDate.replace('T', ' ')
                // console.log(reformatDate)
                setFormData((prev) => ({
                    ...prev,
                    [data.type]: reformatDate
                }))
        
            case 'phic':
                setPhicTickBox(data.event ? data.value : null)
                setFormData((prev) => ({
                    ...prev,
                    phic: data.value
                }))
                break

            case 'soc_serv_classification':
                setSocServiceTickBox(data.event ? data.value : null)
                setFormData((prev) => ({
                    ...prev,
                    soc_serv_classification: data.value
                }))
                break

            case 'tick_father_address':
                setAddressTickBox(prev => ({ ...prev, fatherAddressTick: data.value }))
                if(data.value) {
                    setFormData((prev) => ({
                        ...prev,
                        father_address: `${profileData?.no_blk_lot || ''} ${profileData?.street || ''} ${barangayName}, ${municipalityName}, ${provinceName}`
                    }))
                } else {
                    setFormData((prev) => ({...prev, father_address: ''}))
                }
                break

            case 'tick_mother_address':
                setAddressTickBox(prev => ({ ...prev, motherAddressTick: data.value }))
                if(data.value) {
                    setFormData((prev) => ({
                        ...prev,
                        mother_address: `${profileData?.no_blk_lot || ''} ${profileData?.street || ''} ${barangayName}, ${municipalityName}, ${provinceName}`
                    }))
                } else {
                    setFormData((prev) => ({...prev, mother_address: ''}))
                }
                break

            case 'tick_spouse_address':
                setAddressTickBox(prev => ({ ...prev, spouseAddressTick: data.value }))
                if(data.value) {
                    setFormData((prev) => ({
                        ...prev,
                        spouse_address: `${profileData?.no_blk_lot || ''} ${profileData?.street || ''} ${barangayName}, ${municipalityName}, ${provinceName}`
                    }))
                } else {
                    setFormData((prev) => ({...prev, spouse_address: ''}))
                }
                break
            
            case 'birth_date':
                setFormData((prev) => ({
                    ...prev,
                    age: calculatedAge(data.value),
                    birth_date: data.value
                }))
                break

            case 'province':
                setFormData((prev) => ({
                    ...prev,
                    province: data.value
                }))
                componentContext?.onChange({type:'province', value:data.value})
                break
            case 'municipality':
                setFormData((prev) => ({
                    ...prev,
                    municipality: data.value
                }))
                componentContext?.onChange({type:'municipality', value:data.value})
                break
            case 'barangay':
                setFormData((prev) => ({
                    ...prev,
                    barangay: data.value
                }))
                break
            
            default:
                break
        }
    }

    return (
        <div>
            <div>
                <div>
                    <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">Person Details</h3>
                    <hr className="drop-shadow-md pb-5"/>
                </div>
                
                <div className="lg:pl-[15rem] lg:pr-[15rem] md:pl-[5rem] md:pr-[5rem] sm:pl-0 sm:pr-0 space-y-5">
                    <div className="flex lg:flex-row md:flex-col items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Last Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">First Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={(e) => handleOnChange({type:"first_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Middle Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={(e) => handleOnChange({type:"middle_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Gender</label></div>
                        <div className="w-3/5">
                            <Select 
                                options={genderOption?.map(gender => ({ value: gender.value, label: gender.label }))}
                                onChange={(e) => handleOnChange({type:"gender", value: e?.value})}
                                onBlur={handleBlur}
                                isSearchable={true}
                                isClearable={true}
                                placeholder="Select gender..."
                                classNamePrefix="react-select"
                                styles={styleDropdown} 
                                value={genderOption?.find(option => 
                                    option.value === formData.gender
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Birth Date</label></div>
                        <div className="w-3/5">
                            <input
                                type="date"
                                name="middle_name"
                                value={formData.birth_date}
                                onChange={(e) => handleOnChange({type:"birth_date", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Civil Status</label></div>
                        <div className="w-3/5">
                            <Select 
                                options={civilStatusOption?.map(civil => ({ value: civil.value, label: civil.label }))}
                                onChange={(e) => handleOnChange({type:"civil_status", value: e?.value})}
                                onBlur={handleBlur}
                                isSearchable={true}
                                isClearable={true}
                                placeholder="Select civil status"
                                classNamePrefix="react-select"
                                styles={styleDropdown} 
                                value={civilStatusOption?.find(option => 
                                    option.value === formData.civil_status
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Contact No</label></div>
                        <div className="w-3/5">
                            <input
                                type="number"
                                name="contact_no"
                                value={formData.contact_no}
                                onChange={(e) => handleOnChange({type:"contact_no", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Age</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="age"
                                value={formData.age}
                                onChange={(e) => handleOnChange({type:"age", value: e.target.value})}
                                onBlur={handleBlur}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                placeholder="Type..."
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Province</label></div>
                        <div className="w-3/5">
                            <Select 
                                options={provinceData?.map(province => ({ value: province.code, label: province.name }))}
                                onChange={(e) => handleOnChange({type:"province", value: e?.value})}
                                onBlur={handleBlur}
                                isSearchable={true}
                                isClearable={true}
                                placeholder="Select province"
                                classNamePrefix="react-select"
                                styles={styleDropdown} 
                                value={provinceData?.filter(option => option.code === formData.province).map(option => ({ 
                                        value: option.code, 
                                        label: option.name 
                                }))[0]}
                                // value={provinceData?.find(option => option.code === formData.province)?.name}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Municipality</label></div>
                        <div className="w-3/5">
                            <Select 
                                options={municipalityData?.map(municipality => ({ value: municipality.code, label: municipality.name }))}
                                onChange={(e) => handleOnChange({type:"municipality", value: e?.value})}
                                onBlur={handleBlur}
                                isSearchable={true}
                                isClearable={true}
                                placeholder="Select municipality"
                                classNamePrefix="react-select"
                                styles={styleDropdown} 
                                value={municipalityData?.filter(option => option.code === formData.municipality).map(option => ({ 
                                    value: option.code, 
                                    label: option.name 
                                }))[0]}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Barangay</label></div>
                        <div className="w-3/5">
                            <Select 
                                options={barangayData?.map(barangay => ({ value: barangay.code, label: barangay.name }))}
                                onChange={(e) => handleOnChange({type:"barangay", value: e?.value})}
                                onBlur={handleBlur}
                                isSearchable={true}
                                isClearable={true}
                                placeholder="Select barangay"
                                classNamePrefix="react-select"
                                styles={styleDropdown} 
                                value={barangayData?.filter(option => option.code === formData.barangay).map(option => ({ 
                                    value: option.code, 
                                    label: option.name 
                                }))[0]}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Street</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={(e) => handleOnChange({type:"street", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">No/Blk/Lot</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="no_blk_lot"
                                value={formData.no_blk_lot}
                                onChange={(e) => handleOnChange({type:"no_blk_lot", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Nationality</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={(e) => handleOnChange({type:"nationality", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Religion</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="religion"
                                value={formData.religion}
                                onChange={(e) => handleOnChange({type:"religion", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Occupation</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={(e) => handleOnChange({type:"occupation", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Employer Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="employer_name"
                                value={formData.employer_name}
                                onChange={(e) => handleOnChange({type:"employer_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Employer Address</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="employer_address"
                                value={formData.employer_address}
                                onChange={(e) => handleOnChange({type:"employer_address", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Employer Contact</label></div>
                        <div className="w-3/5">
                            <input
                                type="number"
                                name="employer_contact"
                                value={formData.employer_contact}
                                onChange={(e) => handleOnChange({type:"employer_contact", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Father Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="father_name"
                                value={formData.father_name}
                                onChange={(e) => handleOnChange({type:"father_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Father Address</label></div>
                        <div className="w-3/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="father_address"
                                    value={formData.father_address}
                                    onChange={(e) => handleOnChange({type:"father_address", value: e.target.value})}
                                    onBlur={handleBlur}
                                    className={`${addressTickBox.fatherAddressTick ? 'cursor-not-allowed bg-gray-200' : 'bg-gray-100'} border border-gray-300  text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 flex-grow pl-10`}
                                    placeholder="Type..."
                                    disabled={addressTickBox.fatherAddressTick}
                                />
                                <input
                                    title="My Address"
                                    type="checkbox"
                                    onBlur={handleBlur}
                                    checked={!!addressTickBox.fatherAddressTick}
                                    onChange={(e) => handleOnChange({type: "tick_father_address", value:e.target.checked})}
                                    className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Father Contact</label></div>
                        <div className="w-3/5">
                            <input
                                type="number"
                                name="father_contact"
                                value={formData.father_contact}
                                onChange={(e) => handleOnChange({type:"father_contact", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Mother Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="mother_name"
                                value={formData.mother_name}
                                onChange={(e) => handleOnChange({type:"mother_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Mother Address</label></div>
                        <div className="w-3/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="mother_address"
                                    value={formData.mother_address}
                                    onChange={(e) => handleOnChange({type:"mother_address", value: e.target.value})}
                                    onBlur={handleBlur}
                                    className={`${addressTickBox.motherAddressTick ? 'cursor-not-allowed bg-gray-200' : 'bg-gray-100'} border border-gray-300  text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 flex-grow pl-10`}
                                    placeholder="Type..."
                                    disabled={addressTickBox.motherAddressTick}
                                />
                                <input
                                    title="My Address"
                                    type="checkbox"
                                    onBlur={handleBlur}
                                    checked={!!addressTickBox.motherAddressTick}
                                    onChange={(e) => handleOnChange({type: "tick_mother_address", value:e.target.checked})}
                                    className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Mother Contact</label></div>
                        <div className="w-3/5">
                            <input
                                type="number"
                                name="mother_contact"
                                value={formData.mother_contact}
                                onChange={(e) => handleOnChange({type:"mother_contact", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Spouse Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="spouse_name"
                                value={formData.spouse_name}
                                onChange={(e) => handleOnChange({type:"spouse_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Spouse Address</label></div>
                        <div className="w-3/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="spouse_address"
                                    value={formData.spouse_address}
                                    onChange={(e) => handleOnChange({type:"spouse_address", value: e.target.value})}
                                    onBlur={handleBlur}
                                    className={`${addressTickBox.spouseAddressTick ? 'cursor-not-allowed bg-gray-200' : 'bg-gray-100'} border border-gray-300  text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 flex-grow pl-10`}
                                    placeholder="Type..."
                                    disabled={addressTickBox.spouseAddressTick}
                                />
                                <input
                                    title="My Address"
                                    type="checkbox"
                                    onBlur={handleBlur}
                                    checked={!!addressTickBox.spouseAddressTick || profileData?.spouse_address !== null ? addressTickBox.spouseAddressTick : ""}
                                    onChange={(e) => handleOnChange({type: "tick_spouse_address", value:e.target.checked})}
                                    className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Spouse Contact</label></div>
                        <div className="w-3/5">
                            <input
                                type="number"
                                name="spouse_contact"
                                value={formData.spouse_contact}
                                onChange={(e) => handleOnChange({type:"spouse_contact", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5 pt-[5rem]">Patient Information</h3>
                    <hr className="drop-shadow-md pb-5"/>
                </div>

                <div className="pl-[15rem] pr-[15rem] space-y-5 pb-[3rem]">
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Admission Date | Time</label></div>
                        <div className="w-3/5">
                            <input
                                type="datetime-local"
                                name="admission_date"
                                value={formData.admission_date}
                                onChange={(e) => handleOnChange({type:"admission_date", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Discharge Date | Time</label></div>
                        <div className="w-3/5">
                            <input
                                type="datetime-local"
                                name="discharge_date"
                                value={formData.discharge_date}
                                onChange={(e) => handleOnChange({type:"discharge_date", value: e.target.value})}
                                onBlur={handleBlur}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Total No Day</label></div>
                        <div className="w-3/5">
                            <input
                                type="number"
                                name="total_no_day"
                                value={formData.total_no_day}
                                onChange={(e) => handleOnChange({type:"total_no_day", value: e.target.value})}
                                onBlur={handleBlur}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Admitting Physician</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="admitting_physician"
                                value={formData.admitting_physician}
                                onChange={(e) => handleOnChange({type:"admitting_physician", value: e.target.value})}
                                onBlur={handleBlur}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Admitting Clerk</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="admitting_clerk"
                                value={formData.admitting_clerk}
                                onChange={(e) => handleOnChange({type:"admitting_clerk", value: e.target.value})}
                                onBlur={handleBlur}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Type of Admission</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="type_visit"
                                value={formData.type_visit}
                                onChange={(e) => handleOnChange({type:"type_visit", value: e.target.value})}
                                onBlur={handleBlur}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Refered By (Physician/Health Facility)</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="referred_by"
                                value={formData.referred_by}
                                onChange={(e) => handleOnChange({type:"referred_by", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Social Service Classification</label></div>
                        <div className="flex flex-row space-x-3 w-3/5">
                            {['a', 'b', 'c1', 'c2', 'c3', 'd'].map(service => (
                                <div className="flex items-center space-x-1">
                                    <input
                                        key={service}
                                        type="checkbox"
                                        name="soc_serv_classification"
                                        checked={service === socServiceTickBox || service === patientData?.soc_serv_classification}
                                        onChange={(e) => handleOnChange({type:"soc_serv_classification", event: e.target.checked, value:service})}
                                        onBlur={handleBlur}
                                        className="w-5 h-5"
                                        />
                                    <label className="text-gray-500 font-bold text-xs">{service.toUpperCase()}</label>  
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Allergic To</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="allergic_to"
                                value={formData.allergic_to}
                                onChange={(e) => handleOnChange({type:"allergic_to", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Hospitalization Plan</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="hospitalization_plan"
                                value={formData.hospitalization_plan}
                                onChange={(e) => handleOnChange({type:"hospitalization_plan", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Health Insurance Name</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="health_insurance_name"
                                value={formData.health_insurance_name}
                                onChange={(e) => handleOnChange({type:"health_insurance_name", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">PHIC</label></div>
                        <div className="flex flex-row space-x-3 w-3/5">
                            {['sss', 'sss_dependent', 'gsis', 'gsis_dependent'].map(service => (
                                <div className="flex items-center space-x-1">
                                    <input
                                        key={service}
                                        type="checkbox"
                                        name="phic"
                                        checked={service === phicTickBox || service === patientData?.soc_serv_classification}
                                        onChange={(e) => handleOnChange({type:"phic", event: e.target.checked, value:service})}
                                        className="w-5 h-5"
                                        onBlur={handleBlur}
                                        />
                                    <label className="text-gray-500 font-bold text-xs">{service.toUpperCase()}</label>  
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Data Furnished By</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="data_furnished_by"
                                value={formData.data_furnished_by}
                                onChange={(e) => handleOnChange({type:"data_furnished_by", value: e.target.value})}
                                onBlur={handleBlur}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Address of Informant</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="address_of_informant"
                                value={formData.address_of_informant}
                                onChange={(e) => handleOnChange({type:"address_of_informant", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Relation to Patient</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="relation_to_patient"
                                value={formData.relation_to_patient}
                                onChange={(e) => handleOnChange({type:"relation_to_patient", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Admission Diagnosis</label></div>
                        <div className="w-3/5">
                            <textarea
                                type="text"
                                name="admission_diagnosis"
                                value={formData.admission_diagnosis}
                                onChange={(e) => handleOnChange({type:"admission_diagnosis", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Discharge Diagnosis</label></div>
                        <div className="w-3/5">
                            <textarea
                                type="text"
                                name="discharge_diagnosis"
                                value={formData.discharge_diagnosis}
                                onChange={(e) => handleOnChange({type:"discharge_diagnosis", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Principal Operation/Procedures</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="principal_opt_code"
                                value={poptProcedure?.description || patientData?.principal_opt_desc}
                                onClick={() => componentContext?.onModalOpen({modalState: true, type: "popt_proc", modalType: "popt_proc"})}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 cursor-pointer"
                                placeholder="Click to search"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">RUV CODE</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="principal_opt_code"
                                value={poptProcedure?.code || patientData?.principal_opt_code}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Other Operation/Procedures</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="other_opt_code"
                                value={ooptProcedure?.description || patientData?.other_opt_desc}
                                // onChange={(e) => handleOnChange({type:"other_opt_code", desc: ooptProcedure?.description, code: ooptProcedure?.code})}
                                onClick={() => componentContext?.onModalOpen({modalState: true, type: "oopt_proc", modalType: "oopt_proc"})}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 cursor-pointer"
                                placeholder="Click to search"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">RUV CODE</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                value={ooptProcedure?.code || patientData?.other_opt_code}
                                className="bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Accident/Injuries/Poisoning</label></div>
                        <div className="w-3/5">
                            <textarea
                                type="text"
                                name="accident_injury_poison"
                                value={formData.accident_injury_poison || ""}
                                onChange={(e) => handleOnChange({type:"accident_injury_poison", value: e.target.value})}
                                onBlur={handleBlur}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                                placeholder="Type..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">ICD CODE</label></div>
                        <div className="w-3/5">
                            <input
                                type="text"
                                name="icd10_code"
                                value={icdCode?.description || formData.icd10_desc}
                                onChange={(e) => handleOnChange({type:"icd10_code", desc: icdCode?.description, code: icdCode?.code})}
                                onClick={() => componentContext?.onModalOpen({modalState: true, type: "icd10_code", modalType: "icd10_code"})}
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Click to search"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Disposition</label></div>
                        <div className="flex flex-row space-x-3 w-3/5">
                            {dispositionArray.map(dispo => (
                                <div key={dispo} className={`flex items-center space-x-1 ${dispo.parent ? "ml-16" : ""}`}>
                                    {(!dispo.parent) && (
                                        <>
                                            <input
                                                type="checkbox"
                                                name="disposition"
                                                // checked={field.value === dispo.name}
                                                // onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                                className="w-5 h-5"
                                                />
                                            <label className="text-gray-500 font-bold text-xs">{dispo.label}</label>
                                        </>
                                    )} 
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientInformation
