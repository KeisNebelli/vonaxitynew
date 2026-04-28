const prisma = require('./db');

/**
 * createNotification — safe fire-and-forget, never throws
 */
async function createNotification({ userId, type, title, message, relatedId }) {
  try {
    if (!userId) return;
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId: relatedId || null,
      },
    });
  } catch (err) {
    console.error('[Notification] Failed to create:', err.message);
  }
}

module.exports = { createNotification };
