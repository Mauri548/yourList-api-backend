module.exports = (req, response) => {
  response.status(404).json({ error: 'Not found' })
}