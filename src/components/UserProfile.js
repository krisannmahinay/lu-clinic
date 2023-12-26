
const UserProfile = ({data}) => {
    return (
        <div>
            <div className="mx-auto space-y-4">
                <div className="bg-white border border-gray-300 shadow-gray-200 rounded-md p-6 mt-4">
                    <div className="flex items-center space-x-4">
                        <img src="/path-to-your-image.jpg" alt="Profile picture" width={50} height={50} className="rounded-full" />
                        <div>
                            <h1 className="text-xl font-bold">
                                {data?.identity?.last_name !== null 
                                    ? data?.identity?.last_name : 'No Last Name'
                                } {data?.identity?.first_name !== null 
                                    ? data?.identity?.first_name : 'No First Name'
                                }
                            </h1>
                            <p>{data?.email}</p>
                        </div>
                    </div>

                    <div className="flex space-x-4">
            
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
                        <h2 className="font-bold text-sm uppercase text-gray-600 px-4 py-2">Personal Information</h2>
                        <div className="p-4">
                            <h1>hellow world</h1>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md w-full divide-y divide-gray-200">
                        <h2 className="font-bold text-sm uppercase text-gray-600 px-4 py-2">Activities</h2>
                        <div className="p-4">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile