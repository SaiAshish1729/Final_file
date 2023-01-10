const cors = require('cors')
const bodyParser = require('body-parser')
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// mongodb connection

const conn = mongoose.connect("mongodb+srv://metavy:cJ32ryK4eOZghIWa@cluster0.srf312a.mongodb.net")
.then(()=>{
    
    console.log("successfully connect to Atlas mongodb...");
})
.catch((err)=>{
    console.log("err error");
});

//connet to server

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//server part
app.listen(9002, () => {
    console.log("Be started at port 9002")
})

app.get('',(req,resp)=>{
    
    resp.send("hi");
});

//Schema 
const non_blocklistSchema = new mongoose.Schema({
    
              
    question:{
        type:String,
        required:true
    },
    
    a:{
        type:String,
        required:true
    },          
    b:{
            type:String,
            required:true 
    },
    c: {
                type:String,
            required:true 
    },
    d:{
                type:String,
            required:true 
    },
    correct:{
        type:String,
        required:true
    }



})

//model
const non_blocklist = new mongoose.model("non_blocklist",non_blocklistSchema);



// http://localhost:9002/formdata
app.post("/formdata", (req, res) => {

    const { question, option_a, option_b, option_c, option_d, correct_option } = req.body

    const doc = non_blocklist.find()
    console.log(doc)
        if (question==doc.question) {

            res.send({message:"Question is already present"})

        } else {

            const Non_blocklist = new non_blocklist(

                {
                    question: question,
                    a:option_a,
                    b: option_b,
                    c:option_c ,
                    d:option_d,
                    correct: correct_option
                }

            )
            Non_blocklist.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully submited." })
                }
            })

        }



})



// http://localhost:9002/all/get/api/v1
//provide index number after url like this ?num=3

app.get('/all/get/api/v1', (req, resp,next) => {



    non_blocklist.find({},{correct:0,_id:0,__v:0})
    .then((result) => {

        const array =result
        //console.log(array)
        const numObjects = array.length
        //const finalNum = numObjects - 1
        //console.log(numObjects)
        //console.log(typeof numObjects)

        let count = 0;

        while (count < numObjects) {
            //console.log(count);
        
        let secondObject = array.find((obj, index) => index == count)
        if(count==req.query.num){
            resp.send(secondObject)
        }else { 
           // resp.send("please provide correct number")
            next();
        }
        count++;
        }
    })
    .catch((err) => {
        console.log(err);
    })

})
