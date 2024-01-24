import { forwardRef, useImperativeHandle } from "react"
import { useGeneratePdfQuery } from "@/service/pdfService"
import { usePdfContext } from "@/utils/context"
import { PDFDocument, StandardFonts } from 'pdf-lib'


const PdfGenerator = forwardRef(({ }, ref) => {
    const context = usePdfContext()
    const { data: pdfBlob, isLoading, isError, error, isSuccess } = useGeneratePdfQuery({
        pdfCategory: context?.state.pdfCategory
    }, {enabled: !!context?.state.pdfCategory})
    // const { data: pdfBlob, isLoading, isError, error, isSuccess } = useGeneratePdfQuery({
    //     pdfCategory: context?.state.pdfCategory
    // }, {enabled: !!context?.state.pdfCategory})

    useImperativeHandle(context?.ref, () => ({
        handleGeneratePDF: (actionType) => handleGeneratePDF(actionType)
    }));

    const blobToArrayBuffer = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsArrayBuffer(blob)
        })
    }

    console.log(context?.data)

    const handleGeneratePDF = async (actionType) => {
        const pdfArrayBuffer = await blobToArrayBuffer(pdfBlob)
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
        const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
        
        const page = pdfDoc.getPages()
        switch(actionType) {
            case 'print-phealth-cf1':
                const firstPage = page[0]
                console.log(firstPage.getSize())
                const { height } = firstPage.getSize()
                firstPage.drawText(context?.data.user_data_info?.last_name, {
                    x: 40,
                    // y: height - 250,
                    y: height - 485,
                    size: 12,
                    font: courierFont
                })

                firstPage.drawText(context?.data.user_data_info?.first_name, {
                    x: 155,
                    // y: height - 250,
                    y: height - 485,
                    size: 12,
                    font: courierFont
                })

                firstPage.drawText(context?.data.user_data_info?.middle_name, {
                    x: 370,
                    // y: height - 250,
                    y: height - 485,
                    size: 12,
                    font: courierFont
                })
                
                const bday = context?.data.user_data_info?.birth_date
                const parts = bday.split("-")
                firstPage.drawText(`${parts[1]}  ${parts[2]}    ${parts[0]}`, {
                    x: 463,
                    // y: height - 250,
                    y: height - 485,
                    size: 12,
                    font: courierFont
                })
                break
            default:
                break
        }
        
        // const firstPage = page[0]
        // const { height } = firstPage.getSize()
        // firstPage.drawText(name, {
        //     x: 200,
        //     // y: height - 250,
        //     y: height / 2 + 265,
        //     size: 12,
        // })

        // firstPage.drawText(ageGender, {
        //     x: 200,
        //     // y: height - 250,
        //     y: height / 2 + 240,
        //     size: 12,
        // })

        // firstPage.drawText(date, {
        //     x: 455,
        //     // y: height - 250,
        //     y: height / 2 + 265,
        //     size: 12,
        // })

        
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
        <button onClick={() => context?.onClick()} className="w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
            {context?.state.title}
        </button>    
    )
})

export default PdfGenerator