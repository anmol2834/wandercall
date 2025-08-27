import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import './BackgroundAnimation.css';

const BackgroundAnimation = () => {
  return (
    <Box className="background-animation">
      {/* Morphing Blobs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`blob-${i}`}
          className="morphing-blob"
          animate={{
            borderRadius: [
              "60% 40% 30% 70%/60% 30% 70% 40%",
              "30% 60% 70% 40%/50% 60% 30% 60%",
              "60% 40% 30% 70%/60% 30% 70% 40%"
            ],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
            x: [-50, 50, -50],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
        />
      ))}
      
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="floating-particle"
          animate={{
            y: [-100, 800],
            x: [Math.sin(i) * 100, Math.cos(i) * 100],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Spiral Wave */}
      <motion.div
        className="spiral-wave"
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </Box>
  );
};

export default BackgroundAnimation;