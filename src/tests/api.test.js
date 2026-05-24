import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'


const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', (await import('../routes/auth.js')).default)
app.use('/api/exercises', (await import('../routes/exercises.js')).default)
app.use('/api/workouts', (await import('../routes/workouts.js')).default)

let token = ''
let workoutId = 0
let exerciseId = 0


describe('Auth', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: `test${Date.now()}@gmail.com`, password: 'password123' })
    expect(res.status).toBe(201)
    expect(res.body.message).toBe('User created successfully')
  })

  it('should fail registration with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'missing@gmail.com' })
    expect(res.status).toBe(400)
  })

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ahmad@gmail.com', password: 'password123' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    token = res.body.token
  })

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ahmad@gmail.com', password: 'wrongpassword' })
    expect(res.status).toBe(401)
  })

  
  it('should reject protected route without token', async () => {
    const res = await request(app).get('/api/exercises')
    expect(res.status).toBe(401)
  })
})

// ── EXERCISE TESTS ──────────────────────────────────────────────────────
describe('Exercises', () => {
  it('should create an exercise', async () => {
    const res = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test Exercise ${Date.now()}`, muscleGroup: 'Chest' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    exerciseId = res.body.id
  })

  it('should get all exercises', async () => {
    const res = await request(app)
      .get('/api/exercises')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should get exercise by id', async () => {
    const res = await request(app)
      .get(`/api/exercises/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(exerciseId)
  })

  it('should return 404 for non-existent exercise', async () => {
    const res = await request(app)
      .get('/api/exercises/99999')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})

// ── WORKOUT TESTS ───────────────────────────────────────────────────────
describe('Workouts', () => {
  it('should create a workout', async () => {
    const res = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Workout', notes: 'Test notes' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    workoutId = res.body.id
  })

  it('should fail creating workout without title', async () => {
    const res = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'No title here' })
    expect(res.status).toBe(400)
  })

  it('should get all workouts', async () => {
    const res = await request(app)
      .get('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should get workout by id', async () => {
    const res = await request(app)
      .get(`/api/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(workoutId)
  })

  it('should add exercise to workout', async () => {
    const res = await request(app)
      .post(`/api/workouts/${workoutId}/exercises`)
      .set('Authorization', `Bearer ${token}`)
      .send({ exerciseId, sets: 3, reps: 10, weight: 60 })
    expect(res.status).toBe(201)
    expect(res.body.workoutId).toBe(workoutId)
  })

  it('should delete a workout', async () => {
    const res = await request(app)
      .delete(`/api/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })
})