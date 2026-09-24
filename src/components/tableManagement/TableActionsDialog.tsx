import { Box, Button, CircularProgress, Dialog, DialogContent } from "@mui/material";
import { useTranslation } from "react-i18next";

import { theme } from '../../theme/theme';
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom, setEndSessionAtom } from "../../state/sessionStore";
import { Session } from "../../types/models";


interface TableActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

export default function TableActionsDialog({
    isOpen,
    onClose,
    session,
}: TableActionsDialogProps) {
    const { t } = useTranslation();

    const loading = useAtomValue(loadingAtom);
    const endSession = useSetAtom(setEndSessionAtom);

    // const handleDiscard = () => {
    //     if (!session) return;

    //     onClose();
    // };

    const handleFinalize = () => {
        if (!session) return;
        endSession(session.id);

        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: theme.borderRadius.large,
                },
            }}
        >
        <DialogContent sx={{ p: theme.spacing.lg }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {/* TODO: enable again when table locking feature has been enabled */}
            {/* <Button
              onClick={handleToggleLockAction}
              variant="outlined"
              fullWidth
              sx={{
                // TODO: add table locked conditional styles when Table Locked feature is implemented
                borderColor: table.locked ? 'grey.600' : theme.colors.primary,
                color: table.locked ? 'grey.700' : theme.colors.primary,
                fontWeight: theme.typography.fontWeights.semibold,
                textTransform: 'none',
                py: theme.spacing.md,
                borderRadius: theme.borderRadius.xlarge,
                '&:hover': {
                  borderColor: table.locked ? 'grey.800' : theme.colors.primaryHover,
                  backgroundColor: table.locked ? 'grey.100' : theme.colors.primaryLight,
                },
              }}
            >
              {table.locked ? t('tableDialog.unlockTable') : t('tableDialog.lockTable')}
            </Button> */}
            {/* <Button
              onClick={handleDiscard}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
                fontWeight: theme.typography.fontWeights.semibold,
                textTransform: 'none',
                py: theme.spacing.md,
                borderRadius: theme.borderRadius.xlarge,
                '&:hover': {
                  borderColor: theme.colors.primaryHover,
                  backgroundColor: theme.colors.primaryLight,
                },
              }}
            >
              {t('tableDialog.discard')}
            </Button> */}
            <Button
              onClick={handleFinalize}
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
              sx={{
                backgroundColor: theme.colors.primary,
                color: 'white',
                fontWeight: theme.typography.fontWeights.semibold,
                textTransform: 'none',
                py: theme.spacing.md,
                borderRadius: theme.borderRadius.xlarge,
                '&:hover': {
                  backgroundColor: theme.colors.primaryHover,
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              {t('tableDialog.finalize')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
}