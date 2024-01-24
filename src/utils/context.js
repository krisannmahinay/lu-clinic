import { createContext, useContext } from "react"

export const ComponentContext = createContext({
    data: null,
    state: null,
    alertMessage: "",
    patientData: null,
    pathologyData: null,
    radiologyData: null,
    medicationData: null,
    isDrawerOpen: false,
    onAddMedicine: () => {},
    onChange: () => {},
    onClose: () => {},
    onSubmitData:() => {},
    onClick: () => {},
    onClickOpenMed: () => {},
    onClickCloseMed: () => {},
    onSubmitDrRequest: () => {}
    // onSet
})

export const FormContext = createContext({
    // PatientInformation component
    data: null,
    provinceData: null,
    municipalityData: null,
    barangayData: null,
    initialFields: [],
    enableAutoSave: false,
    onModalOpen: () => {},
    onFormChange: () => {},
    onSelectedProvince: () => {},
    onSelectedMunicipality: () => {},

    // Add OPD Form Context
    ref: null,
    // data: null,
    // enableAutoSave: false,
    enableAddRow: false,
    onSuccess: () => {},
    onLoading: () => {},
    onCloseSlider: () => {},
    onSetAlertType: () => {},
    onSetAlertMessage: () => {},

    onClickFAB: () => {}
})

export const TableContext = createContext({
    // Table component
    tableHeader: null,
    tableData: null,
    isLoading: false,
    onChecked: () => {},
    onClick: () => {},
    onEdit: () => {},
})

export const ModalContext = createContext({
    isOpen: false,
    isModalOpen: false,
    onClose: () => {}
})

export const useFormContext = () => useContext(FormContext)
export const useModalContext = () => useContext(ModalContext)
export const useTableContext = () => useContext(TableContext)
export const useComponentContext = () => useContext(ComponentContext)