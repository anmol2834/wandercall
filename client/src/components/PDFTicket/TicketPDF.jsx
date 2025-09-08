import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
// Remove SVG import as it causes warnings in react-pdf

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica'
  },
  
  // Header Section
  header: {
    backgroundColor: '#00026aff',
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  
  // Removed logoImage style as we're using text instead
  
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 15
  },
  
  tagline: {
    fontSize: 13,
    color: '#e0e7ff',
    fontWeight: 'normal',
    marginTop: 2
  },
  
  ticketNumber: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: '10 20',
    borderRadius: 25,
    border: '2 solid rgba(255,255,255,0.3)'
  },
  
  // Main Content
  mainContent: {
    padding: 40,
    flex: 1
  },
  
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center'
  },
  
  eventSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30
  },
  
  // Ticket Details Section
  detailsSection: {
    marginBottom: 35
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  
  detailsGrid: {
    backgroundColor: '#f8fafc',
    padding: 30,
    borderRadius: 15,
    border: '1 solid #e5e7eb'
  },
  
  detailRow: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-start'
  },
  
  detailLabelContainer: {
    width: '35%',
    paddingRight: 15
  },
  
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  
  detailValueContainer: {
    width: '65%'
  },
  
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: 'normal',
    lineHeight: 1.4
  },
  
  detailValueBold: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: 'bold',
    lineHeight: 1.4
  },
  
  dividerLine: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 15
  },
  
  // QR Code Section
  qrSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    padding: 25,
    backgroundColor: '#ffffff',
    border: '2 solid #e5e7eb',
    borderRadius: 15
  },
  
  qrCode: {
    width: 120,
    height: 120,
    marginBottom: 10
  },
  
  qrText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  
  // Price Breakdown
  priceSection: {
    backgroundColor: '#f9fafb',
    padding: 25,
    borderRadius: 15,
    marginBottom: 35,
    border: '1 solid #e5e7eb'
  },
  
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center'
  },
  
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  
  priceLabel: {
    fontSize: 12,
    color: '#6b7280'
  },
  
  priceValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: 'bold'
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTop: '1 solid #e5e7eb',
    marginTop: 10
  },
  
  totalLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: 'bold'
  },
  
  totalValue: {
    fontSize: 16,
    color: '#059669',
    fontWeight: 'bold'
  },
  
  // Footer
  footer: {
    backgroundColor: '#1f2937',
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  footerText: {
    fontSize: 10,
    color: '#9ca3af'
  },
  
  footerBrand: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  
  // Decorative Elements
  decorativeBorder: {
    height: 4,
    backgroundColor: '#00026aff',
  }
});

const TicketPDF = ({ ticketData }) => {
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
    providerPhone,
    totalPrice,
    basePrice,
    gst,
    discount,
    paymentId
  } = ticketData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.decorativeBorder} />
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoText}>WanderCall</Text>
            <View>
              <Text style={styles.tagline}>Experience the Extraordinary</Text>
            </View>
          </View>
          <Text style={styles.ticketNumber}>TICKET #{ticketNumber}</Text>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.eventTitle}>{title}</Text>
          <Text style={styles.eventSubtitle}>{location}</Text>
          
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Ticket Information</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Guest Name</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValueBold}>{userName}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Email Address</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>{userEmail}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Phone Number</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>{userPhone}</Text>
                </View>
              </View>
              
              <View style={styles.dividerLine} />
              
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Event Date</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValueBold}>
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Participants</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValueBold}>{participants} {participants === 1 ? 'Person' : 'People'}</Text>
                </View>
              </View>
              
              <View style={styles.dividerLine} />
              
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Venue Address</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>{fullAddress}, {location}, {pincode}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Contact Phone</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>{providerPhone || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.dividerLine} />
              
              <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                  <Text style={styles.detailLabel}>Payment ID</Text>
                </View>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>{paymentId || 'Processing'}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.qrSection}>
            <View style={[styles.qrCode, { backgroundColor: '#f3f4f6', border: '2 solid #e5e7eb', alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ fontSize: 10, color: '#6b7280', textAlign: 'center' }}>QR Code</Text>
              <Text style={{ fontSize: 8, color: '#9ca3af', textAlign: 'center', marginTop: 5 }}>{ticketNumber}</Text>
            </View>
            <Text style={styles.qrText}>
              Scan this QR code at the venue for quick entry
            </Text>
          </View>
          
          <View style={styles.priceSection}>
            <Text style={styles.priceTitle}>Payment Summary</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Price ({participants} × ₹{(basePrice / participants).toFixed(2)})</Text>
              <Text style={styles.priceValue}>₹{basePrice.toFixed(2)}</Text>
            </View>
            
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: '#059669' }]}>Discount Applied</Text>
                <Text style={[styles.priceValue, { color: '#059669' }]}>-₹{discount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST (18%)</Text>
              <Text style={styles.priceValue}>₹{gst.toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount Paid</Text>
              <Text style={styles.totalValue}>₹{totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerBrand}>WanderCall</Text>
            <Text style={styles.footerText}>Your Experience Awaits</Text>
          </View>
          <View>
            <Text style={styles.footerText}>Generated on {new Date().toLocaleDateString()}</Text>
            <Text style={styles.footerText}>teamwandercall@gmail.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;