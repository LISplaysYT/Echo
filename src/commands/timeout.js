const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Emojis, Colors } = require('../../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user')
        .addUserOption(option => option.setName('user').setDescription('The user to timeout').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('The duration of the timeout in seconds, minutes, hours, days, or weeks.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the timeout')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const durationText = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason');
        const durationInSeconds = await parseDuration(durationText);
        const member = await interaction.guild.members.fetch(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Timeout)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command.')
                .setColor(Colors.error)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!durationInSeconds) {
            return;
        }
        try {
            await member.timeout(durationInSeconds);
            const embed = new EmbedBuilder()
                .setDescription(Emojis.success + ' Successfully timed out user.')
                .setColor(Colors.success)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' Failed to timeout user. ' + error)
                .setColor(Colors.error)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        async function parseDuration(durationText) {
            const regex = /(\d+)\s*(s|sec|second|seconds|m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)/;
            const matches = durationText.match(regex);
        
            if (!matches) {
                throw new Error('Invalid duration format. Use formats like "1d", "2h", "30m", etc.');
            }
        
            const value = parseInt(matches[1]);
            const unit = matches[2].toLowerCase();
        
            switch (unit) {
                case 's':
                case 'sec':
                case 'second':
                case 'seconds':
                    return value * 1000;
                case 'm':
                case 'min':
                case 'minute':
                case 'minutes':
                    return value * 60 * 1000;
                case 'h':
                case 'hr':
                case 'hour':
                case 'hours':
                    return value * 3600 * 1000;
                case 'd':
                case 'day':
                case 'days':
                    return value * 86400 * 1000;
                case 'w':
                case 'week':
                case 'weeks':
                    return value * 604800 * 1000;
                default:
                    break;
            }
        }
    }
}
