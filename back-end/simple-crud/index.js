require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose');
const app = express()


app.use(express.json())


app.get('/',(req, res)=>{
    res.send("Hello from Node API!")
})

app.post('/api/products', (req, res)=>{
    console.log(req.body)
    res.send(req.body)
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to database!');
    app.listen(3000, ()=> {
        console.log("Server is running on port 3000")
    })
})
    
.catch(()=>{
    console.log("Connection failed")
})