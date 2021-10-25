export interface Command {
  name: string,
  action: any,
  public: boolean
}

export interface Customer {
  name: string,
  balance: number
}

export interface Owe {
  customer: Customer,
  owedTo: Customer,
  amount: number,
  status: string
}