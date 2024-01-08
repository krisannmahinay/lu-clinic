

const SkeletonScreen = () => {
    return (
        <div className="grid p-3 gap-y-2 pt-[8rem]">
            <div className="flex justify-between mb-4">
                <div className="flex space-x-3">
                    <div className="w-28 h-8 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-28 h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>

                <div>
                    <div className="w-32 h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="flex space-x-3">
                <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse"></div>

            </div>
            <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
        </div>
    )
}

export default SkeletonScreen