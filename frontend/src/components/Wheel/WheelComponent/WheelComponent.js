import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../UI/Button/Button';
import { Play, Target } from 'lucide-react';
import './WheelComponent.css';

const WheelComponent = ({ wheel, onSpin, isSpinning }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  // Расчет углов для секторов
  const calculateSections = () => {
    if (!wheel?.sections) return [];
    
    const totalWeight = wheel.sections.reduce((sum, section) => sum + section.weight, 0);
    let currentAngle = 0;
    
    return wheel.sections.map(section => {
      const angle = (section.weight / totalWeight) * 360;
      const sectionData = {
        ...section,
        angleStart: currentAngle,
        angleEnd: currentAngle + angle,
        angle: angle
      };
      currentAngle += angle;
      return sectionData;
    });
  };

  const sections = calculateSections();

  // Отрисовка колеса
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wheel) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка секторов
    sections.forEach((section, index) => {
      const startAngle = (section.angleStart + rotation) * (Math.PI / 180);
      const endAngle = (section.angleEnd + rotation) * (Math.PI / 180);

      // Градиент для сектора
      const gradient = ctx.createLinearGradient(
        centerX + Math.cos(startAngle) * radius,
        centerY + Math.sin(startAngle) * radius,
        centerX + Math.cos(endAngle) * radius,
        centerY + Math.sin(endAngle) * radius
      );

      const color = getRarityColor(section.rarity);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '80');

      // Отрисовка сектора
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Текст названия приза
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(section.name, 0, 0);
      ctx.restore();
    });

    // Центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [wheel, sections, rotation]);

  // Анимация вращения
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      setIsAnimating(true);
      
      const targetRotation = rotation + 360 * 5 + Math.random() * 360; // 5 полных оборотов + случайный угол
      const duration = 5000; // 5 секунд
      const startTime = performance.now();
      const startRotation = rotation;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing функция для плавного замедления
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newRotation = startRotation + (targetRotation - startRotation) * easeOut;
        
        setRotation(newRotation % 360);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, isAnimating, rotation]);

  const getRarityColor = (rarity) => {
    const colors = {
      1: '#6b7280', 2: '#059669', 3: '#2563eb', 4: '#7c3aed', 5: '#db2777',
      6: '#dc2626', 7: '#ea580c', 8: '#ca8a04', 9: '#16a34a', 10: '#7e22ce'
    };
    return colors[rarity] || colors[1];
  };

  return (
    <motion.div 
      className="wheel-component"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="wheel-wrapper">
        <div className="wheel-arrow">
          <Target size={32} />
        </div>
        
        <div className="wheel-canvas-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="wheel-canvas"
          />
          
          <div className="wheel-center">
            <Button
              variant="primary"
              size="large"
              onClick={onSpin}
              disabled={isSpinning}
              loading={isSpinning}
              className="spin-button"
            >
              <Play size={20} />
              {isSpinning ? 'Вращается...' : 'GO!'}
            </Button>
          </div>
        </div>
      </div>

      <div className="wheel-legend">
        <h3 className="legend-title">Призы на колесе:</h3>
        <div className="legend-items">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="legend-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="legend-color"
                style={{ backgroundColor: getRarityColor(section.rarity) }}
              />
              <span className="legend-name">{section.name}</span>
              <span className="legend-price">{section.price}₽</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WheelComponent;