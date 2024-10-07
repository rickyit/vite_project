export type User = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  __v?: string;
};

export type Supplier = {
  _id: string;
  title: string;
};

export type Order = {
  _id: string;
  date: Date;
  userId: string;
  orderItems: OrderItem[];
  note: string;
  total: number;
  status: Status;
};

export type Item = {
  _id: string;
  title: string;
  description: string;
  price: number;
  supplierId: string;
};

export type OrderItem = {
  itemId: string;
  price: number;
  quantity: number;
};

enum Status {
  Placed,
  Processing,
  Ondelivery,
  Completed,
}
