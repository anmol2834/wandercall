  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Fixed Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1100,
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        width: '100%'
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2
          }}>
            <motion.div 
              whileHover={{ scale: 1.1, x: -3 }} 
              whileTap={{ scale: 0.9 }}
              animate={{ x: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <IconButton onClick={() => navigate(-1)} size="small">
                <ArrowBack />
              </IconButton>
            </motion.div>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleWishlistToggle} color={isWishlisted ? 'primary' : 'default'} size="small">
                  <motion.div
                    animate={isWishlisted ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isWishlisted ? <Bookmark /> : <BookmarkBorder />}
                  </motion.div>
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleShare} size="small">
                  <Share />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleLocationClick} size="small">
                  <LocationOn />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Chip label={experience.category} color="primary" size="small" />
              </motion.div>
              {experience.badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Chip
                    label={badge}
                    size="small"
                    color={badge === 'Best Seller' ? 'success' : 'warning'}
                  />
                </motion.div>
              ))}
            </Box>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography variant="h4" fontWeight={700} mb={2}>
                {experience.title}
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {experience.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    animate={{ 
                      filter: [
                        "drop-shadow(0px 0px 0px #ffd700)",
                        "drop-shadow(0px 0px 8px #ffd700)",
                        "drop-shadow(0px 0px 0px #ffd700)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rating value={experience.rating} precision={0.1} size="small" readOnly />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {experience.rating}
                    </Typography>
                  </motion.div>
                  <Typography variant="body2" color="text.secondary">
                    ({experience.reviewCount} reviews)
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </motion.div>