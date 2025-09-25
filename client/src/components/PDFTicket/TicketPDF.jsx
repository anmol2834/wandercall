import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  
  header: {
    backgroundColor: '#4f46e5',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  
  brandTagline: {
    fontSize: 10,
    color: '#c7d2fe',
    marginTop: 2
  },
  
  ticketNumber: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 15
  },
  
  content: {
    padding: 25,
    flex: 1
  },
  
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 5
  },
  
  confirmBadge: {
    fontSize: 8,
    color: '#ffffff',
    backgroundColor: '#10b981',
    padding: 5,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 20,
    alignSelf: 'center'
  },
  
  row: {
    flexDirection: 'row',
    marginBottom: 15
  },
  
  leftCol: {
    width: '50%',
    paddingRight: 10
  },
  
  rightCol: {
    width: '50%',
    paddingLeft: 10
  },
  
  card: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 12
  },
  
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  
  label: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 'bold',
    width: '35%'
  },
  
  value: {
    fontSize: 9,
    color: '#1f2937',
    width: '65%'
  },
  
  valueBold: {
    fontSize: 9,
    color: '#1f2937',
    width: '65%',
    fontWeight: 'bold'
  },
  
  qrSection: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15
  },
  
  qrTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8
  },
  
  qrBox: {
    width: 80,
    height: 80,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5
  },
  
  qrText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold'
  },
  
  qrInstruction: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center'
  },
  
  paymentSection: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 5
  },
  
  paymentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center'
  },
  
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  
  paymentLabel: {
    fontSize: 8,
    color: '#6b7280'
  },
  
  paymentValue: {
    fontSize: 8,
    color: '#1f2937',
    fontWeight: 'bold'
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#bfdbfe'
  },
  
  totalLabel: {
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 'bold'
  },
  
  totalValue: {
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold'
  },
  
  statusBadge: {
    fontSize: 7,
    color: '#ffffff',
    backgroundColor: '#10b981',
    padding: 3,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 5,
    alignSelf: 'center'
  },
  
  fullCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15
  },
  
  footer: {
    backgroundColor: '#1f2937',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  footerBrand: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  
  footerText: {
    fontSize: 7,
    color: '#9ca3af'
  },
  
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center'
  },
  
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start'
  },
  
  instructionNumber: {
    width: 16,
    height: 16,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  
  instructionNumberText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  
  instructionText: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
    lineHeight: 1.3
  },
  
  termsSection: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 5,
    marginTop: 15
  },
  
  termsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 6
  },
  
  termsText: {
    fontSize: 8,
    color: '#92400e',
    lineHeight: 1.2,
    marginBottom: 3
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
    paymentId,
    openTime,
    closeTime
  } = ticketData;

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>wandercall</Text>
            <Text style={styles.brandTagline}>Experience the Extraordinary</Text>
          </View>
          <Text style={styles.ticketNumber}>#{ticketNumber}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.confirmBadge}>BOOKING CONFIRMED</Text>
          
          <View style={styles.row}>
            <View style={styles.leftCol}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Guest Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>NAME</Text>
                  <Text style={styles.valueBold}>{userName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>EMAIL</Text>
                  <Text style={styles.value}>{userEmail}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>PHONE</Text>
                  <Text style={styles.value}>{userPhone}</Text>
                </View>
              </View>
              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Event Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>DATE</Text>
                  <Text style={styles.valueBold}>
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>GUESTS</Text>
                  <Text style={styles.valueBold}>{participants} {participants === 1 ? 'Person' : 'People'}</Text>
                </View>
                {openTime && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>STARTS</Text>
                    <Text style={styles.valueBold}>{openTime}</Text>
                  </View>
                )}
                {closeTime && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>ENDS</Text>
                    <Text style={styles.valueBold}>{closeTime}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.rightCol}>
              <View style={styles.qrSection}>
                <Text style={styles.qrTitle}>Entry QR Code</Text>
                <View style={styles.qrBox}>
                  <Text style={styles.qrText}>QR</Text>
                </View>
                <Text style={styles.qrInstruction}>Show at venue</Text>
              </View>
              
              <View style={styles.paymentSection}>
                <Text style={styles.paymentTitle}>Payment Summary</Text>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Base Price</Text>
                  <Text style={styles.paymentValue}>₹{basePrice.toFixed(2)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.paymentRow}>
                    <Text style={[styles.paymentLabel, { color: '#059669' }]}>Discount</Text>
                    <Text style={[styles.paymentValue, { color: '#059669' }]}>-₹{discount.toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>GST (18%)</Text>
                  <Text style={styles.paymentValue}>₹{gst.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Paid</Text>
                  <Text style={styles.totalValue}>₹{totalPrice.toFixed(2)}</Text>
                </View>
                <Text style={styles.statusBadge}>PAID</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.fullCard}>
            <Text style={styles.cardTitle}>Venue Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>ADDRESS</Text>
              <Text style={styles.value}>{fullAddress}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>LOCATION</Text>
              <Text style={styles.value}>{location} - {pincode}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>CONTACT</Text>
              <Text style={styles.value}>{providerPhone || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>PAYMENT ID</Text>
              <Text style={styles.value}>{paymentId}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerBrand}>wandercall</Text>
            <Text style={styles.footerText}>Your Experience Awaits</Text>
          </View>
          <View>
            <Text style={styles.footerText}>Generated: {new Date().toLocaleDateString()}</Text>
            <Text style={styles.footerText}>teamwandercall@gmail.com</Text>
          </View>
        </View>
      </Page>
      
      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>wandercall</Text>
            <Text style={styles.brandTagline}>Experience the Extraordinary</Text>
          </View>
          <Text style={styles.ticketNumber}>#{ticketNumber}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.instructionTitle}>How to Use Your Ticket</Text>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Arrive at the venue 15-30 minutes before your scheduled time for check-in.
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Present this ticket along with a valid photo ID at the entrance.
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Show the QR code from page 1 to staff for quick entry.
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>4</Text>
            </View>
            <Text style={styles.instructionText}>
              Follow all safety guidelines provided by venue staff.
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>5</Text>
            </View>
            <Text style={styles.instructionText}>
              Contact venue directly if you need assistance during your visit.
            </Text>
          </View>
          
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Important Terms & Conditions</Text>
            <Text style={styles.termsText}>• This ticket is non-transferable and valid only for the specified date and time.</Text>
            <Text style={styles.termsText}>• Cancellations must be made at least 48 hours in advance for a full refund.</Text>
            <Text style={styles.termsText}>• Late arrivals may result in reduced experience time or denial of entry.</Text>
            <Text style={styles.termsText}>• The venue reserves the right to cancel due to weather or unforeseen circumstances.</Text>
            <Text style={styles.termsText}>• Photography policies vary by venue - check with staff upon arrival.</Text>
            <Text style={styles.termsText}>• Participants must meet age and health requirements as specified during booking.</Text>
            <Text style={styles.termsText}>• wandercall acts as a booking platform and is not liable for venue service quality.</Text>
            <Text style={styles.termsText}>• For support, contact teamwandercall@gmail.com or through our mobile app.</Text>
          </View>
          
          <View style={styles.fullCard}>
            <Text style={styles.cardTitle}>Need Help?</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>SUPPORT</Text>
              <Text style={styles.value}>teamwandercall@gmail.com</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>VENUE</Text>
              <Text style={styles.value}>{providerPhone || 'Contact via wandercall support'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>EMERGENCY</Text>
              <Text style={styles.value}>Contact venue or local emergency services</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerBrand}>wandercall</Text>
            <Text style={styles.footerText}>Your Experience Awaits</Text>
          </View>
          <View>
            <Text style={styles.footerText}>Page 2 of 2</Text>
            <Text style={styles.footerText}>teamwandercall@gmail.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;