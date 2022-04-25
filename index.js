const path = require('path')
const express = require('express')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const ips = []

app.get('/', (req, res) => {
  res.end('hola perro')
})

app.get('/poll', (req, res) => {
  if (ips.indexOf(req.ip) >= 0) {
    res.end('show stadistic')
    return
  }
  res.render('poll')
})

app.post('/poll', (req, res) => {
  console.log(req.body)
  ips.push(req.ip)
  res.redirect('/')
})

app.use((req, res, next) => {
  const err = new Error('404 Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  err.status = err.status || 500

  if (app.get('env') === 'production') {
    return res.status(err.status).render(String(err.status))
  }

  next(err)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Starting development server at http://localhost:${PORT}`)
})
