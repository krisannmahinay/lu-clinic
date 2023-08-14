import AppLayout from "@/components/Layouts/AppLayout"
import NavTab from "@/components/NavTab"
import Head from 'next/head'
import { useRouter } from "node_modules/next/router"


const SubModule = () => {
    const router = useRouter()
    const { slug } = router.query
    const menuGroup = "settings"

    const chargesData = [
        {
            label: 'Charges', 
            content: "Content for Tab 1 goes here", 
            table:true,
            tableTitle: "Users",
            tableContent: ""
        },
        {
            label: 'Charge Category', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Doctor OPD Charge', 
            content: "Content for Tab 3 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Doctor Emergency Charge', 
            content: "Content for Tab 3 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Charge Type', 
            content: "Content for Tab 3 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        }
    ]


    const bedData = [
        {
            label: 'Bes Status', 
            content: "Content for Tab 1 goes here", 
            table:true,
            tableTitle: "Users",
            tableContent: ""
        },
        {
            label: 'Bed List', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Bed Type', 
            content: "Content for Tab 3 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Bed Group', 
            content: "Content for Tab 3 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Floor', 
            content: "Content for Tab 3 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        }
    ]


    const symptomsData = [
        {
            label: 'Symptoms Head', 
            content: "Content for Tab 1 goes here", 
            table:true,
            tableTitle: "Users",
            tableContent: ""
        },
        {
            label: 'Symptoms Type', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        }
    ]


    const pharmacyData = [
        {
            label: 'Medicine Category', 
            content: "Content for Tab 1 goes here", 
            table:true,
            tableTitle: "Users",
            tableContent: ""
        },
        {
            label: 'Supplier', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Medicine Dosage', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Medicine Instruction', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Medicine Precaution', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        }
    ]

    return (
        <AppLayout
            moduleId={slug}
            menuGroup={menuGroup}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {slug}
                </h2>
            }>
            <Head>
                <title>Laravel - {slug}</title>
            </Head>
            <div className="p-8">
                {slug === 'system' && (
                    <h1>Slug ID: {slug}</h1>
                )}

                {slug === 'charges' && (
                    <>
                        <div className="px-2 mb-4">
                            <span class="text-xl font-medium uppercase text-[#90949a]">Hospital Charges</span>
                        </div>
                        <NavTab tabsData={chargesData}/>
                    </>
                )}

                {slug === 'bed' && (
                    <>
                        <div className="px-2 mb-4">
                            <span class="text-xl font-medium uppercase text-[#90949a]">Bed Management</span>
                        </div>
                        <NavTab tabsData={bedData}/>
                    </>
                )}

                {slug === 'symptoms' && (
                    <>
                        <div className="px-2 mb-4">
                            <span class="text-xl font-medium uppercase text-[#90949a]">Symptoms</span>
                        </div>
                        <NavTab tabsData={symptomsData}/>
                    </>
                )}

                {slug === 'pharmacy' && (
                    <>
                        <div className="px-2 mb-4">
                            <span class="text-xl font-medium uppercase text-[#90949a]">Pharmacy</span>
                        </div>
                        <NavTab tabsData={pharmacyData}/>
                    </>
                )}
            </div>
        </AppLayout>
    )
}

export default SubModule