import { useState, Fragment } from "react"


const NavTab = ({tabsData, tables}) => {
    const [activeTab, setActiveTab] = useState(1)

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex)
    }

    return (
        <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border rounded-lg">
                    <div className="flex justify-items-center">
                        {tabsData.map((tab, index) => (
                            <button
                                onClick={() => handleTabClick(index + 1)}
                                className={`px-4 py-2 ${
                                    activeTab === index + 1 ? 'bg-white' : 'bg-gray-200'
                                } ${index === 0 ? 'rounded-tl-lg': ''}  border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {tabsData.map((tab, index) => (
                        <Fragment key={index}>
                            {activeTab === index + 1 && (
                                <div className="tab-content p-4">{tab.content}</div>
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>

            <hr className="py-8"/>
            <div>
                {tabsData.map((tab, index) => (
                        tab.table && (
                            <Fragment key={index}>
                                {activeTab === index + 1 && (
                                    <div className="px-2 mb-4">
                                        <span class="text-xl font-medium uppercase text-[#90949a]">{tab.tableTitle}</span>
                                    </div>
                                )}
                                {activeTab === index + 1 && tab.tableContent}
                            </Fragment>
                        )
                    ))}
            </div>
        </>
    )
}

export default NavTab