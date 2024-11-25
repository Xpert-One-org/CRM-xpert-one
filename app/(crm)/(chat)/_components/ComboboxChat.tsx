'use client';
import Combobox from '@/components/inputs/Combobox';
import useUser from '@/store/useUser';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function ComboboxChat() {
  const [value, setValue] = useState('');
  const [text] = useDebounce(value, 500);

  const [data, setData] = useState<{ label: string; id: string }[]>([]);

  const { loading, searchUsers, searchUserSelected, searchUsersResults } =
    useUser();

  const handleValueChange = async (value: string) => {
    setValue(value);
  };

  const handleSetValue = (value: string) => {
    const selected = data.find((user) => user.label.toLowerCase() === value);
    if (!selected) return;
    useUser.setState({ searchUserSelected: selected });
  };

  useEffect(() => {
    searchUsers(value);
  }, [text]);

  useEffect(() => {
    setData(searchUsersResults);
  }, [searchUsersResults]);

  return (
    <Combobox
      data={data.map((item) => item.label)}
      value={searchUserSelected?.label ?? ''}
      handleSetValue={handleSetValue}
      isLoading={loading}
      handleValueChange={handleValueChange}
      placeholder={searchUserSelected?.label ?? 'Rechercher'}
      className="w-fit text-ellipsis whitespace-nowrap border-border-gray bg-white font-light hover:bg-white"
    />
  );
}
