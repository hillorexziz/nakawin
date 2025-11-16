const { genServerSeed, serverSeedHash, randomFromSeeds } = require('./rng');


// Simple provably fair wrapper that stores serverSeed and returns hash to client
function createRound(clientSeed) {
const serverSeed = genServerSeed();
const serverSeedH = serverSeedHash(serverSeed);
// store serverSeed in memory or persistent store for audit. Here we'll return it with the outcome
return { serverSeed, serverSeedH, clientSeed };
}


module.exports = { createRound, randomFromSeeds };