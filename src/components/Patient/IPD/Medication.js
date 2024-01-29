import { useComponentContext } from "@/utils/context"


const Medication = () => {
    const context = useComponentContext()
    const [isShowMedForm, setIsShowMedForm] = useState(false)

    return (
        <div>
            <div className="sticky top-0">
                <input
                    type="search"
                    value={context?.state?.searchMedicine}
                    onChange={(e) => handleOnChange(e, 'searchMedicine', _)}
                    placeholder="Search..."
                    className="p-1 w-full border-b-gray-300 border-b-[1px] bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
                />
                <div className="">
                    {context?.state?.medicationData?.map((data) => (
                        <div
                            key={data.id}
                            className={`p-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-800 ${data.quantity === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={data.quantity === 0 ? undefined : () => handleOnClick(data, 'selectMedicine')}
                        >
                            <p className={`${data.quantity === 0 ? 'text-red-500' : ''}`}>{`${data.generic_name} ${data.quantity === 0 ? '(Out of stock)' : ''}`}</p>
                        </div>
                    ))}
                </div>
            </div>

            
            {isShowMedForm && (
                <div className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Brand name:</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                            value={context?.state?.selectedMedicine?.brand_name}
                            readOnly
                            
                        />
                        <label className="block text-sm font-medium text-gray-700">Generic name:</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                            value={context?.state?.selectedMedicine?.generic_name}
                            readOnly
                        />

                        <label className="block text-sm font-medium text-gray-700">Dose:</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                            value={context?.state?.selectedMedicine.dose}
                            onChange={(e) => context?.onAddMedicine({data:e, field:"dose"})}
                        />

                        <label className="block text-sm font-medium text-gray-700">Form:</label>
                        <select 
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                            onChange={(e) => context?.onAddMedicine({data:e, field:"form"})}>
                            <option>Select options</option>
                            {formMedication.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700">Qty:</label>
                        <input
                            type="number"
                            className={`mt-1 block w-full p-2 border bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 ${alertMessage !== "" ? 'border-red-600' :  'border-gray-300'}`}
                            value={context?.state?.selectedMedicine.qty}
                            onChange={(e) => context?.onAddMedicine({data:e, field:"qty"})}
                        />
                        {alertMessage && (
                            <p className="text-xs text-red-600"><span class="font-medium">Error!</span> {alertMessage}</p>
                        )}

                        <label className="block text-sm font-medium text-gray-700">Frequency:</label>
                        <select 
                            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                            onChange={(e) => context?.onAddMedicine({data:e, field:"frequency"})}>
                            <option>Select options</option>
                            {frequencyOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700">Sig:</label>
                        <textarea 
                            type="text"
                            className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                            value={context?.state?.selectedMedicine.sig}
                            onChange={(e) => context?.onAddMedicine({data:e, field:"sig"})}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleOnClick(_, "backBtn")}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >&larr; Back
                        </button>
                        <button
                            onClick={() => handleOnClick(context?.state?.selectedMedicine, "submitMedicine")}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Medication