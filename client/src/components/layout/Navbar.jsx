import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Button,
  Avatar,
  Box,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FavoriteBorder,
  EmojiEvents,
  BookOnline,
  Groups,
} from '@mui/icons-material';
import './Navbar.css';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar 
      position="fixed" 
      className={`navbar ${visible ? 'navbar-visible' : 'navbar-hidden'}`}
      sx={{ backgroundColor: 'background.paper', backdropFilter: 'blur(10px)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search experiences..."
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton color="inherit">
            <FavoriteBorder />
          </IconButton>
          <IconButton color="inherit">
            <EmojiEvents />
          </IconButton>
          <IconButton color="inherit">
            <BookOnline />
          </IconButton>
          <IconButton color="inherit">
            <Groups />
          </IconButton>
          
          <Button variant="contained" color="primary" size="small">
            Get in First
          </Button>
          <Button variant="contained" color="secondary" size="small">
            Become a Provider
          </Button>
          
          <Avatar sx={{ width: 32, height: 32 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;