export interface Cart {
    id: number;
    userID: string;
    totalPrice: number;
    creationDate: Date;
    mercadoPagoID?: string;
  }