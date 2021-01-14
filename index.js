const Discord = require('discord.js');
const keys = require('./config/keys.js');
const axios = require('axios');

//Initialize discord
const client = new Discord.Client({
    //Neleidžia botui tagint @everyone
    disableEveryone: true
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.indexOf('@hostinger.com') > -1){ //if email was entered
        axios
        .post(keys.backend_link, {
            token: keys.bot_request_token,
            email: msg.content
        })
        .then(res => {
            if (res.data.status == '200'){
                user_name = res.data.name+" "+res.data.surname;
                member = msg.guild.members.cache.get(msg.author.id);
                if (member.roles.cache.has(keys.role_id)){
                    return;
                } else {
                    msg.guild.channels.cache.get(keys.output_channel_id).send("Successfully granted access to the server for: "+"<@" + msg.author.id + ">");
                    member.roles.add(keys.role_id)
                    .catch(console.error); // add role
                    member.setNickname(user_name); //change nickname
                }
            } else {
                msg.reply('Error. Email was not correct, or you have skipped the log in step above. Please proceed with the instructions step by step!');
            }
        })
        .catch(error => {
            console.error(error)
        });
        msg.delete();
    } else if (msg.content.indexOf('Email was not correct') > -1){
        msg.delete({timeout: 10000}).catch(console.error);
    } else if (msg.content.indexOf('Successfully granted access to the server for:') > -1){
        return;//msg.delete({timeout: 13000}).catch(console.error);
    } else if (msg.content.startsWith('!setstatus')){
        msg.delete();
        client.user.setPresence({ activity: { name: msg.content.slice(11) }, status: 'active' })
        .catch(console.error);
    }else {
        msg.reply('Email was not correct, please enter your work email!');
        msg.delete();
    }
});

client.login(keys.discord.bot_token);