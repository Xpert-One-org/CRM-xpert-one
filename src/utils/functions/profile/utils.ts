import type { DBUser } from '@/types/typesDb';

export const getUnMatchedEntries = ({
  user,
  userDb,
}: {
  user: DBUser;
  userDb: DBUser;
}) =>
  Object.entries(user).filter(([key, value]) => {
    return value !== userDb[key as keyof DBUser];
  });

export const getElementNotNull = ({
  user,
  ignoreRow,
}: {
  user: DBUser;
  ignoreRow: string[];
}) =>
  Object.entries(user).filter(([key, value]) => {
    return value !== null && value !== '' && !ignoreRow.includes(key);
  });

export const getProgress = ({
  elementNotNull,
  elementsInDom,
}: {
  elementNotNull: number;
  elementsInDom: number;
}) => {
  const result = Math.round((elementNotNull * 100) / elementsInDom);
  if (result > 100) {
    throw new Error('Progression cannot be greater than 100');
  }
  return result;
};
