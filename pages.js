const fs = require('fs')
const path = require('path')

function getPages() {
    const pageDir = path.join(process.cwd(), 'pages')
    const files = fs.readdirSync(pageDir)
    return files   
        .filter((file) => file !== '_document.js' && file !== '_app.js' && !file.endsWith('.test.js'))
        .map((file) => file.replace(/\.js$/, ''))
}

const pages = getPages()
const exportString = `export default ${JSON.stringify(pages)}`
fs.writeFileSync('./src/pages/pages.js', exportString)