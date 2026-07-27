export const formUiContent = {
  requiredLabel: "Required",
  errorLabel: "Error",
  consent: {
    statusLabel: "PLACEHOLDER / LEGAL REVIEW:",
    body:
      "Required consent wording has not been supplied. This mock checkbox is not final legal consent.",
  },
  mockNotice: {
    ariaLabel: "Development mock notice",
    title: "Development mock only",
    body:
      "This working endpoint sends nothing and stores nothing on the server. After a successful test, this browser stores only a one-way duplicate fingerprint and mock result—never the form values.",
  },
  submission: {
    pendingTitle: "Recording in the development mock",
    pendingMessage: "Please wait while the mock endpoint checks this request.",
    successTitle: "Development mock complete",
    localReceiptSavedSuffix:
      "This browser saved only a duplicate-detection fingerprint and mock result, not the form values.",
    localReceiptUnavailableSuffix:
      "Browser duplicate detection is unavailable, so no local receipt was saved.",
    duplicateTitle: "Duplicate mock request",
    duplicateMessage:
      "This exact request already has a development-mock receipt in this browser. It was not sent again. The receipt contains a fingerprint and result, not the form values.",
    validationTitle: "Check the form",
    validationMessage:
      "Correct the marked fields, then try this action again.",
    networkErrorTitle: "Development mock unavailable",
  },
  clientErrors: {
    validation: "Check the marked fields and try this action again.",
    request:
      "The development mock could not record this request. Try again; nothing was sent or stored.",
    unexpected:
      "The development mock returned an unexpected response. Try again; nothing was stored in this browser.",
    unreachable:
      "The development mock could not be reached. Check the connection and try again; nothing was sent or stored.",
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
  unavailableTitle: "Online delivery is not connected yet",
  unavailableMessage:
    "Your question was not sent or stored. Please use the email address shown on this page.",
} as const;

export const formApiMessages = {
  "invitation-request":
    "Development mock received the invitation request. Nothing was sent or stored on the server.",
  "journey-interest":
    "Development mock received the journey interest. Nothing was sent or stored on the server. In live mode, this request would be reviewed manually; it is not a booking.",
  "sign-in-interest":
    "Development mock received the member-access interest. Nothing was sent or stored on the server. Member access is opening in stages.",
} as const;
