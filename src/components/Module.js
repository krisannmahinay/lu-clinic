import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

// components
import NavLink from "./Navlink";
import { useSelector } from "react-redux";

const Module = ({data, menuGroup}) => {
    
    const router = useRouter()
    const [menus, setMenus] = useState([])
    const [isExpanded, setIsExpanded] = useState(false)
    // 
    useEffect(() => {
        if(data && data.module) {
            const filteredMenus = data.module.filter((item) => item.permission !== null && item.module !== null && item.menu_group === menuGroup)
            setMenus(filteredMenus)
        }
    }, [data, menuGroup])

    
    const toggleAccordion = (module) => {
        if(module === 'settings') {
            setIsExpanded((prevIsExpanded) => !prevIsExpanded)
        }
    }

    console.log(router.asPath)
    
    return (
        <>
            {menus.map((item, index) => {
                const isPatientRoute = router.asPath === `/patients/${item.permission.module_id}`
                const isPatientSpecificRouteActive = router.asPath.startsWith(`/patients/${item.permission.module_id}/`)
                const isPatientActive = isPatientRoute || isPatientSpecificRouteActive

                const isSettingRoute = router.asPath === `/settings/${item.permission.module_id}`
                const isSettingSpecificRouteActive = router.asPath.startsWith(`/settings/${item.permission.module_id}/`)
                const isSettingActive = isSettingRoute || isSettingSpecificRouteActive

                const isInventoryRoute = router.asPath === `/inventory/${item.permission.module_id}`
                const isInventorySpecificRouteActive = router.asPath.startsWith(`/inventory/${item.permission.module_id}/`)
                const isInventoryActive = isInventoryRoute || isInventorySpecificRouteActive
            
                const baseClasses = 'flex px-2 py-2 cursor-pointer rounded-lg'
                const activeClasses = 'bg-[#5e6064] text-[#fff]'
                const inactiveClasses = 'hover:bg-[#5e6064] hover:text-[#fff] text-[#c2c7d0]'
                const subModuleClasses = item.module.type === 'sub' ? 'pl-9' : ''

                return (
                    // console.log(item)
                    <nav className="bg-[#343a40]">
                        <ul className="mx-2 my-2 px-2 ">
                            {item.module.type === 'sub' ? (
                                <>
                                    {menuGroup === 'patients' && (
                                        <NavLink 
                                            shallow
                                            key={item.permission.module_id}
                                            href={`/patients/${item.permission.module_id}`}>
                                            <div className={`${baseClasses} ${isPatientActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}>
                                                <svg 
                                                    className="" 
                                                    dangerouslySetInnerHTML={{__html: item.module.icon}} 
                                                    style={{ width: '1.6rem', height: '1.6rem', marginRight: '5px'}}>
                                                </svg>
                                                {item.module.name}
                                                {/* {console.log(router.asPath)} */}
                                            </div>
                                        </NavLink>
                                    )}

                                    {menuGroup === 'settings' && (
                                        <NavLink 
                                            shallow
                                            key={item.permission.module_id}
                                            href={`/settings/${item.permission.module_id}`}>
                                            
                                            
                                            <div className={`${baseClasses} ${isSettingActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}>
                                                <svg 
                                                    className="" 
                                                    dangerouslySetInnerHTML={{__html: item.module.icon}} 
                                                    style={{ width: '1.6rem', height: '1.6rem', marginRight: '5px'}}>
                                                </svg>
                                                {item.module.name}
                                                {/* {console.log(router.asPath)} */}
                                            </div>
                                        </NavLink>
                                    )}

                                    {menuGroup === 'inventory' && (
                                        <NavLink 
                                            shallow
                                            key={item.permission.module_id}
                                            href={`/inventory/${item.permission.module_id}`}>
                                            
                                            
                                            <div className={`${baseClasses} ${isInventoryActive ? activeClasses : inactiveClasses} ${subModuleClasses}`}>
                                                <svg 
                                                    className="" 
                                                    dangerouslySetInnerHTML={{__html: item.module.icon}} 
                                                    style={{ width: '1.6rem', height: '1.6rem', marginRight: '5px'}}>
                                                </svg>
                                                {item.module.name}
                                            </div>
                                        </NavLink>
                                    )}
                                </>
                            ) :  (
                                <>
                                    <NavLink 
                                        shallow
                                        key={item.permission.module_id}
                                        href={`/${item.permission.module_id}`}>
                                        
                                        <div
                                            className={`${router.pathname === `/${item.permission.module_id}` 
                                                    ? 'bg-[#5e6064] flex px-2 py-2 cursor-pointer text-[#fff] rounded-lg' 
                                                    : 'hover:bg-[#5e6064] hover:text-[#fff] flex px-2 py-2 cursor-pointer text-[#c2c7d0] rounded-lg' }
                                                    ${item.module.type === 'sub' ? 'pl-9' : ''}`}>
                                            <svg 
                                                className="" 
                                                dangerouslySetInnerHTML={{__html: item.module.icon}} 
                                                style={{ width: '1.6rem', height: '1.6rem', marginRight: '5px'}}>
                                            </svg>
                                            {item.module.name}
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