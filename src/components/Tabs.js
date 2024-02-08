import { useState } from "react"


const Tabs = ({tabsConfig, onActiveTab}) => {
    const [activeTab, setActiveTab] = useState(tabsConfig[0].id)

    const handleActiveTab = (id) => {
        onActiveTab(id)
        setActiveTab(id)
    }

    return (
        <div className="bg-white mx-auto sm:w-full">
            <div className="border border-gray-300 rounded">
                <div className="flex justify-items-center border-gray-300 sticky top-0 bg-white border-b-[1px] z-50">
                    <div className="rounded-tl-lg py-3 ml-3">
                        {tabsConfig.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleActiveTab(tab.id)}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === tab.id ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tab-content">
                        {tabsConfig.map(tab => {
                            if(activeTab === tab.id) {
                                return <div key={tab.id}>{tab.content()}</div>
                            }
                            return null
                        })}
                </div>
            </div>
        </div>
    )
}

export default Tabs