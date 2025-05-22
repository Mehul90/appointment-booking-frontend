// Client configuration
const generateId = () => Math.random().toString(36).substr(2, 9)

const DEFAULT_DATA = {
  appointments: [],
  participants: [],
  user: null,
}

export const createClient = () => {
  // Initialize local storage with default data if empty
  Object.entries(DEFAULT_DATA).forEach(([key, defaultValue]) => {
    try {
      const existingData = localStorage.getItem(key)
      if (!existingData) {
        localStorage.setItem(key, JSON.stringify(defaultValue))
      }
    } catch (error) {
      console.error(`Error initializing ${key}:`, error)
    }
  })

  const safeJsonParse = (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      console.error(`Error parsing ${key}:`, error)
      return defaultValue
    }
  }

  return {
    auth: {
      // Authentication methods
      login: async (credentials) => {
        try {
          const user = {
            id: generateId(),
            email: credentials.email,
            name: credentials.email.split('@')[0],
          }
          localStorage.setItem('user', JSON.stringify(user))
          return user
        } catch (error) {
          console.error('Error in login:', error)
          throw error
        }
      },
      logout: async () => {
        try {
          localStorage.setItem('user', JSON.stringify(null))
        } catch (error) {
          console.error('Error in logout:', error)
          throw error
        }
      },
      getUser: async () => {
        return safeJsonParse('user', null)
      },
    },
    entities: {
      Participant: {
        create: async (data) => {
          try {
            const participants = safeJsonParse('participants', [])
            const newParticipant = {
              id: generateId(),
              ...data,
              createdAt: new Date().toISOString(),
            }
            participants.push(newParticipant)
            localStorage.setItem('participants', JSON.stringify(participants))
            return newParticipant
          } catch (error) {
            console.error('Error creating participant:', error)
            throw error
          }
        },
        update: async (id, data) => {
          try {
            const participants = safeJsonParse('participants', [])
            const index = participants.findIndex((p) => p.id === id)
            if (index === -1) throw new Error('Participant not found')
            participants[index] = { ...participants[index], ...data }
            localStorage.setItem('participants', JSON.stringify(participants))
            return participants[index]
          } catch (error) {
            console.error('Error updating participant:', error)
            throw error
          }
        },
        delete: async (id) => {
          try {
            const participants = safeJsonParse('participants', [])
            const filtered = participants.filter((p) => p.id !== id)
            localStorage.setItem('participants', JSON.stringify(filtered))
          } catch (error) {
            console.error('Error deleting participant:', error)
            throw error
          }
        },
        get: async (id) => {
          try {
            const participants = safeJsonParse('participants', [])
            return participants.find((p) => p.id === id)
          } catch (error) {
            console.error('Error getting participant:', error)
            throw error
          }
        },
        list: async () => {
          return safeJsonParse('participants', [])
        },
      },
      Appointment: {
        create: async (data) => {
          try {
            const appointments = safeJsonParse('appointments', [])
            const newAppointment = {
              id: generateId(),
              ...data,
              createdAt: new Date().toISOString(),
            }
            appointments.push(newAppointment)
            localStorage.setItem('appointments', JSON.stringify(appointments))
            return newAppointment
          } catch (error) {
            console.error('Error creating appointment:', error)
            throw error
          }
        },
        update: async (id, data) => {
          try {
            const appointments = safeJsonParse('appointments', [])
            const index = appointments.findIndex((a) => a.id === id)
            if (index === -1) throw new Error('Appointment not found')
            appointments[index] = { ...appointments[index], ...data }
            localStorage.setItem('appointments', JSON.stringify(appointments))
            return appointments[index]
          } catch (error) {
            console.error('Error updating appointment:', error)
            throw error
          }
        },
        delete: async (id) => {
          try {
            const appointments = safeJsonParse('appointments', [])
            const filtered = appointments.filter((a) => a.id !== id)
            localStorage.setItem('appointments', JSON.stringify(filtered))
          } catch (error) {
            console.error('Error deleting appointment:', error)
            throw error
          }
        },
        get: async (id) => {
          try {
            const appointments = safeJsonParse('appointments', [])
            return appointments.find((a) => a.id === id)
          } catch (error) {
            console.error('Error getting appointment:', error)
            throw error
          }
        },
        list: async () => {
          return safeJsonParse('appointments', [])
        },
      },
    },
    integrations: {
      Core: {
        InvokeLLM: async (prompt) => {
          return { response: `Mock LLM response for: ${prompt}` }
        },
        SendEmail: async (emailData) => {
          console.log('Mock email sent:', emailData)
          return { success: true }
        },
        UploadFile: async (file) => {
          return {
            url: URL.createObjectURL(file),
            filename: file.name,
          }
        },
        GenerateImage: async (prompt) => {
          return {
            url: 'https://via.placeholder.com/150',
            prompt,
          }
        },
        ExtractDataFromUploadedFile: async (file) => {
          return {
            text: 'Extracted text from file',
            metadata: {
              filename: file.name,
              size: file.size,
              type: file.type,
            },
          }
        },
      },
    },
  }
}

export const client = createClient()
