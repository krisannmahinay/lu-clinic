import { useState } from "react"

const heentData = [
    {id:1, code: "hesn", name:"Essential Normal"},
    {id:2, code: "abpr", name:"Abnormal pupillary reaction"},
    {id:3, code: "ics", name:"Icteric Sclerae"},
    {id:4, code: "pconj", name:"Pale Conjunctiva"},
    {id:5, code: "sunke", name:"Sunken Eyeball"},
    {id:6, code: "sunkf", name:"Sunken Fontanelle"},
    {id:7, code: "cervl", name:"Cervical Lymphadenopathy"},
    {id:8, code: "dmm", name:"Dry Mucuos Membrane"},
    {id:9, code: "others", name:"Others"}
]

const chestLungsData = [
    {id:1, code: "chesn", name:"Essential Normal"},
    {id:2, code: "lochesb", name:"Lumps over chest/breast"},
    {id:3, code: "asymchex", name:"Asymmetrical chest expansion"},
    {id:4, code: "rr", name:"Rales/Ronchi"},
    {id:5, code: "decbs", name:"Decreased breath sounds"},
    {id:6, code: "intrclavr", name:"Intercostal retractions/clavicular retractions"},
    {id:7, code: "whiz", name:"Wheezes"},
    {id:9, code: "others", name:"Others"}
]

const cvsData = [
    {id:1, code: "cvesn", name: "Essentially Normal"},
    {id:2, code: "dabeat", name: "Displaced apex beat"},
    {id:3, code: "hthrills", name: "Heaves/thrills"},
    {id:4, code: "pbulge", name: "Pericardial bulge"},
    {id:5, code: "decmob", name: "Decreased mobility"},
    {id:6, code: "pnbeds", name: "Pale nail beds"},
    {id:7, code: "pskint", name: "Poor Skin turgor"},
    {id:8, code: "rashpet", name: "Rashes/ petechiae"},
    {id:9, code: "weakp", name: "Weak pulses"},
    {id:10, code: "others", name: "Others"}
]

const neuronData = [
    {id:1, code: "neoesn", name: "Essentially Normal"},
    {id:2, code: "abgait", name: "Abnormal gait"},
    {id:3, code: "abposens", name: "Abnormal position sense"},
    {id:4, code: "abdecsens", name: "Abnormal/ decreased sensation"},
    {id:5, code: "abreflex", name: "Abnormal reflexes"},
    {id:6, code: "poormem", name: "Poor/altered memory"},
    {id:7, code: "poormustren", name: "Poor muscle tone/strength"},
    {id:8, code: "poorcond", name: "Poor coordination"},
    {id:9, code: "others", name: "Others"}
]

const ClinicalRecord = () => {
    return (
        <div>
            <div>
                <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">Patient Clinical Record</h3>
                <hr className="drop-shadow-md pb-5"/>
            </div>

            <div className="xl:ml-[25rem] xl:mr-[25rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 sm:pl-0 sm:pr-0 space-y-5">
                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm capitalize">Chief Complaint: </label>
                    <input
                        type="text"
                        name="chief_complain"    
                        // value={formData.last_name || profileData?.last_name}
                        // onChange={(e) => handleOnChange({type:"last_name", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>

                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm">History of Present Illness/ OB History: </label>
                    <textarea
                        type="text"
                        name="phistory_ill_ob_history"
                        // value={formData.admission_diagnosis || patientData?.admission_diagnosis}
                        // onChange={(e) => handleOnChange({type:"admission_diagnosis", value: e.target.value})}
                        // onBlur={handleBlur}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                        placeholder="Type..."
                    />
                </div>

                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm capitalize">Past Medical History: </label>
                    <input
                        type="text"
                        name="past_med_history"
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>

                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm">Personal and Social History: </label>
                    <input
                        type="text"
                        name="personal_soc_history"
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>

                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm">Allergies: </label>
                    <input
                        type="text"
                        name="allergies"
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>

                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm">Family History: </label>
                    <input
                        type="text"
                        name="family_history"
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                        placeholder="Type..."
                    />
                </div>
            </div>

            <div>
                <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5 pt-[5rem]">Physical Examination</h3>
                <hr className="drop-shadow-md pb-5"/>
            </div>

            
            <div className="xl:ml-[25rem] xl:mr-[25rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 sm:pl-0 sm:pr-0 space-y-5">
                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm">General Survey: </label>
                    <div className="flex flex-row space-x-3 w-3/5">
                        {['awake_alert', 'altered_sensorium'].map(service => (
                            <div className="flex items-center space-x-1">
                                <input
                                    key={service}
                                    type="checkbox"
                                    name="general_survey"
                                    // checked={service === socServiceTickBox || service === patientData?.soc_serv_classification}
                                    // onChange={(e) => handleOnChange({type:"soc_serv_classification", event: e.target.checked, value:service})}
                                    // onBlur={handleBlur}
                                    className="w-5 h-5"
                                    />
                                <label className="text-gray-500 font-bold text-xs">{service.toUpperCase()}: </label>  
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm">Vital Sign: </label>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label className=" text-gray-500 font-medium text-sm mr-3 w-1/4">BP: </label>
                            <input
                                type="text"
                                name="allergies"
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="Systolic/Diastolic (e.g., 120/80 mmHg)"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className=" text-gray-500 font-medium text-sm mr-3 w-1/4">HR: </label>
                            <input
                                type="text"
                                name="allergies"
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="(e.g., 70-100 bpm)"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className=" text-gray-500 font-medium text-sm mr-3 w-1/4">Temp: </label>
                            <input
                                type="text"
                                name="allergies"
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="(e.g., 36.5 °C)"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className=" text-gray-500 font-medium text-sm mr-3 w-1/4">O2 Sat: </label>
                            <input
                                type="text"
                                name="allergies"
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="SpO2 (%)"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className=" text-gray-500 font-medium text-sm mr-3 w-1/4">Height: </label>
                            <input
                                type="text"
                                name="allergies"
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="(cm)"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className=" text-gray-500 font-medium text-sm mr-3 w-1/4">Weight: </label>
                            <input
                                type="text"
                                name="allergies"
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                                placeholder="(kg)"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <label className=" text-gray-500 font-medium text-sm">HEENT: </label>
                    <div className="flex flex-col space-y-2 w-3/5">
                        {heentData.map(item => (
                            <div className="flex items-center space-x-1">
                                <input
                                    key={item.id}
                                    type="checkbox"
                                    name="general_survey"
                                    // checked={service === socServiceTickBox || service === patientData?.soc_serv_classification}
                                    // onChange={(e) => handleOnChange({type:"soc_serv_classification", event: e.target.checked, value:service})}
                                    // onBlur={handleBlur}
                                    className="w-5 h-5"
                                    />
                                <label className="text-gray-500 font-bold text-xs">{item.name.toUpperCase()} </label>  
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ClinicalRecord