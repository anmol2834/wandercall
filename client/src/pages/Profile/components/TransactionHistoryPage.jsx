import React, { useState, useEffect } from 'react';
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
import TransactionHistoryPageLoader from '../../../components/loaders/TransactionHistoryPageLoader';

const TransactionHistoryPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Fetching transactions from:', `${apiUrl}/api/transactions/history`);
        
        const response = await fetch(`${apiUrl}/api/transactions/history`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        
        console.log('Response data:', data);
        
        if (data.success) {
          setTransactions(data.transactions || []);
          setStats(data.stats || {});
        } else {
          setError(data.message || 'Failed to load transactions');
        }
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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

  const filteredTransactions = (transactions || []).filter(transaction => {
    const matchesSearch = (transaction.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (transaction.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && transaction.type === 'booking';
    if (tabValue === 2) return matchesSearch && transaction.type === 'refund';
    return matchesSearch;
  });

  const totalSpent = stats.totalSpent || 0;
  const totalFailed = stats.totalFailed || 0;
  const pendingCount = stats.pendingCount || 0;
  const thisMonthCount = stats.thisMonthCount || 0;

  if (loading) {
    return <TransactionHistoryPageLoader />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>Error loading transactions</Typography>
        <Typography variant="body2" color="text.secondary">{error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Retry</Button>
      </Container>
    );
  }

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
                  <Chip label={`${stats.totalTransactions || 0} Total Transactions`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
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
            { title: 'Failed Amount', value: `₹${totalFailed.toFixed(2)}`, icon: <Cancel />, color: '#ef4444' },
            { title: 'Pending Transactions', value: pendingCount, icon: <Pending />, color: '#6366f1' },
            { title: 'This Month', value: thisMonthCount, icon: <CalendarToday />, color: '#ec4899' }
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
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ 
                  flex: 1, 
                  minWidth: { xs: 150, sm: 200 },
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }
                }}
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
                size="small"
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  px: { xs: 1.5, sm: 2 }
                }}
              >
                Export
              </Button>
              <IconButton size="small">
                <FilterList fontSize="small" />
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
            minHeight: { xs: 40, sm: 48 },
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              minHeight: { xs: 40, sm: 48 },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 2 }
            },
            '& .MuiTabs-indicator': {
              height: { xs: 2, sm: 3 }
            }
          }}
        >
          <Tab label="All" />
          <Tab label="Bookings" />
          <Tab label="Refunds" />
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
                  <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: index < filteredTransactions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none' }}>
                    {/* Mobile Layout */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <Avatar sx={{
                          backgroundColor: getStatusColor(transaction.status) + '20',
                          color: getStatusColor(transaction.status),
                          width: 36,
                          height: 36,
                          flexShrink: 0
                        }}>
                          <Typography sx={{ fontSize: '1.1rem' }}>
                            {getTypeIcon(transaction.type)}
                          </Typography>
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.85rem',
                              lineHeight: 1.3,
                              pr: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {transaction.title}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(transaction.status)}
                              label={transaction.status.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(transaction.status) + '20',
                                color: getStatusColor(transaction.status),
                                fontWeight: 600,
                                fontSize: '0.6rem',
                                height: 22,
                                flexShrink: 0,
                                ml: 1
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            fontSize: '0.7rem', 
                            mb: 0.3,
                            fontWeight: 500
                          }}>
                            Payment ID: {transaction.paymentId || 'Pending'}
                          </Typography>
                          {transaction.participants && (
                            <Typography variant="caption" color="text.secondary" sx={{ 
                              fontSize: '0.65rem', 
                              display: 'block', 
                              mb: 0.5,
                              opacity: 0.8
                            }}>
                              {transaction.participants} participants
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-end',
                        pt: 1,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            color: transaction.status === 'failed' ? '#ef4444' : 'text.primary',
                            fontSize: '0.95rem',
                            mb: 0.3
                          }}>
                            ₹{transaction.amount.toFixed(2)}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ 
                              fontSize: '0.65rem',
                              opacity: 0.8
                            }}>
                              Base: ₹{transaction.basePrice.toFixed(2)}
                            </Typography>
                            {transaction.discount > 0 && (
                              <Typography variant="caption" color="success.main" sx={{ 
                                fontSize: '0.65rem',
                                fontWeight: 500
                              }}>
                                -₹{transaction.discount.toFixed(2)} discount
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ 
                              fontSize: '0.65rem',
                              opacity: 0.8
                            }}>
                              +₹{transaction.gst.toFixed(2)} GST
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right', ml: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            opacity: 0.9
                          }}>
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Desktop Layout */}
                    <Grid container spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
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
                              Payment ID: {transaction.paymentId || 'Pending'}
                            </Typography>
                            {transaction.participants && (
                              <Typography variant="caption" color="text.secondary">
                                {transaction.participants} participants
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: transaction.status === 'failed' ? '#ef4444' : 'text.primary',
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                          ₹{transaction.amount.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Base: ₹{transaction.basePrice.toFixed(2)}
                        </Typography>
                        {transaction.discount > 0 && (
                          <Typography variant="caption" color="success.main" display="block">
                            -₹{transaction.discount.toFixed(2)} discount
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" display="block">
                          +₹{transaction.gst.toFixed(2)} GST
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
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                            {new Date(transaction.date).toLocaleDateString()}
                          </Typography>
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