'use client';
import { useStore } from '@/store/useStore';
import { LandingPage } from '@/components/LandingPage';
import { MapScene } from '@/components/map/MapScene';
import { TransitionScene } from '@/components/transition/TransitionScene';
import { RoamingScene } from '@/components/roaming/RoamingScene';
import { StationDetail } from '@/components/detail/StationDetail';
import CraftsmanshipPage from '@/components/craftsmanship/CraftsmanshipPage';
import MemoryGamePage from '@/components/game/MemoryGamePage';
import { FolkMusicPage } from '@/components/folk-music/FolkMusicPage';
import { HomologyPage } from '@/components/HomologyPage';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
const sceneVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};
export default function Home() {
    const { phase } = useStore();
    return (<main className="w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'landing' && (<motion.div key="landing" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <LandingPage />
          </motion.div>)}
        {phase === 'map' && (<motion.div key="map" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <MapScene />
          </motion.div>)}
        {phase === 'detail' && (<motion.div key="detail" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <StationDetail />
          </motion.div>)}

        {phase === 'transition' && (<motion.div key="transition" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <TransitionScene />
          </motion.div>)}
        {phase === 'roaming' && (<motion.div key="roaming" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <RoamingScene />
          </motion.div>)}
        {phase === 'craftsmanship' && (<motion.div key="craftsmanship" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <CraftsmanshipPage />
          </motion.div>)}
        {phase === 'memory-game' && (<motion.div key="memory-game" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <MemoryGamePage />
          </motion.div>)}
        {phase === 'folk-music' && (<motion.div key="folk-music" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <FolkMusicPage />
          </motion.div>)}
        {phase === 'homology' && (<motion.div key="homology" className="w-full h-full" variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <HomologyPage />
          </motion.div>)}
      </AnimatePresence>
    </main>);
}
