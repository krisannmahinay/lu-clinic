import { createContext, useContext } from "react"


export const FormContext = createContext({
    // PatientInformation component
    data: null,
    initialFields: [],
    enableAutoSave: false,
    onFormChange: () => {},

    // Table component
    tableHeader: null,
    tableData: null,
    isLoading: false,
    onChecked: () => {},
    onClick: () => {},
    onEdit: () => {}
})

export const useFormContext = () => useContext(FormContext)