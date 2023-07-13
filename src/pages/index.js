import Head from "next/head";
import Login from './login'
import { useAuth } from "../hooks/auth";
// import TimeTracker from "../components/TimeTracker";

export default function Home() {
    
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <>
            <Head>
                <title>Laravel</title>
            </Head>
            <Login />
            {/* <TimeTracker /> */}
        </>
      )
}