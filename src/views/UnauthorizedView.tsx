import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { errorAtom, loadingAtom, loginAtom } from '../state/authStore';
import { useAtomValue, useSetAtom } from 'jotai';

const UnauthorizedView: React.FC = () => {
  const { t } = useTranslation();
  const loading = useAtomValue(loadingAtom);
  const loginError = useAtomValue(errorAtom);
  const tryLogin = useSetAtom(loginAtom);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!login.trim() || !password.trim()) {
      setError(t('auth.fillAllFields'));
      return;
    }

    try {
      tryLogin({ login: login, password: password });
    }
    catch {
      setError(loginError ?? 'Unknown error');
    }

    setError('');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: theme.borderRadius.large,
            textAlign: 'left',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: theme.colors.brandBlue,
              fontWeight: theme.typography.fontWeights.bold,
              mb: 3,
              textAlign: 'center',
            }}
          >
            soljuu.
          </Typography>

          <Typography
            variant="h4"
            fontWeight={theme.typography.fontWeights.semibold}
            gutterBottom
          >
            {t('auth.loginButton')}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('auth.loginSubtitle')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.login')}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="password"
              label={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1.5 }}
            />

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Link
                component="button"
                type="button"
                underline="hover"
                sx={{
                  color: theme.colors.brandBlue,
                  fontWeight: theme.typography.fontWeights.medium,
                }}
              >
                {t('auth.forgotPassword')}
              </Link>
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={loading} 
              sx={{ 
                borderRadius: theme.borderRadius.medium,
                height: theme.height.xxlarge, 
              }}
            >
              {t('auth.loginButton')}
            </Button>
          </Box>

          {error && (
            <Typography 
              variant="body2" 
              color="error.main" 
              sx={{ 
                mt: 2,
                fontWeight: theme.typography.fontWeights.medium,
              }}
            >
              {error}
            </Typography>
          )}

        </Paper>
      </Container>
    </Box>
  );
};

export default UnauthorizedView;
