import { Box, Typography, Paper } from '@mui/material';
import { theme } from '../../theme';

interface ProductEditorCardProps {
  id: number;
  name: string;
  description: string;
  viewMode: 'grid' | 'list';
  onClick: (id: number) => void;
}

export default function ProductEditorCard({
  id,
  name,
  description,
  viewMode,
  onClick,
}: ProductEditorCardProps) {
  const isListMode = viewMode === 'list';

  return (
    <Paper
      onClick={() => onClick(id)}
      sx={{
        p: theme.spacing.md,
        borderRadius: theme.borderRadius.small,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: 1,
        cursor: 'pointer',
        transition: theme.transitions.normal,
        '&:hover': {
          boxShadow: theme.shadows.primary,
          borderColor: theme.colors.primary,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: isListMode ? 'row' : 'column', gap: isListMode ? theme.spacing.md : 0 }}>
        {/* Product Image */}
        <Box
          sx={{
            width: isListMode ? 120 : '100%',
            height: isListMode ? 120 : 200,
            flexShrink: 0,
            bgcolor: 'grey.200',
            borderRadius: theme.borderRadius.small,
            mb: isListMode ? 0 : theme.spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'grey.500', fontSize: isListMode ? '0.75rem' : '1rem' }}>
            Product Image
          </Typography>
        </Box>

        {/* Content Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            component="div"
            fontWeight={theme.typography.fontWeights.semibold}
            sx={{ mb: theme.spacing.sm }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: theme.spacing.md,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: isListMode ? 2 : 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
