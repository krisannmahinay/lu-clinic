
const Table = ({data}) => {

    const appointmentHeaders = Object.keys(data[0])
    // console.log(appointmentHeaders)

    return (
        <>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        {appointmentHeaders.map((tblHeader, tblHeaderIndex) => (
                            <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {tblHeader}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((tblBody, tblBodyIndex) => (
                        <tr key={tblBodyIndex}>
                            {appointmentHeaders.map((tblHeader) => (
                                <td key={tblHeader} className="px-6 py-4 whitespace-nowrap">
                                    {tblBody[tblHeader]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Table