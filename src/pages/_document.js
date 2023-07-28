import Document, { Html, Head, Main, NextScript }  from "next/document";
import fs from 'fs'
import path from "path";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    static async getPages() {
        const pageDir = path.join(process.cwd(), 'pages')
        const files = fs.readdirSync(pageDir)
        return files
            .filter((file) => file !== '_document.js' && file !== '_app.js' && !file.endsWith('.test.js'))
            .map((file) => file.replace(/\.js$/, ''))
    }

    render() {
        return (
            <Html>
                <Head>
                    {/* <Link /> */}
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument