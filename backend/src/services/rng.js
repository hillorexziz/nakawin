// Server RNG using crypto and HMAC with server secret
const crypto = require('crypto');


function randomFromSeeds(serverSeed, clientSeed, range) {
// returns integer in [0, range-1]
const h = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');
// take first 8 hex chars -> 32-bit int
const num = parseInt(h.slice(0, 8), 16);
return num % range;
}


function genServerSeed() {
return crypto.randomBytes(32).toString('hex');
}


function serverSeedHash(seed) {
return crypto.createHash('sha256').update(seed).digest('hex');
}


module.exports = { randomFromSeeds, genServerSeed, serverSeedHash };