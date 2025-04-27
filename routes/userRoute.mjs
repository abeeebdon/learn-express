import { Router } from 'express'
import express from 'express'
import { users } from '../constants/data.mjs'
import { validationResult, checkSchema, matchedData } from 'express-validator'
import { addNewUserSchema } from '../utils/validation.mjs'
const router = Router()

router.use(express.json())

//get User

router.get('/users', (req, res) => {
  return res.send(users)
})

//get User by id

router.get('/user/:id', (req, res) => {
  const id = req.params.id

  const reqData = users.find((user) => user.id === parseInt(id))
  if (!reqData) return res.sendStatus(400)
  return res.send(reqData)
})

// filter user by name

router.get('/user', (req, res) => {
  const { filter } = req.query
  console.log(filter)

  const reqData = users.filter((user) =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  )
  if (!reqData) return sendStatus(400)
  return res.send(reqData)
})

// add User

router.post('/users', checkSchema(addNewUserSchema), (req, res) => {
  const result = validationResult(req)
  const data = matchedData(req)
  if (!result.isEmpty())
    return res.status(400).send(result.array().map((data) => data.msg))
  const newUser = { id: users.length + 1, ...data }
  const newUsers = [...users, newUser]
  return res.send(newUsers)
})

//edit user details
router.put('/user/:id', (req, res) => {
  const { id } = req.params

  const reqData = users.find((user) => user.id === parseInt(id))
  if (!reqData) return res.sendStatus(400)
  const { name, email } = req.body
  const updatedUser = { id, name, email }
  const updatedUsers = users.map((user) =>
    user.id === parseInt(id) ? updatedUser : user
  )
  return res.send(updatedUsers)
})

//delete user

router.delete('/user/:id', (req, res) => {
  const { id } = req.params

  const reqData = users.find((user) => user.id === parseInt(id))
  if (!reqData) return res.sendStatus(400)
  const updatedUsers = users.filter((user) => user.id !== parseInt(id))
  return res.send(updatedUsers)
})

export default router
