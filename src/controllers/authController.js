const authService = require("../services/authService")

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body)
      res.status(201).json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const token = await authService.login(email, password)
      res.json({ token })
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      await authService.forgotPassword(email)
      res.json({ message: "Password reset email sent" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body
      await authService.resetPassword(resetToken, newPassword)
      res.json({ message: "Password reset successful" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async checkAuthenticated(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1]
      const result = await authService.checkAuthenticated(token)
      res.json(result)
    } catch (error) {
      res.status(401).json({ authenticated: false, error: error.message })
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.params
      const result = await authService.verifyEmail(token)
      res.json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = new AuthController()

