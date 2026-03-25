export const API_URL = import.meta.env.DEV
  ? 'http://localhost:7071/api/ask'
  : '/api/ask'

export const PERSPECTIVES_URL = import.meta.env.DEV
  ? 'http://localhost:7071/api/perspectives'
  : '/api/perspectives'
