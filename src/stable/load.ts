import { Guild, DefaultMessageNotifications } from 'discord.js';
import { BackupData } from '../types';
import { loadCategory, loadChannel } from './util';

/**
 * Restores the guild configuration
 */
export async function conf(guild: Guild, backupData: BackupData) {
    if (backupData.name) {
        guild.setName(backupData.name);
    }
    if (backupData.iconBase64) {
        guild.setIcon(new Buffer(backupData.iconBase64, 'base64'));
    } else if (backupData.iconURL) {
        guild.setIcon(backupData.iconURL);
    }
    if (backupData.splashBase64) {
        guild.setSplash(new Buffer(backupData.splashBase64, 'base64'));
    } else if (backupData.splashURL) {
        guild.setSplash(backupData.splashURL);
    }
    if (backupData.bannerBase64) {
        guild.setBanner(new Buffer(backupData.bannerBase64, 'base64'));
    } else if (backupData.bannerURL) {
        guild.setBanner(backupData.bannerURL);
    }
    if (backupData.region) {
        guild.setRegion(backupData.region);
    }
    if (backupData.verificationLevel) {
        guild.setVerificationLevel(backupData.verificationLevel);
    }
    if (backupData.explicitContentFilter) {
        guild.setExplicitContentFilter(backupData.explicitContentFilter);
    }
    return;
}

/**
 * Restore the guild roles
 */
export async function roles(guild: Guild, backupData: BackupData) {
    backupData.roles.forEach(roleData => {
        guild.createRole({
            name: roleData.name,
            color: roleData.color,
            hoist: roleData.hoist,
            permissions: roleData.permissions,
            mentionable: roleData.mentionable
        });
    });
    return;
}

/**
 * Restore the guild channels
 */
export async function channels(guild: Guild, backupData: BackupData) {
    backupData.channels.categories.forEach(categoryData => {
        loadCategory(categoryData, guild).then(createdCategory => {
            categoryData.children.forEach(channelData => {
                loadChannel(channelData, guild, createdCategory);
            });
        });
    });
    backupData.channels.others.forEach(channelData => {
        loadChannel(channelData, guild, null);
    });
    return;
}

/**
 * Restore the afk configuration
 */
export async function afk(guild: Guild, backupData: BackupData) {
    if (backupData.afk) {
        guild.setAFKChannel(guild.channels.find(ch => ch.name === backupData.afk.name));
        guild.setAFKTimeout(backupData.afk.timeout);
    }
    return;
}

/**
 * Restore guild emojis
 */
export async function emojis(guild: Guild, backupData: BackupData) {
    backupData.emojis.forEach(emoji => {
        if (emoji.url) {
            guild.createEmoji(emoji.url, emoji.name);
        } else if (emoji.base64) {
            guild.createEmoji(new Buffer(emoji.base64, 'base64'), emoji.name);
        }
    });
    return;
}

/**
 * Restore guild bans
 */
export async function bans(guild: Guild, backupData: BackupData) {
    backupData.bans.forEach(ban => {
        guild.ban(ban.id);
    });
    return;
}

/**
 * Restore embedChannel configuration
 */
export async function embedChannel(guild: Guild, backupData: BackupData) {
    if (backupData.embed.channel) {
        guild.setEmbed({
            enabled: backupData.embed.enabled,
            channel: guild.channels.find(ch => ch.name === backupData.embed.channel)
        });
    }
    return;
}