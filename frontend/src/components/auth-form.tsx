import { useState, type ComponentProps, type FormEvent } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError, login, signup, type FieldErrors, type User } from '@/lib/api'

type Mode = 'login' | 'signup'

export function AuthForm({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setFieldErrors({})
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')

    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    try {
      const user = isSignup
        ? await signup({
            fullName: String(data.get('fullName') ?? '').trim() || null,
            email,
            password,
            passwordConfirmation: String(data.get('passwordConfirmation') ?? ''),
          })
        : await login({ email, password })
      onAuthenticated(user)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setError('Ha ocurrido un error inesperado.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{isSignup ? 'Crear cuenta' : 'Iniciar sesión'}</CardTitle>
        <CardDescription>
          {isSignup
            ? 'Regístrate para empezar a usar FlowSync.'
            : 'Introduce tu email y contraseña para acceder a FlowSync.'}
        </CardDescription>
      </CardHeader>
      <form key={mode} onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isSignup && (
            <Field
              id="fullName"
              label="Nombre completo"
              autoComplete="name"
              error={fieldErrors.fullName}
            />
          )}
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={fieldErrors.email}
          />
          <Field
            id="password"
            label="Contraseña"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            error={fieldErrors.password}
          />
          {isSignup && (
            <Field
              id="passwordConfirmation"
              label="Confirmar contraseña"
              type="password"
              autoComplete="new-password"
              required
              error={fieldErrors.passwordConfirmation}
            />
          )}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Enviando…' : isSignup ? 'Crear cuenta' : 'Entrar'}
          </Button>
          <p className="text-muted-foreground text-sm">
            {isSignup ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              onClick={() => switchMode(isSignup ? 'login' : 'signup')}
            >
              {isSignup ? 'Inicia sesión' : 'Regístrate'}
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

function Field({
  id,
  label,
  error,
  ...props
}: { id: string; label: string; error?: string } & ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
