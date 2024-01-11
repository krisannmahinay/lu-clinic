import { useState } from "react"


const Prescription = () => {
    const [isShowMedForm, setIsShowMedForm] = useState(false)
    const [searchMedicine, setSearchMedicine] = useState("")

    const handleOnChange = (e, type) => {
        switch(type) {
            case 'searchMedicine':
                setSearchMedicine(e.target.value)
                break
            
            default:
                break
        }
    }
    
    return (
        <div className="flex justify-center">
            <div className="flex-col w-1/2 border border-r-gray-400">
                <div className="overflow-y-auto scroll-custom h-full">
                    {!isShowMedForm && (
                        <div className="sticky top-0">
                            <input
                                type="search"
                                value={searchMedicine}
                                onChange={(e) => handleOnChange(e, 'searchMedicine')}
                                placeholder="Search..."
                                className="p-1 w-full border border-b-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                            />
                            <div className="">
                                {/* {medicationList?.map((data) => (
                                    <div
                                        key={data.id}
                                        className={`p-2 text-sm text-gray-500 ${data?.status === 'ps' ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-300 cursor-pointer' }`}
                                        onClick={data?.status !== 'ps' ? () => selectMedicine(data) : undefined}
                                    >
                                        {`${data?.medicine.generic_name} (${data?.dose})`}
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    )}
                </div>
                
            </div>
            
            <div className="flex-col w-full border">

            </div>
        </div>
    )
}

export default Prescription