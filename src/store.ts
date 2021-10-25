import { Customer, Owe } from './interface';

let loggedIn: Customer | null = null;
let customers: Customer[] = [];
let owes: Owe[] = [];

export const findOrCreateOwe = (customer: Customer, owedTo: Customer) => {
  let owe: Owe | undefined = owes.find((owe: Owe) => {
    return (owe.customer.name === customer.name && owe.owedTo.name === owedTo.name);
  });

  if (typeof owe === 'undefined') {
    owe = createOwe({
      customer,
      owedTo,
      amount: 0,
      status: 'going',
    });
  }

  return owe;
};

export const findCustomerOwes = (customer: Customer) => {
  return owes.filter((owe: Owe) => {
    return (owe.customer.name === customer.name || owe.owedTo.name === customer.name);
  });
};

export const findCustomerOwedFrom = (customer: Customer, target: string) => {
  return owes.find((owe: Owe) => {
    return (owe.owedTo.name === customer.name && owe.customer.name === target);
  });
};

export const createOwe = (owe: Owe) => {
  owes.push(owe);

  return owe;
};

export const updateOwe = (owed: Owe) => {
  owes = owes.map((owe: Owe) => {
    if (owe.customer.name === owed.customer.name && owe.owedTo.name === owed.owedTo.name) {
      return owed;
    }

    return owe;
  });

  return owed;
};

export const findOrCreateCustomer = (name: string) => {
  let customer: Customer | undefined = customers.find((arg: any) => {
    return arg.name === name;
  });

  if (typeof customer === 'undefined') {
    customer = createCustomer({
      name: name,
      balance: 0,
    });
  }

  return customer;
};

export const findCustomer = (name: string) => {
  return customers.find((arg: any) => {
    return arg.name === name;
  }) || null;
};

export const createCustomer = (customer: Customer) => {
  customers.push(customer);

  return customer;
};

export const setLoggedIn = (customer: Customer | null) => {
  loggedIn = customer ? {...customer} : null;
};

export const getLoggedIn = () => {
  return loggedIn;
};

export const updateCustomer = (name: string, customer: Customer) => {
  customers = customers.map((cust: Customer) => {
    if (cust.name === name) {
      return customer;
    }

    return cust;
  });

  if (loggedIn && loggedIn.name === name) {
    setLoggedIn(customer);
  }

  return customer;
};
