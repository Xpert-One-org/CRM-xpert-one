export const getFileStatus = (type: string, status: string) => {
  if (type.includes('signed')) {
    return {
      sentLabel: 'Signé le',
      notSentLabel: 'Non reçu',
    };
  }

  const hasUploadButton = (type: string) => {
    return (
      type === 'recap_mission' ||
      (type === 'contrat' && status !== 'portage') ||
      (type === 'commande' && status === 'portage') ||
      (type === 'commande_societe' && status === 'freelance')
    );
  };

  if (hasUploadButton(type)) {
    return {
      sentLabel: 'Envoyé le',
      notSentLabel: 'Non envoyé',
    };
  }

  return {
    sentLabel: 'Reçu le',
    notSentLabel: 'Non reçu',
  };
};
