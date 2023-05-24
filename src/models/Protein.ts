export interface Protein {
  primaryAccession?: string;
  features?: Feature[];
  organism?: {
    scientificName: string;
  };
  genes?: { geneName: { value: string } }[];
  sequence?: {
    length: number;
    molWeight: number;
    crc64: string;
    value: string;
  };
  entryAudit?: { lastSequenceUpdateDate: Date };
  uniProtkbId?: string;
}

export interface Feature {
  type: string;
  description: string;
}
