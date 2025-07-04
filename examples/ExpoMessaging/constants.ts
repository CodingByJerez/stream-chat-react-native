

// const serverClient = StreamChat.getInstance(
//   '7x37bfehhxky',           // STREAM_API_KEY
//   'tfb8es94fxxzbuczhyrhg53s7ky7cn3xdk7b3fa24ayrdpv53qzbgvuby9yu3u64'    // TA CLÉ SECRÈTE
// );

import { simpleHash } from "./services/simpleHash";


export const STREAM_API_KEY = '7x37bfehhxky';

export const ADMIN_ID = "43063090-6ff2-4650-b110-f2bdf749bd01"
export const ADMIN_PWD = "0709R"
export const user = {
  id: '43063090-6ff2-4650-b110-f2bdf749bd01',
};


console.log('simpleHash(ADMIN_PWD):', simpleHash(ADMIN_PWD))