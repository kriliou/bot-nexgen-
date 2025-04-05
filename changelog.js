
module.exports = {
  data: {
    name: 'changelog',
    description: "Afficher les dernières mises à jour",
  },
  async execute(interaction) {
    await interaction.reply("Dernières mises à jour : ...");
  },
};
