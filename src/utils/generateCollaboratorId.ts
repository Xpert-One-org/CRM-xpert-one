export const generateCollaboratorId = () => {
  const randomNum = 1000 + Math.floor(Math.random() * 9000);
  return `C ${randomNum}`;
};
