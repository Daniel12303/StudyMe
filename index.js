import express from 'express'
const app = express()

app.get('/', (req, res) => {
     res.send('Hi this is from nvim')
})


export default app

app.listen(5000, () => [
  console.log("Listening at Port 5000")
])
