#!/usr/bin/env node
import { StreamChat } from 'stream-chat';


export const apiKey = '7x37bfehhxky';
export const secret = "tfb8es94fxxzbuczhyrhg53s7ky7cn3xdk7b3fa24ayrdpv53qzbgvuby9yu3u64"

const serverClient = StreamChat.getInstance(apiKey, secret);

const userId = process.argv[2]; // récupère le premier argument

if (!userId) {
  console.error('❌ Utilisation : node generate-token.js <userId>');
  process.exit(1);
}

const token = serverClient.createToken(userId);
console.log(`✅ Token pour l'utilisateur "${userId}" :\n${token}`);
