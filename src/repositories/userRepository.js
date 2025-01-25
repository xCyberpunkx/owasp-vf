const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class UserRepository {
  async createUser(userData) {
    return prisma.user.create({ data: userData })
  }

  async findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } })
  }

  async findUserById(id) {
    return prisma.user.findUnique({ where: { id } })
  }

  async updateUser(id, userData) {
    return prisma.user.update({ where: { id }, data: userData })
  }

  async deleteUser(id) {
    return prisma.user.delete({ where: { id } })
  }

  async setResetToken(email, resetToken, resetTokenExpires) {
    return prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpires },
    })
  }

  async findUserByResetToken(resetToken) {
    return prisma.user.findFirst({
      where: { resetToken, resetTokenExpires: { gt: new Date() } },
    })
  }

  async setEmailVerificationToken(email, emailVerificationToken) {
    return prisma.user.update({
      where: { email },
      data: { emailVerificationToken },
    })
  }

  async verifyEmail(emailVerificationToken) {
    return prisma.user.update({
      where: { emailVerificationToken },
      data: { emailVerified: true, emailVerificationToken: null },
    })
  }

  async findUserByEmailVerificationToken(emailVerificationToken) {
    return prisma.user.findFirst({
      where: { emailVerificationToken },
    })
  }
}

module.exports = new UserRepository()

