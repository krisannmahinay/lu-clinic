import Echo from "laravel-echo"
window.Pusher = require('pusher-js')
Pusher.logToConsole = false

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY, // Use environment variables in Next.js for keys
    wsHost: process.env.NEXT_PUBLIC_WS_HOST,
    wsPort: parseInt(process.env.NEXT_PUBLIC_WS_PORT, 10),
    wssPort: parseInt(process.env.NEXT_PUBLIC_WSS_PORT, 10),
    disableStats: true,
    encrypted: true,
    enabledTransports: ['ws', 'wss'], // Use WebSocket and Secure WebSocket
    // Add other configuration as needed
});

window.Echo.channel('notifications')
    .listen('.NewNotification', (e) => {
        console.log('Notification received:', e);
    });
