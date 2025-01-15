import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function areObjectsEqual(obj1: any, obj2: any): boolean {
  if (obj1 === null && obj2 === null) return true;
  if (obj1 === null || obj2 === null) return false;

  // Si ce ne sont pas des objets, comparaison directe
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }

  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);
  if (isArray1 !== isArray2) return false;

  // Compare les clés
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  // Vérifie récursivement chaque propriété
  return keys1.every((key) => {
    if (!keys2.includes(key)) return false;
    return areObjectsEqual(obj1[key], obj2[key]);
  });
}

export function transformArray(arrayOfObjects: any[]) {
  // Réduire le tableau en un seul objet
  return arrayOfObjects.reduce((result, currentObject) => {
    // Pour chaque objet, on fusionne ses propriétés avec le résultat
    return {
      ...result,
      ...currentObject,
    };
  }, {});
}
