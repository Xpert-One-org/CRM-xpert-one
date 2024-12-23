export type FileType =
  // cdi
  | 'recap_mission_cdi'
  | 'recap_mission_cdi_signed'
  | 'contrat_cdi'
  | 'contrat_signed_cdi'
  // freelance
  | 'recap_mission_freelance'
  | 'recap_mission_signed_freelance'
  | 'commande_societe_freelance'
  | 'commande_societe_signed_freelance'
  // portage
  | 'recap_mission_portage'
  | 'recap_mission_signed_portage'
  | 'commande_portage'
  | 'devis_portage'
  // fournisseur
  | 'devis'
  | 'devis_signed'
  | 'contrat_commande'
  // facturation
  | 'salary_sheet'
  | 'invoice_received'
  | 'invoice_paid'
  | 'presence_sheet_signed'
  | 'presence_sheet_validated'
  // facturation fournisseur
  | 'invoice';

export type DownloadType = {
  type: string;
  isTemplate?: boolean;
};

export type FileStatuses = Record<
  string,
  {
    xpertFiles: { year: number; month: number; createdAt: string }[];
    fournisseurFiles: { year: number; month: number; createdAt: string }[];
    noFilesFound: boolean;
  }
>;

export type PaymentStatus = {
  period: string;
  payment_date: string;
};
