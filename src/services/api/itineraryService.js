import itineraryData from '../mockData/itineraries.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let itineraries = [...itineraryData]

const itineraryService = {
  async getAll() {
    await delay(300)
    return [...itineraries]
  },

  async getById(id) {
    await delay(200)
    const itinerary = itineraries.find(i => i.id === id)
    return itinerary ? { ...itinerary } : null
  },

  async create(itineraryData) {
    await delay(400)
    const newItinerary = {
      id: Date.now().toString(),
      ...itineraryData,
      createdAt: new Date().toISOString()
    }
    itineraries = [...itineraries, newItinerary]
    return { ...newItinerary }
  },

  async update(id, updateData) {
    await delay(350)
    const index = itineraries.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Itinerary not found')
    }
    
    itineraries[index] = { ...itineraries[index], ...updateData, updatedAt: new Date().toISOString() }
    return { ...itineraries[index] }
  },

  async delete(id) {
    await delay(250)
    const index = itineraries.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Itinerary not found')
    }
    
    itineraries = itineraries.filter(i => i.id !== id)
    return true
  }
}

export default itineraryService