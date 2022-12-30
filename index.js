const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const bodyParser = require("body-parser")
const cors = require("cors");

const corsOptions = {
    origin: "rolandsson.github.io"
}

//app.use(cors(corsOptions))
app.use(bodyParser.urlencoded())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin);
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
    
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
    
  next();
});

let queries = {}

app.post('/vote', (req, res) => {
    if(queries[req.body.target] == undefined) {
        queries[req.body.target] = [];
    }
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 

    if(queries[req.body.target].find(query => query.ip == ip)) {
        res.sendStatus(403);
    } else {
        queries[req.body.target].push({ip: ip, vote: req.body.vote});
        res.sendStatus(200);
    }
})

app.get("/vote", (req, res) => {
    let transientVotes = {};
    let ids = new Set();

    Object.keys(queries).forEach((key, index) => {
        transientVotes[key] = {};
        transientVotes[key].totalUx = 0;
        transientVotes[key].totalTheme = 0;
        queries[key].forEach(query => {
            transientVotes[key].totalUx += Number(query.vote.ux);
            transientVotes[key].totalTheme += Number(query.vote.theme);
        });
        transientVotes[key].totalVotes = (queries[key].length)
        transientVotes[key].totalScore = (transientVotes[key].totalUx + transientVotes[key].totalTheme)
        transientVotes[key].averageUx = (transientVotes[key].totalUx) / (queries[key].length)
        transientVotes[key].averageTheme = (transientVotes[key].totalTheme) / (queries[key].length)
        transientVotes[key].average = (transientVotes[key].totalUx + transientVotes[key].totalTheme) / (queries[key].length * 2)
    });

    res.jsonp(transientVotes);
})

app.get("/result", (req, res) => {
    
});

app.get("/votes", (req, res) => {
    //res.send(queries);
})

app.get("/", (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    let votes = {}

    Object.keys(queries).forEach((key, index) => {
        let hit = queries[key].find(query => query.ip == ip);
        if(hit != undefined) {
            votes[key] = hit.vote;
        }
    });

    //res.setHeader('content-type', 'application/javascript');
    res.jsonp(votes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
