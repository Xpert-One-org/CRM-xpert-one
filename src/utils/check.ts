import parsePhoneNumberFromString from 'libphonenumber-js';

export const checkSIRET = (siret: string) => {
  const siretReg = /^[0-9]{14}$/;
  return siretReg.test(siret);
};

export const getYears = ({ data, max }: { data: number; max: number }) => {
  if (!data) return '';
  if (data >= max) return 'ans +';
  if (data > 1) return 'ans';
  if (data == 0) return '';
  return 'an';
};

export const checkLinkedInUrl = (url: string) => {
  const linkedInRegex = /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/.*$/;
  return linkedInRegex.test(url);
};

export const checkPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, {
    extract: false,
  });

  // when it's good
  if (phone?.isValid()) {
    return true;
  } else {
    return false;
  }
};
