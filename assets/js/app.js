/* =====================================================================
   VANDERBILT SKILL MATRIX — CAREER PATHWAYS EXPLORER
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
      document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
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
    ['hero-path', 'nav-path'].forEach(function (id) {
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

  Promise.all([
    fetch('assets/data/sbja.json').then(function (r) { return r.json(); }),
    fetch('assets/data/oracle_courses.json').then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch('assets/data/library.json').then(function (r) { return r.json(); }).catch(function () { return []; })
  ]).then(function (res) {
    DATA = res[0];
    if (res[1]) ORACLE = res[1];
    LIB = res[2] || [];
    init();
    initSkillsFirst();
    initTeam();
  }).catch(function () {
    document.getElementById('from-panel').innerHTML =
      '<p class="rolepanel__empty">The skills data could not be loaded. Refresh to try again.</p>';
  });

  function oracleCoursesFor(skillName) {
    return ORACLE.skills[skillName] || [];
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
      document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
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
      ['Start where you are', 'Pick your current role. See the seven core competencies, the skills mapped to your role and AI-inferred skills in dashed grey.'],
      ['Choose a destination', 'Pick any role in any family \u2014 or move one level up in your own. Gold carries over. Oak bridges from what you know. Black outline is new ground.'],
      ['Get the plan', 'A printable plan: phase checklists, a skill table with Oracle Learning links and curated resources and a step-by-step Oracle playbook.']
    ],
    skills: [
      ['Pick your skills', 'Choose up to 10 skills from the library \u2014 search or browse \u2014 up to 3 core competencies you really do well, and up to 5 in your own words.'],
      ['Meet your matches', 'We match your skills against every Vanderbilt role and surface your five best fits, showing what you already bring to each.'],
      ['Get the plan', 'Choose a match and get the same printable plan: phase checklists, Oracle Learning links, curated resources and the Oracle playbook.']
    ],
    team: [
      ['Build your roster', 'Add each team member by role and level \u2014 no names, nothing identifying. The roster stays in your browser only.'],
      ['See the gaps', 'Four lenses: overall coverage, single-holder risk, readiness to cover a critical role, or a skill push you define.'],
      ['Develop each member', 'Generate a printable plan for any member \u2014 a step up in their current role, or a pathway to a role in or beyond your unit.']
    ]
  };
  function applyHowCopy(path) {
    HOW_COPY[path].forEach(function (c, i) {
      var el = document.querySelector('[data-how="' + (i + 1) + '"]');
      if (!el) return;
      el.querySelector('h3').textContent = c[0];
      el.querySelector('p').textContent = c[1];
    });
    document.querySelectorAll('.pathswitch__btn').forEach(function (x) {
      x.classList.toggle('on', x.dataset.path === path);
    });
  }

  /* Either/or paths: one workflow per visit unless the user starts over. */
  function enterRolesPath() {
    applyHowCopy('roles');
    document.getElementById('teamtool').hidden = true;
    document.getElementById('skillsfirst').hidden = true;
    document.getElementById('explore').hidden = false;
    document.getElementById('plan').hidden = false;
    document.getElementById('pickers').hidden = false;
    document.getElementById('mode-banner').hidden = true;
    document.getElementById('explore').classList.remove('skillsmode');
    if (fromSel.value === '__skills__') { fromSel.value = ''; toSel.value = ''; if (DATA) update(); }
  }
  function enterSkillsPath() {
    applyHowCopy('skills');
    document.getElementById('teamtool').hidden = true;
    document.getElementById('skillsfirst').hidden = false;
    document.getElementById('explore').hidden = true;
    document.getElementById('plan').hidden = true;
    if (fromSel.value || toSel.value) { fromSel.value = ''; toSel.value = ''; if (DATA) update(); }
  }
  function enterTeamPath() {
    applyHowCopy('team');
    document.getElementById('teamtool').hidden = false;
    document.getElementById('skillsfirst').hidden = true;
    document.getElementById('explore').hidden = true;
    document.getElementById('plan').hidden = true;
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
      '<td class="lt-why">' + why + '</td>' +
      '<td class="lt-learn">' + learn + '</td>' +
      '<td class="lt-date"><input type="date" class="dateinput" data-datekey="' + esc(dk) + '"' +
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
  var SF = { picked: [], core: [], typed: [] };
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

    search.addEventListener('input', function () {
      var q = normTxt(search.value);
      if (q.length < 2) { suggest.hidden = true; return; }
      var hits = [];
      for (var i = 0; i < LIB.length && hits.length < 12; i++) {
        if (normTxt(LIB[i][0]).indexOf(q) >= 0 && SF.picked.indexOf(LIB[i][0]) < 0) hits.push(LIB[i]);
      }
      suggest.innerHTML = hits.length ? hits.map(function (r) {
        return '<button type="button" data-add="' + esc(r[0]) + '"><b>' + esc(r[0]) + '</b><span>' +
          esc(r[1]) + (r[2] ? ' \u203a ' + esc(r[2]) : '') + '</span></button>';
      }).join('') : '<p>No matching skill. Add it in your own words below.</p>';
      suggest.hidden = false;
    });
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

    /* Browse the library by dropdown as well as by typing. */
    var catSel = document.getElementById('sf-cat');
    var skillSel = document.getElementById('sf-skillsel');
    function fillSkillSel(cat) {
      skillSel.innerHTML = '<option value="">Pick a skill to add\u2026</option>';
      var rows = LIB.filter(function (r) { return !cat || r[1] === cat; });
      if (cat) {
        rows.forEach(function (r) {
          var o = document.createElement('option');
          o.value = r[0]; o.textContent = r[0];
          skillSel.appendChild(o);
        });
      } else {
        var byCat = {};
        rows.forEach(function (r) { (byCat[r[1] || 'Other'] = byCat[r[1] || 'Other'] || []).push(r[0]); });
        Object.keys(byCat).sort().forEach(function (c) {
          var og = document.createElement('optgroup');
          og.label = c;
          byCat[c].forEach(function (n) {
            var o = document.createElement('option');
            o.value = n; o.textContent = n;
            og.appendChild(o);
          });
          skillSel.appendChild(og);
        });
      }
    }
    var cats = {};
    LIB.forEach(function (r) { if (r[1]) cats[r[1]] = true; });
    Object.keys(cats).sort().forEach(function (c) {
      var o = document.createElement('option');
      o.value = c; o.textContent = c;
      catSel.appendChild(o);
    });
    fillSkillSel('');
    catSel.addEventListener('change', function () { fillSkillSel(catSel.value); });
    skillSel.addEventListener('change', function () {
      var v = skillSel.value;
      if (v && SF.picked.indexOf(v) < 0 && SF.picked.length < 10) SF.picked.push(v);
      skillSel.value = '';
      renderSF();
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

  /* ---------- Manager team tool ---------- */
  var TEAM = { members: [], lens: 'coverage', target: '', custom: [] };
  try {
    var saved = JSON.parse(localStorage.getItem('sm_team_v1') || 'null');
    if (saved && saved.members) TEAM = saved;
  } catch (e) {}
  function saveTeam() {
    try { localStorage.setItem('sm_team_v1', JSON.stringify(TEAM)); } catch (e) {}
  }

  function memberLabel(m, i) { return 'Member ' + (i + 1) + ' \u00b7 ' + m.role + ' \u00b7 ' + m.level; }
  function memberProf(m, skillName) {
    var role = DATA.roles[m.role];
    if (!role) return null;
    var s = role.skills.filter(function (x) { return x.skill === skillName; })[0];
    if (!s) return null;
    return { mapped: true, at: s.prof && s.prof[m.level] ? s.prof[m.level] : null };
  }

  function initTeam() {
    var roleSel = document.getElementById('tt-role');
    var lvlSel = document.getElementById('tt-level');
    if (!roleSel) return;
    var byFamily = {};
    Object.keys(DATA.roles).forEach(function (key) {
      var fam = DATA.roles[key].family;
      (byFamily[fam] = byFamily[fam] || []).push(key);
    });
    Object.keys(byFamily).sort().forEach(function (fam) {
      var og = document.createElement('optgroup');
      og.label = fam;
      byFamily[fam].sort().forEach(function (key) {
        var o = document.createElement('option');
        o.value = key; o.textContent = key;
        og.appendChild(o);
      });
      roleSel.appendChild(og);
    });
    roleSel.addEventListener('change', function () {
      lvlSel.innerHTML = '<option value="">Level\u2026</option>';
      var role = DATA.roles[roleSel.value];
      if (!role) return;
      roleLevels(role).forEach(function (l) {
        var st = streamOf(l);
        var o = document.createElement('option');
        o.value = l; o.textContent = l + ' \u00b7 ' + (st ? st.label : '');
        lvlSel.appendChild(o);
      });
    });
    document.getElementById('tt-add').addEventListener('click', function () {
      if (!roleSel.value || !lvlSel.value || TEAM.members.length >= 20) return;
      TEAM.members.push({ role: roleSel.value, level: lvlSel.value });
      saveTeam(); renderTeam();
    });
    document.getElementById('tt-lens').addEventListener('click', function (e) {
      var b = e.target.closest('.ttlens');
      if (!b) return;
      TEAM.lens = b.dataset.ttlens;
      saveTeam(); renderTeam();
    });
    renderTeam();
  }

  function renderTeam() {
    document.getElementById('tt-count').textContent = TEAM.members.length + ' member' + plural(TEAM.members.length);
    document.getElementById('tt-roster').innerHTML = TEAM.members.map(function (m, i) {
      return '<li><span class="pill">' + esc(memberLabel(m, i)) +
        '<button type="button" class="tt-devbtn" data-ttdev="' + i + '">Develop</button>' +
        '<button type="button" class="sf-x" data-ttremove="' + i + '" aria-label="Remove">&times;</button></span></li>';
    }).join('');
    var hint = document.getElementById('tt-devhint');
    if (hint) hint.hidden = TEAM.members.length === 0;
    document.getElementById('tt-lens').hidden = TEAM.members.length === 0;
    document.querySelectorAll('.ttlens').forEach(function (b) {
      b.classList.toggle('on', b.dataset.ttlens === TEAM.lens);
    });
    var view = document.getElementById('tt-view');
    if (!TEAM.members.length) {
      view.innerHTML = '<p class="rolepanel__empty">Add your team above \u2014 role and level per member \u2014 and the coverage view builds itself here.</p>';
      return;
    }
    if (TEAM.lens === 'develop') view.innerHTML = ttDevelop();
    else if (TEAM.lens === 'coverage') view.innerHTML = ttCoverage();
    else if (TEAM.lens === 'stepup') view.innerHTML = ttStepup();
    else if (TEAM.lens === 'target') view.innerHTML = ttTarget();
    else view.innerHTML = ttCustom();
  }
  document.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-ttremove]');
    if (rm) {
      TEAM.members.splice(+rm.dataset.ttremove, 1);
      TEAM.dev = null;
      if (TEAM.lens === 'develop') TEAM.lens = 'coverage';
      saveTeam(); renderTeam();
      return;
    }
    var devBtn = e.target.closest('[data-ttdev]');
    if (devBtn) {
      var mi = +devBtn.dataset.ttdev, mm = TEAM.members[mi];
      if (!mm) return;
      TEAM.dev = { i: mi, dir: 'current', role: mm.role, level: mm.level, ratings: {}, built: false };
      TEAM.lens = 'develop';
      saveTeam(); renderTeam();
      document.getElementById('tt-view').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    var dirBtn = e.target.closest('[data-ttdir]');
    if (dirBtn && TEAM.dev) {
      var dm = TEAM.members[TEAM.dev.i];
      TEAM.dev.dir = dirBtn.dataset.ttdir;
      TEAM.dev.ratings = {}; TEAM.dev.built = false;
      if (TEAM.dev.dir === 'current') { TEAM.dev.role = dm.role; TEAM.dev.level = dm.level; }
      else if (TEAM.dev.dir === 'up') {
        TEAM.dev.role = dm.role;
        TEAM.dev.level = nextLevelUp(DATA.roles[dm.role], dm.level) || devLevelsAbove(dm)[0] || '';
      } else { TEAM.dev.role = ''; TEAM.dev.level = ''; }
      saveTeam(); renderTeam();
      return;
    }
    if (e.target.closest('#tt-dev-back')) {
      TEAM.lens = 'coverage';
      saveTeam(); renderTeam();
      return;
    }
    if (e.target.closest('#tt-dev-build')) {
      if (TEAM.dev) { TEAM.dev.built = true; saveTeam(); renderTeam(); }
      var pl = document.getElementById('tt-devplan');
      if (pl) pl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    var planBtn = e.target.closest('[data-ttplan]');
    if (planBtn) {
      var d = JSON.parse(planBtn.dataset.ttplan);
      enterRolesPath();
      fromSel.value = d.from;
      if (d.up) {
        toSel.value = '__up__';
        syncLevelPicker();
        document.getElementById('level-select').value = d.level;
      } else {
        toSel.value = d.to;
        syncLevelPicker();
      }
      update();
      document.getElementById('plan').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    var tsel = e.target.closest('#tt-target-go');
    if (tsel) {
      TEAM.target = document.getElementById('tt-target-sel').value;
      saveTeam(); renderTeam();
      return;
    }
    var addCustom = e.target.closest('[data-ttcustomadd]');
    if (addCustom) {
      var v = document.getElementById('tt-custom-sel').value;
      if (v && TEAM.custom.indexOf(v) < 0 && TEAM.custom.length < 15) TEAM.custom.push(v);
      saveTeam(); renderTeam();
      return;
    }
    var rmCustom = e.target.closest('[data-ttcustomrm]');
    if (rmCustom) {
      TEAM.custom = TEAM.custom.filter(function (x) { return x !== rmCustom.dataset.ttcustomrm; });
      saveTeam(); renderTeam();
      return;
    }
    if (e.target.closest('#tt-print')) { print(); }
  });

  /* Assess-and-plan: rating selects and target pickers re-render the develop view. */
  document.addEventListener('change', function (e) {
    if (!TEAM.dev) return;
    if (e.target.id === 'tt-dev-role') {
      TEAM.dev.role = e.target.value;
      var r = DATA.roles[TEAM.dev.role];
      var lvls = r ? roleLevels(r) : [];
      var curLvl = TEAM.members[TEAM.dev.i].level;
      TEAM.dev.level = lvls.indexOf(curLvl) >= 0 ? curLvl : (lvls[0] || '');
      TEAM.dev.ratings = {}; TEAM.dev.built = false;
      saveTeam(); renderTeam();
    } else if (e.target.id === 'tt-dev-level') {
      TEAM.dev.level = e.target.value;
      TEAM.dev.ratings = {}; TEAM.dev.built = false;
      saveTeam(); renderTeam();
    } else if (e.target.hasAttribute && e.target.hasAttribute('data-ttrate')) {
      var sk = e.target.dataset.ttrate, f = e.target.dataset.field;
      (TEAM.dev.ratings[sk] = TEAM.dev.ratings[sk] || {})[f] = +e.target.value;
      saveTeam(); renderTeam();
    }
  });

  /* Expected proficiency as a 1-5 index at a level, falling back to the nearest level with data. */
  function profIdxAt(s, level) {
    if (!s.prof) return 0;
    if (s.prof[level]) return PROF_ORDER[s.prof[level]] || 0;
    var idx = LEVEL_ORDER.indexOf(level);
    for (var d = 1; d < LEVEL_ORDER.length; d++) {
      var lo = LEVEL_ORDER[idx - d], hi = LEVEL_ORDER[idx + d];
      if (lo && s.prof[lo]) return PROF_ORDER[s.prof[lo]] || 0;
      if (hi && s.prof[hi]) return PROF_ORDER[s.prof[hi]] || 0;
    }
    return 0;
  }
  function devLevelsAbove(m) {
    var role = DATA.roles[m.role];
    if (!role) return [];
    var ci = LEVEL_ORDER.indexOf(m.level);
    return roleLevels(role).filter(function (l) { return LEVEL_ORDER.indexOf(l) > ci; });
  }

  /* Target-role skills with pre-filled ratings: "needs to be" from the framework's expected
     proficiency at the target role and level; "they're at" from the member's current role at
     their current level — Awareness when the current role doesn't carry the skill at all.
     Manager overrides live in TEAM.dev.ratings. */
  function devSkillList() {
    var d = TEAM.dev, m = TEAM.members[d.i];
    var tgt = DATA.roles[d.role], cur = DATA.roles[m.role];
    if (!tgt || !d.level) return [];
    var curBy = {};
    if (cur) cur.skills.forEach(function (s) { curBy[s.skill] = s; });
    return tgt.skills.map(function (s) {
      var c = curBy[s.skill];
      var atPre = c ? (profIdxAt(c, m.level) || 1) : 1;
      var needPre = profIdxAt(s, d.level) || 3;
      var r = d.ratings[s.skill] || {};
      return { skill: s, at: r.at || atPre, need: r.need || needPre, mapped: !!c };
    });
  }

  function profSel(skillName, field, val) {
    return '<select data-ttrate="' + esc(skillName) + '" data-field="' + field + '" aria-label="' +
      (field === 'at' ? 'Proficiency they are at' : 'Proficiency they need') + ' for ' + esc(skillName) + '">' +
      PROF_NAMES.map(function (p, i) {
        return '<option value="' + (i + 1) + '"' + (i + 1 === val ? ' selected' : '') + '>' + p + '</option>';
      }).join('') + '</select>';
  }

  function ttDevelop() {
    var d = TEAM.dev;
    if (!d || !TEAM.members[d.i]) { TEAM.lens = 'coverage'; return ttCoverage(); }
    var m = TEAM.members[d.i];
    var html = '<button type="button" class="tt-devback" id="tt-dev-back">&larr; Back to the team lenses</button>' +
      '<p class="sf__cardfam">' + esc(memberLabel(m, d.i)) + '</p>' +
      '<h3 class="tt__h">Develop this member</h3>' +
      '<p class="tt__sub">Pick the direction, then rate each skill: where this person <b>is today</b> and where they <b>need to be</b>. ' +
      'Both start pre-filled from the framework’s expectations — adjust them to your read. The plan builds from the gaps.</p>';

    var dirs = [
      ['current', 'Grow in their current role', esc(m.role) + ' at ' + esc(m.level)],
      ['up', 'Step up in this track', 'A higher level in ' + esc(m.role)],
      ['other', 'A different role', 'Upward in the sub-family or somewhere new entirely']
    ];
    html += '<div class="lensrow tt__dirrow">' + dirs.map(function (x) {
      return '<button type="button" class="ttdir' + (d.dir === x[0] ? ' on' : '') + '" data-ttdir="' + x[0] + '">' +
        '<b>' + x[1] + '</b><span>' + x[2] + '</span></button>';
    }).join('') + '</div>';

    if (d.dir === 'up') {
      var above = devLevelsAbove(m);
      if (!above.length) {
        return html + '<p class="tt__sub"><b class="tt-flagtext">' + esc(m.level) + ' is the top mapped level for ' + esc(m.role) +
          '.</b> Choose “A different role” to keep this person growing.</p>';
      }
      html += '<div class="tt__addrow tt__targetrow"><label class="tt__targetlbl" for="tt-dev-level">Target level</label>' +
        '<select id="tt-dev-level">' + above.map(function (l) {
          var st = streamOf(l);
          return '<option value="' + l + '"' + (d.level === l ? ' selected' : '') + '>' + l + ' · ' + (st ? st.label : '') + '</option>';
        }).join('') + '</select></div>';
    } else if (d.dir === 'other') {
      var byFam = {};
      Object.keys(DATA.roles).forEach(function (k) {
        if (k === m.role) return;
        (byFam[DATA.roles[k].family] = byFam[DATA.roles[k].family] || []).push(k);
      });
      var ropts = '';
      Object.keys(byFam).sort().forEach(function (fam) {
        ropts += '<optgroup label="' + esc(fam) + '">' + byFam[fam].sort().map(function (k) {
          return '<option value="' + esc(k) + '"' + (d.role === k ? ' selected' : '') + '>' + esc(k) + '</option>';
        }).join('') + '</optgroup>';
      });
      html += '<div class="tt__addrow tt__targetrow">' +
        '<select id="tt-dev-role"><option value="">Destination role…</option>' + ropts + '</select>';
      var tgtRole = DATA.roles[d.role];
      if (tgtRole && d.role !== m.role) {
        html += '<select id="tt-dev-level">' + roleLevels(tgtRole).map(function (l) {
          var st = streamOf(l);
          return '<option value="' + l + '"' + (d.level === l ? ' selected' : '') + '>' + l + ' · ' + (st ? st.label : '') + '</option>';
        }).join('') + '</select>';
      }
      html += '</div>';
      if (!tgtRole) return html + '<p class="tt__sub">Pick the destination role and target level — the skills and expected proficiencies load from there.</p>';
    }

    var list = devSkillList();
    if (!list.length) return html;
    var gaps = list.filter(function (g) { return g.need > g.at; });
    var strengths = list.length - gaps.length;

    html += '<p class="tt__sub tt__target">Target: <b>' + esc(d.role) + '</b> at <b>' + esc(d.level) + '</b> · ' +
      list.length + ' skills to rate · <b class="tt-flagtext">' + gaps.length + ' gap' + plural(gaps.length) + '</b> · ' +
      strengths + ' at or above target</p>';

    html += '<div class="tablewrap tt__tablewrap"><table class="learntable tt__table tt__ratetable">' +
      '<thead><tr><th>Skill</th><th>They’re at</th><th>Needs to be</th><th>Gap</th></tr></thead><tbody>' +
      list.map(function (g) {
        var gap = g.need - g.at;
        var gapCell = gap > 0 ? '<span class="tt-gapchip">+' + gap + '</span>' :
          gap === 0 ? '<span class="tt-okchip">at target</span>' : '<span class="tt-okchip">above</span>';
        return '<tr><td class="tt-skill"><button type="button" class="skill-link" data-skill="' + esc(g.skill.skill) +
          '" data-kind="role" data-role="' + esc(d.role) + '">' + esc(g.skill.skill) + '</button>' +
          (g.mapped ? '' : '<span class="tt-flag">new to them</span>') + '</td>' +
          '<td>' + profSel(g.skill.skill, 'at', g.at) + '</td>' +
          '<td>' + profSel(g.skill.skill, 'need', g.need) + '</td>' +
          '<td>' + gapCell + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="plan__actions"><button type="button" class="btn btn--dark" id="tt-dev-build">' +
      (d.built ? 'Update the development plan' : 'Build the development plan') + '</button></div>';

    if (d.built) html += ttDevPlan(list);
    return html;
  }

  function ttDevRow(g, i) {
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
    var dk = 'dev:' + TEAM.dev.i + ':' + TEAM.dev.role + ':' + TEAM.dev.level + ':' + s.skill;
    var dv = DATES[dk] || '';
    return '<tr>' +
      '<td class="lt-done"><span class="ckbox" aria-hidden="true"></span></td>' +
      '<td class="lt-pri">' + (i + 1) + '</td>' +
      '<td class="lt-skill"><button type="button" class="skill-link" data-skill="' + esc(s.skill) +
        '" data-kind="' + (g ? 'role' : 'univ') + '" data-role="' + esc(TEAM.dev.role) + '">' + esc(s.skill) + '</button></td>' +
      '<td class="lt-why">' + why + '</td>' +
      '<td class="lt-learn">' + learn + '</td>' +
      '<td class="lt-date"><input type="date" class="dateinput" data-datekey="' + esc(dk) + '"' +
        (dv ? ' value="' + esc(dv) + '"' : '') + ' aria-label="Target date for ' + esc(s.skill) + '"></td>' +
      '</tr>';
  }

  /* The ratings-driven plan: gaps only, biggest gap first; at-or-above skills become strengths. */
  function ttDevPlan(list) {
    var d = TEAM.dev, m = TEAM.members[d.i];
    var gaps = list.filter(function (g) { return g.need > g.at; }).sort(function (x, y) {
      return (y.need - y.at) - (x.need - x.at) || y.need - x.need || x.skill.skill.localeCompare(y.skill.skill);
    });
    var strengths = list.filter(function (g) { return g.need <= g.at; }).sort(function (x, y) {
      return y.at - x.at || x.skill.skill.localeCompare(y.skill.skill);
    });
    var dirText = d.dir === 'current' ? 'growth in their current role, <b>' + esc(d.role) + '</b> at <b>' + esc(d.level) + '</b>' :
      d.dir === 'up' ? 'a step up to <b>' + esc(d.level) + '</b> in <b>' + esc(d.role) + '</b>' :
      'a pathway to <b>' + esc(d.role) + '</b> at <b>' + esc(d.level) + '</b>';

    var rows = [ttDevRow(null, 0)].concat(gaps.map(function (g, i) { return ttDevRow(g, i + 1); })).join('');

    var strengthHtml = strengths.length ?
      '<h4 class="tt__strengthh">Strengths to build on</h4>' +
      '<p class="tt__sub">Rated at or above the target — name these in the conversation, and use them as the platform the gap work stands on.</p>' +
      '<ul class="pills tt__strengths">' + strengths.map(function (g) {
        return '<li><span class="pill">' + esc(g.skill.skill) + ' · ' + PROF_NAMES[g.at - 1] + '</span></li>';
      }).join('') + '</ul>' : '';

    return '<div class="tt__devplan" id="tt-devplan">' +
      '<h3 class="tt__h">Development plan · ' + esc(memberLabel(m, d.i)) + '</h3>' +
      '<p class="tt__sub">Built from your ratings for ' + dirText + ': <b class="tt-flagtext">' + gaps.length +
      ' gap skill' + plural(gaps.length) + '</b>, biggest gap first, plus AI Workforce Readiness — assumed for every role. ' +
      'Print it and hand it over in your next development conversation. <b>Development, not evaluation</b> — no names on this page, and the plan lives only in your browser. ' +
      'Have the member log each skill as a development goal in ' + oa('Oracle Grow', ORA.grow) + '.</p>' +
      (gaps.length ? '' : '<p class="tt__sub"><b>No gaps at your current ratings.</b> Adjust “needs to be” upward where you want stretch, or point this member at a bigger target.</p>') +
      '<div class="tablewrap"><table class="learntable">' +
      '<thead><tr><th></th><th>#</th><th>Skill</th><th>Why it’s here</th><th>Oracle Learning</th><th>Target date</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
      skillResources(gaps.map(function (g) { return { skill: g.skill }; })) +
      strengthHtml +
      '<div class="plan__actions"><button type="button" class="btn" id="tt-print">Print this plan</button></div>' +
      '</div>';
  }

  /* Lens 1: team skill coverage with single-holder risk */
  function ttCoverage() {
    var skills = {};
    TEAM.members.forEach(function (m, i) {
      var role = DATA.roles[m.role];
      if (!role) return;
      role.skills.forEach(function (s) {
        (skills[s.skill] = skills[s.skill] || { cat: s.category, holders: [] }).holders.push(i);
      });
    });
    var names = Object.keys(skills).sort(function (x, y) {
      return skills[x].holders.length - skills[y].holders.length || x.localeCompare(y);
    });
    var singles = names.filter(function (n) { return skills[n].holders.length === 1; });
    var head = TEAM.members.map(function (m, i) {
      return '<th title="' + esc(m.role + ' \u00b7 ' + m.level) + '">M' + (i + 1) + '</th>';
    }).join('');
    var rows = names.map(function (n) {
      var e_ = skills[n];
      var single = e_.holders.length === 1;
      var cells = TEAM.members.map(function (m, i) {
        if (e_.holders.indexOf(i) < 0) return '<td class="tt-no"></td>';
        var p = memberProf(m, n);
        return '<td class="tt-yes">' + (p && p.at ? esc(p.at).slice(0, 3) + '.' : '\u25cf') + '</td>';
      }).join('');
      return '<tr' + (single ? ' class="tt-single"' : '') + '><td class="tt-skill">' +
        '<button type="button" class="skill-link" data-skill="' + esc(n) + '" data-kind="role" data-role="' +
        esc(TEAM.members[e_.holders[0]].role) + '">' + esc(n) + '</button>' +
        (single ? '<span class="tt-flag">single holder</span>' : '') + '</td>' + cells + '</tr>';
    }).join('');
    return '<h3 class="tt__h">Coverage across ' + TEAM.members.length + ' member' + plural(TEAM.members.length) + '</h3>' +
      '<p class="tt__sub">' + names.length + ' skills mapped across the team \u00b7 <b class="tt-flagtext">' + singles.length +
      ' held by a single member</b> \u2014 your succession risk. Cells show expected proficiency at that member\u2019s level (Awa/Dev/Int/Adv/Exp).</p>' +
      '<div class="tablewrap tt__tablewrap"><table class="learntable tt__table">' +
      '<thead><tr><th>Skill</th>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="plan__actions"><button type="button" class="btn" id="tt-print">Print team snapshot</button></div>';
  }

  /* Lens 2: level-up readiness per member */
  function ttStepup() {
    var cards = TEAM.members.map(function (m, i) {
      var role = DATA.roles[m.role];
      if (!role) return '';
      var nxt = nextLevelUp(role, m.level);
      var inner;
      if (!nxt) {
        inner = '<p class="tt__cardnote">Top of this track \u2014 develop toward a destination role instead.</p>' +
          '<button type="button" class="btn btn--dark" data-ttplan=\'' + JSON.stringify({ from: m.role, up: false, to: '' }) + '\'>Open the explorer</button>';
      } else {
        var la = levelAnalyze(role, m.level, nxt);
        inner = '<p class="tt__cardnote"><b>' + esc(m.level) + ' \u2192 ' + esc(nxt) + '</b>: ' +
          la.deepen.length + ' skill' + plural(la.deepen.length) + ' deepen, ' +
          la.fresh.length + ' new expectation' + plural(la.fresh.length) + '. Step-up readiness ' + la.pct + '%.</p>' +
          '<button type="button" class="btn btn--dark" data-ttplan=\'' + JSON.stringify({ from: m.role, up: true, level: m.level }) + '\'>Build step-up plan</button>';
      }
      return '<div class="sf__card"><p class="sf__cardfam">' + esc(memberLabel(m, i)) + '</p><h4>' + esc(m.role) + '</h4>' + inner + '</div>';
    }).join('');
    return '<h3 class="tt__h">Level-up readiness</h3>' +
      '<p class="tt__sub">The bench-building view: each member\u2019s step to the next level in their track. Plans print ready to hand over.</p>' +
      '<div class="sf__cards">' + cards + '</div>';
  }

  /* Lens 3: cover a target role */
  function ttTarget() {
    var opts = '';
    var byFamily = {};
    Object.keys(DATA.roles).forEach(function (key) {
      (byFamily[DATA.roles[key].family] = byFamily[DATA.roles[key].family] || []).push(key);
    });
    Object.keys(byFamily).sort().forEach(function (fam) {
      opts += '<optgroup label="' + esc(fam) + '">' + byFamily[fam].sort().map(function (k) {
        return '<option value="' + esc(k) + '"' + (TEAM.target === k ? ' selected' : '') + '>' + esc(k) + '</option>';
      }).join('') + '</optgroup>';
    });
    var pickHtml = '<div class="tt__addrow"><select id="tt-target-sel"><option value="">Role your team must cover\u2026</option>' + opts + '</select>' +
      '<button type="button" class="btn btn--dark" id="tt-target-go">Assess coverage</button></div>';
    if (!TEAM.target || !DATA.roles[TEAM.target]) {
      return '<h3 class="tt__h">Cover a role</h3><p class="tt__sub">New work landing on the team? A critical role to backfill? Pick it and see how close each member is.</p>' + pickHtml;
    }
    var target = DATA.roles[TEAM.target];
    var ranked = TEAM.members.map(function (m, i) {
      var from = DATA.roles[m.role];
      var a = from === target ? { pct: 100, matches: target.skills, bridges: [], growth: [] } : analyze(from, target);
      return { i: i, m: m, a: a };
    }).sort(function (x, y) { return y.a.pct - x.a.pct; });
    var covered = {};
    TEAM.members.forEach(function (m) {
      var role = DATA.roles[m.role];
      role.skills.forEach(function (s) { covered[s.skill] = true; });
    });
    var missing = target.skills.filter(function (s) { return !covered[s.skill]; });
    var cards = ranked.map(function (r) {
      return '<div class="sf__card"><p class="sf__cardfam">' + esc(memberLabel(r.m, r.i)) + '</p>' +
        '<h4>' + r.a.pct + '% ready</h4>' +
        '<div class="sf__cardbar"><i style="width:' + r.a.pct + '%"></i></div>' +
        '<p class="tt__cardnote">' + r.a.matches.length + ' matched \u00b7 ' + r.a.bridges.length + ' bridge \u00b7 ' +
        r.a.growth.length + ' to grow</p>' +
        (r.m.role === TEAM.target ? '<p class="tt__cardnote">Already in this role.</p>' :
        '<button type="button" class="btn btn--dark" data-ttplan=\'' + JSON.stringify({ from: r.m.role, up: false, to: TEAM.target }) + '\'>Build pathway plan</button>') +
        '</div>';
    }).join('');
    return '<h3 class="tt__h">Covering: ' + esc(TEAM.target) + '</h3>' + pickHtml +
      '<p class="tt__sub">Ranked by readiness. ' + (missing.length ?
        '<b class="tt-flagtext">' + missing.length + ' of the role\u2019s skills exist nowhere on your team:</b> ' +
        missing.slice(0, 8).map(function (s) { return esc(s.skill); }).join(' \u00b7 ') + (missing.length > 8 ? ' +' + (missing.length - 8) + ' more' : '') :
        'Every skill this role needs exists somewhere on your team.') + '</p>' +
      '<div class="sf__cards">' + cards + '</div>' +
      '<div class="plan__actions"><button type="button" class="btn" id="tt-print">Print team snapshot</button></div>';
  }

  /* Lens 4: custom skill push */
  function ttCustom() {
    var opts = '';
    var byCat = {};
    LIB.forEach(function (r) { (byCat[r[1] || 'Other'] = byCat[r[1] || 'Other'] || []).push(r[0]); });
    Object.keys(byCat).sort().forEach(function (c) {
      opts += '<optgroup label="' + esc(c) + '">' + byCat[c].map(function (n) {
        return '<option value="' + esc(n) + '">' + esc(n) + '</option>';
      }).join('') + '</optgroup>';
    });
    var pick = '<div class="tt__addrow"><select id="tt-custom-sel"><option value="">Add a skill to the push\u2026</option>' + opts + '</select>' +
      '<button type="button" class="btn btn--dark" data-ttcustomadd>Add skill</button></div>' +
      '<ul class="pills sf__picked">' + TEAM.custom.map(function (n) {
        return '<li><span class="pill">' + esc(n) + '<button type="button" class="sf-x" data-ttcustomrm="' + esc(n) + '" aria-label="Remove">&times;</button></span></li>';
      }).join('') + '</ul>';
    if (!TEAM.custom.length) {
      return '<h3 class="tt__h">A skill push</h3><p class="tt__sub">Driving something across the whole team \u2014 AI readiness, a new system, safety recerts? Pick the skills and see who already carries them.</p>' + pick;
    }
    var rows = TEAM.custom.map(function (n) {
      var holders = TEAM.members.map(function (m, i) {
        var role = DATA.roles[m.role];
        var has = role && role.skills.some(function (s) { return s.skill === n; });
        return has ? 'M' + (i + 1) : null;
      }).filter(Boolean);
      var oc = oracleCoursesFor(n);
      return '<tr><td class="tt-skill">' + esc(n) + '</td>' +
        '<td>' + (holders.length ? holders.join(', ') : '<b class="tt-flagtext">no one yet</b>') + '</td>' +
        '<td>' + (oc.length ? oc.slice(0, 2).map(function (c) {
          return '<a href="' + ORACLE.prefix + c.id + '" target="_blank" rel="noopener">' + esc(c.n) + '</a>';
        }).join('<br>') : '<span class="lt-none">Not in the Oracle catalog \u2014 use skill resources and log it in Grow.</span>') + '</td></tr>';
    }).join('');
    return '<h3 class="tt__h">A skill push</h3>' + pick +
      '<p class="tt__sub">Who carries each skill today (by role profile), and where to send everyone else. Every member should log the goal in Oracle Grow.</p>' +
      '<div class="tablewrap tt__tablewrap"><table class="learntable tt__table">' +
      '<thead><tr><th>Skill</th><th>Held today by</th><th>Oracle Learning</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
      '<div class="plan__actions"><button type="button" class="btn" id="tt-print">Print team snapshot</button></div>';
  }

  /* ---------- Utils ---------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function plural(n) { return n === 1 ? '' : 's'; }
})();
