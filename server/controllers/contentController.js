import ContentItem from '../models/ContentItem.js'

function cleanPayload(body) {
  return {
    section: body.section,
    category: body.category?.trim().toLowerCase() || '',
    location: body.location?.trim().toLowerCase() || '',
    title: body.title?.trim(),
    description: body.description?.trim() || '',
    imageUrl: body.imageUrl?.trim() || '',
    price: Number(body.price) || 0,
    rating: Number(body.rating) || 0,
    badge: body.badge?.trim() || '',
    restaurantName: body.restaurantName?.trim() || '',
    restaurantId: body.restaurantId || null,
  }
}

export async function getContent(req, res, next) {
  try {
    const item = await ContentItem.findById(req.params.id).lean()
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json({ item })
  } catch (error) { next(error) }
}

export async function listContent(req, res, next) {
  try {
    const filter = {}
    if (req.query.section) filter.section = req.query.section
    if (req.query.category) filter.category = req.query.category.toLowerCase()
    if (req.query.location) filter.location = req.query.location.toLowerCase()
    if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId
    const items = await ContentItem.find(filter).sort({ createdAt: -1 }).lean()
    res.json({ items })
  } catch (error) {
    next(error)
  }
}

export async function createContent(req, res, next) {
  try {
    const payload = cleanPayload(req.body)
    if (!payload.title || !['restaurant', 'offer', 'food', 'brand'].includes(payload.section)) {
      return res.status(400).json({ message: 'A valid section and title are required' })
    }
    if (['food', 'brand'].includes(payload.section) && !payload.category) {
      return res.status(400).json({ message: 'Food and brand items require a category' })
    }
    if (['restaurant', 'offer'].includes(payload.section) && !payload.location) {
      return res.status(400).json({ message: 'Restaurants and offers require a location' })
    }
    if (payload.section === 'offer' && !payload.restaurantName) {
      return res.status(400).json({ message: 'Offers require a restaurant name' })
    }
    const item = await ContentItem.create({ ...payload, createdBy: req.account._id })
    res.status(201).json({ message: 'Content created successfully', item })
  } catch (error) {
    next(error)
  }
}

export async function updateContent(req, res, next) {
  try {
    const payload = cleanPayload(req.body)
    if (!payload.title || !['restaurant', 'offer', 'food', 'brand'].includes(payload.section)) {
      return res.status(400).json({ message: 'A valid section and title are required' })
    }
    if (['restaurant', 'offer'].includes(payload.section) && !payload.location) {
      return res.status(400).json({ message: 'Restaurants and offers require a location' })
    }
    if (payload.section === 'offer' && !payload.restaurantName) {
      return res.status(400).json({ message: 'Offers require a restaurant name' })
    }
    const item = await ContentItem.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json({ message: 'Content updated successfully', item })
  } catch (error) {
    next(error)
  }
}

export async function deleteContent(req, res, next) {
  try {
    const item = await ContentItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Content not found' })
    res.json({ message: 'Content deleted successfully' })
  } catch (error) {
    next(error)
  }
}
