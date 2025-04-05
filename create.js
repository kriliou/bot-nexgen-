
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
  data: {
    name: 'create',
    description: "Créer un bot personnalisé",
    options: [
      {
        type: 'STRING',
        name: 'token',
        description: 'Le token du bot à créer',
        required: true
      }
    ]
  },
  async execute(interaction) {
    const tokenBot = interaction.options.getString('token');
    const botId = Date.now(); // Génère un ID unique simple pour le bot

    const dossier = \`./bots/\${botId}\`;
    const botScript = \`
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log("Bot \${botId} prêt !");
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ping') {
    await interaction.reply("pong !");
  }
});

client.login('\${tokenBot}');
\`;

    try {
      // Créer le dossier pour le bot
      fs.mkdirSync(dossier, { recursive: true });
      // Créer le fichier bot.js avec le script
      fs.writeFileSync(\`\${dossier}/bot.js\`, botScript);

      // Lancer le bot avec PM2
      exec(\`pm2 start \${dossier}/bot.js --name bot-\${botId}\`, (err, stdout, stderr) => {
        if (err) {
          console.error('Erreur lors du lancement PM2 :', err);
          return interaction.reply({ content: "Erreur lors du déploiement du bot.", ephemeral: true });
        }
        console.log(stdout);
        interaction.reply({
          content: \`Bot déployé avec succès avec l'ID **\${botId}**.\`,
          ephemeral: true
        });
      });

    } catch (err) {
      console.error('Erreur pendant la création du bot :', err);
      await interaction.reply({ content: "Erreur pendant la création du bot.", ephemeral: true });
    }
  }
};
