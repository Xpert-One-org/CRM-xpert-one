'use client';

import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from 'react-simple-maps';
import { countryNameToIsoMap } from './country.mapping';
import { getCountryName, prepareCountryData } from './country.utils';

// Utiliser une version du fichier qui fonctionne bien avec la projection mercator
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export type CountryData = {
  country: string;
  count: number;
};

type WorldMapChartProps = {
  data: CountryData[];
  className?: string;
};

const WorldMapChart = ({ data, className }: WorldMapChartProps) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Suivre la position de la souris sur le composant
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Couleur jaune pour les pays avec des xperts
  const highlightColor = '#faa200'; // Jaune
  const hoverHighlightColor = '#faa220'; // Jaune légèrement plus foncé au survol

  // Convertir les données en format utilisable par la carte
  const countryCountMap = prepareCountryData(data);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={{ height: '500px' }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 110,
          center: [0, 30], // Centre fixe pour une vue optimale du monde
        }}
        width={800}
        height={400}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Ajouter une sphère et des lignes de quadrillage pour améliorer la visualisation */}
        <Sphere
          id="rsm-sphere"
          stroke="#DDD"
          strokeWidth={0.5}
          fill="transparent"
        />
        <Graticule id="rsm-graticule" stroke="#DDD" strokeWidth={0.5} />

        {/* Suppression du composant ZoomableGroup pour désactiver le zoom et le déplacement */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // Obtenir le nom du pays depuis les propriétés
              const geoName = geo.properties.name;

              // Utiliser notre mapping direct pour obtenir le code ISO
              const countryCode = geoName
                ? countryNameToIsoMap[geoName]
                : undefined;

              // Si on a trouvé un code pays, on récupère le nombre d'Xperts pour ce pays
              const value = countryCode ? countryCountMap[countryCode] : 0;
              const isHighlighted =
                !!countryCode && countryCountMap[countryCode] > 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? highlightColor : '#F5F5F5'}
                  stroke="#D6D6DA"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: {
                      outline: 'none',
                      fill: isHighlighted ? hoverHighlightColor : '#E5E5E5',
                      cursor: isHighlighted ? 'pointer' : 'default',
                    },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={() => {
                    // Toujours afficher le pays au survol, même s'il n'y a pas d'experts
                    const displayName = countryCode
                      ? getCountryName(countryCode)
                      : geoName || 'Inconnu';

                    if (isHighlighted) {
                      setTooltipContent(
                        `${displayName}: ${value} Xpert${value > 1 ? 's' : ''}`
                      );
                    } else if (geoName) {
                      // Seulement afficher pour les pays valides
                      setTooltipContent(`${displayName}: 0 Xpert`);
                    }
                    setIsTooltipVisible(!!geoName); // N'activer la tooltip que si on a un nom
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                    setIsTooltipVisible(false);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {isTooltipVisible && tooltipContent && (
        <div
          className="pointer-events-none absolute z-10 rounded bg-white px-2 py-1 text-sm shadow-lg"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 40}px`,
            transform: 'translateX(-50%)',
            minWidth: '120px',
            textAlign: 'center',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default WorldMapChart;
