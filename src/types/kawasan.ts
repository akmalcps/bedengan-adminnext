export interface Kawasan {
  id: string;
  number: string;
  name: string;
  description: string;
  image: string;
  status: 'active' | 'inactive' | string;
  facilities: string[];
  capacity: string;
}
