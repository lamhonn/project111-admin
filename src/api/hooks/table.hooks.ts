import type { TableMonitorViewModel } from '../../viewModels';

const EMPTY_TABLE_MONITOR: TableMonitorViewModel[] = [];

export const useGetTableMonitor = () => {
  return {
    data: EMPTY_TABLE_MONITOR,
    loading: false,
    error: undefined,
  } as const;
};
