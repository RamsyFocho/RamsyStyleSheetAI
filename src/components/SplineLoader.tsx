import { Application } from '@splinetool/runtime';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplineLoaderProps {
  isLoading: boolean; // Add this prop
}

const SplineLoader = ({ isLoading }: SplineLoaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const splineRef = useRef<Application | null>(null);
  const [progress, setProgress] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    if (isLoading && canvasRef.current && !splineRef.current) {
      splineRef.current = new Application(canvasRef.current);
      splineRef.current.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode')
        .then(() => {
          setSplineLoaded(true);
          startProgressAnimation();
        });
    }

    return () => {
      if (splineRef.current) {
        splineRef.current.dispose();
        splineRef.current = null;
      }
    };
  }, [isLoading]);

  const startProgressAnimation = () => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative w-full h-[70vh] max-w-4xl">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Progress bar - only shows after Spline loads */}
        <AnimatePresence>
          {splineLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 left-0 right-0 mx-auto w-3/4 max-w-md"
            >
              <div className="flex justify-between mb-2">
                <span className="font-mono text-sm text-cyan-300">LOADING ASSETS</span>
                <span className="font-mono text-sm text-purple-300">
                  {Math.min(100, Math.floor(progress))}%
                </span>
              </div>
              
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SplineLoader;