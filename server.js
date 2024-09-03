const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const notesRoute = require('./routes/notes');


const app = express();


app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/notaBene', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => console.error('MongoDB connection err:', err));


app.get('/', (req, res) => {
    res.send('Nota Bene Backend');
});


app.use('/notes', notesRoute);
app.use('/notes', notesRoute);


app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; 

