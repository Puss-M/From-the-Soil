'use client';

import { useStore } from '@/store/useStore';
import { LandingPage } from '@/components/LandingPage';
import { MapScene } from '@/components/map/MapScene';
import { TransitionScene } from '@/components/transition/TransitionScene';
import { RoamingScene } from '@/components/roaming/RoamingScene';
import { StationDetail } from '@/components/detail/StationDetail';

import { AnimatePresence, motion, type Variants } from 'framer-motion';

const sceneVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: 'easeIn' } },
};

export default function Home() {
  const { phase } = useStore();

  return (
    <main className="w-screen h-screen bg-slate-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <motion.div key="landing" className="w-full h-full"
            variants={sceneVariants} initial="initial" animate="animate" exit="exit"
          >
            <LandingPage />
          </motion.div>
        )}
        {phase === 'map' && (
          <motion.div key="map" className="w-full h-full"
            variants={sceneVariants} initial="initial" animate="animate" exit="exit"
          >
            <MapScene />
          </motion.div>
        )}
        {phase === 'detail' && (
          <motion.div key="detail" className="w-full h-full"
            variants={sceneVariants} initial="initial" animate="animate" exit="exit"
          >
            <StationDetail />
          </motion.div>
        )}

        {phase === 'transition' && (
          <motion.div key="transition" className="w-full h-full"
            variants={sceneVariants} initial="initial" animate="animate" exit="exit"
          >
            <TransitionScene />
          </motion.div>
        )}
        {phase === 'roaming' && (
          <motion.div key="roaming" className="w-full h-full"
            variants={sceneVariants} initial="initial" animate="animate" exit="exit"
          >
            <RoamingScene />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


