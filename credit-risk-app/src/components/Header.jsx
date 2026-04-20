import { useState, useEffect } from 'react'

/*
  Header — looks like a real bank's website header.
  White background, logo, simple status.
*/
export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`
        sticky top-0 z-50 bg-white transition-shadow duration-200
        ${scrolled ? 'shadow-sm' : ''}
      `}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-primary tracking-tight">CreditGuard</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 text-xs text-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-safe" />
          System Online
        </div>
      </div>
      <div className="h-px bg-border" />
    </header>
  )
}
