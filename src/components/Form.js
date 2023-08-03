import { useEffect, useState } from "react"


const Form = ({initialFields = []}) => {
    // const [formData, setFormData] = useState({})
    const [formData, setFormData] = useState([])
    const [idCounter, setIdCounter] = useState(0)

    useEffect(() => {
        setFormData([{ id: 0, fields: initialFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}) }])
    }, [initialFields])

    const handleInputChange = (e, rowIndex, fieldName) => {
        const { value, type, checked } = e.target
        const fieldValue = type === 'checkbox' ? checked : value
        setFormData((prev) =>
            prev.map((row, index) =>
                index === rowIndex ? { ...row, fields: {...row.fields, [fieldName]: fieldValue }} : row 
            )
        )
    }

    const handleAddRow = () => {
        // const newRow = { fields: initialFields.map((field) => ({...field, id: Date.now().toString() })) }
        const newRow = { ...initialFields[0], id: idCounter }
        setFormData((prev) => [
            ...prev, 
            { id: idCounter + 1, fields: []}
        ])
        setIdCounter((prevCount) => prevCount + 1)
    }

    const handleRemoveRow = (rowIndex) => {
        setFormData((prev) => 
            prev.filter((_, index) => index !== rowIndex))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }

    const renderForm = (row, rowIndex) => {
        // console.log(row)
        return initialFields.map((field) => (
            // console.log(row.fields[field.name])
            <div key={field.name} className="w-full px-2 mb-4">
                {field.type === "text" && (
                    <>
                        <label htmlFor={field.name} className="block text-gray-600 mb-2">
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </>
                )}

                {field.type === "password" && (
                    <>
                        <label htmlFor={field.name} className="block text-gray-600 mb-2">
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </>
                )}


                {field.type === 'email' && (
                    <>
                        <label htmlFor={field.name} className="block text-gray-600 mb-2">
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                            placeholder={field.placeholder}
                        />
                    </>
                )}

                {field.type === 'dropdown' && (
                    <>
                        <label htmlFor={field.name} className="block text-gray-600 mb-2">{field.label}:</label>
                        <select
                            name={field.name}
                            value={row.fields[field.name]}
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                        >
                            <option value="">Select option</option>
                            {field.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>

        ))
    }

    return (
        <>
            <div className="tab-content p-4 ">
                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="bg-green-500 text-white mb-4 px-4 py-2 focus:outline-none">
                        ADD
                    </button>

                <form onSubmit={handleSubmit}>
                    
                        {formData.map((row, rowIndex) => (
                            <div key={row.id} className="flex justify-between">
                                {renderForm(row, rowIndex)}
                            {formData.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRow(rowIndex)}
                                    className="ml-2  text-[#cb4949] rounded-md px-2 py-1 focus:outline-none"
                                >
                                    <svg fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            )}
                            </div>
                        ))}
                    
                    
                    <div className="flex justify-end">
                        
                        <button className="bg-blue-500 text-white  px-4 py-2 focus:outline-none">
                            CREATE 
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Form