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
            const filteredMenus = data.module.filter((item) => item.permission !== null && item.module !== null && item.menu_group === menuGroup)
            setMenus(filteredMenus)
        }
    }, [data, menuGroup])

    
    const toggleAccordion = (module) => {
        if(module === 'settings') {
            setIsExpanded((prevIsExpanded) => !prevIsExpanded)
        }
    }
    
    return (
        <>
            {menus.map((item, index) => (
                // console.log(item)
                <nav className="bg-[#343a40]">
                    <ul className="py-0.5 px-2 ">
                        {item.module.type === 'sub' ? (
                            <>
                                {menuGroup === 'settings' && (
                                    <NavLink 
                                        shallow
                                        key={item.permission.module_id}
                                        href={`/settings/${item.permission.module_id}`}>
                                        
                                        <div
                                            className={`${router.pathname === `/settings/${item.permission.module_id}` 
                                                    ? 'bg-[#5e6064] flex px-3 py-2 cursor-pointer text-[#fff] rounded-lg' 
                                                    : 'hover:bg-[#5e6064] hover:text-[#fff] flex px-3 py-2 cursor-pointer text-[#c2c7d0] rounded-lg' }
                                                    ${item.module.type === 'sub' ? 'pl-9' : ''}`}>
                                            <svg 
                                                className="" 
                                                dangerouslySetInnerHTML={{__html: item.module.icon}} 
                                                style={{ width: '1.7rem', height: '1.6rem', marginRight: '5px'}}>
                                            </svg>
                                            {item.module.name}
                                        </div>
                                    </NavLink>
                                )}

                                {menuGroup === 'inventory' && (
                                    <NavLink 
                                        shallow
                                        key={item.permission.module_id}
                                        // href={`/${item.permission.module_id}`}
                                        href={`/inventory/${item.permission.module_id}`}>
                                        
                                        <div
                                            className={`${router.pathname === `/settings/${item.permission.module_id}` 
                                                    ? 'bg-[#5e6064] flex px-3 py-2 cursor-pointer text-[#fff] rounded-lg' 
                                                    : 'hover:bg-[#5e6064] hover:text-[#fff] flex px-3 py-2 cursor-pointer text-[#c2c7d0] rounded-lg' }
                                                    ${item.module.type === 'sub' ? 'pl-9' : ''}`}>
                                            <svg 
                                                className="" 
                                                dangerouslySetInnerHTML={{__html: item.module.icon}} 
                                                style={{ width: '1.7rem', height: '1.6rem', marginRight: '5px'}}>
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
                                                ? 'bg-[#5e6064] flex px-3 py-2 cursor-pointer text-[#fff] rounded-lg' 
                                                : 'hover:bg-[#5e6064] hover:text-[#fff] flex px-3 py-2 cursor-pointer text-[#c2c7d0] rounded-lg' }
                                                ${item.module.type === 'sub' ? 'pl-9' : ''}`}>
                                        <svg 
                                            className="" 
                                            dangerouslySetInnerHTML={{__html: item.module.icon}} 
                                            style={{ width: '1.7rem', height: '1.6rem', marginRight: '5px'}}>
                                        </svg>
                                        {item.module.name}
                                    </div>
                                    
                                </NavLink>
                            </>
                        )}
                    </ul>
                </nav>
            ))}
        </>
    )
}

export default Module