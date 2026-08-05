export const formUiContent = {
  requiredLabel: "Required",
  errorLabel: "Error",
  consent: {
    statusLabel: "PLACEHOLDER / LEGAL REVIEW:",
    body:
      "Required consent wording has not been supplied. This mock checkbox is not final legal consent.",
  },
  /**
   * Was a "Development mock only" panel telling the visitor the endpoint sends
   * nothing. Now that submissions are delivered, it describes what actually
   * happens to what they typed.
   */
  handlingNotice: {
    ariaLabel: "What happens to your details",
    title: "What happens to what you write here",
    body:
      "Your message is sent to Sawayatra by email and is not stored on this website. Your browser keeps a short note that you sent it, so you are not asked twice — that note holds no part of what you wrote.",
  },
  submission: {
    pendingTitle: "Sending",
    pendingMessage: "One moment while this is sent.",
    successTitle: "Sent",
    localReceiptSavedSuffix:
      "Your browser has noted that this was sent, so you will not be asked twice.",
    localReceiptUnavailableSuffix: "",
    duplicateTitle: "Already sent",
    duplicateMessage:
      "You have already sent this exact message from this browser, so it has not been sent again. If you meant to add something, change the message and send it once more.",
    validationTitle: "Check the form",
    validationMessage: "Correct the marked fields, then try this action again.",
    networkErrorTitle: "Not sent",
  },
  clientErrors: {
    validation: "Check the marked fields and try this action again.",
    request:
      "This could not be sent, and nothing has been kept. Please try again in a moment.",
    unexpected:
      "Something unexpected came back and this may not have been sent. Please try again, or write to Sawayatra directly.",
    unreachable:
      "This could not be sent — the connection did not hold. Nothing has been kept. Please check your connection and try again.",
  },
} as const;

export const invitationRequestFormContent = {
  ariaLabel: "Invitation request",
  fields: {
    name: "Name",
    email: "Email",
    country: "Country",
    travelInterest: "Travel interest",
  },
  travelInterestHint:
    "Keep this non-sensitive. Do not include identity documents, payment details, health or mobility information, or emergency contacts.",
  actionLabel: "Request an invitation",
  pendingActionLabel: "Requesting invitation…",
} as const;

export const journeyInterestFormContent = {
  ariaLabelPrefix: "Ask to join",
  journeyLabel: "Journey",
  fields: {
    name: "Name",
    email: "Email",
    travelSelf: "Travel Self result",
    note: "Short note",
  },
  travelSelfPrompt: "Choose a result",
  travelSelfNotCompleted: "Not completed",
  noteHint:
    "Keep this to your non-sensitive journey interest. Do not include identity documents, payment details, health or mobility information, or emergency contacts.",
  actionLabel: "Ask to join this table",
  pendingActionLabel: "Asking to join this table…",
} as const;

export const signInInterestFormContent = {
  ariaLabel: "Member-access interest",
  emailLabel: "Email",
  emailHint:
    "This is an interest form only. It does not create an account or sign you in.",
  actionLabel: "Record interest in member access",
  pendingActionLabel: "Recording member-access interest…",
} as const;

export const contactQuestionFormContent = {
  ariaLabel: "Ask Sawayatra a question",
  fields: {
    name: "Name",
    email: "Email address",
    question: "What would you like to ask?",
    journeyContext: "Journey or section, optional",
  },
  journeyContextHint:
    "Change or remove this context if it is not relevant to your question.",
  questionHint:
    "Do not include payment details, identity documents, health information or emergency contacts.",
  actionLabel: "Send question",
  pendingActionLabel: "Sending question…",
} as const;

export const formApiMessages = {
  byKind: {
    "invitation-request":
      "Your request has been sent. Sawayatra will read it and reply to the address you gave.",
    "journey-interest":
      "Your enquiry has been sent. Sawayatra will read it and reply to the address you gave. This is an enquiry, not a booking.",
    "sign-in-interest":
      "Your interest has been sent. Member access is opening in stages, and Sawayatra will write to you when it does.",
    "contact-question":
      "Your question has been sent. Sawayatra will read it and reply to the address you gave.",
  },
  deliveryFailed:
    "This could not be sent just now, and nothing has been kept. Please try again in a moment, or write to Sawayatra directly.",
  deliveryUnavailable:
    "This form is not able to send messages at the moment, so nothing has been kept. Please write to Sawayatra directly.",
} as const;
