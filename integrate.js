var pg = require("pg");
var pgClient = new pg.Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"postgres",
    database:"covid_vaccine"
});
pgClient.connect();
// var pk=[ { column_name: 'doc_id', ordinal_position: 1 } ,{ column_name: 'hsp_id', ordinal_position: 1 }]
// var str=""
// pk.forEach((i)=>{
//     str+=String(i.column_name)+","
// })
// str= str.slice(0, -1);
// console.log(str)
// console.log(pk[0].column_name)
pgClient.query('select * from doctor', (error, results) => {
    if (error) {
        console.log(error.message)
    }
        console.log(results.rows);
})
