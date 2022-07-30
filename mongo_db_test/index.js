const express = require('express');
const {MongoClient} = require('mongodb');
const md5 = require('md5');

const dotenv = require('dotenv');
const bodyParser = require('body-parser');




async function main(){
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));
    const config = dotenv.config();
    const PORT = parseInt(process.env.PORT);

    const uri = process.env.URI;
    
    console.log(PORT);
    console.log(uri);
    
    const client = new MongoClient(uri);

    try {
      await client.connect();
      console.log('Connected');
    } catch (e) {
      console.log(e);
      throw e;
    }
    
    app.get("/api/getUsers" , (req,res)=>{
        let database = client.db("mydb");
        let collection = database.collection("customers");
        collection.find().toArray()
        .then(results =>{
            let usersEmail = [];
            results.forEach(user =>{ usersEmail.push(user.email) });
            console.log(usersEmail);
            res.send(usersEmail);
        })
        .catch(error => console.log(error));
    })
    
    app.post("/api/users" , (req , res)=>{
        let database = client.db("mydb");
        let collection = database.collection("customers");
        let body = req.body ; 
        body.parola = md5(body.parola);
        collection.insertOne(body , (err , results) =>{
          if(err){
            console.log(err.message);
            res.send('Cannont add user to the database');
            throw err;
          }
          console.log('Added');
          res.send('The user has been added to the database\n' + JSON.stringify({
            "email" : body.email,
            "nume" : body.nume,
            "prenume" : body.prenume,
            "dateOfBirth" : body.dateOfBirth
          }));
        })
    })

    app.put("/api/users/:email" , (req , res)=>{
        let database = client.db("mydb");
        let collection = database.collection("customers");
        let body = req.body ;
        let email =  req.params.email;
        let _parola = md5(body.parola) ;
        //console.log();
        collection.updateOne({ email : email , parola : _parola}, {$set:body} , (err , results)=>{
          if(err){
            res.status(400).send("Could not update the user" + err.message);
            console.log("Error");
          }
          if(results.matchedCount){
            res.send('User updated' + JSON.stringify(body));
          }
          else{
            res.send("User not found");
          }
        })       
    })

    app.delete("/api/:email" , (req , res)=>{
        let database = client.db("mydb");
        let collection = database.collection("customers");
        let body = req.body ;
        let email =  req.params.email;
        let _parola = md5(body.parola) ;
        collection.deleteOne({email : email , parola : _parola}, (err , results)=>{
          if(err) res.status(400).send("could not delete user" + err.message);
          if(results.deletedCount){
            res.send("User deleted");
          }
          else{
            res.send("Could not find the user");
          }
        })
    })

    app.post("/auth" , (req , res)=>{
      let database = client.db("mydb");
      let collection = database.collection("customers");
      let email = req.body.email;
      let parola = req.body.parola;
      collection.findOne({email : email , parola : md5(parola)} , (err , results)=>{
        if(err) res.status(400).json(err);
        if(results){
          res.json({error:null , data : email});
        }
        else{
          res.status(404).json({error:"Not found" , data : null});
        }
      })
    })
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`)
    })
  
}

main();
  