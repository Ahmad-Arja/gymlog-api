const prisma = require('../prisma')

const getAllExercises = async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany()
    res.json(exercises)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const getExerciseById = async (req, res) => {
  try {
    const exercise = await prisma.exercise.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' })
    res.json(exercise)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const createExercise = async (req, res) => {
  try {
    const { name, muscleGroup } = req.body
    const exercise = await prisma.exercise.create({ data: { name, muscleGroup } })
    res.status(201).json(exercise)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const updateExercise = async (req, res) => {
  try {
    const { name, muscleGroup } = req.body
    const exercise = await prisma.exercise.update({ where: { id: parseInt(req.params.id) }, data: { name, muscleGroup } })
    res.json(exercise)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

const deleteExercise = async (req, res) => {
  try {
    await prisma.exercise.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Exercise deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { getAllExercises, getExerciseById, createExercise, updateExercise, deleteExercise }
