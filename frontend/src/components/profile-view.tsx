import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { User } from '@/lib/api'

export function ProfileView({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-full font-semibold">
          {user.initials}
        </div>
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-xl">{user.fullName ?? user.email}</CardTitle>
          <CardDescription>Sesión iniciada</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="truncate">{user.email}</dd>
          <dt className="text-muted-foreground">Miembro desde</dt>
          <dd>{new Date(user.createdAt).toLocaleDateString('es-ES')}</dd>
        </dl>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </CardFooter>
    </Card>
  )
}
