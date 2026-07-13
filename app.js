"use strict";

const STORAGE_KEY = "jv-agreement-navigator-v1";
const APP_VERSION = "1.0.0";

const STEPS = {
  pre: [
    { id: "overview", label: "Overview", note: "Project foundation" },
    { id: "parties", label: "Parties", note: "Members & capacity" },
    { id: "bid", label: "Bid strategy", note: "Tender pathway" },
    { id: "governance", label: "Governance", note: "Authority & decisions" },
    { id: "contributions", label: "Contributions", note: "Resources & shares" },
    { id: "risk", label: "Risk allocation", note: "Liability & protection" },
    { id: "clauses", label: "Clauses", note: "Agreement controls" },
    { id: "review", label: "Review & export", note: "Readiness summary" }
  ],
  post: [
    { id: "overview", label: "Overview", note: "Contract foundation" },
    { id: "parties", label: "Parties", note: "Members & capacity" },
    { id: "governance", label: "Governance", note: "Authority & decisions" },
    { id: "execution", label: "Scope & execution", note: "Delivery controls" },
    { id: "commercial", label: "Commercial", note: "Finance & accounts" },
    { id: "risk", label: "Risk & compliance", note: "Protection controls" },
    { id: "clauses", label: "Clauses", note: "Agreement controls" },
    { id: "review", label: "Review & export", note: "Readiness summary" }
  ]
};

const CLAUSES = [
  {
    id: "purpose-form",
    title: "Purpose, form and legal status",
    stage: "both",
    category: "Foundation",
    summary: "Defines whether the arrangement is contractual, incorporated, or a consortium and limits unintended agency.",
    why: "The chosen form determines legal personality, tax treatment, licensing, liability, contracting authority, and how third parties may pursue the members.",
    points: ["State whether a separate legal entity will be formed.", "Confirm the relationship is limited to the identified tender or project.", "Exclude unintended partnership or agency except where expressly authorized.", "Require changes to form to be approved as a reserved matter."],
    prompt: "Record the JV form, project-specific purpose, registration obligations, and any restriction on creating agency between the parties."
  },
  {
    id: "lead-authority",
    title: "Lead party and authorized representative",
    stage: "pre",
    category: "Tender",
    summary: "Sets the lead member's authority for bid submission, clarifications, communications, and binding commitments.",
    why: "Tender documents often appoint a lead member, but the internal limits of that authority must be clear to prevent an unauthorized commitment or tender disqualification.",
    points: ["Name the lead party and representative.", "List actions permitted without further approval.", "Identify commitments that require unanimous or board approval.", "Set a process for replacing the representative."],
    prompt: "Define who signs the bid, answers clarifications, receives notices, and may bind the members before award."
  },
  {
    id: "exclusivity",
    title: "Tender exclusivity and bid commitment",
    stage: "pre",
    category: "Tender",
    summary: "Prevents a party from joining a competing bid and confirms each member's commitment through tender validity.",
    why: "A withdrawal or competing bid can invalidate the submission, waste bid expenditure, or expose the remaining party to security calls and reputational loss.",
    points: ["Define the exclusive tender and territory.", "Cover tender validity extensions.", "Control withdrawal and replacement.", "Allocate resulting costs and losses."],
    prompt: "Set the exclusivity period, permitted exceptions, withdrawal consequences, and tender-validity extension process."
  },
  {
    id: "bid-costs",
    title: "Bid costs and pre-award expenditure",
    stage: "pre",
    category: "Tender",
    summary: "Allocates estimating, design, legal, travel, bonds, and other tender costs.",
    why: "Unapproved bid expenditure and unclear reimbursement rules are common early disputes, especially if the tender is cancelled or unsuccessful.",
    points: ["Set approved budgets and cost categories.", "Allocate shares and approval thresholds.", "Address employer reimbursements.", "Confirm treatment if a party withdraws."],
    prompt: "Document the bid budget, cost-sharing percentage, approval threshold, invoicing evidence, and settlement timing."
  },
  {
    id: "tender-security",
    title: "Tender security and indemnity",
    stage: "pre",
    category: "Tender",
    summary: "Allocates the provision, cost, counter-indemnity, and risk of a bid bond or tender guarantee.",
    why: "The issuing party may carry the full bank exposure even though the security supports all members. Internal counter-security and call risk should be explicit.",
    points: ["Identify provider and format.", "Allocate fees, collateral, and facility usage.", "Set counter-indemnities.", "Allocate liability for a call caused by a member."],
    prompt: "Record security amount, expiry, provider, counter-indemnity, collateral, and the allocation of any call."
  },
  {
    id: "award-conversion",
    title: "Award conversion and definitive agreement",
    stage: "pre",
    category: "Tender",
    summary: "Defines what happens on award and the deadline for signing the post-tender JV agreement.",
    why: "A short pre-tender agreement should not leave the parties without binding project-delivery terms after award.",
    points: ["Define award or letter-of-intent trigger.", "Set a deadline for the definitive agreement.", "Identify terms that survive until replacement.", "Address failure to reach the definitive agreement."],
    prompt: "Define the conversion trigger, interim binding terms, negotiation deadline, and consequences if the definitive agreement is not signed."
  },
  {
    id: "scope-matrix",
    title: "Scope and responsibility matrix",
    stage: "both",
    category: "Delivery",
    summary: "Divides design, procurement, construction, testing, approvals, handover, and interface duties.",
    why: "Participation percentages do not define who performs each obligation. A detailed matrix prevents scope gaps, duplication, and unpriced interfaces.",
    points: ["Map main-contract obligations to a responsible party.", "Allocate design and authority approvals.", "Define shared services and attendance.", "Assign interface management and residual scope."],
    prompt: "Attach a responsibility matrix that assigns every major deliverable, interface, approval, and shared service."
  },
  {
    id: "governance",
    title: "Governance, board and voting",
    stage: "both",
    category: "Governance",
    summary: "Creates the JV board, voting weights, quorum, meeting rules, and delegated management structure.",
    why: "Effective governance must balance participation rights with timely decisions and must align with authority given to the lead party and project team.",
    points: ["Define board composition and alternates.", "Set weighted or equal voting.", "Establish quorum and notice.", "Delegate defined authority to project management."],
    prompt: "Record representatives, voting rules, quorum, meeting cadence, written resolutions, and delegation limits."
  },
  {
    id: "reserved-matters",
    title: "Reserved matters and authority thresholds",
    stage: "both",
    category: "Governance",
    summary: "Lists decisions requiring unanimous or enhanced approval and monetary thresholds for management authority.",
    why: "Without reserved matters, one party or manager may commit the JV to major commercial, financing, claims, settlement, or subcontract decisions.",
    points: ["Contract amendments and material variations.", "Major procurement and subcontract awards.", "Claims, settlements, and dispute escalation.", "Borrowing, guarantees, cash calls, and budgets."],
    prompt: "Create an authority matrix with decision, approver, voting threshold, monetary limit, and evidence required."
  },
  {
    id: "deadlock",
    title: "Deadlock escalation",
    stage: "both",
    category: "Governance",
    summary: "Provides a staged process when the board cannot decide a critical matter.",
    why: "A deadlock during tender submission or project execution can cause missed notices, delayed procurement, or default under the main contract.",
    points: ["Define what constitutes deadlock.", "Escalate to named senior executives.", "Use interim protective action where necessary.", "Set final resolution or exit mechanism."],
    prompt: "Set operational escalation, executive escalation, time limits, interim authority, mediation or expert determination, and final remedy."
  },
  {
    id: "contributions",
    title: "Contributions, resources and cash calls",
    stage: "both",
    category: "Commercial",
    summary: "Commits personnel, plant, systems, know-how, facilities, and working capital from each member.",
    why: "The JV needs enforceable commitments to the resources assumed in the tender and a practical remedy if a member fails to provide them.",
    points: ["List committed key staff and equipment.", "Price or value in-kind contributions.", "Set cash-call timing and evidence.", "Provide default funding and dilution or recovery remedies."],
    prompt: "Attach a contribution schedule showing item, provider, timing, valuation, replacement standard, and failure remedy."
  },
  {
    id: "profit-loss",
    title: "Profit, loss and participation shares",
    stage: "post",
    category: "Commercial",
    summary: "Defines how revenue, cost, profit, loss, tax, liabilities, and distributions follow participation shares or another formula.",
    why: "Scope shares, equity shares, cost shares, and profit shares can differ. Each percentage must be separately defined and reconciled.",
    points: ["Define each percentage and its purpose.", "Set distribution conditions and reserves.", "Allocate losses and overruns.", "Address changes to scope or participation."],
    prompt: "Record scope, funding, voting, profit, loss, security, and liability shares separately and explain any differences."
  },
  {
    id: "banking-accounts",
    title: "Banking, accounting and audit",
    stage: "post",
    category: "Commercial",
    summary: "Controls bank accounts, signatories, budgets, records, invoicing, financial reporting, and audit rights.",
    why: "Transparent financial controls are essential where one member operates the account or provides shared services to the JV.",
    points: ["Use dual signatories or approved limits.", "Adopt accounting policies and reporting cycle.", "Control related-party charges.", "Provide member and external audit rights."],
    prompt: "Set account ownership, signatories, payment approvals, budget controls, reporting, audit access, and record retention."
  },
  {
    id: "joint-several",
    title: "Joint and several liability",
    stage: "both",
    category: "Risk",
    summary: "Reconciles external liability to the employer with internal allocation and recourse between members.",
    why: "Tender or main-contract terms may make every member liable for all obligations. The JV agreement should define contribution and indemnity internally without contradicting the employer's rights.",
    points: ["Confirm the external liability position.", "Allocate internal responsibility by cause or share.", "Provide prompt indemnity and recovery.", "Preserve employer rights where required."],
    prompt: "State the external liability required by the tender or contract and the internal recourse for member-caused loss."
  },
  {
    id: "indemnity-caps",
    title: "Indemnities, exclusions and liability caps",
    stage: "both",
    category: "Risk",
    summary: "Allocates losses caused by breach, negligence, misconduct, scope failure, and third-party claims.",
    why: "A general sharing percentage may be unfair where loss is caused by one member. Caps and exclusions must align with the main contract and applicable law.",
    points: ["Use cause-based indemnities.", "Define direct and excluded losses.", "Set appropriate caps and carve-outs.", "Coordinate claim defence and settlement."],
    prompt: "Define indemnified events, claim procedure, mitigation, defence control, caps, exclusions, and carve-outs."
  },
  {
    id: "insurance-security",
    title: "Insurance, guarantees and project securities",
    stage: "post",
    category: "Risk",
    summary: "Allocates insurance, performance security, advance payment guarantees, retention bonds, collateral, and renewals.",
    why: "Security facilities consume credit capacity and expose the provider to calls. Costs, counter-security, expiry, and renewal decisions need internal controls.",
    points: ["Identify each policy or security.", "Allocate provider, cost, collateral, and call risk.", "Set renewal and release procedures.", "Coordinate claims and policy compliance."],
    prompt: "Prepare a security schedule listing beneficiary, instrument, amount, provider, expiry, collateral, cost, and internal counter-indemnity."
  },
  {
    id: "procurement",
    title: "Procurement and subcontracting",
    stage: "post",
    category: "Delivery",
    summary: "Sets procurement authority, tendering rules, related-party transactions, subcontract approvals, and flow-down requirements.",
    why: "Procurement is a major source of cash, quality, schedule, and conflict-of-interest risk within a project JV.",
    points: ["Set competition and approval thresholds.", "Control member-affiliate awards.", "Flow down main-contract obligations.", "Allocate supplier and subcontractor management."],
    prompt: "Define procurement routes, bid requirements, authority levels, related-party controls, flow-down terms, and performance monitoring."
  },
  {
    id: "programme-claims",
    title: "Programme, variations and claims",
    stage: "post",
    category: "Delivery",
    summary: "Coordinates programme control, notices, records, variation pricing, claims preparation, settlement, and internal entitlement.",
    why: "Main-contract time bars and notice requirements can be lost if each member treats claims independently or withholds records.",
    points: ["Appoint programme and claims leads.", "Mirror main-contract notice deadlines internally.", "Require contemporaneous records.", "Allocate recovery and unrecovered costs."],
    prompt: "Set notice lead times, document responsibilities, claim approval, settlement authority, and allocation of recovered or rejected amounts."
  },
  {
    id: "default-withdrawal",
    title: "Default, step-in and withdrawal",
    stage: "both",
    category: "Exit",
    summary: "Defines member default, cure periods, step-in, replacement, funding remedies, and restrictions on withdrawal.",
    why: "A member's failure can threaten tender validity or main-contract performance. Remedies must preserve delivery and comply with employer approval requirements.",
    points: ["Define material and urgent defaults.", "Set cure periods and emergency step-in.", "Allocate additional costs.", "Control replacement, transfer, and employer consent."],
    prompt: "Define default events, notice, cure, urgent action, step-in, cost recovery, suspension of rights, and replacement."
  },
  {
    id: "confidentiality-ip",
    title: "Confidentiality, documents and intellectual property",
    stage: "both",
    category: "Compliance",
    summary: "Protects tender information, designs, know-how, project records, licences, and permitted use after termination.",
    why: "Members exchange proprietary pricing, methods, and designs. The JV also needs adequate licences to deliver, operate, and remedy the works.",
    points: ["Separate background and project IP.", "Grant project-use licences.", "Control disclosure and publicity.", "Set return, retention, and survival obligations."],
    prompt: "Define confidential information, permitted disclosures, data security, IP ownership, licences, publication rights, and survival."
  },
  {
    id: "compliance",
    title: "Compliance, ethics and local obligations",
    stage: "both",
    category: "Compliance",
    summary: "Covers anti-bribery, sanctions, competition, labour, HSE, data, localization, permits, and reporting duties.",
    why: "A compliance breach by one member can disqualify the tender, trigger termination, or expose all members to investigation and loss.",
    points: ["Adopt applicable policies and reporting.", "Allocate permits and local-content commitments.", "Require investigation cooperation.", "Provide breach remedies and indemnities."],
    prompt: "List applicable compliance regimes, responsible member, certifications, audit evidence, reporting, and breach consequences."
  },
  {
    id: "law-disputes",
    title: "Governing law and dispute resolution",
    stage: "both",
    category: "Disputes",
    summary: "Sets governing law, language, notices, amicable settlement, expert determination, courts or arbitration, seat, rules, and interim relief.",
    why: "The internal JV dispute process should be enforceable, fast enough for live project decisions, and coordinated with main-contract disputes.",
    points: ["Name governing law and language.", "Use a short senior-management escalation.", "Reserve experts for technical or accounting issues.", "Define arbitration or court forum and interim relief."],
    prompt: "Record governing law, language, escalation periods, expert matters, forum, seat, rules, tribunal, and consolidation considerations."
  },
  {
    id: "completion-exit",
    title: "Completion, defects, close-out and termination",
    stage: "post",
    category: "Exit",
    summary: "Keeps the JV functioning through completion, defects, final account, claims, audits, and release of securities.",
    why: "The operational work may finish long before liabilities, securities, tax, defects, and disputes are closed.",
    points: ["Define completion and winding-up triggers.", "Fund defects and outstanding claims.", "Retain records and key personnel.", "Release reserves and securities only after liabilities close."],
    prompt: "Set the survival period, close-out plan, reserves, record custody, defects obligations, security release, and final distribution."
  }
];

const CHECKLISTS = {
  pre: [
    ["rfp-reviewed", "Tender and RFP reviewed", "All JV, consortium, eligibility, security, and submission requirements extracted.", true],
    ["form-confirmed", "JV form confirmed", "Contractual JV, incorporated JV, or consortium status selected.", true],
    ["parties-verified", "Party capacity verified", "Legal names, registrations, authority, licences, and eligibility checked.", true],
    ["shares-total", "Participation shares equal 100%", "Scope, cost, voting, and liability percentages reconciled.", true],
    ["lead-authority", "Lead party authority documented", "Submission, clarification, notices, and binding authority defined.", true],
    ["poa-ready", "Power of attorney prepared", "Form, signatories, notarization, and legalization requirements confirmed.", true],
    ["exclusivity-agreed", "Tender exclusivity agreed", "Competing bids, withdrawal, and validity extensions controlled.", false],
    ["bid-cost-budget", "Bid cost budget approved", "Budget, sharing, approval, invoicing, and settlement rules agreed.", false],
    ["bid-security", "Tender security allocated", "Provider, collateral, fees, counter-indemnity, and call risk agreed.", true],
    ["governance-ready", "Tender governance ready", "Representatives, voting, reserved matters, and deadlock route agreed.", true],
    ["scope-matrix", "Preliminary scope matrix attached", "Bid responsibilities, design, pricing, and interfaces allocated.", true],
    ["resources", "Tender resources committed", "Named personnel, estimating inputs, data, and due dates agreed.", false],
    ["liability-confirmed", "External liability confirmed", "Tender requirement for joint and several liability verified.", true],
    ["compliance-verified", "Compliance declarations verified", "Conflicts, sanctions, anti-bribery, localization, and eligibility covered.", true],
    ["conversion-trigger", "Post-award conversion defined", "Trigger, timeline, interim terms, and definitive agreement route agreed.", true],
    ["signatures-ready", "Execution formalities ready", "Corporate approvals, signatures, witnesses, and document control checked.", true]
  ],
  post: [
    ["main-contract-reviewed", "Executed main contract reviewed", "All joint obligations, securities, notices, time bars, and flow-downs extracted.", true],
    ["conditions-precedent", "Conditions precedent satisfied", "Registrations, approvals, licences, accounts, and authorities completed.", true],
    ["party-capacity", "Member capacity reconfirmed", "Legal status, authority, solvency, licences, and project eligibility current.", true],
    ["shares-total", "All participation shares reconciled", "Scope, funding, voting, profit, loss, security, and liability shares clear.", true],
    ["scope-matrix", "Detailed scope matrix attached", "Every main-contract duty and interface assigned.", true],
    ["governance-ready", "Governance operational", "Board, delegated authority, reserved matters, and deadlock route approved.", true],
    ["key-roles", "Key appointments approved", "Project director, commercial, planning, finance, HSE, quality, and claims leads named.", false],
    ["budget-approved", "Baseline budget approved", "Cost codes, contingencies, working capital, and cash-flow assumptions agreed.", true],
    ["banking-ready", "Banking and controls established", "Accounts, signatories, payment limits, accounting, and audit rights set.", true],
    ["securities-ready", "Securities and collateral allocated", "Performance, advance, retention, and other instruments scheduled.", true],
    ["insurance-ready", "Insurance responsibilities confirmed", "Policies, deductibles, compliance, renewals, and claims handling allocated.", true],
    ["programme-accepted", "JV programme and controls agreed", "Baseline, reporting, records, notices, variations, and claims route aligned.", true],
    ["procurement-controls", "Procurement controls approved", "Tender thresholds, related parties, subcontracting, and flow-downs set.", false],
    ["liability-confirmed", "Liability and indemnities agreed", "External exposure, internal recourse, caps, exclusions, and carve-outs set.", true],
    ["compliance-verified", "Project compliance matrix complete", "Local content, labour, HSE, anti-bribery, data, and permits allocated.", true],
    ["dispute-ready", "Dispute process coordinated", "Internal escalation and main-contract claim or dispute interfaces agreed.", true],
    ["default-exit", "Default and step-in workable", "Cure, emergency action, replacement, withdrawal, and employer consent addressed.", true],
    ["closeout-ready", "Close-out obligations defined", "Defects, final account, records, security release, and survival terms covered.", false]
  ]
};

function createDefaultState() {
  return {
    version: APP_VERSION,
    mode: "pre",
    currentStep: "overview",
    savedAt: null,
    openClause: "purpose-form",
    clauseSearch: "",
    clauseView: "checklist",
    clauseStatus: {},
    project: {
      name: "", employer: "", country: "", governingLaw: "", tenderRef: "", deadline: "",
      currency: "", contractForm: "", contractDate: "", commencementDate: "", completionDate: "",
      projectDescription: "", mainContractValue: "", language: "English"
    },
    parties: [
      { name: "", legalForm: "", registration: "", country: "", role: "Lead", share: "50", representative: "", authority: "" },
      { name: "", legalForm: "", registration: "", country: "", role: "Member", share: "50", representative: "", authority: "" }
    ],
    bid: {
      jvForm: "Contractual JV / Consortium", leadParty: "", leadAuthority: "", bindingAuthority: "Lead party within approved limits",
      exclusivity: "", bidValidity: "", bidCostMethod: "Proportional to participation share", bidCostBudget: "",
      bidBondRequired: "Yes", bidBondAmount: "", bidBondProvider: "", bondAllocation: "",
      conversionTrigger: "Award of the contract and execution of the main contract", conversionDeadline: "",
      interimTerms: "Pre-tender agreement remains binding until replaced by the definitive post-tender JV agreement."
    },
    governance: {
      boardComposition: "One representative from each party", voting: "In proportion to participation share", quorum: "All parties represented",
      chair: "", meetings: "Monthly and as required", reservedMatters: "", deadlock: "",
      projectDirector: "", delegatedAuthority: "", urgentAction: "", noticesLead: ""
    },
    contributions: {
      scopeMatrix: "", personnel: "", plant: "", systems: "", workingCapital: "", localContent: "",
      valuation: "At verified cost unless otherwise approved", shortfallRemedy: "Defaulting party reimburses resulting cost and delay"
    },
    execution: {
      scopeMatrix: "", interfaceLead: "", designLead: "", procurementLead: "", constructionLead: "",
      programmeLead: "", claimsLead: "", reporting: "Monthly board report with weekly project controls dashboard",
      variations: "", notices: "", records: "", subcontracting: "", completion: "", defects: ""
    },
    commercial: {
      profitShare: "", lossShare: "", fundingShare: "", workingCapital: "", cashCalls: "",
      bankAccount: "", signatories: "", paymentAuthority: "", accounting: "", audit: "",
      tax: "", relatedPartyCharges: "", distributions: "", contingency: ""
    },
    risk: {
      externalLiability: "", internalAllocation: "", indemnity: "", liabilityCap: "", exclusions: "",
      insurance: "", securities: "", counterIndemnity: "", compliance: "", confidentiality: "",
      ip: "", default: "", withdrawal: "", termination: "", governingLaw: "", dispute: "",
      arbitrationSeat: "", arbitrationRules: "", language: "English"
    },
    checklist: { pre: {}, post: {} }
  };
}

let state = loadState();
let saveTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function loadState() {
  const fallback = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return deepMerge(fallback, parsed);
  } catch (error) {
    console.warn("Could not load local draft", error);
    return fallback;
  }
}

function deepMerge(target, source) {
  if (!source || typeof source !== "object") return target;
  Object.keys(source).forEach(key => {
    if (Array.isArray(source[key])) target[key] = source[key];
    else if (source[key] && typeof source[key] === "object") target[key] = deepMerge(target[key] || {}, source[key]);
    else target[key] = source[key];
  });
  return target;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPath(path) {
  return path.split(".").reduce((acc, key) => acc?.[key], state);
}

function setPath(path, value) {
  const keys = path.split(".");
  let target = state;
  keys.slice(0, -1).forEach(key => {
    if (!target[key] || typeof target[key] !== "object") target[key] = {};
    target = target[key];
  });
  target[keys.at(-1)] = value;
}

function debounceSave() {
  const saveState = $("#save-state");
  saveState?.classList.add("saving");
  if ($("#last-saved")) $("#last-saved").textContent = "Saving…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveDraft(false), 450);
}

function saveDraft(showConfirmation = true) {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  $("#save-state")?.classList.remove("saving");
  updateSavedTime();
  if (showConfirmation) toast("Draft saved on this device");
}

function updateSavedTime() {
  const target = $("#last-saved");
  if (!target) return;
  target.textContent = state.savedAt
    ? `Last saved ${new Date(state.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Ready";
}

function toast(message) {
  const region = $("#toast-region");
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  region.appendChild(item);
  setTimeout(() => item.remove(), 2800);
}

function icon(name) {
  const icons = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    circle: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h12l3 3v15H4V3h1Zm2 0v6h9V3M8 21v-7h8v7"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75"/></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    building: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V8l7-5 7 5v13M8 11h2M14 11h2M8 15h2M14 15h2"/></svg>',
    pie: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12A9 9 0 1 1 12 3v9h9Z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
    clauses: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l4 4v16H6zM14 2v5h5M9 11h6M9 15h6M9 19h4"/></svg>',
    export: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0-12 4 4m-4-4L8 7M5 13v7h14v-7"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 3.6 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    chevron: '<svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14"/></svg>',
    print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>',
    upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0L8 8m4-4 4 4M5 20h14"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>'
  };
  return icons[name] || icons.file;
}

function inputField(path, label, options = {}) {
  const value = getPath(path);
  const type = options.type || "text";
  const required = options.required ? '<span class="required" aria-hidden="true">*</span>' : "";
  const help = options.help ? `<span class="field-help">${escapeHtml(options.help)}</span>` : "";
  const span = options.span ? ` span-${options.span}` : "";
  const placeholder = escapeHtml(options.placeholder || "");
  return `<div class="field${span}">
    <label for="${path}">${escapeHtml(label)} ${required}</label>
    <input class="input" id="${path}" type="${type}" data-path="${path}" value="${escapeHtml(value)}" placeholder="${placeholder}" ${options.min ? `min="${options.min}"` : ""} ${options.max ? `max="${options.max}"` : ""} ${options.step ? `step="${options.step}"` : ""} ${options.required ? "required" : ""}>
    ${help}
  </div>`;
}

function textareaField(path, label, options = {}) {
  const required = options.required ? '<span class="required" aria-hidden="true">*</span>' : "";
  const help = options.help ? `<span class="field-help">${escapeHtml(options.help)}</span>` : "";
  const span = options.span ? ` span-${options.span}` : "";
  return `<div class="field${span}">
    <label for="${path}">${escapeHtml(label)} ${required}</label>
    <textarea class="textarea" id="${path}" data-path="${path}" placeholder="${escapeHtml(options.placeholder || "")}" ${options.required ? "required" : ""}>${escapeHtml(getPath(path))}</textarea>
    ${help}
  </div>`;
}

function selectField(path, label, values, options = {}) {
  const current = String(getPath(path) ?? "");
  const required = options.required ? '<span class="required" aria-hidden="true">*</span>' : "";
  const span = options.span ? ` span-${options.span}` : "";
  const optionHtml = [`<option value="">${escapeHtml(options.placeholder || "Select…")}</option>`]
    .concat(values.map(item => {
      const value = typeof item === "string" ? item : item.value;
      const labelText = typeof item === "string" ? item : item.label;
      return `<option value="${escapeHtml(value)}" ${current === String(value) ? "selected" : ""}>${escapeHtml(labelText)}</option>`;
    })).join("");
  return `<div class="field${span}">
    <label for="${path}">${escapeHtml(label)} ${required}</label>
    <select class="select" id="${path}" data-path="${path}" ${options.required ? "required" : ""}>${optionHtml}</select>
    ${options.help ? `<span class="field-help">${escapeHtml(options.help)}</span>` : ""}
  </div>`;
}

function radioField(path, label, values, options = {}) {
  const current = String(getPath(path) ?? "");
  return `<div class="field${options.span ? ` span-${options.span}` : ""}">
    <span class="field-label">${escapeHtml(label)} ${options.required ? '<span class="required">*</span>' : ""}</span>
    <div class="choice-row" role="radiogroup" aria-label="${escapeHtml(label)}">
      ${values.map(value => `<label class="choice"><input type="radio" name="${path}" data-path="${path}" value="${escapeHtml(value)}" ${current === value ? "checked" : ""}><span class="choice-mark"></span><span>${escapeHtml(value)}</span></label>`).join("")}
    </div>
  </div>`;
}

function section(title, description, iconName, body, clauseId = "") {
  return `<section class="form-section">
    <div class="section-heading">
      <div>${icon(iconName)}<span><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ""}</span></div>
      ${clauseId ? `<button class="help-link" type="button" data-action="show-clause" data-clause="${clauseId}">Why this matters</button>` : ""}
    </div>
    ${body}
  </section>`;
}

function pageHead(title, copy, actions = "") {
  return `<header class="page-head"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(copy)}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ""}</header>`;
}

function renderOverview() {
  const post = state.mode === "post";
  const title = post ? "Set the post-award agreement foundation" : "Start with the tender and JV foundation";
  const copy = post
    ? "Capture the executed main-contract context before allocating delivery obligations, authority, commercial controls, and risk between the JV members."
    : "Capture the tender context and intended JV form before the parties commit bid resources, securities, authority, and liabilities.";

  const foundation = section(
    post ? "Main contract identity" : "Tender identity",
    post ? "Use the executed contract and award documents." : "Use the latest tender and addenda.",
    "file",
    `<div class="field-grid">
      ${inputField("project.name", "Project / tender name", { required: true, placeholder: "Enter the official title" })}
      ${inputField("project.employer", "Employer / client", { required: true, placeholder: "Legal entity name" })}
      ${inputField("project.tenderRef", post ? "Main contract reference" : "Tender reference", { required: true, placeholder: "Reference number" })}
      ${inputField(post ? "project.contractDate" : "project.deadline", post ? "Contract date" : "Submission deadline", { type: "date", required: true })}
      ${inputField("project.country", "Project country", { required: true, placeholder: "Country and jurisdiction" })}
      ${inputField("project.governingLaw", "Main contract / tender governing law", { required: true, placeholder: "e.g., Laws of the Kingdom of Saudi Arabia" })}
      ${selectField("project.contractForm", "Main contract form", ["FIDIC 1999 Red Book", "FIDIC 2017 Red Book", "FIDIC Yellow Book", "Employer bespoke form", "Government standard form", "Other"], { placeholder: "Select or classify" })}
      ${inputField("project.currency", "Contract / tender currency", { placeholder: "e.g., SAR, AED, USD" })}
      ${textareaField("project.projectDescription", "Project and JV purpose", { span: 2, required: true, placeholder: "Summarize the works, procurement route, package boundaries, and purpose of the JV." })}
    </div>`,
    "purpose-form"
  );

  const stageSpecific = post
    ? section(
        "Award and delivery dates",
        "Align internal obligations with the main-contract programme.",
        "target",
        `<div class="field-grid three">
          ${inputField("project.commencementDate", "Commencement date", { type: "date" })}
          ${inputField("project.completionDate", "Contract completion date", { type: "date" })}
          ${inputField("project.mainContractValue", "Main contract value", { placeholder: "Amount and currency" })}
        </div>`,
        "completion-exit"
      )
    : section(
        "JV arrangement",
        "Define the intended structure for bid submission.",
        "users",
        `<div class="field-grid">
          ${selectField("bid.jvForm", "JV / consortium form", ["Contractual JV / Consortium", "Unincorporated JV", "Incorporated JV after award", "Special purpose vehicle", "Other"], { required: true })}
          ${inputField("bid.bidValidity", "Tender validity period", { placeholder: "e.g., 120 calendar days" })}
          ${radioField("bid.exclusivity", "Exclusive tender arrangement", ["Yes", "No", "To be agreed"], { required: true })}
          ${selectField("project.language", "Tender / agreement language", ["English", "Arabic", "Bilingual English–Arabic", "French", "Other"])}
        </div>`,
        "exclusivity"
      );

  return `${pageHead(title, copy, `<button class="button" type="button" data-action="load-sample">Load demonstration data</button>`)}
    <div class="intro-band">
      <div><h2>${post ? "From award to handover" : "From invitation to award"}</h2><p>${post ? "The post-tender agreement should operate as the internal project constitution: it allocates the main contract, money, decisions, records, claims, liabilities, and close-out obligations." : "The pre-tender agreement should be compact but binding on the points that protect the submission: eligibility, exclusivity, authority, bid cost, security, scope assumptions, liability, and conversion after award."}</p></div>
      <div class="intro-callout"><strong>Preparation principle</strong><span>Keep external obligations to the employer distinct from the members' internal allocation and recourse.</span></div>
    </div>
    <div class="form-stack">${foundation}${stageSpecific}</div>
    ${actionBar()}`;
}

function renderParties() {
  const rows = state.parties.map((party, index) => `<tr>
    <td><input class="input" aria-label="Party ${index + 1} legal name" data-party-index="${index}" data-party-field="name" value="${escapeHtml(party.name)}" placeholder="Legal entity name"></td>
    <td><input class="input" aria-label="Party ${index + 1} registration" data-party-index="${index}" data-party-field="registration" value="${escapeHtml(party.registration)}" placeholder="Registration no."></td>
    <td><input class="input" aria-label="Party ${index + 1} country" data-party-index="${index}" data-party-field="country" value="${escapeHtml(party.country)}" placeholder="Country"></td>
    <td><select class="select" aria-label="Party ${index + 1} role" data-party-index="${index}" data-party-field="role">${["Lead", "Member", "Technical partner", "Local partner"].map(role => `<option ${party.role === role ? "selected" : ""}>${role}</option>`).join("")}</select></td>
    <td><input class="input" aria-label="Party ${index + 1} share" type="number" min="0" max="100" step="0.01" data-party-index="${index}" data-party-field="share" value="${escapeHtml(party.share)}"></td>
    <td><button class="button small danger" type="button" data-action="remove-party" data-index="${index}" ${state.parties.length <= 2 ? "disabled" : ""}>${icon("trash")}<span class="visually-hidden">Remove party ${index + 1}</span></button></td>
  </tr>`).join("");
  const total = partyShareTotal();

  return `${pageHead("Confirm the parties and their capacity", "Record the exact legal entities, eligibility, authority, and participation. Verify these details against corporate documents and the tender or main contract.")}
    <div class="form-stack">
      ${section("JV members", "Add every party that will sign or carry obligations.", "users", `
        <div class="party-table-wrap"><table class="data-table">
          <thead><tr><th>Legal name</th><th>Registration</th><th>Country</th><th>Role</th><th>Share %</th><th>Action</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        <div class="table-actions">
          <button class="button small" type="button" data-action="add-party">${icon("plus")} Add party</button>
          <div class="share-total ${Math.abs(total - 100) > .001 ? "error" : ""}">Participation total: <strong>${formatNumber(total)}%</strong> ${Math.abs(total - 100) > .001 ? "— must equal 100%" : "— balanced"}</div>
        </div>`, "purpose-form")}
      ${section("Authority and eligibility", "Confirm each party can lawfully enter, bid, and perform.", "shield", `<div class="field-grid">
        ${textareaField("governance.boardComposition", "Authorized representatives and corporate approvals", { span: 2, required: true, placeholder: "List representatives, approving bodies, board resolutions, powers of attorney, notarization, and legalization requirements." })}
        ${textareaField("risk.compliance", "Eligibility and compliance checks", { span: 2, required: true, placeholder: "Licences, classification, sanctions, conflicts, anti-bribery declarations, local content, tax, labour, and tender eligibility." })}
      </div>`, "compliance")}
      ${section("Percentage definitions", "Do not use one percentage without stating what it controls.", "pie", `<div class="notice warning">Confirm separately whether the recorded share applies to voting, scope, bid cost, funding, profit, loss, security, and internal liability. Any difference should be recorded expressly.</div>`, "profit-loss")}
    </div>
    ${actionBar()}`;
}

function renderBid() {
  return `${pageHead("Define the bid and award pathway", "Capture the essential tender details and your planned bid and award pathway. This will shape governance, contributions, risks, and the agreement clauses.")}
    <div class="form-stack">
      ${section("Tender identity", "Confirm the latest tender particulars before authority or security commitments are made.", "file", `<div class="field-grid">
        ${inputField("project.name", "Project / tender name", { required: true, placeholder: "Official tender title" })}
        ${inputField("project.employer", "Employer", { required: true, placeholder: "Legal entity name" })}
        ${inputField("project.country", "Country / governing law", { required: true, placeholder: "Country and applicable law" })}
        ${inputField("project.tenderRef", "Tender reference", { required: true })}
        ${inputField("project.deadline", "Submission deadline", { type: "date", required: true })}
        ${inputField("project.currency", "Tendering currency", { placeholder: "e.g., SAR, AED, USD" })}
      </div>`, "purpose-form")}
      ${section("Lead party and representation", "Control who communicates and who may bind the members.", "target", `<div class="field-grid">
        ${selectField("bid.leadParty", "Lead party", state.parties.filter(p => p.name).map(p => p.name), { required: true, placeholder: "Select a completed party" })}
        ${radioField("bid.leadAuthority", "Lead party authority", ["Confirmed and documented", "Limited authority", "To be confirmed"], { required: true })}
        ${selectField("bid.bindingAuthority", "Who may bind the JV in the bid", ["Lead party within approved limits", "All parties jointly", "JV board only", "Named representative under power of attorney"], { required: true })}
        ${textareaField("governance.delegatedAuthority", "Authority limits", { placeholder: "List commitments requiring prior approval, such as price changes, qualifications, validity extensions, securities, and settlement of clarifications." })}
      </div>`, "lead-authority")}
      ${section("Bid cost sharing", "Agree exclusivity and control pre-award expenditure.", "pie", `<div class="field-grid">
        ${radioField("bid.exclusivity", "Exclusive tender arrangement", ["Yes", "No", "To be agreed"], { required: true })}
        ${inputField("bid.bidValidity", "Tender validity / extension process", { placeholder: "e.g., 120 days; extension by unanimous approval" })}
        ${selectField("bid.bidCostMethod", "Bid cost split method", ["Proportional to participation share", "Equal shares", "By responsibility / workstream", "Approved budget schedule", "Other"], { required: true })}
        ${inputField("bid.bidCostBudget", "Approved bid budget", { placeholder: "Amount and currency" })}
      </div>`, "bid-costs")}
      ${section("Tender security", "Allocate facility use, cost, collateral, and call risk.", "shield", `<div class="field-grid">
        ${radioField("bid.bidBondRequired", "Bid bond required", ["Yes", "No", "Not confirmed"], { required: true })}
        ${inputField("bid.bidBondAmount", "Bid bond amount / percentage", { placeholder: "e.g., SAR 5,000,000 or 1%" })}
        ${inputField("bid.bidBondProvider", "Providing party / bank", { required: state.bid.bidBondRequired === "Yes", placeholder: "Party and issuing bank" })}
        ${selectField("bid.bondAllocation", "Counter-security / call allocation", ["Proportional to participation share", "Equal between parties", "By cause of call", "Provider carries exposure", "To be agreed"], { required: state.bid.bidBondRequired === "Yes" })}
      </div>`, "tender-security")}
      ${section("Award conversion", "Avoid a contractual gap between award and the definitive JV agreement.", "export", `<div class="field-grid">
        ${textareaField("bid.conversionTrigger", "Conversion trigger", { required: true, placeholder: "Award, letter of intent, contract execution, or notice to proceed." })}
        ${inputField("bid.conversionDeadline", "Definitive agreement deadline", { placeholder: "e.g., within 14 days after award" })}
        ${textareaField("bid.interimTerms", "Interim binding terms", { span: 2, required: true, placeholder: "Identify provisions that remain binding until the post-award agreement is signed." })}
      </div>`, "award-conversion")}
    </div>
    ${actionBar()}`;
}

function renderGovernance() {
  return `${pageHead("Build the decision and authority structure", "Create a governance system that protects both members while allowing urgent tender or project decisions to be made within clear limits.")}
    <div class="form-stack">
      ${section("JV board", "Define representation, voting, quorum, and meeting discipline.", "building", `<div class="field-grid">
        ${textareaField("governance.boardComposition", "Board composition and alternates", { required: true })}
        ${selectField("governance.voting", "Voting basis", ["In proportion to participation share", "One vote per party", "Weighted vote by matter", "Unanimous decisions only", "Other"], { required: true })}
        ${inputField("governance.chair", "Chair and casting vote", { placeholder: "State party, rotation, and whether a casting vote applies" })}
        ${inputField("governance.quorum", "Quorum", { required: true })}
        ${inputField("governance.meetings", "Meeting frequency and notice", { required: true })}
        ${inputField("governance.projectDirector", state.mode === "pre" ? "Bid manager / JV representative" : "Project director", { placeholder: "Name, nominating party, and replacement process" })}
      </div>`, "governance")}
      ${section("Reserved matters and delegation", "Separate board decisions from routine management.", "shield", `<div class="field-grid">
        ${textareaField("governance.reservedMatters", "Reserved matters", { span: 2, required: true, placeholder: "Budget, bid price, material qualifications, contract amendments, major procurement, borrowing, securities, claims, settlements, related-party transactions, key staff, and termination." })}
        ${textareaField("governance.delegatedAuthority", "Delegated authority and monetary thresholds", { span: 2, required: true, placeholder: "Define authority for the lead party, project director, commercial manager, procurement, and bank signatories." })}
      </div>`, "reserved-matters")}
      ${section("Deadlock and urgent action", "Protect live tender and contract deadlines.", "target", `<div class="field-grid">
        ${textareaField("governance.deadlock", "Deadlock escalation", { required: true, placeholder: "Operational escalation → senior executives → expert / mediation → final remedy, with time limits." })}
        ${textareaField("governance.urgentAction", "Urgent protective action", { required: true, placeholder: "Define who may act to preserve tender validity, comply with a time bar, protect HSE, or avoid main-contract default." })}
        ${inputField("governance.noticesLead", "Contractual notices lead", { placeholder: "Responsible role and internal notice deadline" })}
      </div>`, "deadlock")}
    </div>
    ${actionBar()}`;
}

function renderContributions() {
  return `${pageHead("Allocate scope, resources, and contributions", "Translate participation shares into practical commitments for bid preparation and, if awarded, project mobilization and delivery.")}
    <div class="form-stack">
      ${section("Responsibility matrix", "Assign work, interfaces, approvals, and residual obligations.", "file", `<div class="field-grid">
        ${textareaField("contributions.scopeMatrix", "Preliminary scope and responsibility matrix", { span: 2, required: true, placeholder: "List design, pricing, procurement, authority interfaces, construction packages, testing, handover, and shared services by party." })}
        ${textareaField("contributions.localContent", "Local content and statutory contribution", { span: 2, placeholder: "Allocate local licences, workforce, vendors, localization targets, permits, tax, and sponsor or local-partner responsibilities." })}
      </div>`, "scope-matrix")}
      ${section("Resource commitments", "Identify what each party must provide and when.", "users", `<div class="field-grid">
        ${textareaField("contributions.personnel", "Personnel and tender team", { required: true, placeholder: "Key roles, workstreams, availability, deliverables, and due dates." })}
        ${textareaField("contributions.plant", "Plant, facilities, and logistics", { placeholder: "Major equipment, yards, offices, temporary facilities, and logistics capability." })}
        ${textareaField("contributions.systems", "Systems, know-how, and data", { placeholder: "Estimating, planning, BIM, document control, quality, HSE, designs, and licences." })}
        ${textareaField("contributions.workingCapital", "Working capital and financial facilities", { placeholder: "Bid finance, bonds, guarantees, cash calls, and funding assumptions." })}
      </div>`, "contributions")}
      ${section("Valuation and shortfall", "Define the consequence of an unprovided contribution.", "pie", `<div class="field-grid">
        ${inputField("contributions.valuation", "Valuation of in-kind contributions", { required: true })}
        ${textareaField("contributions.shortfallRemedy", "Failure / shortfall remedy", { required: true, placeholder: "Replacement resource, default funding, cost recovery, dilution, step-in, and time impact." })}
      </div>`, "contributions")}
    </div>
    ${actionBar()}`;
}

function renderExecution() {
  return `${pageHead("Turn the main contract into an execution plan", "Allocate every delivery obligation, interface, notice, record, and close-out activity to an accountable JV member or project role.")}
    <div class="form-stack">
      ${section("Scope and interfaces", "Attach a detailed responsibility matrix aligned to the main contract.", "file", `<div class="field-grid">
        ${textareaField("execution.scopeMatrix", "Detailed scope / responsibility matrix", { span: 2, required: true, placeholder: "Design, procurement, construction, temporary works, testing, authorities, handover, shared services, and residual scope." })}
        ${inputField("execution.interfaceLead", "Interface manager", { required: true, placeholder: "Role / nominating party" })}
        ${inputField("execution.designLead", "Design and approvals lead", { placeholder: "Role / nominating party" })}
        ${inputField("execution.procurementLead", "Procurement lead", { placeholder: "Role / nominating party" })}
        ${inputField("execution.constructionLead", "Construction lead", { placeholder: "Role / nominating party" })}
      </div>`, "scope-matrix")}
      ${section("Programme, notices, variations, and claims", "Mirror main-contract time bars in the internal workflow.", "target", `<div class="field-grid">
        ${inputField("execution.programmeLead", "Planning / programme lead", { required: true })}
        ${inputField("execution.claimsLead", "Contracts / claims lead", { required: true })}
        ${textareaField("execution.notices", "Internal notice procedure", { required: true, placeholder: "Event reporting, internal deadline, approval, employer notice, record owner, and escalation." })}
        ${textareaField("execution.variations", "Variation and claims governance", { required: true, placeholder: "Instruction validation, pricing, time impact, submission, settlement authority, and internal allocation." })}
        ${textareaField("execution.records", "Records and document control", { span: 2, required: true, placeholder: "Systems, naming, approvals, access, contemporaneous records, retention, and handover." })}
      </div>`, "programme-claims")}
      ${section("Procurement, reporting, and close-out", "Control major commitments and keep obligations alive through final release.", "building", `<div class="field-grid">
        ${textareaField("execution.subcontracting", "Procurement and subcontracting rules", { required: true, placeholder: "Competition, thresholds, affiliates, flow-down, approvals, performance, and substitution." })}
        ${textareaField("execution.reporting", "Project and board reporting", { required: true })}
        ${textareaField("execution.completion", "Completion and handover allocation", { placeholder: "Testing, commissioning, authority certificates, as-builts, O&M manuals, training, and taking-over." })}
        ${textareaField("execution.defects", "Defects and close-out", { placeholder: "Defects resources, final account, records, claims, reserves, securities, and winding up." })}
      </div>`, "completion-exit")}
    </div>
    ${actionBar()}`;
}

function renderCommercial() {
  return `${pageHead("Set the commercial and financial controls", "Reconcile every percentage, establish transparent accounts, and define funding, payment, audit, tax, and distribution procedures.")}
    <div class="form-stack">
      ${section("Shares and distributions", "Define each percentage independently and make the total workable.", "pie", `<div class="field-grid three">
        ${inputField("commercial.profitShare", "Profit share allocation", { required: true, placeholder: "e.g., Party A 60%; Party B 40%" })}
        ${inputField("commercial.lossShare", "Loss / overrun allocation", { required: true, placeholder: "Allocation and cause-based exceptions" })}
        ${inputField("commercial.fundingShare", "Funding share", { required: true, placeholder: "Working capital and cash-call proportions" })}
        ${textareaField("commercial.distributions", "Distribution policy and reserves", { span: 2, required: true, placeholder: "Conditions, frequency, tax, disputed amounts, retention, defects, claims, and security reserves." })}
      </div>`, "profit-loss")}
      ${section("Funding and banking", "Ensure the JV can pay obligations without uncontrolled member exposure.", "building", `<div class="field-grid">
        ${textareaField("commercial.workingCapital", "Working capital plan", { required: true, placeholder: "Initial funding, cash-flow forecast, credit facilities, member commitments, and contingency." })}
        ${textareaField("commercial.cashCalls", "Cash-call process and default funding", { required: true, placeholder: "Notice, evidence, timing, interest, shortfall funding, reimbursement, and member default." })}
        ${inputField("commercial.bankAccount", "JV bank account", { required: true, placeholder: "Bank, account owner, currency, and permitted accounts" })}
        ${inputField("commercial.signatories", "Signatories and limits", { required: true, placeholder: "Dual signatures and transaction thresholds" })}
        ${textareaField("commercial.paymentAuthority", "Payment approval workflow", { span: 2, placeholder: "Certification, invoice evidence, approvers, segregation of duties, and electronic controls." })}
      </div>`, "banking-accounts")}
      ${section("Accounting, tax, and audit", "Make member charges and JV performance transparent.", "file", `<div class="field-grid">
        ${textareaField("commercial.accounting", "Accounting policy and reporting", { required: true, placeholder: "Basis, cost codes, budgets, forecasts, month-end, currencies, and financial statements." })}
        ${textareaField("commercial.audit", "Audit and access rights", { required: true, placeholder: "Member audit, external auditor, records, notice, frequency, and findings." })}
        ${textareaField("commercial.tax", "Tax, VAT, withholding, and zakat allocation", { placeholder: "Registration, filing, invoicing, recoverability, permanent establishment, and member taxes." })}
        ${textareaField("commercial.relatedPartyCharges", "Member and affiliate charges", { placeholder: "Markup, rates, evidence, transfer pricing, approval, and audit." })}
      </div>`, "banking-accounts")}
    </div>
    ${actionBar()}`;
}

function renderRisk() {
  const post = state.mode === "post";
  return `${pageHead(post ? "Allocate risk and compliance obligations" : "Protect the bid and the members", post ? "Reconcile employer-facing exposure with internal recourse, insurances, securities, compliance, member default, and dispute controls." : "Define how tender liabilities, member-caused loss, compliance failure, withdrawal, and disputes will be handled before award.")}
    <div class="form-stack">
      ${section("External liability and internal recourse", "Do not confuse the employer's rights with the members' internal allocation.", "shield", `<div class="field-grid">
        ${selectField("risk.externalLiability", "External liability to employer", ["Joint and several liability", "Several liability by scope", "Lead party primarily liable", "Not confirmed", "Other"], { required: true })}
        ${textareaField("risk.internalAllocation", "Internal allocation / recourse", { required: true, placeholder: "By cause, scope responsibility, participation share, or a defined combination." })}
        ${textareaField("risk.indemnity", "Member indemnities", { required: true, placeholder: "Breach, negligence, misconduct, scope failure, compliance breach, security call, and third-party claims." })}
        ${textareaField("risk.liabilityCap", "Liability caps and carve-outs", { placeholder: "Cap basis, excluded losses, fraud, wilful misconduct, IP, confidentiality, tax, security calls, and uninsured loss." })}
      </div>`, "joint-several")}
      ${post ? section("Insurance and securities", "Allocate credit capacity, cost, collateral, renewals, and call risk.", "building", `<div class="field-grid">
        ${textareaField("risk.insurance", "Insurance programme", { required: true, placeholder: "Policies, responsible party, limits, deductibles, compliance, renewals, claims, and uninsured amounts." })}
        ${textareaField("risk.securities", "Project securities schedule", { required: true, placeholder: "Performance, advance, retention, parent guarantees, provider, amount, expiry, and release." })}
        ${textareaField("risk.counterIndemnity", "Counter-indemnity and collateral", { span: 2, required: true, placeholder: "Facility cost, cash collateral, internal counter-security, call allocation, replacement, and release." })}
      </div>`, "insurance-security") : ""}
      ${section("Compliance, confidentiality, and IP", "Allocate obligations and evidence, not just general promises.", "file", `<div class="field-grid">
        ${textareaField("risk.compliance", "Compliance matrix", { required: true, placeholder: "Anti-bribery, sanctions, competition, HSE, labour, localization, permits, data, tax, and reporting." })}
        ${textareaField("risk.confidentiality", "Confidentiality and data controls", { placeholder: "Tender data, permitted disclosure, security, publicity, retention, return, and survival." })}
        ${textareaField("risk.ip", "Intellectual property and licences", { span: 2, placeholder: "Background IP, project IP, ownership, licences, employer rights, infringement, and use after termination." })}
      </div>`, "compliance")}
      ${section("Default, exit, and disputes", "Keep the tender or project protected if a member fails or the parties disagree.", "target", `<div class="field-grid">
        ${textareaField("risk.default", "Member default and step-in", { required: true, placeholder: "Events, cure, urgent action, step-in, cost recovery, suspension, replacement, and employer consent." })}
        ${textareaField("risk.withdrawal", "Withdrawal / transfer restrictions", { required: true, placeholder: "Prohibition, consent, replacement, continuing liability, security, and costs." })}
        ${textareaField("risk.termination", "Termination and survival", { placeholder: "Triggers, main-contract interface, winding up, records, defects, claims, securities, and surviving clauses." })}
        ${textareaField("risk.dispute", "Dispute resolution", { required: true, placeholder: "Operational escalation, senior executives, expert determination, mediation, courts or arbitration, and interim relief." })}
        ${inputField("risk.governingLaw", "JV agreement governing law", { required: true, placeholder: "Confirm enforceability with local counsel" })}
        ${inputField("risk.arbitrationSeat", "Arbitration seat / court jurisdiction", { placeholder: "City and country" })}
        ${inputField("risk.arbitrationRules", "Arbitration rules / institution", { placeholder: "e.g., SCCA, DIAC, ICC, ad hoc, or courts" })}
        ${selectField("risk.language", "Agreement and dispute language", ["English", "Arabic", "Bilingual English–Arabic", "French", "Other"], { required: true })}
      </div>`, "law-disputes")}
    </div>
    ${actionBar()}`;
}

function renderClauses() {
  const clauses = CLAUSES.filter(clause => clause.stage === "both" || clause.stage === state.mode);
  const search = state.clauseSearch.trim().toLowerCase();
  const filtered = clauses.filter(clause => !search || [clause.title, clause.category, clause.summary, clause.why, clause.points.join(" ")].join(" ").toLowerCase().includes(search));
  const viewToggle = `<div class="segmented" role="group" aria-label="Clause preparation view">
    <button type="button" class="${state.clauseView === "checklist" ? "active" : ""}" data-action="set-clause-view" data-view="checklist">Preparation checklist</button>
    <button type="button" class="${state.clauseView === "library" ? "active" : ""}" data-action="set-clause-view" data-view="library">Clause library</button>
  </div>`;

  if (state.clauseView === "checklist") {
    const checklist = CHECKLISTS[state.mode];
    const completed = checklist.filter(([id]) => state.checklist[state.mode][id]).length;
    const items = checklist.map(([id, title, description, critical]) => {
      const checked = Boolean(state.checklist[state.mode][id]);
      return `<div class="check-item">
        <label class="choice"><input type="checkbox" data-check-id="${id}" ${checked ? "checked" : ""}><span class="choice-mark"></span><span class="visually-hidden">${checked ? "Completed" : "Not completed"}</span></label>
        <div class="check-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span></div>
        <span class="status-label ${checked ? "done" : critical ? "critical" : ""}">${checked ? "Complete" : critical ? "Critical" : "Pending"}</span>
      </div>`;
    }).join("");
    return `${pageHead("Complete the agreement preparation checklist", `Use this ${state.mode === "pre" ? "pre-tender" : "post-tender"} control list to confirm the agreement inputs and supporting documents are ready.`, viewToggle)}
      <div class="intro-band"><div><h2>${completed} of ${checklist.length} controls completed</h2><p>Tick a control only when the required decision is documented or the supporting schedule is available. Critical open controls appear in the readiness risks.</p></div><div class="intro-callout"><strong>Evidence before wording</strong><span>A clause cannot cure missing commercial decisions. Complete the underlying allocation, authority, percentage, or schedule first.</span></div></div>
      <div class="form-stack">${section("Agreement control checklist", "Critical items should be closed before signature or submission.", "clauses", `<div class="checklist">${items}</div>`)}</div>
      ${actionBar()}`;
  }

  const clauseRows = filtered.length ? filtered.map(clause => {
    const open = state.openClause === clause.id;
    const addressed = Boolean(state.clauseStatus[clause.id]);
    return `<article class="clause-row ${open ? "open" : ""}">
      <button class="clause-summary" type="button" data-action="toggle-clause" data-clause="${clause.id}" aria-expanded="${open}">
        ${icon("chevron")}
        <span class="clause-title"><strong>${escapeHtml(clause.title)}</strong><span>${escapeHtml(clause.category)} · ${escapeHtml(clause.stage === "both" ? "Pre- and post-tender" : clause.stage === "pre" ? "Pre-tender" : "Post-tender")}</span></span>
        <span class="status-label ${addressed ? "done" : ""}">${addressed ? "Addressed" : "Open"}</span>
      </button>
      <div class="clause-body">
        <div><h4>Why it matters</h4><p>${escapeHtml(clause.why)}</p><h4>Drafting points</h4><ul class="clause-points">${clause.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div>
        <div class="clause-control"><h4>Preparation prompt</h4><p>${escapeHtml(clause.prompt)}</p><label class="choice"><input type="checkbox" data-clause-status="${clause.id}" ${addressed ? "checked" : ""}><span class="choice-mark"></span><span>Decision and wording addressed</span></label></div>
      </div>
    </article>`;
  }).join("") : `<div class="empty-state"><h3>No matching clauses</h3><p>Try a broader search term such as liability, security, governance, claims, or withdrawal.</p><button class="button small" type="button" data-action="clear-clause-search">Clear search</button></div>`;

  return `${pageHead("Use the clause guidance library", "Review the purpose, risk, drafting points, and preparation prompt for each major JV agreement clause.", viewToggle)}
    <div class="clause-toolbar"><div class="search-wrap">${icon("search")}<input class="input" id="clause-search" data-action-input="clause-search" value="${escapeHtml(state.clauseSearch)}" placeholder="Search clauses, risks, or topics"></div><span class="notice">${filtered.length} of ${clauses.length} clauses</span></div>
    <div class="clause-list">${clauseRows}</div>
    <div class="notice warning" style="margin-top:18px">This preparation guide is not a substitute for project-specific legal, tax, competition, licensing, or regulatory advice. Verify every clause against the tender, main contract, governing law, and required JV form.</div>
    ${actionBar()}`;
}

function renderReview() {
  const score = readinessScore();
  const risks = getRisks();
  const actions = `<button class="button" type="button" data-action="print-summary">${icon("print")} Print / PDF</button><button class="button primary" type="button" data-action="download-word">${icon("download")} Download summary</button>`;
  return `${pageHead("Review readiness and export the preparation summary", "Check the decisions, open risks, and supporting controls before the agreement is drafted, negotiated, approved, or signed.", actions)}
    <div class="review-grid">
      <article class="summary-sheet" id="print-summary">
        <div class="summary-head"><h2>${escapeHtml(state.project.name || "JV Agreement Preparation Summary")}</h2><p>${state.mode === "pre" ? "Pre-tender JV / Consortium Agreement" : "Post-tender Project JV Agreement"} · Readiness ${score}% · Prepared ${formatDate(new Date())}</p></div>
        ${summarySectionsHtml()}
        <section class="summary-section"><h3>Open risks and actions</h3>${risks.length ? `<div class="risk-list">${risks.map(risk => riskHtml(risk)).join("")}</div>` : '<div class="risk-empty">No critical readiness flags are currently open. Complete the legal and management review before signature.</div>'}</section>
        <section class="summary-section"><h3>Professional review note</h3><p style="margin:0;color:var(--slate-600);font-size:11px">This summary records preparation decisions and does not create a signed JV agreement. The final document must be checked against the tender or main contract, governing law, corporate approvals, licensing, tax, competition, security, and execution formalities.</p></section>
      </article>
      <aside class="export-panel">
        <h3>Download and preserve</h3>
        <p>All exports are created in this browser. No project data is transmitted externally.</p>
        <div class="export-list">
          <button class="button primary" type="button" data-action="download-word">${icon("download")} Word-compatible summary (.doc)</button>
          <button class="button" type="button" data-action="download-csv">${icon("download")} Checklist and risk register (.csv)</button>
          <button class="button" type="button" data-action="download-json">${icon("download")} Editable backup (.json)</button>
          <button class="button" type="button" data-action="print-summary">${icon("print")} Print or save as PDF</button>
          <button class="button" type="button" data-action="import-json">${icon("upload")} Restore a JSON backup</button>
        </div>
        <div class="notice warning" style="margin-top:16px"><strong>Before issue:</strong> close the critical readiness flags and attach the responsibility, authority, contribution, security, and compliance schedules that apply.</div>
      </aside>
    </div>
    ${actionBar()}`;
}

function summarySectionsHtml() {
  const partyText = state.parties.map(p => `${p.name || "Unnamed party"} (${p.role || "Member"}, ${p.share || 0}%)`).join("; ");
  const common = `<section class="summary-section"><h3>Foundation</h3><dl class="summary-list">
    ${summaryItem("Stage", state.mode === "pre" ? "Pre-tender" : "Post-tender")}
    ${summaryItem("Employer", state.project.employer)}
    ${summaryItem("Reference", state.project.tenderRef)}
    ${summaryItem("Country", state.project.country)}
    ${summaryItem("Governing law", state.risk.governingLaw || state.project.governingLaw)}
    ${summaryItem("Contract form", state.project.contractForm)}
    ${summaryItem("Parties", partyText)}
    ${summaryItem("Participation total", `${formatNumber(partyShareTotal())}%`)}
  </dl></section>`;
  if (state.mode === "pre") {
    return `${common}<section class="summary-section"><h3>Tender pathway</h3><dl class="summary-list">
      ${summaryItem("JV form", state.bid.jvForm)}${summaryItem("Lead party", state.bid.leadParty)}
      ${summaryItem("Lead authority", state.bid.leadAuthority)}${summaryItem("Exclusivity", state.bid.exclusivity)}
      ${summaryItem("Bid cost method", state.bid.bidCostMethod)}${summaryItem("Bid budget", state.bid.bidCostBudget)}
      ${summaryItem("Bid bond", state.bid.bidBondRequired)}${summaryItem("Bond provider", state.bid.bidBondProvider)}
      ${summaryItem("Award conversion", state.bid.conversionTrigger)}${summaryItem("Definitive agreement deadline", state.bid.conversionDeadline)}
    </dl></section>
    <section class="summary-section"><h3>Governance and contributions</h3><dl class="summary-list">
      ${summaryItem("Voting", state.governance.voting)}${summaryItem("Quorum", state.governance.quorum)}
      ${summaryItem("Reserved matters", state.governance.reservedMatters)}${summaryItem("Deadlock", state.governance.deadlock)}
      ${summaryItem("Scope matrix", state.contributions.scopeMatrix)}${summaryItem("Resource commitments", state.contributions.personnel)}
    </dl></section>`;
  }
  return `${common}<section class="summary-section"><h3>Governance and execution</h3><dl class="summary-list">
    ${summaryItem("Voting", state.governance.voting)}${summaryItem("Quorum", state.governance.quorum)}
    ${summaryItem("Project director", state.governance.projectDirector)}${summaryItem("Deadlock", state.governance.deadlock)}
    ${summaryItem("Scope matrix", state.execution.scopeMatrix)}${summaryItem("Programme lead", state.execution.programmeLead)}
    ${summaryItem("Claims lead", state.execution.claimsLead)}${summaryItem("Notice process", state.execution.notices)}
  </dl></section>
  <section class="summary-section"><h3>Commercial and risk</h3><dl class="summary-list">
    ${summaryItem("Profit share", state.commercial.profitShare)}${summaryItem("Funding share", state.commercial.fundingShare)}
    ${summaryItem("Banking controls", state.commercial.signatories)}${summaryItem("External liability", state.risk.externalLiability)}
    ${summaryItem("Securities", state.risk.securities)}${summaryItem("Insurance", state.risk.insurance)}
    ${summaryItem("Dispute process", state.risk.dispute)}${summaryItem("Arbitration / court", [state.risk.arbitrationSeat, state.risk.arbitrationRules].filter(Boolean).join(" · "))}
  </dl></section>`;
}

function summaryItem(term, value) {
  return `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value || "Not yet recorded")}</dd></div>`;
}

function actionBar() {
  const steps = STEPS[state.mode];
  const index = Math.max(0, steps.findIndex(step => step.id === state.currentStep));
  const previous = steps[index - 1];
  const next = steps[index + 1];
  return `<div class="action-bar" role="navigation" aria-label="Step actions">
    <div class="action-side">${previous ? `<button class="button" type="button" data-action="go-step" data-step="${previous.id}">${icon("arrowLeft")} ${escapeHtml(previous.label)}</button>` : ""}</div>
    <div class="action-center">Changes save automatically on this device</div>
    <div class="action-side"><button class="button" type="button" data-action="save">${icon("save")} Save draft</button>${next ? `<button class="button primary" type="button" data-action="go-step" data-step="${next.id}">${escapeHtml(next.label)} ${icon("arrowRight")}</button>` : `<button class="button primary" type="button" data-action="download-word">${icon("download")} Download summary</button>`}</div>
  </div>`;
}

function requiredValues() {
  const partyNames = state.parties.map(p => p.name).filter(Boolean);
  const base = [
    state.project.name, state.project.employer, state.project.country, state.project.tenderRef,
    state.project.governingLaw || state.risk.governingLaw, state.project.projectDescription,
    partyNames.length >= 2 ? "yes" : "", Math.abs(partyShareTotal() - 100) < .001 ? "yes" : "",
    state.governance.boardComposition, state.governance.voting, state.governance.quorum,
    state.governance.reservedMatters, state.governance.delegatedAuthority, state.governance.deadlock,
    state.risk.externalLiability, state.risk.internalAllocation, state.risk.indemnity,
    state.risk.compliance, state.risk.default, state.risk.withdrawal, state.risk.dispute,
    state.risk.governingLaw || state.project.governingLaw, state.risk.language
  ];
  if (state.mode === "pre") {
    return base.concat([
      state.project.deadline, state.bid.jvForm, state.bid.leadParty, state.bid.leadAuthority,
      state.bid.bindingAuthority, state.bid.exclusivity, state.bid.bidCostMethod,
      state.bid.bidBondRequired,
      state.bid.bidBondRequired !== "Yes" ? "not-applicable" : state.bid.bidBondProvider,
      state.bid.bidBondRequired !== "Yes" ? "not-applicable" : state.bid.bondAllocation,
      state.bid.conversionTrigger, state.bid.interimTerms, state.contributions.scopeMatrix,
      state.contributions.personnel, state.contributions.valuation, state.contributions.shortfallRemedy
    ]);
  }
  return base.concat([
    state.project.contractDate, state.execution.scopeMatrix, state.execution.interfaceLead,
    state.execution.programmeLead, state.execution.claimsLead, state.execution.notices,
    state.execution.variations, state.execution.records, state.execution.subcontracting,
    state.commercial.profitShare, state.commercial.lossShare, state.commercial.fundingShare,
    state.commercial.distributions, state.commercial.workingCapital, state.commercial.cashCalls,
    state.commercial.bankAccount, state.commercial.signatories, state.commercial.accounting,
    state.commercial.audit, state.risk.insurance, state.risk.securities, state.risk.counterIndemnity
  ]);
}

function readinessScore() {
  const values = requiredValues();
  const fieldScore = values.length ? values.filter(isMeaningful).length / values.length : 0;
  const checklist = CHECKLISTS[state.mode];
  const checklistScore = checklist.length ? checklist.filter(([id]) => state.checklist[state.mode][id]).length / checklist.length : 0;
  return Math.round((fieldScore * .65 + checklistScore * .35) * 100);
}

function isMeaningful(value) {
  return value !== null && value !== undefined && String(value).trim() !== "" && !["To be agreed", "To be confirmed", "Not confirmed"].includes(String(value));
}

function partyShareTotal() {
  return state.parties.reduce((sum, party) => sum + (Number.parseFloat(party.share) || 0), 0);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatDate(value) {
  try { return new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" }).format(value); }
  catch { return ""; }
}

function getRisks() {
  const risks = [];
  const push = (id, title, detail, level = "High") => risks.push({ id, title, detail, level });
  if (!state.project.name || !state.project.employer || !state.project.tenderRef) push("identity", "Project identity incomplete", "Complete the official project, employer, and tender or contract reference.");
  if (state.parties.filter(p => p.name).length < 2) push("parties", "JV parties are not confirmed", "Record at least two exact legal entity names.");
  if (Math.abs(partyShareTotal() - 100) > .001) push("shares", "Participation shares do not equal 100%", `Current total is ${formatNumber(partyShareTotal())}%. Reconcile all parties.`);
  if (!(state.risk.governingLaw || state.project.governingLaw)) push("law", "Governing law is missing", "Confirm the main-contract position and choose an enforceable governing law for the JV agreement.");
  if (!state.governance.reservedMatters) push("reserved", "Reserved matters are undefined", "List decisions requiring unanimous or enhanced approval.");
  if (!state.governance.deadlock) push("deadlock", "Deadlock route is missing", "Add time-limited escalation and urgent protective action.");
  if (!state.risk.externalLiability || state.risk.externalLiability === "Not confirmed") push("liability", "External liability is unconfirmed", "Verify whether the tender or main contract imposes joint and several liability.");
  if (!state.risk.dispute) push("dispute", "Dispute mechanism is incomplete", "Select an enforceable internal escalation and final forum.");
  if (state.mode === "pre") {
    if (!state.bid.leadParty || !state.bid.leadAuthority || state.bid.leadAuthority === "To be confirmed") push("lead", "Lead-party authority is unconfirmed", "Confirm who submits, communicates, and may bind the JV.");
    if (state.bid.exclusivity !== "Yes") push("exclusive", "Tender exclusivity is not secured", "Agree competing-bid, withdrawal, and validity-extension controls.", "Medium");
    if (state.bid.bidBondRequired === "Yes" && (!state.bid.bidBondProvider || !state.bid.bondAllocation)) push("bond", "Bid bond allocation is incomplete", "Confirm provider, facility cost, collateral, counter-indemnity, and call risk.");
    if (!state.bid.conversionTrigger || !state.bid.interimTerms) push("conversion", "Post-award conversion is incomplete", "Define the award trigger, interim terms, and definitive-agreement deadline.");
    if (!state.contributions.scopeMatrix) push("scope", "Preliminary scope matrix is missing", "Allocate bid and delivery responsibilities before pricing is locked.");
  } else {
    if (!state.execution.scopeMatrix) push("scope", "Detailed responsibility matrix is missing", "Allocate every main-contract obligation and interface.");
    if (!state.commercial.bankAccount || !state.commercial.signatories) push("bank", "Banking controls are incomplete", "Define account ownership, dual signatories, and approval limits.");
    if (!state.risk.securities || !state.risk.counterIndemnity) push("security", "Project securities are not fully allocated", "Schedule provider, collateral, cost, call exposure, renewals, and release.");
    if (!state.execution.notices || !state.execution.claimsLead) push("notices", "Notice and claims controls are incomplete", "Mirror main-contract time bars and appoint the responsible lead.");
    if (!state.commercial.profitShare || !state.commercial.lossShare || !state.commercial.fundingShare) push("commercial", "Commercial percentages are not reconciled", "Define profit, loss, funding, security, scope, voting, and liability shares separately.");
  }
  const criticalOpen = CHECKLISTS[state.mode].filter(([id, , , critical]) => critical && !state.checklist[state.mode][id]);
  if (criticalOpen.length > 5) push("checklist", "Critical checklist controls remain open", `${criticalOpen.length} critical preparation controls are not yet confirmed.`, "Medium");
  return risks;
}

function riskHtml(risk) {
  return `<div class="risk-item"><span class="risk-icon">${icon("alert")}</span><div><strong>${escapeHtml(risk.title)}</strong><span>${escapeHtml(risk.detail)}</span></div></div>`;
}

function stepProgress(stepId) {
  const groups = {
    overview: [state.project.name, state.project.employer, state.project.tenderRef, state.project.country, state.project.governingLaw, state.project.projectDescription],
    parties: [state.parties.filter(p => p.name).length >= 2 ? "yes" : "", Math.abs(partyShareTotal() - 100) < .001 ? "yes" : "", state.governance.boardComposition, state.risk.compliance],
    bid: [state.bid.leadParty, state.bid.leadAuthority, state.bid.exclusivity, state.bid.bidCostMethod, state.bid.bidBondRequired, state.bid.conversionTrigger, state.bid.interimTerms],
    governance: [state.governance.boardComposition, state.governance.voting, state.governance.quorum, state.governance.reservedMatters, state.governance.delegatedAuthority, state.governance.deadlock, state.governance.urgentAction],
    contributions: [state.contributions.scopeMatrix, state.contributions.personnel, state.contributions.valuation, state.contributions.shortfallRemedy],
    execution: [state.execution.scopeMatrix, state.execution.interfaceLead, state.execution.programmeLead, state.execution.claimsLead, state.execution.notices, state.execution.variations, state.execution.records, state.execution.subcontracting],
    commercial: [state.commercial.profitShare, state.commercial.lossShare, state.commercial.fundingShare, state.commercial.workingCapital, state.commercial.cashCalls, state.commercial.bankAccount, state.commercial.signatories, state.commercial.accounting, state.commercial.audit],
    risk: [state.risk.externalLiability, state.risk.internalAllocation, state.risk.indemnity, state.risk.compliance, state.risk.default, state.risk.withdrawal, state.risk.dispute, state.risk.governingLaw || state.project.governingLaw],
    clauses: CHECKLISTS[state.mode].map(([id]) => state.checklist[state.mode][id] ? "yes" : ""),
    review: [readinessScore() >= 90 ? "yes" : ""]
  };
  const values = groups[stepId] || [];
  return values.length ? Math.round(values.filter(isMeaningful).length / values.length * 100) : 0;
}

function renderNavigation() {
  const steps = STEPS[state.mode];
  $("#step-navigation").innerHTML = steps.map((step, index) => {
    const progress = stepProgress(step.id);
    const active = state.currentStep === step.id;
    const statusIcon = progress >= 85 ? `<span class="step-state complete">${icon("check")}</span>` : progress > 0 ? `<span class="step-state">${Math.min(progress, 99)}%</span>` : `<span class="step-state">${icon("lock")}</span>`;
    return `<button class="step-link ${active ? "active" : ""}" type="button" data-action="go-step" data-step="${step.id}" ${active ? 'aria-current="step"' : ""}>
      <span class="step-number">${index + 1}</span><span class="step-copy"><strong>${escapeHtml(step.label)}</strong><small>${progress >= 85 ? "Completed" : progress > 0 ? "In progress" : step.note}</small></span>${statusIcon}
    </button>`;
  }).join("");
  const score = readinessScore();
  $("#nav-progress").innerHTML = `<div class="mini-progress-head"><span>Agreement readiness</span><strong>${score}%</strong></div><div class="progress-track"><span style="width:${score}%"></span></div>`;
}

function renderInsights() {
  const score = readinessScore();
  const risks = getRisks();
  const guidance = guidanceForStep();
  $("#insight-content").innerHTML = `<section class="insight-block">
    <h2 class="insight-title">Readiness <span class="info-dot" title="Weighted completion of key fields and checklist controls">i</span></h2>
    <div class="readiness-ring" style="--value:${score}"><strong>${score}<small>%</small></strong></div>
    <div class="readiness-copy"><strong>${score >= 90 ? "Ready for final review" : score >= 60 ? "On track" : "Foundation stage"}</strong><span>${score >= 90 ? "Complete legal and corporate approval." : "Keep completing required decisions."}</span></div>
  </section>
  <section class="insight-block"><h2 class="insight-title">Attention required <span class="info-dot" title="Current high-priority preparation gaps">i</span></h2><div class="risk-list">${risks.length ? risks.slice(0, 4).map(riskHtml).join("") : '<div class="risk-empty">No critical preparation flags. Continue the detailed review.</div>'}</div>${risks.length > 4 ? `<button class="button ghost small" style="margin-top:10px" type="button" data-action="go-step" data-step="review">View all ${risks.length} risks ${icon("arrowRight")}</button>` : ""}</section>
  <section class="insight-block"><h2 class="insight-title">Clause guidance <span class="info-dot" title="Relevant drafting focus for this step">i</span></h2><div class="guidance-copy"><h4>${escapeHtml(guidance.title)}</h4><p>${escapeHtml(guidance.copy)}</p></div><button class="button ghost small" type="button" data-action="show-clause" data-clause="${guidance.clause}">Open guidance ${icon("arrowRight")}</button></section>`;
}

function guidanceForStep() {
  const map = {
    overview: { title: "Purpose and legal form", copy: "Define whether the JV is contractual, incorporated, or a consortium and limit unintended agency.", clause: "purpose-form" },
    parties: { title: "Capacity and percentages", copy: "Verify legal identity and authority, then state what each percentage controls.", clause: state.mode === "post" ? "profit-loss" : "purpose-form" },
    bid: { title: "Lead-party authority", copy: "The agreement should confirm the lead party's authority and identify commitments requiring joint approval.", clause: "lead-authority" },
    governance: { title: "Reserved matters", copy: "Use a clear authority matrix so routine decisions move quickly while major exposure remains controlled.", clause: "reserved-matters" },
    contributions: { title: "Resource commitment", copy: "Attach a schedule showing provider, timing, valuation, replacement standard, and failure remedy.", clause: "contributions" },
    execution: { title: "Scope and time bars", copy: "Map the main contract to accountable members and set internal deadlines ahead of employer notice dates.", clause: "programme-claims" },
    commercial: { title: "Separate every share", copy: "Scope, voting, funding, profit, loss, security, and liability percentages may differ and must be reconciled.", clause: "profit-loss" },
    risk: { title: "External versus internal liability", copy: "Protect employer rights where required while defining cause-based recourse between members.", clause: "joint-several" },
    clauses: { title: "Decisions before drafting", copy: "Close the commercial and governance decisions first, then convert them into clauses and schedules.", clause: "governance" },
    review: { title: "Issue controls", copy: "Confirm governing law, corporate approvals, execution formalities, and all referenced schedules before signature.", clause: "law-disputes" }
  };
  return map[state.currentStep] || map.overview;
}

function renderStep() {
  const validSteps = STEPS[state.mode].map(step => step.id);
  if (!validSteps.includes(state.currentStep)) state.currentStep = "overview";
  const renderers = { overview: renderOverview, parties: renderParties, bid: renderBid, governance: renderGovernance, contributions: renderContributions, execution: renderExecution, commercial: renderCommercial, risk: renderRisk, clauses: renderClauses, review: renderReview };
  $("#step-content").innerHTML = (renderers[state.currentStep] || renderOverview)();
  renderNavigation();
  renderInsights();
  updateModeControls();
  updateSavedTime();
  document.body.classList.remove("nav-open");
}

function updateModeControls() {
  $$('[data-action="set-mode"]').forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode)));
}

function openClauseModal(clauseId) {
  const clause = CLAUSES.find(item => item.id === clauseId) || CLAUSES[0];
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal-panel>
      <header class="modal-head"><div><h2 id="modal-title">${escapeHtml(clause.title)}</h2><span class="status-label">${escapeHtml(clause.category)}</span></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close" style="color:var(--slate-700)">${icon("plus").replace('<svg ', '<svg style="transform:rotate(45deg)" ')}</button></header>
      <div class="modal-body"><h3>Purpose and risk</h3><p>${escapeHtml(clause.why)}</p><h3>Drafting points</h3><ul class="clause-points">${clause.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul><div class="notice" style="margin-top:18px"><strong>Preparation prompt:</strong> ${escapeHtml(clause.prompt)}</div></div>
      <footer class="modal-actions"><button class="button" type="button" data-action="close-modal">Close</button><button class="button primary" type="button" data-action="go-clause" data-clause="${clause.id}">Open in clause library</button></footer>
    </section>
  </div>`;
  setTimeout(() => $("#modal-root .modal")?.focus(), 0);
}

function openToolsModal() {
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="tools-title" data-modal-panel>
    <header class="modal-head"><div><h2 id="tools-title">File and draft tools</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close" style="color:var(--slate-700)">${icon("plus").replace('<svg ', '<svg style="transform:rotate(45deg)" ')}</button></header>
    <div class="modal-body"><p>Project data stays in this browser unless a local download is created.</p><div class="tool-grid">
      <button class="button" type="button" data-action="download-json">${icon("download")} Download editable backup</button>
      <button class="button" type="button" data-action="import-json">${icon("upload")} Restore JSON backup</button>
      <button class="button" type="button" data-action="download-word">${icon("download")} Download summary</button>
      <button class="button" type="button" data-action="download-csv">${icon("download")} Download checklist</button>
      <button class="button" type="button" data-action="load-sample">${icon("file")} Load demonstration data</button>
      <button class="button danger" type="button" data-action="confirm-reset">${icon("trash")} Reset all local data</button>
    </div></div><footer class="modal-actions"><button class="button" type="button" data-action="close-modal">Close</button></footer>
  </section></div>`;
}

function openResetModal() {
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" data-modal-panel>
    <header class="modal-head"><div><h2 id="reset-title">Reset the local draft?</h2></div></header>
    <div class="modal-body"><p>This will remove the current preparation data stored in this browser. Download a JSON backup first if the draft may be needed later.</p></div>
    <footer class="modal-actions"><button class="button" type="button" data-action="close-modal">Cancel</button><button class="button danger" type="button" data-action="reset">Reset draft</button></footer>
  </section></div>`;
}

function closeModal() {
  $("#modal-root").innerHTML = "";
}

function loadDemonstrationData() {
  const demo = createDefaultState();
  demo.mode = state.mode;
  demo.currentStep = state.currentStep;
  demo.project = {
    ...demo.project,
    name: "North Corridor Water Treatment Programme",
    employer: "Municipal Infrastructure Authority",
    country: "Kingdom of Saudi Arabia",
    governingLaw: "Laws of the Kingdom of Saudi Arabia",
    tenderRef: state.mode === "pre" ? "MIA-NCWT-2026-04" : "MIA-NCWT-CON-2026-04",
    deadline: "2026-09-30",
    contractDate: "2026-11-15",
    commencementDate: "2026-12-01",
    completionDate: "2029-11-30",
    currency: "SAR",
    contractForm: "FIDIC 2017 Red Book",
    language: "Bilingual English–Arabic",
    mainContractValue: "SAR 1,250,000,000",
    projectDescription: "Design coordination, procurement, construction, testing, commissioning, and handover of treatment, pumping, pipeline, and supporting civil infrastructure works. Demonstration data only."
  };
  demo.parties = [
    { name: "Al Noor Infrastructure Co.", legalForm: "Limited liability company", registration: "CR-10100001", country: "Kingdom of Saudi Arabia", role: "Lead", share: "60", representative: "Omar Haddad", authority: "Board resolution and notarized power of attorney" },
    { name: "Meridian Water Systems Ltd.", legalForm: "Private limited company", registration: "REG-208844", country: "United Arab Emirates", role: "Technical partner", share: "40", representative: "Lina Rahman", authority: "Board resolution and authorized signatory" }
  ];
  demo.bid = {
    ...demo.bid, leadParty: "Al Noor Infrastructure Co.", leadAuthority: "Confirmed and documented",
    exclusivity: "Yes", bidValidity: "120 calendar days; extensions require unanimous board approval",
    bidCostBudget: "SAR 3,500,000", bidBondAmount: "SAR 12,500,000", bidBondProvider: "Al Noor Infrastructure Co. / approved local bank",
    bondAllocation: "By cause of call", conversionDeadline: "Within 14 calendar days after contract award"
  };
  demo.governance = {
    ...demo.governance,
    boardComposition: "Two representatives from each party; one alternate per representative. Corporate approvals and powers of attorney to be attached.",
    chair: "Lead party nominee; no casting vote on reserved matters",
    reservedMatters: "Bid price and qualifications; tender validity extensions; budgets; contract amendments; major variations; procurement above SAR 5,000,000; borrowing and securities; claims settlements; related-party awards; key appointments; withdrawal and termination.",
    delegatedAuthority: "Project Director: approved budget items up to SAR 500,000; Commercial Manager: certifications and notices within approved positions; procurement awards above limits require board approval.",
    deadlock: "Project-level negotiation for 2 business days, then escalation to each party's CEO for 5 business days, then expert determination for technical or accounting issues; urgent protective notices may be issued without prejudice.",
    urgentAction: "Lead party may submit protective notices or tender clarifications required to preserve rights, subject to immediate circulation and no change to price, liability, or qualifications.",
    projectDirector: "Jointly appointed after award",
    noticesLead: "Contracts Manager; internal event notice within 2 days"
  };
  demo.contributions = {
    ...demo.contributions,
    scopeMatrix: "Lead party: local licensing, civil works, site operations, authorities, and lead commercial administration. Technical partner: process design, specialist equipment, commissioning, and performance testing. Shared: BIM, planning, procurement interfaces, and handover.",
    personnel: "Each party provides named tender leads and discipline inputs to the approved responsibility schedule. Replacement requires equivalent competence and lead approval.",
    plant: "Lead party provides local yards, temporary facilities, and general construction plant; specialist equipment procured through the JV.",
    systems: "Shared use of approved CDE, cost control, planning, and document management systems.",
    workingCapital: "Funding in participation shares, subject to approved cash-flow forecast and cash-call evidence.",
    localContent: "Lead party manages local content reporting; both parties meet allocated workforce, supplier, and knowledge-transfer commitments."
  };
  demo.execution = {
    ...demo.execution,
    scopeMatrix: demo.contributions.scopeMatrix,
    interfaceLead: "JV Interface Manager — jointly appointed",
    designLead: "Meridian Water Systems Ltd.", procurementLead: "JV Procurement Manager", constructionLead: "Al Noor Infrastructure Co.",
    programmeLead: "JV Planning Manager", claimsLead: "JV Contracts & Commercial Manager",
    notices: "Site events reported within 24 hours; internal contractual assessment within 2 days; draft employer notice circulated at least 3 days before the main-contract deadline; urgent protective notices permitted.",
    variations: "No instructed change is implemented without recording scope, authority, time, cost, and commercial reservation. Major settlements are reserved matters.",
    records: "One controlled common data environment with party access, daily records, cost codes, programme updates, correspondence register, and retention through final close-out.",
    subcontracting: "Competitive procurement above approved thresholds; related-party awards require full disclosure and unanimous approval; all subcontracts flow down relevant main-contract obligations.",
    completion: "Commissioning, performance tests, authority approvals, as-builts, O&M manuals, training, and taking-over allocated in the responsibility matrix.",
    defects: "JV remains funded and staffed through defects, final account, claims closure, record handover, and security release."
  };
  demo.commercial = {
    ...demo.commercial,
    profitShare: "Al Noor 60%; Meridian 40%", lossShare: "Participation shares, except member-caused loss allocated by cause", fundingShare: "Al Noor 60%; Meridian 40%",
    workingCapital: "Initial SAR 20,000,000 followed by monthly forecast-based cash calls approved by the board.",
    cashCalls: "Ten business days' notice with forecast and evidence; default funding bears agreed financing cost and is recoverable from the defaulting member.",
    bankAccount: "Dedicated SAR project account in the JV's name", signatories: "Two signatories, one from each party, above SAR 250,000",
    paymentAuthority: "Three-way match of approved commitment, receipt, and invoice; finance review followed by delegated or board approval.",
    accounting: "Monthly management accounts, approved cost codes, rolling forecast, and annual financial statements.",
    audit: "Each member may audit on reasonable notice; external auditor appointed unanimously.",
    tax: "JV tax, VAT, withholding, and invoicing responsibilities to be confirmed by KSA tax adviser.",
    relatedPartyCharges: "At approved schedule rates or verified cost; no markup unless expressly approved.",
    distributions: "Quarterly, subject to cash-flow needs, taxes, disputed amounts, defects, claims, and security reserves."
  };
  demo.risk = {
    ...demo.risk,
    externalLiability: "Joint and several liability",
    internalAllocation: "By responsible scope and cause of loss; shared matters in participation shares where cause cannot reasonably be allocated.",
    indemnity: "Each member indemnifies the other for loss caused by its breach, negligence, misconduct, compliance failure, scope default, or security call attributable to that member.",
    liabilityCap: "Subject to project-specific legal review and carve-outs for fraud, wilful misconduct, confidentiality, IP, tax, and security calls.",
    insurance: "Project insurance programme aligned to the main contract; uninsured loss allocated by cause, otherwise participation share.",
    securities: "Performance security, advance payment guarantee, and any retention bond scheduled by provider, amount, expiry, collateral, and release.",
    counterIndemnity: "Each party provides counter-indemnity in its allocated share, with cause-based indemnity for calls arising from its default.",
    compliance: "Anti-bribery, sanctions, competition, HSE, labour, local content, data, tax, permits, and beneficial ownership checks completed and monitored.",
    confidentiality: "Tender and project information limited to authorized personnel and permitted disclosures; publicity requires approval.",
    ip: "Background IP remains with the originating party; the JV and employer receive project-use licences required by the main contract.",
    default: "Written notice and cure, with immediate protective step-in for urgent HSE, time-bar, security, or main-contract default risk; resulting cost recoverable.",
    withdrawal: "No withdrawal or transfer without unanimous approval and required employer consent; continuing liabilities and replacement security preserved.",
    termination: "Aligned with main-contract termination, prolonged force majeure, insolvency, unremedied default, and project close-out; survival obligations identified.",
    governingLaw: "Laws of the Kingdom of Saudi Arabia",
    dispute: "Project-level negotiation, CEO escalation, expert determination for technical/accounting matters, then institutional arbitration; interim relief preserved.",
    arbitrationSeat: "Riyadh, Kingdom of Saudi Arabia", arbitrationRules: "SCCA Arbitration Rules", language: "English"
  };
  state = demo;
  saveDraft(false);
  closeModal();
  renderStep();
  toast("Demonstration data loaded — replace it with project information");
}

function safeFilename() {
  return (state.project.name || "JV_Agreement_Preparation").replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "").slice(0, 80) || "JV_Agreement_Preparation";
}

function downloadBlob(content, mime, filename) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
  toast(`${filename} created`);
}

function exportRows() {
  const rows = [
    ["Agreement stage", state.mode === "pre" ? "Pre-tender" : "Post-tender"],
    ["Project / tender", state.project.name], ["Employer", state.project.employer], ["Reference", state.project.tenderRef],
    ["Country", state.project.country], ["Governing law", state.risk.governingLaw || state.project.governingLaw],
    ["Contract form", state.project.contractForm], ["JV parties", state.parties.map(p => `${p.name || "Unnamed"} — ${p.share || 0}%`).join("; ")],
    ["Participation total", `${formatNumber(partyShareTotal())}%`], ["Voting", state.governance.voting],
    ["Quorum", state.governance.quorum], ["Reserved matters", state.governance.reservedMatters], ["Deadlock", state.governance.deadlock],
    ["External liability", state.risk.externalLiability], ["Internal allocation", state.risk.internalAllocation],
    ["Indemnities", state.risk.indemnity], ["Compliance", state.risk.compliance], ["Dispute resolution", state.risk.dispute]
  ];
  if (state.mode === "pre") rows.splice(8, 0,
    ["JV form", state.bid.jvForm], ["Lead party", state.bid.leadParty], ["Lead authority", state.bid.leadAuthority],
    ["Exclusivity", state.bid.exclusivity], ["Bid cost method", state.bid.bidCostMethod], ["Bid bond", state.bid.bidBondRequired],
    ["Bid bond provider", state.bid.bidBondProvider], ["Award conversion", state.bid.conversionTrigger],
    ["Preliminary scope", state.contributions.scopeMatrix], ["Resource contributions", state.contributions.personnel]
  );
  else rows.splice(8, 0,
    ["Detailed scope", state.execution.scopeMatrix], ["Programme lead", state.execution.programmeLead], ["Claims lead", state.execution.claimsLead],
    ["Internal notice process", state.execution.notices], ["Profit share", state.commercial.profitShare], ["Loss share", state.commercial.lossShare],
    ["Funding share", state.commercial.fundingShare], ["Bank signatories", state.commercial.signatories], ["Securities", state.risk.securities], ["Insurance", state.risk.insurance]
  );
  return rows;
}

function downloadWord() {
  const risks = getRisks();
  const checklist = CHECKLISTS[state.mode];
  const rows = exportRows().map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value || "Not yet recorded")}</td></tr>`).join("");
  const checklistRows = checklist.map(([id, title, description, critical]) => `<tr><td>${state.checklist[state.mode][id] ? "Complete" : "Open"}</td><td>${escapeHtml(title)}</td><td>${escapeHtml(description)}</td><td>${critical ? "Critical" : "Standard"}</td></tr>`).join("");
  const riskRows = risks.length ? risks.map(risk => `<tr><td>${escapeHtml(risk.level)}</td><td>${escapeHtml(risk.title)}</td><td>${escapeHtml(risk.detail)}</td></tr>`).join("") : '<tr><td colspan="3">No critical preparation flags currently open.</td></tr>';
  const html = `<!doctype html><html><head><meta charset="UTF-8"><title>JV Agreement Preparation Summary</title><style>
    body{font-family:Arial,sans-serif;color:#152235;font-size:10.5pt;line-height:1.4;margin:34px}h1{font-family:Georgia,serif;color:#0b1930;font-size:24pt;margin:0 0 5px}h2{color:#0b1930;font-size:13pt;margin:24px 0 8px;border-bottom:1px solid #cbd3dc;padding-bottom:5px}p.meta{color:#5f6d80;margin:0 0 18px}table{width:100%;border-collapse:collapse;margin:0 0 18px}th,td{border:1px solid #cbd3dc;padding:7px 8px;vertical-align:top;text-align:left}th{width:27%;background:#eff4f7;color:#0b1930}thead th{width:auto;background:#0b1930;color:#fff}.note{background:#fff8eb;border:1px solid #ffebc8;padding:10px;margin-top:18px}
  </style></head><body><h1>${escapeHtml(state.project.name || "JV Agreement Preparation Summary")}</h1><p class="meta">${state.mode === "pre" ? "Pre-tender JV / Consortium Agreement" : "Post-tender Project JV Agreement"} · Readiness ${readinessScore()}% · Generated ${escapeHtml(formatDate(new Date()))}</p>
  <h2>Executive preparation summary</h2><table>${rows}</table><h2>Open risks and actions</h2><table><thead><tr><th>Priority</th><th>Risk</th><th>Required action</th></tr></thead><tbody>${riskRows}</tbody></table>
  <h2>Preparation checklist</h2><table><thead><tr><th>Status</th><th>Control</th><th>Evidence / purpose</th><th>Priority</th></tr></thead><tbody>${checklistRows}</tbody></table>
  <div class="note"><strong>Review note:</strong> This summary records preparation decisions and does not create a signed JV agreement. Verify the final agreement against the tender or main contract, governing law, corporate approvals, licensing, tax, competition, security, and execution formalities.</div></body></html>`;
  downloadBlob("\ufeff" + html, "application/msword", `${safeFilename()}_${state.mode === "pre" ? "Pre_Tender" : "Post_Tender"}_Summary.doc`);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadCsv() {
  const rows = [["Type", "Status / priority", "Control or risk", "Evidence / action"]];
  CHECKLISTS[state.mode].forEach(([id, title, description, critical]) => rows.push(["Checklist", state.checklist[state.mode][id] ? "Complete" : critical ? "Open — Critical" : "Open", title, description]));
  getRisks().forEach(risk => rows.push(["Risk", risk.level, risk.title, risk.detail]));
  downloadBlob("\ufeff" + rows.map(row => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8", `${safeFilename()}_Checklist_Risk_Register.csv`);
}

function downloadJson() {
  saveDraft(false);
  const backup = { application: "JV Agreement Navigator", version: APP_VERSION, exportedAt: new Date().toISOString(), data: state };
  downloadBlob(JSON.stringify(backup, null, 2), "application/json", `${safeFilename()}_JV_Preparation_Backup.json`);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const imported = parsed.data || parsed;
      if (!imported || typeof imported !== "object" || !["pre", "post"].includes(imported.mode)) throw new Error("Unsupported backup format");
      state = deepMerge(createDefaultState(), imported);
      saveDraft(false);
      closeModal();
      renderStep();
      toast("Backup restored successfully");
    } catch (error) {
      toast("This file is not a valid JV Navigator backup");
    }
  };
  reader.readAsText(file);
}

function printSummary() {
  if (state.currentStep !== "review") {
    state.currentStep = "review";
    renderStep();
  }
  setTimeout(() => window.print(), 80);
}

document.addEventListener("click", event => {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;
  const action = actionElement.dataset.action;

  if (action === "close-modal" && event.target.closest("[data-modal-panel]") && actionElement.classList.contains("modal-backdrop")) return;
  event.preventDefault();

  if (action === "go-step") {
    state.currentStep = actionElement.dataset.step;
    saveDraft(false);
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (action === "set-mode") {
    state.mode = actionElement.dataset.mode;
    if (!STEPS[state.mode].some(step => step.id === state.currentStep)) state.currentStep = "overview";
    saveDraft(false);
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast(`${state.mode === "pre" ? "Pre-tender" : "Post-tender"} workflow selected`);
  } else if (action === "save") {
    saveDraft(true);
  } else if (action === "toggle-nav") {
    document.body.classList.toggle("nav-open");
  } else if (action === "add-party") {
    state.parties.push({ name: "", legalForm: "", registration: "", country: "", role: "Member", share: "0", representative: "", authority: "" });
    debounceSave();
    renderStep();
  } else if (action === "remove-party") {
    if (state.parties.length > 2) {
      state.parties.splice(Number(actionElement.dataset.index), 1);
      debounceSave();
      renderStep();
    }
  } else if (action === "show-clause") {
    openClauseModal(actionElement.dataset.clause);
  } else if (action === "go-clause") {
    state.currentStep = "clauses";
    state.clauseView = "library";
    state.openClause = actionElement.dataset.clause;
    closeModal();
    saveDraft(false);
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (action === "toggle-clause") {
    state.openClause = state.openClause === actionElement.dataset.clause ? "" : actionElement.dataset.clause;
    renderStep();
  } else if (action === "set-clause-view") {
    state.clauseView = actionElement.dataset.view;
    saveDraft(false);
    renderStep();
  } else if (action === "clear-clause-search") {
    state.clauseSearch = "";
    renderStep();
  } else if (action === "open-tools") {
    openToolsModal();
  } else if (action === "close-modal") {
    closeModal();
  } else if (action === "load-sample") {
    loadDemonstrationData();
  } else if (action === "download-word") {
    downloadWord();
  } else if (action === "download-csv") {
    downloadCsv();
  } else if (action === "download-json") {
    downloadJson();
  } else if (action === "print-summary") {
    printSummary();
  } else if (action === "import-json") {
    closeModal();
    $("#import-file").click();
  } else if (action === "confirm-reset") {
    openResetModal();
  } else if (action === "reset") {
    localStorage.removeItem(STORAGE_KEY);
    state = createDefaultState();
    closeModal();
    renderStep();
    toast("Local draft reset");
  }
});

let clauseSearchTimer = null;

document.addEventListener("input", event => {
  const target = event.target;
  if (target.matches("[data-path]")) {
    setPath(target.dataset.path, target.value);
    debounceSave();
    renderNavigation();
    renderInsights();
  }
  if (target.matches("[data-party-index][data-party-field]")) {
    const index = Number(target.dataset.partyIndex);
    state.parties[index][target.dataset.partyField] = target.value;
    debounceSave();
    const totalElement = $(".share-total");
    if (totalElement) {
      const total = partyShareTotal();
      totalElement.classList.toggle("error", Math.abs(total - 100) > .001);
      totalElement.innerHTML = `Participation total: <strong>${formatNumber(total)}%</strong> ${Math.abs(total - 100) > .001 ? "— must equal 100%" : "— balanced"}`;
    }
    renderNavigation();
    renderInsights();
  }
  if (target.matches("[data-check-id]")) {
    state.checklist[state.mode][target.dataset.checkId] = target.checked;
    debounceSave();
    renderStep();
  }
  if (target.matches("[data-clause-status]")) {
    state.clauseStatus[target.dataset.clauseStatus] = target.checked;
    debounceSave();
    renderStep();
  }
  if (target.matches('[data-action-input="clause-search"]')) {
    state.clauseSearch = target.value;
    clearTimeout(clauseSearchTimer);
    clauseSearchTimer = setTimeout(() => {
      renderStep();
      const searchInput = $("#clause-search");
      searchInput?.focus();
      searchInput?.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }, 180);
  }
});

$("#import-file").addEventListener("change", event => {
  const [file] = event.target.files;
  if (file) importJson(file);
  event.target.value = "";
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
    document.body.classList.remove("nav-open");
  }
});

window.addEventListener("beforeunload", () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() })); } catch {}
});

renderStep();
