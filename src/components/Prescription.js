import { useState } from "react"
import { useDispatch } from "react-redux"
// import { generatePDF } from "@/utils/pdfGenerator"
import Cookies from 'js-cookie'
import { PDFDocument } from 'pdf-lib'
// import { useGeneratePdfMutation } from '@/service/pdfService'
import { useGetPrescriptionPdfQuery } from '@/service/pdfService'

const Prescription = () => {
    const dispatch = useDispatch()
    const session = Cookies.get('session')
    // const [generatePdf, { isSuccess, data, isError, error }] = useGeneratePdfMutation()
    const { data: pdfBlob, isLoading, isError, error, isSuccess } = useGetPrescriptionPdfQuery()
    const [headerText, setHeaderText] = useState('Clinic Name');
    const [footerText, setFooterText] = useState('Clinic Address & Contact');
    
    const [name, setName] = useState("John Jercai Cortejo")
    const [ageGender, setAgeGender] = useState("27, MALE")
    const [date, setDate] = useState("13 Aug 2023")

    const [bodyContent, setBodyContent] = useState("")


    // console.log(pdfBlob)
    // const pdfFileLink = data?.pdfUrl ?? []

    const blobToArrayBuffer = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsArrayBuffer(blob)
        });
    };

    

    const handleGeneratePDF = async () => {
        const pdfArrayBuffer = await blobToArrayBuffer(pdfBlob)
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
        
        const page = pdfDoc.getPages()
        const firstPage = page[0]
        const { height } = firstPage.getSize()
        firstPage.drawText(name, {
            x: 200,
            // y: height - 250,
            y: height / 2 + 265,
            size: 12,
        })

        firstPage.drawText(ageGender, {
            x: 200,
            // y: height - 250,
            y: height / 2 + 240,
            size: 12,
        })

        firstPage.drawText(date, {
            x: 455,
            // y: height - 250,
            y: height / 2 + 265,
            size: 12,
        })

        
        const pdfBytes = await pdfDoc.save();
        // Do something with the generated PDF bytes, e.g. download
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.target = '_blank'
        // link.download = 'generated_prescription.pdf'
        link.click()
        
        
    }

    return (
        <div>
             {/* <div className="bg-blue-200 p-5 mb-10">
                <img src="/path-to-your-logo.png" alt="Clinic Logo" className="w-24 h-24 mx-auto mb-4"/>
                <h1 className="text-center font-bold text-2xl mb-2">{data.headerText}</h1>
            </div>
            
            <textarea 
                placeholder="Prescription Content" 
                className="w-full p-2 mb-4"
                rows="10"
                value={bodyContent} 
                onChange={(e) => setBodyContent(e.target.value)} 
            />

            <div className="bg-blue-300 p-5 mt-10">
                <h2 className="text-center font-bold">Footer Information</h2>
                <input 
                    placeholder="Header Text (Clinic Name)" 
                    className="w-full p-2 mb-2"
                    value={headerText} 
                    onChange={(e) => setHeaderText(e.target.value)} 
                />
                <input 
                    placeholder="Footer Text (Location;Contact Number)" 
                    className="w-full p-2"
                    value={footerText} 
                    onChange={(e) => setFooterText(e.target.value)} 
                />
            </div> */}

            <button 
                className="bg-blue-500 text-white p-2 mt-10 rounded"
                onClick={handleGeneratePDF}>
                Generate PDF
            </button>
        </div>
    )
}

export default Prescription