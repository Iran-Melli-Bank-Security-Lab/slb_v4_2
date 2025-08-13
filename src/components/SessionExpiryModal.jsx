// src/components/SessionExpiryModal.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getExpiryMs() {
  // Prefer explicit timestamp if you store it at login
  const stored = sessionStorage.getItem('sessionExpiresAt') || localStorage.getItem('sessionExpiresAt');
  if (stored && !Number.isNaN(Number(stored))) {
    return Number(stored);
  }
  // Fallback: read JWT exp from accessToken
  const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const decoded = token ? decodeJwt(token) : null;
  if (decoded?.exp) return decoded.exp * 1000; // exp is in seconds
  return null;
}

export default function SessionExpiryModal() {
  const [open, setOpen] = useState(false);

  const schedule = useCallback(() => {
    const exp = getExpiryMs();
    if (!exp) return; // nothing to schedule
    const diff = exp - Date.now();

    if (diff <= 0) {
      setOpen(true);
      return;
    }
    const id = setTimeout(() => setOpen(true), diff + 250);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const cleanup = schedule();

    // Re-check when tab becomes visible again
    const onVisibility = () => {
      if (!document.hidden) {
        if (cleanup) cleanup();
        schedule();
      }
    };

    // Allow manual trigger on 401s, etc.
    const onForcedExpire = () => setOpen(true);

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('session-expired', onForcedExpire);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('session-expired', onForcedExpire);
      if (cleanup) cleanup();
    };
  }, [schedule]);

  const handleOk = () => {
    setOpen(false);
    try {
      // Wipe auth/session state (adjust keys to your app)
      sessionStorage.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionExpiresAt');
    } catch {}
    // Hard redirect ensures a clean slate
    window.location.assign('/sign-in');
  };

  return (
    <Dialog open={open} aria-labelledby="session-expired-title">
      <DialogTitle id="session-expired-title">Session expired</DialogTitle>
      <DialogContent>
        <Typography>Your session has ended. Please sign in again.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} autoFocus>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
