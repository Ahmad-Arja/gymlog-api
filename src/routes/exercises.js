const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} = require('../controllers/exerciseController')

router.get('/', auth, getAllExercises)
router.get('/:id', auth, getExerciseById)
router.post('/', auth, createExercise)
router.put('/:id', auth, updateExercise)
router.delete('/:id', auth, deleteExercise)

module.exports = router