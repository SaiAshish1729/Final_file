import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true})); 
app.use(cors())

// mongoose.connect("mongodb+srv://bleeny:AEKMO2MX6SuQRnOu@bleeny.pgjkj.mongodb.net/?retryWrites=true&w=majority", {
mongoose.connect("mongodb+srv://Ashish:NjxL8qaI2TLb3K6s@cluster0.uksadmq.mongodb.net/Data", {
    // mongoose.connect("mongodb://127.0.0.1:27017/myQuiz", {

    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected") 
})

const userSchema = new mongoose.Schema({

    response_code: {
        type: Number
    },
    results: [{

        question: String,
        correct_option: String,

        answers: {
            option_a: String,
            option_b: String,
            option_c: String,
            option_d: String,
          
        }

        
    }]

})

const User = new mongoose.model("User", userSchema)


app.get("/getform", async (req, res) => {
    User.findOne({}, (err, result) => {
        if (err) {
            res.send(err)
        }
        res.send(result)
    })
})


app.post("/formdata", (req, res) => {

    const { question, option_a, option_b, option_c, option_d, correct_option } = req.body
    const object = {
        question,
        correct_option,
        answers:{
            option_a,
            option_b,
            option_c,
            option_d,
            
        }
       
    }
    const user = new User({

        response_code: 0,
        results: [object]

    })
    user.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Successfully submited, Please login now." })
        }
    })

    //update
    const updateFunc = async () => {
        await User.updateOne(
            { "response_code": 0 },
            { "$push": { "results": object } }
        );

    }
    updateFunc();

})

app.listen(9000, () => {
    console.log("BE started at port 9002")
})

