/* =====================================================================
   VANDERBILT TALENT MARKETPLACE — CAREER PATHWAYS EXPLORER
   Data: assets/data/sbja.json (extracted from the SBJA workbook).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Nav + reveal ---------- */
  var nav = document.getElementById('nav');
  addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', scrollY > 10);
  }, { passive: true });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* Ambient hero montage: show only when the file loads; skip on small screens
     and for reduced-motion users (spec: degrade to the static treatment). */
  (function () {
    var media = document.getElementById('hero-media');
    var video = document.getElementById('hero-video');
    if (!media || !video) return;
    if (!matchMedia('(min-width: 700px)').matches ||
        matchMedia('(prefers-reduced-motion: reduce)').matches) {
      media.remove();
      return;
    }
    video.addEventListener('loadeddata', function () {
      media.hidden = false;
      var grid = document.querySelector('.hero__grid');
      if (grid) grid.remove();
    });
    video.load();
  })();

  /* Entry acknowledgment: outcomes note as a gate, on every entry.
     Acknowledging opens the path chooser. */
  var pathModal = document.getElementById('path-modal');
  function openPathChooser() { if (pathModal && pathModal.showModal) pathModal.showModal(); }
  (function () {
    var d = document.getElementById('ack-modal');
    if (!d || !d.showModal) return;
    d.addEventListener('cancel', function (e) { e.preventDefault(); });
    document.getElementById('ack-btn').addEventListener('click', function () {
      d.close();
      openPathChooser();
    });
    d.showModal();
  })();

  /* Path chooser: two ways in. */
  (function () {
    if (!pathModal) return;
    document.getElementById('path-close').addEventListener('click', function () { pathModal.close(); });
    pathModal.addEventListener('click', function (e) { if (e.target === pathModal) pathModal.close(); });
    document.getElementById('path-roles').addEventListener('click', function () {
      pathModal.close();
      enterRolesPath();
      document.getElementById('myrole').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('path-skills').addEventListener('click', function () {
      pathModal.close();
      enterSkillsPath();
      document.getElementById('skillsfirst').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('path-team').addEventListener('click', function () {
      pathModal.close();
      enterTeamPath();
      document.getElementById('teamtool').scrollIntoView({ behavior: 'smooth' });
    });
    ['hero-path', 'nav-path', 'footer-path'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', openPathChooser);
    });
  })();

  /* Universal AI-readiness skill: needed for every role, assumed to need development everywhere.
     Deliberately NOT gold — it is not part of the official framework. */
  var AI_READINESS = {
    skill: 'AI Workforce Readiness',
    type: 'Universal',
    category: 'AI-Enabled Work',
    subcategory: 'Applies to all Vanderbilt roles',
    definition: 'Capability to work effectively in AI-enabled work: understanding what AI can and cannot do, prompting and directing AI tools well, critically verifying AI output before acting on it, handling data responsibly by sensitivity tier and redesigning everyday workflows to pair human judgment with AI assistance. Assumed to need development for every role at every level.',
    prof: null
  };

  /* Curated skill resources per skill category — named podcasts, YouTube channels,
     and industry certifications with DIRECT links to the resource itself. */
  var RESOURCES = {
    'Business Planning and Risk Management': [
      ['Podcast', 'HBR IdeaCast', 'https://hbr.org/podcasts/ideacast'],
      ['Podcast', 'The McKinsey Podcast', 'https://www.mckinsey.com/featured-insights/mckinsey-podcast'],
      ['Cert', 'PMI Risk Management Professional (PMI-RMP)', 'https://www.pmi.org/certifications/risk-management-rmp'],
      ['Cert', 'ASQ Six Sigma Green Belt', 'https://asq.org/cert/six-sigma-green-belt'],
      ['Free', 'MIT OpenCourseWare (free courses)', 'https://ocw.mit.edu']],
    'Legal, Regulation and Compliance': [
      ['Podcast', 'Compliance Podcast Network', 'https://compliancepodcastnetwork.net'],
      ['Cert', 'Certified Compliance & Ethics Professional (CCEP)', 'https://www.corporatecompliance.org'],
      ['Cert', 'OSHA Outreach 10/30-Hour', 'https://www.osha.gov/training/outreach'],
      ['Free', 'OSHA Training Materials (free)', 'https://www.osha.gov/training']],
    'Technology Use, Monitoring and Control': [
      ['Podcast', 'Daily Tech News Show', 'https://dailytechnewsshow.com'],
      ['YouTube', 'Professor Messer', 'https://www.youtube.com/@professormesser'],
      ['YouTube', 'NetworkChuck', 'https://www.youtube.com/@NetworkChuck'],
      ['Cert', 'CompTIA A+', 'https://www.comptia.org/certifications/a'],
      ['Cert', 'Google IT Support Professional Certificate', 'https://grow.google/certificates/it-support/'],
      ['Free', 'Cisco Networking Academy (free)', 'https://www.netacad.com']],
    'Education': [
      ['Podcast', 'Cult of Pedagogy', 'https://www.cultofpedagogy.com/pod/'],
      ['Podcast', 'Teaching in Higher Ed', 'https://teachinginhighered.com/podcast/'],
      ['YouTube', 'Edutopia', 'https://www.youtube.com/@edutopia'],
      ['Cert', 'ATD Talent Development Certifications (APTD/CPTD)', 'https://www.td.org/certification'],
      ['Program', 'Vanderbilt Peabody College', 'https://peabody.vanderbilt.edu'],
      ['Free', 'OER Commons (free open education resources)', 'https://oercommons.org']],
    'Technology Design and Development': [
      ['Podcast', 'Software Engineering Daily', 'https://softwareengineeringdaily.com'],
      ['Podcast', 'Syntax', 'https://syntax.fm'],
      ['YouTube', 'freeCodeCamp', 'https://www.youtube.com/@freecodecamp'],
      ['Cert', 'CompTIA Cloud+ (vendor-neutral)', 'https://www.comptia.org/certifications/cloud'],
      ['Course', 'Harvard CS50 (free)', 'https://cs50.harvard.edu/'],
      ['Free', 'The Odin Project (free)', 'https://www.theodinproject.com']],
    'Administrative Services': [
      ['Podcast', 'The Leader Assistant', 'https://leaderassistant.com/podcast'],
      ['YouTube', 'Leila Gharani (Office skills)', 'https://www.youtube.com/@LeilaGharani'],
      ['Cert', 'IAAP Certified Administrative Professional (CAP)', 'https://www.iaap-hq.org'],
      ['Cert', 'Microsoft Office Specialist (MOS)', 'https://certiport.pearsonvue.com/Certifications/Microsoft/MOS/Overview'],
      ['Free', 'Google Workspace Learning Center (free)', 'https://support.google.com/a/users']],
    'Corporate Communications': [
      ['Podcast', 'Spin Sucks', 'https://spinsucks.com/podcast/'],
      ['Cert', 'Accreditation in Public Relations (APR)', 'https://www.praccreditation.org'],
      ['Cert', 'ACES Editing Certificates', 'https://aceseditors.org'],
      ['Free', 'HubSpot Academy (free certifications)', 'https://academy.hubspot.com']],
    'Financial Resources Management': [
      ['Podcast', 'Planet Money (NPR)', 'https://www.npr.org/podcasts/510289/planet-money'],
      ['Podcast', 'Journal of Accountancy', 'https://www.journalofaccountancy.com'],
      ['YouTube', 'Accounting Stuff', 'https://www.youtube.com/@AccountingStuff'],
      ['Cert', 'Certified Management Accountant (CMA)', 'https://www.imanet.org'],
      ['Cert', 'GFOA Certified Public Finance Officer (CPFO)', 'https://www.gfoa.org/cpfo'],
      ['Free', 'Khan Academy Finance (free)', 'https://www.khanacademy.org/economics-finance-domain']],
    'Business Strategy': [
      ['Podcast', 'Masters of Scale', 'https://mastersofscale.com'],
      ['Podcast', 'HBR IdeaCast', 'https://hbr.org/podcasts/ideacast'],
      ['Cert', 'Project Management Professional (PMP)', 'https://www.pmi.org/certifications/project-management-pmp'],
      ['Program', 'Harvard Business School Online', 'https://online.hbs.edu'],
      ['Program', 'Stanford Online', 'https://online.stanford.edu'],
      ['Free', 'MIT OpenCourseWare: Sloan (free)', 'https://ocw.mit.edu']],
    'Communication Design and Development': [
      ['Podcast', 'Design Matters with Debbie Millman', 'https://www.designmattersmedia.com'],
      ['YouTube', 'The Futur', 'https://www.youtube.com/@thefutur'],
      ['Cert', 'Google UX Design Certificate', 'https://grow.google/certificates/ux-design/'],
      ['Cert', 'Adobe Certified Professional', 'https://certifiedprofessional.adobe.com'],
      ['Free', 'Canva Design School (free)', 'https://www.canva.com/designschool/']],
    'Healthcare': [
      ['Podcast', 'What the Health? (KFF Health News)', 'https://kffhealthnews.org/what-the-health/'],
      ['YouTube', 'Osmosis', 'https://www.youtube.com/@osmosis'],
      ['Cert', 'AHA Basic Life Support (BLS)', 'https://cpr.heart.org'],
      ['Cert', 'Certified Health Education Specialist (CHES)', 'https://www.nchec.org'],
      ['Free', 'CDC TRAIN (free public-health training)', 'https://www.train.org']],
    'Hospitality and Food Services': [
      ['Podcast', 'Restaurant Unstoppable', 'https://restaurantunstoppable.com'],
      ['YouTube', 'America’s Test Kitchen', 'https://www.youtube.com/@AmericasTestKitchen'],
      ['Cert', 'ServSafe Manager', 'https://www.servsafe.com'],
      ['Cert', 'ACF Culinary Certifications', 'https://www.acfchefs.org'],
      ['Cert', 'Certified Meeting Professional (CMP)', 'https://www.eventscouncil.org'],
      ['Free', 'CDC Food Safety (free)', 'https://www.cdc.gov/foodsafety/']],
    'Leadership and Social Influence': [
      ['Podcast', 'Coaching for Leaders', 'https://coachingforleaders.com'],
      ['YouTube', 'Simon Sinek', 'https://www.youtube.com/@simonsinek'],
      ['Cert', 'ICF Coaching Credentials (ACC)', 'https://coachingfederation.org'],
      ['Cert', 'SHRM Certified Professional (SHRM-CP)', 'https://www.shrm.org/credentials'],
      ['Program', 'Harvard Business School Online', 'https://online.hbs.edu'],
      ['Free', 'Center for Creative Leadership articles (free)', 'https://www.ccl.org/articles/']],
    'Marketing of Products and Services': [
      ['Podcast', 'Marketing Over Coffee', 'https://www.marketingovercoffee.com'],
      ['YouTube', 'HubSpot', 'https://www.youtube.com/@HubSpot'],
      ['Cert', 'Google Digital Marketing & E-commerce Certificate', 'https://grow.google/certificates/digital-marketing-ecommerce/'],
      ['Cert', 'AMA Professional Certified Marketer (PCM)', 'https://www.ama.org'],
      ['Free', 'Google Skillshop (free)', 'https://skillshop.withgoogle.com']],
    'Customer/Client Management': [
      ['Podcast', 'The Modern Customer (Blake Morgan)', 'https://www.blakemichellemorgan.com'],
      ['Cert', 'HDI Customer Service Representative', 'https://www.thinkhdi.com'],
      ['Cert', 'Certified Customer Experience Professional (CCXP)', 'https://www.cxpa.org'],
      ['Free', 'HubSpot Academy service courses (free)', 'https://academy.hubspot.com']],
    'Supply Chain Management': [
      ['Podcast', 'Supply Chain Now', 'https://supplychainnow.com'],
      ['Cert', 'ASCM CPIM / CSCP', 'https://www.ascm.org'],
      ['Free', 'MIT OpenCourseWare: Supply Chain (free)', 'https://ocw.mit.edu']],
    'Human Resources Management': [
      ['Podcast', 'HR Happy Hour', 'https://www.hrhappyhour.net'],
      ['Podcast', 'Honest HR (SHRM)', 'https://www.shrm.org'],
      ['Cert', 'SHRM-CP', 'https://www.shrm.org/credentials'],
      ['Cert', 'HRCI Professional in Human Resources (PHR)', 'https://www.hrci.org'],
      ['Free', 'SHRM HR topic resources', 'https://www.shrm.org/topics-tools']],
    'Repair and Maintenance': [
      ['Podcast', 'Rooted in Reliability', 'https://accendoreliability.com'],
      ['YouTube', 'This Old House', 'https://www.youtube.com/@thisoldhouse'],
      ['Cert', 'Certified Maintenance & Reliability Professional (CMRP)', 'https://smrp.org'],
      ['Cert', 'EPA Section 608', 'https://www.epa.gov/section608'],
      ['Free', 'OSHA Training Materials (free)', 'https://www.osha.gov/training']],
    'Quality Management': [
      ['Podcast', 'ASQ Quality Resources', 'https://asq.org'],
      ['Cert', 'ASQ Certified Quality Improvement Associate (CQIA)', 'https://asq.org/cert'],
      ['Cert', 'ASQ Six Sigma Green Belt', 'https://asq.org/cert/six-sigma-green-belt'],
      ['Free', 'ASQ Quality Resources (free)', 'https://asq.org/quality-resources']],
    'Financial Services and Insurance': [
      ['Podcast', 'Planet Money (NPR)', 'https://www.npr.org/podcasts/510289/planet-money'],
      ['Cert', 'America’s Credit Unions Certifications', 'https://www.americascreditunions.org'],
      ['Cert', 'Certified Financial Planner (CFP)', 'https://www.cfp.net'],
      ['Free', 'FDIC Money Smart (free)', 'https://www.fdic.gov/consumer-resource-center/money-smart']],
    'Transportation Operations': [
      ['Podcast', 'The Parking Podcast', 'https://www.parkingcast.com'],
      ['Cert', 'IPMI CAPP', 'https://www.parking-mobility.org'],
      ['Cert', 'Commercial Driver’s License (CDL)', 'https://www.fmcsa.dot.gov/registration/commercial-drivers-license'],
      ['Free', 'FMCSA resources (free)', 'https://www.fmcsa.dot.gov']],
    'Research and Development': [
      ['Podcast', 'Everything Hertz', 'https://everythinghertz.com'],
      ['Cert', 'Certified Research Administrator (CRA)', 'https://www.cra-cert.org'],
      ['Cert', 'CITI Program Research Training', 'https://about.citiprogram.org'],
      ['Free', 'NIH Grants & Funding training (free)', 'https://grants.nih.gov']],
    'Architecture, Construction, and Urban Design': [
      ['YouTube', 'The B1M', 'https://www.youtube.com/@TheB1M'],
      ['YouTube', 'Practical Engineering', 'https://www.youtube.com/@PracticalEngineeringChannel'],
      ['Cert', 'LEED Green Associate', 'https://www.usgbc.org/credentials'],
      ['Cert', 'OSHA Outreach 30-Hour Construction', 'https://www.osha.gov/training/outreach'],
      ['Free', 'Whole Building Design Guide (free)', 'https://www.wbdg.org']],
    'Sales of Products and Services': [
      ['Podcast', 'The Sales Evangelist', 'https://thesalesevangelist.com'],
      ['Cert', 'HubSpot Academy Sales Certifications', 'https://academy.hubspot.com'],
      ['Cert', 'NASP Certified Professional Sales Person (CPSP)', 'https://www.nasp.com'],
      ['Free', 'HubSpot Academy sales courses (free)', 'https://academy.hubspot.com']],
    'Problem Solving': [
      ['Podcast', 'Hidden Brain', 'https://hiddenbrain.org'],
      ['YouTube', 'Veritasium', 'https://www.youtube.com/@veritasium'],
      ['Cert', 'ASQ Six Sigma Yellow Belt', 'https://asq.org/cert/six-sigma-yellow-belt'],
      ['Free', 'MIT OpenCourseWare (free)', 'https://ocw.mit.edu']],
    'Social and Behavioral Sciences': [
      ['Podcast', 'Hidden Brain', 'https://hiddenbrain.org'],
      ['Podcast', 'Speaking of Psychology (APA)', 'https://www.apa.org/news/podcasts'],
      ['Cert', 'CITI Program Research Training', 'https://about.citiprogram.org'],
      ['Free', 'OpenStax textbooks (free)', 'https://openstax.org']],
    'Product Design and Development': [
      ['Podcast', 'Lenny’s Podcast', 'https://www.lennyspodcast.com'],
      ['Cert', 'Certified Scrum Product Owner (CSPO)', 'https://www.scrumalliance.org'],
      ['Free', 'Scrum.org Open Assessments (free)', 'https://www.scrum.org']],
    'Real Estate': [
      ['Podcast', 'America’s Commercial Real Estate Show', 'https://www.creshow.com'],
      ['Cert', 'CCIM Designation', 'https://www.ccim.com'],
      ['Cert', 'IFMA Facility Management Professional (FMP)', 'https://www.ifma.org'],
      ['Free', 'IFMA resources', 'https://www.ifma.org']],
    'Energy and Utilities': [
      ['Podcast', 'The Energy Gang', 'https://www.woodmac.com/podcasts/the-energy-gang/'],
      ['Cert', 'AEE Certified Energy Manager (CEM)', 'https://www.aeecenter.org'],
      ['Cert', 'LEED Green Associate', 'https://www.usgbc.org/credentials'],
      ['Free', 'DOE Better Buildings training (free)', 'https://betterbuildingssolutioncenter.energy.gov']],
    'Cognitive': [
      ['Podcast', 'Hidden Brain', 'https://hiddenbrain.org'],
      ['YouTube', 'Veritasium', 'https://www.youtube.com/@veritasium'],
      ['Free', 'Khan Academy (free)', 'https://www.khanacademy.org']],
    'Agriculture': [
      ['Podcast', 'Future of Agriculture', 'https://www.futureofag.com'],
      ['Cert', 'ISA Certified Arborist', 'https://www.isa-arbor.com'],
      ['Cert', 'NALP Landscape Industry Certified', 'https://www.landscapeprofessionals.org'],
      ['Free', 'Trees Are Good, ISA public resources (free)', 'https://www.treesaregood.org']],
    'Mathematics and Mathematical Modeling': [
      ['Podcast', 'Data Skeptic', 'https://dataskeptic.com'],
      ['YouTube', 'StatQuest', 'https://www.youtube.com/@statquest'],
      ['Cert', 'Google Data Analytics Certificate', 'https://grow.google/certificates/data-analytics/'],
      ['Free', 'Kaggle Learn (free)', 'https://www.kaggle.com/learn']],
    'AI-Enabled Work': [
      ['Free', 'One Useful Thing, Ethan Mollick (free)', 'https://www.oneusefulthing.org'],
      ['Book', 'Co-Intelligence, Ethan Mollick', 'https://www.oneusefulthing.org/about'],
      ['Course', 'Vanderbilt: Prompt Engineering (Coursera)', 'https://www.coursera.org/learn/prompt-engineering'],
      ['Course', 'Harvard CS50 AI (free)', 'https://cs50.harvard.edu/ai/'],
      ['Course', 'Stanford Online: AI courses', 'https://online.stanford.edu'],
      ['Free', 'Elements of AI, Univ. of Helsinki (free)', 'https://www.elementsofai.com'],
      ['Cert', 'Google AI Essentials', 'https://grow.google/ai-essentials/'],
      ['Podcast', 'Hard Fork (NYT)', 'https://www.nytimes.com/column/hard-fork']]
  };

  /* Proficiency scale: Awareness(1) .. Expert(5) */
  var PROF_ORDER = { Awareness: 1, Developing: 2, Intermediate: 3, Advanced: 4, Expert: 5 };
  var PROF_NAMES = ['Awareness', 'Developing', 'Intermediate', 'Advanced', 'Expert'];
  function profPeak(prof) {
    var m = 0;
    if (prof) Object.keys(prof).forEach(function (k) { m = Math.max(m, PROF_ORDER[prof[k]] || 0); });
    return m;
  }
  function profRange(prof) {
    var lo = 6, hi = 0;
    if (prof) Object.keys(prof).forEach(function (k) {
      var v = PROF_ORDER[prof[k]] || 0;
      if (v) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    });
    if (!hi) return null;
    return lo === hi ? PROF_NAMES[hi - 1] : PROF_NAMES[lo - 1] + ' \u2192 ' + PROF_NAMES[hi - 1];
  }
  function profMeter(prof) {
    var peak = profPeak(prof);
    if (!peak) return '';
    var dots = '';
    for (var i = 1; i <= 5; i++) dots += '<i class="' + (i <= peak ? 'on' : '') + '"></i>';
    return '<span class="pmeter" aria-label="Top expected proficiency: ' + PROF_NAMES[peak - 1] +
      '" title="Top expected proficiency: ' + PROF_NAMES[peak - 1] + '">' + dots + '</span>';
  }

  /* Oracle deep links (Vanderbilt tenancy) */
  var ORA = {
    grow: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/human-resources/career-grow/launch',
    talent: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/profiles/person-profile/skills-qualification-start?persona=ORA_HRT_EMPLOYEE',
    skills: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/profiles/skills/skillscenter?navigateBack=true',
    market: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/internalmobility/opportunitymarketplace/search'
  };
  function oa(label, url) {
    return '<a class="olink" href="' + url + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  var STREAMS = [
    { label: 'Service & Support', levels: ['S1', 'S2', 'S3', 'S4'] },
    { label: 'Individual Contributor', levels: ['IC1', 'IC2', 'IC3', 'IC4', 'IC5'] },
    { label: 'Project Management', levels: ['PM1', 'PM2', 'PM3', 'PM4', 'PM5'] },
    { label: 'Management', levels: ['M1', 'M2', 'M3', 'M4', 'M5'] },
    { label: 'Executive', levels: ['E1', 'E2', 'E3'] }
  ];

  var DATA = null;
  var ORACLE = { prefix: '', skills: {} };
  var LIB = [];   /* [[name, category, subcategory, type, definition], ...] */
  /* Job roles from the Oracle org-structure export. Staff know their job title, not their
     sub-family, so every picker searches these and resolves to {s: sub-family, l: level}.
     s is null for roles the framework has not profiled yet (Executive, Temporary Services). */
  var JOBROLES = [];
  var JOBROLES_BUILT = '';

  Promise.all([
    fetch('assets/data/sbja.json').then(function (r) { return r.json(); }),
    fetch('assets/data/oracle_courses.json').then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch('assets/data/jobroles.json').then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch('assets/data/library.json').then(function (r) { return r.json(); }).catch(function () { return []; })
  ]).then(function (res) {
    DATA = res[0];
    if (res[1]) ORACLE = res[1];
    JOBROLES = (res[2] && res[2].roles) || [];
    JOBROLES_BUILT = (res[2] && res[2].built) || '';
    LIB = res[3] || [];
    init();
    initSkillsFirst();
    initDevelop();
    initMyRole();
  }).catch(function () {
    document.getElementById('from-panel').innerHTML =
      '<p class="rolepanel__empty">The skills data could not be loaded. Refresh to try again.</p>';
  });

  function oracleCoursesFor(skillName) {
    return ORACLE.skills[skillName] || [];
  }

  /* Engagement events for the FY27 measure ("staff reached, engagement monitored").
     Vercel Analytics custom events — counts only, never a job title or anything that could
     identify a person. Silent no-op when analytics is not loaded. */
  function track(name, props) {
    try { if (typeof window.va === 'function') window.va('event', { name: name, data: props || {} }); } catch (e) {}
  }

  /* ---------- Setup ---------- */
  var fromSel = document.getElementById('from-select');
  var toSel = document.getElementById('to-select');

  function init() {
    var byFamily = {};
    Object.keys(DATA.roles).forEach(function (key) {
      var fam = DATA.roles[key].family;
      (byFamily[fam] = byFamily[fam] || []).push(key);
    });
    Object.keys(byFamily).sort().forEach(function (fam) {
      [fromSel, toSel].forEach(function (sel) {
        var og = document.createElement('optgroup');
        og.label = fam;
        byFamily[fam].sort().forEach(function (key) {
          var o = document.createElement('option');
          o.value = key; o.textContent = key;
          og.appendChild(o);
        });
        sel.appendChild(og);
      });
    });

    // Linear progression: same role, next level up.
    var upGroup = document.createElement('optgroup');
    upGroup.label = 'Move up';
    var upOpt = document.createElement('option');
    upOpt.value = '__up__';
    upOpt.textContent = '\u2B06 My current role, one level up';
    upGroup.appendChild(upOpt);
    toSel.insertBefore(upGroup, toSel.children[1]);

    fromSel.addEventListener('change', function () { syncLevelPicker(); update(); });
    toSel.addEventListener('change', function () { syncLevelPicker(); update(); });
    document.getElementById('level-select').addEventListener('change', update);

    // Restore a shared link: #from=Dining%20Services&to=Network%20Support
    var params = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (params.get('from') && DATA.roles[params.get('from')]) fromSel.value = params.get('from');
    if (params.get('to') && DATA.roles[params.get('to')]) toSel.value = params.get('to');
    if (fromSel.value || toSel.value) update();
  }

  var LEVEL_ORDER = ['S1','S2','S3','S4','IC1','IC2','IC3','IC4','IC5','PM1','PM2','PM3','PM4','PM5','M1','M2','M3','M4','M5','E1','E2','E3'];
  function streamOf(level) {
    for (var i = 0; i < STREAMS.length; i++) if (STREAMS[i].levels.indexOf(level) >= 0) return STREAMS[i];
    return null;
  }
  function roleLevels(role) {
    var present = {};
    role.skills.forEach(function (s) {
      if (s.prof) Object.keys(s.prof).forEach(function (k) { present[k] = true; });
    });
    return LEVEL_ORDER.filter(function (l) { return present[l]; });
  }
  function nextLevelUp(role, level) {
    var stream = streamOf(level);
    if (!stream) return null;
    var levels = roleLevels(role);
    var idx = stream.levels.indexOf(level);
    for (var i = idx + 1; i < stream.levels.length; i++) {
      if (levels.indexOf(stream.levels[i]) >= 0) return stream.levels[i];
    }
    return null;
  }
  function syncLevelPicker() {
    var wrap = document.getElementById('level-wrap');
    var sel = document.getElementById('level-select');
    var isUp = toSel.value === '__up__';
    wrap.hidden = !isUp;
    if (!isUp) return;
    var from = getFrom();
    var keep = sel.value;
    sel.innerHTML = '<option value="">Select your level\u2026</option>';
    if (!from || from === SKILLS_ROLE) return;
    roleLevels(from).forEach(function (l) {
      var o = document.createElement('option');
      var st = streamOf(l);
      o.value = l; o.textContent = l + ' \u00b7 ' + (st ? st.label : '');
      sel.appendChild(o);
    });
    if (keep) sel.value = keep;
  }

  /* Experience switcher: flip the whole workflow from either section. */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.pathswitch__btn');
    if (!b) return;
    if (b.dataset.path === 'roles') {
      enterRolesPath();
      document.getElementById('myrole').scrollIntoView({ behavior: 'smooth' });
    } else if (b.dataset.path === 'team') {
      enterTeamPath();
      document.getElementById('teamtool').scrollIntoView({ behavior: 'smooth' });
    } else {
      enterSkillsPath();
      document.getElementById('skillsfirst').scrollIntoView({ behavior: 'smooth' });
    }
    document.querySelectorAll('.pathswitch__btn').forEach(function (x) {
      x.classList.toggle('on', x.dataset.path === b.dataset.path);
    });
  });

  /* How-it-works copy follows the active experience. */
  var HOW_COPY = {
    roles: [
      ['Find your job title', 'Search the title on your offer letter \u2014 no need to know your job family or sub-family. Confirm your level and your skills load automatically.'],
      ['Rate yourself', 'Every skill shows the proficiency the framework expects of you. Set where you actually are, and choose the direction: this role, the next level, or a transfer.'],
      ['Get the plan', 'Your gaps become a printable plan: Oracle Learning links, curated resources and a step-by-step Oracle playbook.']
    ],
    skills: [
      ['Pick your skills', 'Choose up to 10 skills from the library \u2014 search or browse \u2014 up to 3 core competencies you really do well, and up to 5 in your own words.'],
      ['Meet your matches', 'We match your skills against every Vanderbilt role and surface your five best fits, showing what you already bring to each.'],
      ['Get the plan', 'Choose a match and get the same printable plan: phase checklists, Oracle Learning links, curated resources and the Oracle playbook.']
    ],
    team: [
      ['Find their job title', 'Search the person\u2019s job title \u2014 no names, ever. Confirm their level and every skill mapped to that role populates automatically.'],
      ['Rate and choose the direction', 'Skill by skill, set where they are and where they need to be \u2014 for the current role, the next level in the sub-family, or a transfer. Add your own development areas beyond the framework.'],
      ['Get the plan', 'Gaps become a printable development plan with Oracle Learning links. Add another person and keep going \u2014 each keeps their own ratings and plan.']
    ]
  };
  /* The whole page follows the chosen path, not just the three step cards: the
     how-it-works headline and lead, the switcher pills and where "Your plan" points. */
  var ACTIVE_PATH = 'roles';
  var HOW_HEAD = {
    roles: ['Three steps to <em>a destination</em>.',
      '<strong>This is the map. Oracle is the vehicle.</strong> Explore destinations and build your plan here. Then execute it in Oracle: your Talent Profile, development goals, courses and gigs all live there.'],
    skills: ['Three steps to <em>your best fit</em>.',
      '<strong>This is the map. Oracle is the vehicle.</strong> Start from what you do well, meet the roles that fit and build your plan here. Then execute it in Oracle: your Talent Profile, development goals, courses and gigs all live there.'],
    team: ['Three steps to <em>a stronger team</em>.',
      '<strong>This is the map. Oracle is the vehicle.</strong> Rate each person against their role and build their development plan here. Then they execute it in Oracle: Talent Profile, development goals, courses and gigs all live there.']
  };
  function applyHowCopy(path) {
    ACTIVE_PATH = path;
    var h2 = document.getElementById('how-h2'), lead = document.getElementById('how-lead');
    if (h2) h2.innerHTML = HOW_HEAD[path][0];
    if (lead) lead.innerHTML = HOW_HEAD[path][1];
    HOW_COPY[path].forEach(function (c, i) {
      var el = document.querySelector('[data-how="' + (i + 1) + '"]');
      if (!el) return;
      el.querySelector('h3').textContent = c[0];
      var ps = el.querySelectorAll('p');
      ps[ps.length - 1].textContent = c[1];
    });
    document.querySelectorAll('.pathswitch__btn').forEach(function (x) {
      x.classList.toggle('on', x.dataset.path === path);
    });
  }

  /* Nav "Your plan" goes to the active path's plan — or to where it will appear. */
  (function () {
    var link = document.querySelector('.nav__links a[href="#plan"]');
    if (!link) return;
    link.addEventListener('click', function (e) {
      var target;
      if (ACTIVE_PATH === 'roles') {
        target = document.getElementById('me-plan') ||
          (!document.getElementById('myrole').hidden && document.getElementById('myrole'));
      } else if (ACTIVE_PATH === 'team') {
        target = document.getElementById('mgr-plan') ||
          (!document.getElementById('teamtool').hidden && document.getElementById('teamtool'));
      } else {
        var plan = document.getElementById('plan');
        target = (!plan.hidden && plan) ||
          (!document.getElementById('skillsfirst').hidden && document.getElementById('skillsfirst'));
      }
      e.preventDefault();
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      else openPathChooser();
    });
  })();

  /* Either/or paths: one workflow per visit unless the user starts over.
     #explore (the two-role comparison) is now reached only from a skills-first match. */
  function showOnly(id) {
    ['myrole', 'skillsfirst', 'teamtool'].forEach(function (s) {
      document.getElementById(s).hidden = s !== id;
    });
    document.getElementById('explore').hidden = true;
    document.getElementById('plan').hidden = true;
  }
  function enterRolesPath() {
    applyHowCopy('roles');
    track('path_chosen', { path: 'my_role' });
    showOnly('myrole');
    document.getElementById('mode-banner').hidden = true;
    document.getElementById('explore').classList.remove('skillsmode');
    if (fromSel.value === '__skills__') { fromSel.value = ''; toSel.value = ''; if (DATA) update(); }
  }
  function enterSkillsPath() {
    applyHowCopy('skills');
    track('path_chosen', { path: 'my_skills' });
    showOnly('skillsfirst');
    if (fromSel.value || toSel.value) { fromSel.value = ''; toSel.value = ''; if (DATA) update(); }
  }
  function enterTeamPath() {
    applyHowCopy('team');
    track('path_chosen', { path: 'my_team' });
    showOnly('teamtool');
    if (fromSel.value || toSel.value) { fromSel.value = ''; toSel.value = ''; if (DATA) update(); }
  }

  /* Skills-first synthetic origin role, built from the user's selections. */
  var SKILLS_ROLE = null;
  function getFrom() {
    if (fromSel.value === '__skills__') return SKILLS_ROLE;
    return DATA.roles[fromSel.value] || null;
  }

  function update() {
    var from = getFrom();
    var to = DATA.roles[toSel.value] || null;

    if (toSel.value === '__up__') {
      document.getElementById('from-family').textContent = from && from.family ? 'Job family: ' + from.family : '';
      document.getElementById('to-family').textContent = 'Same role \u00b7 one level up';
      renderRolePanel(document.getElementById('from-panel'), from, 'Choose your current role to see its skill profile.');
      var lvl = document.getElementById('level-select').value;
      renderLevelUp(from, lvl);
      return;
    }

    document.getElementById('from-family').textContent = from ? 'Job family: ' + from.family : '';
    document.getElementById('to-family').textContent = to ? 'Job family: ' + to.family : '';

    renderRolePanel(document.getElementById('from-panel'), from, 'Choose your current role to see its skill profile.');
    renderRolePanel(document.getElementById('to-panel'), to, 'Choose a destination role to see what it takes.');
    renderCompare(from, to);
    renderPlan(from, to);

    var h = [];
    if (from) h.push('from=' + encodeURIComponent(fromSel.value));
    if (to) h.push('to=' + encodeURIComponent(toSel.value));
    history.replaceState(null, '', h.length ? '#' + h.join('&') : location.pathname);
  }

  /* ---------- Role panels ---------- */
  function renderRolePanel(panel, role, emptyMsg) {
    if (!role) {
      panel.innerHTML = '<p class="rolepanel__empty">' + emptyMsg + '</p>';
      return;
    }
    var groups = { Behavioral: [], Technical: [], Qualifications: [] };
    role.skills.forEach(function (s) { (groups[s.type] = groups[s.type] || []).push(s); });

    var html = '<p class="rolepanel__fam">' + esc(role.family) + '</p>' +
      '<h3>' + esc(role.subfamily) + '</h3>' +
      skillGroup('Core competencies', '4 universal · 3 leadership', DATA.core.map(function (c) {
        return pillBtn(c.name, 'pill--core', { kind: 'core' });
      }));

    Object.keys(groups).forEach(function (type) {
      if (!groups[type].length) return;
      html += skillGroup(type + ' skills', 'official framework', groups[type].map(function (s) {
        return pillBtn(s.skill, s.type === 'Behavioral' ? 'pill--behav' : '', { kind: 'role', role: role.subfamily },
          profMeter(s.prof));
      }));
    });

    if (role.probable && role.probable.length) {
      html += skillGroup('Probable skills', 'AI-inferred, not official', role.probable.map(function (s) {
        return pillBtn(s.skill, 'pill--ai', { kind: 'ai', role: role.subfamily });
      }));
    }

    html += skillGroup('AI-enabled work', 'universal, develop for every role', [
      pillBtn(AI_READINESS.skill, 'pill--univ', { kind: 'univ' })
    ]);
    panel.innerHTML = html;
  }

  function skillGroup(label, hint, pills) {
    return '<div class="skillgroup"><p class="skillgroup__label">' + esc(label) +
      ' <span class="hint">&middot; ' + esc(hint) + '</span></p><ul class="pills">' +
      pills.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  }

  function pillBtn(name, cls, data, extra) {
    return '<button type="button" class="pill ' + cls + '" data-skill="' + esc(name) +
      '" data-kind="' + data.kind + '"' + (data.role ? ' data-role="' + esc(data.role) + '"' : '') + '>' +
      esc(name) + (extra || '') + '</button>';
  }

  /* ---------- "I already have this" (self-claimed destination skills) ---------- */
  var OWNED = {};
  function pairKey() { return fromSel.value + '→' + toSel.value; }
  function ownedSet() { return OWNED[pairKey()] = OWNED[pairKey()] || {}; }
  document.addEventListener('change', function (e) {
    if (e.target.classList && e.target.classList.contains('ownbox')) {
      var set = ownedSet();
      if (e.target.checked) set[e.target.dataset.skill] = true;
      else delete set[e.target.dataset.skill];
      update();
    }
  });

  /* ---------- Matching ---------- */
  function analyze(from, to) {
    var fromByName = {}, fromBySub = {}, fromByCat = {};
    from.skills.forEach(function (s) {
      fromByName[s.skill] = s;
      if (s.subcategory) (fromBySub[s.subcategory] = fromBySub[s.subcategory] || []).push(s);
      if (s.category) (fromByCat[s.category] = fromByCat[s.category] || []).push(s);
    });
    var probable = {};
    (from.probable || []).forEach(function (p) { probable[p.skill] = true; });
    var owned = ownedSet();

    var matches = [], bridges = [], growth = [], score = 0;
    to.skills.forEach(function (s) {
      if (owned[s.skill]) {
        matches.push(s); score += 1;
      } else if (fromByName[s.skill]) {
        matches.push(s); score += 1;
      } else if (s.subcategory && fromBySub[s.subcategory]) {
        bridges.push({ skill: s, via: fromBySub[s.subcategory][0].skill, strength: 'strong' });
        score += 0.55;
      } else if (s.category && fromByCat[s.category]) {
        bridges.push({ skill: s, via: fromByCat[s.category][0].skill, strength: 'adjacent' });
        score += 0.3;
      } else {
        growth.push(s);
        if (probable[s.skill]) score += 0.2;
      }
    });
    // Core competencies always carry; they anchor the floor of the score.
    var pct = Math.round(20 + 80 * (score / Math.max(to.skills.length, 1)));
    return { matches: matches, bridges: bridges, growth: growth, probable: probable,
             owned: owned, pct: Math.min(pct, 98) };
  }

  /* ---------- Comparison ---------- */
  function renderCompare(from, to) {
    var box = document.getElementById('compare');
    if (!from || !to) { box.hidden = true; box.innerHTML = ''; return; }
    if (from === to) {
      box.hidden = false;
      box.innerHTML = '<p class="bucket__none">That’s the role you’re already in. Pick a different destination.</p>';
      return;
    }
    var a = analyze(from, to);

    var html =
      '<div class="readiness" data-pct="' + a.pct + '">' +
        '<div><p class="readiness__num">' + a.pct + '<small>%</small></p>' +
        '<span class="readiness__label">Transfer readiness</span></div>' +
        '<div class="readiness__barwrap"><div class="readiness__bar"><div class="readiness__fill"></div></div>' +
        '<p class="readiness__note">All seven core competencies travel with you' +
        (a.matches.length ? ', plus ' + a.matches.length + ' matched skill' + plural(a.matches.length) : '') +
        (a.bridges.length ? (a.matches.length ? ' and ' : ', plus ') + a.bridges.length + ' bridge skill' + plural(a.bridges.length) : '') +
        ' toward <strong>' + esc(to.subfamily) + '</strong>. ' +
        (a.growth.length ? a.growth.length + ' skill' + plural(a.growth.length) + ' to grow.' :
          'No brand-new skills required. Deepen and certify what you have.') +
        '</p></div></div>' +

      '<p class="ownhint">Already have some of the destination skills from an earlier job, a degree or life outside work? <b>Tick “I have this”</b>. Readiness and the plan update instantly, and adding those skills to your ' + oa('Talent Profile', ORA.talent) + ' becomes your first Oracle step.</p>' +

      '<div class="buckets">' +
        bucket('bucket--match', 'Skills that carry', 'You already have these', listMatches(a, from)) +
        bucket('bucket--bridge', 'Bridge skills', 'A near neighbor in your current role', listBridges(a)) +
        bucket('bucket--grow', 'Skills to grow', 'New ground, covered by the plan', listGrowth(a)) +
      '</div>';

    box.hidden = false;
    box.innerHTML = html;
    requestAnimationFrame(function () {
      var fill = box.querySelector('.readiness__fill');
      if (fill) fill.style.width = a.pct + '%';
    });
  }

  function bucket(cls, title, sub, items) {
    return '<div class="bucket ' + cls + '"><h4>' + title + '</h4><p class="bucket__sub">' + sub + '</p>' +
      (items || '<p class="bucket__none">None yet.</p>') + '</div>';
  }

  function ownToggle(skillName, checked) {
    return '<label class="own"><input type="checkbox" class="ownbox" data-skill="' + esc(skillName) + '"' +
      (checked ? ' checked' : '') + '><span>I have this</span></label>';
  }

  function listMatches(a, from) {
    var rows = DATA.core.map(function (c) {
      return '<li>' + pillBtn(c.name, 'pill--core', { kind: 'core' }) + '</li>';
    }).concat(a.matches.map(function (s) {
      var mine = a.owned[s.skill];
      return '<li>' + pillBtn(s.skill, 'pill--core', { kind: 'role', role: mine ? toSel.value : from.subfamily }) +
        (mine ? '<span class="via">marked by you · ' + ownToggle(s.skill, true) + '</span>' : '') + '</li>';
    }));
    return '<ul class="pills pills--matches">' + rows.join('') + '</ul>';
  }

  function listBridges(a) {
    if (!a.bridges.length) return null;
    return '<ul>' + a.bridges.map(function (b) {
      return '<li><button type="button" class="skill-link" data-skill="' + esc(b.skill.skill) +
        '" data-kind="role" data-role="' + esc(toSel.value) + '">' + esc(b.skill.skill) + '</button>' +
        ownToggle(b.skill.skill, false) +
        '<span class="via">' + (b.strength === 'strong' ? 'close to' : 'adjacent to') +
        ' your <b>' + esc(b.via) + '</b></span></li>';
    }).join('') + '</ul>';
  }

  function listGrowth(a) {
    var rows = a.growth.map(function (s) {
      var hint = a.probable[s.skill] ? '<span class="aihint">AI: likely already forming</span>' : '';
      return '<li><button type="button" class="skill-link" data-skill="' + esc(s.skill) +
        '" data-kind="role" data-role="' + esc(toSel.value) + '">' + esc(s.skill) + '</button>' + hint +
        ownToggle(s.skill, false) + '</li>';
    });
    rows.push('<li><button type="button" class="skill-link" data-skill="' + esc(AI_READINESS.skill) +
      '" data-kind="univ">' + esc(AI_READINESS.skill) + '</button>' +
      '<span class="aihint">Universal · every role</span></li>');
    return '<ul>' + rows.join('') + '</ul>';
  }

  /* ---------- Level-up: same role, next level ---------- */
  function levelAnalyze(role, cur, nxt) {
    var steady = [], deepen = [], fresh = [];
    role.skills.forEach(function (s) {
      var a1 = s.prof && s.prof[cur] ? (PROF_ORDER[s.prof[cur]] || 0) : 0;
      var b1 = s.prof && s.prof[nxt] ? (PROF_ORDER[s.prof[nxt]] || 0) : 0;
      if (!b1) { if (a1) steady.push(s); return; }
      if (!a1) fresh.push({ skill: s, to: s.prof[nxt] });
      else if (b1 > a1) deepen.push({ skill: s, from: s.prof[cur], to: s.prof[nxt] });
      else steady.push(s);
    });
    var total = steady.length + deepen.length + fresh.length;
    var pct = Math.round(20 + 80 * (steady.length / Math.max(total, 1)));
    return { steady: steady, deepen: deepen, fresh: fresh, pct: Math.min(pct, 98) };
  }

  function renderLevelUp(role, lvl) {
    var box = document.getElementById('compare');
    var body = document.getElementById('plan-body');
    var title = document.getElementById('plan-title');
    document.getElementById('to-panel').innerHTML =
      '<p class="rolepanel__empty">' + (role ? 'Pick your current level on the left picker to see the step up.' :
      'Choose your current role first, then your level.') + '</p>';
    if (!role || !lvl) {
      box.hidden = true; box.innerHTML = '';
      title.innerHTML = 'A clear path, <em>phase by phase</em>.';
      body.innerHTML = '<p class="plan__empty">Choose your role and current level and your step-up plan will build itself here.</p>';
      return;
    }
    var nxt = nextLevelUp(role, lvl);
    if (!nxt) {
      box.hidden = false;
      box.innerHTML = '<p class="bucket__none">You\u2019re at the top of this track for ' + esc(role.subfamily) +
        '. Explore a destination role instead \u2014 or talk with your manager about the next stream.</p>';
      title.innerHTML = 'A clear path, <em>phase by phase</em>.';
      body.innerHTML = '<p class="plan__empty">No higher level is mapped for this role in this track.</p>';
      return;
    }
    var la = levelAnalyze(role, lvl, nxt);
    document.getElementById('to-panel').innerHTML =
      '<p class="rolepanel__fam">' + esc(role.family) + '</p><h3>' + esc(role.subfamily) +
      ' \u00b7 ' + esc(nxt) + '</h3><p class="rolepanel__empty">The same role, one level up: ' +
      la.deepen.length + ' skill' + plural(la.deepen.length) + ' to deepen and ' +
      la.fresh.length + ' new expectation' + plural(la.fresh.length) + ' at ' + esc(nxt) + '.</p>';

    box.hidden = false;
    box.innerHTML =
      '<div class="readiness" data-pct="' + la.pct + '">' +
        '<div><p class="readiness__num">' + la.pct + '<small>%</small></p>' +
        '<span class="readiness__label">Step-up readiness</span></div>' +
        '<div class="readiness__barwrap"><div class="readiness__bar"><div class="readiness__fill"></div></div>' +
        '<p class="readiness__note">From <b>' + esc(lvl) + '</b> to <b>' + esc(nxt) + '</b> in ' +
        esc(role.subfamily) + ': ' + la.steady.length + ' skill' + plural(la.steady.length) +
        ' hold steady, ' + la.deepen.length + ' deepen' + (la.fresh.length ? ' and ' +
        la.fresh.length + ' new expectation' + plural(la.fresh.length) + ' appear' : '') + '.</p></div></div>' +
      '<div class="buckets">' +
        bucket('bucket--match', 'Holds steady', 'Same expected proficiency at ' + esc(nxt),
          la.steady.length ? '<ul class="pills pills--matches">' + la.steady.map(function (s) {
            return '<li>' + pillBtn(s.skill, 'pill--core', { kind: 'role', role: role.subfamily }) + '</li>';
          }).join('') + '</ul>' : null) +
        bucket('bucket--bridge', 'Deepen', 'The bar rises at ' + esc(nxt), la.deepen.length ?
          '<ul>' + la.deepen.map(function (d) {
            return '<li><button type="button" class="skill-link" data-skill="' + esc(d.skill.skill) +
              '" data-kind="role" data-role="' + esc(role.subfamily) + '">' + esc(d.skill.skill) +
              '</button><span class="via">' + esc(d.from) + ' \u2192 <b>' + esc(d.to) + '</b></span></li>';
          }).join('') + '</ul>' : null) +
        bucket('bucket--grow', 'New at ' + esc(nxt), 'Expectations that first appear at this level', la.fresh.length ?
          '<ul>' + la.fresh.map(function (d) {
            return '<li><button type="button" class="skill-link" data-skill="' + esc(d.skill.skill) +
              '" data-kind="role" data-role="' + esc(role.subfamily) + '">' + esc(d.skill.skill) +
              '</button><span class="via">expected: <b>' + esc(d.to) + '</b></span></li>';
          }).join('') + '</ul>' : null) +
      '</div>';
    requestAnimationFrame(function () {
      var fill = box.querySelector('.readiness__fill');
      if (fill) fill.style.width = la.pct + '%';
    });

    /* Step-up plan */
    title.innerHTML = esc(role.subfamily) + ': ' + esc(lvl) + ' <em class="gold-text">&rarr;</em> ' + esc(nxt);
    var targets = [{ skill: AI_READINESS, tag: 'universal' }]
      .concat(la.deepen.map(function (d) { return { skill: d.skill, tag: 'deepen', via: d.from + ' \u2192 ' + d.to }; }))
      .concat(la.fresh.map(function (d) { return { skill: d.skill, tag: 'newlevel', via: d.to }; }));
    var months = targets.length > 6 ? 9 : 6;
    var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    LEVEL_CTX = { role: role.subfamily, lvl: lvl, nxt: nxt };

    body.innerHTML =
      '<div class="plandoc">' +
      '<div class="plandoc__head">' +
        '<div class="plandoc__meta">' +
          metaCell('Staff member', '<span class="fillin"></span>') +
          metaCell('Role', esc(role.subfamily) + ' <small>(' + esc(role.family) + ')</small>') +
          metaCell('Step up', esc(lvl) + ' &rarr; ' + esc(nxt)) +
          metaCell('Step-up readiness', la.pct + '%') +
          metaCell('Plan horizon', months + ' months') +
          metaCell('Created', esc(today) + ' &middot; Manager review: <span class="fillin fillin--sm"></span>') +
        '</div>' +
        '<p class="plandoc__summary">This is linear progression: the same role, held to a higher bar. ' +
        la.steady.length + ' of your skills already meet the ' + esc(nxt) + ' expectation. This plan deepens ' +
        la.deepen.length + ' skill' + plural(la.deepen.length) +
        (la.fresh.length ? ', builds ' + la.fresh.length + ' new expectation' + plural(la.fresh.length) : '') +
        ' and completes AI Workforce Readiness. <b>Level moves are earned in place</b>: they run through your manager, your performance record and Vanderbilt\u2019s compensation and promotion processes.</p>' +
      '</div>' +
      '<div class="phases">' +
        phase('01', 'Align with your manager', 'Weeks 1\u20134', [
          ck('<b>Meet with your manager</b>: share this plan, confirm what ' + esc(nxt) + ' looks like in your team and agree the timeline.'),
          ck('Open your ' + oa('Talent Profile', ORA.talent) + ' and record your current skills at honest proficiency.'),
          ck('Create one development goal per row of the table below in ' + oa('Oracle Grow', ORA.grow) + '.'),
          ck('Ask which ' + esc(nxt) + '-level responsibilities you can begin taking on now.')
        ]) +
        phase('02', 'Deepen the skills', 'Months 2\u2013' + (months - 2), [
          ck('Work the table top to bottom \u2014 each row lists the proficiency jump it needs.'),
          ck('Complete <b>AI Workforce Readiness</b> first: it compounds everything else.'),
          ck('Volunteer for stretch work that exercises each deepening skill at the ' + esc(nxt) + ' bar.'),
          ck('<b>Monthly manager check-in</b>: review the table; update goal status in Oracle.')
        ]) +
        phase('03', 'Perform at the next level', 'Months ' + (months - 2) + '\u2013' + months, [
          ck('Deliver at the ' + esc(nxt) + ' bar visibly: lead a piece of work that proves the deepened skills.'),
          ck('Update your ' + oa('Talent Profile', ORA.talent) + ' with every completed course and skill.'),
          ck('<b>Review conversation</b>: walk your manager through the evidence, skill by skill.'),
          ck('Engage your <b>Engagement Consultant / HCM partner</b> on the formal step: level changes follow Vanderbilt\u2019s promotion and compensation processes.')
        ]) +
      '</div>' +
      '<div class="learnlist">' +
        '<h3>Skill development table</h3>' +
        '<p>Ordered by priority: AI Workforce Readiness first, then the skills whose bar rises at ' + esc(nxt) + '.</p>' +
        '<div class="tablewrap"><table class="learntable">' +
          '<thead><tr><th class="lt-done">Done</th><th class="lt-pri">#</th><th>Skill</th><th>Why</th>' +
          '<th>Oracle Learning</th><th class="lt-date">Target date</th></tr></thead>' +
          '<tbody>' + targets.map(function (t, i) { return learnRowFor(t, i, role.subfamily); }).join('') + '</tbody>' +
        '</table></div>' +
      '</div>' +
      skillResources(targets) +
      '<div class="plandoc__note">' +
        '<p class="plandoc__note-label">A note on outcomes</p>' +
        '<p>This plan is a development roadmap, not a promise of promotion. Level changes depend on demonstrated performance, business need and Vanderbilt\u2019s standard review processes. What the work guarantees: the deepened skills are yours, in this role and every role after it.</p>' +
      '</div>' +
      '<div class="plan__actions"><button type="button" class="btn" id="print-plan">Print this plan</button></div>' +
      '</div>';
    var printBtn = document.getElementById('print-plan');
    if (printBtn) printBtn.addEventListener('click', function () { print(); });
  }
  var LEVEL_CTX = null;

  /* ---------- Learning & Development Plan (printable document) ---------- */
  function renderPlan(from, to) {
    var body = document.getElementById('plan-body');
    var title = document.getElementById('plan-title');
    if (!from || !to || from === to) {
      title.innerHTML = 'A clear path, <em>phase by phase</em>.';
      body.innerHTML = '<p class="plan__empty">Select both roles above and your Learning &amp; Development Plan will build itself here.</p>';
      return;
    }
    var a = analyze(from, to);
    title.innerHTML = esc(from.subfamily) + ' <em class="gold-text">&rarr;</em> ' + esc(to.subfamily);

    // Learning table rows: universal AI readiness first, then bridges (easier wins), then growth.
    var learnTargets = [{ skill: AI_READINESS, tag: 'universal' }]
      .concat(a.bridges.map(function (b) { return { skill: b.skill, tag: 'bridge', via: b.via }; }))
      .concat(a.growth.map(function (s) { return { skill: s, tag: 'grow', ai: a.probable[s.skill] }; }));

    var months = a.growth.length > 5 ? 12 : a.growth.length > 2 ? 9 : 6;
    var matchedNames = a.matches.slice(0, 4).map(function (s) { return '<b>' + esc(s.skill) + '</b>'; }).join(', ');
    var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    body.innerHTML =
      '<div class="plandoc">' +

      /* --- Document header --- */
      '<div class="plandoc__head">' +
        '<div class="plandoc__meta">' +
          metaCell('Staff member', '<span class="fillin"></span>') +
          metaCell('Current role', esc(from.subfamily) + ' <small>(' + esc(from.family) + ')</small>') +
          metaCell('Destination role', esc(to.subfamily) + ' <small>(' + esc(to.family) + ')</small>') +
          metaCell('Transfer readiness', a.pct + '%') +
          metaCell('Plan horizon', months + ' months') +
          metaCell('Created', esc(today) + ' &middot; Manager review: <span class="fillin fillin--sm"></span>') +
        '</div>' +
        '<p class="plandoc__summary">You carry all seven core competencies' +
        (a.matches.length ? ' plus ' + a.matches.length + ' matched skill' + plural(a.matches.length) +
          (matchedNames ? ' (' + matchedNames + ')' : '') : ' into this pathway') +
        '. This plan closes ' + (a.bridges.length + a.growth.length + 1) + ' development areas in three phases with Oracle checkpoints: ' +
        a.bridges.length + ' bridge skill' + plural(a.bridges.length) + ', ' + a.growth.length +
        ' new skill' + plural(a.growth.length) + ' and AI Workforce Readiness (universal). <b>This plan is yours to drive.</b> Managers, Engagement Consultants and this tool guide the way; you own the work. It builds real readiness, and selection still runs through Vanderbilt\u2019s normal hiring process.</p>' +
      '</div>' +

      /* --- Phase checklists --- */
      '<div class="phases">' +
        phase('01', 'Align & set up in Oracle', 'Weeks 1–4', [
          ck('<b>Meet with your manager</b>: share this printed plan, agree on the destination and timeline and add it to your development conversation notes. Be open about your goal. Developing talent across Vanderbilt is part of every manager\u2019s job.'),
          ck('Open your ' + oa('Talent Profile', ORA.talent) + '. Add your current skills with honest proficiency: matched, bridge, skills marked “I have this” and probable skills you genuinely have.'),
          ck('In ' + oa('Oracle Grow', ORA.grow) + ', add <b>' + esc(to.subfamily) + '</b> as a career/role of interest so recommendations start pointing at this destination.'),
          ck('In the ' + oa('Skills Center', ORA.skills) + ', review the AI-suggested skills for your profile and accept the ones that fit.'),
          ck('Create one <b>development goal per skill</b> in the table below, tagged to your role of interest.'),
          ck('Serious about the move? Say so in your ' + oa('Talent Profile', ORA.talent) + ': indicate your interest in a new role and the timeframe you are targeting, so your manager and recruiters can see it.'),
          ck('Reach out to someone in ' + esc(to.subfamily) + ' (' + esc(to.family) + ') for an informal conversation about the work. That contact becomes your shadow host in phase 3.')
        ]) +
        phase('02', 'Build the skills', 'Months 2–' + (months === 6 ? 4 : months - 3), [
          ck('Work the development table top to bottom, one skill at a time, starting from the <b>Oracle Learning</b> links.'),
          ck('Complete <b>AI Workforce Readiness</b> first: it compounds every other skill you build.'),
          ck('Pick one certification from the <b>skill resources</b> below and set a completion date with your manager.'),
          ck('Learning outside Oracle (podcasts, videos, certifications)? <b>Flag it in ' + oa('Oracle Grow', ORA.grow) + '</b>: add it to that skill’s development goal so it counts in your talent record.'),
          ck('Practice in place: volunteer for one task in your current role that uses a destination skill.'),
          ck('<b>Monthly manager check-in</b>: review progress against this table; update goal status in Oracle so the record travels with you.'),
          ck('If progress stalls or the pathway needs formal support, engage your <b>Engagement Consultant / HCM partner</b> to help broker cross-department options.')
        ]) +
        phase('03', 'Prove it & land it', 'Months ' + (months === 6 ? 4 : months - 3) + '–' + months, [
          ck('Take one gig or short assignment with the ' + esc(to.family) + ' team from the <b>Gigs</b> section in Oracle.'),
          ck('Shadow your phase 1 contact for a day; debrief what surprised you.'),
          ck('Watch the ' + oa('Opportunity Marketplace', ORA.market) + ' for open requisitions in ' + esc(to.subfamily) + '.'),
          ck('Update your ' + oa('Talent Profile', ORA.talent) + ' with every completed course and new skill so recruiters and Grow can see it.'),
          ck('Refresh your résumé in skills language. Lead with matched and newly built skills. <button type="button" class="olink eg-resume">See an example</button>'),
          ck('<b>Final manager conversation</b>: confirm readiness; loop in your Engagement Consultant / HCM partner on internal openings.'),
          ck('Apply through Vanderbilt’s internal mobility process with your portfolio of completions.')
        ]) +
        (fromSel.value === '__skills__' && SF_LEADER ?
          phase('04', 'Develop as a people leader', 'Alongside every phase', [
            ck('Your core strengths point to leadership, and you don\u2019t manage people today. Treat people leadership as a skill to build deliberately, not a title to wait for.'),
            ck('Tell your manager leadership is part of your goal; ask for chances to lead work: a project, a process, an onboarding buddy role.'),
            ck('Build the three leadership competencies in your ' + oa('Talent Profile', ORA.talent) + ': leading and inspiring teams, University strategy, effective and ethical decisions.'),
            ck('In ' + oa('Oracle Learning', ORA.grow) + ', search for people-leadership fundamentals (feedback, delegation, difficult conversations) and enroll in one course now.'),
            ck('When manager openings appear in the ' + oa('Opportunity Marketplace', ORA.market) + ', you\u2019ll have evidence, not just interest.')
          ]) : '') +
      '</div>' +

      /* --- Skill development table --- */
      '<div class="learnlist">' +
        '<h3>Skill development table</h3>' +
        '<p>Ordered by priority: AI Workforce Readiness first (universal), then bridge skills (fastest wins), then new skills. For every row: enroll from its Oracle Learning links, create a development goal in ' + oa('Oracle Grow', ORA.grow) + ' tagged to your role of interest, and add the skill to your ' + oa('Talent Profile', ORA.talent) + ' once built.</p>' +
        '<div class="tablewrap"><table class="learntable">' +
          '<thead><tr><th class="lt-done">Done</th><th class="lt-pri">#</th><th>Skill</th><th>Why</th>' +
          '<th>Oracle Learning</th><th class="lt-date">Target date</th></tr></thead>' +
          '<tbody>' + learnTargets.map(learnRow).join('') + '</tbody>' +
        '</table></div>' +
      '</div>' +

      /* --- Skill resources (outside Oracle) --- */
      skillResources(learnTargets) +

      /* --- Oracle playbook --- */
      '<div class="oracle">' +
        '<h3>Your Oracle playbook</h3>' +
        '<p>Everything above, as a single tour through Oracle. Do steps 1–5 in week one; the rest run through the plan. New to Grow, Oracle Learning, or the Talent Marketplace? Start with Vanderbilt’s <a class="oracle__help" href="https://www.vanderbilt.edu/pcb/talent-marketplace/" target="_blank" rel="noopener">Talent Marketplace resource page</a>.</p>' +
        '<ol class="oracle__steps">' +
          oStep('Tag your skills', 'Open your ' + oa('Talent Profile', ORA.talent) + ' and add current skills with proficiency (matched, bridge, and real probable skills). This feeds every recommendation Oracle makes. See your full skill picture in the ' + oa('Skills Center', ORA.skills) + '.') +
          oStep('Open Oracle Grow', 'Open ' + oa('Oracle Grow', ORA.grow) + ': it builds a personalized page from your role + skills. Review its suggested skills (Dynamic Skills AI) and accept what fits.') +
          oStep('Declare your destination', 'In ' + oa('Oracle Grow', ORA.grow) + ', add <b>' + esc(to.subfamily) + '</b> as a career or role of interest. In your ' + oa('Talent Profile', ORA.talent) + ', record your interest in moving and your target timeframe. Grow then surfaces the gap between your profile and that role.') +
          oStep('Create development goals', 'One goal per row of the table, tagged to your role of interest, so progress is visible to you and your manager.') +
          oStep('Enroll in Oracle Learning', 'The table deep-links to matched courses. Enroll from there. For anything not linked, open Me &rarr; <b>Learning</b>, search the skill, and consider <b>learning journeys</b> and communities.') +
          oStep('Gigs and open roles', 'Take gigs and short assignments from the <b>Gigs</b> section for real practice and visibility with the ' + esc(to.family) + ' team. Watch the ' + oa('Opportunity Marketplace', ORA.market) + ' for open requisitions.') +
          oStep('Keep the loop with people', 'Monthly manager check-ins against this plan; engage your <b>Engagement Consultant / HCM partner</b> when you need cross-department doors opened. Consider a mentor via Connections.') +
          oStep('Close the loop', 'Completed learning updates your ' + oa('Talent Profile', ORA.talent) + ' (verify: some courses update it automatically). Re-run this tool as your profile grows and watch readiness climb.') +
        '</ol>' +
      '</div>' +

      '<div class="plandoc__note">' +
        '<p class="plandoc__note-label">A note on outcomes</p>' +
        '<p>This plan is a development roadmap, not a promise of placement. Completing it, every course, goal and gig, builds real readiness for <b>' + esc(to.subfamily) +
        '</b>, but it does not guarantee selection for, or transfer into, that role. Internal openings are filled through Vanderbilt’s standard recruitment process, and selection depends on position availability, business needs, qualifications and the strength of the applicant pool at the time you apply.</p>' +
        '<p>What this work does guarantee: the skills are yours. They strengthen your performance in your current role, enrich your Talent Profile and make you a stronger candidate for this role and many others across the University, whenever the right opening appears.</p>' +
      '</div>' +

      '<div class="plan__actions">' +
        '<button type="button" class="btn" id="print-plan">Print this plan</button>' +
      '</div>' +
      '</div>';

    var printBtn = document.getElementById('print-plan');
    if (printBtn) printBtn.addEventListener('click', function () { print(); });
  }

  function metaCell(label, value) {
    return '<div class="metacell"><span>' + label + '</span><b>' + value + '</b></div>';
  }

  function ck(text) {
    return '<span class="ckbox" aria-hidden="true"></span><span class="cktext">' + text + '</span>';
  }

  function phase(num, title, when, items) {
    return '<div class="phase"><p class="phase__num">' + num + '</p><h4>' + title + '</h4>' +
      '<p class="phase__when">' + when + '</p><ul class="cklist">' + items.map(function (i) {
        return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
  }

  function learnRow(t, i) { return learnRowFor(t, i, toSel.value); }
  function learnRowFor(t, i, roleKey) {
    var s = t.skill;

    var why = t.tag === 'universal' ? '<span class="lt-tag lt-tag--univ">Universal</span> assumed development need for every role' :
      t.tag === 'bridge' ? '<span class="lt-tag lt-tag--bridge">Bridge</span> near your <b>' + esc(t.via) + '</b>' :
      t.tag === 'deepen' ? '<span class="lt-tag lt-tag--bridge">Deepen</span> proficiency rises: <b>' + esc(t.via) + '</b>' :
      t.tag === 'newlevel' ? '<span class="lt-tag lt-tag--grow">New at this level</span> expected: <b>' + esc(t.via) + '</b>' :
      '<span class="lt-tag lt-tag--grow">New</span>' + (t.ai ? ' AI: likely already forming' : ' new ground for this pathway');

    var oc = oracleCoursesFor(s.skill);
    var learn = oc.length ?
      '<span class="lt-orc">' + oc.slice(0, 2).map(function (c) {
        return '<a href="' + ORACLE.prefix + c.id + '" target="_blank" rel="noopener">' + esc(c.n) + '</a>';
      }).join('') + '</span>' :
      '<span class="lt-none">Not in the Oracle catalog. Use the skill resources below and log the work in ' + oa('Oracle Grow', ORA.grow) + '.</span>';

    var dk = dateKey(s.skill);
    var dv = DATES[dk] || '';

    return '<tr>' +
      '<td class="lt-done"><span class="ckbox" aria-hidden="true"></span></td>' +
      '<td class="lt-pri">' + (i + 1) + '</td>' +
      '<td class="lt-skill"><button type="button" class="skill-link" data-skill="' + esc(s.skill) +
        '" data-kind="' + (s === AI_READINESS ? 'univ' : 'role') + '" data-role="' + esc(roleKey) + '">' +
        esc(s.skill) + '</button>' + profMeter(s.prof) +
        (profRange(s.prof) ? '<span class="lt-prof">Target: ' + profRange(s.prof) + '</span>' : '') + '</td>' +
      '<td class="lt-why" data-label="Why it\u2019s here">' + why + '</td>' +
      '<td class="lt-learn" data-label="Oracle Learning">' + learn + '</td>' +
      '<td class="lt-date" data-label="Target date"><input type="date" class="dateinput" data-datekey="' + esc(dk) + '"' +
        (dv ? ' value="' + esc(dv) + '"' : '') + ' aria-label="Target date for ' + esc(s.skill) + '"></td>' +
      '</tr>';
  }

  /* Skill resources: one card per skill category in the plan — direct links only. */
  function skillResources(learnTargets) {
    var seen = {}, cards = [];
    learnTargets.forEach(function (t) {
      var cat = t.skill.category;
      if (!RESOURCES[cat] || seen[cat]) return;
      seen[cat] = true;
      var forSkills = learnTargets.filter(function (x) { return x.skill.category === cat; })
        .map(function (x) { return esc(x.skill.skill); }).join(', ');
      cards.push('<div class="skillres__card"><h4>' + esc(cat) + '</h4>' +
        '<p class="skillres__for">For: ' + forSkills + '</p><ul>' +
        RESOURCES[cat].map(function (r) {
          return '<li><span class="restype restype--' + r[0].toLowerCase() + '">' + r[0] + '</span>' +
            '<a href="' + r[2] + '" target="_blank" rel="noopener">' + esc(r[1]) + '</a></li>';
        }).join('') + '</ul></div>');
    });
    if (!cards.length) return '';
    return '<div class="skillres"><h3>Skill resources beyond Oracle</h3>' +
      '<p>Named podcasts, channels, certifications and free professional resources for the skill areas in this plan. Direct links, no searching. These live <b>outside Oracle</b>: when you use one, flag it in ' + oa('Oracle Grow', ORA.grow) + ' by updating that skill’s development goal so the work shows in your talent record. <span class="fresh">Resources last reviewed July 2026 \u00b7 Oracle catalog: July 2026 export.</span></p>' +
      '<div class="skillres__grid">' + cards.join('') + '</div></div>';
  }

  /* Target dates survive re-renders and print. */
  var DATES = {};
  function dateKey(skill) {
    return fromSel.value + '→' + toSel.value + '→' + skill;
  }
  document.addEventListener('change', function (e) {
    if (e.target.classList && e.target.classList.contains('dateinput')) {
      DATES[e.target.dataset.datekey] = e.target.value;
    }
  });

  function oStep(title, text) {
    return '<li><b>' + title + '</b><span>' + text + '</span></li>';
  }

  /* ---------- Skill detail modal ---------- */
  var modal = document.getElementById('skill-modal');
  document.getElementById('modal-close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.eg-resume')) {
      document.getElementById('resume-modal').showModal();
      return;
    }
    var btn = e.target.closest('[data-skill]');
    if (!btn || !DATA) return;
    openSkill(btn.dataset.skill, btn.dataset.kind, btn.dataset.role);
  });
  var resumeModal = document.getElementById('resume-modal');
  document.getElementById('resume-close').addEventListener('click', function () { resumeModal.close(); });
  resumeModal.addEventListener('click', function (e) { if (e.target === resumeModal) resumeModal.close(); });

  function openSkill(name, kind, roleKey) {
    var type = '', cat = '', def = '', prof = null, isAI = false;
    if (kind === 'univ') {
      type = 'Universal skill · AI-enabled work';
      cat = AI_READINESS.category + ' › ' + AI_READINESS.subcategory;
      def = AI_READINESS.definition;
    } else if (kind === 'core') {
      var c = DATA.core.filter(function (x) { return x.name === name; })[0];
      if (!c) return;
      type = 'Core competency'; cat = c.applies; def = c.definition;
    } else {
      var role = DATA.roles[roleKey];
      if (!role && SKILLS_ROLE && roleKey === SKILLS_ROLE.subfamily) role = SKILLS_ROLE;
      if (!role) return;
      var s = role.skills.filter(function (x) { return x.skill === name; })[0];
      if (!s && role.probable) {
        s = role.probable.filter(function (x) { return x.skill === name; })[0];
        isAI = true;
      }
      if (!s) return;
      type = s.type + (isAI ? ' · AI-inferred' : ' skill');
      cat = s.category + (s.subcategory ? ' › ' + s.subcategory : '');
      def = s.definition;
      prof = s.prof || null;
    }

    document.getElementById('modal-type').textContent = type;
    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-cat').textContent = cat;
    document.getElementById('modal-def').textContent = def || 'No definition recorded in the framework.';
    document.getElementById('modal-ai').hidden = !isAI;

    var learnBox = document.getElementById('modal-learn');
    var oc = oracleCoursesFor(name);
    if (oc.length) {
      learnBox.innerHTML = '<h4>Learn this in Oracle Learning</h4>' + oc.map(function (c) {
        return '<a href="' + ORACLE.prefix + c.id + '" target="_blank" rel="noopener">' + esc(c.n) + '</a>';
      }).join('');
      learnBox.hidden = false;
    } else {
      learnBox.hidden = true;
    }

    var profBox = document.getElementById('modal-prof');
    var profBody = document.getElementById('modal-prof-body');
    if (prof && Object.keys(prof).length) {
      profBody.innerHTML = STREAMS.map(function (st) {
        var chips = st.levels.filter(function (lv) { return prof[lv]; }).map(function (lv) {
          return '<span class="profchip"><b>' + lv + '</b> ' + esc(prof[lv]) + '</span>';
        });
        if (!chips.length) return '';
        return '<div class="profstream"><b>' + st.label + '</b><div class="profchips">' +
          chips.join('') + '</div></div>';
      }).join('');
      profBox.hidden = false;
    } else {
      profBox.hidden = true;
    }
    modal.showModal();
  }

  /* ---------- Skills-first: pick skills, match roles ---------- */
  var SF = { picked: [], core: [], typed: [], cat: '' };
  var LEAD_CORE = ['Leads and inspires teams', 'Develops and implements University strategy',
                   'Makes effective and ethical decisions for the University'];

  function libToSkill(row) {
    return { skill: row[0], category: row[1], subcategory: row[2], type: row[3] || 'Technical',
             definition: row[4] || '', prof: null };
  }
  function normTxt(t) { return String(t).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }

  function initSkillsFirst() {
    var search = document.getElementById('sf-search');
    var suggest = document.getElementById('sf-suggest');
    if (!search) return;

    /* core competency pills */
    var coreUl = document.getElementById('sf-core');
    coreUl.innerHTML = DATA.core.map(function (c) {
      return '<li><button type="button" class="pill pill--core sf-corepill" data-core="' + esc(c.name) + '">' +
        esc(c.name) + '</button></li>';
    }).join('');
    coreUl.addEventListener('click', function (e) {
      var b = e.target.closest('.sf-corepill');
      if (!b) return;
      var name = b.dataset.core;
      var i = SF.core.indexOf(name);
      if (i >= 0) SF.core.splice(i, 1);
      else if (SF.core.length < 3) SF.core.push(name);
      renderSF();
    });

    /* One search over the library, optionally narrowed to a category. With a category chosen
       and no query, the suggestions become a browse list for that category. */
    function drawSuggest() {
      var q = normTxt(search.value);
      var cat = SF.cat;
      if (q.length < 2 && !cat) { suggest.hidden = true; return; }
      var hits = [];
      for (var i = 0; i < LIB.length && hits.length < 40; i++) {
        var r = LIB[i];
        if (cat && r[1] !== cat) continue;
        if (q.length >= 2 && normTxt(r[0]).indexOf(q) < 0) continue;
        if (SF.picked.indexOf(r[0]) >= 0) continue;
        hits.push(r);
      }
      suggest.innerHTML = hits.length ? hits.slice(0, 20).map(function (r) {
        return '<button type="button" data-add="' + esc(r[0]) + '"><b>' + esc(r[0]) + '</b><span>' +
          esc(r[1]) + (r[2] ? ' \u203a ' + esc(r[2]) : '') + '</span></button>';
      }).join('') + (hits.length > 20 ? '<p>Keep typing to narrow ' + (hits.length - 20) + ' more.</p>' : '')
        : '<p>No matching skill. Add it in your own words below.</p>';
      suggest.hidden = false;
    }
    search.addEventListener('input', drawSuggest);
    search.addEventListener('focus', function () { if (SF.cat || normTxt(search.value).length >= 2) drawSuggest(); });
    document.addEventListener('click', function (e) {
      var addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        if (SF.picked.length < 10) SF.picked.push(addBtn.dataset.add);
        search.value = ''; suggest.hidden = true;
        renderSF();
        return;
      }
      if (!e.target.closest('.sf__search')) suggest.hidden = true;
      var rm = e.target.closest('[data-remove]');
      if (rm) {
        var kind = rm.dataset.removeKind, val = rm.dataset.remove;
        if (kind === 'picked') SF.picked = SF.picked.filter(function (x) { return x !== val; });
        if (kind === 'typed') SF.typed = SF.typed.filter(function (x) { return x.text !== val; });
        renderSF();
      }
    });

    var typedInput = document.getElementById('sf-typed-input');
    function addTyped() {
      var v = typedInput.value.trim();
      if (!v || SF.typed.length >= 5) return;
      var qn = normTxt(v), best = null, bestScore = 0;
      for (var i = 0; i < LIB.length; i++) {
        var n = normTxt(LIB[i][0]);
        if (n === qn) { best = LIB[i]; bestScore = 1; break; }
        if (n.indexOf(qn) >= 0 || qn.indexOf(n) >= 0) {
          var sc = Math.min(n.length, qn.length) / Math.max(n.length, qn.length);
          if (sc > bestScore) { bestScore = sc; best = LIB[i]; }
        }
      }
      SF.typed.push({ text: v, match: bestScore >= 0.45 && best ? best[0] : null });
      typedInput.value = '';
      renderSF();
    }
    document.getElementById('sf-typed-add').addEventListener('click', addTyped);
    typedInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addTyped(); } });

    /* Narrow the same search to one skill category \u2014 browse without a 4,410-item dropdown. */
    var catSel = document.getElementById('sf-cat');
    var cats = {};
    LIB.forEach(function (r) { if (r[1]) cats[r[1]] = true; });
    Object.keys(cats).sort().forEach(function (c) {
      var o = document.createElement('option');
      o.value = c; o.textContent = c;
      catSel.appendChild(o);
    });
    catSel.addEventListener('change', function () {
      SF.cat = catSel.value;
      if (SF.cat) search.focus();
      drawSuggest();
    });

    document.getElementById('sf-match').addEventListener('click', runMatch);
    renderSF();
  }

  function renderSF() {
    document.getElementById('sf-picked-count').textContent = SF.picked.length + ' of 10';
    document.getElementById('sf-core-count').textContent = SF.core.length + ' of 3';
    document.getElementById('sf-typed-count').textContent = SF.typed.length + ' of 5';
    document.getElementById('sf-picked').innerHTML = SF.picked.map(function (n) {
      return '<li><span class="pill">' + esc(n) +
        '<button type="button" class="sf-x" data-remove="' + esc(n) + '" data-remove-kind="picked" aria-label="Remove">&times;</button></span></li>';
    }).join('');
    document.querySelectorAll('.sf-corepill').forEach(function (b) {
      b.classList.toggle('on', SF.core.indexOf(b.dataset.core) >= 0);
    });
    document.getElementById('sf-typed').innerHTML = SF.typed.map(function (t) {
      return '<li><span class="pill pill--ai">' + esc(t.text) +
        (t.match ? '<em class="sf-matchnote">\u2192 ' + esc(t.match) + '</em>' : '<em class="sf-matchnote">your words</em>') +
        '<button type="button" class="sf-x" data-remove="' + esc(t.text) + '" data-remove-kind="typed" aria-label="Remove">&times;</button></span></li>';
    }).join('');
  }

  function sfSkillNames() {
    var names = SF.picked.slice();
    SF.typed.forEach(function (t) { if (t.match && names.indexOf(t.match) < 0) names.push(t.match); });
    return names;
  }

  function runMatch() {
    var out = document.getElementById('sf-results');
    var names = sfSkillNames();
    if (!names.length) {
      out.hidden = false;
      out.innerHTML = '<p class="bucket__none">Pick at least one skill from the library (or add one of your own that matches) and try again.</p>';
      return;
    }
    var libByName = {};
    LIB.forEach(function (r) { libByName[r[0]] = r; });
    var mine = names.map(function (n) { return libByName[n] ? libToSkill(libByName[n]) : { skill: n, category: '', subcategory: '' }; });

    var scored = Object.keys(DATA.roles).map(function (key) {
      var role = DATA.roles[key];
      var byName = {}, bySub = {}, byCat = {};
      role.skills.forEach(function (s) {
        byName[s.skill] = true;
        if (s.subcategory) bySub[s.subcategory] = true;
        if (s.category) byCat[s.category] = true;
      });
      var score = 0, exact = [];
      mine.forEach(function (s) {
        if (byName[s.skill]) { score += 3; exact.push(s.skill); }
        else if (s.subcategory && bySub[s.subcategory]) score += 1.5;
        else if (s.category && byCat[s.category]) score += 0.75;
      });
      return { key: key, role: role, score: score, exact: exact };
    }).filter(function (r) { return r.score > 0; });
    scored.sort(function (x, y) { return y.score - x.score; });
    var top = scored.slice(0, 5);
    var maxScore = 3 * names.length;

    var leadPicked = SF.core.filter(function (c) { return LEAD_CORE.indexOf(c) >= 0; });
    var leaderSignal = leadPicked.length > 0 && !document.getElementById('sf-manager').checked;

    out.hidden = false;
    out.innerHTML = '<h3>Your best-fit roles</h3>' +
      (leadPicked.length ? '<p class="sf__leadnote">You named <b>' + leadPicked.map(esc).join('</b>, <b>') +
        '</b> among your core strengths' + (leaderSignal ?
        ' \u2014 and you don\u2019t manage people today. That\u2019s a leadership signal: whichever role you choose, your plan will include developing as a people leader.' :
        ' \u2014 strengths we would want to see in a manager.') + '</p>' : '') +
      '<div class="sf__cards">' + (top.length ? top.map(function (r) {
        var pct = Math.min(97, Math.round(100 * r.score / maxScore));
        return '<div class="sf__card">' +
          '<p class="sf__cardfam">' + esc(r.role.family) + '</p>' +
          '<h4>' + esc(r.key) + '</h4>' +
          '<div class="sf__cardbar"><i style="width:' + pct + '%"></i></div>' +
          '<p class="sf__cardpct"><b>' + pct + '%</b> skills fit</p>' +
          (r.exact.length ? '<p class="sf__cardhits">You bring: ' + r.exact.slice(0, 4).map(esc).join(' \u00b7 ') +
            (r.exact.length > 4 ? ' +' + (r.exact.length - 4) + ' more' : '') + '</p>' :
            '<p class="sf__cardhits">Related skills in your set point here.</p>') +
          '<button type="button" class="btn btn--dark sf-choose" data-rolekey="' + esc(r.key) + '">Build my plan for this role</button>' +
          '</div>';
      }).join('') : '<p class="bucket__none">No strong matches yet \u2014 add a few more skills.</p>') + '</div>';

    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  var SF_LEADER = false;

  document.addEventListener('click', function (e) {
    var chooseBtn = e.target.closest('.sf-choose');
    if (!chooseBtn) return;
    var key = chooseBtn.dataset.rolekey;
    var libByName = {};
    LIB.forEach(function (r) { libByName[r[0]] = r; });
    SKILLS_ROLE = {
      family: 'Skills-first profile',
      subfamily: 'My skills',
      skills: sfSkillNames().map(function (n) {
        return libByName[n] ? libToSkill(libByName[n]) : { skill: n, category: '', subcategory: '', type: 'Technical', definition: '', prof: null };
      }),
      probable: []
    };
    var leadPicked = SF.core.filter(function (c) { return LEAD_CORE.indexOf(c) >= 0; });
    SF_LEADER = leadPicked.length > 0 && !document.getElementById('sf-manager').checked;

    if (!fromSel.querySelector('option[value="__skills__"]')) {
      var o = document.createElement('option');
      o.value = '__skills__'; o.textContent = 'My skills (skills-first profile)';
      fromSel.insertBefore(o, fromSel.children[1]);
    }
    fromSel.value = '__skills__';
    toSel.value = key;
    var explore = document.getElementById('explore');
    explore.hidden = false;
    document.getElementById('plan').hidden = false;
    explore.classList.add('skillsmode');
    document.getElementById('pickers').hidden = true;
    var banner = document.getElementById('mode-banner');
    banner.hidden = false;
    document.getElementById('mode-banner-text').innerHTML =
      'Skills-first path: <b>My skills</b> \u2192 <b>' + esc(key) + '</b>. One path at a time \u2014 change your matched role above, or start over to switch paths.';
    syncLevelPicker();
    update();
    explore.scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('#mode-change')) {
      document.getElementById('sf-results').scrollIntoView({ behavior: 'smooth' });
    }
    if (e.target.closest('#mode-restart')) {
      enterRolesPath();
      openPathChooser();
    }
  });

  /* ---------- Develop your people: one at a time, add as many as you manage ---------- */
  function blankPerson() {
    return { jobRole: '', jobFamily: '', role: '', level: '', dir: 'current',
             tgtRole: '', tgtJobRole: '', tgtLevel: '', ratings: {}, extras: [], built: false };
  }
  var PEOPLE = { list: [blankPerson()], active: 0 };
  try {
    var savedPeople = JSON.parse(sessionStorage.getItem('sm_people_v1') || 'null');
    if (savedPeople && savedPeople.list && savedPeople.list.length) PEOPLE = savedPeople;
  } catch (e) {}
  if (PEOPLE.active >= PEOPLE.list.length) PEOPLE.active = 0;
  var DEV = PEOPLE.list[PEOPLE.active];
  function saveDev() {
    try { sessionStorage.setItem('sm_people_v1', JSON.stringify(PEOPLE)); } catch (e) {}
  }

  function personLabel(p, i) {
    return 'Person ' + (i + 1) + (p.jobRole ? ' · ' + p.jobRole : ' · not set yet');
  }
  function renderPeople() {
    var ul = document.getElementById('ttd-people');
    if (!ul) return;
    ul.innerHTML = PEOPLE.list.map(function (p, i) {
      return '<li><span class="pill tt__person' + (i === PEOPLE.active ? ' on' : '') + '" data-ttperson="' + i + '">' +
        esc(personLabel(p, i)) +
        (PEOPLE.list.length > 1 ? '<button type="button" class="sf-x" data-ttpersonrm="' + i + '" aria-label="Remove person">&times;</button>' : '') +
        '</span></li>';
    }).join('') +
    '<li><button type="button" class="tt__addperson" id="ttd-addperson">+ Add another person</button></li>';
  }

  function initDevelop() {
    var input = document.getElementById('ttd-search');
    if (!input) return;
    attachRoleSearch(input, document.getElementById('ttd-suggest'), function (r) {
      var p = blankPerson();
      p.jobRole = r.n; p.jobFamily = r.f; p.role = r.s || ''; p.level = r.l || '';
      p.tgtRole = r.s || ''; p.tgtLevel = r.l || '';
      PEOPLE.list[PEOPLE.active] = DEV = p;
      input.value = r.n;
      track('role_selected', { scope: 'manager', profiled: r.s ? 'yes' : 'no' });
      saveDev(); renderPeople(); renderDevelop();
    });
    syncDevPickers();
    stampFreshness();
    renderPeople();
    renderDevelop();
  }

  function syncDevPickers() {
    var input = document.getElementById('ttd-search');
    if (input) input.value = DEV.jobRole || '';
  }

  /* One change listener for both audiences: data-scope says whose state to mutate. */
  function stateFor(scope) { return scope === 'me' ? ME : DEV; }
  function saveFor(scope) { if (scope === 'me') saveMe(); else saveDev(); }
  function renderFor(scope) { if (scope === 'me') renderMyRole(); else renderDevelop(); }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'mr-level' || t.id === 'ttd-level') {
      var sc = t.id === 'mr-level' ? 'me' : 'mgr', st = stateFor(sc);
      st.level = t.value;
      st.dir = 'current'; st.tgtRole = st.role; st.tgtLevel = st.value;
      st.ratings = {}; st.built = false;
      saveFor(sc); if (sc === 'mgr') renderPeople();
      renderFor(sc);
      return;
    }
    if (t.hasAttribute && t.hasAttribute('data-tgtlevel')) {
      var sc2 = t.dataset.scope, st2 = stateFor(sc2);
      st2.tgtLevel = t.value;
      st2.ratings = {}; st2.built = false;
      saveFor(sc2); renderFor(sc2);
      return;
    }
    if (t.hasAttribute && t.hasAttribute('data-ttrate')) {
      var sc3 = t.dataset.scope, st3 = stateFor(sc3);
      (st3.ratings[t.dataset.ttrate] = st3.ratings[t.dataset.ttrate] || {})[t.dataset.field] = +t.value;
      saveFor(sc3); renderFor(sc3);
    }
  });

  /* The destination search is rebuilt with the view, so bind it after each render. */
  function bindTargetSearch() {
    document.querySelectorAll('[data-tgtsearch]').forEach(function (input) {
      if (input.dataset.bound) return;
      input.dataset.bound = '1';
      var scope = input.dataset.tgtsearch;
      attachRoleSearch(input, document.getElementById(scope + '-tgt-suggest'), function (r) {
        var st = stateFor(scope);
        if (!r.s) {
          input.value = r.n;
          var note = document.getElementById(scope + '-tgt-suggest');
          note.hidden = false;
          note.innerHTML = '<p class="rs__none"><b>' + esc(r.n) + '</b> has no mapped skill profile yet, so it can’t be a destination. Search a role that is mapped.</p>';
          return;
        }
        st.tgtJobRole = r.n; st.tgtRole = r.s;
        var levels = roleLevels(DATA.roles[r.s]);
        st.tgtLevel = r.l && levels.indexOf(r.l) >= 0 ? r.l : (levels.indexOf(st.level) >= 0 ? st.level : '');
        st.ratings = {}; st.built = false;
        saveFor(scope); renderFor(scope);
      });
      if (stateFor(scope).tgtJobRole) input.value = stateFor(scope).tgtJobRole;
    });
  }

  function addAuditExtra(scope) {
    var inp = document.querySelector('[data-extrainput="' + scope + '"]');
    if (!inp) return;
    var st = stateFor(scope);
    var v = (inp.value || '').trim();
    if (!v || st.extras.indexOf(v) >= 0 || st.extras.length >= 10) return;
    st.extras.push(v);
    saveFor(scope); renderFor(scope);
  }
  document.addEventListener('keydown', function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute('data-extrainput') && e.key === 'Enter') {
      e.preventDefault(); addAuditExtra(e.target.dataset.extrainput);
    }
  });

  document.addEventListener('click', function (e) {
    var dirBtn = e.target.closest('[data-ttdir]');
    if (dirBtn) {
      var sc = dirBtn.dataset.scope, st = stateFor(sc);
      st.dir = dirBtn.dataset.ttdir;
      st.ratings = {}; st.built = false;
      if (st.dir === 'current') { st.tgtRole = st.role; st.tgtLevel = st.level; st.tgtJobRole = ''; }
      else if (st.dir === 'up') {
        st.tgtRole = st.role; st.tgtJobRole = '';
        st.tgtLevel = st.role ? (nextLevelUp(DATA.roles[st.role], st.level) || '') : '';
      } else { st.tgtRole = ''; st.tgtJobRole = ''; st.tgtLevel = ''; }
      saveFor(sc); renderFor(sc);
      return;
    }
    var addBtn = e.target.closest('[data-extraadd]');
    if (addBtn) { addAuditExtra(addBtn.dataset.extraadd); return; }
    var rmBtn = e.target.closest('[data-extrarm]');
    if (rmBtn) {
      var sc2 = rmBtn.dataset.scope, st2 = stateFor(sc2);
      st2.extras = st2.extras.filter(function (x) { return x !== rmBtn.dataset.extrarm; });
      saveFor(sc2); renderFor(sc2);
      return;
    }
    var buildBtn = e.target.closest('[data-auditbuild]');
    if (buildBtn) {
      var sc3 = buildBtn.dataset.auditbuild, st3 = stateFor(sc3);
      track('plan_built', { scope: sc3, direction: st3.dir, profiled: st3.tgtRole ? 'yes' : 'no' });
      st3.built = true; saveFor(sc3); renderFor(sc3);
      var pl = document.getElementById(sc3 + '-plan');
      if (pl) pl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    var prm = e.target.closest('[data-ttpersonrm]');
    if (prm) {
      PEOPLE.list.splice(+prm.dataset.ttpersonrm, 1);
      if (!PEOPLE.list.length) PEOPLE.list.push(blankPerson());
      if (PEOPLE.active >= PEOPLE.list.length) PEOPLE.active = PEOPLE.list.length - 1;
      DEV = PEOPLE.list[PEOPLE.active];
      saveDev(); syncDevPickers(); renderPeople(); renderDevelop();
      return;
    }
    var psel = e.target.closest('[data-ttperson]');
    if (psel) {
      PEOPLE.active = +psel.dataset.ttperson;
      DEV = PEOPLE.list[PEOPLE.active];
      saveDev(); syncDevPickers(); renderPeople(); renderDevelop();
      return;
    }
    if (e.target.closest('#ttd-addperson')) {
      PEOPLE.list.push(blankPerson());
      PEOPLE.active = PEOPLE.list.length - 1;
      DEV = PEOPLE.list[PEOPLE.active];
      saveDev(); syncDevPickers(); renderPeople(); renderDevelop();
      return;
    }
    var printBtn = e.target.closest('[data-print]');
    if (printBtn) {
      var host = printBtn.closest('.tt__devplan');
      track('plan_printed', { scope: host ? (host.id === 'me-plan' ? 'me' : 'manager') : 'skills_first' });
      document.body.classList.toggle('printing-audit', !!host);
      print();
      document.body.classList.remove('printing-audit');
    }
  });

  /* ---------- Job-role search: staff know their title, not their sub-family ---------- */
  var ALL_LEVELS = LEVEL_ORDER;

  function roleTokens(r) {
    return (r.n + ' ' + r.f + ' ' + (r.s || '') + ' ' + r.l).toLowerCase();
  }
  /* Rank: whole-phrase prefix beats word-start beats anywhere; headcount breaks ties so the
     titles most people actually hold surface first. */
  function searchRoles(q, limit) {
    var terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var out = [];
    for (var i = 0; i < JOBROLES.length; i++) {
      var r = JOBROLES[i], hay = roleTokens(r), name = r.n.toLowerCase(), ok = true, score = 0;
      for (var t = 0; t < terms.length; t++) {
        if (hay.indexOf(terms[t]) < 0) { ok = false; break; }
      }
      if (!ok) continue;
      var joined = terms.join(' ');
      if (name.indexOf(joined) === 0) score += 100;
      else if (name.indexOf(joined) > 0) score += 60;
      if (new RegExp('\\b' + terms[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(name)) score += 25;
      if (r.s) score += 10;
      score += Math.min(r.h, 40) / 10;
      out.push({ r: r, score: score });
    }
    out.sort(function (a, b) { return b.score - a.score || a.r.n.localeCompare(b.r.n); });
    return out.slice(0, limit || 12).map(function (x) { return x.r; });
  }

  function roleIndexOf(name, level) {
    for (var i = 0; i < JOBROLES.length; i++) {
      if (JOBROLES[i].n === name && (level === undefined || JOBROLES[i].l === level)) return i;
    }
    return -1;
  }

  /* Titles most people hold, shown before anyone types, so the field browses as well as
     searches. Sorted by headcount: the list opens on the roles most staff actually sit in. */
  function commonRoles(limit) {
    return JOBROLES.slice()
      .sort(function (a, b) { return b.h - a.h || a.n.localeCompare(b.n); })
      .slice(0, limit || 12);
  }

  /* Browse every mapped title in a scrollable list — no typing needed.
     Grouped by job family; open until a destination is picked. */
  var BROWSE_CACHE = '';
  function browsePanel(scope, st) {
    if (!BROWSE_CACHE) {
      var by = {}, count = 0;
      JOBROLES.forEach(function (r, i) { if (r.s) { (by[r.f] = by[r.f] || []).push(i); count++; } });
      BROWSE_CACHE = '<details class="rolebrowse"{OPEN}><summary>Or scroll all ' + count +
        ' mapped titles and click yours</summary><div class="rolebrowse__list">' +
        Object.keys(by).sort().map(function (fam) {
          return '<p class="rolebrowse__fam">' + esc(fam) + '</p>' +
            by[fam].sort(function (a, b) { return JOBROLES[a].n.localeCompare(JOBROLES[b].n); })
              .map(function (i) {
                var r = JOBROLES[i];
                return '<button type="button" class="rolebrowse__opt" data-jrpick="' + i + '" data-scope="{S}">' +
                  '<span>' + esc(r.n) + '</span><small>' + esc(r.s) + (r.l ? ' · ' + esc(r.l) : '') + '</small></button>';
              }).join('');
        }).join('') + '</div></details>';
    }
    return BROWSE_CACHE.split('{S}').join(scope).replace('{OPEN}', st.tgtRole ? '' : ' open');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-jrpick]');
    if (!b) return;
    var r = JOBROLES[+b.dataset.jrpick];
    var scope = b.dataset.scope;
    if (!r || !r.s || !scope) return;
    var st = stateFor(scope);
    st.tgtJobRole = r.n; st.tgtRole = r.s;
    var levels = roleLevels(DATA.roles[r.s]);
    st.tgtLevel = r.l && levels.indexOf(r.l) >= 0 ? r.l : (levels.indexOf(st.level) >= 0 ? st.level : '');
    st.ratings = {}; st.built = false;
    saveFor(scope); renderFor(scope);
    track('browse_pick', { role: r.n });
  });

  /* One combobox, three experiences. Type to search, or open it and browse.
     onPick receives the job-role record. */
  function attachRoleSearch(input, suggest, onPick) {
    if (!input || !suggest) return;
    var active = -1, current = [], browsing = false;
    var listId = suggest.id;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    if (listId) input.setAttribute('aria-controls', listId);
    suggest.setAttribute('role', 'listbox');

    function close() {
      suggest.hidden = true; suggest.innerHTML = ''; active = -1; current = [];
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }
    function optId(i) { return (listId || 'rs') + '-opt-' + i; }
    function draw() {
      if (!JOBROLES.length) {
        suggest.innerHTML = '<p class="rs__none">Job titles could not be loaded. Refresh the page to try again.</p>';
        suggest.hidden = false; input.setAttribute('aria-expanded', 'true');
        return;
      }
      if (!current.length) {
        suggest.innerHTML = '<p class="rs__none">No job title matches that. Try fewer words, or a word from the middle of your title.</p>';
        suggest.hidden = false; input.setAttribute('aria-expanded', 'true');
        input.removeAttribute('aria-activedescendant');
        return;
      }
      suggest.innerHTML = (browsing ? '<p class="rs__hint">Most common titles &mdash; start typing to search all ' + JOBROLES.length + '.</p>' : '') +
        current.map(function (r, i) {
          var st = r.l ? streamOf(r.l) : null;
          return '<button type="button" class="rs__opt' + (i === active ? ' on' : '') + '" role="option" id="' + optId(i) +
            '" aria-selected="' + (i === active ? 'true' : 'false') + '" data-rsi="' + i + '">' +
            '<span class="rs__name">' + esc(r.n) + '</span>' +
            '<span class="rs__meta">' + esc(r.f) +
            (r.l ? ' · ' + esc(r.l) + (st ? ' ' + esc(st.label) : '') : '') +
            (r.s ? '' : ' · <i>no skill profile yet</i>') + '</span></button>';
        }).join('');
      suggest.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      if (active >= 0) {
        input.setAttribute('aria-activedescendant', optId(active));
        var el = suggest.querySelector('.rs__opt.on');
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }
    function refresh() {
      var q = input.value.trim();
      browsing = !q;
      current = q ? searchRoles(q, 12) : commonRoles(12);
      active = -1;
      draw();
    }
    input.addEventListener('input', refresh);
    input.addEventListener('focus', refresh);
    input.addEventListener('click', function () { if (suggest.hidden) refresh(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' && suggest.hidden) { e.preventDefault(); refresh(); return; }
      if (suggest.hidden || !current.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, current.length - 1); draw(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); draw(); }
      else if (e.key === 'Home') { e.preventDefault(); active = 0; draw(); }
      else if (e.key === 'End') { e.preventDefault(); active = current.length - 1; draw(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var pick = current[active < 0 ? 0 : active];
        if (pick) { close(); onPick(pick); }
      } else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') { close(); }
    });
    suggest.addEventListener('mousedown', function (e) {
      var b = e.target.closest('[data-rsi]');
      if (!b) return;
      e.preventDefault();
      var pick = current[+b.dataset.rsi];
      close();
      if (pick) onPick(pick);
    });
    /* mousedown on an option preventDefaults, so blur only fires on a real click-away. */
    input.addEventListener('blur', close);
  }

  /* ---------- Shared audit engine: same machinery for staff and managers ---------- */
  var COPY_ME = {
    scope: 'me',
    ask: 'Are you growing in your <b>current role</b>, or toward something else?',
    dirs: [
      ['current', 'Grow in my current role', function (st) { return esc(st.jobRole) + (st.level ? ' at ' + esc(st.level) : ''); }],
      ['up', 'Grow to the next level', function (st) { return 'A higher level in my sub-family'; }],
      ['other', 'Grow to transfer', function () { return 'A different role somewhere else at Vanderbilt'; }]
    ],
    at: 'I’m at', need: 'Needs to be',
    atAria: 'Proficiency you are at', needAria: 'Proficiency you need',
    newFlag: 'new to me',
    rateIntro: 'Rate yourself honestly — this is for your plan, not your review. Both columns start pre-filled from what the framework expects; adjust the left column to where you actually are.',
    build: 'Build my development plan', rebuild: 'Update my development plan',
    planTitle: 'My development plan',
    extrasLabel: 'Other areas I want to develop',
    extrasHelp: 'Anything beyond the mapped skills — readiness for this role or the next one. Each area joins the plan as its own row.',
    extrasPlaceholder: 'e.g. Executive presence, budget ownership, Oracle reporting…',
    ownerLine: 'Take it to your manager and your Engagement Consultant, and log each skill as a development goal in ',
    strengthsHelp: 'Rated at or above the target — name these when you talk about your growth, and use them as the platform the gap work stands on.',
    noGaps: '<b>No gaps at your current ratings.</b> Raise “needs to be” where you want stretch, or aim at a bigger target.'
  };
  var COPY_MGR = {
    scope: 'mgr',
    ask: 'Is this person growing in their <b>current role</b>, or toward something else?',
    dirs: [
      ['current', 'Grow in their current role', function (st) { return esc(st.jobRole || st.role) + (st.level ? ' at ' + esc(st.level) : ''); }],
      ['up', 'Grow to the next level', function (st) { return 'A higher level in their sub-family'; }],
      ['other', 'Grow to transfer', function () { return 'A different sub-family entirely'; }]
    ],
    at: 'They’re at', need: 'Needs to be',
    atAria: 'Proficiency they are at', needAria: 'Proficiency they need',
    newFlag: 'new to them',
    rateIntro: 'Skill by skill, set where this person is today and where they need to be. Both columns start pre-filled from the framework’s expectations — adjust them to your read.',
    build: 'Build the development plan', rebuild: 'Update the development plan',
    planTitle: 'Development plan',
    extrasLabel: 'Other areas of development',
    extrasHelp: 'Anything beyond the mapped skills — readiness for the current role or the future one. Each area joins the plan as its own row.',
    extrasPlaceholder: 'e.g. Executive presence, budget ownership, Oracle reporting…',
    ownerLine: 'Have the person log each skill as a development goal in ',
    strengthsHelp: 'Rated at or above the target — name these in the conversation, and use them as the platform the gap work stands on.',
    noGaps: '<b>No gaps at your current ratings.</b> Adjust “needs to be” upward where you want stretch, or point this person at a bigger target.'
  };

  /* Expected proficiency as a 1-5 index at a level. The framework does not define every level
     for every skill, so fall back to the nearest level that is defined. */
  function profIdxAt(s, level) {
    if (!s.prof) return 0;
    if (s.prof[level]) return PROF_ORDER[s.prof[level]] || 0;
    var idx = LEVEL_ORDER.indexOf(level);
    if (idx < 0) return 0;
    for (var d = 1; d < LEVEL_ORDER.length; d++) {
      var lo = LEVEL_ORDER[idx - d], hi = LEVEL_ORDER[idx + d];
      if (lo && s.prof[lo]) return PROF_ORDER[s.prof[lo]] || 0;
      if (hi && s.prof[hi]) return PROF_ORDER[s.prof[hi]] || 0;
    }
    return 0;
  }
  function levelsAbove(roleKey, level) {
    var role = DATA.roles[roleKey];
    if (!role) return [];
    var ci = LEVEL_ORDER.indexOf(level);
    return roleLevels(role).filter(function (l) { return LEVEL_ORDER.indexOf(l) > ci; });
  }

  /* Target-role skills with pre-filled ratings: "needs to be" from the framework's expected
     proficiency at the target sub-family and level; "is at" from the current sub-family at the
     current level — Awareness when the current role does not carry the skill at all. */
  function auditList(st) {
    var tgt = DATA.roles[st.tgtRole], cur = DATA.roles[st.role];
    if (!tgt || !st.tgtLevel) return [];
    var curBy = {};
    if (cur) cur.skills.forEach(function (s) { curBy[s.skill] = s; });
    return tgt.skills.map(function (s) {
      var c = curBy[s.skill];
      var atPre = c ? (profIdxAt(c, st.level) || 1) : 1;
      var needPre = profIdxAt(s, st.tgtLevel) || 3;
      var r = st.ratings[s.skill] || {};
      return { skill: s, at: r.at || atPre, need: r.need || needPre, mapped: !!c };
    });
  }

  function profSel(M, skillName, field, val) {
    return '<select data-ttrate="' + esc(skillName) + '" data-field="' + field + '" data-scope="' + M.scope +
      '" aria-label="' + (field === 'at' ? M.atAria : M.needAria) + ' for ' + esc(skillName) + '">' +
      PROF_NAMES.map(function (p, i) {
        return '<option value="' + (i + 1) + '"' + (i + 1 === val ? ' selected' : '') + '>' + p + '</option>';
      }).join('') + '</select>';
  }

  function levelOpts(levels, selected, placeholder) {
    return '<option value="">' + placeholder + '</option>' + levels.map(function (l) {
      var st = streamOf(l);
      return '<option value="' + l + '"' + (selected === l ? ' selected' : '') + '>' + l + ' · ' + (st ? st.label : '') + '</option>';
    }).join('');
  }

  /* Direction chooser + destination pickers + rating table + extras + plan. */
  /* Everything above the plan is "work" — hidden when the plan is printed. */
  function auditBody(st, M) {
    return '<div class="audit__work">' + auditWork(st, M) + '</div>' + (st.built ? auditTail(st, M) : '');
  }
  function auditTail(st, M) {
    if (!st.tgtRole) return auditPlan(st, [], M);
    var list = auditList(st);
    return list.length ? auditPlan(st, list, M) : '';
  }

  function auditWork(st, M) {
    var html = '<p class="tt__ask">' + M.ask + '</p>';
    html += '<div class="lensrow tt__dirrow">' + M.dirs.map(function (x) {
      return '<button type="button" class="ttdir' + (st.dir === x[0] ? ' on' : '') + '" data-ttdir="' + x[0] +
        '" data-scope="' + M.scope + '"><b>' + x[1] + '</b><span>' + x[2](st) + '</span></button>';
    }).join('') + '</div>';

    if (st.dir === 'up') {
      if (!st.role) {
        return html + '<p class="tt__sub"><b class="tt-flagtext">This title has no mapped skill profile,</b> so there is no level ladder to step up. ' +
          'Choose “Grow to transfer” and search a title that is mapped, or stay on “current role” to work from the core competencies.</p>';
      }
      var above = levelsAbove(st.role, st.level);
      if (!above.length) {
        return html + '<p class="tt__sub"><b class="tt-flagtext">' + esc(st.level || 'This level') +
          ' is the top mapped level for ' + esc(st.role) +
          '.</b> Choose “Grow to transfer” to keep moving.</p>';
      }
      html += '<div class="tt__addrow tt__targetrow"><label class="tt__targetlbl" for="' + M.scope + '-tgt-level">New level</label>' +
        '<select id="' + M.scope + '-tgt-level" data-scope="' + M.scope + '" data-tgtlevel>' +
        levelOpts(above, st.tgtLevel, 'Select the new level…') + '</select></div>';
      if (!st.tgtLevel) {
        return html + '<p class="tt__sub">Select the new level — its expected proficiencies load into “needs to be” automatically.</p>';
      }
    } else if (st.dir === 'other') {
      html += '<div class="tt__targetsearch"><p class="sf__label">Destination job title</p><div class="rs">' +
        '<input type="text" id="' + M.scope + '-tgt-search" data-tgtsearch="' + M.scope +
        '" placeholder="Search the job title you’re aiming at…" autocomplete="off" aria-label="Search the destination job title">' +
        '<div class="rs__suggest" id="' + M.scope + '-tgt-suggest" hidden></div></div>' +
        browsePanel(M.scope, st);
      if (st.tgtRole) {
        html += '<p class="mr__maps">Aiming at <b>' + esc(st.tgtJobRole || st.tgtRole) + '</b>' +
          ' — maps to the <b>' + esc(st.tgtRole) + '</b> profile' +
          '<span class="mr__lvlwrap"><label for="' + M.scope + '-tgt-level">Target level</label>' +
          '<select id="' + M.scope + '-tgt-level" data-scope="' + M.scope + '" data-tgtlevel>' +
          levelOpts(roleLevels(DATA.roles[st.tgtRole]), st.tgtLevel, 'Target level…') + '</select></span></p>';
      }
      html += '</div>';
      if (!st.tgtRole || !st.tgtLevel) {
        return html + '<p class="tt__sub">Search the destination title and pick a target level — its skills and expected proficiencies load automatically.</p>';
      }
    }

    /* No framework profile: core competencies plus whatever they name themselves. */
    if (!st.tgtRole) return html + auditUnprofiled(st, M);

    var list = auditList(st);
    if (!list.length) return html;
    var gaps = list.filter(function (g) { return g.need > g.at; });

    html += '<p class="tt__sub tt__target">Target: <b>' + esc(st.tgtRole) + '</b> at <b>' + esc(st.tgtLevel) +
      '</b> · ' + list.length + ' skills to rate · <b class="tt-flagtext">' + gaps.length + ' gap' +
      plural(gaps.length) + '</b> · ' + (list.length - gaps.length) + ' at or above target</p>';
    html += '<p class="tt__sub">' + M.rateIntro + '</p>';

    html += '<div class="tablewrap tt__tablewrap"><table class="learntable tt__table tt__ratetable">' +
      '<thead><tr><th>Skill</th><th>' + M.at + '</th><th>' + M.need + '</th><th>Gap</th></tr></thead><tbody>' +
      list.map(function (g) {
        var gap = g.need - g.at;
        var gapCell = gap > 0 ? '<span class="tt-gapchip">+' + gap + '</span>' :
          gap === 0 ? '<span class="tt-okchip">at target</span>' : '<span class="tt-okchip">above</span>';
        return '<tr><td class="tt-skill"><button type="button" class="skill-link" data-skill="' + esc(g.skill.skill) +
          '" data-kind="role" data-role="' + esc(st.tgtRole) + '">' + esc(g.skill.skill) + '</button>' +
          (g.mapped ? '' : '<span class="tt-flag">' + M.newFlag + '</span>') + '</td>' +
          '<td data-label="' + M.at + '">' + profSel(M, g.skill.skill, 'at', g.at) + '</td>' +
          '<td data-label="' + M.need + '">' + profSel(M, g.skill.skill, 'need', g.need) + '</td>' +
          '<td data-label="Gap">' + gapCell + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    html += auditExtras(st, M);
    html += '<div class="plan__actions"><button type="button" class="btn btn--dark" data-auditbuild="' + M.scope + '">' +
      (st.built ? M.rebuild : M.build) + '</button></div>';
    return html;
  }

  /* Roles the framework has not profiled: the seven core competencies always apply, and the
     person names the skills they want to grow. A transfer target still gets a full plan. */
  function auditUnprofiled(st, M) {
    var who = M.scope === 'me' ? 'Your role' : 'This role';
    var html = '<div class="mr__noprofile"><h4>' + who + ' doesn’t have a mapped skill profile yet</h4>' +
      '<p><b>' + esc(st.jobRole) + '</b> sits in <b>' + esc(st.jobFamily) +
      '</b>, which the skills-based job architecture hasn’t mapped in detail yet. Two things still work: ' +
      'Vanderbilt’s seven core competencies apply to every role, and you can name the skills to grow below. ' +
      'To build a full skill-by-skill plan, choose <b>Grow to transfer</b> and search a role that is mapped.</p></div>';

    html += '<div class="tablewrap tt__tablewrap"><table class="learntable tt__table"><thead><tr><th>Core competency</th><th>Applies to</th></tr></thead><tbody>' +
      DATA.core.map(function (c) {
        return '<tr><td class="tt-skill"><button type="button" class="skill-link" data-skill="' + esc(c.name) +
          '" data-kind="core">' + esc(c.name) + '</button></td><td>' + esc(c.applies) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    html += auditExtras(st, M);
    html += '<div class="plan__actions"><button type="button" class="btn btn--dark" data-auditbuild="' + M.scope + '">' +
      (st.built ? M.rebuild : M.build) + '</button></div>';
    return html;
  }

  function auditExtras(st, M) {
    return '<div class="tt__extras"><p class="sf__label">' + M.extrasLabel + '</p>' +
      '<p class="tt__sub">' + M.extrasHelp + '</p>' +
      '<div class="tt__addrow"><input type="text" data-extrainput="' + M.scope + '" maxlength="80" aria-label="' +
      M.extrasLabel + '" placeholder="' + M.extrasPlaceholder + '">' +
      '<button type="button" class="btn btn--dark" data-extraadd="' + M.scope + '">Add area</button></div>' +
      (st.extras.length ? '<ul class="pills sf__picked">' + st.extras.map(function (x) {
        return '<li><span class="pill">' + esc(x) + '<button type="button" class="sf-x" data-extrarm="' + esc(x) +
          '" data-scope="' + M.scope + '" aria-label="Remove">&times;</button></span></li>';
      }).join('') + '</ul>' : '') + '</div>';
  }

  function auditKey(st, skill) {
    return 'audit:' + st.role + ':' + st.tgtRole + ':' + st.tgtLevel + ':' + skill;
  }
  function auditRow(st, g, i, M) {
    var s = g ? g.skill : AI_READINESS;
    var why = g ?
      '<span class="lt-tag lt-tag--bridge">Gap</span> rated <b>' + PROF_NAMES[g.at - 1] + '</b>, needs <b>' + PROF_NAMES[g.need - 1] + '</b>' :
      '<span class="lt-tag lt-tag--univ">Universal</span> assumed development need for every role';
    var oc = oracleCoursesFor(s.skill);
    var learn = oc.length ?
      '<span class="lt-orc">' + oc.slice(0, 2).map(function (c) {
        return '<a href="' + ORACLE.prefix + c.id + '" target="_blank" rel="noopener">' + esc(c.n) + '</a>';
      }).join('') + '</span>' :
      '<span class="lt-none">Not in the Oracle catalog. Use the skill resources below and log the work in ' + oa('Oracle Grow', ORA.grow) + '.</span>';
    var dk = auditKey(st, s.skill), dv = DATES[dk] || '';
    return '<tr>' +
      '<td class="lt-done"><span class="ckbox" aria-hidden="true"></span></td>' +
      '<td class="lt-pri">' + (i + 1) + '</td>' +
      '<td class="lt-skill"><button type="button" class="skill-link" data-skill="' + esc(s.skill) +
        '" data-kind="' + (g ? 'role' : 'univ') + '" data-role="' + esc(st.tgtRole || '') + '">' + esc(s.skill) + '</button></td>' +
      '<td class="lt-why" data-label="Why it\u2019s here">' + why + '</td>' +
      '<td class="lt-learn" data-label="Oracle Learning">' + learn + '</td>' +
      '<td class="lt-date" data-label="Target date"><input type="date" class="dateinput" data-datekey="' + esc(dk) + '"' +
        (dv ? ' value="' + esc(dv) + '"' : '') + ' aria-label="Target date for ' + esc(s.skill) + '"></td>' +
      '</tr>';
  }
  function auditExtraRow(st, name, n) {
    var dk = auditKey(st, 'extra:' + name), dv = DATES[dk] || '';
    return '<tr>' +
      '<td class="lt-done"><span class="ckbox" aria-hidden="true"></span></td>' +
      '<td class="lt-pri">' + n + '</td>' +
      '<td class="lt-skill">' + esc(name) + '</td>' +
      '<td class="lt-why"><span class="lt-tag lt-tag--grow">Added</span> named as a development area</td>' +
      '<td class="lt-learn"><span class="lt-none">Beyond the framework — agree the learning and log it as a development goal in ' + oa('Oracle Grow', ORA.grow) + '.</span></td>' +
      '<td class="lt-date"><input type="date" class="dateinput" data-datekey="' + esc(dk) + '"' +
        (dv ? ' value="' + esc(dv) + '"' : '') + ' aria-label="Target date for ' + esc(name) + '"></td>' +
      '</tr>';
  }

  /* Gaps only, biggest gap first; at-or-above skills become strengths. */
  function auditPlan(st, list, M) {
    var gaps = list.filter(function (g) { return g.need > g.at; }).sort(function (x, y) {
      return (y.need - y.at) - (x.need - x.at) || y.need - x.need || x.skill.skill.localeCompare(y.skill.skill);
    });
    var strengths = list.filter(function (g) { return g.need <= g.at; }).sort(function (x, y) {
      return y.at - x.at || x.skill.skill.localeCompare(y.skill.skill);
    });
    var mine = M.scope === 'me';
    var your = mine ? 'your' : 'their';
    var you = mine ? 'you' : 'they';
    var dirText = !st.tgtRole ? 'growth in <b>' + esc(st.jobRole || st.role) + '</b>' :
      st.dir === 'current' ? 'development in the current role, <b>' + esc(st.jobRole || st.role) + '</b>' + (st.level ? ' at <b>' + esc(st.level) + '</b>' : '') :
      st.dir === 'up' ? 'growth to the next level: <b>' + esc(st.level) + ' → ' + esc(st.tgtLevel) + '</b> in <b>' + esc(st.tgtRole) + '</b>' :
      'growth to transfer: <b>' + esc(st.jobRole || st.role) + '</b> → <b>' + esc(st.tgtJobRole || st.tgtRole) + '</b> at <b>' + esc(st.tgtLevel) + '</b>';

    var rows = [auditRow(st, null, 0, M)];
    gaps.forEach(function (g, i) { rows.push(auditRow(st, g, i + 1, M)); });
    st.extras.forEach(function (x, i) { rows.push(auditExtraRow(st, x, gaps.length + 2 + i)); });

    var isTransfer = st.dir === 'other' && !!st.tgtRole;
    var isUp = st.dir === 'up' && !!st.tgtRole;
    var destFam = isTransfer && DATA.roles[st.tgtRole] ? DATA.roles[st.tgtRole].family : '';
    var work = gaps.length + st.extras.length;
    var months = work > 5 ? 12 : work > 2 ? 9 : 6;
    var mid = months === 6 ? 4 : months - 3;
    var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    /* Phase 01: align and set up in Oracle */
    var p1 = [
      mine ?
        ck('<b>Meet with your manager</b>: share this printed plan, agree on the direction and timeline and add it to your development conversation notes. Growth here is a conversation, and developing talent across Vanderbilt is part of every manager\u2019s job.') :
        ck('<b>Hand this plan over as a growth conversation</b>: agree on the direction and timeline together and add it to your development conversation notes. It is a roadmap, never a rating.'),
      ck('Open ' + your + ' ' + oa('Talent Profile', ORA.talent) + ' and add current skills with honest proficiency, including the strengths listed below.'),
      isTransfer ?
        ck('In ' + oa('Oracle Grow', ORA.grow) + ', add <b>' + esc(st.tgtRole) + '</b> as a career/role of interest so recommendations start pointing at the destination.') :
        ck('In ' + oa('Oracle Grow', ORA.grow) + ', review the suggested skills and growth recommendations for ' + your + ' role and accept what fits.'),
      ck('In the ' + oa('Skills Center', ORA.skills) + ', review the AI-suggested skills for ' + your + ' profile and accept the ones that fit.'),
      ck('Create one <b>development goal per skill</b> in the table below' + (isTransfer ? ', tagged to the role of interest.' : '.'))
    ];
    if (isTransfer && mine) p1.push(ck('Serious about the move? Say so in your ' + oa('Talent Profile', ORA.talent) + ': indicate your interest in a new role and your target timeframe, so your manager and recruiters can see it.'));
    if (isTransfer) p1.push(ck('Reach out to someone in ' + esc(st.tgtRole) + (destFam ? ' (' + esc(destFam) + ')' : '') + ' for an informal conversation about the work.'));

    /* Phase 02: build the skills */
    var p2 = [
      ck('Work the development table top to bottom, one skill at a time, starting from the <b>Oracle Learning</b> links.'),
      ck('Complete <b>AI Workforce Readiness</b> first: it compounds every other skill ' + you + ' build' + (mine ? '' : 's') + '.'),
      ck('Pick one certification from the <b>skill resources</b> below and set a completion date.'),
      ck('Learning outside Oracle (podcasts, videos, certifications)? <b>Flag it in ' + oa('Oracle Grow', ORA.grow) + '</b>: add it to that skill\u2019s development goal so it counts in ' + your + ' talent record.'),
      ck('Practice in place: volunteer for one task in the current role that uses a growth skill.'),
      ck('<b>Monthly check-in</b>: review progress against this table and update goal status in Oracle so the record travels with ' + you + '.')
    ];
    if (isTransfer) p2.push(ck('If the pathway needs formal support, engage the <b>Engagement Consultant / HCM partner</b> to help broker cross-department options.'));

    /* Phase 03: direction-specific finish */
    var p3title = isTransfer ? 'Prove it & land it' : isUp ? 'Perform at the next level' : 'Prove it in the role';
    var p3 = isTransfer ? [
      ck('Take one gig or short assignment with the ' + (destFam ? esc(destFam) + ' ' : '') + 'team from the <b>Gigs</b> section in Oracle, once Gigs launch.'),
      ck('Watch the ' + oa('Opportunity Marketplace', ORA.market) + ' for openings in ' + esc(st.tgtRole) + ', with the Opportunity filter set to Career Roles.'),
      ck('Update ' + your + ' ' + oa('Talent Profile', ORA.talent) + ' with every completed course and new skill so recruiters and Grow can see it.'),
      mine ?
        ck('Refresh your r\u00e9sum\u00e9 in skills language. Lead with matched and newly built skills. <button type="button" class="olink eg-resume">See an example</button>') :
        ck('Help them refresh their r\u00e9sum\u00e9 in skills language, leading with matched and newly built skills.'),
      ck('<b>Final conversation</b>: confirm readiness and loop in the Engagement Consultant / HCM partner on internal openings.'),
      ck('Apply through Vanderbilt\u2019s internal mobility process with the portfolio of completions.')
    ] : isUp ? [
      ck('Act at the next level now: take on one piece of work that ' + esc(st.tgtLevel || 'the next level') + ' owns, with ' + (mine ? 'your manager\u2019s' : 'your') + ' support.'),
      ck('Update ' + your + ' ' + oa('Talent Profile', ORA.talent) + ' with every completed course and new skill.'),
      ck('Watch the ' + oa('Opportunity Marketplace', ORA.market) + ' for postings at the target level. Internal application is competitive; this plan is the preparation.'),
      ck('<b>Final conversation</b>: review the evidence together and agree what readiness looks like on paper.')
    ] : [
      ck('Bring the new skills into everyday work: pick one recurring task and raise the bar on it.'),
      ck('Update ' + your + ' ' + oa('Talent Profile', ORA.talent) + ' with every completed course and new skill.'),
      ck('Re-rate ' + (mine ? 'yourself' : 'them') + ' in this tool and watch the gaps close; carry what remains into next year\u2019s goals.'),
      ck('<b>Wrap-up conversation</b>: review what was built and choose the next direction: deeper, up a level, or a transfer.')
    ];

    var strengthHtml = strengths.length ?
      '<h4 class="tt__strengthh">Strengths to build on</h4>' +
      '<p class="tt__sub">' + M.strengthsHelp + '</p>' +
      '<ul class="pills tt__strengths">' + strengths.map(function (g) {
        return '<li><span class="pill">' + esc(g.skill.skill) + ' · ' + PROF_NAMES[g.at - 1] + '</span></li>';
      }).join('') + '</ul>' : '';

    return '<div class="tt__devplan devdoc" id="' + M.scope + '-plan"><div class="plandoc">' +

      '<div class="plandoc__head">' +
        '<div class="plandoc__meta">' +
          metaCell(mine ? 'Staff member' : 'Team member', '<span class="fillin"></span>') +
          metaCell('Current role', esc(st.jobRole || st.role || '') + (st.level ? ' <small>(' + esc(st.level) + ')</small>' : '')) +
          metaCell('Direction', isTransfer ? 'Transfer: ' + esc(st.tgtJobRole || st.tgtRole) : isUp ? 'Next level: ' + esc(st.tgtLevel) : 'Grow in role') +
          metaCell('Gaps to close', '' + (work + 1)) +
          metaCell('Plan horizon', months + ' months') +
          metaCell('Created', esc(today) + ' &middot; ' + (mine ? 'Manager' : 'Growth conversation') + ' review: <span class="fillin fillin--sm"></span>') +
        '</div>' +
        '<p class="plandoc__summary">' + M.planTitle + ', built from ' + your + ' ratings for ' + dirText + ': <b>' +
          gaps.length + ' gap skill' + plural(gaps.length) + '</b>, biggest gap first, plus AI Workforce Readiness, assumed for every role' +
          (st.extras.length ? ', and <b>' + st.extras.length + ' development area' + plural(st.extras.length) + '</b> named above' : '') +
          '. <b>This plan is ' + your + 's to drive.</b> It closes the gaps in three phases with Oracle checkpoints; growth is guaranteed, placement is not.</p>' +
      '</div>' +

      '<div class="phases">' +
        phase('01', 'Align & set up in Oracle', 'Weeks 1\u20134', p1) +
        phase('02', 'Build the skills', 'Months 2\u2013' + mid, p2) +
        phase('03', p3title, 'Months ' + mid + '\u2013' + months, p3) +
      '</div>' +

      '<div class="learnlist">' +
        '<h3>Skill development table</h3>' +
        '<p>Biggest gap first, with AI Workforce Readiness up top (universal). For every row: enroll from its Oracle Learning links, create a development goal in ' + oa('Oracle Grow', ORA.grow) + (isTransfer ? ' tagged to the role of interest' : '') + ', and add the skill to ' + your + ' ' + oa('Talent Profile', ORA.talent) + ' once built.</p>' +
        (gaps.length || !list.length ? '' : '<p class="tt__sub">' + M.noGaps + '</p>') +
        '<div class="tablewrap"><table class="learntable">' +
        '<thead><tr><th></th><th>#</th><th>Skill</th><th>Why it\u2019s here</th><th>Oracle Learning</th><th>Target date</th></tr></thead>' +
        '<tbody>' + rows.join('') + '</tbody></table></div>' +
      '</div>' +

      skillResources(gaps.map(function (g) { return { skill: g.skill }; })) +
      strengthHtml +

      '<div class="oracle">' +
        '<h3>' + (mine ? 'Your' : 'The') + ' Oracle playbook</h3>' +
        '<p>Everything above, as a single tour through Oracle. New to Grow, Oracle Learning, or the Talent Marketplace? Start with Vanderbilt\u2019s <a class="oracle__help" href="https://www.vanderbilt.edu/pcb/talent-marketplace/" target="_blank" rel="noopener">Talent Marketplace resource page</a>.</p>' +
        '<ol class="oracle__steps">' +
          oStep('Tag the skills', 'Open the ' + oa('Talent Profile', ORA.talent) + ' and add current skills with proficiency. This feeds every recommendation Oracle makes. See the full picture in the ' + oa('Skills Center', ORA.skills) + '.') +
          oStep('Open Oracle Grow', oa('Oracle Grow', ORA.grow) + ' builds a personalized page from role plus skills. Review its suggested skills and accept what fits.') +
          (isTransfer ? oStep('Declare the destination', 'In ' + oa('Oracle Grow', ORA.grow) + ', add <b>' + esc(st.tgtRole) + '</b> as a career or role of interest, and record the interest and timeframe in the ' + oa('Talent Profile', ORA.talent) + '. Declarations stay private to ' + you + '.') : '') +
          oStep('Create development goals', 'One goal per row of the table, so progress is visible to ' + (mine ? 'you and your manager' : 'both of you') + '.') +
          oStep('Enroll in Oracle Learning', 'The table deep-links to matched courses. For anything not linked, open Me \u2192 <b>Learning</b> and search the skill.') +
          oStep('Gigs and open roles', 'Watch the ' + oa('Opportunity Marketplace', ORA.market) + ' with the Opportunity filter set to Career Roles: careers show with or without an open requisition. Gigs add real practice once they launch.') +
          oStep('Close the loop', 'Completed learning updates the ' + oa('Talent Profile', ORA.talent) + '. Re-run this tool as the profile grows and watch the gaps close.') +
        '</ol>' +
      '</div>' +

      '<div class="plandoc__note">' +
        '<p class="plandoc__note-label">A note on outcomes</p>' +
        '<p><b>Growth is guaranteed. Placement is not.</b> This is a development roadmap, not a promise of placement. Completing it builds real readiness, but it does not guarantee selection for, or transfer into, any role; internal openings are filled through Vanderbilt\u2019s standard recruitment process. What the work does guarantee: the skills are ' + (mine ? 'yours' : 'theirs') + '.</p>' +
        (mine ? '' : '<p><b>Development, not evaluation.</b> No names appear on this page, and nothing here is uploaded or shared.</p>') +
      '</div>' +

      '<div class="plan__actions"><button type="button" class="btn" data-print>Print this plan</button></div>' +
      '</div></div>';
  }

  /* ---------- Staff experience: my job title -> my level -> audit -> plan ---------- */
  function blankMe() {
    return { jobRole: '', jobFamily: '', role: '', level: '', dir: 'current',
             tgtRole: '', tgtJobRole: '', tgtLevel: '', ratings: {}, extras: [], built: false };
  }
  var ME = blankMe();
  try {
    var savedMe = JSON.parse(sessionStorage.getItem('sm_me_v1') || 'null');
    if (savedMe && savedMe.jobRole) ME = savedMe;
  } catch (e) {}
  function saveMe() { try { sessionStorage.setItem('sm_me_v1', JSON.stringify(ME)); } catch (e) {} }
  /* Audits used to live in localStorage; scrub them so old machines don't resurrect them. */
  try { ['sm_me_v1', 'sm_people_v1', 'sm_team_v1', 'sm_dev_v1'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}

  function initMyRole() {
    attachRoleSearch(document.getElementById('mr-search'), document.getElementById('mr-suggest'), function (r) {
      ME = blankMe();
      ME.jobRole = r.n; ME.jobFamily = r.f; ME.role = r.s || ''; ME.level = r.l || '';
      ME.tgtRole = r.s || ''; ME.tgtLevel = r.l || '';
      document.getElementById('mr-search').value = r.n;
      track('role_selected', { scope: 'me', profiled: r.s ? 'yes' : 'no' });
      saveMe(); renderMyRole();
    });
    if (ME.jobRole) document.getElementById('mr-search').value = ME.jobRole;
    stampFreshness();
    renderMyRole();
  }

  /* Say how current the mapping is: staff should know when a title list is a snapshot. */
  function stampFreshness() {
    if (!JOBROLES_BUILT) return;
    var txt = JOBROLES.length + ' Vanderbilt job titles \u00b7 job architecture as of ' + JOBROLES_BUILT +
      '. If your title is missing or wrong, tell your Engagement Consultant.';
    ['mr-fresh', 'ttd-fresh'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = txt;
    });
  }

  function renderMyRole() {
    var chosen = document.getElementById('mr-chosen');
    var view = document.getElementById('mr-view');
    if (!chosen || !DATA) return;
    if (!ME.jobRole) {
      chosen.hidden = true;
      view.innerHTML = '<p class="rolepanel__empty">Search your job title above — your skills and the proficiency expected of you load here.</p>';
      return;
    }
    chosen.hidden = false;
    /* Level is pre-filled from the job code but always confirmable: staff move levels, and
       309 job codes carry no level at all. */
    chosen.innerHTML = '<p class="mr__title">' + esc(ME.jobRole) + '</p>' +
      '<p class="mr__maps">' + esc(ME.jobFamily) +
      (ME.role ? ' · maps to the <b>' + esc(ME.role) + '</b> skill profile' :
                 ' · <b class="tt-flagtext">no mapped skill profile yet</b>') +
      '<span class="mr__lvlwrap"><label for="mr-level">Confirm your level</label>' +
      '<select id="mr-level">' + levelOpts(ALL_LEVELS, ME.level, 'Select your level…') + '</select></span></p>' +
      (ME.role && ME.level && roleLevels(DATA.roles[ME.role]).indexOf(ME.level) < 0 ?
        '<p class="mr__note">The framework doesn’t define ' + esc(ME.level) + ' for this profile, so expectations come from the nearest level it does define.</p>' : '');

    if (!ME.level && ME.role) {
      view.innerHTML = '<p class="rolepanel__empty">Confirm your level above and your skills load with the proficiency expected of you.</p>';
      return;
    }
    view.innerHTML = auditBody(ME, COPY_ME);
    bindTargetSearch();
  }

  /* Manager view runs the same audit engine with manager-facing copy. */
  function renderDevelop() {
    var chosen = document.getElementById('ttd-chosen');
    var view = document.getElementById('ttd-view');
    if (!view || !DATA) return;
    if (!DEV.jobRole) {
      if (chosen) chosen.hidden = true;
      view.innerHTML = '<p class="rolepanel__empty">Search their job title above — every skill mapped to that role loads here, ready to rate.</p>';
      return;
    }
    if (chosen) {
      chosen.hidden = false;
      chosen.innerHTML = '<p class="mr__title">' + esc(DEV.jobRole) + '</p>' +
        '<p class="mr__maps">' + esc(DEV.jobFamily) +
        (DEV.role ? ' · maps to the <b>' + esc(DEV.role) + '</b> skill profile' :
                    ' · <b class="tt-flagtext">no mapped skill profile yet</b>') +
        '<span class="mr__lvlwrap"><label for="ttd-level">Confirm their level</label>' +
        '<select id="ttd-level">' + levelOpts(ALL_LEVELS, DEV.level, 'Select the level…') + '</select></span></p>' +
        (DEV.role && DEV.level && roleLevels(DATA.roles[DEV.role]).indexOf(DEV.level) < 0 ?
          '<p class="mr__note">The framework doesn’t define ' + esc(DEV.level) + ' for this profile, so expectations come from the nearest level it does define.</p>' : '');
    }
    if (!DEV.level && DEV.role) {
      view.innerHTML = '<p class="rolepanel__empty">Confirm their level above and the skills load with expected proficiency.</p>';
      return;
    }
    view.innerHTML = auditBody(DEV, COPY_MGR);
    bindTargetSearch();
  }

  /* ---------- Utils ---------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function plural(n) { return n === 1 ? '' : 's'; }
})();
