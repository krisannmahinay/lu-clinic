
import { useState, useEffect } from "react"
import SkeletonScreen from "./SkeletonScreen"
import Modal from "./Modal"
import Alert from "./Alert"
import Pagination from "./Pagination"

const Table = ({title, user, tableHeader, isLoading, permission, module, tab, onOpenModal, onSuccess, action, slug}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [openModalId, setOpenModalId] = useState("")

    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState([])

    // useEffect(() => {
    //     if(alertType !== "") {
    //         closeModal()
    //         setSelectedRows([])
    //     }
    // }, [alertType])

    const openModal = (userId) => {
        if(selectedRows.includes(userId)) {
            setSelectedRows(selectedRows.filter((index) => index !== userId))
        } else {
            setSelectedRows([...selectedRows, userId])
        }
        setOpenModalId(userId)
        setIsModalOpen(true)
        onOpenModal(userId)
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
    }

    const closeModal = () => {
        setSelectedRows([])
        setIsModalOpen(false)
    }

    return (
        <>
            {alertMessage &&
                <Alert 
                    alertType={alertType}
                    isOpen={alertType !== ""}
                    onClose={handleAlertClose}
                    message={alertMessage} 
                /> 
            }

            <Modal 
                // title={title}
                module={module} 
                isOpen={isModalOpen} 
                onClose={closeModal}
                onSuccess={closeModal}
                permission={permission} 
                selectedRowId={openModalId}
                onSetAlertType={(data) => setAlertType(data)}
                onSetAlertMessage={(data) => setAlertMessage(data)}
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

                                {action && (
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                )}
                                
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {user.length === 0 ? (
                                <tr>
                                    <td colSpan={tableHeader.length + 1} className="px-6 py-4 text-center">
                                        No records found.
                                    </td>
                                </tr>
                            ): (
                                user.map((tblBody, tblBodyIndex) => (
                                    // console.log(tblBody)
                                    <tr key={tblBodyIndex}>
    
                                        {tableHeader.map((tblHeader) => (
                                            <td key={tblHeader} className="px-6 py-4 whitespace-nowrap">
                                                {tblHeader === 'patient_id' ? (
                                                    // console.log(slug)
                                                    <a href={`/patients/${slug}/${tblBody[tblHeader]}`} className="text-blue-500 hover:underline">
                                                        {tblBody[tblHeader]}
                                                    </a>
                                                ): (
                                                    tblBody[tblHeader]
                                                )}
                                            </td>
                                        ))}
    
                                        {action && (
                                            <td>    
                                                <button title="Add Modules" type="button" onClick={() => openModal(tblBody.user_id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 focus:outline-none flex items-center space-x-2 rounded">
                                                    {/* <span>ADD</span> */}
                                                    <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                }
            </div>

        </>
    )
}

export default Table