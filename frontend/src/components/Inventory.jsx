import React, { useEffect, useState } from 'react'
import { getInventory, sellItem, withdrawItem } from '../services/api'

export default function Inventory({ pushNote }) {
  const [items, setItems] = useState([])

  useEffect(()=> { load() }, [])

  async function load() {
    try {
      const r = await getInventory()
      setItems(r.inventory || [])
    } catch (e) {
      pushNote && pushNote({ type: 'error', title: 'Ошибка', message: 'Не удалось загрузить инвентарь' })
    }
  }

  async function onSell(id) {
    try {
      const r = await sellItem(id)
      pushNote && pushNote({ type: 'success', title: 'Продано', message: `Баланс ${r.balance}` })
      setItems(s => s.filter(x=> x._id !== id))
    } catch (e) {
      pushNote && pushNote({ type: 'error', title: 'Ошибка', message: e.response?.data?.error || 'Ошибка продажи' })
    }
  }

  async function onWithdraw(id) {
    try {
      await withdrawItem(id)
      pushNote && pushNote({ type: 'info', title: 'Вывод', message: 'Предмет поставлен на вывод' })
      setItems(s => s.filter(x=> x._id !== id))
    } catch (e) {
      pushNote && pushNote({ type: 'error', title: 'Ошибка', message: e.response?.data?.error || 'Ошибка вывода' })
    }
  }

  return (
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(it=>(
          <div key={it._id} className="glass p-3">
            <img src={it.icon} className="w-full h-32 object-contain mb-2" />
            <div className="font-semibold">{it.name}</div>
            <div className="text-sm opacity-80">Цена: {it.price}</div>
            <div className="flex gap-2 mt-3">
              <button className="btn" onClick={()=>onSell(it._id)}>Продать</button>
              <button className="btn" onClick={()=>onWithdraw(it._id)}>Вывести</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
