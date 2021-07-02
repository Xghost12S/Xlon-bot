const Discord = require("discord.js");
const config = require('../../config.json');
const messages = require('../../messages.json');

module.exports = {
    name: 'unmute',
    description: "mute users",
    run: async (bot, message, args) => {
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
            const failedSetup = new Discord.MessageEmbed().setColor(config.failColor).setDescription(`${config.failureEmoji} The bot has not been setup yet, or is improperly configured. Please use the command \`${config.prefix}setup\` to begin the setup.`)
            return message.reply(failedSetup)
                .then(msg => {
                    msg.delete({ timeout: 14000 })
                })
        }

        const logs = await message.guild.channels.cache.find(channel => channel.name === `${config.logsChannel}`);
        const guild = bot.guilds.cache.get(message.guild.id);

        if (message.deletable) {
            message.delete();
        };

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            const userPermError = new Discord.MessageEmbed().setColor(config.failColor).setDescription(`${config.failureEmoji} ${messages.globalPermError}`);
            return message.reply(userPermError)
                .then(msg => {
                    msg.delete({ timeout: 14000 })
                });
        }

        if (!message.guild.roles.cache.find(x => x.name == "Muted")) {

            guild.roles.create({
                data: {
                    name: 'Muted',
                    color: 'RED',
                },
                reason: 'muted role - auto generated',
            })

            message.channel.send(new Discord.MessageEmbed().setColor(config.colour).setDescription(`${config.loadingEmoji} Muted role not found, one will be created automatically`))
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                });

        }

        const mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");
        const target = message.mentions.members.first();

        const UserEmbed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setDescription(`**UNMUTED ON SERVER**\n\nYou have been unmuted on the ${guild.name} server.\n\nUnmuted by: ${message.author}\n\nYou may continue using server channels! If you have any questions, please contact a member of staff!`)
            .setTimestamp()
            .setFooter(`${config.botName}, ${config.botVersionShort}`, config.botIcon);
        message.mentions.members.first().send(UserEmbed);

        target.roles.remove(mutedRole)

        message.channel.send(new Discord.MessageEmbed().setColor(config.successColor).setDescription(`${config.successEmoji} You have unmuted the user! [${message.mentions.members.first()}]`))
            .then(msg => {
                msg.delete({ timeout: 14000 })
            });

        const mutedEmbed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setAuthor('User Unmuted', message.author.avatarURL())
            .setDescription(`\nUn-muted by: ${message.author}\nUser Un-muted: ${message.mentions.members.first()}`)
            .setTimestamp()

        logs.send(mutedEmbed);

    }
}