import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

// components
import NavLink from "./Navlink";
import { useSelector } from "react-redux";

const Module = ({data, menuGroup}) => {
    
    const router = useRouter()
    const [menus, setMenus] = useState([])
    
    useEffect(() => {
        if(data && data.module) {
            const filteredMenus = data.module.filter((item) => item.permission !== null && item.menuGroup === menuGroup)
            setMenus(filteredMenus)
        }
    }, [data, menuGroup])

    

    return (
        <>
            {menus.map((item, index) => (
                // console.log(item.module.name)
                <nav className="bg-[#343a40]">
                    <ul className="py-0.5 px-2 ">
                        

                        <NavLink 
                            key={item.permission.moduleId}
                            href={`/${item.permission.moduleId}`} 
                            active={router.pathname === `/${item.permission.moduleId}`}>
                            <div className="hover:bg-[#5e6064] hover:text-[#fff] flex px-3 py-3 cursor-pointer text-[#c2c7d0] rounded-lg">
                                <svg className="" dangerouslySetInnerHTML={{__html: item.module.icon}} style={{ width: '2rem', height: '2rem', marginRight: '1em'}}></svg>{item.module.name}
                            </div>
                        </NavLink>
                    </ul>
                        
                    {/* <span className=" text-white focus:outline-none "
                        >
                    {isExpanded ? (
                        <svg className="h-6 w-6 fill-current transform rotate-90" xmlns="http://www.w3.org  /2000/svg" viewBox="0 0 24 24">
                            <path className="heroicon-ui" d="M6.71 19.41l-1.42-1.42L11.59 12 5.29 5.71l1.42-1.42L14 12l-7.71 7.71z"/>
                        </svg>
                    ) : (
                        <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path className="heroicon-ui" d="M4.28 6.28l1.44-1.44 6 6 .72.686-.72.72-6 6-1.44-1.44L9.585 12 4.28 6.697z" />
                        </svg>
                    )}
                    </span> */}
                </nav>
            ))}
        </>
    )
}

export default Module