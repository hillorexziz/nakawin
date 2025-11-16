import mongoose from "mongoose";
import dotenv from "dotenv";
import Case from "../models/Case.js";

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const newCase = await Case.create({
        name: "Стартовый кейс",
        price: 100,
        items: [
            { name: "Скин A", chance: 0.3, price: 50, image: "/items/skinA.png" },
            { name: "Скин B", chance: 0.2, price: 100, image: "/items/skinB.png" },
            { name: "Скин C", chance: 0.1, price: 200, image: "/items/skinC.png" },
            { name: "Мусор", chance: 0.4, price: 10, image: "/items/trash.png" }
        ]
    });

    console.log("Кейс добавлен:", newCase);
    process.exit();
}

run();
