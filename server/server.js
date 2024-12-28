const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;


app.get('/', (req, res)=>{
    res.json({"msg": "this is example"})
})

app.listen(PORT, ()=>{
    console.log("Server is running on port 5000")
});

// Routes
app.use('/user', require('./routes/useRouter'))
app.use('/api', require('./routes/categoryRouter'))
// app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))

// connect to mongo db

const URI = process.env.MONGODB_URL

console.log(URI)
mongoose.connect(URI, {
    // useCreateIndex: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Mongo DB Connected");
}).catch(err => {
    console.error(err);
})
