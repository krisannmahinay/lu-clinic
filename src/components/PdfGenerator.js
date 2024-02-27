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

        function removeNonAnsiChars(text) {
            return text.replace(/[^\x20-\x7E]/g, '') // Filter out non-ANSI
        }

        function drawWrappedText(text, maxWidth, font, fontSize) {
            const words = text.split(" ")
            const lines = []
            let currentLine = ""
        
            for (const word of words) {
                const potentialLine = currentLine + " " + word
                const filteredLine = removeNonAnsiChars(potentialLine)
                const width = font.widthOfTextAtSize(filteredLine, fontSize)
        
                if (width > maxWidth) {
                    lines.push(currentLine)
                    currentLine = word
                } else {
                    currentLine = potentialLine
                }
            }
        
            // Add the last line
            if (currentLine) { 
                lines.push(currentLine)
            }
        
            return lines
        }

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

                const chiefComplainCf3 = context?.data.profileData.cr_chief_complain ?? ''
                const wrappedChiefComplainCf3 = drawWrappedText(chiefComplainCf3, 140, courierFont, 10)

                let currentChiefComplainCf3 = height - 217
                const lineSpacingChiefComplainCf3 = 11 // Adjust as needed

                for (const line of wrappedChiefComplainCf3) {
                    firstPage.drawText(line, { 
                        x: 435, 
                        y: currentChiefComplainCf3, 
                        size: 9, 
                        font: courierFont 
                    });
                    currentChiefComplainCf3 -= lineSpacingChiefComplainCf3
                }

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

                const historyPresentIllCf3 = context?.data.profileData.cr_history_present_ill ?? ''
                const wrappedHistoryPresentIllCf3 = drawWrappedText(historyPresentIllCf3, 489, courierFont, 10)

                let currentHistoryPresentIllCf3 = height - 334
                const lineSpacingHistoryPresentIllCf3 = 12 // Adjust as needed

                for (const line of wrappedHistoryPresentIllCf3) {
                    firstPage.drawText(line, { 
                        x: 50, 
                        y: currentHistoryPresentIllCf3, 
                        size: 10, 
                        font: courierFont 
                    });
                    currentHistoryPresentIllCf3 -= lineSpacingHistoryPresentIllCf3
                }

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

                firstPage.drawText(chest_lungs.includes('chesn') ? 'Essential Normal,' : '',  { x: 98, y: height - 554, size: 6, font: courierFont})
                firstPage.drawText(chest_lungs.includes('lochesb') ? 'Lumps over chest/breast,' : '',  { x: 165, y: height - 554, size: 6, font: courierFont})
                firstPage.drawText(chest_lungs.includes('asymchex') ? 'Asymmetrical chest expansion,' : '',  { x: 98, y: height - 562, size: 6, font: courierFont})
                firstPage.drawText(chest_lungs.includes('rr') ? 'Rales/Ronchi,' : '',  { x: 208, y: height - 562, size: 6, font: courierFont})
                firstPage.drawText(chest_lungs.includes('decbs') ? 'Decreased breath sounds' : '',  { x: 258, y: height - 562, size: 6, font: courierFont})
                firstPage.drawText(chest_lungs.includes('intrclavr') ? 'Intercostal retractions/clavicular retractions,' : '',  { x: 98, y: height - 570, size: 6, font: courierFont})
                firstPage.drawText(chest_lungs.includes('whiz') ? 'Wheezes,' : '',  { x: 274, y: height - 570, size: 6, font: courierFont})

                firstPage.drawText(cvs.includes('cvesn') ? 'Essential Normal,' : '',  { x: 98, y: height - 585, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('dabeat') ? 'Displaced apex beat,' : '',  { x: 165, y: height - 585, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('hthrills') ? 'Heaves/thrills,' : '',  { x: 242, y: height - 585, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('pbulge') ? 'Pericardial bulge,' : '',  { x: 98, y: height - 593, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('decmob') ? 'Decreased mobility,' : '',  { x: 165, y: height - 593, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('pnbeds') ? 'Pale nail beds,' : '',  { x: 238, y: height - 593, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('pskint') ? 'Poor Skin turgor,' : '',  { x: 98, y: height - 602, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('rashpet') ? 'Rashes/petechiae,' : '',  { x: 165, y: height - 602, size: 6, font: courierFont})
                firstPage.drawText(cvs.includes('weakp') ? 'Weak pulses,' : '',  { x: 230, y: height - 602, size: 6, font: courierFont})
                

                break

            case 'print-phealth-cf4':
                firstPage.drawText(`${context?.data.profileData.user_data_info?.last_name},         ${context?.data.profileData.user_data_info?.first_name}        ${context?.data.profileData.user_data_info?.middle_name}`, {
                    x: 50,
                    // y: height - 250,
                    y: height - 245,
                    size: 10,
                    font: courierFont
                })

                const chiefComplainCf4 = context?.data.profileData.cr_chief_complain ?? ''
                const wrappedChiefComplainCf4 = drawWrappedText(chiefComplainCf4, 415, courierFont, 10)

                let currentChiefComplainCf4 = height - 278
                const lineSpacingChiefComplainCf4 = 8 // Adjust as needed

                for (const line of wrappedChiefComplainCf4) {
                    firstPage.drawText(line, { 
                        x: 50, 
                        y: currentChiefComplainCf4, 
                        size: 9, 
                        font: courierFont 
                    });
                    currentChiefComplainCf4 -= lineSpacingChiefComplainCf4
                }

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

                const admissionDiagnosisText = context?.data.profileData.admission_diagnosis ?? ''
                const wrappedAdmissionDianosis = drawWrappedText(admissionDiagnosisText, 245, courierFont, 10)

                let currentAdmissionDiagnosis = height - 307
                const lineSpacingAdmissionDiagnosis = 8 // Adjust as needed

                for (const line of wrappedAdmissionDianosis) {
                    firstPage.drawText(line, { 
                        x: 50, 
                        y: currentAdmissionDiagnosis, 
                        size: 6, 
                        font: courierFont 
                    });
                    currentAdmissionDiagnosis -= lineSpacingAdmissionDiagnosis
                }

                const historyPresentIllText = context?.data.profileData.cr_history_present_ill ?? ''
                const wrappedHistoryPresentIll = drawWrappedText(historyPresentIllText, 489, courierFont, 10)

                let currentHistoryPresentIll = height - 410
                const lineSpacingHistoryPresentIll = 12 // Adjust as needed

                for (const line of wrappedHistoryPresentIll) {
                    firstPage.drawText(line, { 
                        x: 50, 
                        y: currentHistoryPresentIll, 
                        size: 10, 
                        font: courierFont 
                    });
                    currentHistoryPresentIll -= lineSpacingHistoryPresentIll
                }

                const historyPastMedicalHistory = context?.data.profileData.cr_past_med_history ?? ''
                const wrappedPastMedicalHistory = drawWrappedText(historyPastMedicalHistory, 489, courierFont, 10)

                let currentPastMedicalHistory = height - 506
                const lineSpacingPastMedicalHistory = 12 // Adjust as needed

                for (const line of wrappedPastMedicalHistory) {
                    firstPage.drawText(line, { 
                        x: 50, 
                        y: currentPastMedicalHistory, 
                        size: 10, 
                        font: courierFont 
                    });
                    currentPastMedicalHistory -= lineSpacingPastMedicalHistory
                }

                const admissionDateCf4 = new Date(context?.data.profileData.admission_date)
                const formattedDateTimeCf4 = admissionDateCf4.toLocaleString('en-US', {
                    month: '2-digit', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit', // 12-hour format
                    minute: '2-digit', 
                    hour12: false  // Ensures AM/PM is included
                })
                
                const [formattedAdmissionDateCf4, formattedAdmissionTimeCf4] = formattedDateTimeCf4.split(' ')
                const [hourCf4, minuteCf4] = formattedAdmissionTimeCf4.split(':')
                const [mmCf4, ddCf4, yyyyCf4] = formattedAdmissionDateCf4.split('/')
                const timePeriodCf4 = hourCf4 >= 12 ? 'PM' : 'AM'

                firstPage.drawText(`${mmCf4.split('').join(' ') ?? ''}`, {x: 124, y: height - 347, size: 10, font: courierFont})
                firstPage.drawText(`${ddCf4.split('').join(' ') ?? ''}`, {x: 154, y: height - 347, size: 10, font: courierFont})
                firstPage.drawText(`${yyyyCf4.split('').join(' ') ?? ''}`, {x: 187, y: height - 347, size: 10, font: courierFont})
                firstPage.drawText(`${timePeriodCf4 === 'AM' ? formattedAdmissionTimeCf4.split('').join(' ') : ''}`, {x: 399, y: height - 347, size: 8, font: courierFont})
                firstPage.drawText(`${timePeriodCf4 === 'PM' ? formattedAdmissionTimeCf4.split('').join(' ') : ''}`, {x: 399, y: height - 347, size: 8, font: courierFont})


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

                
                secondPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 45,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 46,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 47,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 48,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 49,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'improved' ? 'H' : ''}`,  { x: 50,  y: height - 820, size: 12})

                secondPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 153,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 154,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 155,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 156,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 157,  y: height - 820, size: 12})
                secondPage.drawText(`${context?.data.profileData.disposition === 'hama' ? 'H' : ''}`,  { x: 158,  y: height - 820, size: 12})

                // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 153,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 154,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 155,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 156,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 157,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'u48h' ? 'H' : ''}`,  { x: 158,  y: height - 820, size: 12})

                // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 120,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 98,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 99,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 100,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 101,  y: height - 820, size: 12})
                // secondPage.drawText(`${context?.data.profileData.disposition === 'transferred' ? 'H' : ''}`,  { x: 102,  y: height - 820, size: 12})

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
                    // const textWidth = courierFont.widthOfTextAtSize(text, textSize) // Measure text width

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