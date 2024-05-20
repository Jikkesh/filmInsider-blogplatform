import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/users.js'
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answers.js'
import userInformation from './middleware/userInfo.js'
import geolocationMiddleware from './middleware/location.js'

const app = express();
dotenv.config();

app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors());


app.use(geolocationMiddleware);
app.use(userInformation);

app.get('/',(req, res) => {
    res.send("This is a stack overflow clone API by Jikkesh Kumar")
});

app.use('/user', userRoutes )
app.use('/questions', questionRoutes)
app.use('/answer', answerRoutes)


const PORT = process.env.PORT || 5000
const DATABASE_URL = process.env.DATABASE_URL;
mongoose.set('strictQuery',false)

mongoose.connect( DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, '0.0.0.0' , () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))

    