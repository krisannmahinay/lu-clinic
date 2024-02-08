
import CustomTextarea from "@/components/CustomTextarea"
import Form from "@/components/Form"
import { ComponentContext, FormContext } from "@/utils/context"
import { generateSoapForms } from "@/utils/forms"
import React, { useState, useEffect } from "react"
import HighlightWithinTextarea from 'react-highlight-within-textarea'
import DoctorRequest from "./DoctorRequest"

const Soap = ({
    onClick,
    dummyData, 
    physiciansOrder, 
}) => {
    const [formData, setFormData] = useState({
        soap_subj_symptoms: "",
        soap_obj_findings: "",
        soap_assessment: "",
        soap_plan: "",
    })
    const [patientInfo, setPatientInfo] = useState([])
    const [checkedItem, setCheckedItem] = useState([])
    const [leftItems, setLeftItems] = useState(dummyData)
    const [rightItems, setRightItems] = useState([])
    const [accordionIdOpen, setAccordionIdOpen] = useState(false)
    const [otherRequest, setOtherRequest] = useState({})
    const [othersSelected, setOthersSelected] = useState({})
    const [searchQuery, setSearchQuery] = useState("")

    const [subjectiveText, setSubjectiveText] = useState("")
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [bmi, setBMI] = useState(null)

    useEffect(() => {
        if (height && weight) {
            const heightInMeters = height / 100 // assuming height is in centimeters
            const computedBMI = weight / (heightInMeters * heightInMeters)
            setBMI(computedBMI.toFixed(2)) // keep two decimal places
        } else {
            setBMI(null)
        }
    }, [height, weight])

    useEffect(() => {
        if(formData) {
            const data = generateSoapForms(formData)
            setPatientInfo(data)
        }
    }, [formData])

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
    

    const handleOnClick = () => {
        onClick()
    }

    const highlightAll = (content) => content
    const labelCss = "ml-2 mb-2 text-gray-500 font-bold uppercase text-xs"

    return (
        <div>

            <div className="border-none overflow-hidden disable-selecting-text py-2 px-4">
                {accordionIdOpen && (
                <></>
                )}
                
                
                {physiciansOrder ? (
                    <div className="mt-2">
                        <div className="text-medium font-semibold text-center tracking-wide text-white uppercase border-b bg-green-500 px-4 py-4">
                            <span>Orders</span>
                        </div>

                        <div className="p-4 space-y-4 sm:ml-[20rem] mr-[20rem] overflow-y-auto scroll-custom">
                            <div className="flex items-center justify-between">
                                <label className={labelCss}>Medications: </label>
                                <input type="text" placeholder="" value="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-full max-w-xl"/>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className={labelCss}>IV Fluids: </label>
                                <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-full max-w-xl"/>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className={labelCss}>Labs and Tests: </label>
                                <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-full max-w-xl"/>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className={labelCss}>Imaging: </label>
                                <input type="text" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-full max-w-xl"/>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className={labelCss}>Instruction: </label>
                                <textarea type="text" placeholder="" className="border border-gray-300 px-3 py-2 h-[10rem] focus:border-gray-500 focus:outline-none w-full max-w-xl"/>
                            </div>
                        </div>
                    </div>
                ) : (
                    
                <div>
                    

                    <div className="xl:pl-[10rem] xl:pr-[10rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 pb-7">
                        <FormContext.Provider value={{
                            initialFields: patientInfo,
                            enableAutoSave:true,
                            // onClickFAB: handleClickedFAB,
                            // initialFields={patientInfo}
                            // enableAutoSave={true}
                            // onEditForm={(e, rowIndex, fieldName) => handleEditForm(e, rowIndex, fieldName)}
                            // onSuccess={handleRefetch}
                            // onCloseSlider={() => setActiveContent("yellow")}
                            // onLoading={(data) => setBtnSpinner(data)}
                            // onSetAlertType={(data) => setAlertType(data)}
                            // onSetAlertMessage={(data) => setAlertMessage(data)}
                        }}>
                            <Form
                                onClick={handleOnClick} 
                            />
                        </FormContext.Provider>
                    </div>
                </div>
                )}
                
            </div>
            
        </div>
    )
}

export default React.memo(Soap)