
const SkeletonCall = () => {
    return <div className="w-full h-8 bg-gray-200 rounded animate-pulse mx-2"></div>
}

const SkeletonScreen = ({ columnCount, rowCount }) => {
    const maxRowCount = Math.min(rowCount, 5)

    const skeletonHeaders = Array.from({ length: columnCount }, (_, index) => (
        <SkeletonCall key={index}/>
    ))

    const skeletonRows = Array.from({ length: 5 }, (_, rowIndex) => (
        <div key={rowIndex} className="flex justify-between items-center">
            {Array.from({ length: columnCount }, (_, colIndex) => (
                // console.log(colIndex)
                <SkeletonCall key={colIndex}/>
            ))}
        </div>
    ))

    return (
        <>
        {/* Table Header */}
        <div className="flex justify-between items-center py-4">{skeletonHeaders}</div>
    
        {/* Table Rows */}
        <div className="space-y-4 py-4">{skeletonRows}</div>
        </>
    )
}

export default SkeletonScreen