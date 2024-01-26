
import { useState, useEffect } from "react"
import Table from "@/components/Table"
import { TableContext } from "@/utils/context"

const doctorOrderData = [
    {date: "23 Aug 23", time: "14:23", progress_notes: "lorem ispum", physicians_order: "", nurse_in_charge: "Jane Smith"}
]

const DoctorOrder = () => {
    return (
        
        <div>
            <div className="flex justify-center">
                <button className="">
                    <svg dataSlot="icon" fill="none" className="w-7 h-7" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>

            <table className="border-none min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date/Time
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress Notes
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Physician's Order
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nurse In Charge
                        </th>
                    </tr>
                </thead>
                
                <tbody className="">
                    <tr>
                        <td className="px-6 py-2 text-center border border-r-gray-400">
                            Date/Time
                        </td>
                        <td className="px-6 py-2 text-center border border-r-gray-400 ">
                            <textarea 
                                type="text" 
                                name="lastName" 
                                placeholder="Type..." 
                                // onClick={() => handleClickedPO("po")}
                                className="border-none h-32 w-full focus:border-gray-500 focus:outline-none" 
                            />
                        </td>
                        <td className="px-6 py-2 text-left border border-r-gray-400 ">
                            {/* <textarea 
                                type="text" 
                                name="lastName" 
                                placeholder="Click for physicians order" 
                                // onClick={() => handleClickedPO("po")}
                                className="border border-gray-300 px-3 py-2 w-full focus:border-gray-500 focus:outline-none" 
                            /> */}
                            <div className="h-full border-none py-2 w-full focus:border-gray-500 focus:outline-none max-h-40 overflow-y-auto scroll-custom space-y-2">
                                <div  className="p-4 rounded bg-gray-200 cursor-pointer text-sm text-gray-500 hover:text-gray-800">
                                    <p><span className="text-green-700 font-bold">Orders:</span> Medications: Lorem ipsum IV Fluids: Lorem ipsum </p>
                                </div>
                                <div  className="p-4 rounded bg-gray-200 cursor-pointer text-sm text-gray-500 hover:text-gray-800">
                                    <p><span className="text-green-700 font-bold">Referral:</span> Medications: Lorem ipsum IV Fluids: Lorem ipsum </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Publish</button>
                                <button className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Refer</button>
                                <button className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">MGH</button>
                            </div>
                                                
                        </td>
                        <td className="px-6 py-2 text-center">
                            Progress Notes
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        // <TableContext.Provider value={{
        //     tableData: doctorOrderData,
        //     tableHeader: Object.keys(doctorOrderData[0])
        // }}>
        //     <Table />
        // </TableContext.Provider>
        // <Table 
        //     // slug={moduleId}
        //     title="User List"
        //     // disableTable={true} 
        //     physicianOrder={true}
        //     tableData={doctorOrderData} 
        //     tableHeader={Object.keys(doctorOrderData[0])}
        //     // isLoading={userListLoading}
        //     onOpenModal={(id) => setModalId(id)}
        // />
    )
}

export default DoctorOrder