import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { theme } from '../../theme/theme';

interface ErrorReportDialogProps {
  open: boolean;
  errorMessage: string;
  onClose: () => void;
}

const MAX_LOG_LINES = 12;
const MAX_LOG_CHARS = 1200;

const toShortLogWindow = (value: string): string => {
  const normalized = value?.trim() || 'Unknown error';
  const lines = normalized.split(/\r?\n/).slice(0, MAX_LOG_LINES);
  const joined = lines.join('\n');

  if (joined.length <= MAX_LOG_CHARS) {
    return joined;
  }

  return `${joined.slice(0, MAX_LOG_CHARS)}...`;
};

const ErrorDialog: React.FC<ErrorReportDialogProps> = ({ open, errorMessage, onClose }) => {
  // TODO: translations
  const [copySuccess, setCopySuccess] = useState(false);

  const shortLog = useMemo(() => toShortLogWindow(errorMessage), [errorMessage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortLog);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setCopySuccess(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.borderRadius.medium,
        },
      }}
    >
      <DialogContent sx={{ pt: theme.spacing.lg }}>
        <Typography variant="h6" fontWeight={theme.typography.fontWeights.bold} sx={{ mb: theme.spacing.sm }}>
          Jotain meni vikaan
        </Typography>

        <Typography variant="body2" sx={{ mb: theme.spacing.md, color: theme.colors.text }}>
          Ota yhteyttä toimittajaan ja kopioi oheinen virheilmoitus.
        </Typography>

        <Box
          sx={{
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.small,
            bgcolor: theme.colors.background,
            p: theme.spacing.sm,
            maxHeight: 200,
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {shortLog}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: theme.spacing.lg, pb: theme.spacing.lg, justifyContent: 'space-between' }}>
        <Button onClick={handleCopy} startIcon={<ContentCopyIcon />} sx={{ textTransform: 'none' }}>
          {copySuccess ? 'Copied' : 'Copy to clipboard'}
        </Button>
        <Button variant="contained" onClick={onClose} sx={{ textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
