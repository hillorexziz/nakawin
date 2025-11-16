// Небольшие утилиты для сидов/импорта
const Item = require('../models/Item');
const Case = require('../models/Case');
const WheelEntry = require('../models/WheelEntry');

async function createItem(data) {
  const it = new Item(data);
  await it.save();
  return it;
}

async function createCase(data) {
  const cs = new Case(data);
  await cs.save();
  return cs;
}

async function createWheelEntry(data) {
  const we = new WheelEntry(data);
  await we.save();
  return we;
}

module.exports = { createItem, createCase, createWheelEntry };
