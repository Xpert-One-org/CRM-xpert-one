'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { FilterButton } from '@/components/FilterButton';
import { Checkbox } from '@/components/ui/checkbox';

const mockData = {
  xperts: [
    {
      firstName: 'Olivier',
      lastName: 'LATSUE',
      id: 'X ----',
      lastPosition: 'Chef de quart',
      reassignment: 'Olivier LATSUE',
    },
    {
      firstName: 'Aleksander',
      lastName: 'Martin',
      id: 'X ----',
      lastPosition: 'Instrumentiste',
      reassignment: 'Aleksander MARTIN',
    },
    {
      firstName: 'Louis',
      lastName: 'Martin',
      id: 'X ----',
      lastPosition: 'Ingénieur des procédés',
      reassignment: 'Louis MARTIN',
    },
  ],
  suppliers: [
    {
      firstName: 'Olivier',
      lastName: 'LATSUE',
      id: 'F ----',
      company: 'VEOLIA',
      reassignment: 'Marc DUPONT',
    },
    {
      firstName: 'Aleksander',
      lastName: 'Martin',
      id: 'F ----',
      company: 'SÉCHÉE',
      reassignment: 'Aleksander MARTIN',
    },
    {
      firstName: 'Louis',
      lastName: 'Martin',
      id: 'F ----',
      company: 'EDF',
      reassignment: 'Louis MARTIN',
    },
  ],
};

export default function GestionCollaborateursPage() {
  const [activeFilters, setActiveFilters] = useState({
    firstName: '',
    lastName: '',
    id: '',
    lastPosition: '',
    company: '',
    reassignment: '',
  });

  const handleFilterChange = (
    key: keyof typeof activeFilters,
    value: string
  ) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === ' ' ? '' : value,
    }));
  };

  const xpertReassignmentOptions = mockData.xperts.map((xpert) => ({
    label: `${xpert.firstName} ${xpert.lastName}`,
    value: `${xpert.firstName} ${xpert.lastName}`,
  }));

  const supplierReassignmentOptions = mockData.suppliers.map((supplier) => ({
    label: `${supplier.firstName} ${supplier.lastName}`,
    value: `${supplier.firstName} ${supplier.lastName}`,
  }));

  const positionOptions = Array.from(
    new Set(mockData.xperts.map((x) => x.lastPosition))
  ).map((pos) => ({
    label: pos,
    value: pos,
  }));

  const companyOptions = Array.from(
    new Set(mockData.suppliers.map((s) => s.company))
  ).map((company) => ({
    label: company,
    value: company,
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* XPERT Section */}
      <div className="rounded-lg bg-gray-100 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Checkbox id="xpert-selection" />
          <label htmlFor="xpert-selection" className="text-sm font-medium">
            Passer en sélection groupé : "Dernier poste"
          </label>
        </div>

        <div className="mb-4 text-xl font-bold">XPERT</div>

        <div className="grid gap-3">
          {/* Header */}
          <div className="grid grid-cols-5 gap-3">
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={[]}
                onValueChange={(value) =>
                  handleFilterChange('firstName', value)
                }
                placeholder="Prénom"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('lastName', value)}
                placeholder="Nom"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('id', value)}
                placeholder="N° d'identification"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={positionOptions}
                onValueChange={(value) =>
                  handleFilterChange('lastPosition', value)
                }
                placeholder="Dernier poste"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={xpertReassignmentOptions}
                onValueChange={(value) =>
                  handleFilterChange('reassignment', value)
                }
                placeholder="Réaffectation"
              />
            </Box>
          </div>

          {/* Data Rows */}
          {mockData.xperts.map((xpert, index) => (
            <div key={index} className="grid grid-cols-5 gap-3">
              <Box className="flex h-12 items-center px-4">
                {xpert.firstName}
              </Box>
              <Box className="flex h-12 items-center px-4">
                {xpert.lastName}
              </Box>
              <Box className="flex h-12 items-center bg-primary px-4 text-white">
                {xpert.id}
              </Box>
              <Box className="flex h-12 items-center px-4">
                {xpert.lastPosition}
              </Box>
              <Box className="flex h-12 items-center px-4">
                {xpert.reassignment}
              </Box>
            </div>
          ))}
        </div>
      </div>

      {/* FOURNISSEUR Section */}
      <div className="rounded-lg bg-gray-100 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Checkbox id="supplier-selection" />
          <label htmlFor="supplier-selection" className="text-sm font-medium">
            Passer en sélection groupé : "Nom de l'entreprise"
          </label>
        </div>

        <div className="mb-4 text-xl font-bold">FOURNISSEUR</div>

        <div className="grid gap-3">
          {/* Header */}
          <div className="grid grid-cols-5 gap-3">
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={[]}
                onValueChange={(value) =>
                  handleFilterChange('firstName', value)
                }
                placeholder="Prénom"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('lastName', value)}
                placeholder="Nom"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('id', value)}
                placeholder="N° d'identification"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={companyOptions}
                onValueChange={(value) => handleFilterChange('company', value)}
                placeholder="Nom de l'entreprise"
              />
            </Box>
            <Box className="flex h-12 items-center bg-[#FDF6E9]">
              <FilterButton
                options={supplierReassignmentOptions}
                onValueChange={(value) =>
                  handleFilterChange('reassignment', value)
                }
                placeholder="Réaffectation"
              />
            </Box>
          </div>

          {/* Data Rows */}
          {mockData.suppliers.map((supplier, index) => (
            <div key={index} className="grid grid-cols-5 gap-3">
              <Box className="flex h-12 items-center px-4">
                {supplier.firstName}
              </Box>
              <Box className="flex h-12 items-center px-4">
                {supplier.lastName}
              </Box>
              <Box className="flex h-12 items-center bg-primary px-4 text-white">
                {supplier.id}
              </Box>
              <Box className="flex h-12 items-center px-4">
                {supplier.company}
              </Box>
              <Box className="flex h-12 items-center px-4">
                {supplier.reassignment}
              </Box>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-primary text-white">Enregistrer</Button>
      </div>
    </div>
  );
}
