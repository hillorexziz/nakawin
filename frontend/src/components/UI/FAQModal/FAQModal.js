import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button/Button';
import { X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import './FAQModal.css';

const FAQModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaqItem, setOpenFaqItem] = useState(null);

  const faqItems = [
    {
      question: "Для чего нужен сайт?",
      answer: "Nakawin - это игровая платформа, где вы можете открывать кейсы, крутить колесо фортуны и получать ценные призы. Все выигранные предметы можно сохранить в инвентаре или продать за внутриигровую валюту."
    },
    {
      question: "Как пополнить баланс?",
      answer: "Для пополнения баланса нажмите на кнопку '+' рядом с вашим балансом. Минимальная сумма пополнения - 100 рублей, максимальная - 999,999 рублей. Оплата осуществляется через безопасную платежную систему ЮKassa."
    },
    {
      question: "Как открывать кейсы?",
      answer: "Перейдите в раздел 'Кейсы', выберите понравившийся кейс и нажмите на него. В открывшемся окне нажмите кнопку 'Крутить' для запуска анимации. После остановки вы получите случайный предмет из кейса."
    },
    {
      question: "Что такое колесо фортуны?",
      answer: "Колесо фортуны - это дополнительный способ получения призов. Каждый сектор колеса соответствует определенному призу с разной редкостью. Чем реже приз, тем меньше сектор на колесе."
    },
    {
      question: "Как работает инвентарь?",
      answer: "В инвентаре хранятся все предметы, которые вы решили сохранить. Вы можете продать любой предмет за его стоимость или запросить вывод. При выводе предмета информация сохраняется в системе для дальнейшей обработки."
    }
  ];

  const developers = [
    {
      name: "Разработчик 1",
      role: "Full-stack Developer",
      avatar: "/avatars/dev1.png",
      telegram: "https://t.me/dev1"
    },
    {
      name: "Разработчик 2", 
      role: "Frontend Developer",
      avatar: "/avatars/dev2.png",
      telegram: "https://t.me/dev2"
    },
    {
      name: "Разработчик 3",
      role: "Backend Developer", 
      avatar: "/avatars/dev3.png",
      telegram: "https://t.me/dev3"
    }
  ];

  const toggleFaqItem = (index) => {
    setOpenFaqItem(openFaqItem === index ? null : index);
  };

  return (
    <motion.div
      className="faq-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="faq-modal-content glass-ultra"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="faq-modal-header">
          <h2 className="faq-modal-title">Справка</h2>
          <button className="faq-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="faq-tabs">
          <button
            className={`faq-tab ${activeTab === 'faq' ? 'faq-tab-active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
          <button
            className={`faq-tab ${activeTab === 'developers' ? 'faq-tab-active' : ''}`}
            onClick={() => setActiveTab('developers')}
          >
            Разработчики
          </button>
        </div>

        <div className="faq-content">
          <AnimatePresence mode="wait">
            {activeTab === 'faq' && (
              <motion.div
                key="faq"
                className="faq-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="faq-item glass"
                    initial={false}
                    animate={{ 
                      background: openFaqItem === index ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <button
                      className="faq-question"
                      onClick={() => toggleFaqItem(index)}
                    >
                      <span>{item.question}</span>
                      {openFaqItem === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {openFaqItem === index && (
                        <motion.div
                          className="faq-answer"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'developers' && (
              <motion.div
                key="developers"
                className="developers-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {developers.map((dev, index) => (
                  <motion.div
                    key={index}
                    className="developer-card glass lens-effect"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="developer-avatar">
                      <img src={dev.avatar} alt={dev.name} />
                    </div>
                    <div className="developer-info">
                      <h3 className="developer-name">{dev.name}</h3>
                      <p className="developer-role">{dev.role}</p>
                    </div>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => window.open(dev.telegram, '_blank')}
                      className="developer-contact-btn"
                    >
                      <ExternalLink size={16} />
                      Telegram
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FAQModal;