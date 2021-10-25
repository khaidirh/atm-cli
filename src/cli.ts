import * as readline from 'readline';
import { commands } from './command';
import { Command } from './interface';
import { getLoggedIn } from './store';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function serve() {
  rl.question('$ ', (answer: string) => {
    if ('exit' === answer) {
      rl.close();
    } else {
      const params = answer.split(' ');
      const command = commands.find((c: Command) => {
        return c.name === params[0];
      });

      if (!command) {
        console.log(`Err - ${params[0]} command not found`);
      } else {

        if (null === getLoggedIn() && false === command.public) {
          console.info(`Unauthenticated`);
        } else {
          command.action(params.slice(1));
        }
      }
      serve();
    }
  });
}