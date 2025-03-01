const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const execute = require("./routes/execute");
const limiter = require('./middleware/rateLimiter');
const path = require('path');
const port =process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(limiter);


// app.use(express.static(path.join(__dirname, "dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
// });
app.use('/', execute);

app.listen(port, () => console.log('Compiler backend running on port 3000 go check it'));

