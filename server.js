const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {
    PORT,
    mongoUri
} = require("./config");

const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bucketListItemRoutes = require("./routes/api/bucketListItems");
const path = require("path");

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

mongoose.set('strictQuery', true);
mongoose.connect(mongoUri).then(() => {
    console.log("MongoDB CConnected");
}).catch(e => console.log(e));


app.use('/api/bucketListItems', bucketListItemRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
    });
}

app.listen(PORT, () => {
    console.log(`App listening port ${PORT}`);
});

