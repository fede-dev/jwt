const express = require('express')
const app = express()
PORT = 4001
const router = require('./routes/users.routes')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/usuarios', router)


app.listen(PORT, ()=> {
    console.log('Server running on port 4001')
})