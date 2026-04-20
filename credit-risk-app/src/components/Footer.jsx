export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-subtle">
        <span>© 2026 CreditGuard. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <span className="hover:text-heading transition-colors cursor-default">Privacy</span>
          <span className="hover:text-heading transition-colors cursor-default">Terms</span>
          <span className="hover:text-heading transition-colors cursor-default">Support</span>
        </div>
      </div>
    </footer>
  )
}
