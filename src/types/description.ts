export interface DescriptionItem {
  id: string;
  namaBarang: string;
  deskripsi: string;
  khasiat: string;
}

export interface MindMapNode {
  label: string;
  children: { label: string; value: string }[];
}
