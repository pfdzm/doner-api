const express = require('express')
const bodyParse = require('body-parser')
const cors = require('cors')
const routes = require('./routes')

const app = express()
const PORT = 8080

express.static('.')
app.use(bodyParse.json())

const corsOptions = {
  origin: [
    'https://apps.pfdzm.me',
    'https://apps.fernandezmichel.com',
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:8080',
    'http://localhost:5000',
    /doner\.netlify\.app$/,
    /doner\.now\.sh$/,
  ],
}

app.use(cors(corsOptions))

app.use(routes)

app.listen(PORT, () => {
  console.log(`express server running on port ${PORT}`)
})
