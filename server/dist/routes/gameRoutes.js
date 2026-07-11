"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateGuess_1 = require("../controllers/validateGuess.js");
const router = (0, express_1.Router)();
router.post('/validate', validateGuess_1.validateGuess);
exports.default = router;
