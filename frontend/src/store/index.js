import { create } from 'zustand'

function safeGet(key) {
  try {
    const val = localStorage.getItem(key)
    if (!val || val === 'undefined' || val === 'null') return null
    return JSON.parse(val)
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

const useStore = create((set, get) => ({
  user:     safeGet('sat_user'),
  token:    localStorage.getItem('sat_token') || null,
  progress: null,

  setAuth: (user, token) => {
    localStorage.setItem('sat_token', token)
    localStorage.setItem('sat_user', JSON.stringify(user))
    set({ user, token })
  },

  setProgress: (progress) => set({ progress }),

  updateUser: (updates) => {
    const user = { ...get().user, ...updates }
    localStorage.setItem('sat_user', JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('sat_token')
    localStorage.removeItem('sat_user')
    set({ user: null, token: null, progress: null })
  },

  isLoggedIn: () => !!get().token,
}))

export default useStore
