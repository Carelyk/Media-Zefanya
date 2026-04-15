export interface DescriptionItem {
  id: string;
  namaBarang: string;
  warna: string;
  tekstur: string;
  rasa: string;
  aroma: string;
  bunyi: string;
  manfaat: string;
}

export interface MultisensoryNote {
  itemName: string;
  imageUrl?: string;
  observations: string;
}
