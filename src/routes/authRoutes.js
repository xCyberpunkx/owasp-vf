const express = require("express")
const authController = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")
const router = express.Router()

router.post("/register", authController.register)
router.get("/verify-email/:token", authController.verifyEmail)
router.post("/login", authController.login)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)
router.get("/check-auth", authenticateToken, authController.checkAuthenticated)

module.exports = router

