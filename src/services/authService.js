const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userRepository = require("../repositories/userRepository")
const { sendResetPasswordEmail, sendVerificationEmail } = require("../utils/emailService")

class AuthService {
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")

    const user = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
      emailVerificationToken,
    })

    await sendVerificationEmail(user.email, emailVerificationToken)

    return { message: "Registration successful. Please check your email to verify your account." }
  }

  async login(email, password) {
    const user = await userRepository.findUserByEmail(email)
    if (!user) {
      throw new Error("Invalid credentials")
    }
    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in")
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error("Invalid credentials")
    }
    return this.generateToken(user)
  }

  generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })
  }

  async forgotPassword(email) {
    const user = await userRepository.findUserByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour

    await userRepository.setResetToken(email, resetToken, resetTokenExpires)
    await sendResetPasswordEmail(email, resetToken)
  }

  async resetPassword(resetToken, newPassword) {
    const user = await userRepository.findUserByResetToken(resetToken)
    if (!user) {
      throw new Error("Invalid or expired reset token")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await userRepository.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    })
  }

  async checkAuthenticated(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await userRepository.findUserById(decoded.id)
      if (!user) {
        throw new Error("User not found")
      }
      return { authenticated: true, user: { id: user.id, email: user.email, role: user.role } }
    } catch (error) {
      return { authenticated: false, error: error.message }
    }
  }

  async verifyEmail(token) {
    const user = await userRepository.findUserByEmailVerificationToken(token)
    if (!user) {
      throw new Error("Invalid or expired verification token")
    }

    await userRepository.verifyEmail(token)
    return { message: "Email verified successfully" }
  }
}

module.exports = new AuthService()

