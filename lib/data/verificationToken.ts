import prisma from "@/lib/db";

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificaionToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return verificaionToken;
  } catch {
    return null;
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificaionToken = await prisma.verificationToken.findFirst({
      where: { email },
    });

    return verificaionToken;
  } catch {
    return null;
  }
}
