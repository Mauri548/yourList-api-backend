const express = require('express')
const cors = require('cors')


const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())

app.use(logger)


let notes = [
  {
    'id': 1,
    'name': 'Naruto',
    'date': '2019-05-30T17:30:31:098Z',
    'show': false
  },
  {
    'id': 2,
    'name': 'One Piece',
    'date': '2019-05-30T18:39:34:091Z',
    'show': false
  },
]

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const note = notes.find(item => item.id == id)

  note ? res.json(note) : res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id)
  notes = notes.filter(item => item.id != id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.name) {
    return res.status(400).json({
      error: 'note.name is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    name: note.name,
    show: typeof note.show != 'undefined' ? note.show : false,
    date: new Date().toISOString()
  }

  notes = notes.concat(newNote)

  res.status(201).json(newNote)
})

app.post('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const value = req.body.show
  const note = notes.find(item => item.id == id)
  note.show = value
  res.status(200).json(note)
})

// es util para mandar el error de 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})