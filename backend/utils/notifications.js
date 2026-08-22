import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

export function buildInterviewReminderMessage(interview) {
  const date = new Date(interview.startTime).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  return (
    `Hi ${interview.studentName}, your interview is scheduled on ${date} ` +
    `in ${interview.room}. Please arrive 15 minutes early with your ID card ` +
    `and resume copies.`
  );
}

export function buildPanelistReminderMessage(interview, panelistName) {
  const date = new Date(interview.startTime).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  return (
    `Reminder: you are on the panel for ${interview.studentName}'s interview ` +
    `on ${date} in ${interview.room}.`
  );
}

export async function sendNotification(recipientEmail, message) {
  if (!recipientEmail) {
    return {
      recipient: null,
      message,
      sentAt: new Date().toISOString(),
      channel: "email-failed",
      error: "No email address provided"
    };
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: "Placement Cell Notification",
      text: message
    });

    return {
      recipient: recipientEmail,
      message,
      sentAt: new Date().toISOString(),
      channel: "email"
    };
  } catch (err) {
    console.error(`Failed to send email to ${recipientEmail}:`, err.message);
    return {
      recipient: recipientEmail,
      message,
      sentAt: new Date().toISOString(),
      channel: "email-failed",
      error: err.message
    };
  }
}

// interview here must include a `studentEmail` field (added by the route,
// since Interview documents only store studentId/studentName, not email)
export async function sendInterviewReminders(interview) {
  const sent = [];

  sent.push(
    await sendNotification(interview.studentEmail, buildInterviewReminderMessage(interview))
  );

  for (const panelist of interview.panelists || []) {
    sent.push(
      await sendNotification(panelist.email, buildPanelistReminderMessage(interview, panelist.name))
    );
  }

  return sent;
  
}
export function buildSelectionMessage(interview) {
  return (
    `Congratulations ${interview.studentName}! You have been SELECTED ` +
    `for the role you interviewed for. The placement cell will reach out ` +
    `shortly with next steps and offer details. Well done!`
  );
}

export function buildRejectionMessage(interview) {
  return (
    `Hi ${interview.studentName}, thank you for interviewing. After careful ` +
    `consideration, you were not selected for this particular role. Please don't ` +
    `be discouraged - keep an eye out for upcoming opportunities, and reach out ` +
    `to the placement cell if you'd like feedback.`
  );
}

// Sends the appropriate outcome message to a student based on status.
export async function sendOutcomeNotification(interview, outcome) {
  const message =
    outcome === "selected"
      ? buildSelectionMessage(interview)
      : buildRejectionMessage(interview);

  return sendNotification(interview.studentEmail, message);
}