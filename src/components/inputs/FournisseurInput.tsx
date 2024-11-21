'use client';

import React, { useState } from 'react';
import Input from './Input';

type FournisseurInputProps = {
  name: string;
  label: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FournisseurInput({
  name,
  label,
  required,
  onChange,
}: FournisseurInputProps) {
  const [value, setValue] = useState('F ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue.length > 0) {
      if (!newValue.startsWith('F')) {
        newValue = `F${newValue.slice(newValue.startsWith('f') ? 1 : 0)}`;
      }

      newValue = newValue.slice(0, 6);

      newValue = newValue.toUpperCase();

      setValue(newValue);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue,
          name: name,
        },
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <Input
      name={name}
      label={label}
      required={required}
      value={value}
      onChange={handleChange}
      maxLength={6}
    />
  );
}
