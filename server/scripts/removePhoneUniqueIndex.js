import mongoose from 'mongoose'
import { connectDatabase } from '../config/db.js'
import Account from '../models/Account.js'

async function removePhoneUniqueIndex() {
  try {
    await connectDatabase()
    const indexes = await Account.collection.indexes()
    const phoneIndex = indexes.find(
      (index) => index.key?.phone === 1 && index.unique === true,
    )

    if (phoneIndex) {
      await Account.collection.dropIndex(phoneIndex.name)
      console.log(`Removed unique phone index: ${phoneIndex.name}`)
    } else {
      console.log('No unique phone index found; no migration needed')
    }
  } finally {
    await mongoose.disconnect()
  }
}

removePhoneUniqueIndex().catch((error) => {
  console.error('Phone index migration failed:', error.message)
  process.exitCode = 1
})
