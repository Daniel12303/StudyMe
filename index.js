import express from 'express'
const app = express()

app.get('/', (req, res) => {
     res.send('Hi')
})

// app.listen(5000, console.log('Listening at Port 5000'))
