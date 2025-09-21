import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ImageLoader = ({ src, alt, sx, className, fallbackSrc = '/assets/placeholder.jpg', ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    setImageSrc(src);
    
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      setHasError(true);
      if (src !== fallbackSrc) {
        setImageSrc(fallbackSrc);
        // Try loading fallback
        const fallbackImg = new Image();
        fallbackImg.onload = () => setImageLoaded(true);
        fallbackImg.onerror = () => setImageLoaded(true); // Show placeholder even if fallback fails
        fallbackImg.src = fallbackSrc;
      } else {
        setImageLoaded(true);
      }
    };
    img.src = src;
  }, [src, fallbackSrc]);

  return (
    <Box sx={{ position: 'relative', ...sx }} className={className} {...props}>
      <AnimatePresence mode="wait">
        {imageLoaded ? (
          <motion.img
            key="image"
            src={imageSrc}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'inherit'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.8), transparent)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ImageLoader;