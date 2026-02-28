export interface DescriptionItem {
  id: string;
  namaBarang: string;
  warna: string;
  tekstur: string;
  ukuran: string;
  rasa: string;
  manfaat: string;
}

export interface MultisensoryNote {
  itemName: string;
  imageUrl?: string;
  observations: string;
}
