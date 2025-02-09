import { useEffect } from 'react'
import Head from 'next/head'

import AppLayout from '@/components/Layouts/AppLayout'


const Enquiries = () => {
    const moduleId = "enquiries";

    return (
        <AppLayout
            moduleId={moduleId}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Enquiries
                </h2>
            }>
            <Head>
                <title>Laravel - Enquiries</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3>Youre logged in!</h3>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Enquiries