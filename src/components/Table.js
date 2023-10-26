
import { useState, useRef, useEffect } from "react"
import SkeletonScreen from "./SkeletonScreen"
import { useDispatch } from 'react-redux'
import Modal from "./Modal"
import Alert from "./Alert"
import Pagination from "./Pagination"
import { authApi } from "@/service/authService"
import { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery 
} from '@/service/settingService'
import ModalTest from "./ModalTest"
import Soap from "./Patient/OPD/Soap"

const soapData = [
    {
        hematology: [
            {id:1, type:"hematology", name: "Complete Blood Count with platelet count(CBC with platelet)"},
            {id:2, type:"hematology", name: "Peripheral Blood Smear"},
            {id:3, type:"hematology", name: "Clotting Time(CT)"},
            {id:4, type:"hematology", name: "Bleeding Time(BT)"},
            {id:5, type:"hematology", name: "Prothrombin Time(PT)"},
            {id:6, type:"hematology", name: "Partial Thromboplastin Time(PTT)"},
            {id:7, type:"hematology", name: "Dengue NS1"},
            {id:8, type:"hematology", name: "Crossmatching"},
            {id:9, type:"hematology", name: "Blood Typing"},
            {id:10, type:"hematology", name: "Others"}
        ], 
        urine_stool_studies: [
            {id:11, type:"stool", name: "Urinalysis(midstream, clean catch)"},
            {id:12, type:"stool", name: "Pregnancy Test"},
            {id:13, type:"stool", name: "Fecalysis"},
            {id:14, type:"stool", name: "Others"},
        ],
        cardiac_studies: [
            {id:15, type:"cardiac", name: "Electrocardiogram(ECG)"},
            {id:16, type:"cardiac", name: "Others",}
        ], 
        chemistry: [
            {id:17, type:"chemistry", name: "Lipid Profile"},
            {id:18, type:"chemistry", name: "Serum Sodium(Na)"},
            {id:19, type:"chemistry", name: "Serum Potassium(K)"},
            {id:20, type:"chemistry", name: "Blood Urea Nitrogen(BUN)"},
            {id:21, type:"chemistry", name: "Ionized Calcium(iCa)"},
            {id:22, type:"chemistry", name: "Uric Acid"},
            {id:23, type:"chemistry", name: "ALT/SGPT"},
            {id:24, type:"chemistry", name: "AST/SGOT"},
            {id:25, type:"chemistry", name: "Hepatitis Test"},
            {id:26, type:"chemistry", name: "Syphilis"},
            {id:27, type:"chemistry", name: "TSH"},
            {id:28, type:"chemistry", name: "Ft4"},
            {id:29, type:"chemistry", name: "Ft3"},
            {id:30, type:"chemistry", name: "TT4"},
            {id:31, type:"chemistry", name: "TT3"},
            {id:32, type:"chemistry", name: "PSA"},
            {id:33, type:"chemistry", name: "Rapid Antigen Test(COVID-19)"},
            {id:45, type:"chemistry", name: "Others"},
        ],
        glucose: [
            {id:46, type:"glucose", name: "Fasting Blood Sugar(FBS)"},
            {id:47, type:"glucose", name: "Hba1c"},
            {id:48, type:"glucose", name: "Random Blood Sugar"},
            {id:49, type:"glucose", name: "75g Oral Glucose Tolerance Test(OGTT)"},
            {id:50, type:"glucose", name: "Others"}
        ]
    }
]

const soapHeaders = [
    "hematology",
    "urine_stool_studies",
    "cardiac_studies",
    "chemistry",
    "glucose",
]

const dummyData = [
    {id:1, name: "Paracetamol"},
    {id:2, name: "Other Medicine"},
    {id:3, name: "Test Medicine2"},
    {id:4, name: "Test Medicine5"},
    {id:5, name: "Test Medicine6"},
    {id:6, name: "Test Medicine7"},
    {id:7, name: "Test Medicine7"},
    {id:8, name: "Test Medicine7"},
    {id:9, name: "Test Medicine7"},
    {id:10, name: "Test Medicine7"},
    {id:11, name: "Test Medicine7"},
    {id:12, name: "Test Medicine7"},
    {id:13, name: "Test Medicine7"},
    {id:14, name: "Test Medicine7"},
    {id:15, name: "Test Medicine7"},
    {id:16, name: "Test Medicine7"},
]

const Table = ({title, tableData, tableHeader, isLoading, permission, module, tab, onOpenModal, onSuccess, action, slug, children, disableTable}) => {
    
    const imgRef = useRef(null)
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [openModalId, setOpenModalId] = useState("")

    const [imgLink, setImgLink] = useState("")
    
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomScale, setZoomScale] = useState(1)
    const [maxHeight, setMaxHeight] = useState('70vh')

    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState([])

    const [inpatientAction, setInpatientAction] = useState("")

    // useEffect(() => {
    //     if(alertType !== "") {
    //         closeModal()
    //         setSelectedRows([])
    //     }
    // }, [alertType])

    // console.log(tableData)
    
    const { data: moduleList, isLoading: moduleListLoading} = useGetModuleListQuery()
    const moduleData = moduleList?.moduleList ?? []
    // console.log(moduleData)

    const openModal = (userId) => {
        if(selectedRows.includes(userId)) {
            setSelectedRows(selectedRows.filter((index) => index !== userId))
        } else {
            setSelectedRows([...selectedRows, userId])
        }
        setOpenModalId(userId)
        setIsModalOpen(true)
        onOpenModal(userId)
        
        // dispatch(authApi.util.invalidateTags([{ type: 'UserDetails', id: 'LIST' }]));
    }

    const handleScroll = (e) => {
        e.preventDefault()
    
        // Zoom in or out based on the scroll direction
        const newZoomScale = e.deltaY > 0 
          ? Math.max(zoomScale - 0.1, 1) // Limiting the minimum zoom to original size
          : Math.min(zoomScale + 0.1, 3) // Let's limit the maximum zoom to 3x for now
    
        setZoomScale(newZoomScale)

        const adjustedMaxHeight = 500 * newZoomScale  // Assuming 500px is base height
        setMaxHeight(`${adjustedMaxHeight}px`)
    
        if (imgRef.current) {
          imgRef.current.style.transform = `scale(${newZoomScale})`
        }
    }

    const handleImageClick = () => {
        if (!isZoomed) {
            setIsZoomed(true);
        }
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
        setInpatientAction("")
    }

    const closeModal = () => {
        // reset state
        setSelectedRows([])
        setIsModalOpen(false)
        setImgLink("")
        setInpatientAction("")
    }

    const handleClickedPO = (action) => {
        setIsModalOpen(true)  
        setInpatientAction(action)
    }

    const handleClickedPublish = (action) => {
        setIsModalOpen(true)
        setInpatientAction(action)
    }

    const handleClickedRefer = (action) => {
        setIsModalOpen(true)
        setInpatientAction(action)
    }

    const handleClickedMGH = (action) => {
        setIsModalOpen(true)
        setInpatientAction(action)
    }

    const handleImageView = (action, link) => {
        setIsModalOpen(true)
        setInpatientAction(action)
        setImgLink(link)
    }

    const renderContentBySlug = (action) => {
        switch(action) {
            case 'po':
                return (
                    <Soap
                        soapData={soapData}
                        soapHeaders={soapHeaders}
                        dummyData={dummyData} 
                        physiciansOrder={true}
                    />
                )
            case 'publish':
                return (
                    <div className="text-center space-y-4">
                        <label className="ml-2 text-gray-500 font-bold uppercase text-medium">Will publish order now?</label>
                        <div className="flex items-center">
                            <label className="ml-2 mb-2 mr-4 text-gray-500 font-bold uppercase text-xs">Password: </label>
                            <input type="password" placeholder="" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-full"/>
                        </div>
                    </div>
                )
            
            case 'refer':
                return (
                    <></>
                )

            case 'mgh':
                return (
                    <></>
                )
            
            case 'imgView':
                return (
                    <div className="text-center space-y-4">
                        <div
                            className="flex justify-center border p-4 overflow-auto scroll-custom"
                            onWheel={isZoomed ? handleScroll : null}
                            style={{ maxHeight }}
                        >
                            <img
                                onClick={handleImageClick}
                                ref={imgRef}
                                src={imgLink}
                                // className="w-full h-auto cursor-pointer"
                                className="w-full md:w-[50vh] sm:w-full h-[50vh] transition-transform duration-300 cursor-zoom-in"
                            />
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    

    return (
        <>
            {alertMessage &&
                <Alert 
                    alertType={alertType}
                    isOpen={alertType !== ""}
                    onClose={handleAlertClose}
                    message={alertMessage} 
                /> 
            }
            
            {/* <ModalTest
            
            moduleData={moduleData} 
            /> */}

            <Modal 
                // title={title}
                moduleData={moduleData} 
                isOpen={isModalOpen} 
                onClose={closeModal}
                onSuccess={closeModal}
                permission={permission}
                selectedRowId={openModalId}
                onSetAlertType={(data) => setAlertType(data)}
                onSetAlertMessage={(data) => setAlertMessage(data)}
            >
                {renderContentBySlug(inpatientAction)}
            </Modal>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {isLoading ? (
                    <>
                        <SkeletonScreen rowCount={tableData.length} columnCount={tableHeader.length}/> 
                    </>
                ) : (
                    <>
                        {disableTable ? (
                            <div>{children}</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        {tableHeader.map((tblHeader, tblHeaderIndex) => (
                                            <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {tblHeader}
                                            </th>
                                        ))}

                                        {action && (
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        )}
                                        
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tableData.length === 0 ? (
                                        <tr>
                                            <td colSpan={tableHeader.length + 1} className="px-6 py-4 text-center">
                                                No records found.
                                            </td>
                                        </tr>
                                    ): (
                                        tableData.map((tblBody, tblBodyIndex) => (
                                            <tr key={tblBodyIndex}>
                                                {tableHeader.map((tblHeader) => (
                                                    <td key={tblHeader} className="px-6 py-4 whitespace-nowrap">
                                                        {tblHeader === 'patient_id' ? (
                                                            // console.log(slug)
                                                            slug === 'out-patient' || slug === 'in-patient' ? (
                                                                <a href={`/patients/${slug}/${tblBody[tblHeader]}`} className="text-blue-500 hover:underline">
                                                                    {tblBody[tblHeader]}
                                                                </a>
                                                            ) : slug === 'laboratory' ? (
                                                                <a href={`/${slug}/${tblBody[tblHeader]}`} className="text-blue-500 hover:underline">
                                                                    {tblBody[tblHeader]}
                                                                </a>
                                                            ) : (
                                                                <></>
                                                            )
                                                        ) : tblHeader === 'ancillary' ? (
                                                                tblBody[tblHeader] === "None" && (
                                                                    <span className="p-2 bg-slate-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
                                                                )  
                                                        ) : tblHeader === 'laboratory_status' ? (
                                                                tblBody[tblHeader] === "Pending" ? (
                                                                    <span className="p-2 bg-red-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
                                                                ) : 

                                                                tblBody[tblHeader] === "Available" && (
                                                                    <span className="p-2 bg-green-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
                                                                )
                                                        ) : tblHeader === 'imaging_status' ? (
                                                                tblBody[tblHeader] === "Pending" ? (
                                                                    <span className="p-2 bg-red-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
                                                                ) : 

                                                                tblBody[tblHeader] === "Available" && (
                                                                    <span className="p-2 bg-green-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
                                                                )
                                                        ) : tblHeader === 'disposition' ? (
                                                                tblBody[tblHeader] === "Admission" ? (
                                                                    <span className="p-2 bg-blue-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
                                                                ) : 

                                                                tblBody[tblHeader] === "Discharged" && (
                                                                    <span className="p-2 bg-yellow-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
                                                                )
                                                        ) : tblHeader === 'physicians_order' ? (
                                                            <td className="flex items-center space-x-2">
                                                                <textarea 
                                                                    type="text" 
                                                                    name="lastName" 
                                                                    placeholder="Click for physicians order" 
                                                                    onClick={() => handleClickedPO("po")}
                                                                    className="border border-gray-300 px-3 py-2 w-[20rem] focus:border-gray-500 focus:outline-none" 
                                                                />
                                                                <button onClick={() => handleClickedPublish("publish")} className="bg-slate-100 border border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Publish</button>
                                                                <button onClick={() => handleClickedRefer("refer")} className="bg-slate-100 border border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Refer</button>
                                                                <button onClick={() => handleClickedMGH("refer")} className="bg-slate-100 border border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">MGH</button>
                                                                
                                                            </td>
                                                        ) : tblHeader === 'result_image' ? (
                                                            <a href="javascript:void(0)" onClick={() => handleImageView("imgView", tblBody?.result_image)} className="text-blue-500 hover:underline">
                                                                {tblBody?.image_type}
                                                            </a>
                                                        ) : (
                                                            tblBody[tblHeader]
                                                        )}
                                                    </td>
                                                ))}

                                                {action && (
                                                    <td>    
                                                        <button title="Add Modules" type="button" onClick={() => openModal(tblBody.user_id)} className="bg-green-500 hover:bg-green-600 rounded-full text-white px-2 py-2 focus:outline-none flex items-center space-x-2 ">
                                                            {/* <span>ADD</span> */}
                                                            <svg fill="currentColor" className="h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                                            </svg>

                                                            {/* <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg> */}
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                        
                    </>
                )}
            </div>

        </>
    )
}

export default Table