'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// 14个驿站对应角度
const ANGLES: Record<string, number> = {
  '草原驿': 0,      // 正北
  '北京驿': 45,     // 东北
  '威海驿': 90,     // 正东
  '苏州驿': 135,    // 东南
  '永定驿': 180,    // 正南
  '广州驿': 160,    // 南偏东
  '版纳驿': 200,    // 南偏西
  '大理驿': 225,    // 西南
  '凤凰驿': 240,    // 西偏南
  '徽州驿': 120,    // 东偏南
  '拉萨驿': 270,    // 正西
  '和田驿': 315,    // 西北
  '喀什驿': 290,    // 西偏北
  '延安驿': 340,    // 北偏西
};

interface CompassProps {
  stationName: string;
}

export function Compass({ stationName }: CompassProps) {
  const [currentAngle, setCurrentAngle] = useState(0); // 初始指向正北
  const [isRotating, setIsRotating] = useState(false);

  const angle = ANGLES[stationName] ?? 0;

  const handleLocate = () => {
    setIsRotating(true);
    setCurrentAngle(angle);
    
    // 旋转完成后重置状态
    setTimeout(() => {
      setIsRotating(false);
    }, 800);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px', // 向下移动30px（从原始40px）
      right: '175px', // 继续向右移动10px
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      pointerEvents: 'auto',
    }}>
      {/* 罗盘容器 */}
      <div style={{
        position: 'relative',
        width: '180px',  // 原始容器尺寸180px
        height: '180px', // 原始容器尺寸180px
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* 罗盘背景图片 - 只放大图片本身 */}
        <img 
          src="/luopan.png" 
          alt="罗盘"
          style={{
            width: '130%',  // 放大图片到130%
            height: '130%', // 放大图片到130%
            objectFit: 'contain',
            transform: 'translateX(-2.25px) translateY(-7px)', // 继续向左微调0.25像素
          }}
        />

        {/* 指针 - 保持原始大小和位置 */}
        <motion.div
          style={{
            position: 'absolute',
            top: 'calc(50% - 53px)', // 继续缩短：从54px减少到53px
            left: '50%',
            width: '2.5px', // 原始粗细不变
            height: '53px', // 再缩短1像素
            backgroundColor: 'var(--paper-brown, #8b6846)', // 棕色指针
            borderRadius: '1.25px', // 原始圆角
            transformOrigin: 'bottom center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 2,
            transform: 'translateX(calc(-50% - 100px))', // 原始偏移
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: currentAngle }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            duration: 0.7,
          }}
        >
          {/* 指针末端箭头 */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '6px solid var(--paper-brown, #8b6846)',
            zIndex: 3,
          }} />
        </motion.div>

        {/* 指针中心点 - 保持原始大小 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '10px', // 原始大小
          height: '10px', // 原始大小
          borderRadius: '50%',
          transform: 'translate(calc(-50% + 1px), -50%)', // 原始偏移
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid var(--paper-brown, #8b6846)', // 原始边框粗细
          background: 'transparent',
        }}>
          {/* 内部棕色实心圆点 */}
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: 'var(--paper-brown, #8b6846)', // 棕色实心
          }} />
        </div>
      </div>

      {/* 定位按钮 */}
      <button
        onClick={handleLocate}
        disabled={isRotating}
        style={{
          padding: '5px 12px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--paper-brown, #8b6846)', // 深棕色文字
          background: '#E6D5B8', // 浅棕色填充
          border: '1px solid rgba(139, 104, 70, 0.4)',
          borderRadius: '16px', // 更圆的圆角
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(91, 70, 44, 0.2)',
          transition: 'all 0.2s ease',
          letterSpacing: '0.05em',
          minWidth: '70px', // 进一步调小宽度
          opacity: isRotating ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
        }}
        onMouseEnter={(e) => {
          if (!isRotating) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(91, 70, 44, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isRotating) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 70, 44, 0.2)';
          }
        }}
      >
        {isRotating ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF5252" style={{ flexShrink: 0 }}>
              <path d="M12 3C8.5 3 5.5 5.5 5.5 9c0 2.5 1.5 4.5 3.5 5.5v5h6v-5c2-1 3.5-3 3.5-5.5C18.5 5.5 15.5 3 12 3z" fill="#FF5252" />
              <path d="M12 3v3" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="9" r="1" fill="#FFFFFF" />
            </svg>
            定位中...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF5252" style={{ flexShrink: 0 }}>
              <path d="M12 3C8.5 3 5.5 5.5 5.5 9c0 2.5 1.5 4.5 3.5 5.5v5h6v-5c2-1 3.5-3 3.5-5.5C18.5 5.5 15.5 3 12 3z" fill="#FF5252" />
              <path d="M12 3v3" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="9" r="1" fill="#FFFFFF" />
            </svg>
            定位
          </>
        )}
      </button>

    </div>
  );
}