// const { createServer } = require('http')
// const { join } = require('path')
// const { parse } = require('url')
// const next = require('next')

// const app = next({ dev: process.env.NODE_ENV !== 'production' })
// const handle = app.getRequestHandler()

// app.prepare().then(() => {
//   createServer((req, res) => {
//     const parsedUrl = parse(req.url, true)
//     const { pathname } = parsedUrl

//     if (pathname === '/sw.js' || /^\/(workbox|worker|fallback)-\w+\.js$/.test(pathname)) {
//       const filePath = join(__dirname, '.next', pathname)
//       app.serveStatic(req, res, filePath)
//     } else {
//       handle(req, res, parsedUrl)
//     }
//   }).listen(3000, () => {
//     console.log(`> Ready on http://localhost:${3000}`)
//   })
// })

const { createServer } = require('http')
const next = require('next')
const WebSocket = require('ws')

const port = parseInt(process.env.PORT, 10) || 3003
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('Client connected')
    ws.on('message', (message) => {
      console.log(`Received: ${message}`)
    });
    ws.send('Hello! Connected to WebSocket Server')
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`)
  })
})