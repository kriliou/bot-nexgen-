
module.exports = {
  data: {
    name: 'mybot',
    description: "Afficher vos bots et leurs liens d'invitation",
  },
  async execute(interaction) {
    await interaction.reply("Voici vos bots : [Exemple de lien](https://discord.com)");
  },
};
