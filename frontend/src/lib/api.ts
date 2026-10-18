const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'
const TOKEN_KEY = 'flowsync.token'

export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
  createdAt: string
  updatedAt: string
}

type AuthResponse = { token: string; user: User }

export type FieldErrors = Record<string, string>

/**
 * Error thrown for any non-2xx response. Validation errors (422) carry
 * per-field messages so the form can show them next to each input.
 */
export class ApiError extends Error {
  status: number
  fieldErrors: FieldErrors

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type BackendError = { message: string; field?: string }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      ...init,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.', 0)
  }

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const errors: BackendError[] = body?.errors ?? []
    const fieldErrors: FieldErrors = {}
    for (const error of errors) {
      if (error.field && !fieldErrors[error.field]) fieldErrors[error.field] = error.message
    }
    throw new ApiError(messageForStatus(response.status, errors), response.status, fieldErrors)
  }

  return body?.data ?? body
}

function messageForStatus(status: number, errors: BackendError[]) {
  if (status === 400) return 'Email o contraseña incorrectos.'
  if (status === 401) return 'Tu sesión ha caducado. Inicia sesión de nuevo.'
  if (status === 422) return 'Revisa los campos marcados.'
  return errors[0]?.message ?? 'Ha ocurrido un error inesperado.'
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function signup(input: {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}) {
  const { token, user } = await request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  setToken(token)
  return user
}

export async function login(input: { email: string; password: string }) {
  const { token, user } = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  setToken(token)
  return user
}

export function getProfile() {
  return request<User>('/account/profile')
}

export async function logout() {
  try {
    await request('/account/logout', { method: 'POST' })
  } finally {
    setToken(null)
  }
}

export function clearSession() {
  setToken(null)
}
