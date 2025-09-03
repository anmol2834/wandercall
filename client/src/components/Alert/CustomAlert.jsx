import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const CustomAlert = ({ 
  open, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  confirmText = 'OK',
  onConfirm 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle sx={{ fontSize: 48, color: '#10b981' }} />;
      case 'error': return <Error sx={{ fontSize: 48, color: '#ef4444' }} />;
      case 'warning': return <Warning sx={{ fontSize: 48, color: '#f59e0b' }} />;
      default: return <Info sx={{ fontSize: 48, color: '#3b82f6' }} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogContent sx={{ p: 0, position: 'relative' }}>
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Close fontSize="small" />
              </IconButton>

              <Box sx={{ 
                textAlign: 'center', 
                p: { xs: 3, sm: 4 },
                pt: { xs: 5, sm: 6 }
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  <Box sx={{ mb: 3 }}>
                    {getIcon()}
                  </Box>
                </motion.div>

                {title && (
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 2,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    {title}
                  </Typography>
                )}

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    lineHeight: 1.6,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  {message}
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  sx={{
                    backgroundColor: getColor(),
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.2 },
                    minWidth: 120,
                    boxShadow: `0 4px 12px ${getColor()}40`,
                    '&:hover': {
                      backgroundColor: getColor(),
                      boxShadow: `0 6px 16px ${getColor()}50`,
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {confirmText}
                </Button>
              </Box>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default CustomAlert;