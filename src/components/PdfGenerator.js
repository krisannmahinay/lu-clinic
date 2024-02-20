import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useGeneratePdfQuery } from "@/service/pdfService"
import { usePdfContext } from "@/utils/context"
import { PDFDocument, StandardFonts } from 'pdf-lib'


const PdfGenerator = forwardRef(({ category }, ref) => {
    // console.log(pdfCategory)
    const context = usePdfContext()
    const { data: pdfBlob, isLoading, isError, error, isSuccess } = useGeneratePdfQuery({
        pdfCategory: category
    }, {enabled: !!category})
    // const { data: pdfBlob, isLoading, isError, error, isSuccess } = useGeneratePdfQuery({
    //     pdfCategory: context?.state.pdfCategory
    // }, {enabled: !!context?.state.pdfCategory})

    // useEffect(() => {
    //     if(context?.state.pdfCategory) {
    //         setCategory()
    //     }
    // }, [context?.state.pdfCategory])

    useImperativeHandle(context?.ref, () => ({
        handleGeneratePDF: (actionType) => handleGeneratePDF(actionType)
    }))

    const blobToArrayBuffer = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsArrayBuffer(blob)
        })
    }

    const handleOnClick = (data) => {
        console.log(data)
    }

    console.log(context?.data.profileData)

    const handleGeneratePDF = async (actionType) => {
        const pdfArrayBuffer = await blobToArrayBuffer(pdfBlob)
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
        const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
        
        const page = pdfDoc.getPages()
        const firstPage = page[0]
        const secondPage = page[1]
        const { height } = firstPage.getSize()
        switch(actionType) {
            case 'print-phealth-cf1':
                firstPage.drawText(context?.data.profileData.user_data_info?.last_name, {
                    x: 40,
                    // y: height - 250,
                    y: height - 485,
                    size: 12,
                    font: courierFont
                })

                firstPage.drawText(context?.data.profileData.user_data_info?.first_name, {
                    x: 155,
                    // y: height - 250,
                    y: height - 485,
                    size: 12,
                    font: courierFont
                })

                firstPage.drawText(context?.data.profileData.user_data_info?.middle_name, {
                    x: 370,
                    // y: height - 250,
                    y: height - 485,
                    size: 12,
                    font: courierFont
                })
                
                const bday = context?.data.profileData.user_data_info?.birth_date
                const parts = bday.split("-")
                firstPage.drawText(`${parts[1]}  ${parts[2]} ${parts[0]}`, {
                    x: 463,
                    // y: height - 250,
                    y: height - 485,
                    size: 13,
                    font: courierFont
                })
                break

            case 'print-phealth-cf2':
                firstPage.drawText(context?.data.profileData.user_data_info?.last_name, {
                    x: 140,
                    // y: height - 250,
                    y: height - 280,
                    size: 12,
                    font: courierFont
                })
                break

            case 'print-phealth-cf3':
                firstPage.drawText(`${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name} ${context?.data.profileData.user_data_info?.middle_name}`, {
                    x: 40,
                    // y: height - 250,
                    y: height - 217,
                    size: 12,
                    font: courierFont
                })
                break

            case 'print-phealth-cf4':
                firstPage.drawText(`${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name} ${context?.data.profileData.user_data_info?.middle_name}`, {
                    x: 80,
                    // y: height - 250,
                    y: height - 245,
                    size: 10,
                    font: courierFont
                })
                break
            
            case 'print-prescription':
                firstPage.drawText(`${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name}`, {
                    x: 120,
                    // y: height - 250,
                    y: height - 136,
                    size: 12,
                    font: courierFont
                })

                secondPage.drawText(`${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name}`, {
                    x: 120,
                    // y: height - 250,
                    y: height - 136,
                    size: 12,
                    font: courierFont
                })

                const dateNow = Date.now()
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // Array of month names
                const dateObj = new Date(dateNow);
                const monthName = months[dateObj.getMonth()];
                const day = dateObj.getDate();
                const year = dateObj.getFullYear();
                const formattedDate = `${monthName}/${day}/${year}`;
                firstPage.drawText(`${formattedDate}`, {
                    x: 465,
                    // y: height - 250,
                    y: height - 136,
                    size: 12,
                    font: courierFont
                })

                secondPage.drawText(`${formattedDate}`, {
                    x: 465,
                    // y: height - 250,
                    y: height - 136,
                    size: 12,
                    font: courierFont
                })

                let currentY = height - 350
                context?.data.medication.map((item) => {
                    const text = `${item?.medicine.brand_name}/${item.dose} Sig:${item.form}/${item.frequency}`
                    const textSize = 15 
                    const textWidth = courierFont.widthOfTextAtSize(text, textSize) // Measure text width

                    secondPage.drawText(text, {
                        x: 120,
                        // y: height - 250,
                        // y: height - 450,
                        y: currentY,
                        size: textSize,
                        font: courierFont
                    })
                    currentY -= courierFont.heightAtSize(50)
                })

                break

            default:
                break
        }
        
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
        <button onClick={() => handleGeneratePDF(category)} className={`${context?.state.isOptionEditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out`} disabled={context?.state.isOptionEditDisabled}>
        {/* <button onClick={() => context?.onClick({value: context?.data.category})} className={`${context?.state.isOptionEditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out`} disabled={context?.state.isOptionEditDisabled}> */}
            {context?.state.title}
        </button>    
    )
})

export default PdfGenerator