import { useEffect, useState } from "react";
import { Application } from '@splinetool/runtime';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fixed SplineLoader component
interface SplineLoaderProps {
  onLoadingComplete: () => void; // Callback to notify when loading is done
}

const SplineLoader = ({ onLoadingComplete }: SplineLoaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const splineRef = useRef<Application | null>(null);

  const [progress, setProgress] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [playExitEffect, setPlayExitEffect] = useState(false);

  // Load the Spline scene
  useEffect(() => {
    if (canvasRef.current && !splineRef.current) {
      splineRef.current = new Application(canvasRef.current);
      splineRef.current
        .load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode')
        .then(() => {
          setSplineLoaded(true);
          
          // Show progress after a shorter delay to see the animation
          setTimeout(() => {
            setShowProgress(true);
          }, 2000); // Reduced from 10 seconds to 2 seconds
        })
        .catch((error) => {
          console.error('Failed to load Spline scene:', error);
          // If Spline fails to load, still show progress after delay
          setTimeout(() => {
            setShowProgress(true);
          }, 2000);
        });
    }

    return () => {
      if (splineRef.current) {
        splineRef.current.dispose();
        splineRef.current = null;
      }
    };
  }, []);

  // Animate the progress bar once it's visible
  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 12 + 3; // Faster progress
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 200); // Faster updates

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  // Final fade out with exit effect
  useEffect(() => {
    if (progress === 100 && showProgress) {
      const timeout = setTimeout(() => {
        setPlayExitEffect(true);
        playExitSound();
        // Notify parent that loading is complete after exit animation
        setTimeout(() => {
          onLoadingComplete();
        }, 1000);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, showProgress, onLoadingComplete]);

  // Sound effect function
  const playExitSound = () => {
    try {
      const audio = new Audio('/sounds/loader-exit.mp3');
      audio.play().catch(() => {
        console.log('Audio playback failed - this is normal in some browsers');
      });
    } catch (error) {
      console.log('Audio not available');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        initial={{ opacity: 1, scale: 1, y: 0 }}
        animate={playExitEffect ? { opacity: 0, scale: 0.8, y: -100 } : { opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -100 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden"
      >
        <div className="relative w-full h-[70vh] max-w-4xl">
          {/* Spline Canvas with Fade-In */}
          <motion.canvas
            ref={canvasRef}
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: splineLoaded ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          />
          
          {/* Fallback loading indicator if Spline doesn't load */}
          {!splineLoaded && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}

          {/* Progress bar */}
          <AnimatePresence>
            {showProgress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute bottom-10 left-0 right-0 mx-auto w-3/4 max-w-md"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-sm text-cyan-300">LOADING ASSETS</span>
                  <span className="font-mono text-sm text-purple-300">
                    {Math.floor(progress)}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                
                {/* Glowing effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-full blur-xl"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ripple Effect on Exit */}
        {playExitEffect && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
        
        {/* Particle effect background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default SplineLoader;
