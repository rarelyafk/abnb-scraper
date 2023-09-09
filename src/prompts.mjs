import enquirer from 'enquirer';


const { AutoComplete, StringPrompt, Toggle, MultiSelect } = enquirer;

const acPrompt = async (msg, choices, init) => {
  const initial = init ? choices.indexOf(init) : null;
  const message = init ? `${msg} [default: "${init}"]` : msg;

  const prompt = new AutoComplete({ message, choices, initial, limit: 10 });

  return await prompt.run().then(res => res).catch(console.error);
}

const strPrompt = async message => {
  const prompt = new StringPrompt({ message });
  return await prompt.run().then(res => res).catch(console.error);
}


export {
  acPrompt,
  strPrompt,
  StringPrompt,
  Toggle,
  MultiSelect,
};

