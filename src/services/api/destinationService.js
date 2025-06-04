import destinationData from '../mockData/destinations.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let destinations = [...destinationData]

const destinationService = {
  async getAll() {
    await delay(300)
    return [...destinations]
  },

  async getById(id) {
    await delay(200)
    const destination = destinations.find(d => d.id === id)
    return destination ? { ...destination } : null
  },

  async create(destinationData) {
    await delay(400)
    const newDestination = {
      id: Date.now().toString(),
      ...destinationData,
      createdAt: new Date().toISOString()
    }
    destinations = [...destinations, newDestination]
    return { ...newDestination }
  },

  async update(id, updateData) {
    await delay(350)
    const index = destinations.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Destination not found')
    }
    
    destinations[index] = { ...destinations[index], ...updateData, updatedAt: new Date().toISOString() }
    return { ...destinations[index] }
  },

  async delete(id) {
    await delay(250)
    const index = destinations.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Destination not found')
    }
    
    destinations = destinations.filter(d => d.id !== id)
    return true
  }
}

export default destinationService