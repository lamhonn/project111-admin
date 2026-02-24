import { MOCK_TABLES } from '../mockData/table.mock';
import { toTableMonitorViewModel } from '../../viewModels';

const ACTIVE_TABLE_OVERRIDES: Record<string, { progress: number; items: number; value: number; guestName: string }> = {
  T001: { progress: 100, items: 12, value: 290, guestName: 'Smith' },
  T002: { progress: 75, items: 4, value: 180, guestName: 'Johnson' },
  T003: { progress: 60, items: 6, value: 190, guestName: 'Brown' },
  T004: { progress: 40, items: 3, value: 90, guestName: 'Davis' },
  T005: { progress: 18, items: 6, value: 102, guestName: 'Wilson' },
};

export const useGetTableMonitor = () => {
  const data = MOCK_TABLES.map((table) => {
    const base = toTableMonitorViewModel(table);
    const activeOverride = ACTIVE_TABLE_OVERRIDES[table.Id];

    if (!activeOverride) {
      return {
        ...base,
        status: 'inactive' as const,
      };
    }

    return {
      ...base,
      status: 'active' as const,
      progress: activeOverride.progress,
      items: activeOverride.items,
      value: activeOverride.value,
      guestName: activeOverride.guestName,
    };
  });

  return {
    data,
    loading: false,
    error: undefined,
  } as const;
};
