import { useComponentContext } from "@/utils/context"
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

const PatientInformation = () => {
    const componentContext = useComponentContext()
    const profileData = componentContext?.state?.profileData?.user_data_info
    const provinceData = componentContext?.state?.provinceData
    const municipalityData = componentContext?.state?.municipalityData
    const barangayData = componentContext?.state?.barangayData
    const [addressTickBox, setAddressTickBox] = useState({
        fatherAddressTick: false,
        motherAddressTick: false,
        spouseAddressTick: false
    })
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
    })
    
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

    const handleOnChange = (data) => {
        const municipalityName = municipalityData?.find(option => option.code === profileData?.municipality).name
        const barangayName = barangayData?.find(option => option.code === profileData?.barangay).name
        const provinceName = provinceData?.find(option => option.code === profileData?.province).name
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
                setFormData((prev) => ({
                    ...prev,
                    [data.type]: data.value
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
    // console.log(formData.barangay)

    useEffect(() => {

        if(profileData) {
            setFormData({
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
                employer_contact: profileData.employer_contact || ""
            })
        }

    }, [profileData])

    return (
        <div>
            <div className="space-y-4">
                <div>
                    <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">Person Details</h3>
                    <hr className="drop-shadow-md pb-5"/>
                </div>
                <div className="flex flex-row items-center">
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

                <div>
                    <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">Patient Information</h3>
                    <hr className="drop-shadow-md pb-5"/>
                </div>

            </div>
        </div>
    )
}

export default PatientInformation