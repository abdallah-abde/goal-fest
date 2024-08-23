import prisma from "@/lib/db";

export async function getPasswordResetTokenByToken(token: string) {
  try {
    const resetPasswordToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    return resetPasswordToken;
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const resetPasswordToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return resetPasswordToken;
  } catch {
    return null;
  }
}
