// Single source of truth for the 7 leadership tabs: who they are, which
// Key Metrics they track, and which standing Focus Questions they answer
// every week. Metric/question keys must stay stable once in use, since
// they're referenced inside stored JSON (WeekEntry.metrics / .focusAnswers).

export type MetricDef = {
  key: string;
  label: string;
};

export type FocusQuestionDef = {
  key: string;
  question: string;
};

export type PersonConfig = {
  slug: string;
  name: string;
  title: string;
  department: string;
  order: number;
  metrics: MetricDef[];
  focusQuestions: FocusQuestionDef[];
};

export const PEOPLE: PersonConfig[] = [
  {
    slug: "jill-spencer",
    name: "Jill Spencer",
    title: "Chief of Staff",
    department: "Executive Office",
    order: 1,
    metrics: [
      { key: "initiativesOnTrack", label: "Cross-company initiatives on track (# / total)" },
      { key: "openActionItems", label: "Open action items from leadership meetings" },
      { key: "actionItemsClosed", label: "Action items closed this week" },
      { key: "deadlinesAtRisk", label: "Upcoming deadlines at risk" },
    ],
    focusQuestions: [
      { key: "crossDeptStatus", question: "Status of top cross-departmental initiatives" },
      { key: "followUps", question: "Follow-ups owed to/from Melissa and their status" },
      { key: "coordinationIssues", question: "Coordination issues between departments this week" },
      { key: "upcomingPrep", question: "Upcoming meetings, events, or deadlines Melissa should prepare for" },
    ],
  },
  {
    slug: "kasey-siebern",
    name: "Kasey Siebern",
    title: "Director of Operations & Innovation / Interim Sales Manager",
    department: "Operations, Sales, CX, Print Shop, Warehouse, Marketing",
    order: 2,
    metrics: [
      { key: "salesRevenue", label: "Sales revenue this week (vs. target)" },
      { key: "newOrdersQuotes", label: "New orders/quotes issued" },
      { key: "onTimeShipmentRate", label: "On-time shipment rate (%)" },
      { key: "cxTickets", label: "CX tickets opened/resolved" },
      { key: "cxResponseTime", label: "Avg. CX response time" },
      { key: "printShopJobs", label: "Print shop jobs completed/in queue" },
      { key: "warehouseBacklog", label: "Warehouse order backlog" },
      { key: "marketingLeads", label: "Marketing campaign leads generated" },
    ],
    focusQuestions: [
      { key: "salesPipeline", question: "Sales pipeline — top opportunities and expected close dates" },
      { key: "escalations", question: "Any customer escalations and how they were resolved" },
      { key: "printShopIssues", question: "Print shop capacity or equipment issues" },
      { key: "warehouseIssues", question: "Warehouse/logistics issues (inventory accuracy, shipping delays)" },
      { key: "marketingCampaigns", question: "Marketing: campaigns in flight and results (Jake's team)" },
      { key: "innovationProjects", question: "Innovation projects: status and next milestone" },
    ],
  },
  {
    slug: "lj-cira",
    name: "LJ Cira",
    title: "HD Channel & Sr. Purchasing Manager, Product Management Lead",
    department: "HD Channel & Purchasing",
    order: 3,
    metrics: [
      { key: "hdChannelRevenue", label: "HD channel revenue this week (vs. target)" },
      { key: "poPlacedReceived", label: "Purchase orders placed/received" },
      { key: "inventoryAtRisk", label: "Inventory at risk (stock-outs or overstock SKUs)" },
      { key: "newListings", label: "New product listings published" },
      { key: "contentUpdates", label: "Product content updates completed" },
    ],
    focusQuestions: [
      { key: "purchasingPipeline", question: "Purchasing pipeline: key POs, lead times, and vendor issues" },
      { key: "hdChannelPerformance", question: "HD channel performance highlights and issues" },
      { key: "analyticsInsights", question: "Analytics insights from Oumaima worth leadership attention" },
      { key: "pricingChanges", question: "Pricing or margin changes recommended this week" },
    ],
  },
  {
    slug: "jennifer-davenport",
    name: "Jennifer Davenport",
    title: "VP of Key Accounts",
    department: "Key Accounts",
    order: 4,
    metrics: [
      { key: "keyAccountRevenue", label: "Key account revenue this week (vs. target)" },
      { key: "openOpportunities", label: "Open opportunities (# / $ value)" },
      { key: "accountsAtRisk", label: "Accounts at risk (# and names)" },
      { key: "newAccountMeetings", label: "New account meetings held" },
      { key: "proposalsOutstanding", label: "Proposals/quotes outstanding" },
    ],
    focusQuestions: [
      { key: "top5Health", question: "Health check on top 5 accounts (green/yellow/red)" },
      { key: "atRiskPlans", question: "At-risk accounts: issue and save plan" },
      { key: "newBusiness", question: "New business: prospects added and next steps" },
      { key: "melissaHelp", question: "Where Melissa's involvement would help close or save an account" },
    ],
  },
  {
    slug: "mackenzie-alberts",
    name: "Mackenzie Alberts",
    title: "Product Development",
    department: "Product Development",
    order: 5,
    metrics: [
      { key: "productsInDev", label: "Products in development (by stage: concept/sample/final)" },
      { key: "samplesReceivedApproved", label: "Samples received/approved this week" },
      { key: "launchesOnSchedule", label: "Launches on schedule (# / total)" },
      { key: "vendorQuotesOutstanding", label: "Vendor quotes outstanding" },
    ],
    focusQuestions: [
      { key: "pipelineChanges", question: "Development pipeline: stage changes since last week" },
      { key: "launchRisks", question: "Launch timeline risks and mitigation" },
      { key: "vendorSamplingIssues", question: "Vendor or sampling issues" },
      { key: "newIdeas", question: "New product ideas or opportunities identified" },
    ],
  },
  {
    slug: "nicole-graham",
    name: "Nicole Graham",
    title: "Controller",
    department: "Accounting & Finance",
    order: 6,
    metrics: [
      { key: "cashPosition", label: "Cash position" },
      { key: "arTotalOver60", label: "AR total / % over 60 days" },
      { key: "apTotalUpcoming", label: "AP total / upcoming large payments" },
      { key: "revenueVsBudget", label: "Weekly revenue vs. budget" },
      { key: "invoicesIssuedCollected", label: "Invoices issued/collected this week" },
    ],
    focusQuestions: [
      { key: "cashFlowOutlook", question: "Cash flow outlook for the next 30 days" },
      { key: "collections", question: "Collections: significant overdue accounts and actions taken" },
      { key: "budgetVariances", question: "Budget variances needing attention" },
      { key: "hrItems", question: "HR items from Rachel (payroll, benefits, compliance) needing leadership awareness" },
    ],
  },
  {
    slug: "arsen-budgio",
    name: "Arsen Budgio",
    title: "CTO & IT Director",
    department: "IT & Development",
    order: 7,
    metrics: [
      { key: "uptimeOutages", label: "System uptime/outages this week" },
      { key: "itTickets", label: "IT support tickets opened/resolved" },
      { key: "avgResolutionTime", label: "Avg. ticket resolution time" },
      { key: "devProjectsOnTrack", label: "Development projects on track (# / total)" },
      { key: "securityIncidents", label: "Security incidents or alerts" },
    ],
    focusQuestions: [
      { key: "devProjectStatus", question: "Status of key development projects (web, internal tools)" },
      { key: "securityPosture", question: "Security posture: patches, threats, or training needs" },
      { key: "remoteCoordination", question: "Remote team coordination: any issues or wins" },
      { key: "systemInvestments", question: "Systems or software investments recommended" },
    ],
  },
];

export function getPersonConfig(slug: string): PersonConfig | undefined {
  return PEOPLE.find((p) => p.slug === slug);
}

export const PEOPLE_BY_ORDER = [...PEOPLE].sort((a, b) => a.order - b.order);
