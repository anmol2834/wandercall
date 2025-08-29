import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  Chip, Button, Avatar, Tab, Tabs, Paper, Divider,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import {
  Receipt, FilterList, Search, Download, TrendingUp,
  Payment, CheckCircle, Cancel, Pending, CalendarToday,
  CreditCard, AccountBalanceWallet, Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const TransactionHistoryPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#6366f1';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'failed': return <Cancel />;
      case 'cancelled': return <Cancel />;
      default: return <Payment />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'booking': return '🎫';
      case 'refund': return '💰';
      case 'reward': return '🎁';
      default: return '💳';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && transaction.type === 'booking';
    if (tabValue === 2) return matchesSearch && transaction.type === 'refund';
    if (tabValue === 3) return matchesSearch && transaction.type === 'reward';
    return matchesSearch;
  });

  const totalSpent = transactions
    .filter(t => t.type === 'booking' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = Math.abs(transactions
    .filter(t => t.type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card sx={{
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 150,
              height: 150,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
          <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  💳 Transaction History
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Track all your payments, refunds, and reward transactions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`${transactions.length} Total Transactions`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                  <Chip label={`₹${totalSpent.toFixed(2)} Spent`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ textAlign: 'center' }}
                >
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)" />
                    <text x="50" y="60" textAnchor="middle" fill="white" fontSize="30">💳</text>
                  </svg>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Spent', value: `₹${totalSpent.toFixed(2)}`, icon: <TrendingUp />, color: '#10b981' },
            { title: 'Total Refunded', value: `₹${totalRefunded.toFixed(2)}`, icon: <Refresh />, color: '#f59e0b' },
            { title: 'Pending Transactions', value: transactions.filter(t => t.status === 'pending').length, icon: <Pending />, color: '#6366f1' },
            { title: 'This Month', value: transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).length, icon: <CalendarToday />, color: '#ec4899' }
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  p: 2
                }}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Avatar sx={{
                      backgroundColor: stat.color,
                      width: 50,
                      height: 50,
                      margin: '0 auto 12px'
                    }}>
                      {stat.icon}
                    </Avatar>
                  </motion.div>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {stat.title}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 3
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{ borderRadius: 2 }}
              >
                Export
              </Button>
              <IconButton>
                <FilterList />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }
          }}
        >
          <Tab label="All" />
          <Tab label="Bookings" />
          <Tab label="Refunds" />
          <Tab label="Rewards" />
        </Tabs>
      </Box>

      {/* Transactions List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabValue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 0 }}>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <Box sx={{ p: 3, borderBottom: index < filteredTransactions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{
                            backgroundColor: getStatusColor(transaction.status) + '20',
                            color: getStatusColor(transaction.status),
                            width: 50,
                            height: 50
                          }}>
                            <Typography sx={{ fontSize: '1.5rem' }}>
                              {getTypeIcon(transaction.type)}
                            </Typography>
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                              {transaction.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                              {transaction.id} • {transaction.method}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: transaction.amount < 0 ? '#10b981' : 'text.primary',
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                          {transaction.amount < 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.amount < 0 ? 'Refund' : 'Payment'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} sm={3} md={2}>
                        <Chip
                          icon={getStatusIcon(transaction.status)}
                          label={transaction.status.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(transaction.status) + '20',
                            color: getStatusColor(transaction.status),
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                            {new Date(transaction.date).toLocaleDateString()}
                          </Typography>
                          <Button size="small" variant="outlined" sx={{ borderRadius: 2, fontSize: '0.7rem' }}>
                            View Details
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </motion.div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <Paper sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  background: 'transparent'
                }}>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  </motion.div>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>No transactions found</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'Try adjusting your search terms' : 'Your transaction history will appear here'}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default TransactionHistoryPage;