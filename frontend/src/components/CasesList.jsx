import React, { useEffect, useState } from 'react'
import { fetchCases } from '../services/api'
import CaseModal from './CaseModal'

export default function CasesList({ token, pushNote }) {
  const [cases, setCases] = useState([])
  const [openCase, setOpenCase] = useState(null)

  useEffect(()=> {
    (async ()=>{
      try {
        const r = await fetchCases()
        setCases(r.cases || [])
      } catch (e) {
        pushNote && pushNote({ type: 'error', title: 'Ошибка', message: 'Не удалось загрузить кейсы' })
      }
    })()
  }, [])

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map(c => (
          <div key={c._id} className="glass p-4">
            <img src={c.cover} alt={c.title} className="w-full h-40 object-cover rounded-md mb-3" />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">{c.title}</div>
                <div className="text-sm opacity-80">{c.price} кредитов</div>
              </div>
              <button className="btn" onClick={()=>setOpenCase(c)}>Открыть</button>
            </div>
          </div>
        ))}
      </div>

      {openCase && <CaseModal cs={openCase} onClose={()=>setOpenCase(null)} pushNote={pushNote} />}
    </div>
  )
}
