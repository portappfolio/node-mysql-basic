const express = require('express')
const mysql = require('mysql');
const cors = require('cors');

const app = express()
const port = 8080

app.use(cors());

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "test"
}

const conexionMysql = mysql.createPool(dbConfig);

app.use(express.json());
app.use(express.urlencoded({extended: true}));


function getByEmail(tabla, email){
    return new Promise((resolve,reject) =>{
        conexionMysql.query(`SELECT * FROM ${tabla} WHERE email = '${email}'`,(error,result) => {
            if(error){
                return reject(error);
            } else {
                resolve(result);
            }
        })
    });
}

function insert(tabla,data){
    return new Promise((resolve,reject) =>{
        conexionMysql.query(`INSERT INTO ${tabla} SET ?`, [data], (error,result) => {
            if(error){
                return reject(error);
            } else {
                resolve(result);
            }
        })
    });
}

app.post('/', (req, res) => {
    console.log(req.body)

    getByEmail("users",req.body.email).then((r)=>{
        if(!r[0]){
            insert("users",req.body)
            .then((r)=>{
                console.log(r)
                return res.sendStatus(200)
            })
            .catch((err) => {
                console.log(err)
                return res.sendStatus(500)
            })
        }else {
            return res.sendStatus(500)
        }
    })
    .catch((err) => {
        console.log(err)
        return res.sendStatus(500)
    })

})

app.listen(port, () => {
    console.log(`Backend runing on port ${port}`)
})