import { useState } from 'react';
import { Box, Skeleton } from '@mui/material';

const LazyImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  sx = {}, 
  loading = "lazy",
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Box sx={{ position: 'relative', width, height, ...sx }}>
      {!imageLoaded && !imageError && (
        <Skeleton 
          variant="rectangular" 
          width={width || '100%'} 
          height={height || '100%'}
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          ...props.style
        }}
        {...props}
      />
      {imageError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '0.875rem'
          }}
        >
          Image not available
        </Box>
      )}
    </Box>
  );
};

export default LazyImage;