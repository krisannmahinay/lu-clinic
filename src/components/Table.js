
import { useState, useEffect } from "react"
import SkeletonScreen from "./SkeletonScreen"
import Modal from "./Modal"
import Pagination from "./Pagination"

const Table = ({title, user, tableHeader, isLoading, permission, module, tab, onOpenModal}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])

    const openModal = (userId) => {
        if(selectedRows.includes(userId)) {
            setSelectedRows(selectedRows.filter((index) => index !== userId))
        } else {
            setSelectedRows([...selectedRows, userId])
        }
        setIsModalOpen(true)
        onOpenModal(userId)
    }

    const closeModal = () => {
        setSelectedRows([])
        setIsModalOpen(false)
    }

    return (
        <>
            <Modal 
                // title={title}
                module={module} 
                isOpen={isModalOpen} 
                onClose={closeModal}
                permission={permission} 
                selectedRowId={selectedRows}
            />

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {isLoading ? (
                    <>
                        <SkeletonScreen rowCount={user.length} columnCount={tableHeader.length}/> 
                    </>
                ) : 
                
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {tableHeader.map((tblHeader, tblHeaderIndex) => (
                                    <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {tblHeader}
                                    </th>
                                ))}

                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {user.map((tblBody, tblBodyIndex) => (
                                // console.log(tblBody)
                                <tr key={tblBodyIndex}>

                                    {tableHeader.map((tblHeader) => (
                                        <td key={tblHeader} className="px-6 py-4 whitespace-nowrap">
                                            {tblBody[tblHeader]}
                                        </td>
                                    ))}

                                    <td>    
                                        <button title="Add Modules" type="button" onClick={() => openModal(tblBody.user_id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 focus:outline-none flex items-center space-x-2 rounded">
                                            {/* <span>ADD</span> */}
                                            <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>

        </>
    )
}

export default Table