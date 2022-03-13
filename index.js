require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')

const logger = require('./loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id).then(note => {
    note ? res.json(note) : res.status(404).end()
  })
  .catch(err => {
    next(err)
  })

})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(error => next(error))

})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body
  console.log(note)

  const newNoteInfo = {
    name: note.name,
    show: note.show
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    })
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.name) {
    return res.status(400).json({
      error: 'note.name is missing'
    })
  }

  const newNote = new Note({
    name: note.name,
    date: new Date(),
    show: typeof note.show != 'undefined' ? note.show : false
  })

  newNote.save().then(savedNote => {
    res.status(201).json(savedNote)
  })

})

// es util para mandar el error de 404
app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})