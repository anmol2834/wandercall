import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, CircularProgress, Box } from '@mui/material';
import { Download, FileDownload } from '@mui/icons-material';
import { motion } from 'framer-motion';
import TicketPDF from './TicketPDF';

const TicketDownloader = ({ 
  ticketData, 
  fileName = 'wandercall-ticket.pdf',
  buttonProps = {},
  children 
}) => {
  return (
    <PDFDownloadLink
      document={<TicketPDF ticketData={ticketData} />}
      fileName={fileName}
    >
      {({ blob, url, loading, error }) => {
        if (children) {
          return children({ blob, url, loading, error });
        }

        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <FileDownload sx={{ color: 'white' }} />}
              disabled={loading || error}
              sx={{
                backgroundColor: loading ? '#64748b' : '#475569',
                color: 'white',
                borderRadius: 2,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                fontWeight: 500,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 0.7, sm: 0.8 },
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(71, 85, 105, 0.2)',
                border: 'none',
                '&:hover': {
                  backgroundColor: loading ? '#64748b' : '#334155',
                  boxShadow: '0 4px 12px rgba(71, 85, 105, 0.3)'
                },
                '&:disabled': {
                  backgroundColor: '#94a3b8',
                  color: 'white !important',
                  '& .MuiSvgIcon-root': {
                    color: 'white !important'
                  }
                },
                '& .MuiSvgIcon-root': {
                  color: 'white'
                },
                ...buttonProps.sx
              }}
              {...buttonProps}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
                {loading ? 'Generating...' : error ? 'Retry' : 'Download'}
              </Box>
            </Button>
          </motion.div>
        );
      }}
    </PDFDownloadLink>
  );
};

export default TicketDownloader;