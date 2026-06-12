'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
    const { theme, toggle } = useTheme()

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-lg transition-colors"
            style={{
                color: 'var(--text-muted)',
                background: 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    )
}
