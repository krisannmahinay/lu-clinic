
import { useState, useEffect } from "react"
import Table from "@/components/Table"
import { TableContext } from "@/utils/context"

const doctorOrderData = [
    {date: "23 Aug 23", time: "14:23", progress_notes: "lorem ispum", physicians_order: "", nurse_in_charge: "Jane Smith"}
]

const doctorOrderForm = [
    {tdName: 'date_time'},
    {tdName: 'progress_notes'},
    {tdName: 'physician_orders'},
    {tdName: 'nurse_incharge'}
]

const DoctorOrder = ({onModalState}) => {

    const initialRow = doctorOrderForm.reduce((acc, item) => {
        acc[item.tdName] = ''
        return acc
    }, {})

    const [rows, setRows] = useState([initialRow])

    const handleAddRow = () => {
        setRows([...rows, { ...initialRow }])
    }

    const handleDeleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index))
    }

    const handleOnClick = () => {
        onModalState({modalState: true, type: "dro", modalType: "physician-order"})
    }

    const renderTableCell = (tdName) => {
        switch(tdName) {
            case 'date_time':
                return (
                    <span className="bg-gray-300 rounded p-2">Jan-24-2024 : 15:35</span>
                )
            case 'progress_notes':
                return (
                    <textarea 
                        type="text" 
                        name="lastName" 
                        placeholder="Type..." 
                        // onClick={() => handleClickedPO("po")}
                        className="border-none h-32 w-full focus:border-gray-500 focus:outline-none" 
                    />
                )
            case 'physician_orders':
                return (
                    <div>
                        <div onClick={handleOnClick} className="border-none h-32 w-full focus:border-gray-500 focus:outline-none hover:cursor-pointer">
                            <p className="py-4 text-gray-400">Click to fill...</p>
                            {/* <div  className="p-4 rounded bg-gray-200 cursor-pointer text-sm text-gray-500 hover:text-gray-800">
                                <p><span className="text-green-700 font-bold">Orders:</span> Medications: Lorem ipsum IV Fluids: Lorem ipsum </p>
                            </div>
                            <div  className="p-4 rounded bg-gray-200 cursor-pointer text-sm text-gray-500 hover:text-gray-800">
                                <p><span className="text-green-700 font-bold">Referral:</span> Medications: Lorem ipsum IV Fluids: Lorem ipsum </p>
                            </div> */}
                        </div>

                        <div className="flex justify-end">
                            <button className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Publish</button>
                            <button className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Refer</button>
                            <button className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">MGH</button>
                        </div>
                    </div>
                )
            case 'nurse_incharge':
                return 'Nurse John Smith'
            default:
                return
        }
    }

    return (
        <div>
            <div className="flex justify-center bg-gray-300 hover:bg-gray-400 hover:cursor-pointer" onClick={handleAddRow}>
                <svg dataSlot="icon" fill="none" className="w-6 h-6 text-gray-500" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </div>

            <table className="border-none min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date/Time
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress Notes
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Physician's Order
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nurse In Charge
                        </th>
                        {rows?.length > 1 && (
                            <th className="py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {doctorOrderForm.map((item) => (
                                <td className="text-center p-2 border-r border-b border-gray-300" key={item.tdName}>
                                    {renderTableCell(item.tdName, row)}
                                </td>
                            ))}
                            {rows?.length > 1 && (
                                <td className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteRow(rowIndex)}
                                        className="hover:bg-gray-200 rounded-md focus:outline-none text-[#cb4949] "
                                    >
                                        <svg fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DoctorOrder