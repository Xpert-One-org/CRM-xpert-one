export function deepEqual({
  obj1,
  obj2DB,
}: {
  obj1: any;
  obj2DB: any;
}): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2DB);
}
