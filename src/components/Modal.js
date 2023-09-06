import React,{ useImperativeHandle, forwardRef, useState, useRef, useEffect  } from "react"
import NavTab from "./NavTab"
import Form from "./Form"

import { useGrantUserModuleMutation } from "@/service/authService"

const Modal = ({
        isOpen, 
        onClose, 
        permission, 
        module, 
        slug, 
        selectedRowId, 
        tabNumber, 
        onSuccess,
        openId,
        onSetAlertMessage,
        onSetAlertType,
        ...props
    }) => {
    const formRef = useRef(null)
    const [checkedItem, setCheckedItem] = useState([])
    const [activeTab, setActiveTab] = useState('tab1')
    const [navTab, setNavTab] = useState([])
    const [triggerSubmit, setTriggerSubmit] = useState(false)
    const [openModalId, setOpenModalId] = useState("")
    
    const [grantUserModule, { isLoading, isError, error, isSuccess }] = useGrantUserModuleMutation()
    
    // const { data: user } = useGetUserByIdQuery({id:selectedRowId})
    const groupModules = module
        ?.filter(module => (module.type === 'sub' || module.type === "") && module.grant?.menu_group)
        .reduce((groups, module) => {
            const { menu_group } = module.grant || {}
            if(!groups[menu_group]) {
                groups[menu_group] = []
            }
            if(module.type === "") {
                groups[menu_group].unshift(module)
            } else {
                groups[menu_group].push(module)
            }

            return groups
        }, {})
        
    const handleCheckbox = (moduleId) => {
        const correspondingModule = Object.values(groupModules).flat().find(mod => mod.module_id === moduleId);
        const { menu_group } = correspondingModule.grant || {};
        
        setCheckedItem(prevItems => {
            // Make a copy of the current items
            const updatedItems = { ...prevItems }
            const currentGroupItems = updatedItems[menu_group] || []
            
            if (currentGroupItems.includes(moduleId)) {
                // If moduleId is already present, remove it
                updatedItems[menu_group] = currentGroupItems.filter(item => item !== moduleId);
            } else {
                // Add moduleId to the menu_group
                updatedItems[menu_group] = [...currentGroupItems, moduleId];
            }
    
            return updatedItems
        })
    }

    
    // console.log(groupModules)
    const dashboard = groupModules?.dashboard || []
    // const inventory = groupModules?.inventory || []
    const patients = groupModules?.patients || []
    const excluceInventory = ["inventory"]
    const inventory = (groupModules?.inventory || []).filter(module => !excluceInventory.includes(module.module_id))

    const excludeSettings = ["dashboard", "inventory", "radiology", "panthology", "pharmacy", "settings", "patients"]
    const settings = (groupModules?.settings || []).filter(module => !excludeSettings.includes(module.module_id))
    


    const handleCheckedData = (data) => {
        setNavTab(data)
    }

    const handleClose = () => {
        onClose()
        setCheckedItem([])
    }

    // const handleSetAlertType = (data) => {
    //     onSetAlertType(data)
    // }

    const handleCloseModal = (data) => {
        data !== null && (
            handleClose(),
            onSetAlertType(data)
        )
    }

    const moduleClose = () => {
        onClose()
    }


    const handleSave = (e) => {
        e.preventDefault()
        // if(slug === "charges") {

        // }
        
        if(groupModules) {
            grantUserModule({checkedItem, identity_id:selectedRowId})
            .unwrap()
            .then(response => {
                if(response.status === "success") {
                    onSetAlertType("success")
                    onSetAlertMessage(response.message)
                    setAlertOpen(true)
                    setFormData([])
                    moduleClose()
                }
            })
            .catch(error => {
                // console.log(error)
                if(error.status === 500) {
                    onSetAlertType("error")
                    onSetAlertMessage("Unsuccessful")
                    setAlertOpen(true)
                }
            })
        }

        if(slug === "settings") {
            formRef.current.handleSubmit()
        }
    }

    // console.log(user)

    return (
        <div className={`fixed inset-0 flex top-0 p-4 items-center justify-center z-50 ${isOpen ? 'visible': 'hidden'}`}>
            <div className={`fixed inset-0 top- p-4 bg-black opacity-50 transition-opacity ${isOpen ? 'visible' : 'hidden'}`}></div>
            <div className={`bg-white p-6 rounded shadow-md z-50 transition-opacity ${isOpen ? 'visible' : 'hidden'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold"></h2>
                    {/* <button
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
                    </button> */}
                </div>
                <div className="w-full">
                
                {groupModules && (
                        <>
                            {/* {console.log(user)} */}
                            {/* <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">Dashboard</div> */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="border rounded-lg">
                                    <div className="flex justify-items-center">
                                        <button 
                                            onClick={() => setActiveTab('tab1')}
                                            className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Dashboard
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab2')}
                                            className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Inventory
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab3')}
                                            className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Settings
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('tab4')}
                                            className={`px-4 py-2 border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>Patients
                                        </button>
                                    </div>
                                    
                                    <div className="tab-content p-2">
                                        {activeTab === 'tab1' && (
                                            <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                                {dashboard.map((item) => (
                                                    
                                                    <li key={item.module_id}>
                                                        <div className="flex items-center space-x-3 p-2 ">
                                                            <input
                                                                type="checkbox" 
                                                                className="w-4 h-4"
                                                                name={`grant_${item.module_id}`}
                                                                value={item.module_id}
                                                                // checked={checkedItem.includes(item.module_id)}
                                                                checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                                onChange={() => handleCheckbox(item.module_id)}
                                                            />
                                                            <p className="text-medium text-gray-500">{item.name}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {activeTab === 'tab2' && (
                                            <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                                {inventory.map((item) => (
                                                    
                                                    <li key={item.module_id}>
                                                        <div className="flex items-center space-x-3 p-2  ">
                                                            <input
                                                                type="checkbox" 
                                                                className="w-4 h-4"
                                                                name={`grant_${item.module_id}`}
                                                                value={item.module_id}
                                                                // checked={checkedItem.includes(item.module_id)}
                                                                checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                                onChange={() => handleCheckbox(item.module_id)}
                                                            />
                                                            <p className="text-medium text-gray-500">{item.name}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {activeTab === 'tab3' && (
                                            <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                                {settings.map((item) => (
                                                    
                                                    <li key={item.module_id}>
                                                        <div className="flex items-center space-x-3 p-2 ">
                                                            <input
                                                                type="checkbox" 
                                                                className="w-4 h-4"
                                                                name={`grant_${item.module_id}`}
                                                                value={item.module_id}
                                                                
                                                                checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                                onChange={() => handleCheckbox(item.module_id)}
                                                            />
                                                            <p className="text-medium text-gray-500">{item.name}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {activeTab === 'tab4' && (
                                            <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                                {patients.map((item) => (
                                                    
                                                    <li key={item.module_id}>
                                                        <div className="flex items-center space-x-3 p-2 ">
                                                            <input
                                                                type="checkbox" 
                                                                className="w-4 h-4"
                                                                name={`grant_${item.module_id}`}
                                                                value={item.module_id}
                                                                checked={(checkedItem[item.grant?.menu_group] || []).includes(item.module_id)}
                                                                onChange={() => handleCheckbox(item.module_id)}
                                                            />
                                                            <p className="text-medium text-gray-500">{item.name}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                
                    // <NavTab 
                    //     modal={true} 
                    //     onClose={onClose}
                    //     tabsData={tabData} 
                    //     userId={selectedRowId} 
                    //     onCheckedData={handleCheckedData}
                    // />
                    

                }

                {slug === 'charges' && (
                    tabNumber === 'tab1' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge Type</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge Category</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Code</label>
                                    <input type="text" placeholder="Enter code" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Standard Charge</label>
                                    <input type="text" placeholder="Enter code" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                                    <textarea type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"  />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab2' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                                    <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                                    <textarea type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"  />
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge Type</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab3' ? (
                        <>
                            <div className="w-80">
                                
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Doctor</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Standard Charge</label>
                                    <input type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab4' ? (
                        <>
                            <div className="w-80">
                                
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Doctor</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Standard Charge</label>
                                    <input type="text" placeholder="Enter standard charge" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab5' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Charge type</label>
                                    <input type="text" placeholder="Enter charge type" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : null
                )}

                {slug === 'bed' && (
                    tabNumber === 'tab2' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                                    <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Bed Type</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Bed Group</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab3' ? (
                        <>
                            <div className="w-80">
                                
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                                    <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab4' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                                    <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Floor</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                                    <textarea type="text" placeholder="Enter description" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab5' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                                    <input type="text" placeholder="Enter charge type" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : null
                )}

                {slug === 'symptoms' && (
                    tabNumber === 'tab1' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Head</label>
                                    <input type="text" placeholder="Enter symptoms" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Type</label>
                                    <select
                                        name=""
                                        value=""
                                        onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                                        className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="">Test</option>
                                        
                                    </select>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                                    <textarea type="text" placeholder="Enter description" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab2' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Type</label>
                                    <input type="text" placeholder="Enter charge type" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : null
                )}

                {slug === 'pharmacy' && (
                    tabNumber === 'tab1' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full mb-4">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Category Name</label>
                                    <input type="text" placeholder="Enter symptoms" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    ) : tabNumber === 'tab2' ? (
                        <>
                            <div className="w-80">
                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Supplier Name</label>
                                    <input type="text" placeholder="Enter supplier name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Supplier Contact</label>
                                    <input type="text" placeholder="Enter supplier contact" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Contact Person Name</label>
                                    <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Contact Person Phone</label>
                                    <input type="text" placeholder="Enter person contact" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Address</label>
                                    <input type="text" placeholder="Enter address" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                                </div>
                            </div>
                        </>
                    )  : null
                )}

                {slug === 'settings' && (
                    <div className="max-h-[40vh] overflow-y-auto scroll-custom">
                        <Form 
                            ref={formRef} 
                            initialFields={props.initialFields}
                            addUserBtn={props.addUserBtn}
                            onSuccess={props.handleRefetch}
                            onSetAlertMessage={onSetAlertMessage}
                            onSetAlertType={(data) => handleCloseModal(data)}
                        />
                    </div>
                )}

                {slug === 'out-patient' && (
                    <h1>sample</h1>
                )}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        onClick={handleClose}
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