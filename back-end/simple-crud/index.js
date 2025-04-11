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

mongoose.connect('mongodb+srv://cedrick13bienvenue:srk4cedrick@backend-db.bihfz7h.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backend-db')
.then(() => {
    console.log('Connected to database!');
    app.listen(3000, ()=> {
        console.log("Server is running on port 3000")
    })
})
    
.catch(()=>{
    console.log("Connection failed")
})