import React, { useState } from 'react'
import { motion } from 'framer-motion'

const DEV_EXAMPLES = [
  { avatar: '/assets/dev1.png', nick: 'DevOne', role: 'Lead', tg: 'https://t.me/dev1' },
  { avatar: '/assets/dev2.png', nick: 'DevTwo', role: 'Backend', tg: 'https://t.me/dev2' },
  { avatar: '/assets/dev3.png', nick: 'DevThree', role: 'Frontend', tg: 'https://t.me/dev3' }
]

export default function FAQModal({ onClose }) {
  const [tab, setTab] = useState('faq')
  const faqs = [
    { title: 'Для чего нужен сайт?', body: 'Сайт предназначен для игры в казино на внутриигровые призы — не на реальные деньги.' },
    { title: 'Как создать аккаунт?', body: 'Регистрация через Telegram-бота. После создания бот заносит данные в базу.' }
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="w-[94%] max-w-3xl glass p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-white/80">✖</button>
        <div className="flex gap-3 mb-4">
          <button onClick={()=>setTab('faq')} className={`px-4 py-2 rounded-xl ${tab==='faq' ? 'bg-blue-500' : 'bg-white/6'}`}>FAQ</button>
          <button onClick={()=>setTab('dev')} className={`px-4 py-2 rounded-xl ${tab==='dev' ? 'bg-blue-500' : 'bg-white/6'}`}>Разработчики</button>
        </div>

        {tab==='faq' && faqs.map((f,i) => (
          <details className="mb-3" key={i}>
            <summary className="cursor-pointer font-semibold">{f.title}</summary>
            <p className="mt-2 text-gray-300">{f.body}</p>
          </details>
        ))}

        {tab==='dev' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEV_EXAMPLES.map(d => (
              <div key={d.nick} className="glass p-3 text-center">
                <img src={d.avatar} className="w-16 h-16 rounded-full mx-auto border-2 border-white/20" />
                <div className="mt-2 font-bold">{d.nick}</div>
                <div className="text-sm text-gray-300">{d.role}</div>
                <a className="btn inline-block mt-3" href={d.tg} target="_blank">Telegram</a>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
