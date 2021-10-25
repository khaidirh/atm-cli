import { Customer, Owe } from './interface';
import { findCustomerOwes, updateCustomer, updateOwe } from './store';

export const addBalance = (customer: Customer, amount: number) => {
  const balance = customer.balance + amount;
  customer = {...customer, balance};

  return updateCustomer(customer.name, customer);
};

export const deductBalance = (customer: Customer, amount: number) => {
  const balance = customer.balance - amount;
  customer = {...customer, balance};

  return updateCustomer(customer.name, customer);
};

export const addOwe = (owe: Owe, amount: number) => {
  owe = {
    ...owe,
    amount: owe.amount + amount,
    status: 'going'
  };

  return updateOwe(owe);
};

export const deductowe = (owe: Owe, amount: number) => {
  amount = owe.amount - amount;

  owe = {
    ...owe,
    amount: amount,
    status: (amount === 0) ? 'done' : 'going'
  };

  return updateOwe(owe);
};

export const showBalance = (customer: Customer) => {
  console.info(`Your balance is $${customer.balance}`);
  showOwes(customer);
};

export const showOwes = (customer: Customer) => {
  const owes = findCustomerOwes(customer);

  owes.forEach((owe: Owe) => {
    if (owe.status === 'going') {
      if (customer.name === owe.customer.name) {
        console.info(`Owed $${owe.amount} to ${owe.owedTo.name}`);
      } else {
        console.info(`Owed $${owe.amount} from ${owe.customer.name}`);
      }
    }
  });
};
