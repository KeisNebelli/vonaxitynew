const prisma = require('./db');

/**
 * createNotification — safe fire-and-forget, never throws
 */
async function createNotification({ userId, type, title, message, relatedId, actorName, actorPhoto }) {
  try {
    if (!userId) return;
    // Encode actor metadata into message as JSON so frontend can render name + photo
    const storedMessage = (actorName || actorPhoto)
      ? JSON.stringify({ text: message, actorName: actorName || null, actorPhoto: actorPhoto || null })
      : message;
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message: storedMessage,
        relatedId: relatedId || null,
      },
    });
  } catch (err) {
    console.error('[Notification] Failed to create:', err.message);
  }
}

module.exports = { createNotification };
