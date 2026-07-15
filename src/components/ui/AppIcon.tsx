'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface IconProps {
  name: string;
  variant?: 'outline' | 'solid';
  size?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Map common heroicon names to Lucide icon names
const NAME_MAP: Record<string, string> = {
  ArrowLeftIcon: 'ArrowLeft',
  ArrowRightIcon: 'ArrowRight',
  HomeIcon: 'Home',
  QuestionMarkCircleIcon: 'HelpCircle',
  XMarkIcon: 'X',
  CheckIcon: 'Check',
  PlusIcon: 'Plus',
  MinusIcon: 'Minus',
  MagnifyingGlassIcon: 'Search',
  BellIcon: 'Bell',
  UserIcon: 'User',
  Cog6ToothIcon: 'Settings',
  TrashIcon: 'Trash2',
  PencilIcon: 'Pencil',
  EyeIcon: 'Eye',
  EyeSlashIcon: 'EyeOff',
  ChevronDownIcon: 'ChevronDown',
  ChevronUpIcon: 'ChevronUp',
  ChevronLeftIcon: 'ChevronLeft',
  ChevronRightIcon: 'ChevronRight',
  DocumentIcon: 'FileText',
  FolderIcon: 'Folder',
  ShieldCheckIcon: 'ShieldCheck',
  ExclamationTriangleIcon: 'AlertTriangle',
  InformationCircleIcon: 'Info',
};

function Icon({ name, size = 24, className = '', onClick, disabled = false }: IconProps) {
  const lucideName = NAME_MAP[name] || name.replace(/Icon$/, '');

  // Dynamically require the icon from lucide-react
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const lucide = require('lucide-react') as Record<string, React.ComponentType<{ size?: number; className?: string; onClick?: () => void }>>;
  const IconComponent = lucide[lucideName] || HelpCircle;

  return (
    <IconComponent
      size={size}
      className={`${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
    />
  );
}

export default Icon;