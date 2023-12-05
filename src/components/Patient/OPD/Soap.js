
import CustomTextarea from "@/components/CustomTextarea"
import { useState, useEffect } from "react"
import HighlightWithinTextarea from 'react-highlight-within-textarea'

const Soap = ({soapData, soapHeaders, dummyData, physiciansOrder, medicineMaster}) => {
    

    const [checkedItem, setCheckedItem] = useState([])
    const [leftItems, setLeftItems] = useState(dummyData)
    const [rightItems, setRightItems] = useState([])
    const [accordionIdOpen, setAccordionIdOpen] = useState(false)
    const [otherRequest, setOtherRequest] = useState({})
    const [othersSelected, setOthersSelected] = useState({})

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
      };
    
      const addMedicine = () => {
        if (selectedMedicine) {
          setAddedMedicines((current) => [...current, selectedMedicine]);
          setIsShowMedForm(false)
        }
      };
    
      const backToList = () => {
        setSelectedMedicine(null)
        setIsShowMedForm(false)
      };
  
    const highlightAll = (content) => content
    const labelCss = "ml-2 mb-2 text-gray-500 font-bold uppercase text-xs"

    return (
        <div className="disable-selecting-text">
            <div className="cursor-pointer text-center bg-[#15803d] p-4 text-white font-bold uppercase text-xs" onClick={() => setAccordionIdOpen(!accordionIdOpen)}>
                <span>Doctor's Request</span>
            </div>

            {accordionIdOpen && (
            <div className="flex w-full overflow-x-auto scroll-custom shadow-xs">
                <table className="min-w-full border-collapse border border-slate-500 ">
                    <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                        {soapHeaders.map((tblHeader, tblHeaderIndex) => (
                            <th key={tblHeaderIndex} className="px-4 py-3 border border-slate-600">
                                {tblHeader}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {soapData.map((tblBody, tblBodyIndex) => (
                            <tr className="text-gray-700" key={tblBodyIndex}>
                                {soapHeaders.map((tblHeader) => (
                                    <td key={tblHeader} className="px-2 py-2 border border-slate-700">
                                        <ul className="space-y-2 align-top max-h-40 overflow-y-auto scroll-custom divide-y">
                                            {tblBody[tblHeader]?.map((item) => (
                                                
                                                <li key={item.id}>
                                                    <div className="flex items-center space-x-4  ">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-3 h-3"
                                                            name=""
                                                            value={item.id}
                                                            checked={checkedItem.includes(item.id)}
                                                            onChange={() => handleCheckbox(item.id)}
                                                        />
                                                        <p className="text-sm text-gray-500">{item.name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className="w-1/2 border-collapse border border-slate-500 ">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                            <th className="px-4 py-3 border border-slate-600">IMAGING</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        <tr>
                            <td className="px-2 py-2 border border-slate-700">
                                <ul className="space-y-2 align-top max-h-40 overflow-y-auto scroll-custom divide-y">
                                    <li>
                                        <div className="flex items-center space-x-4  ">
                                            <input
                                                type="checkbox" 
                                                className="w-3 h-3"
                                                name=""
                                                value=""
                                                // checked={checkedItem.includes(item.id)}
                                                // onChange={() => handleCheckbox(item.id)}
                                            />
                                            <p className="text-sm text-gray-500">XRAY</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center space-x-4  ">
                                            <input
                                                type="checkbox" 
                                                className="w-3 h-3"
                                                name=""
                                                value=""
                                                // checked={checkedItem.includes(item.id)}
                                                // onChange={() => handleCheckbox(item.id)}
                                            />
                                            <p className="text-sm text-gray-500">ULTRASOUND</p>
                                        </div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="min-w-full border-collapse border border-slate-500 ">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                            <th className="px-4 py-3 border border-slate-600">MEDICATIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        <tr>
                            <div className="flex justify-center space-x-10 max-h-40 scroll-custom">
                                <div className="flex-col w-full h-40 border border-r-slate-600">
                                    <div className="overflow-y-auto scroll-custom h-full">
                                    {!isShowMedForm && (
                                        <>
                                            <input
                                                type="search"
                                                placeholder="Search..."
                                                className="p-2 border-b-2 border-gray-200 w-full"
                                            />
                                            <div className="mt-4 space-y-2">
                                                {medicineMaster?.map((medicine) => (
                                                    <div
                                                        key={medicine.id}
                                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                                        onClick={() => selectMedicine(medicine)}
                                                    >
                                                        {`${medicine.generic_name} (${medicine.dosage})`}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {isShowMedForm && (
                                        <>
                                             <button
                                                onClick={backToList}
                                                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                            >
                                                &larr; Back
                                            </button>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Brand name:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    value={selectedMedicine.brand_name}
                                                    readOnly
                                                />

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Generic name:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    value={selectedMedicine.generic_name}
                                                    readOnly
                                                />

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Dose:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    value={selectedMedicine.dosage}
                                                    readOnly
                                                />

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Qty:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    value={selectedMedicine.qty}
                                                    readOnly
                                                />

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Sig:
                                                </label>

                                                <textarea 
                                                    type="text"
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                                    value={selectedMedicine.qty}
                                                    readOnly
                                                />

                                            </div>
                                        </>
                                    )}
                                    </div>
                                </div>

                                <div className="flex-col w-full h-58 border border-l-slate-600">
                                    <div className="overflow-y-auto scroll-custom h-full">
                                        <ul className="space-y-2">
                                            {addedMedicine.map((medicine, index) => {
                                                <li key={index} className="p-2 bg-gray-100 rounded">    
                                                    {`${medicine.generic_name} (${medicine.dosage})`}
                                                </li>
                                            })}
                                        </ul>
                                    </div>
                                </div>

                                


                                {/* <div className="flex-col w-full h-40 border border-r-slate-600">
                                    <div className="border-b p-2">
                                        <input 
                                            className="w-full p-2 border rounded" 
                                            placeholder="search bar"
                                        />
                                    </div>
                                    <div className="overflow-y-auto scroll-custom h-full">
                                        {leftItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => moveItemToRight(item.id)}
                                            >
                                            {item.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-col w-full h-58 border border-l-slate-600">
                                    <div className="overflow-y-auto scroll-custom h-full">
                                        {rightItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => moveItemToLeft(item.id)}
                                            >
                                            {item.name}
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        </tr>
                    </tbody>
                </table>
            </div>
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
                <div className="mt-2">
                    <div className="cursor-pointer text-center bg-[#15803d] p-4 text-white font-bold uppercase text-xs">
                        <span>Doctor's notes</span>
                    </div>

                    <div className="p-8 sm:ml-[10rem] mr-[10rem]">
                        <div className="flex flex-col w-full">
                            <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Subjective Symptoms:</label>
                            <textarea 
                                className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none h-40"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <div className="flex justify-between my-5">
                                <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Objective Findings:</label>
                                <div>
                                    <span className='ml-2 mb-2 mt-4 text-gray-700 uppercase font-bold text-sm'>Vitals:</span>

                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">BP: </label>
                                    <input type="text" placeholder="Enter BP" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>

                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">HR: </label>
                                    <input type="text" placeholder="Enter HR" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                    
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">Temp: </label>
                                    <input type="text" placeholder="Enter Temp" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>

                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">O2 Sat: </label>
                                    <input type="text" placeholder="Enter O2 Sat" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                    
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">Ht: </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter cm"
                                        value={height} 
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"
                                    />
                                    
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">Wt: </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter kg" 
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"
                                    />
                                    
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">BMI: </label>
                                    <input 
                                        type="text"
                                        value={bmi} 
                                        className="border-none bg-gray-200 px-3 py-2 focus:outline-none w-24" 
                                        disabled
                                    />
                                </div>
                            </div>

                            <textarea 
                                className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none h-40"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            {/* <CustomTextarea /> */}
                            <div className="flex justify-between my-2">
                                <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Assesment:</label>
                            </div>

                            <textarea 
                                className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none h-40"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <div className="flex justify-between my-2">
                                <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Plan:</label>
                            </div>

                            <textarea 
                                className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none h-40"
                            />
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default Soap