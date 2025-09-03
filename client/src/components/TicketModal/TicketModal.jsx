import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  LocationOn,
  CalendarToday,
  Person,
  Email,
  Phone,
  Payment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import wandercallLogo from '../../assets/wandercall-logo2.svg';

const TicketModal = ({ open, onClose, ticketData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!ticketData) return null;

  const {
    ticketNumber,
    title,
    userName,
    userEmail,
    userPhone,
    selectedDate,
    participants,
    location,
    fullAddress,
    pincode,
    totalPrice,
    basePrice,
    gst,
    discount,
    paymentId
  } = ticketData;

  // Generate QR code placeholder
  const qrCodeData = `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="#f8fafc" stroke="#6366f1" stroke-width="3" rx="12"/>
      <circle cx="60" cy="45" r="15" fill="#6366f1" opacity="0.2"/>
      <text x="60" y="50" text-anchor="middle" font-family="Arial" font-size="12" fill="#6366f1" font-weight="bold">
        QR
      </text>
      <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" fill="#6b7280">
        ${ticketNumber}
      </text>
      <text x="60" y="90" text-anchor="middle" font-family="Arial" font-size="6" fill="#9ca3af">
        Scan at venue
      </text>
    </svg>
  `)}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          background: 'transparent',
          boxShadow: 'none',
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
            <DialogContent sx={{ 
              p: 0, 
              position: 'relative',
              overflow: { xs: 'auto', md: 'hidden' },
              height: { xs: '100vh', md: 'auto' },
              maxHeight: { xs: '100vh', md: 'none' }
            }}>
              {/* Close Button */}
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: { xs: 8, sm: 16 },
                  right: { xs: 8, sm: 16 },
                  zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <Close />
              </IconButton>

              {/* Ticket Container */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                />

                {/* Header */}
                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={wandercallLogo}
                      alt="WanderCall"
                      sx={{
                        height: { xs: 24, sm: 32 },
                        width: 'auto',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        WanderCall
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      >
                        Experience the Extraordinary
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip
                    label={`#${ticketNumber}`}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                </Box>

                {/* Main Content */}
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '24px 24px 0 0',
                    p: { xs: 2, sm: 3 },
                    position: 'relative',
                    zIndex: 2,
                    overflowY: { xs: 'auto', md: 'visible' },
                    minHeight: { xs: '100vh', md: 'auto' },
                    maxHeight: { xs: 'none', md: 'none' }
                  }}
                >
                  {/* Event Title */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#1f2937',
                        mb: 1,
                        fontSize: { xs: '1.1rem', sm: '1.5rem' }
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        fontSize: { xs: '0.8rem', sm: '0.9rem' }
                      }}
                    >
                      {location}
                    </Typography>
                  </Box>

                  {/* Ticket Details Grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: { xs: 2, sm: 3 },
                      mb: 3
                    }}
                  >
                    {/* Left Column */}
                    <Box>
                      <DetailItem
                        icon={<Person />}
                        label="Guest Name"
                        value={userName}
                        isMobile={isMobile}
                      />
                      <DetailItem
                        icon={<Email />}
                        label="Email"
                        value={userEmail}
                        isMobile={isMobile}
                      />
                      <DetailItem
                        icon={<Phone />}
                        label="Phone"
                        value={userPhone}
                        isMobile={isMobile}
                      />
                    </Box>

                    {/* Right Column */}
                    <Box>
                      <DetailItem
                        icon={<CalendarToday />}
                        label="Date"
                        value={new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        isMobile={isMobile}
                      />
                      <DetailItem
                        icon={<Person />}
                        label="Participants"
                        value={`${participants} ${participants === 1 ? 'Person' : 'People'}`}
                        isMobile={isMobile}
                      />
                      <DetailItem
                        icon={<Payment />}
                        label="Payment ID"
                        value={paymentId || 'Processing'}
                        isMobile={isMobile}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Address Section */}
                  <Box sx={{ mb: 3 }}>
                    <DetailItem
                      icon={<LocationOn />}
                      label="Venue Address"
                      value={`${fullAddress}, ${pincode}`}
                      isMobile={isMobile}
                      fullWidth
                    />
                  </Box>

                  {/* QR Code and Price Section */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 3,
                      alignItems: 'center'
                    }}
                  >
                    {/* QR Code */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        backgroundColor: '#f8fafc',
                        borderRadius: 3,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <Box
                        component="img"
                        src={qrCodeData}
                        alt="QR Code"
                        sx={{
                          width: { xs: 80, sm: 100 },
                          height: { xs: 80, sm: 100 },
                          mb: 1,
                          display: 'block',
                          margin: '0 auto 8px auto'
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6b7280',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          textAlign: 'center'
                        }}
                      >
                        Scan at venue
                      </Typography>
                    </Box>

                    {/* Price Breakdown */}
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#f9fafb',
                        borderRadius: 3,
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' }
                        }}
                      >
                        Payment Summary
                      </Typography>
                      
                      <PriceRow
                        label="Base Price"
                        value={`₹${basePrice.toFixed(2)}`}
                        isMobile={isMobile}
                      />
                      
                      {discount > 0 && (
                        <PriceRow
                          label="Discount"
                          value={`-₹${discount.toFixed(2)}`}
                          isMobile={isMobile}
                          isDiscount
                        />
                      )}
                      
                      <PriceRow
                        label="GST (18%)"
                        value={`₹${gst.toFixed(2)}`}
                        isMobile={isMobile}
                      />
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <PriceRow
                        label="Total Paid"
                        value={`₹${totalPrice.toFixed(2)}`}
                        isMobile={isMobile}
                        isTotal
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

// Helper Components
const DetailItem = ({ icon, label, value, isMobile, fullWidth = false }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: fullWidth ? 'flex-start' : 'center',
      gap: 1.5,
      mb: 2,
      flexDirection: fullWidth ? 'column' : 'row'
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minWidth: fullWidth ? 'auto' : { xs: 80, sm: 100 }
      }}
    >
      <Box
        sx={{
          color: '#6366f1',
          fontSize: isMobile ? '1rem' : '1.1rem'
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: '#6b7280',
          fontWeight: 600,
          fontSize: { xs: '0.7rem', sm: '0.75rem' },
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}
      >
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      sx={{
        color: '#1f2937',
        fontWeight: 500,
        fontSize: { xs: '0.8rem', sm: '0.9rem' },
        wordBreak: fullWidth ? 'break-word' : 'normal'
      }}
    >
      {value}
    </Typography>
  </Box>
);

const PriceRow = ({ label, value, isMobile, isDiscount = false, isTotal = false }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 0.5
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: isTotal ? '#1f2937' : '#6b7280',
        fontWeight: isTotal ? 600 : 400,
        fontSize: { xs: '0.7rem', sm: '0.75rem' }
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        color: isDiscount ? '#059669' : isTotal ? '#6366f1' : '#1f2937',
        fontWeight: isTotal ? 700 : 500,
        fontSize: { xs: '0.7rem', sm: '0.75rem' }
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default TicketModal;