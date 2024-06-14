export interface Product {
    id: number;
    productname: string;
    description?: string;
    imageurl?: string;
    imagekey?: string;
    price: number;
    publicationdate: Date;
    stock: number;
  }