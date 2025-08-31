import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, 
  Switch, FormControlLabel, Button, Divider, List,
  ListItem, ListItemText, ListItemIcon, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  AccountCircle, Storage, Language, Palette,
  Delete, PrivacyTip, Help, Logout
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showActivity: false,
    allowMessages: true,
    darkMode: false,
    autoSave: true,
    syncData: false
  });
  
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const settingsGroups = [
    {
      title: 'Privacy',
      icon: <AccountCircle />,
      items: [
        { key: 'profileVisibility', label: 'Profile Visibility', description: 'Make your profile visible to other users' },
        { key: 'showActivity', label: 'Show Activity Status', description: 'Let others see when you are active' },
        { key: 'allowMessages', label: 'Allow Messages', description: 'Receive messages from other experiencers' }
      ]
    },
    {
      title: 'Data & Storage',
      icon: <Storage />,
      items: [
        { key: 'autoSave', label: 'Auto-save Preferences', description: 'Automatically save your booking preferences' },
        { key: 'syncData', label: 'Sync Data', description: 'Sync your data across all devices' }
      ]
    },
    {
      title: 'Appearance',
      icon: <Palette />,
      items: [
        { key: 'darkMode', label: 'Dark Mode', description: 'Switch to dark theme' }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Settings
      </Typography>
      
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 3
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                {group.icon}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {group.title}
                </Typography>
              </Box>
              
              {group.items.map((item, itemIndex) => (
                <Box key={item.key}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings[item.key]}
                        onChange={handleSettingChange(item.key)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0, py: 1 }}
                  />
                  {itemIndex < group.items.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <CardContent sx={{ p: 0 }}>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText 
                  primary="Language" 
                  secondary="English (US)"
                />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemIcon>
                  <PrivacyTip />
                </ListItemIcon>
                <ListItemText 
                  primary="Privacy Policy" 
                  secondary="View our privacy policy"
                />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemIcon>
                  <Help />
                </ListItemIcon>
                <ListItemText 
                  primary="Help & Support" 
                  secondary="Get help with your account"
                />
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText 
                  primary="Sign Out" 
                  secondary="Sign out of your account"
                />
              </ListItem>
              <Divider />
              <ListItem 
                button 
                onClick={() => setDeleteDialog(true)}
                sx={{ color: '#ef4444' }}
              >
                <ListItemIcon>
                  <Delete sx={{ color: '#ef4444' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Delete Account" 
                  secondary="Permanently delete your account"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;