const { Events, Collection } = require('discord.js');
const { execute } = require('./ready');

module.exports = {
    name: Events.InteractionCreate,
    //Handling Slash Commands
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
	
	    const command = interaction.client.commands.get(interaction.commandName);

	    if(!command) {
		    console.error('No command matching ${interaction.commandName} was found.');
		    return;
	    }
        
        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            // Localization example
            const locales = {
                pl: `Proszę czekać, jesteś na cooldownie dla '${command.data.name}'. Możesz użyć tej komendy ponownie <t:${expiredTimestamp}:R>.`,
                de: `Bitte warte, du bist auf einem Cooldown für '${command.data.name}'. Du kannst es wieder verwenden <t:${expiredTimestamp}:R>.`,
                // Add more languages...
            };

            const response = locales[interaction.locale] ?? `Please wait, you are on a cooldown for '${command.data.name}'. You can use it again <t:${expiredTimestamp}:R>.`;
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true});
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    },
};