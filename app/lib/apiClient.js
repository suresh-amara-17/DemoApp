const API_BASE_URL = 'http://52.66.55.132:5000/api'

// Get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

// Make API request with Authorization header
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log('✅ Token found and attached to request')
  } else {
    console.error('❌ No token found in localStorage')
  }

  const config = {
    method,
    headers,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  console.log(`📡 API Call: ${method} ${API_BASE_URL}${endpoint}`)

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('❌ API Error:', error)
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return await response.json()
}

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (email, password, role = 'user') => {
    return apiCall('/auth/register', 'POST', {
      email,
      password,
      role,
    })
  },

  // Login user
  login: async (email, password) => {
    return apiCall('/auth/login', 'POST', {
      email,
      password,
    })
  },

  // Logout user
  logout: async () => {
    return apiCall('/auth/logout', 'POST')
  },
}

// Invoice API calls
export const invoiceAPI = {
  // Get all invoices
  getAll: async () => {
    return apiCall('/invoices', 'GET')
  },

  // Get single invoice
  getById: async (id) => {
    return apiCall(`/invoices/${id}`, 'GET')
  },

  // Create invoice
  create: async (invoiceData) => {
    return apiCall('/invoices', 'POST', invoiceData)
  },

  // Update invoice
  update: async (id, invoiceData) => {
    return apiCall(`/invoices/${id}`, 'PUT', invoiceData)
  },

  // Delete invoice
  delete: async (id) => {
    return apiCall(`/invoices/${id}`, 'DELETE')
  },
}

// Purchase API calls
export const purchaseAPI = {
  // Get all purchases
  getAll: async () => {
    return apiCall('/purchases', 'GET')
  },

  // Get single purchase
  getById: async (id) => {
    return apiCall(`/purchases/${id}`, 'GET')
  },

  // Create purchase
  create: async (purchaseData) => {
    return apiCall('/purchases', 'POST', purchaseData)
  },

  // Update purchase
  update: async (id, purchaseData) => {
    return apiCall(`/purchases/${id}`, 'PUT', purchaseData)
  },

  // Delete purchase
  delete: async (id) => {
    return apiCall(`/purchases/${id}`, 'DELETE')
  },
}

export default apiCall
