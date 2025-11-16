import express from "express";
import Case from "../models/Case.js";
import WheelItem from "../models/WheelItem.js";

const router = express.Router();

router.post("/case", async (req, res) => {
    try {
        const c = await Case.create(req.body);
        res.json({ success: true, case: c });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

router.post("/wheel", async (req, res) => {
    try {
        const item = await WheelItem.create(req.body);
        res.json({ success: true, item });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/cases", async (req, res) => {
    res.json(await Case.find());
});

router.get("/wheel", async (req, res) => {
    res.json(await WheelItem.find());
});

export default router;
