import { useComponentContext } from "@/utils/context"
import { useCallback, useEffect, useState } from "react"
import Select from 'react-select'
import AsyncSelect from 'react-select/async'

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
    const componentContext = useComponentContext()
    const profileData = componentContext?.state?.profileData?.user_data_info
    const provinceData = componentContext?.state?.provinceData
    const [initialOptions, setInitialOptions] = useState([]) 
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
    
    // const handleBlur = useCallback(async () => {
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
    // }, [lastName, givenName, middleName, bedRm, autoSaveData])

    console.log(profileData)

    const handleOnChange = (data) => {
        switch(data.type) {
            case 'last_name':
                setFormData((prev) => ({
                    ...prev,
                    last_name: data.value
                }))
                break
            default:
                break
        }
    }

    useEffect(() => {
        if (provinceData) {
            const options = provinceData.map(item => ({
                value: item.code,
                label: item.name
            }))
            setInitialOptions(options)
        }

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
                spouse_contact: profileData.spouse_contact || ""
            })
        }

    }, [provinceData, profileData])

    return (
        <div>
            <div className="flex flex-row items-center">
                <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Last Name</label></div>
                <div className="w-3/5">
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
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
                        name="last_name"
                        value={formData.first_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
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
                        name="last_name"
                        value={formData.middle_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Gender</label></div>
                <div className="w-3/5">
                    <input
                        type="text"
                        name="last_name"
                        value={formData.gender}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Civil Status</label></div>
                <div className="w-3/5">
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Contact No</label></div>
                <div className="w-3/5">
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
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
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Province</label></div>
                <div className="w-3/5">
                    <AsyncSelect 
                            cacheOptions
                            // loadOptions={loadProvince}
                            defaultOptions={initialOptions}
                            onChange={(e) => handleOnChange({type:"province", value: e})}
                            isSearchable={true}
                            isClearable={true}
                            placeholder="Select a province..."
                            classNamePrefix="react-select"
                            styles={styleDropdown} 
                        />
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Municipality</label></div>
                <div className="w-3/5">
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="text-right basis-1/4 mr-4"><label className=" text-gray-500 font-medium text-sm capitalize">Barangay</label></div>
                <div className="w-3/5">
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>
            </div>
        </div>
    )
}

export default PatientInformation