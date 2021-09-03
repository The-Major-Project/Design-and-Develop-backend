const express= require('express');

// INITIALIZED EXPRESS APPLICATION+
const app = express();
PORT = process.env.PORT || 5000;



// ROUTES
app.get('/', async (req, res) => {
    try {
        res.send("Node auth boilerplate")
    }
    catch (err) {
        res.send(err.message)
    }
})



// LISTENING TO THE DATABSASE
app.listen(PORT, () => {
console.log(`listening to the port ${PORT}`)
console.log('Your server available at http://localhost:5000')
})
