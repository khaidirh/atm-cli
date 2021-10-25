import { Command, Customer, Owe } from './interface';
import {
  findCustomer,
  findCustomerOwedFrom,
  findCustomerOwes,
  findOrCreateCustomer,
  findOrCreateOwe,
  getLoggedIn,
  setLoggedIn,
} from './store';
import { addBalance, addOwe, deductBalance, deductowe, showBalance } from './action';

const loginCommand = (name: string) => {
  if (null !== getLoggedIn()) {
    console.log(`Logged in as ${getLoggedIn()?.name}`);
    return;
  }

  const customer = findOrCreateCustomer(name);
  setLoggedIn(customer);

  console.info(`Hello, ${customer.name}!`);
  showBalance(customer);
};

const depositCommand = (customer: Customer, amount: number) => {
  customer = addBalance(customer, amount);
  customer = payOwed(customer, customer.balance, null);
  showBalance(customer);
};

const withdrawCommand = (customer: Customer, amount: number) => {
  if (customer.balance < amount) {
    console.info(`Your balance is not enough to withdraw`);
    return;
  }

  customer = deductBalance(customer, amount);
  showBalance(customer);
};

const transferCommand = (customer: Customer, target: string, amount: number) => {
  let targetCust = findCustomer(target);
  let owed = 0;

  if (targetCust === null) {
    console.info(`Customer with name ${target} is not found`);
    return;
  }

  const hasOwed = findCustomerOwedFrom(customer, target);

  if (hasOwed) {
    const paid = amount >= hasOwed.amount ? hasOwed.amount : amount;
    amount = amount - paid;
    payOwed(targetCust, paid, hasOwed);
  }

  if (amount >= customer.balance) {
    owed = amount - customer.balance;
    amount = customer.balance;
  }

  customer = makeTransfer(customer, targetCust, amount, owed);

  showBalance(customer);
};

const makeTransfer = (customer: Customer, targetCust: Customer, amount: number, owed: number = 0) => {
  customer = deductBalance(customer, amount);
  targetCust = addBalance(targetCust, amount);

  console.info(`Transferred $${amount || owed} to ${targetCust.name}`);

  if (owed > 0) {
    makeOwed(customer, targetCust, owed);
  }

  return customer;
};

const makeOwed = (customer: Customer, owedTo: Customer, amount: number) => {
  let owe = findOrCreateOwe(customer, owedTo);
  owe = addOwe(owe, amount);

  return owe;
};

const payOwed = (customer: Customer, amount: number, owed: Owe | null) => {
  if (!owed) {
    const owes = findCustomerOwes(customer);
    owes.map((o: Owe) => {
      if (amount > 0 && o.status === 'going') {
        const paid = amount >= o.amount ? o.amount : amount;
        deductowe(o, paid);
        customer = makeTransfer(customer, o.owedTo, paid);
        amount = amount - paid;
      }
    });
  } else {
    deductowe(owed, amount);
  }

  return customer;
};

export const commands: Command[] = [
  {
    name: 'login',
    public: true,
    action: (args: any[]) => {
      const name = args[0];
      if (name) {
        loginCommand(name);
        return;
      }

      console.info(`Invalid arguments. login <name>`);
    },
  },
  {
    name: 'deposit',
    public: false,
    action: (args: any[]) => {
      if (args[0]) {
        const cust = getLoggedIn();
        if (cust) {
          depositCommand(cust, parseInt(args[0]));
        }
        return;
      }

      console.info(`Invalid arguments. deposit <amount>`);
    },
  },
  {
    name: 'logout',
    public: false,
    action: () => {
      const cust = getLoggedIn();
      console.info(`Good bye, ${cust?.name}!`);
      setLoggedIn(null);
    },
  },
  {
    name: 'transfer',
    public: false,
    action: (args: any[]) => {
      const cust = getLoggedIn();
      const target = args[0];
      const amount = parseInt(args[1]);

      if (!amount || !target) {
        console.info(`Invalid arguments. tarnsfer <target> <amount>`);
        return;
      }

      if(cust) {
        transferCommand(cust, target, amount);
      }
    },
  },
  {
    name: 'withdraw',
    public: false,
    action: (args: any[]) => {
      const cust = getLoggedIn();
      const amount = parseInt(args[0]);

      if (!amount) {
        console.info(`Invalid arguments. withdraw <amount>`);
        return;
      }

      if(cust) {
        withdrawCommand(cust, amount);
      }
    },
  },
];
