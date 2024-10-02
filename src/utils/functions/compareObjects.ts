// export function isEmpty(value: any): boolean {
//   return (
//     value === null ||
//     value === undefined ||
//     value === '' ||
//     (Array.isArray(value) && value.length === 0) ||
//     (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0)
//   );
// }

// export function compareObjects({obj1, obj2}: {obj1: Record<string, any>, obj2: Record<string, any>}): boolean {
//   for (const key in obj1) {
//     if (obj1.hasOwnProperty(key)) {
//       const value1 = obj1[key];
//       const value2 = obj2[key];

//       if (typeof value1 === 'object' && value1 !== null && !Array.isArray(value1)) {
//         if (compareObjects({obj1: value1, obj2: value2})) {
//           return true;
//         }
//       } else if (isEmpty(value1) && !isEmpty(value2)) {
//         return true;
//       }
//     }
//   }
//   return false;
// }
