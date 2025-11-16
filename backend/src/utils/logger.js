const fs = require('fs');
const path = require('path');


const VIVOD_LOG = path.join(__dirname, '..', '..', 'vivod.log');


function writeWithdrawLog({ username, bankAccount, gameNick, serverName, item }) {
const line = `игрок с ником ${username} поставил предмет на вывод , ${bankAccount} , ${gameNick} , ${serverName} , ${item.name}\n`;
fs.appendFileSync(VIVOD_LOG, `____________\n${line}`);
}


module.exports = { writeWithdrawLog };