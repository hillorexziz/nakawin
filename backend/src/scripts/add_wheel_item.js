import mongoose from "mongoose";
import dotenv from "dotenv";
import WheelItem from "../models/WheelItem.js";

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const item = await WheelItem.create({
        name: "Большой приз",
        rarity: 10,
        price: 500,
        image: "/wheel/prize_big.png"
    });

    console.log("Добавлен сектор:", item);
    process.exit();
}

run();
