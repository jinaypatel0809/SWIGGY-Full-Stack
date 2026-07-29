import Address from '../models/Address.js'

export async function listAddresses(req, res, next) {
  try { res.json({ addresses: await Address.find({ user: req.account._id }).sort({ isDefault: -1, createdAt: -1 }) }) } catch (error) { next(error) }
}

export async function createAddress(req, res, next) {
  try {
    const payload = { ...req.body, user: req.account._id }
    if (payload.isDefault) await Address.updateMany({ user: req.account._id }, { isDefault: false })
    const address = await Address.create(payload)
    res.status(201).json({ address })
  } catch (error) { next(error) }
}

export async function updateAddress(req, res, next) {
  try {
    if (req.body.isDefault) await Address.updateMany({ user: req.account._id }, { isDefault: false })
    const address = await Address.findOneAndUpdate({ _id: req.params.id, user: req.account._id }, req.body, { new: true, runValidators: true })
    if (!address) return res.status(404).json({ message: 'Address not found' })
    res.json({ address })
  } catch (error) { next(error) }
}

export async function deleteAddress(req, res, next) {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.account._id })
    if (!address) return res.status(404).json({ message: 'Address not found' })
    res.json({ message: 'Address deleted' })
  } catch (error) { next(error) }
}
