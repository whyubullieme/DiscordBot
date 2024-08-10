// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
// 	category: 'utility',
// 	data: new SlashCommandBuilder()
// 		.setName('reload')
// 		.setDescription('Reloads a command.')
// 		.addStringOption(option =>
// 			option.setName('command')
// 				.setDescription('The command to reload.')
// 				.setRequired(true)),
// 	async execute(interaction) {
// 		const commandName = interaction.options.getString('command', true).toLowerCase();
// 		const command = interaction.client.commands.get(commandName);

// 		if (!command) {
// 			return interaction.reply(`There is no command with name \`${commandName}\`!`);
// 		}

// 		delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];

// 		try {
// 	        interaction.client.commands.delete(command.data.name);
// 	        const newCommand = require(`../${command.category}/${command.data.name}.js`);
// 	        interaction.client.commands.set(newCommand.data.name, newCommand);
// 	        await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
// 		} catch (error) {
// 	        console.error(error);
// 	        await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
// 		}
// 	},
// };

const fs = require('fs');
const path = require('path');

module.exports = {
    data: {
        name: 'reload',
        description: 'Reloads a command',
    },
    async execute(interaction) {
        const commandName = interaction.options.getString('command');
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply({
                content: `There is no command with name \`${commandName}\`!`,
                ephemeral: true,  
            });
        }

        const commandFolders = fs.readdirSync(path.join(__dirname, '..'));
        let commandPath;

        // Loop through folders to find the correct command
        for (const folder of commandFolders) {
            const folderPath = path.join(__dirname, '..', folder);
            if (fs.statSync(folderPath).isDirectory()) {
                const commandsPath = path.join(folderPath, commandName + '.js');
                if (fs.existsSync(commandsPath)) {
                    commandPath = commandsPath;
                    break;
                }
            }
        }

        if (!commandPath) {
            return interaction.reply({
                content: `Command \`${commandName}\` not found in any folder!`,
                ephemeral: true,  
            });
        }

        // Delete old command from cache
        delete require.cache[require.resolve(commandPath)];

        try {
            const newCommand = require(commandPath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({
                content: `Command \`${newCommand.data.name}\` was reloaded!`,
                ephemeral: true,  
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``,
                ephemeral: true,  
            });
        }
    },
};

