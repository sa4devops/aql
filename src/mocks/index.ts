import { RECORDS, RECORD_TYPES, WORKFLOWS, ACTIONS, USERS, DEPARTMENTS } from './data';
import type { SimulationMode } from './types';

// Artificial delay simulator — Backend integration point
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getDelay = (mode: SimulationMode) => {
  if (mode === 'loading') return 3000;
  return 400;
};

export const mockApi = {
  getRecords: async (mode: SimulationMode = 'normal') => {
    await delay(getDelay(mode));
    if (mode === 'error') throw new Error('فشل تحميل السجلات. تحقق من الاتصال وأعد المحاولة.');
    if (mode === 'empty') return [];
    return RECORDS;
  },
  getRecordTypes: async (mode: SimulationMode = 'normal') => {
    await delay(getDelay(mode));
    if (mode === 'error') throw new Error('فشل تحميل أنواع السجلات.');
    if (mode === 'empty') return [];
    return RECORD_TYPES;
  },
  getWorkflows: async (mode: SimulationMode = 'normal') => {
    await delay(getDelay(mode));
    if (mode === 'error') throw new Error('فشل تحميل مسارات العمل.');
    if (mode === 'empty') return [];
    return WORKFLOWS;
  },
  getActions: async (mode: SimulationMode = 'normal') => {
    await delay(getDelay(mode));
    if (mode === 'error') throw new Error('فشل تحميل الإجراءات.');
    if (mode === 'empty') return [];
    return ACTIONS;
  },
  getActionById: async (id: string, mode: SimulationMode = 'normal') => {
    await delay(getDelay(mode));
    if (mode === 'error') throw new Error('فشل تحميل تفاصيل الإجراء.');
    const action = ACTIONS.find(a => a.id === id);
    if (!action) throw new Error('الإجراء غير موجود.');
    return action;
  },
  getUsers: async () => {
    await delay(200);
    return USERS;
  },
  getDepartments: async () => {
    await delay(200);
    return DEPARTMENTS;
  },
};

export { RECORDS, RECORD_TYPES, WORKFLOWS, ACTIONS, USERS, DEPARTMENTS };