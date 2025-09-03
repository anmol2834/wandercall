import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, CircularProgress } from '@mui/material';
import { Download } from '@mui/icons-material';
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
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress size={16} /> : <Download />}
            disabled={loading || error}
            sx={{
              borderRadius: 2,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              px: 2,
              ...buttonProps.sx
            }}
            {...buttonProps}
          >
            {loading ? 'Generating...' : error ? 'Error' : 'Download'}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default TicketDownloader;