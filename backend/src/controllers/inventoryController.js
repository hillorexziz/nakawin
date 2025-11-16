// Контроллер инвентаря: список, продажа, вывод.
const User = require('../models/User');
const Item = require('../models/Item');
const { writeWithdrawLog } = require('../utils/logger');

async function getInventory(req, res) {
  try {
    const user = await User.findById(req.user._id).populate('inventory');
    res.json({ inventory: user.inventory || [] });
  } catch (e) {
    console.error('getInventory', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function sellItem(req, res) {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user._id);
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // убедимся, что предмет в инвентаре пользователя
    const idx = (user.inventory || []).findIndex(i => i.toString() === itemId);
    if (idx === -1) return res.status(400).json({ error: 'Item not in inventory' });

    user.inventory.splice(idx, 1);
    user.balance = (user.balance || 0) + (item.price || 0);
    await user.save();
    await Item.findByIdAndDelete(itemId);

    res.json({ ok: true, balance: user.balance });
  } catch (e) {
    console.error('sellItem', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function withdrawItem(req, res) {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user._id);
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const idx = (user.inventory || []).findIndex(i => i.toString() === itemId);
    if (idx === -1) return res.status(400).json({ error: 'Item not in inventory' });

    // Записываем в vivod.log
    writeWithdrawLog({
      username: user.username,
      bankAccount: user.bankAccount,
      gameNick: user.gameNick,
      serverName: user.serverName,
      item
    });

    user.inventory.splice(idx, 1);
    await user.save();
    await Item.findByIdAndDelete(itemId);

    res.json({ ok: true });
  } catch (e) {
    console.error('withdrawItem', e);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getInventory, sellItem, withdrawItem };
