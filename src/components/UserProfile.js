import { debounce } from "lodash"
import { useState, useEffect } from "react"

const UserProfile = ({data, type, module}) => {
    const [modules, setModules] = useState(module)
    const [selectedPermission, setSelectedPermission] = useState({})

    const handleOnchange = (moduleId) => {
        setModules(modules?.module.map(module =>
            module.module_id === moduleId ? {...module, isToggled: !module.isToggled} : module
        ))
    }

    const handleAutoSave = debounce((moduleId) => {
        console.log(moduleId)
    })

    return (
        <div>
            <div className="mx-auto space-y-4">
                <div className="bg-white border border-gray-300 shadow-gray-200 rounded-md p-6 mt-4">
                    <div className="flex items-center space-x-4">
                        <img src="" alt="Profile picture" width={50} height={50} className="rounded-full" />
                        <div>
                            <h1 className="text-xl font-bold">
                                {data?.identity?.last_name !== null 
                                    ? data?.identity?.last_name : 'No Last Name'
                                } {data?.identity?.first_name !== null 
                                    ? data?.identity?.first_name : 'No First Name'
                                }
                            </h1>
                            <p>{data?.email}</p>
                        </div>
                    </div>

                    <div className="flex space-x-4">
            
                    </div>
                </div>

                <div className="flex space-x-4">
                    {type === 'view' && (
                        <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
                            <h2 className="font-bold text-sm uppercase text-gray-600 px-4 py-2">Personal Information</h2>
                            <div className="p-4">
                                <h1>hellow world</h1>
                            </div>
                        </div>
                    )}
                    
                    {type === 'edit' && (
                        <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
                            <h2 className="font-bold text-sm uppercase text-gray-600 px-4 py-2">Modules</h2>
                            <div className="p-4 space-y-2">
                                {modules?.module.map(mod => (
                                    <div className="flex ">
                                        <label key={mod.module_id} className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={mod.isToggled} 
                                                onChange={() => {
                                                    handleOnchange(mod.module_id)
                                                    handleAutoSave(mod.module_id)
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            <span className="ms-3 text-sm font-medium text-gray-900">{mod.name}</span>
                                        </label>
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}


                    <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
                        <h2 className="font-bold text-sm uppercase text-gray-600 px-4 py-2">Activities</h2>
                        <div className="p-4">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile