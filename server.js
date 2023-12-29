const express = require('express')
const next = require('next')
const http = require('http')
const socketIO = require('socket.io')
const Redis = require('ioredis')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler() // Next.js request handler

nextApp.prepare().then(() => {
  const app = express()
  const server = http.createServer(app)
  const io = socketIO(server)
  const redis = new Redis()

  redis.subscribe('notifications', () => {
      console.log('Subscribed to "notifications" channel')
  })

  redis.on('message', (channel, message) => {
      console.log(`Message received from ${channel}: ${message}`)
      io.sockets.emit('notification', message)
  })

  app.all('*', (req, res) => {
      return handle(req, res) // handling the request with Next.js
  })

  server.listen(6001, () => console.log(`Server is running on port 6001`))
})