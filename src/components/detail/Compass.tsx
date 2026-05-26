'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
const ANGLES: Record<string, number> = {
    '草原驿': 0,
    '北京驿': 45,
    '威海驿': 90,
    '苏州驿': 135,
    '永定驿': 180,
    '广州驿': 160,
    '版纳驿': 200,
    '大理驿': 225,
    '凤凰驿': 240,
    '徽州驿': 120,
    '拉萨驿': 270,
    '和田驿': 315,
    '喀什驿': 290,
    '延安驿': 340,
};
interface CompassProps {
    stationName: string;
}
export function Compass({ stationName }: CompassProps) {
    const [currentAngle, setCurrentAngle] = useState(0);
    const [isRotating, setIsRotating] = useState(false);
    const angle = ANGLES[stationName] ?? 0;
    const handleLocate = () => {
        setIsRotating(true);
        setCurrentAngle(angle);
        setTimeout(() => {
            setIsRotating(false);
        }, 800);
    };
    return (<div style={{
            position: 'absolute',
            bottom: '10px',
            right: '175px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
        }}>
      
      <div style={{
            position: 'relative',
            width: '180px',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        
        <img src="/luopan.png" alt="罗盘" style={{
            width: '130%',
            height: '130%',
            objectFit: 'contain',
            transform: 'translateX(-2.25px) translateY(-7px)',
        }}/>

        
        <motion.div style={{
            position: 'absolute',
            top: 'calc(50% - 53px)',
            left: '50%',
            width: '2.5px',
            height: '53px',
            backgroundColor: 'var(--paper-brown, #8b6846)',
            borderRadius: '1.25px',
            transformOrigin: 'bottom center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 2,
            transform: 'translateX(calc(-50% - 100px))',
        }} initial={{ rotate: 0 }} animate={{ rotate: currentAngle }} transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            duration: 0.7,
        }}>
          
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
        }}/>
        </motion.div>

        
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            transform: 'translate(calc(-50% + 1px), -50%)',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid var(--paper-brown, #8b6846)',
            background: 'transparent',
        }}>
          
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: 'var(--paper-brown, #8b6846)',
        }}/>
        </div>
      </div>

      
      <button onClick={handleLocate} disabled={isRotating} style={{
            padding: '5px 12px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--paper-brown, #8b6846)',
            background: '#E6D5B8',
            border: '1px solid rgba(139, 104, 70, 0.4)',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(91, 70, 44, 0.2)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.05em',
            minWidth: '70px',
            opacity: isRotating ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
        }} onMouseEnter={(e) => {
            if (!isRotating) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(91, 70, 44, 0.3)';
            }
        }} onMouseLeave={(e) => {
            if (!isRotating) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 70, 44, 0.2)';
            }
        }}>
        {isRotating ? (<>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF5252" style={{ flexShrink: 0 }}>
              <path d="M12 3C8.5 3 5.5 5.5 5.5 9c0 2.5 1.5 4.5 3.5 5.5v5h6v-5c2-1 3.5-3 3.5-5.5C18.5 5.5 15.5 3 12 3z" fill="#FF5252"/>
              <path d="M12 3v3" stroke="#FF5252" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="9" r="1" fill="#FFFFFF"/>
            </svg>
            定位中...
          </>) : (<>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF5252" style={{ flexShrink: 0 }}>
              <path d="M12 3C8.5 3 5.5 5.5 5.5 9c0 2.5 1.5 4.5 3.5 5.5v5h6v-5c2-1 3.5-3 3.5-5.5C18.5 5.5 15.5 3 12 3z" fill="#FF5252"/>
              <path d="M12 3v3" stroke="#FF5252" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="9" r="1" fill="#FFFFFF"/>
            </svg>
            定位
          </>)}
      </button>

    </div>);
}
