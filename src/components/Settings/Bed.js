import React from "react"
import { useState, useEffect } from "react"

const Bed = () => {
    
    const [activeTab, setActiveTab] = useState('tab1')

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border rounded-lg">
                <div className="flex justify-items-center">
                    <button 
                        onClick={() => setActiveTab('tab1')}
                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab1' ? 'bg-white':'bg-gray-200'}`}>Bed Status
                    </button>
                    <button 
                        onClick={() => setActiveTab('tab2')}
                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-white':'bg-gray-200'}`}>Bed List
                    </button>
                    <button 
                        onClick={() => setActiveTab('tab3')}
                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab3' ? 'bg-white':'bg-gray-200'}`}>Bed Type
                    </button>
                    <button 
                        onClick={() => setActiveTab('tab4')}
                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab4' ? 'bg-white':'bg-gray-200'}`}>Bed Group
                    </button>
                    <button 
                        onClick={() => setActiveTab('tab5')}
                        className={`px-4 py-2 focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab5' ? 'bg-white':'bg-gray-200'}`}>Floor
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Bed