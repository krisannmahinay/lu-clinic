import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useGeneratePdfQuery } from "@/service/pdfService"
import { usePdfContext } from "@/utils/context"
import { PDFDocument, StandardFonts, fontkit } from 'pdf-lib'


const PdfGenerator = forwardRef(({ category }, ref) => {
    const [pdfLink, setPdfLink] = useState(null)
    const context = usePdfContext()
    const cr_heent = context?.data.profileData?.cr_heent?.split(',') || []
    const cr_chest_lungs = context?.data.profileData?.cr_chest_lungs?.split(',') || []
    const cr_cvs = context?.data.profileData?.cr_cvs?.split(',') || []
    const cr_neurological_exam = context?.data.profileData?.cr_neurological_exam?.split(',') || []

    console.log(cr_heent)

    const { data: pdfBlob, isLoading, isError, error, isSuccess } = useGeneratePdfQuery({
        pdfCategory: pdfLink
    }, {enabled: !!pdfLink})

    useEffect(() => {
        setPdfLink(category)
    }, [category])

    useImperativeHandle(context?.ref, () => ({
        handleGeneratePDF: (data) => handleGeneratePDF(data)
    }))

    const blobToArrayBuffer = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsArrayBuffer(blob)
        })
    }

    // const formatAMPM = (date) => {
    //     const hours = date.getHours()
    //     const minutes = date.getMinutes()
    //     const ampm = hours >= 12 ? 'pm' : 'am'
    //     hours = hours % 12
    //     hours = hours ? hours : 12 // the hour '0' should be '12'
    //     minutes = minutes < 10 ? '0'+minutes : minutes
    //     const strTime = hours + ':' + minutes + ' ' + ampm
    //     return strTime
    // }

    const handleGeneratePDF = async (data) => {
        // setPdfLink(data.type)
        const pdfArrayBuffer = await blobToArrayBuffer(pdfBlob)
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
        const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
        
        const page = pdfDoc.getPages()
        const firstPage = page[0]
        const secondPage = page[1]
        const { height } = firstPage.getSize()
        const heent = cr_heent.map(item => item.replace(/^"|"$/g, ''))
        const chest_lungs = cr_chest_lungs.map(item => item.replace(/^"|"$/g, ''))
        const cvs = cr_cvs.map(item => item.replace(/^"|"$/g, ''))
        const neurological_exam = cr_neurological_exam.map(item => item.replace(/^"|"$/g, ''))
        switch(data.type) {
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
                firstPage.drawText(`${context?.data.profileData.user_data_info?.last_name}         ${context?.data.profileData.user_data_info?.first_name}                   ${context?.data.profileData.user_data_info?.last_name}`,  {
                    x: 140,
                    // y: height - 250,
                    y: height - 280,
                    size: 12,
                    font: courierFont
                })

                firstPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 37, y: height - 418, size: 12 })
                firstPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 36,  y: height - 418, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 35, y: height - 418, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 34, y: height - 418, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 33, y: height - 418, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 32,  y: height - 418, size: 12})

                firstPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 37, y: height - 448, size: 12 })
                firstPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 36,  y: height - 448, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 35, y: height - 448, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 34, y: height - 448, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 33, y: height - 448, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 32,  y: height - 448, size: 12})

                firstPage.drawText(`${context?.data.profileData.disposition === 'absconded' ? 'H' : ''}`,  { x: 37, y: height - 463, size: 12 })
                firstPage.drawText(`${context?.data.profileData.disposition === 'absconded' ? 'H' : ''}`,  { x: 36,  y: height - 463, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'absconded' ? 'H' : ''}`,  { x: 35, y: height - 463, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'absconded' ? 'H' : ''}`,  { x: 34, y: height - 463, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'absconded' ? 'H' : ''}`,  { x: 33, y: height - 463, size: 12})
                firstPage.drawText(`${context?.data.profileData.disposition === 'absconded' ? 'H' : ''}`,  { x: 32,  y: height - 463, size: 12})
                break

            case 'print-phealth-cf3':
                firstPage.drawText(`${context?.data.profileData.user_data_info?.last_name}, ${context?.data.profileData.user_data_info?.first_name} ${context?.data.profileData.user_data_info?.middle_name}`, {
                    x: 40,
                    // y: height - 250,
                    y: height - 217,
                    size: 12,
                    font: courierFont
                })

                const admissionDate = new Date(context?.data.profileData.admission_date)
                const formattedDateTime = admissionDate.toLocaleString('en-US', {
                    month: '2-digit', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit', // 12-hour format
                    minute: '2-digit', 
                    hour12: false  // Ensures AM/PM is included
                })
                
                const [formattedAdmissionDate, formattedAdmissionTime] = formattedDateTime.split(' ')
                const [hour, minute] = formattedAdmissionTime.split(':')
                const [mm, dd, yyyy] = formattedAdmissionDate.split('/')
                const timePeriod = hour >= 12 ? 'PM' : 'AM'
                
                firstPage.drawText(`${mm.split('').join(' ') ?? ''}`, {x: 106, y: height - 252, size: 10, font: courierFont})
                firstPage.drawText(`${dd.split('').join(' ') ?? ''}`, {x: 145, y: height - 252, size: 10, font: courierFont})
                firstPage.drawText(`${yyyy.split('').join(' ') ?? ''}`, {x: 185, y: height - 252, size: 10, font: courierFont})
                firstPage.drawText(`${timePeriod === 'AM' ? formattedAdmissionTime : ''}`, {x: 311, y: height - 252, size: 8, font: courierFont})
                firstPage.drawText(`${timePeriod === 'PM' ? formattedAdmissionTime : ''}`, {x: 362, y: height - 252, size: 8, font: courierFont})

                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'Awake and Alert' : 'Altered Sensorium'  ?? ''}`, {x: 106, y: height - 485, size: 10, font: courierFont})
                firstPage.drawText(`${context?.data.profileData.vital_bp ?? ''}`, {x: 115, y: height - 508, size: 9, font: courierFont})
                firstPage.drawText(`${context?.data.profileData.vital_temp ?? ''}`, {x: 320, y: height - 508, size: 9, font: courierFont})
                // abpr cervl dmm ics pconj sunke sunkf


                firstPage.drawText(heent.includes('hesn') ? 'Essential Normal,' : '',  { x: 98, y: height - 525, size: 6, font: courierFont})
                firstPage.drawText(heent.includes('abpr') ? 'Abnormal Pupillary Reaction' : '',  { x: 165, y: height - 525, size: 6, font: courierFont})
                firstPage.drawText(heent.includes('cervl') ? 'Cervical Lymphadenopathy,' : '',  { x: 98, y: height - 533, size: 6, font: courierFont})
                firstPage.drawText(heent.includes('dmm') ? 'Dry Mucuos Membrane,' : '',  { x: 190, y: height - 533, size: 6, font: courierFont})
                firstPage.drawText(heent.includes('ics') ? 'Icteric Sclerae' : '',  { x: 265, y: height - 533, size: 6, font: courierFont})
                firstPage.drawText(heent.includes('pconj') ? 'Pale Conjunctiva,' : '',  { x: 98, y: height - 542, size: 6, font: courierFont})
                firstPage.drawText(heent.includes('sunke') ? 'Sunken Eyeball,' : '',  { x: 165, y: height - 542, size: 6, font: courierFont})
                firstPage.drawText(heent.includes('sunkf') ? 'Sunken Fontanelle' : '',  { x: 225, y: height - 542, size: 6, font: courierFont})
                

                break

            case 'print-phealth-cf4':
                firstPage.drawText(`${context?.data.profileData.user_data_info?.last_name},         ${context?.data.profileData.user_data_info?.first_name}        ${context?.data.profileData.user_data_info?.middle_name}`, {
                    x: 50,
                    // y: height - 250,
                    y: height - 245,
                    size: 10,
                    font: courierFont
                })

                firstPage.drawText(context?.data.profileData.cr_chief_complain ?? '', {
                    x: 50,
                    // y: height - 250,
                    y: height - 285,
                    size: 10,
                    font: courierFont
                })

                // console.log(context?.data.profileData.user_data_info?.age)
                firstPage.drawText(context?.data.profileData.user_data_info?.age.toString() ?? '',  { x: 451, y: height - 265, size: 10})

                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'male' ? 'H' : ''}`,  { x: 451, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'male' ? 'H' : ''}`,  { x: 452,  y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'male' ? 'H' : ''}`,  { x: 453, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'male' ? 'H' : ''}`,  { x: 454, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'male' ? 'H' : ''}`,  { x: 455, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'male' ? 'H' : ''}`,  { x: 456,  y: height - 283, size: 12})

                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'female' ? 'H' : ''}`,  { x: 483, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'female' ? 'H' : ''}`,  { x: 484,  y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'female' ? 'H' : ''}`,  { x: 485, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'female' ? 'H' : ''}`,  { x: 486, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'female' ? 'H' : ''}`,  { x: 487, y: height - 283, size: 12})
                firstPage.drawText(`${context?.data.profileData.user_data_info?.gender === 'female' ? 'H' : ''}`,  { x: 488,  y: height - 283, size: 12})

                firstPage.drawText(`${context?.data.profileData.admission_diagnosis ?? ''}`, {
                    x: 50,
                    // y: height - 250,
                    y: height - 315,
                    size: 8,
                    font: courierFont
                })

                firstPage.drawText(context?.data.profileData.cr_history_present_ill ?? '', {
                    x: 50,
                    // y: height - 250,
                    y: height - 410,
                    size: 10,
                    font: courierFont
                })

                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,  { x: 120, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,  { x: 121,  y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,  { x: 122, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,  { x: 123, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,  { x: 124, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'awake_alert' ? 'H' : ''}`,  { x: 125,  y: height - 813, size: 12})

                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,  { x: 218, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,  { x: 219,  y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,  { x: 220, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,  { x: 221, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,  { x: 222, y: height - 813, size: 12})
                firstPage.drawText(`${context?.data.profileData.cr_general_survey === 'altered_sensorium' ? 'H' : ''}`,  { x: 223,  y: height - 813, size: 12})

                firstPage.drawText(`${context?.data.profileData.vital_height ?? ''}`,  { x: 465, y: height - 800, size: 10})
                firstPage.drawText(`${context?.data.profileData.vital_weight ?? ''}`,  { x: 465, y: height - 815, size: 10})
                firstPage.drawText(`${context?.data.profileData.vital_bp ?? ''}`,  { x: 150, y: height - 840, size: 10})
                firstPage.drawText(`${context?.data.profileData.vital_hr ?? ''}`,  { x: 250, y: height - 840, size: 10})
                firstPage.drawText(`${context?.data.profileData.vital_temp ?? ''}`,  { x: 450, y: height - 840, size: 10})
                
                firstPage.drawText(heent.includes('hesn') ? 'H' : '',  { x: 120, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('hesn') ? 'H' : '',  { x: 121, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('hesn') ? 'H' : '',  { x: 122, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('hesn') ? 'H' : '',  { x: 123, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('hesn') ? 'H' : '',  { x: 124, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('hesn') ? 'H' : '',  { x: 125, y: height - 859, size: 12})

                firstPage.drawText(heent.includes('abpr') ? 'H' : '',  { x: 219, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('abpr') ? 'H' : '',  { x: 220, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('abpr') ? 'H' : '',  { x: 221, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('abpr') ? 'H' : '',  { x: 222, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('abpr') ? 'H' : '',  { x: 223, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('abpr') ? 'H' : '',  { x: 224, y: height - 859, size: 12})

                firstPage.drawText(heent.includes('cervl') ? 'H' : '',  { x: 326, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('cervl') ? 'H' : '',  { x: 327, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('cervl') ? 'H' : '',  { x: 328, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('cervl') ? 'H' : '',  { x: 329, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('cervl') ? 'H' : '',  { x: 330, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('cervl') ? 'H' : '',  { x: 331, y: height - 859, size: 12})

                firstPage.drawText(heent.includes('dmm') ? 'H' : '',  { x: 426, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('dmm') ? 'H' : '',  { x: 427, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('dmm') ? 'H' : '',  { x: 428, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('dmm') ? 'H' : '',  { x: 429, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('dmm') ? 'H' : '',  { x: 430, y: height - 859, size: 12})
                firstPage.drawText(heent.includes('dmm') ? 'H' : '',  { x: 431, y: height - 859, size: 12})

                firstPage.drawText(heent.includes('ics') ? 'H' : '',  { x: 120, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('ics') ? 'H' : '',  { x: 121, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('ics') ? 'H' : '',  { x: 122, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('ics') ? 'H' : '',  { x: 123, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('ics') ? 'H' : '',  { x: 124, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('ics') ? 'H' : '',  { x: 125, y: height - 873, size: 12})

                firstPage.drawText(heent.includes('pconj') ? 'H' : '',  { x: 219, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('pconj') ? 'H' : '',  { x: 220, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('pconj') ? 'H' : '',  { x: 221, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('pconj') ? 'H' : '',  { x: 222, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('pconj') ? 'H' : '',  { x: 223, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('pconj') ? 'H' : '',  { x: 224, y: height - 873, size: 12})

                firstPage.drawText(heent.includes('sunke') ? 'H' : '',  { x: 326, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunke') ? 'H' : '',  { x: 327, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunke') ? 'H' : '',  { x: 328, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunke') ? 'H' : '',  { x: 329, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunke') ? 'H' : '',  { x: 330, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunke') ? 'H' : '',  { x: 331, y: height - 873, size: 12})

                firstPage.drawText(heent.includes('sunkf') ? 'H' : '',  { x: 426, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunkf') ? 'H' : '',  { x: 427, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunkf') ? 'H' : '',  { x: 428, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunkf') ? 'H' : '',  { x: 429, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunkf') ? 'H' : '',  { x: 430, y: height - 873, size: 12})
                firstPage.drawText(heent.includes('sunkf') ? 'H' : '',  { x: 431, y: height - 873, size: 12})

                secondPage.drawText(chest_lungs.includes('chesn') ? 'H' : '',  { x: 120, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('chesn') ? 'H' : '',  { x: 121, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('chesn') ? 'H' : '',  { x: 122, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('chesn') ? 'H' : '',  { x: 123, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('chesn') ? 'H' : '',  { x: 124, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('chesn') ? 'H' : '',  { x: 125, y: height - 92, size: 12})

                secondPage.drawText(chest_lungs.includes('asymchex') ? 'H' : '',  { x: 219, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('asymchex') ? 'H' : '',  { x: 220, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('asymchex') ? 'H' : '',  { x: 221, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('asymchex') ? 'H' : '',  { x: 222, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('asymchex') ? 'H' : '',  { x: 223, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('asymchex') ? 'H' : '',  { x: 224, y: height - 92, size: 12})

                secondPage.drawText(chest_lungs.includes('decbs') ? 'H' : '',  { x: 327, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('decbs') ? 'H' : '',  { x: 328, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('decbs') ? 'H' : '',  { x: 329, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('decbs') ? 'H' : '',  { x: 330, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('decbs') ? 'H' : '',  { x: 331, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('decbs') ? 'H' : '',  { x: 332, y: height - 92, size: 12})

                secondPage.drawText(chest_lungs.includes('whiz') ? 'H' : '',  { x: 427, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('whiz') ? 'H' : '',  { x: 428, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('whiz') ? 'H' : '',  { x: 429, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('whiz') ? 'H' : '',  { x: 430, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('whiz') ? 'H' : '',  { x: 431, y: height - 92, size: 12})
                secondPage.drawText(chest_lungs.includes('whiz') ? 'H' : '',  { x: 432, y: height - 92, size: 12})

                secondPage.drawText(chest_lungs.includes('lochesb') ? 'H' : '',  { x: 120, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('lochesb') ? 'H' : '',  { x: 121, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('lochesb') ? 'H' : '',  { x: 122, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('lochesb') ? 'H' : '',  { x: 123, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('lochesb') ? 'H' : '',  { x: 124, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('lochesb') ? 'H' : '',  { x: 125, y: height - 107, size: 12})

                secondPage.drawText(chest_lungs.includes('rr') ? 'H' : '',  { x: 219, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('rr') ? 'H' : '',  { x: 220, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('rr') ? 'H' : '',  { x: 221, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('rr') ? 'H' : '',  { x: 222, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('rr') ? 'H' : '',  { x: 223, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('rr') ? 'H' : '',  { x: 224, y: height - 107, size: 12})

                secondPage.drawText(chest_lungs.includes('intrclavr') ? 'H' : '',  { x: 327, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('intrclavr') ? 'H' : '',  { x: 328, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('intrclavr') ? 'H' : '',  { x: 329, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('intrclavr') ? 'H' : '',  { x: 330, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('intrclavr') ? 'H' : '',  { x: 331, y: height - 107, size: 12})
                secondPage.drawText(chest_lungs.includes('intrclavr') ? 'H' : '',  { x: 332, y: height - 107, size: 12})

                secondPage.drawText(cvs.includes('cvesn') ? 'H' : '',  { x: 120, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('cvesn') ? 'H' : '',  { x: 121, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('cvesn') ? 'H' : '',  { x: 122, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('cvesn') ? 'H' : '',  { x: 123, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('cvesn') ? 'H' : '',  { x: 124, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('cvesn') ? 'H' : '',  { x: 125, y: height - 138, size: 12})

                secondPage.drawText(cvs.includes('dabeat') ? 'H' : '',  { x: 219, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('dabeat') ? 'H' : '',  { x: 220, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('dabeat') ? 'H' : '',  { x: 221, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('dabeat') ? 'H' : '',  { x: 222, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('dabeat') ? 'H' : '',  { x: 223, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('dabeat') ? 'H' : '',  { x: 224, y: height - 138, size: 12})

                secondPage.drawText(cvs.includes('hthrills') ? 'H' : '',  { x: 327, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('hthrills') ? 'H' : '',  { x: 328, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('hthrills') ? 'H' : '',  { x: 329, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('hthrills') ? 'H' : '',  { x: 330, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('hthrills') ? 'H' : '',  { x: 331, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('hthrills') ? 'H' : '',  { x: 332, y: height - 138, size: 12})

                secondPage.drawText(cvs.includes('pbulge') ? 'H' : '',  { x: 427, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('pbulge') ? 'H' : '',  { x: 428, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('pbulge') ? 'H' : '',  { x: 429, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('pbulge') ? 'H' : '',  { x: 430, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('pbulge') ? 'H' : '',  { x: 431, y: height - 138, size: 12})
                secondPage.drawText(cvs.includes('pbulge') ? 'H' : '',  { x: 432, y: height - 138, size: 12})

                secondPage.drawText(neurological_exam.includes('neoesn') ? 'H' : '',  { x: 120, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('neoesn') ? 'H' : '',  { x: 121, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('neoesn') ? 'H' : '',  { x: 122, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('neoesn') ? 'H' : '',  { x: 123, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('neoesn') ? 'H' : '',  { x: 124, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('neoesn') ? 'H' : '',  { x: 125, y: height - 323, size: 12})

                secondPage.drawText(neurological_exam.includes('abgait') ? 'H' : '',  { x: 219, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abgait') ? 'H' : '',  { x: 220, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abgait') ? 'H' : '',  { x: 221, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abgait') ? 'H' : '',  { x: 222, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abgait') ? 'H' : '',  { x: 223, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abgait') ? 'H' : '',  { x: 224, y: height - 323, size: 12})

                secondPage.drawText(neurological_exam.includes('abposens') ? 'H' : '',  { x: 327, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abposens') ? 'H' : '',  { x: 328, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abposens') ? 'H' : '',  { x: 329, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abposens') ? 'H' : '',  { x: 330, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abposens') ? 'H' : '',  { x: 331, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abposens') ? 'H' : '',  { x: 332, y: height - 323, size: 12})

                secondPage.drawText(neurological_exam.includes('abdecsens') ? 'H' : '',  { x: 427, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abdecsens') ? 'H' : '',  { x: 428, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abdecsens') ? 'H' : '',  { x: 429, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abdecsens') ? 'H' : '',  { x: 430, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abdecsens') ? 'H' : '',  { x: 431, y: height - 323, size: 12})
                secondPage.drawText(neurological_exam.includes('abdecsens') ? 'H' : '',  { x: 432, y: height - 323, size: 12})

                secondPage.drawText(neurological_exam.includes('abreflex') ? 'H' : '',  { x: 120, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('abreflex') ? 'H' : '',  { x: 121, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('abreflex') ? 'H' : '',  { x: 122, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('abreflex') ? 'H' : '',  { x: 123, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('abreflex') ? 'H' : '',  { x: 124, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('abreflex') ? 'H' : '',  { x: 125, y: height - 338, size: 12})

                secondPage.drawText(neurological_exam.includes('poormem') ? 'H' : '',  { x: 219, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormem') ? 'H' : '',  { x: 220, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormem') ? 'H' : '',  { x: 221, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormem') ? 'H' : '',  { x: 222, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormem') ? 'H' : '',  { x: 223, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormem') ? 'H' : '',  { x: 224, y: height - 338, size: 12})

                secondPage.drawText(neurological_exam.includes('poormustren') ? 'H' : '',  { x: 327, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormustren') ? 'H' : '',  { x: 328, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormustren') ? 'H' : '',  { x: 329, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormustren') ? 'H' : '',  { x: 330, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormustren') ? 'H' : '',  { x: 331, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poormustren') ? 'H' : '',  { x: 332, y: height - 338, size: 12})

                secondPage.drawText(neurological_exam.includes('poorcond') ? 'H' : '',  { x: 427, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poorcond') ? 'H' : '',  { x: 428, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poorcond') ? 'H' : '',  { x: 429, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poorcond') ? 'H' : '',  { x: 430, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poorcond') ? 'H' : '',  { x: 431, y: height - 338, size: 12})
                secondPage.drawText(neurological_exam.includes('poorcond') ? 'H' : '',  { x: 432, y: height - 338, size: 12})

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
        <button onClick={() => {
            setPdfLink(category)
            handleGeneratePDF({type: category})
        }} className={`${context?.state.isOptionEditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out`} disabled={context?.state.isOptionEditDisabled}>
            {context?.state.title}
        </button>    
    )
})

export default PdfGenerator