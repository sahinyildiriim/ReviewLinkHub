import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Ana Sayfa', end: true },
  { to: '/requests', label: 'Talepler' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 overflow-hidden rounded-md">
            <img
              src="/logo.png"
              alt="ReviewLinkHub logo"
              className="h-full w-full scale-[2.2] object-cover object-[50%_42%]"
            />
          </span>
          <span className="text-base font-medium tracking-tight">
            ReviewLinkHub
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
