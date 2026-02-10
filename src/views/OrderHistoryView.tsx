import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';

export default function OrderHistoryView() {
  const { t } = useTranslation();

  // Define table columns
  const columns: GridColDef[] = [
    { 
      field: 'orderNumber', 
      headerName: t('orderHistory.orderNumber'), 
      width: 150,
      sortable: true,
    },
    { 
      field: 'date', 
      headerName: t('orderHistory.date'), 
      width: 180,
      sortable: true,
    },
    { 
      field: 'table', 
      headerName: t('orderHistory.table'), 
      width: 100,
      sortable: true,
    },
    { 
      field: 'items', 
      headerName: t('orderHistory.items'), 
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'total', 
      headerName: t('orderHistory.total'), 
      width: 120,
      sortable: true,
      valueFormatter: (value: number) => `€${value.toFixed(2)}`,
    },
    { 
      field: 'status', 
      headerName: t('orderHistory.status'), 
      width: 130,
      sortable: true,
    },
    { 
      field: 'server', 
      headerName: t('orderHistory.server'), 
      width: 150,
      sortable: true,
    },
  ];

  // Mock data - replace with actual data fetching
  const mockOrders = [
    { id: 1, orderNumber: 'ORD-2026-001', date: '2026-02-10 14:23', table: 'A1', items: 4, total: 45.50, status: 'Completed', server: 'John Doe' },
    { id: 2, orderNumber: 'ORD-2026-002', date: '2026-02-10 14:15', table: 'B3', items: 2, total: 28.00, status: 'Completed', server: 'Jane Smith' },
    { id: 3, orderNumber: 'ORD-2026-003', date: '2026-02-10 13:45', table: 'C2', items: 6, total: 67.80, status: 'Completed', server: 'John Doe' },
    { id: 4, orderNumber: 'ORD-2026-004', date: '2026-02-10 13:30', table: 'A5', items: 3, total: 32.50, status: 'Completed', server: 'Mike Johnson' },
    { id: 5, orderNumber: 'ORD-2026-005', date: '2026-02-10 12:50', table: 'D1', items: 5, total: 54.20, status: 'Completed', server: 'Jane Smith' },
    { id: 6, orderNumber: 'ORD-2026-006', date: '2026-02-10 12:30', table: 'B1', items: 2, total: 22.00, status: 'Completed', server: 'John Doe' },
    { id: 7, orderNumber: 'ORD-2026-007', date: '2026-02-10 11:45', table: 'C4', items: 7, total: 89.90, status: 'Completed', server: 'Mike Johnson' },
    { id: 8, orderNumber: 'ORD-2026-008', date: '2026-02-09 19:20', table: 'A3', items: 4, total: 48.50, status: 'Completed', server: 'Jane Smith' },
    { id: 9, orderNumber: 'ORD-2026-009', date: '2026-02-09 18:55', table: 'B2', items: 3, total: 36.00, status: 'Completed', server: 'John Doe' },
    { id: 10, orderNumber: 'ORD-2026-010', date: '2026-02-09 18:30', table: 'D3', items: 5, total: 62.40, status: 'Completed', server: 'Mike Johnson' },
  ];

  return (
    <Box sx={{ bgcolor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: theme.spacing.lg }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.colors.brandWhite,
            fontWeight: theme.typography.fontWeights.bold,
          }}
        >
          {t('orderHistory.title')}
        </Typography>
      </Box>

      {/* Data Grid */}
      <Paper
        sx={{
          m: theme.spacing.md,
          width: '90%',
          borderRadius: theme.borderRadius.small,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: 1,
        //   overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={mockOrders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.colors.border,
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: theme.colors.primaryLight,
              borderColor: theme.colors.border,
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: theme.colors.border,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
