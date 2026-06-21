"use client"

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  CircularProgress,
  Alert,
  Snackbar,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useAppState } from "@/lib/store"; // Connects directly to your state store hooks

export default function LoginView() {
  const { login } = useAppState();
  const [username, setUsername] = useState<string>(''); // Maps directly to your backend email payload
  const [pin, setPin] = useState<string>('');          // Maps directly to your backend password payload
  const [showPin, setShowPin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Blocks server-side rendering mismatch issues entirely by mounting exclusively inside the browser environment
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (e) e.preventDefault();
    if (!username.trim() || !pin) return;

    setLoading(true);

    try {
      // Connect to the store auth pipeline
      await login(username.trim(), pin.trim());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ဆာဗာနှင့် ချိတ်ဆက်မှု မအောင်မြင်ပါ။';
      setAlertMessage(errorMessage);
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Render a clean fallback matching your background design to handle the Next.js server pre-rendering phase
  if (!isMounted) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          backgroundColor: { xs: '#ffffff', sm: '#FDF8F9' },
        }}
      />
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: { xs: '#ffffff', sm: '#FDF8F9' },
        px: { xs: 3, sm: 4 },
        py: 4,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '400px', md: '440px' },
          backgroundColor: '#ffffff',
          borderRadius: { xs: '0px', sm: '16px' },
          // Pure flat design principles - zero drop shadows
          boxShadow: 'none',
          border: { xs: 'none', sm: '1px solid #F5E1E5' },
          p: { xs: 0, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          }}
      >
        {/* Brand Icon Module Container */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mb: 4
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: '#2563EB', 
              width: { xs: 56, sm: 64 }, 
              height: { xs: 56, sm: 64 },
              boxShadow: 'none'
            }}
          >
            <LockOutlined sx={{ fontSize: { xs: 32, sm: 36 } }} />
          </Avatar>
        </Box>

        {/* Heading Typography Group */}
        <Box sx={{ mb: 5, textAlign: { xs: 'left', sm: 'center' } }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              color: '#2D1520', 
              letterSpacing: '-0.025em',
              fontSize: { xs: '1.5rem', sm: '1.75rem' }
            }}
          >
            ပြန်လည်ကြိုဆိုပါသည်
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#C4A3AF', 
              mt: 1.5, 
              lineHeight: 1.6,
              fontSize: '0.9rem'
            }}
          >
            Orbit POS စနစ်အတွင်းဝင်ရောက်ရန် အီးမေးလ်နှင့် လျှို့ဝှက်နံပါတ် ဖြည့်စွက်ပါ
          </Typography>
        </Box>

        {/* Action Form Grid */}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: '100%' }}>
          
          {/* Email/Username Form Block */}
          <Box sx={{ mb: 3.5 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                color: '#2D1520', 
                mb: 1.2, 
                letterSpacing: 0.2,
                fontSize: '0.85rem'
              }}
            >
              အီးမေးလ်လိပ်စာ (Email)
            </Typography>
            <TextField
              variant="filled"
              fullWidth
              placeholder="example@gmail.com"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              disabled={loading}
              autoCapitalize="none"
              hiddenLabel
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#FDF8F9',
                  borderRadius: '8px',
                  border: '1px solid #F5E1E5',
                  '&:before': { display: 'none' },
                  '&:after': { display: 'none' },
                  '&:hover': { 
                    backgroundColor: '#F5E1E5',
                  },
                  '&.Mui-focused': { 
                    backgroundColor: '#ffffff',
                    borderColor: '#2563EB'
                  },
                  input: { color: '#2D1520', px: 2, py: 1.75 }
                },
              }}
            />
          </Box>

          {/* Password/PIN Form Block */}
          <Box sx={{ mb: 5 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                color: '#2D1520', 
                mb: 1.2, 
                letterSpacing: 0.2,
                fontSize: '0.85rem'
              }}
            >
              လျှို့ဝှက်နံပါတ် (PIN)
            </Typography>
            <TextField
              variant="filled"
              fullWidth
              type={showPin ? 'text' : 'password'}
              placeholder="ဝင်ရောက်ရန် PIN ကုဒ် ရိုက်ထည့်ပါ"
              value={pin}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}
              disabled={loading}
              hiddenLabel
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end" sx={{ pr: 1 }}>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPin(!showPin)}
                      edge="end"
                      sx={{ color: '#C4A3AF' }}
                    >
                      {showPin ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#FDF8F9',
                  borderRadius: '8px',
                  border: '1px solid #F5E1E5',
                  '&:before': { display: 'none' },
                  '&:after': { display: 'none' },
                  '&:hover': { 
                    backgroundColor: '#F5E1E5',
                  },
                  '&.Mui-focused': { 
                    backgroundColor: '#ffffff',
                    borderColor: '#2563EB'
                  },
                  input: { color: '#2D1520', px: 2, py: 1.75 }
                },
              }}
            />
          </Box>

          {/* Form Action Submit Trigger */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!username.trim() || !pin || loading}
            sx={{
              height: '54px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#2563EB',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                backgroundColor: '#FDF8F9',
                color: '#C4A3AF',
                border: '1px solid #F5E1E5'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#ffffff' }} />
            ) : (
              'စနစ်ထဲသို့ ဝင်မည်'
            )}
          </Button>
        </Box>
      </Box>

      {/* Snackbar Alert Notifications */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            bgcolor: '#2563EB'
          }}
        >
          <strong>စနစ်သတိပေးချက်: </strong> {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}