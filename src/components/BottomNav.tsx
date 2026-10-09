'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const tabs: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: '/',
    label: 'ホーム',
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    href: '/foods',
    label: '食材',
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    href: '/manual',
    label: 'マニュアル',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'マイページ',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-0.5 text-xs ${
                  active ? 'font-bold text-accent' : 'text-muted'
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
