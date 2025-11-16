import React from 'react'

export default function TopBar({ user, onLogout, onFAQ }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 container">
      <div className="flex items-center gap-3">
        <button onClick={onLogout} className="btn">Выйти</button>
        <div className="text-sm">Баланс: <strong>{user?.balance ?? 0}</strong></div>
        <div className="text-sm opacity-80">Ник: <strong>{user?.username ?? user?.gameNick ?? '—'}</strong></div>
      </div>

      <div className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="logo" className="h-10" />
        <button onClick={onFAQ} className="btn rounded-full w-10 h-10 flex items-center justify-center">?</button>
      </div>
    </header>
  )
}
