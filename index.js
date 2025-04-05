
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const TOKEN = 'TON_TOKEN_ICI';
const CLIENT_ID = 'TON_CLIENT_ID';

// Initialisation du client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Chargement des commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  client.commands.set(command.data.name, command);
}

// Déploiement des commandes
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log("Déploiement des commandes...");
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: client.commands.map(command => command.data.toJSON()) }
    );
    console.log("Commandes déployées avec succès.");
  } catch (error) {
    console.error(error);
  }
})();

// Lors de la connexion
client.once('ready', () => {
  console.log(\`Connecté en tant que \${client.user.tag}\`);
});

// Gestion des interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (client.commands.has(commandName)) {
    try {
      await client.commands.get(commandName).execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Il y a eu une erreur en exécutant cette commande.', ephemeral: true });
    }
  }
});

// Connexion du client
client.login(TOKEN);
