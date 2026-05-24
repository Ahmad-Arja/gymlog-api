const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

prisma.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((e) => console.error('Database connection failed:', e.message))

module.exports = prisma