import express from 'express'
const app = express()

app.get('/', (req, res) => {
     res.send('Hi People')
})

// app.listen(5000, console.log('Listening at Port 5000'))
// 

export default app