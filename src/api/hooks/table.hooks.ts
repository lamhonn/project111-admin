import type { TableMonitorViewModel } from '../../viewModels';
import { MOCK_TABLE_MONITOR } from '../mockData/tables.mock';

const EMPTY_TABLE_MONITOR: TableMonitorViewModel[] = MOCK_TABLE_MONITOR;

export const useGetTableMonitor = () => {
  return {
    data: EMPTY_TABLE_MONITOR,
    loading: false,
    error: undefined,
  } as const;
};
