import { Box, Typography, Paper } from '@mui/material';
import { theme } from '../../theme';

interface ProductEditorCardProps {
  id: string;
  name: string;
  description: string;
  onClick: (id: string) => void;
}

export default function ProductEditorCard({
  id,
  name,
  description,
  onClick,
}: ProductEditorCardProps) {

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
      <Box sx={{ display: 'flex', flexDirection:'row', gap: theme.spacing.md }}>
        {/* Product Image */}
        <Box
          sx={{
            width: 120,
            height: 120,
            flexShrink: 0,
            bgcolor: 'grey.200',
            borderRadius: theme.borderRadius.small,
            mb: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'grey.500', fontSize: '0.75rem' }}>
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
              WebkitLineClamp: 2,
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
