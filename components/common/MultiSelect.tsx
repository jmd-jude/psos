// components/common/MultiSelect.tsx
'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface MultiSelectOption {
  id: string;
  name: string;
  description?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[]; // Array of selected IDs
  onChange: (selectedIds: string[]) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  label,
  disabled = false,
  className = '',
}: MultiSelectProps) {
  const handleToggle = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  return (
    <div className={className}>
      {label && (
        <p className="text-sm font-medium mb-3">{label}</p>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-start space-x-3">
            <Checkbox
              id={`multiselect-${option.id}`}
              checked={value.includes(option.id)}
              onCheckedChange={() => handleToggle(option.id)}
              disabled={disabled}
            />
            <div className="grid gap-1.5 leading-none flex-1">
              <Label
                htmlFor={`multiselect-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.name}
              </Label>
              {option.description && (
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-sm text-muted-foreground">No options available</p>
        )}
      </div>
    </div>
  );
}
