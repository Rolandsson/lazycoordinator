const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const bodyParser = require("body-parser")
const cors = require("cors");

const corsOptions = {
    origin: "https://rolandsson.github.io/lazycoordinator/"
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded())

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

    res.send(transientVotes);
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

    res.send(votes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
