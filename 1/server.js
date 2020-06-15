const http = require('http')

// адрес хоста и порта для прослушивания
const hostname = '127.0.0.1'
const port = 3000

// создание сервера
const server = http.createServer((req, res) => {
    res.statusCode = 200                        
    res.setHeader('Content-Type', 'text/html')  
    res.end(`<h1>Hello world!</h1>
    <h2>${req.method}</h2>
    <h2>${req.url}</h2>`)                    
})

// настройка прослушивания порта
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})