const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Emojis, Colors } = require('../../statics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for warning them')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const member = await interaction.guild.members.fetch(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            const embed = new EmbedBuilder()
                .setDescription(Emojis.error + ' You do not have permission to use this command.')
                .setColor(Colors.error)
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
