import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';

interface Table {
  id: string;
  number: number;
  status: 'active' | 'inactive';
  progress: number;
  items: number;
  value: number;
  guestName?: string;
}

export default function TableView() {
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Replace with actual data from Jotai atoms and API hooks
  const tables: Table[] = [
    { id: 'T001', number: 1, status: 'active', progress: 100, items: 12, value: 290, guestName: 'Smith' },
    { id: 'T002', number: 2, status: 'active', progress: 75, items: 4, value: 180, guestName: 'Johnson' },
    { id: 'T003', number: 3, status: 'active', progress: 60, items: 6, value: 190, guestName: 'Brown' },
    { id: 'T004', number: 4, status: 'active', progress: 40, items: 3, value: 90, guestName: 'Davis' },
    { id: 'T005', number: 5, status: 'active', progress: 18, items: 6, value: 102, guestName: 'Wilson' },
    { id: 'T006', number: 6, status: 'inactive', progress: 0, items: 0, value: 0 },
    { id: 'T007', number: 7, status: 'inactive', progress: 0, items: 0, value: 0 },
    { id: 'T008', number: 8, status: 'inactive', progress: 0, items: 0, value: 0 },
  ];

  const filteredTables = tables.filter(table => 
    table.number.toString().includes(searchQuery) ||
    table.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTables = filteredTables.filter(t => t.status === 'active');
  const inactiveTables = filteredTables.filter(t => t.status === 'inactive');

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'grey.50' }}>
      {/* Main Monitor Area */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: theme.typography.fontWeights.semibold }}>
          Table Monitor
        </Typography>

        {/* Active Tables Grid */}
        {activeTables.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              Active Tables
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}>
              {activeTables.map((table) => (
                <Paper
                  key={table.id}
                    onClick={() => setSelectedTable(table.id)}
                    sx={{
                      p: 3,
                      bgcolor: theme.colors.primary,
                      color: 'white',
                      borderRadius: theme.borderRadius.medium,
                      cursor: 'pointer',
                      transition: theme.transitions.normal,
                      border: selectedTable === table.id ? `3px solid ${theme.colors.primaryHover}` : 'none',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows.lg,
                        bgcolor: theme.colors.primaryHover,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'rgba(255,255,255,0.3)', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'rgba(255,255,255,0.3)', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'rgba(255,255,255,0.3)', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                    </Box>
                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: theme.typography.fontWeights.semibold }}>
                      {t('common.table')} {table.number}
                    </Typography>
                    {table.guestName && (
                      <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.9, mt: 1 }}>
                        {table.guestName}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'rgba(255,255,255,0.3)', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'rgba(255,255,255,0.3)', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'rgba(255,255,255,0.3)', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                    </Box>
                  </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Inactive Tables Grid */}
        {inactiveTables.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              Available Tables
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}>
              {inactiveTables.map((table) => (
                <Paper
                  key={table.id}
                    sx={{
                      p: 3,
                      bgcolor: 'background.paper',
                      color: 'text.secondary',
                      borderRadius: theme.borderRadius.medium,
                      border: `1px solid ${theme.colors.border}`,
                      cursor: 'default',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'grey.300', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'grey.300', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'grey.300', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                    </Box>
                    <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: theme.typography.fontWeights.medium }}>
                      {t('common.table')} {table.number}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'grey.300', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'grey.300', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: 'grey.300', 
                        borderRadius: theme.borderRadius.small 
                      }} />
                    </Box>
                  </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Side Panel */}
      <Paper sx={{ 
        width: 380, 
        p: 3, 
        borderRadius: 0,
        borderLeft: `1px solid ${theme.colors.border}`,
        overflow: 'auto',
      }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: theme.typography.fontWeights.semibold }}>
          Table Information
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search tables, guests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <TuneIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Table List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activeTables.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No active tables
            </Typography>
          )}
          {activeTables.map((table) => (
            <Paper
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              sx={{
                p: 2,
                bgcolor: selectedTable === table.id ? 'grey.50' : 'background.paper',
                border: `1px solid ${selectedTable === table.id ? theme.colors.primary : theme.colors.border}`,
                borderRadius: theme.borderRadius.small,
                cursor: 'pointer',
                transition: theme.transitions.fast,
                '&:hover': {
                  borderColor: theme.colors.primary,
                  bgcolor: 'grey.50',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {table.id}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: theme.typography.fontWeights.semibold }}>
                    {t('common.table')} {table.number}
                  </Typography>
                  {table.guestName && (
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                      {table.guestName}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {table.items} items • €{table.value.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={table.progress}
                    size={50}
                    thickness={4}
                    sx={{
                      color: theme.colors.primary,
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: theme.typography.fontWeights.semibold }}>
                      {table.progress}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    borderColor: theme.colors.border,
                    color: 'text.primary',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: theme.colors.primary,
                      bgcolor: theme.colors.primaryLight,
                    },
                  }}
                >
                  Details
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{
                    bgcolor: theme.colors.primary,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: theme.colors.primaryHover,
                    },
                  }}
                >
                  Complete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
