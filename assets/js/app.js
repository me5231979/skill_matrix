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

  /* Entry acknowledgment: outcomes note as a gate, once per browser. */
  (function () {
    var KEY = 'sm_ack_v1';
    var seen = false;
    try { seen = !!localStorage.getItem(KEY); } catch (e) { seen = false; }
    if (seen) return;
    var d = document.getElementById('ack-modal');
    if (!d || !d.showModal) return;
    d.addEventListener('cancel', function (e) { e.preventDefault(); });
    document.getElementById('ack-btn').addEventListener('click', function () {
      try { localStorage.setItem(KEY, new Date().toISOString()); } catch (e) {}
      d.close();
    });
    d.showModal();
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

  Promise.all([
    fetch('assets/data/sbja.json').then(function (r) { return r.json(); }),
    fetch('assets/data/oracle_courses.json').then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (res) {
    DATA = res[0];
    if (res[1]) ORACLE = res[1];
    init();
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

    fromSel.addEventListener('change', update);
    toSel.addEventListener('change', update);

    // Restore a shared link: #from=Dining%20Services&to=Network%20Support
    var params = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (params.get('from') && DATA.roles[params.get('from')]) fromSel.value = params.get('from');
    if (params.get('to') && DATA.roles[params.get('to')]) toSel.value = params.get('to');
    if (fromSel.value || toSel.value) update();
  }

  function update() {
    var from = DATA.roles[fromSel.value] || null;
    var to = DATA.roles[toSel.value] || null;

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

  function learnRow(t, i) {
    var s = t.skill;

    var why = t.tag === 'universal' ? '<span class="lt-tag lt-tag--univ">Universal</span> assumed development need for every role' :
      t.tag === 'bridge' ? '<span class="lt-tag lt-tag--bridge">Bridge</span> near your <b>' + esc(t.via) + '</b>' :
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
        '" data-kind="' + (s === AI_READINESS ? 'univ' : 'role') + '" data-role="' + esc(toSel.value) + '">' +
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

  /* ---------- Utils ---------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function plural(n) { return n === 1 ? '' : 's'; }
})();
