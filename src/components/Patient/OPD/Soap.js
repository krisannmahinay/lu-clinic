
import CustomTextarea from "@/components/CustomTextarea"
import Form from "@/components/Form"
import { generateSoapForms } from "@/utils/forms"
import { useState, useEffect } from "react"
import HighlightWithinTextarea from 'react-highlight-within-textarea'

const Soap = ({soapData, soapHeaders, dummyData, physiciansOrder, medicineMaster,onSearchQuery}) => {
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

    const [isShowMedForm, setIsShowMedForm] = useState(false)
    const [selectedMedicine, setSelectedMedicine] = useState(null)
    const [addedMedicine, setAddedMedicine] = useState([])
    
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

    const handleCheckbox = (id, name) => {
        if(checkedItem.includes(id)) {
            // setCheckedItem(checkedItem.filter((checked) => checked !== moduleId))
            setCheckedItem((prevChecked) => prevChecked.filter((itemId) => itemId !== id))
            if (name === "Others") {
                setOthersSelected({ ...othersSelected, [id]: false })
            }
        } else {
            // setCheckedItem([...checkedItem, moduleId])
            setCheckedItem((prevChecked) => [...prevChecked, id])
            if (name === "Others") {
                setOthersSelected({ ...othersSelected, [id]: true })
            }
        }
    }

    // console.log(soapData)
    const panthologyData = soapData?.reduce((acc, item) => {
        // console.log(item)
        const categoryName = item?.panthology_category?.category_name
        if(!acc[categoryName]) {
            acc[categoryName] = []
        }
        acc[categoryName].push(item)
        return acc
    }, {})

    // console.log(panthologyData)

    const selectMedicine = (medicine) => {
        setSelectedMedicine(medicine);
        setIsShowMedForm(true)
    }
    
    const addMedicine = () => {
        if (selectedMedicine) {
            setAddedMedicine((current) => [...current, selectedMedicine])
            setIsShowMedForm(false)
        }
    }

    const handleSearch = (e) => {
        onSearchQuery(e.target.value)
    }
    
    const backToList = () => {
        setSelectedMedicine(null)
        setIsShowMedForm(false)
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
                    <div className="lg:ml-[10rem] lg:mr-[10rem] :ml-0 md:mr-0 pb-7">
                        <Form
                            initialFields={patientInfo}
                            enableAutoSave={true}
                            // onEditForm={(e, rowIndex, fieldName) => handleEditForm(e, rowIndex, fieldName)}
                            // onSuccess={handleRefetch}
                            // onCloseSlider={() => setActiveContent("yellow")}
                            // onLoading={(data) => setBtnSpinner(data)}
                            // onSetAlertType={(data) => setAlertType(data)}
                            // onSetAlertMessage={(data) => setAlertMessage(data)}
                        />
                    </div>
                </div>
                )}
                
            </div>
            
        </div>
    )
}

export default Soap