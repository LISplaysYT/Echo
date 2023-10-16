const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from this server")
        .addUserOption(option => option.setName("member").setDescription("The member you want to ban from this server").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for banning this member")),

    async execute(interaction, client) {
        // grabbing data
        const { member, options } = interaction;
        const mem = options.getMember("member");
        const reason = options.getString("reason") || "No reason.";
        const clientUser = interaction.guild.members.cache.get(client.user.id);

        // permission checks
        if (!member.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "You do not have permission to ban this member", ephemeral: true });
        if (member.roles.highest.position <= mem.roles.highest.position) return interaction.reply({ content: "You do not have permission to ban this member", ephemeral: true });

        if (!clientUser.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "I do not have permission to ban this member", ephemeral: true });
        if (clientUser.roles.highest.position <= mem.roles.highest.position) return interaction.reply({ content: "I do not have permission to ban this member", ephemeral: true });

        try {
            const dmEmbed = {
                title: `You were banned from ${interaction.guild.name}:`,
                description: `\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
            };
            const dmmsg = await mem.send({ embeds: [dmEmbed] }).catch(() => {});
            await mem.ban({ reason }).catch(async (err) => {
                await dmmsg?.delete().catch(() => {});
                return interaction.reply({ content: "I ran into an error while trying to ban this member", ephemeral: true });
            });
            const embed = {
                title: "Member banned:",
                description: `\n**Member:** ${mem.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
            };

            await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
        } catch (error) {
            console.error(error);
        }
    }
};