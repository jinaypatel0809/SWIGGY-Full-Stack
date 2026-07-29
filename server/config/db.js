import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDatabase() {
  await mongoose.connect(env.mongoUri, {
    dbName: 'zomato_clone',
    serverSelectionTimeoutMS: 10000,
  })
  console.log('MongoDB connected')
}
