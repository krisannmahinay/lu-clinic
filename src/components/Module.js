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
                console.log(item)
                    const isPatientRoute = router.asPath === `/patients/${item.module?.module_id}`
                    const isPatientSpecificRouteActive = router.asPath.startsWith(`/patients/${item.module?.module_id}/`)
                    const isPatientActive = isPatientRoute || isPatientSpecificRouteActive

                    const isSettingRoute = router.asPath === `/settings/${item.module?.module_id}`
                    const isSettingSpecificRouteActive = router.asPath.startsWith(`/settings/${item.module?.module_id}/`)
                    const isSettingActive = isSettingRoute || isSettingSpecificRouteActive

                    const isInventoryRoute = router.asPath === `/inventory/${item.module?.module_id}`
                    const isInventorySpecificRouteActive = router.asPath.startsWith(`/inventory/${item.module?.module_id}/`)
                    const isInventoryActive = isInventoryRoute || isInventorySpecificRouteActive
                
                    const baseClasses = 'flex items-center py-[4px] my-1 px-2 cursor-pointer rounded-lg text-sm'
                    const activeClasses = 'bg-[#5e6064] text-[#fff]'
                    const inactiveClasses = 'hover:bg-[#5e6064] hover:text-[#fff] text-[#c2c7d0]'
                    const subModuleClasses = item.module?.type === 'sub' ? 'pl-6' : ''

                    return (
                        // console.log(item)
                        <nav className="bg-[#343a40]">
                            <ul className="mx-1 my-1">
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
                                                        style={{ width: '2em', height: '2em', marginTop: '', marginRight: '5px'}}>
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
                                                        style={{ width: '2em', height: '2em', marginTop: '', marginRight: '5px'}}>
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
                                                        style={{ width: '2em', height: '2em', marginTop: '', marginRight: '5px'}}>
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
                                                        ? 'bg-[#5e6064] cursor-pointer text-[#fff] rounded-lg text-sm ' 
                                                        : 'hover:bg-[#5e6064] hover:text-[#fff] cursor-pointer text-[#c2c7d0] rounded-lg text-sm' }
                                                        ${item.module?.type === 'sub' ? 'pl-9' : ''} flex items-center py-[5px] my-1 px-2`}>
                                                <svg 
                                                    className="" 
                                                    dangerouslySetInnerHTML={{__html: item.module?.icon}} 
                                                    style={{ width: '2em', height: '2em', marginTop: '', marginRight: '5px'}}>
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