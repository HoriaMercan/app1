const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

let books = [
    {
        id : "1",
        carte : "Ion",
        autor: "Liviu Rebreanu"
    }
]; 

/*
    {
        id: ""
        carte : ""
        autor : ""
    }
*/


app.get('/books' , (req,res)=>{
    return res.send(Object.values(books));
})
app.get('/books/:id' , (req,res)=>{
    const id = req.params.id;
    console.log(id);
    book = books.find(x => x.id === id);
    console.log(book);
    if(book === undefined)
    {
        return res.send("undefinded");
    }
    return res.send(Object.values(book))
    
})

app.post('/books/post/:autor/:carte' , async (req,res)=>{
    const _id = Date.now().toString();
    const _carte = req.params.carte;
    const _autor = req.params.autor;

    const book = {
        "id" : _id,
        "carte":_carte,
        "autor":_autor
    }

    books.push(book);
    
    console.log(books);
    
    return res.send(Object.values(books));
    
} )

app.put('/books/put/:id/' , async(req,res)=>{
    const _id = req.params.id;
    const _carte = req.query.carte;
    const _autor = req.query.autor;
    console.log(_carte);
    book = books.find(x => x.id === _id);
    console.log(book);
    if(book === undefined){
        return res.send("Not found");
    }
    book.carte = _carte;
    book.autor = _autor;
    return res.send(Object.values(book));
})

app.delete('/books/delete/:id' , async(req , res)=>{
    const _id = req.params.id;
    book = books.find(x => x.id === _id);
    arrayIndex = books.indexOf(book);
    books.splice(arrayIndex , 1);

    console.log(books);
    return res.send('Deleted\n');

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})