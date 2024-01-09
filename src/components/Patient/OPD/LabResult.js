
import Table from "@/components/Table"

const labResults = [
    {
        test_name: "Hemoglobin",
        result: 12,
        normal_range: "11.0 - 16.0",
        unit: "g/dL",
        date_examination: "06 Aug 2023 09:00AM"
    },
    
    {
        test_name: "RBC",
        result: "3.3",
        normal_range: "3.5-5.50",
        unit: "10^6/uL",
        date_examination: "06 Aug 2023 09:00AM"
    }
]

const LabResult = ({slug}) => {
    return (
        <Table 
            title="Patient List" 
            action={false}
            slug={slug}
            tableHeader={Object.keys(labResults[0])}
            tableData={labResults} 
        />
    )
}

export default LabResult