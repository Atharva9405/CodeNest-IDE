const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 10, 
    handler: (req, res) => {
        console.log("Rate limit exceeded");
     res.status(429).json({error: "Too many requests, try again later" });  // Pass to error handler
    },
}
);

module.exports = limiter;