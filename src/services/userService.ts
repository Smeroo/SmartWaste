import { prisma } from '@/lib/prisma';

/**
 * Layer di servizio per la logica di business dell'Utente
 * Separa la logica di business dai gestori delle route API
 */

export interface UpdateUserProfileData {
  name?: string;
  surname?: string;
  cellphone?: string;
}

/**
 * Ottieni il profilo utente tramite email
 */
export async function getUserProfile(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      surname: true,
      cellphone: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Aggiorna il profilo utente
 */
export async function updateUserProfile(email: string, data: UpdateUserProfileData) {
  return await prisma.user.update({
    where: { email },
    data: {
      name: data.name,
      surname: data.surname,
      cellphone: data.cellphone,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      cellphone: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Elimina l'account utente
 */
export async function deleteUserAccount(email: string) {
  await prisma.user.delete({
    where: { email },
  });
}
