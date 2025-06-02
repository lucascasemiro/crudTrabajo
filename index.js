require("dotenv").config(); 

const db = require("./db");

const port = process.env.PORT;

const express = require('express');

const app = express();

app.use(express.json());

app.get('/client/:id', async (req, res) => {
    const cliente = await db.selectCustomer(req.params.id);
    res.json(cliente);
    });
    
app.post("/client", async (req, res) => {
    await db.insertCostumers(req.body)
    res.sendStatus(201);
})

app.listen(port, () => {
    console.log("Backend Rodando!")
});


