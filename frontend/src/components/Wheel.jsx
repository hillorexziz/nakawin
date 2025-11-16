import React, { useEffect, useRef, useState } from 'react'
import { spinWheel } from '../services/api'

export default function Wheel({ pushNote }) {
  const canvasRef = useRef(null)
  const [entries, setEntries] = useState([
    /* ожидается загрузка с backend; для демо можно заполнить */
  ])
  const [spinning, setSpinning] = useState(false)
  const [prize, setPrize] = useState(null)

  useEffect(()=> {
    // для демо: если entries пусты, создаём примеры (на проде - fetch from /admin/wheel or similar)
    if (!entries.length) {
      setEntries([
        { name: 'Prize A', color: '#f59e0b', icon: '/assets/item-icons/1.png' , weight: 1 },
        { name: 'Prize B', color: '#ef4444', icon: '/assets/item-icons/2.png' , weight: 2 },
        { name: 'Prize C', color: '#10b981', icon: '/assets/item-icons/3.png' , weight: 3 },
        { name: 'Prize D', color: '#60a5fa', icon: '/assets/item-icons/4.png' , weight: 4 }
      ])
    }
  }, [])

  useEffect(()=> { drawWheel() }, [entries])

  function drawWheel(rotation=0) {
    const canvas = canvasRef.current
    if (!canvas || !entries.length) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const size = Math.min(520, window.innerWidth*0.8)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)
    ctx.clearRect(0,0,size,size)
    const cx = size/2, cy = size/2, r = size/2 - 10

    const totalWeight = entries.reduce((s,e)=>s+(e.weight||1),0)
    let start = -Math.PI/2 + rotation

    entries.forEach((e, i) => {
      const angle = (e.weight||1)/totalWeight * Math.PI*2
      ctx.beginPath()
      ctx.moveTo(cx,cy)
      ctx.arc(cx,cy,r,start, start+angle)
      ctx.closePath()
      ctx.fillStyle = e.color || `hsl(${(i*70)%360} 70% 55%)`
      ctx.fill()
      // text
      ctx.save()
      ctx.translate(cx,cy)
      ctx.rotate(start + angle/2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#081119'
      ctx.font = 'bold 14px sans-serif'
      ctx.fillText(e.name, r-10, 6)
      ctx.restore()
      start += angle
    })

    // center circle
    ctx.beginPath()
    ctx.arc(cx,cy, r*0.32, 0, Math.PI*2)
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fill()
  }

  async function handleSpin() {
    if (spinning) return
    setSpinning(true)
    const clientSeed = Math.random().toString(36).slice(2)
    try {
      const res = await spinWheel(clientSeed)
      // backend returns prize object; find index in entries by name
      const wonName = res.prize?.name
      const idx = entries.findIndex(e => e.name === wonName)
      // if not found, pick random index
      const targetIndex = idx >=0 ? idx : Math.floor(Math.random()*entries.length)
      // compute rotation animation to land on targetIndex
      animateToIndex(targetIndex, entries)
      setPrize(res.prize)
      setTimeout(()=> {
        setSpinning(false)
        pushNote && pushNote({ type: 'success', title: 'Вы выиграли', message: res.prize?.name || 'Приз' })
      }, 10000)
    } catch (e) {
      setSpinning(false)
      pushNote && pushNote({ type: 'error', title: 'Ошибка', message: e.response?.data?.error || 'Ошибка прокрутки' })
    }
  }

  function animateToIndex(index, list) {
    const canvas = canvasRef.current
    const totalWeight = list.reduce((s,e)=>s+(e.weight||1),0)
    // compute angle to center of index sector
    let angleAcc = -Math.PI/2
    for (let i=0;i<index;i++) angleAcc += ((list[i].weight||1)/totalWeight)*Math.PI*2
    const sectorAngle = ((list[index].weight||1)/totalWeight)*Math.PI*2
    const targetAngle = angleAcc + sectorAngle/2
    // animate rotation so that targetAngle goes to -Math.PI/2 (top)
    const currentRot = 0
    const desiredRot = -targetAngle
    // add several full rotations for drama
    const fullRot = Math.PI*2 * 6
    const finalRot = desiredRot + fullRot
    const duration = 10000 // ms
    const start = performance.now()
    function step(now) {
      const t = Math.min(1, (now-start)/duration)
      // ease out cubic
      const eased = 1 - Math.pow(1-t, 3)
      const rot = currentRot + (finalRot - currentRot) * eased
      drawWheel(rot)
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <div className="container flex flex-col items-center gap-6">
      <div className="relative">
        <canvas ref={canvasRef} style={{ borderRadius: '999px' }} />
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 text-3xl">▲</div>
      </div>

      <button className="btn px-6 py-3" onClick={handleSpin} disabled={spinning}>{spinning ? 'Вращается...' : 'GO'}</button>

      {prize && <div className="glass p-3 mt-4">Вы выиграли: <strong>{prize.name}</strong> — {prize.price}</div>}
    </div>
  )
}
