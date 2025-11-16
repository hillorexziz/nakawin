import React, { useState } from 'react'
import { openCase } from '../services/api'

export default function CaseModal({ cs, onClose, pushNote }) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)

  async function spin() {
    if (spinning) return
    setSpinning(true)
    const clientSeed = Math.random().toString(36).slice(2)
    try {
      const r = await openCase(cs._id, clientSeed)
      // simulate 10s tape
      setTimeout(()=> {
        setResult(r.prize)
        setSpinning(false)
        pushNote && pushNote({ type: 'success', title: 'Вы получили', message: r.prize.name })
      }, 10000)
    } catch (e) {
      setSpinning(false)
      pushNote && pushNote({ type: 'error', title: 'Ошибка', message: e.response?.data?.error || 'Ошибка открытия' })
    }
  }

  const tapeItems = Array.from({length: 40}).map((_,i)=> cs.prizePool[i % cs.prizePool.length])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[95%] max-w-4xl glass p-6 relative">
        <button className="absolute right-4 top-4" onClick={onClose}>✖</button>
        <h3 className="text-2xl font-bold mb-3">{cs.title}</h3>

        <div className="case-tape glass mb-4">
          <div className="strip" style={{
            width: `${tapeItems.length*160}px`,
            transform: spinning ? 'translateX(-50%)' : 'translateX(0)',
            transition: spinning ? 'transform 10s linear' : 'none'
          }}>
            {tapeItems.map((it, idx)=>(
              <div key={idx} className="w-40 text-center p-2">
                <img src={it.icon} className="mx-auto h-20" />
                <div className="mt-1 text-sm">{it.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-white/6 rounded flex items-center justify-center mb-4">▲</div>
          <button className="btn px-6 py-3" onClick={spin} disabled={spinning}>{spinning ? 'Крутится...' : `Крутить (${cs.price})`}</button>
        </div>

        {result && (
          <div className="mt-6 glass p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={result.icon} className="w-16 h-16" />
              <div>
                <div className="font-semibold">{result.name}</div>
                <div className="text-sm opacity-80">Цена: {result.price}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn" onClick={()=> pushNote && pushNote({ type: 'info', title: 'Сделано', message: 'Предмет оставлен в инвентаре' })}>Оставить</button>
              <button className="btn" onClick={()=> pushNote && pushNote({ type: 'success', title: 'Продано', message: `Вы получили ${result.price}` })}>Продать</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
