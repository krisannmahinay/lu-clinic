import Head from "next/head";
import Login from './login'
// import TimeTracker from "../components/TimeTracker";

export default function Home() {
    
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