import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { login, setAuthToken } from '../services/api'

export default function LoginModal({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e) {
    e?.preventDefault()
    setErr(''); setLoading(true)
    try {
      const data = await login(username, password)
      setAuthToken(data.token)
      localStorage.setItem('nakawin_token', data.token)
      localStorage.setItem('nakawin_user', JSON.stringify(data.user))
      onSuccess && onSuccess(data.user)
    } catch (errResp) {
      setErr(errResp?.response?.data?.error || 'Ошибка входа')
    } finally { setLoading(false) }
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.form
        onSubmit={submit}
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .18 }}
        className="w-[92%] max-w-md glass p-6 relative"
      >
        <h3 className="text-2xl font-bold mb-3">Вход в Nakawin</h3>

        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Ник" className="w-full p-3 rounded-lg bg-white/6 mb-3 outline-none" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль" type="password" className="w-full p-3 rounded-lg bg-white/6 mb-2 outline-none" />

        {err && <div className="text-red-400 text-sm mb-2">{err}</div>}

        <button type="submit" className="btn w-full flex justify-center items-center">
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <p className="text-xs mt-3 text-gray-300">
          Если у вас нет аккаунта, создайте его через Telegram-бота —
          <a className="text-blue-300 underline ml-1" href="https://t.me/YOUR_BOT" target="_blank">Открыть бота</a>
        </p>
      </motion.form>
    </motion.div>
  )
}
