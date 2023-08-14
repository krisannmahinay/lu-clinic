import { useState } from "react"
import NavTab from "./NavTab"


const Modal = ({isOpen, onClose, permission, module, selectedRowId}) => {


    const [navTab, setNavTab] = useState([])
    const groupModules = module
    ?.filter(module => module.type === 'sub' && module.grant?.menu_group)
    .reduce((groups, module) => {
        const { menu_group } = module.grant || {}
        if(!groups[menu_group]) {
            groups[menu_group] = []
        }
        groups[menu_group].push(module)
        return groups
    }, {})
    
    
    // console.log(groupModules)
    const tabData = [
        {
            label: 'Dashboard', 
            content: groupModules?.dashboard || [], 
            table:true,
            tableTitle: "Users",
            tableContent: ""
        },
        {
            label: 'Inventory', 
            content: groupModules?.inventory || [],
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Settings', 
            content: groupModules?.settings || [],
            table: false,
            tableTitle: "",
            tableContent: ""
        }
    ]

    const handleCheckedData = (data) => {
        setNavTab(data)
    }

    const handleSave = (e) => {
        e.preventDefault()
        console.log(navTab)
    }

    // console.log(groupModules)

    return (
        <div className={`fixed inset-0 flex top-0 p-4 items-center justify-center z-50 ${isOpen ? 'visible': 'hidden'}`}>
            <div className={`fixed inset-0 top-0 p-4 bg-black opacity-50 transition-opacity ${isOpen ? 'visible' : 'hidden'}`}></div>
            <div className={`bg-white p-6 rounded shadow-md z-50 transition-opacity ${isOpen ? 'visible' : 'hidden'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Modal Title</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12">
                            </path>
                        </svg>
                    </button>
                </div>
                <div className="w-full">
                
                {groupModules &&
                    <NavTab 
                        modal={true} 
                        onClose={onClose}
                        tabsData={tabData} 
                        userId={selectedRowId} 
                        onCheckedData={handleCheckedData}
                    />
                }
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}


export default Modal