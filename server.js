const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const invites = {};

// A pretty useful method to create a delay without blocking the whole script.
client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`RE "Developer`);
 // Load all invites for all guilds and save them to the cache.
 client.guilds.forEach(g => {
   g.fetchInvites().then(guildInvites => {
     invites[g.id] = guildInvites;
   });
 });
});
client.on('guildMemberAdd', member => {
    var targetUser = null;
    var targetUser2 = null;
    var isAnotherUserLookup = false;
    member.guild.fetchInvites().then(guildInvites => {
        // This is the *existing* invites for the guild.
        const ei = invites[member.guild.id];
        // Update the cached invites for the guild.
        invites[member.guild.id] = guildInvites;
        // Look through the invites, find the one for which the uses went up.
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        // This is just to simplify the message being sent below (inviter doesn't have a tag property)
        const inviter = client.users.get(invite.inviter.id);
        targetUser = invite.inviter.id;
        targetUser2 = invite.inviter.username;

      });
    member.guild.fetchInvites()
    .then
    (invites =>
        {
            const userInvites = invites.array().filter(o => o.inviter.id === targetUser);
            var userInviteCount = 0;
                for(var i=0; i < userInvites.length; i++)
                {
                    var invite = userInvites[i];
                    userInviteCount += invite['uses'];
                }
                if(isAnotherUserLookup) {
                let embed = new Discord.RichEmbed()
                .setTitle(`${member.username}`)
                .setDescription(`قام بدعوة ${userInviteCount} شخص لهذا السيرفر`);
                message.channel.send(embed);
                }
                else {
                 const logChannel = member.guild.channels.find(channel => channel.name === "join-logs");
                 const exampleEmbed = new Discord.RichEmbed()
                 .setColor('#0099ff')
                 .setTitle(member.user.username)
                 .setAuthor('Welcome To Clan RE','https://cdn.discordapp.com/avatars/264140739875700737/d17d0f3df94caeecc63eeb237de18b2d.png?size=256')
                 .setThumbnail(member.user.displayAvatarURL)
                 .addField('مرسل الدعوة', targetUser2)
                 .addField('عدد الدعوات', userInviteCount)
                 .setTimestamp();
                 logChannel.send(exampleEmbed);
                 }
               }
             )
        .catch(console.error);
      });

client.on('message', message => {
        NormalHandle(message);
});

function NormalHandle(message)
{
    //Ignore bot messages.
    if(message.author.bot) return;
    //Ignore message if it doesnt start with prefix
    if(message.content.indexOf(config.prefix) !== 0) return;

    console.log("Recieved message: " + message.content);

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(`Arguments: ${args}`);
    console.log(`Command: ${command}`);

    if( (command == 'help' || command == 'h') && message.guild.available)
    {
        let embed = new Discord.RichEmbed()
        .setTitle("الأوامر")
        .setDescription("** !!invites : لمشاهدة عدد الدعوات **\n"+
        "** !!mylinks : لمشاهدة عدد الروابط**\n");
         message.channel.send(embed);
    }

    else if(command == 'invites' && message.guild.available)
    {
        var targetUser = null;
        var isAnotherUserLookup = false;
        if(message.mentions.members.first() != null)
        {
            targetUser = message.mentions.members.first().user;
            console.log(targetUser.user);
            isAnotherUserLookup = true;
        }
        else
            targetUser = message.author;

        message.guild.fetchInvites()
        .then
        (invites =>
            {
                const userInvites = invites.array().filter(o => o.inviter.id === targetUser.id);
                var userInviteCount = 0;
                    for(var i=0; i < userInvites.length; i++)
                    {
                        var invite = userInvites[i];
                        userInviteCount += invite['uses'];
                    }
                    if(isAnotherUserLookup) {
                    let embed = new Discord.RichEmbed()
                    .setTitle(`${targetUser.username}`)
                    .setDescription(`قام بدعوة ${userInviteCount} شخص لهذا السيرفر`);
                    message.channel.send(embed);
                    }
                    else {
                     let embed = new Discord.RichEmbed()
                     .setTitle(``)
                     .setDescription(`قمت بدعوة ${userInviteCount} شخص لهذا السيرفر عمل جيد`);
                     message.reply(embed);
                    }
            }
        )
        .catch(console.error);
    }

    else if(command == 'mylinks' && message.guild.available)
    {
        var targetUser = null;
        var isAnotherUserLookup = false;
        if(message.mentions.members.first() != null)
        {
            targetUser = message.mentions.members.first().user;
            console.log(targetUser.user);
            isAnotherUserLookup = true;
        }
        else
            targetUser = message.author;

        message.guild.fetchInvites()
        .then
        (invites =>
            {
                const userInvites = invites.array().filter(o => o.inviter.id === targetUser.id);
                var userInviteLinksStr = '';
                    for(var i=0; i < userInvites.length; i++)
                    {
                        var invite = userInvites[i];
                        userInviteLinksStr += `Link: *discord.gg/${invite['code']}* - Permenant: *${!invite['temporary']}*\n`;
                    }
                    if(isAnotherUserLookup) {
                    let embed = new Discord.RichEmbed()
                    .setTitle(`${targetUser.username}`)
                    .setDescription(`الروابط الخاصة بلمستخدم ' \n${userInviteLinksStr}`);
                    message.channel.send(embed);
                    }
                    else {
                        let embed = new Discord.RichEmbed()
                        .setTitle(``)
                        .setDescription(`روابط الدعوات الخاصة بك \n${userInviteLinksStr} أستمر!`);
                        message.reply(embed);
                    }
            }
        )
        .catch(console.error);
    }
}

function TerrysWorldServerHandle(message)
{
    if(message.content.includes('discord.gg'))
    {
        message.delete();
        message.reply('your message contained content that was flagged as *spam*, please refer to the server rules.');
    }
}

//DO NOT SHARE THIS TOKEN PUBLICLY!!
//Replace this code with your token.
if(process.env.TOKEN_VAR != null)
    var token = process.env.TOKEN_VAR;
else
    var token = 'NjgzNjcwMzYxNTM1MTUyMTY2.Xlvx9w.rKsg1dNO6E1o31t4KJXQjCmiYLc';

client.login(token);
