import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

// components
import NavLink from "./Navlink";

const Module = ({data}) => {
    
    const router = useRouter()
    const [menus, setMenus] = useState([])
    
    useEffect(() => {
        const filtered = data.module.filter(function (el, index) { 
            return el.permission!=null 
        })
        setMenus(filtered)
    }, [data.module])

    return (
        <>
            {menus.map((item, index) => (
                <nav className="bg-gray-800">
                    <div className="hover:bg-gray-900 flex items-center justify-between px-6 py-4 cursor-pointer">
                        {/* <h1 key={index} className="text-white text-lg ">{ item.name }</h1> */}
                        <NavLink href={`/${item.moduleId}`} active={router.pathname === `/${item.moduleId}`}>
                            {item.name}
                        </NavLink>
                        
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
                    </div>
                </nav>
            ))}
        </>
    )
}

export default Module