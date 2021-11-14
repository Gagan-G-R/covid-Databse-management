var app = require("express")();
app.set('view engine','ejs');
app.use( require("express").static( "public" ) );
var pg = require("pg");
var pgClient;
var username;
var tname;
var pk_details;

var insert_id ;
app.get('/Insert', function(req, res, next) {
    insert_query="select * from "+tname
    console.log(insert_query)
    pgClient.query(insert_query, (error, results) => {
        if (error) {
            res.render("Insert",{data:error.message,Flag:true})
        }
        else{
            res.render("Insert",{data:results,Flag:false})
        }
    }) 
});
app.get('/AfterInsert', function(req, res, next) { 
    after_insert_query="insert into "+tname+" "
    itemname="("
    valuename="("
    for(const item in req.query){
        if(req.query[item]!=""){
            itemname+=String(item)+","
            valuename+="'"+String(req.query[item])+"',"
        }
    }
    itemname=itemname.slice(0,-1)+")"
    valuename=valuename.slice(0,-1)+")"
    after_insert_query+=itemname+" values " +valuename
    console.log(after_insert_query)

    pgClient.query(after_insert_query, (error, results) => {
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
            res.render("Edit",{data:error.message,Flag:true})
        }
        else{
            res.render("Edit",{data:results,Flag:false,pk:pk_details})
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



var del_id ;
app.get('/Del/:id', function(req, res) {
    del_query="select * from "+tname+" where "
    del_id=req.params.id
    value = del_id.split(",")
    // console.log(value)
    count=0
    pk_details.forEach((i)=>{
        del_query+=String(i.column_name)+"= '"+value[count]+"' and "
        count+=1
    })
    del_query= del_query.slice(0, -4);
    // console.log(edit_query)
    pgClient.query(del_query, (error, results) => {
        if (error) {
            res.render("Del",{data:error.message,Flag:true})
        }
        else{
            res.render("Del",{data:results,Flag:false,pk:pk_details})
        }
    }) 
});

app.get('/AfterDel', function(req, res, next) { 
    after_del_query="delete from "+tname+" where  "
    value = del_id.split(",")
    console.log(value)
    count=0
    pk_details.forEach((i)=>{
        after_del_query+=String(i.column_name)+"= '"+value[count]+"' and "
        count+=1
    })
    after_del_query= after_del_query.slice(0, -4);
    console.log(after_del_query)
    pgClient.query(after_del_query, (error, results) => {
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

app.get('/AT/:id', function(req, res) { 

    if(req.params.id ==1){
        tname="batch"
    }else if(req.params.id==2){
        tname="distribution"
    }else if(req.params.id==3){
        tname="distributor"
    }else if(req.params.id==4){
        tname="doctor"
    }else if(req.params.id==5){
        tname="dose"
    }else if(req.params.id==6){
        tname="hospitals"
    }else if(req.params.id==7){
        tname="manufacturer"
    }else if(req.params.id==8){
        tname="people"
    }else if(req.params.id==9){
        tname="status"
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



app.get('/SQ/:id', function(req, res) { 

    if(req.params.id ==1){
        sd_query="select ph_no,dosedate from people inner join status on SSN = p_SSN  where doseno = '1' and dosedate<'2021-03-1'"
    }else if(req.params.id==2){
        sd_query="select count(*),sum(batch_size),hspid from distribution inner join batch on batchid=batch_id group by hspid"
    }else if(req.params.id==3){
        sd_query="select mf_id,count(*) from manufacturer inner join batch on mf_id=mfg_id group by mf_id order by count(*) desc"
    }else if(req.params.id==4){
        sd_query="select count(ssn),dose_no from people,Dose,hospital where hospital_id=hsp_id and h_id=hsp_id group by dose_no"
    }else{
        sd_query="NA"
    }
    pgClient.query(sd_query, (error, results) => {
        if (error) {
            console.log("error:"+error.message)
            res.render("Text_Table",{data:error.message,Flag:true})
        }
        else{
            res.render("Text_Table",{data:results,Flag:false})
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