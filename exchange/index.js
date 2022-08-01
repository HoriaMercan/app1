const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan'); //middleware

const fileSystem = require('fs');
const dotenv = require('dotenv');
const cC = require('currency-converter-lt');

const path = require('path');
const CurrencyConverter = require('currency-converter-lt');
const { response } = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
dotenv.config();

var accessLogStream = fileSystem.createWriteStream(path.join(__dirname, "access.log"), {flags: "a",});
app.use(logger("combined", { stream: accessLogStream }));

app.get('/:currency_1/:currency_2/:value' , (req , res)=>{
    let cur1 = req.params.currency_1;
    let cur2 = req.params.currency_2;
    let value = parseInt(req.params.value);
    console.log({cur1 : cur1 , cur2 : cur2, value:value});
    let currencyConverter = new cC({from : cur1 , to : cur2 , amount : value , isDecimalComma : false});
    currencyConverter.convert().then(response =>{
        console.log(response);
        res.json({ message: response });

    })
})
app.get('/' , (req , res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
})
PORT = parseInt(process.env.PORT);

app.listen(PORT , function(){
    console.log(`App opened on port ${PORT}`);
})

