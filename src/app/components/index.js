/*
  The juice function
  Fill in the functionality for our bot
  Available commands are:
    - enterText / text: string
    - enterImage / url: string
    - enterImageWithText / url: string, text: string
*/
module.exports.getAction = (command) => {
  const commandSplit = command.split(' ');
  const commandName = commandSplit.slice(0, 1)[0];
  const args = commandSplit.slice(1);

  switch (commandName) {
    case '!send':
      return {name: 'enterText', value: args.join(' ')}
    default:
      return {name: 'notAnAction', value: command}
      break;
  }
}