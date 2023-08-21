import Document, { Html, Head, Main, NextScript }  from "next/document"

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/suneditor/2.41.3/css/suneditor.min.css" rel="stylesheet"/>

                
                </Head>

                <body>
                    <Main />
                    <NextScript />
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/suneditor/2.41.3/suneditor.min.js"></script>

                </body>
            </Html>
        )
    }
}

export default MyDocument