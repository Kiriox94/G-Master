const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Utilisez la variable d'environnement pour le token
const TOKEN = process.env.DISCORD_TOKEN;

// Liste des ID des salons spécifiques où le bot doit intervenir
const allowedChannels = ["1278672736910311465", "1284829796290793593"];

client.once("ready", () => {
    console.log("Le bot est prêt !");
});

client.on("messageCreate", async (message) => {
    // Ne pas répondre aux messages du bot lui-même
    if (message.author.bot) return;

    // Vérifie si le message provient d'un salon autorisé
    if (!allowedChannels.includes(message.channel.id)) return;

    // Détermine si le message contient "gé", "myrtille", ou "quantique"
    let newMessage = message.content;
    let modified = false;

    // Remplace "gé" par "G-" au début ou milieu, et "-G" à la fin d'un mot
    if (newMessage.toLowerCase().includes("gé")) {
        newMessage = newMessage
            .replaceAll(
                /(^|[[\]\s.,\/#!$%\^&\*;:{}=\-_`~()])gé([[\]\s.,\/#!$%\^&\*;:{}=\-_`~()]|$)/gi,
                "$1G$2",
            )
            .replaceAll(/gégé([[\]\s.,\/#!$%\^&\*;:{}=\-_`~()]|$)/gi, "G-G$1")
            .replaceAll(/(^|[[\]\s.,\/#!\$%\^&\*;:{}=\-_`~()])gé/gi, "$1G-")
            .replaceAll(/gé([[\]\s.,\/#!\$%\^&\*;:{}=\-_`~()]|\$)/gi, "-G$1")
            .replaceAll(
                /([^[\]\s.,\/#!\$%\^&\*;:{}=\-_`~()])gé([^[\]\s.,\/#!$%\^&\*;:{}=\-_`~()])/gi,
                "$1G-$2",
            )
            .replaceAll(/gé/gi, "-G-");

        modified = true;
    }

    // Ajoute une réaction lorsque le mot "myrtille" ou "myrtilles" est détecté
    if (/myrtille|myrtilles/i.test(newMessage)) {
        try {
            const reactionEmoji = "🫐"; // Utilise le code Unicode de l'emoji
            await message.react(reactionEmoji);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réaction :", error);
        }
    }

    // Ajoute une réaction lorsque le mot "sanglier" est détecté
    if (newMessage.toLowerCase().includes("sanglier")) {
        try {
            const reactionEmoji = "🐗"; // Utilise le code Unicode de l'emoji
            await message.react(reactionEmoji);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réaction :", error);
        }
    }

    // Remplace "quantique" par "quantic tac"
    if (newMessage.toLowerCase().includes("quantique")) {
        newMessage = newMessage.replace(
            /quantique/gi,
            "[quan-tic tac](<https://www.youtube.com/watch?v=fmvqz0_KFX0>)",
        );
        modified = true;
    }

    // Si le message a été modifié, envoie le nouveau message et supprime-le après 10 secondes
    if (modified) {
        try {
            const sentMessage = await message.channel.send(newMessage);
            setTimeout(() => {
                sentMessage
                    .delete()
                    .catch((err) =>
                        console.error(
                            "Erreur lors de la suppression du message :",
                            err,
                        ),
                    );
            }, 30000); // 10 secondes
        } catch (err) {
            console.error("Erreur lors de l'envoi du message :", err);
        }
    }
});

// Connexion au bot
client.login(TOKEN);

// Écouter sur un port spécifique
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
