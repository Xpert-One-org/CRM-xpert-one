'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { FilterButton } from '@/components/FilterButton';
import { Checkbox } from '@/components/ui/checkbox';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

const mockData = {
  xperts: [
    {
      firstName: 'Olivier',
      lastName: 'LATSUE',
      id: 'X ----',
      lastPosition: 'Chef de quart',
      reassignment: 'Olivier LATSUE',
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
    <ProtectedRoleRoutes
      notAllowedRoles={['project_manager', 'intern', 'hr', 'adv']}
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
          <div className="mb-4 flex items-center">
            <div className="flex items-center gap-2">
              <Checkbox />
              <label className="text-sm font-medium">
                Passer en sélection groupé : "Dernier poste"
              </label>
            </div>
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-[#222222]">XPERTS</div>
            </div>
            <div className="w-[250px]" />
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-5 gap-3">
              <FilterButton
                options={[]}
                onValueChange={(value) =>
                  handleFilterChange('firstName', value)
                }
                placeholder="Prénom"
              />
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('lastName', value)}
                placeholder="Nom"
              />
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('id', value)}
                placeholder="N° d'identification"
              />
              <FilterButton
                options={positionOptions}
                onValueChange={(value) =>
                  handleFilterChange('lastPosition', value)
                }
                placeholder="Dernier poste"
              />
              <FilterButton
                options={xpertReassignmentOptions}
                onValueChange={(value) =>
                  handleFilterChange('reassignment', value)
                }
                placeholder="Réaffectation"
              />
            </div>

            {mockData.xperts.map((xpert, index) => (
              <div key={index} className="grid grid-cols-5 gap-3">
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {xpert.firstName}
                </Box>
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {xpert.lastName}
                </Box>
                <Box className="flex h-12 items-center bg-primary px-4 text-white">
                  {xpert.id}
                </Box>
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {xpert.lastPosition}
                </Box>
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {xpert.reassignment}
                </Box>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
          <div className="mb-4 flex items-center">
            <div className="flex items-center gap-2">
              <Checkbox />
              <label className="text-sm font-medium">
                Passer en sélection groupé : "Nom de l'entreprise"
              </label>
            </div>
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-[#222222]">
                FOURNISSEURS
              </div>
            </div>
            <div className="w-[250px]" />
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-5 gap-3">
              <FilterButton
                options={[]}
                onValueChange={(value) =>
                  handleFilterChange('firstName', value)
                }
                placeholder="Prénom"
              />
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('lastName', value)}
                placeholder="Nom"
              />
              <FilterButton
                options={[]}
                onValueChange={(value) => handleFilterChange('id', value)}
                placeholder="N° d'identification"
              />
              <FilterButton
                options={companyOptions}
                onValueChange={(value) => handleFilterChange('company', value)}
                placeholder="Nom de l'entreprise"
              />
              <FilterButton
                options={supplierReassignmentOptions}
                onValueChange={(value) =>
                  handleFilterChange('reassignment', value)
                }
                placeholder="Réaffectation"
              />
            </div>
            {mockData.suppliers.map((supplier, index) => (
              <div key={index} className="grid grid-cols-5 gap-3">
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {supplier.firstName}
                </Box>
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {supplier.lastName}
                </Box>
                <Box className="flex h-12 items-center bg-primary px-4 text-white">
                  {supplier.id}
                </Box>
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {supplier.company}
                </Box>
                <Box className="flex h-12 items-center bg-[#F5F5F5] px-4">
                  {supplier.reassignment}
                </Box>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-primary px-spaceLarge py-spaceContainer text-white">
            Enregistrer
          </Button>
        </div>
      </div>
    </ProtectedRoleRoutes>
  );
}
