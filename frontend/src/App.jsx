import React, { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import LoginModal from './components/LoginModal'
import FAQModal from './components/FAQModal'
import CasesList from './components/CasesList'
import Wheel from './components/Wheel'
import Inventory from './components/Inventory'
import Notification from './components/Notification'
import { setAuthToken } from './services/api'

export default function App() {
  const [user, setUser] = useState(null)
  const [showFAQ, setShowFAQ] = useState(false)
  const [page, setPage] = useState('cases')
  const [notes, setNotes] = useState([])

  useEffect(()=> {
    const token = localStorage.getItem('nakawin_token')
    const u = localStorage.getItem('nakawin_user')
    if (token) setAuthToken(token)
    if (u) setUser(JSON.parse(u))
  }, [])

  function pushNote(note) {
    const id = Date.now().toString()
    setNotes(s => [...s, { id, ...note }])
    setTimeout(()=> setNotes(s => s.filter(n => n.id !== id)), 5200)
  }

  function onLogout() {
    localStorage.removeItem('nakawin_token')
    localStorage.removeItem('nakawin_user')
    setAuthToken(null)
    setUser(null)
  }

  if (!user) return <LoginModal onSuccess={(u)=> setUser(u)} />

  return (
    <div className="min-h-screen bg-[#081119] text-white">
      <TopBar user={user} onLogout={onLogout} onFAQ={()=>setShowFAQ(true)} />

      <main className="pt-4 pb-28">
        {page === 'cases' && <CasesList token={user ? true : false} pushNote={pushNote} />}
        {page === 'wheel' && <Wheel pushNote={pushNote} />}
        {page === 'inventory' && <Inventory pushNote={pushNote} />}
      </main>

      <nav className="fixed bottom-6 left-0 right-0 flex justify-center z-40">
        <div className="glass p-2 rounded-full flex gap-2 shadow-lg">
          <button className="btn" onClick={()=>setPage('cases')}>Кейсы</button>
          <button className="btn" onClick={()=>setPage('wheel')}>Рулетка</button>
          <button className="btn" onClick={()=>setPage('inventory')}>Инвентарь</button>
        </div>
      </nav>

      {showFAQ && <FAQModal onClose={()=>setShowFAQ(false)} />}

      {/* notifications */}
      <div className="fixed right-4 bottom-24 w-80 flex flex-col gap-3 z-50">
        {notes.map(n => <Notification key={n.id} {...n} onClose={(id)=> setNotes(s=> s.filter(x=> x.id!==id))} />)}
      </div>
    </div>
  )
}
