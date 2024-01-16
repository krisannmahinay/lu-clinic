import { createContext, useContext } from "react"


export const FormContext = createContext({
    data: null,
    initialFields: null,
    enableAutoSave: false,
    onFormChange: () => {}
})

export const useFormContext = () => useContext(FormContext)