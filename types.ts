export type Product = {
  id: number;
  name: string;
  category_id: number;
  location_id: number;
  description: string;
  photo: string | null;
  date: string;
};

export interface ProductMutation {
  name: string;
  category_id: number;
  location_id: number;
  description: string;
  photo: string | null;
  date:string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface CategoryMutation {
  name: string;
  description: string | null;
}

export interface Location {
  id: number;
  name: string;
  description: string | null;
}

export interface LocationMutation {
  name: string;
  description: string | null;
}