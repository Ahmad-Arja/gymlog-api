const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  updateWorkoutExercise,
  removeExerciseFromWorkout
} = require('../controllers/workoutController')

router.get('/', auth, getAllWorkouts)
router.get('/:id', auth, getWorkoutById)
router.post('/', auth, createWorkout)
router.delete('/:id', auth, deleteWorkout)
router.post('/:id/exercises', auth, addExerciseToWorkout)
router.put('/:id/exercises/:exerciseId', auth, updateWorkoutExercise)
router.delete('/:id/exercises/:exerciseId', auth, removeExerciseFromWorkout)

module.exports = router