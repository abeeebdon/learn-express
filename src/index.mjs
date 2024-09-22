import express, { response } from 'express'

const app = express()

const PORT = process.env.PORT || 3000

const userArray = [
  {
    id: 1,
    name: 'Abeeb',
  },
  {
    id: 2,
    name: 'MAroof',
  },
  {
    id: 3,
    name: 'Maroof',
  },
]
app.get('/', (request, response) => {
  response.status(201).send({ msg: 'Hello world!' })
})

app.get('/api/users', (request, response) => {
  const {
    query: { filter, value },
  } = request

  if (!filter || !value) return response.status(200).send(userArray)
  const filteredData = userArray.filter((user) =>
    user[filter].toLowerCase().includes(value.toLowerCase())
  )
  return response.status(200).send(filteredData)
})

app.get('/api/users/:id', (request, response) => {
  const parseId = parseInt(request.params.id)
  if (isNaN(parseId)) return response.status(400).send('Invalid id')
  const findUser = userArray.find((user) => user.id === parseId)
  if (!findUser) return response.sendStatus(404)
  return response.send(findUser)
})
app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`)
})
