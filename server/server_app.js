const express = require('express')

var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
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
        res.status(404).json({error:"Not found"});
    }
    return res.send(Object.values(book))
    
})
/*
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

*/
app.post('/books/', (req,res)=>{
    let body = req.body;
    console.log(body);
    books.push(body)
    res.json(`Added\n` + book)
});
app.put('/books/put/:id/' , async(req,res)=>{
    const _id = req.params.id;
    let body = req.body;
    _carte = body.carte;
    _autor = body.autor;
    console.log(_carte);
    book = books.find(x => x.id === _id);
    console.log(book);
    if(book === undefined){
        res.status(404).json({error:"Not found"});
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