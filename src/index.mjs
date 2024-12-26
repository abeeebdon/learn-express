import express, { response } from 'express'

const app = express()

app.use(express.json())
//run at this port
const PORT = process.env.PORT || 3100

//user array
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
    query: { file, value },
  } = request
  // you can destructure query parameters from a request it is important when you search a list from the backend

  if (!file || !value) return response.status(200).send(userArray)

  //if there is filter and value
  const filteredData = userArray.filter((user) =>
    user[file].toLowerCase().includes(value.toLowerCase())
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

app.post('/api/users', (request, response) => {
  const { body } = request

  // You can also destructure body that is passed in from request hence
  // query
  // body

  const newUser = { id: userArray.length, ...body }
  userArray.push(newUser)
  return response.status(201).send(newUser)
})
app.put('/api/users/:id', (request, response) => {
  const {
    body,
    params: { id },
  } = request

  const parsedId = parseInt(id)
  if (isNaN(parsedId)) return response.sendStatus(400)
  const findUserIndex = userArray.findIndex((user) => user.id === parsedId)
  // console.log(findUserIndex)
  if (findUserIndex === -1) return response.sendStatus(404)
  userArray[findUserIndex] = { id: parsedId, ...body }
  return response.send(userArray)
})

app.post('/abeeb', (req, res) => {
  const { body } = req
  console.log(body)
  if (!body) res.sendStatus(400)
  const newPost = { id: userArray.length + 1, ...body }
  console.log(newPost)

  userArray.push(newPost)
  return res.send(userArray)
})
app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`)
})
