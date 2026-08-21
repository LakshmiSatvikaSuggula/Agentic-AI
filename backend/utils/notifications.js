// Generates notification messages for students and panelists.
// This is a prototype - it builds the message text and logs it to the
// console instead of actually sending email/SMS. Swap sendNotification's
// body for a real email/SMS API call later without touching callers.

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

export function buildPanelistReminderMessage(interview) {
  const date = new Date(interview.startTime).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  return (
    `Reminder: you are on the panel for ${interview.studentName}'s interview ` +
    `on ${date} in ${interview.room}.`
  );
}

// Sends a notification - currently logs to console, swap this function's
// body for a real email/SMS provider call when ready.
export function sendNotification(recipient, message) {
  console.log(`[NOTIFICATION to ${recipient}]: ${message}`);
  return {
    recipient,
    message,
    sentAt: new Date().toISOString(),
    channel: "console-log"
  };
}

// Builds and sends all reminders for a given interview (student + panelists)
export function sendInterviewReminders(interview) {
  const sent = [];

  sent.push(
    sendNotification(interview.studentName, buildInterviewReminderMessage(interview))
  );

  for (const panelist of interview.panelists || []) {
    sent.push(sendNotification(panelist, buildPanelistReminderMessage(interview)));
  }

  return sent;
}