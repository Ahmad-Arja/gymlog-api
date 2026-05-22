const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes (we'll add these soon)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/exercises', require('./routes/exercises'))
app.use('/api/workouts', require('./routes/workouts'))

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'GymLog API is running!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})