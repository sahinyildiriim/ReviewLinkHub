import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Ana Sayfa', end: true },
  { to: '/requests', label: 'Talepler' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
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

        <nav aria-label="Ana gezinme" className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  isActive && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
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
