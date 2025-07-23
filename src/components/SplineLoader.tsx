import { Application } from '@splinetool/runtime';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// TODO: The progress is loading before the spline 3d animation
const SplineLoader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const splineRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Spline scene
    if (canvasRef.current && !splineRef.current) {
      splineRef.current = new Application(canvasRef.current);
      splineRef.current.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');
    }

    // This simulates your app loading - replace with your actual loading logic
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Adjust time as needed

    return () => {
      clearTimeout(timer);
      if (splineRef.current) {
        splineRef.current.dispose();
      }
    };
  }, []);
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md"
        >
          <div className="relative w-full h-[70vh] max-w-4xl">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />
            
            {/* Progress indicator */}
            <div className="absolute bottom-10 left-0 right-0 mx-auto w-3/4 max-w-md">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-sm text-cyan-300">LOADING ASSETS</span>
                <span className="font-mono text-sm text-purple-300">
                  {Math.floor(Math.random() * 30 + 70)}%
                </span>
              </div>
              
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  initial={{ width: '70%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="font-mono text-sm text-gray-400 tracking-wider">
              INITIALIZING APPLICATION
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplineLoader;