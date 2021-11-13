var app = require("express")();
app.set('view engine','ejs');
app.use( require("express").static( "public" ) );
var pg = require("pg");
var pgClient;
var username;


app.get('/SD/:id', function(req, res, next) { 

    if(req.params.id ==1){
        my_query="select * from dose"
    }else if(req.params.id==2){
        my_query="select * from doctor"
    }else if(req.params.id==3){
        my_query="select * from hospital"
    }else{
        my_query="NA"
    }
    pgClient.query(my_query, (error, results) => {
        if (error) {
            // console.log("error:"+error.message)
            res.render("Table",{data:error.message,Flag:true})
        }
        // console.log(results)
        else{
            res.render("Table",{data:results,Flag:false})
        }
    })          
});

app.get('/Table', function(req, res, next) { 
    // console.log(req.query.my_query)
    pgClient.query(req.query.my_query, (error, results) => {
        if (error) {
            console.log("error:"+error.message)
            res.render("Table",{data:error.message,Flag:true})
        }
        // console.log(results)
        else{
            res.render("Table",{data:results,Flag:false})
        }
    })          
});

app.get('/Home',(req,res)=>{
    res.render("Home",{Name:username,Flag:true})
})


app.get("/Login",(req,res)=>{
    username = req.query.username
    // console.log(req.query.pwd)
    pgClient = new pg.Client({
        host:"localhost",
        user:username,
        port:5432,
        password:req.query.pwd,
        database:"covid_vaccine"
    });
    pgClient.connect(function(err) {
        if (err){
            console.log(err.message)
            res.render("Home",{Name:username,Flag:false})
        }
        else{
            console.log('Database is connected successfully !');
            res.render("Home",{Name:username,Flag:true})
        }
    });
})

app.get('/',(req,res)=>{
    res.render("Login")
})

app.listen(3000,()=>{
    console.log("The Server is up and running @ http://localhost:3000");
})