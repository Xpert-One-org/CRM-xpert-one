export const getDocumentLabel = (baseType: string, status: string) => {
  switch (baseType) {
    case 'contrat':
      return status === 'cdi'
        ? 'Contrat'
        : status === 'freelance'
          ? 'Commande société'
          : 'Devis de portage';
    case 'contrat_signed':
      return status === 'cdi'
        ? 'Contrat signé'
        : status === 'freelance'
          ? 'Commande société signée'
          : 'Commande de portage';
    default:
      return '';
  }
};
