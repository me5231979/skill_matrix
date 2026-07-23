/* =====================================================================
   FLH PORTFOLIO DATA
   Source: FLH_Programs.csv (Futures Learning Hub — Program Portfolio).
   Metrics are partial; repopulate `volume` / `nps` as measurement matures.
   ===================================================================== */

window.FLH = {

  stages: [
    { id: 'foundations', name: 'Foundations',  blurb: 'Every staff member, met where they are — language, compliance, a weekly seat at the table.' },
    { id: 'capability',  name: 'Capability',   blurb: 'Skills that compound — AI fluency, certifications, coaching and a trained facilitator bench.' },
    { id: 'mobility',    name: 'Mobility',     blurb: 'Skills become movement — visible opportunity, internal-first searches, retention before resignation.' },
    { id: 'leadership',  name: 'Leadership',   blurb: 'Movement becomes leadership — a pipeline from first-time manager to the senior ranks and beyond.' },
    { id: 'governance',  name: 'Governance',   blurb: 'The system stays coherent — executive stewardship of strategy, products and investment.' }
  ],

  audiences: [
    { id: 'all',      name: 'All staff' },
    { id: 'leaders',  name: 'Managers & leaders' },
    { id: 'targeted', name: 'Targeted groups' },
    { id: 'exec',     name: 'Executive stakeholders' }
  ],

  partners: [
    { id: 'inhouse',  name: 'FLH in-house' },
    { id: 'oracle',   name: 'Oracle' },
    { id: 'edassist', name: 'EdAssist' },
    { id: 'vuit',     name: 'VUIT' },
    { id: 'abroad',   name: 'Abroad' }
  ],

  programs: [
    { id: 'chart', name: 'CHART', stage: 'capability', audience: 'all', partner: 'vuit', status: 'in-development',
      what: 'FLH’s AI fluency program — a self-paced platform, a 4-week intensive and an ongoing workshop series with VUIT.',
      who: 'All staff',
      value: 'Builds baseline AI capability across the workforce and drives AI enablement, including a manager workstream that translates AI exposure into workforce actions.' },

    { id: 'lr', name: 'Leadership Redefined', stage: 'leadership', audience: 'leaders', partner: 'inhouse', status: 'live',
      what: 'Vanderbilt’s premier Chancellor-sponsored development program for senior leaders: six leadership modules, a capstone innovation project, three personalized coaching sessions and weekly synthesis sessions.',
      who: 'M1–E1 leaders',
      value: 'Prepares leaders to move with clarity, agility and conviction in service of the institution’s ambition to define the great research university for the 21st century.',
      volume: { n: 113, label: 'M1–E1 leaders completed' },
      nps: { score: 4.67, responses: 227 } },

    { id: 'voyage', name: 'Manager Voyage', stage: 'leadership', audience: 'leaders', partner: 'inhouse', status: 'pilot',
      what: 'Leadership program for new and newly promoted people managers.',
      who: 'Managers',
      value: 'Establishes a consistent management baseline early in the manager lifecycle.',
      volume: { n: 15, label: 'pilot participants' } },

    { id: 'speak', name: 'SPEAK', stage: 'foundations', audience: 'targeted', partner: 'edassist', status: 'live',
      what: 'Language literacy program powered via EdAssist.',
      who: 'Staff with low English proficiency, ESL, or who do not speak English',
      value: 'Removes language barriers to participation and advancement, widening the growth path for underserved staff.' },

    { id: 'anchors', name: 'Anchors Edge', stage: 'foundations', audience: 'all', partner: 'inhouse', status: 'live',
      what: 'Weekly all-staff virtual lunch-and-learn series.',
      who: 'All staff',
      value: 'Provides a low-barrier, recurring touchpoint for continuous learning across the enterprise.',
      volume: { n: 1000, label: 'employees registered for at least one session' },
      nps: { score: 4.75, responses: 497 } },

    { id: 'marketplace', name: 'Talent Marketplace', stage: 'mobility', audience: 'all', partner: 'oracle', status: 'live',
      what: 'Oracle Grow–based staff talent platform.',
      who: 'All staff',
      value: 'Connects staff to growth opportunities and surfaces internal talent for development and mobility.' },

    { id: 'vault', name: 'VAULT', stage: 'governance', audience: 'exec', partner: 'inhouse', status: 'in-development',
      what: 'Bi-monthly community of practice and enterprise governance council.',
      who: 'Executive stakeholders',
      value: 'Guides talent and learning strategy at the executive level, keeping enterprise capability-building aligned and governed.' },

    { id: 'summit', name: 'Summit', stage: 'mobility', audience: 'all', partner: 'oracle', status: 'live',
      what: 'Structured program for retaining, developing and moving staff, built on four interdependent components: Oracle, change management, a mandatory 5-business-day internal search process and deliberate people practices. Transfer Portal is the employee front door; Workforce Intelligence is the leader-facing view.',
      who: 'All staff',
      value: 'Gives committed staff a visible path forward and gives leaders tools to act before a vacancy or resignation forces the conversation.' },

    { id: 'navigators', name: 'Navigators Session', stage: 'capability', audience: 'all', partner: 'inhouse', status: 'live',
      what: 'FLH’s facilitator network and facilitation education program, with the option to offer facilitated courses.',
      who: 'All staff — facilitators and aspiring facilitators',
      value: 'Builds internal facilitation capability, extending FLH’s reach through a trained network.' },

    { id: 'compliance', name: 'Compliance', stage: 'foundations', audience: 'all', partner: 'inhouse', status: 'live',
      what: 'Ongoing and annual compliance education and delivery, with role-dependent content where needed.',
      who: 'All staff',
      value: 'Keeps the workforce current on required compliance and manages institutional risk.' },

    { id: 'cohort', name: 'Cohort Certification Program', stage: 'capability', audience: 'all', partner: 'edassist', status: 'live',
      what: 'Non-degree certification programs funded through the tuition reimbursement benefit, run as cohorts in partnership with EdAssist.',
      who: 'All staff',
      value: 'Reduces cost and builds community by having staff move through certification programs together rather than solo.' },

    { id: 'products', name: 'Product Governance & Oversight', stage: 'governance', audience: 'exec', partner: 'inhouse', status: 'live',
      what: 'Oversight and management of all the products FLH uses, delivers and subleases.',
      who: 'Product users',
      value: 'Economies of skill, standardization and a coherent product portfolio across the enterprise.' },

    { id: 'coaching', name: 'Coaching', stage: 'capability', audience: 'all', partner: 'abroad', status: 'in-development',
      what: 'Professional coaching in partnership with Abroad (carries an additional cost).',
      who: 'All staff',
      value: 'Extends individualized development support across the workforce.' },

    { id: 'alumni', name: 'LR Alumni', stage: 'leadership', audience: 'leaders', partner: 'inhouse', status: 'live',
      what: 'Ongoing series for graduates of the Leadership Redefined program.',
      who: 'Leadership Redefined graduates',
      value: 'Keeps LR alumni informed on topics and trends impacting Vanderbilt and ways of work.',
      nps: { score: 4.75, responses: 8 } }
  ],

  /* The connective tissue: each edge is a real dependency or hand-off. */
  edges: [
    { a: 'lr',        b: 'alumni',      why: 'Every LR graduate flows into the alumni series — the program doesn’t end at the capstone.' },
    { a: 'voyage',    b: 'lr',          why: 'Manager Voyage sets the management baseline that feeds the senior-leader pipeline into LR.' },
    { a: 'lr',        b: 'coaching',    why: 'Three personalized coaching sessions are built into LR — the coaching practice extends that model to all staff.' },
    { a: 'chart',     b: 'summit',      why: 'CHART’s manager workstream translates AI exposure into the workforce actions Summit operationalizes.' },
    { a: 'chart',     b: 'navigators',  why: 'CHART’s workshop series is a delivery lane for the trained facilitator network.' },
    { a: 'navigators',b: 'anchors',     why: 'Navigators-trained facilitators extend FLH’s reach through recurring sessions like Anchors Edge.' },
    { a: 'speak',     b: 'cohort',      why: 'Both run on the EdAssist partnership — one benefit infrastructure, two doors.' },
    { a: 'speak',     b: 'summit',      why: 'SPEAK removes the language barrier so more staff can actually use Summit’s path forward.' },
    { a: 'marketplace', b: 'summit',    why: 'Both run on Oracle — Summit’s Transfer Portal opens into the marketplace’s opportunity feed.' },
    { a: 'products',  b: 'marketplace', why: 'Oracle Grow is one of the governed products — oversight keeps the platform coherent.' },
    { a: 'products',  b: 'chart',       why: 'CHART’s self-paced platform sits inside the governed product portfolio.' },
    { a: 'vault',     b: 'products',    why: 'Enterprise governance and product oversight are two halves of the same stewardship.' },
    { a: 'vault',     b: 'summit',      why: 'VAULT keeps the talent strategy Summit executes aligned and governed at the executive level.' },
    { a: 'vault',     b: 'lr',          why: 'VAULT’s executive stakeholders are LR’s population — governance and development share a table.' },
    { a: 'voyage',    b: 'summit',      why: 'New managers learn the deliberate people practices Summit depends on.' },
    { a: 'compliance',b: 'vault',       why: 'Compliance manages institutional risk; VAULT governs it at the enterprise level.' },
    { a: 'cohort',    b: 'marketplace', why: 'Certifications earned in cohorts surface as skills and readiness in the talent platform.' }
  ]
};
