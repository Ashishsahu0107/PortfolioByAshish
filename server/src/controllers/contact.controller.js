import { DeveloperModel } from "../models/Developer.model.js";
import { MessageModel } from "../models/Message.model.js";
import { sendContactNotificationEmail } from "../services/resend.service.js";

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
    const { name, email, subject, message } = req.body || {};

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanSubject = typeof subject === "string" ? subject.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name (at least 2 characters).",
      });
    }

    if (cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 100 characters.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (cleanEmail.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Email address cannot exceed 120 characters.",
      });
    }

    if (!cleanSubject || cleanSubject.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Subject must be at least 3 characters.",
      });
    }

    if (cleanSubject.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Subject cannot exceed 200 characters.",
      });
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters.",
      });
    }

    if (cleanMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 5000 characters.",
      });
    }

    const clientIp =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const newMessage = await MessageModel.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      ip: clientIp,
    });

    // Fire non-blocking email notification to portfolio owner
    try {
      const dev = await DeveloperModel.get().catch(() => null);
      const ownerEmail = dev?.email || "ashishsahu01072005@gmail.com";
      sendContactNotificationEmail({
        to: ownerEmail,
        visitorName: cleanName,
        visitorEmail: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      }).catch((emailErr) => {
        console.warn("[Contact Controller] Resend notification delivery failed:", emailErr?.message);
      });
    } catch (dispatchErr) {
      console.warn("[Contact Controller] Resend notification dispatch failed:", dispatchErr?.message);
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully! I will reply shortly.",
      messageId: newMessage.id,
      data: newMessage,
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
