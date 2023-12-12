import { useState } from "react"
import Accordion from "../Accordion"
import Button from "../Button"
import Table from "../Table"


const DOHReport = ({onAccordionClicked}) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleAccordion = (data) => {
        if(data === "info_classification") {
            onAccordionClicked(data)
            setIsOpen(true)
        }
    }

    const renderTableContent = () => (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    {header.filter(tblHeader => tblHeader !== 'id').map((tblHeader, tblHeaderIndex) => (
                        <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {tblHeader}
                        </th>
                    ))}

                    {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                    </th> */}
                </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
                {bedMaster.length === 0 ? (
                    <tr>
                        <td colSpan={header.length + 1} className="px-6 py-2 text-center">
                            No records found.
                        </td>
                    </tr>
                ) : (
                    bedMaster.map((tblBody, tblBodyIndex) => (
                        // <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
                        <tr key={tblBodyIndex} className="hover:bg-gray-100">
                            {header.filter(tblHeader => tblHeader !== 'id').map((tblHeader) => (
                                <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm ">
                                    {tblBody[tblHeader]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )

    const renderContent = () => (
        <div className="flex relative overflow-hidden h-screen">
            <div className="absolute inset-0 w-full">
                <div className="space-y-2">
                    <div className="font-bold text-xl mb-2 uppercase text-gray-600">DOH Annual Health Facility Statistical Report</div>
                    <div className="flex space-x-2">
                        <Button
                            btnIcon="add"
                            bgColor="disable"
                            btnLoading={true}
                            onClick={() => setActiveContent("green")}
                        >
                        Generate
                        </Button>
                        
                        <Button
                            btnIcon="submit"
                            bgColor="blue"
                            onClick={() => setActiveContent("green")}
                        >
                        Submit
                        </Button>
                    </div>

                    <div>
                        <div className="border rounded-md overflow-hidden">
                            <button
                                className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                                onClick={() => handleAccordion('info_classification')}
                            >
                                Info Classification
                            </button>
                            <div className={`transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="p-4"></div>
                            </div>
                        </div>

                        {/* <Table 
                                title="User List" 
                                disableTable={true}
                                // onOpenModal={(id) => setModalId(id)}
                            >
                                {renderTableContent()}
                            </Table> */}
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            {renderContent()}
        </div>
    )
}

export default DOHReport