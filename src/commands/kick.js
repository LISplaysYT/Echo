const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from this server")
    .addUserOption(o => o.setName("member").setDescription("The member you want to kick from this server").setRequired(true))
    .addStringOption(o => o.setName("reason").setDescription("The reason for kicking this member")),

    async execute (interaction, client) {
        //grabbing data
        const { member, options } = interaction;
        const mem = options.getMember("member");
        const reason = options.getString("reason") ?? "No reason.";
        const clientUser = interaction.guild.members.cache.get(client.user.id)

        //permission checks
        if (!member.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.reply({ content: "You do not have permission to kick this member", ephemeral: true })
        if (member.roles.highest.position <= mem.roles.highest.position) return await interaction.reply({ content: "You do not have permission to kick this member", ephemeral: true });

        if (!clientUser.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.reply({ content: "I do not have permission to kick this member", ephemeral: true })
        if (clientUser.roles.highest.position <= mem.roles.highest.position) return await interaction.reply({ content: "I do not have permission to kick this member", ephemeral: true });

        try {
            const dmEmbed = new EmbedBuilder()
            .setTitle(`You were kicked from ${interaction.guild.name}:`)
            .setDescription(`\n**Reason:** ${reason}\n**Moderator:** ${interaction.user}`)
            const dmmsg = await mem.send({ embeds: [dmEmbed] }).catch(err => {});
            await mem.kick(reason).catch(async err => {
                await dmmsg.delete().catch(err => {})
                return await interaction.reply({ content: "I ran into an error while trying to kick this member", ephemeral: true })
            })
            const embed = new EmbedBuilder()
            .setTitle("Member kicked:")
            .setDescription(`\n**Member:** ${mem}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user}`)

            await interaction.reply({ embeds: [embed], ephemeral: true }).catch(err => {})
        } catch {return}
    }
}