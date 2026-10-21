import { DeveloperModel } from "../models/Developer.model.js";
import { MessageModel } from "../models/Message.model.js";

export async function getContactInfo(req, res, next) {
  try {
    const dev = await DeveloperModel.get();
    return res.json({
      success: true,
      data: {
        email: dev?.email,
        github: dev?.github,
        linkedin: dev?.linkedin,
        location: dev?.location,
        locationShort: dev?.locationShort,
        availableForWork: dev?.availableForWork,
        statusPhrase: dev?.statusPhrase,
        emailjsServiceId: dev?.emailjsServiceId,
        emailjsTemplateId: dev?.emailjsTemplateId,
        emailjsPublicKey: dev?.emailjsPublicKey,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateContactInfo(req, res, next) {
  try {
    const updated = await DeveloperModel.update(req.body);
    return res.json({
      success: true,
      message: "Contact settings updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required." });
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required.",
      });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const newMessage = await MessageModel.create({
      name,
      email,
      subject,
      message,
      ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully! I will reply shortly.",
      messageId: newMessage.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const messages = await MessageModel.findAll();
    return res.json({
      success: true,
      count: messages.length,
      unreadCount: messages.filter((m) => !m.read).length,
      data: [...messages].reverse(),
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleMessageRead(req, res, next) {
  try {
    const message = await MessageModel.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    const read = req.body.read !== undefined ? req.body.read : true;
    const updated = await MessageModel.markRead(req.params.id, read);

    return res.json({
      success: true,
      message: "Message status updated.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const wasRemoved = await MessageModel.delete(req.params.id);
    if (!wasRemoved) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    return res.json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    next(err);
  }
}
