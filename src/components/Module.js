import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

// components
import NavLink from "./Navlink";
import { useSelector } from "react-redux";

const Module = ({data, menuGroup}) => {
    
    const router = useRouter()
    const [menus, setMenus] = useState([])
    const [isExpanded, setIsExpanded] = useState(false)
    
    useEffect(() => {
        if(data && data.module) {
            const uniquePermissions = new Set();
            const filteredMenus = data.module.filter((item) => {
                if(item.menu_group === menuGroup && !uniquePermissions.has(item.permission_id)) {
                    uniquePermissions.add(item.permission_id)
                    return true
                }
                return false
            });
            setMenus(filteredMenus)
        }
    }, [data, menuGroup])

    const toggleAccordion = (module) => {
        if(module === 'settings') {
            setIsExpanded((prevIsExpanded) => !prevIsExpanded)
        }
    }

    // console.log(menus)
    
    return (
        <>
            {menus.map((item, index) => {
                    const isPatientRoute = router.asPath === `/patients/${item.module?.module_id}`
                    const isPatientSpecificRouteActive = router.asPath.startsWith(`/patients/${item.module?.module_id}/`)
                    const isPatientActive = isPatientRoute || isPatientSpecificRouteActive

                    const isSettingRoute = router.asPath === `/settings/${item.module?.module_id}`
                    const isSettingSpecificRouteActive = router.asPath.startsWith(`/settings/${item.module?.module_id}/`)
                    const isSettingActive = isSettingRoute || isSettingSpecificRouteActive

                    const isInventoryRoute = router.asPath === `/inventory/${item.module?.module_id}`
                    const isInventorySpecificRouteActive = router.asPath.startsWith(`/inventory/${item.module?.module_id}/`)
                    const isInventoryActive = isInventoryRoute || isInventorySpecificRouteActive
                
                    const baseClasses = 'flex px-2 py-[4px] cursor-pointer rounded-lg text-[16px]'
                    const activeClasses = 'bg-[#5e6064] text-[#fff]'
                    const inactiveClasses = 'hover:bg-[#5e6064] hover:text-[#fff] text-[#c2c7d0]'
                    const subModuleClasses = item.module?.type === 'sub' ? 'pl-9' : ''

                    return (
                        // console.log(item)
                        <nav className="bg-[#343a40]">
                            <ul className="mx-4 my-2">
                                {item.module?.type === 'sub' ? (
                                    <>
                                        {menuGroup === 'patients' && (
                                            <NavLink 
                                                shallow
                                                key={index}
                                                href={`/patients/${item.module?.module_id}`}>
                                                <div className={`${baseClasses} ${isPatientActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}>
                                                    <svg 
                                                        className="" 
                                                        dangerouslySetInnerHTML={{__html: item.module?.icon}} 
                                                        style={{ width: '1.5em', height: '1.5em', marginTop: '2px', marginRight: '5px'}}>
                                                    </svg>
                                                    {item.module?.name}
                                                </div>
                                            </NavLink>
                                        )}

                                        {menuGroup === 'settings' && (
                                            <NavLink 
                                                shallow
                                                key={index}
                                                href={`/settings/${item.module?.module_id}`}>
                                                
                                                
                                                <div className={`${baseClasses} ${isSettingActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}>
                                                    <svg 
                                                        className="" 
                                                        dangerouslySetInnerHTML={{__html: item.module?.icon}} 
                                                        style={{ width: '1.6em', height: '1.5em', marginTop: '2px', marginRight: '5px'}}>
                                                    </svg>
                                                    {item.module?.name}
                                                </div>
                                            </NavLink>
                                        )}

                                        {menuGroup === 'inventory' && (
                                            <NavLink 
                                                shallow
                                                key={index}
                                                href={`/inventory/${item.module?.module_id}`}>
                                                
                                                
                                                <div className={`${baseClasses} ${isInventoryActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}>
                                                    <svg 
                                                        className="" 
                                                        dangerouslySetInnerHTML={{__html: item.module?.icon}} 
                                                        style={{ width: '1.6em', height: '1.5em', marginTop: '2px', marginRight: '5px'}}>
                                                    </svg>
                                                    {item.module?.name}
                                                </div>
                                            </NavLink>
                                        )}
                                    </>
                                ) :  (
                                    <>
                                        <NavLink 
                                            shallow
                                            key={index}
                                            href={`/${item.module?.module_id}`}>
                                            
                                                {/* ${router.pathname === `/${item.module?.module_id}`  */}
                                            <div
                                                className={`${router.pathname.startsWith(`/${item.module?.module_id}`)
                                                        ? 'bg-[#5e6064] flex px-2 py-[4px] cursor-pointer text-[#fff] rounded-lg text-[16px]' 
                                                        : 'hover:bg-[#5e6064] hover:text-[#fff] flex px-2 py-1 cursor-pointer text-[#c2c7d0] rounded-lg text-[16px]' }
                                                        ${item.module?.type === 'sub' ? 'pl-9' : ''}`}>
                                                <svg 
                                                    className="" 
                                                    dangerouslySetInnerHTML={{__html: item.module?.icon}} 
                                                    style={{ width: '1.5em', height: '1.5em', marginTop: '2px', marginRight: '5px'}}>
                                                </svg>
                                                {item.module?.name}
                                            </div>
                                            
                                        </NavLink>
                                    </>
                                )}
                            </ul>
                        </nav>
                    )
                }
            
            )}
        </>
    )
}

export default Module