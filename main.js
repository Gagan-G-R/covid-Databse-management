var app = require("express")();
app.set('view engine','ejs');
app.use( require("express").static( "public" ) );
var pg = require("pg");
var pgClient;
var username;
var tname;
var pk_details;

var edit_id ;
app.get('/Edit/:id', function(req, res, next) {
    edit_query="select * from "+tname+" where "
    edit_id=req.params.id
    value = edit_id.split(",")
    console.log(value)
    count=0
    pk_details.forEach((i)=>{
        edit_query+=String(i.column_name)+"= '"+value[count]+"' and "
        count+=1
    })
    edit_query= edit_query.slice(0, -4);
    console.log(edit_query)
    pgClient.query(edit_query, (error, results) => {
        if (error) {
            res.render("Edit-Del",{data:error.message,Flag:true})
        }
        else{
            res.render("Edit-Del",{data:results,Flag:false,pk:pk_details})
        }
    }) 
});
app.get('/AfterEdit', function(req, res, next) { 
    
    after_edit_query="update "+tname+" set "
    for(const item in req.query){
        if(req.query[item]!=""){
            after_edit_query+=  item+"= '"+req.query[item]+"' ,"
        }
        // console.log(item,req.query[item])
    }
    after_edit_query= after_edit_query.slice(0, -1);
    after_edit_query+="where "
    value = edit_id.split(",")
    console.log(value)
    count=0
    pk_details.forEach((i)=>{
            after_edit_query+=String(i.column_name)+"= '"+value[count]+"' and "

        count+=1
    })
    after_edit_query= after_edit_query.slice(0, -4);
    console.log(after_edit_query)

    pgClient.query(after_edit_query, (error, results) => {
        if (error) {
            res.render("Table",{data:error.message,Flag:true})
        }
        else{
            pgClient.query("select * from "+tname,(error,result)=>{
                if(error){
                    res.render("Table",{data:error.message,Flag:true})
                }
                else{
                    res.render("Table",{data:result,Flag:false,pk:pk_details})
                }
            })
        }
    }) 
});


app.get('/SD/:id', function(req, res, next) { 

    if(req.params.id ==1){
        tname="dose"
    }else if(req.params.id==2){
        tname="doctor"
    }else if(req.params.id==3){
        tname="hospital"
    }else{
        tname="NA"
    }

    get_pk ="SELECT c.column_name, c.ordinal_position \
    FROM information_schema.key_column_usage AS c \
    LEFT JOIN information_schema.table_constraints AS t \
    ON t.constraint_name = c.constraint_name \
    WHERE t.table_name = '"+tname+"' AND t.constraint_type = 'PRIMARY KEY' "

    my_query = "select * from "+tname

    pgClient.query(get_pk, (error, results) => {
        if (error) {
            console.log("error:"+error.message)
        }
        else{
            // console.log(results.rows)
            pk_details = results.rows
        }
    }) 

    pgClient.query(my_query, (error, results) => {
        if (error) {
            // console.log("error:"+error.message)
            res.render("Table",{data:error.message,Flag:true})
        }
        else{
            console.log(pk_details)
            res.render("Table",{data:results,Flag:false,pk:pk_details})
        }
    })          
});


// this is for rendering the table for the query writen in the test box
app.get('/Table', function(req, res) { 

    pgClient.query(req.query.my_query, (error, results) => {
        if (error) {
            console.log("error:"+error.message)
            res.render("Text_Table",{data:error.message,Flag:true})
        }
        else{
            res.render("Text_Table",{data:results,Flag:false})
        }
    })   

});

// this is for rendering in the back button in the table page
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