const prisma = require('../prisma')

const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.userId },
      include: { workoutExercises: { include: { exercise: true } } }
    })
    res.json(workouts)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const getWorkoutById = async (req, res) => {
  try {
    const workout = await prisma.workout.findFirst({
      where: { id: parseInt(req.params.id), userId: req.userId },
      include: { workoutExercises: { include: { exercise: true } } }
    })
    if (!workout) return res.status(404).json({ error: 'Workout not found' })
    res.json(workout)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const createWorkout = async (req, res) => {
  try {
    const { title, notes } = req.body
    if (!title) return res.status(400).json({ error: 'Workout title is required' })
    const workout = await prisma.workout.create({ data: { title, notes, userId: req.userId } })
    res.status(201).json(workout)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const deleteWorkout = async (req, res) => {
  try {
    const workout = await prisma.workout.findFirst({ where: { id: parseInt(req.params.id), userId: req.userId } })
    if (!workout) return res.status(404).json({ error: 'Workout not found' })
    await prisma.workoutExercise.deleteMany({ where: { workoutId: parseInt(req.params.id) } })
    await prisma.workout.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Workout deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const addExerciseToWorkout = async (req, res) => {
  try {
    const { exerciseId, sets, reps, weight } = req.body
    if (!exerciseId || !sets || !reps || !weight) return res.status(400).json({ error: 'exerciseId, sets, reps and weight are required' })
    const workout = await prisma.workout.findFirst({ where: { id: parseInt(req.params.id), userId: req.userId } })
    if (!workout) return res.status(404).json({ error: 'Workout not found' })
    const workoutExercise = await prisma.workoutExercise.create({
      data: { workoutId: parseInt(req.params.id), exerciseId: parseInt(exerciseId), sets: parseInt(sets), reps: parseInt(reps), weight: parseFloat(weight) },
      include: { exercise: true }
    })
    res.status(201).json(workoutExercise)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const updateWorkoutExercise = async (req, res) => {
  try {
    const { sets, reps, weight } = req.body
    const workoutExercise = await prisma.workoutExercise.update({
      where: { id: parseInt(req.params.exerciseId) },
      data: { sets: parseInt(sets), reps: parseInt(reps), weight: parseFloat(weight) },
      include: { exercise: true }
    })
    res.json(workoutExercise)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const removeExerciseFromWorkout = async (req, res) => {
  try {
    await prisma.workoutExercise.delete({ where: { id: parseInt(req.params.exerciseId) } })
    res.json({ message: 'Exercise removed from workout' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { getAllWorkouts, getWorkoutById, createWorkout, deleteWorkout, addExerciseToWorkout, updateWorkoutExercise, removeExerciseFromWorkout }
