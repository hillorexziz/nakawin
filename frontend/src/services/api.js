import axios from 'axios'
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', timeout: 10000 })

export function setAuthToken(token) {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete API.defaults.headers.common['Authorization']
}

export async function login(username, password) {
  const r = await API.post('/auth/login', { username, password })
  return r.data
}

export async function fetchCases() {
  const r = await API.get('/games/cases')
  return r.data
}

export async function openCase(caseId, clientSeed) {
  const r = await API.post('/games/cases/open', { caseId, clientSeed })
  return r.data
}

export async function spinWheel(clientSeed) {
  const r = await API.post('/games/wheel/spin', { clientSeed })
  return r.data
}

export async function getInventory() {
  const r = await API.get('/inventory')
  return r.data
}

export async function sellItem(itemId) {
  const r = await API.post('/inventory/sell', { itemId })
  return r.data
}

export async function withdrawItem(itemId) {
  const r = await API.post('/inventory/withdraw', { itemId })
  return r.data
}
