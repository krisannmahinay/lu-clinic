
import { useState, useEffect } from "react"

const Soap = ({soapData, soapHeaders, dummyData}) => {
    
    const [checkedItem, setCheckedItem] = useState([])
    const [leftItems, setLeftItems] = useState(dummyData)
    const [rightItems, setRightItems] = useState([])

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

    const handleCheckbox = (moduleId) => {
        if(checkedItem.includes(moduleId)) {
            setCheckedItem(checkedItem.filter((checked) => checked !== moduleId))
            
        } else {
            setCheckedItem([...checkedItem, moduleId])
        }
    }

    return (
        <div>
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
                                            {tblBody[tblHeader].map((item) => (
                                                
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
                                    {/* <div className="border-b p-2">
                                        <input 
                                            className="w-full p-2 border rounded" 
                                            placeholder="search bar"
                                        />
                                    </div> */}
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
                                </div>
                            </div>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-10">
                <div className="text-medium font-semibold text-center tracking-wide text-white uppercase border-b bg-green-500 px-4 py-4">
                    <span>Doctor's notes</span>
                </div>

                <div>
                    <div className="flex flex-col w-full">
                        <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Subjective Symptoms:</label>
                        <textarea 
                            className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
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
                                <input type="text" placeholder="Enter Ht" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                
                                <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">Wt: </label>
                                <input type="text" placeholder="Enter Wt" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                                
                                <label className="ml-2 mb-2 text-gray-700 uppercase text-sm">BMI: </label>
                                <input type="text" placeholder="Enter BMI" className="border border-gray-300 px-2 py-2 focus:border-gray-500 focus:outline-none w-24"/>
                            </div>
                        </div>

                        <textarea 
                            className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex justify-between my-2">
                            <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Assesment:</label>
                        </div>

                        <textarea 
                            className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex justify-between my-2">
                            <label className="ml-2 mb-2 mt-4 text-gray-700 uppercase font-semibold text-sm">Plan:</label>
                        </div>

                        <textarea 
                            className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Soap