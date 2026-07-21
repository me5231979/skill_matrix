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

  /* ---------- Vanderbilt Course Library: live courses by the skills they build ---------- */
  var VU_COURSES = [
    { name: 'AI Basics', url: 'https://me5231979.github.io/AI_Classroom/',
      skills: ['Embodies an entrepreneurial spirit and leverages data and technology', 'Artificial Intelligence', 'Digital Fluency/Information Literacy', 'Data Security'] },
    { name: 'Navigating Difficult Conversations', url: 'https://me5231979.github.io/Difficult_Conversations/',
      skills: ['Leads and inspires teams', 'Conflict Resolution', 'De-escalation Techniques', 'Influencing Skills'] },
    { name: 'Coaching for Performance', url: 'https://me5231979.github.io/Coaching-for-Performance/',
      skills: ['Grows self and others', 'Leads and inspires teams', 'Coaching Techniques', 'Leadership Development', 'Employee Engagement'] },
    { name: 'AI 201: Beyond the Basics', url: 'https://me5231979.github.io/AI-Advanced/',
      skills: ['Embodies an entrepreneurial spirit and leverages data and technology', 'Makes effective and ethical decisions for the University', 'Artificial Intelligence', 'Data Governance', 'Risk Management'] },
    { name: 'Emotional Intelligence & Interpersonal Skills', url: 'https://me5231979.github.io/Emotional-Intelligence/',
      skills: ['Grows self and others', 'Radically collaborates and cultivates belonging', 'Conflict Management', 'Communication Strategies'] },
    { name: 'Presentation & Public Speaking', url: 'https://me5231979.github.io/Presentation-Public-Speaking/',
      skills: ['Continuously strives for excellence', 'Public Speaking', 'Storytelling', 'Strategic Communication', 'Stakeholder Communications'] }
  ];

  /* Universal AI-readiness skill: needed for every role, assumed to need development everywhere.
     Deliberately NOT gold — it is not part of the official framework. */
  var AI_READINESS = {
    skill: 'AI Workforce Readiness',
    type: 'Universal',
    category: 'AI-Enabled Work',
    subcategory: 'Applies to all Vanderbilt roles',
    definition: 'Capability to work effectively in AI-enabled work: understanding what AI can and cannot do, prompting and directing AI tools well, critically verifying AI output before acting on it, handling data responsibly by sensitivity tier, and redesigning everyday workflows to pair human judgment with AI assistance. Assumed to need development for every role at every level.',
    prof: null
  };

  var STREAMS = [
    { label: 'Service & Support', levels: ['S1', 'S2', 'S3', 'S4'] },
    { label: 'Individual Contributor', levels: ['IC1', 'IC2', 'IC3', 'IC4', 'IC5'] },
    { label: 'Project Management', levels: ['PM1', 'PM2', 'PM3', 'PM4', 'PM5'] },
    { label: 'Management', levels: ['M1', 'M2', 'M3', 'M4', 'M5'] },
    { label: 'Executive', levels: ['E1', 'E2', 'E3'] }
  ];

  var DATA = null;

  fetch('assets/data/sbja.json')
    .then(function (r) { return r.json(); })
    .then(function (json) { DATA = json; init(); })
    .catch(function () {
      document.getElementById('from-panel').innerHTML =
        '<p class="rolepanel__empty">The skills data could not be loaded. Refresh to try again.</p>';
    });

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
      skillGroup('Core competencies', 'every Vanderbilt role', DATA.core.map(function (c) {
        return pillBtn(c.name, 'pill--core', { kind: 'core' });
      }));

    Object.keys(groups).forEach(function (type) {
      if (!groups[type].length) return;
      html += skillGroup(type + ' skills', 'official framework', groups[type].map(function (s) {
        return pillBtn(s.skill, s.type === 'Behavioral' ? 'pill--behav' : '', { kind: 'role', role: role.subfamily });
      }));
    });

    if (role.probable && role.probable.length) {
      html += skillGroup('Probable skills', 'AI-inferred, not official', role.probable.map(function (s) {
        return pillBtn(s.skill, 'pill--ai', { kind: 'ai', role: role.subfamily });
      }));
    }

    html += skillGroup('AI-enabled work', 'universal — develop for every role', [
      pillBtn(AI_READINESS.skill, 'pill--univ', { kind: 'univ' })
    ]);
    panel.innerHTML = html;
  }

  function skillGroup(label, hint, pills) {
    return '<div class="skillgroup"><p class="skillgroup__label">' + esc(label) +
      ' <span class="hint">&middot; ' + esc(hint) + '</span></p><ul class="pills">' +
      pills.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  }

  function pillBtn(name, cls, data) {
    return '<button type="button" class="pill ' + cls + '" data-skill="' + esc(name) +
      '" data-kind="' + data.kind + '"' + (data.role ? ' data-role="' + esc(data.role) + '"' : '') + '>' +
      esc(name) + '</button>';
  }

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

    var matches = [], bridges = [], growth = [], score = 0;
    to.skills.forEach(function (s) {
      if (fromByName[s.skill]) {
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
             pct: Math.min(pct, 98) };
  }

  /* ---------- Comparison ---------- */
  function renderCompare(from, to) {
    var box = document.getElementById('compare');
    if (!from || !to) { box.hidden = true; box.innerHTML = ''; return; }
    if (from === to) {
      box.hidden = false;
      box.innerHTML = '<p class="bucket__none">That’s the role you’re already in — pick a different destination to compare.</p>';
      return;
    }
    var a = analyze(from, to);

    var html =
      '<div class="readiness" data-pct="' + a.pct + '">' +
        '<div><p class="readiness__num">' + a.pct + '<small>%</small></p>' +
        '<span class="readiness__label">Transfer readiness</span></div>' +
        '<div class="readiness__barwrap"><div class="readiness__bar"><div class="readiness__fill"></div></div>' +
        '<p class="readiness__note">All six core competencies carry with you, plus ' +
        a.matches.length + ' matched skill' + plural(a.matches.length) + ' and ' +
        a.bridges.length + ' bridge skill' + plural(a.bridges.length) + ' toward <strong>' +
        esc(to.subfamily) + '</strong>. ' + a.growth.length + ' skill' + plural(a.growth.length) +
        ' to grow.</p></div></div>' +

      '<div class="buckets">' +
        bucket('bucket--match', 'Skills that carry', 'Gold — you already have these', listMatches(a, from)) +
        bucket('bucket--bridge', 'Bridge skills', 'A near neighbor in your current role', listBridges(a)) +
        bucket('bucket--grow', 'Skills to grow', 'New ground — the learning plan covers these', listGrowth(a)) +
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
      (items || '<p class="bucket__none">None — yet.</p>') + '</div>';
  }

  function listMatches(a, from) {
    var rows = DATA.core.map(function (c) {
      return '<li>' + pillBtn(c.name, 'pill--core', { kind: 'core' }) + '</li>';
    }).concat(a.matches.map(function (s) {
      return '<li>' + pillBtn(s.skill, 'pill--core', { kind: 'role', role: from.subfamily }) + '</li>';
    }));
    return '<ul class="pills">' + rows.join('') + '</ul>';
  }

  function listBridges(a) {
    if (!a.bridges.length) return null;
    return '<ul>' + a.bridges.map(function (b) {
      return '<li><button type="button" class="skill-link" data-skill="' + esc(b.skill.skill) +
        '" data-kind="role" data-role="' + esc(toSel.value) + '">' + esc(b.skill.skill) + '</button>' +
        '<span class="via">' + (b.strength === 'strong' ? 'close to' : 'adjacent to') +
        ' your <b>' + esc(b.via) + '</b></span></li>';
    }).join('') + '</ul>';
  }

  function listGrowth(a) {
    var rows = a.growth.map(function (s) {
      var hint = a.probable[s.skill] ? '<span class="aihint">AI: likely already forming</span>' : '';
      return '<li><button type="button" class="skill-link" data-skill="' + esc(s.skill) +
        '" data-kind="role" data-role="' + esc(toSel.value) + '">' + esc(s.skill) + '</button>' + hint + '</li>';
    });
    rows.push('<li><button type="button" class="skill-link" data-skill="' + esc(AI_READINESS.skill) +
      '" data-kind="univ">' + esc(AI_READINESS.skill) + '</button>' +
      '<span class="aihint">Universal — every role</span></li>');
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
        '<p class="plandoc__summary">You carry all six core competencies' +
        (a.matches.length ? ' plus ' + a.matches.length + ' matched skill' + plural(a.matches.length) +
          (matchedNames ? ' (' + matchedNames + ')' : '') : ' into this pathway') +
        '. This plan closes ' + (a.bridges.length + a.growth.length + 1) + ' development areas — ' +
        a.bridges.length + ' bridge skill' + plural(a.bridges.length) + ', ' + a.growth.length +
        ' new skill' + plural(a.growth.length) + ', and AI Workforce Readiness (universal, assumed for every role) — in three phases with checkpoints in Oracle.</p>' +
      '</div>' +

      /* --- Phase checklists --- */
      '<div class="phases">' +
        phase('01', 'Align & set up in Oracle', 'Weeks 1–4', [
          ck('<b>Meet with your manager</b>: share this printed plan, agree on the destination and timeline, and add it to your development conversation notes.'),
          ck('In Oracle, open <b>Me &rarr; Career and Performance &rarr; Talent Profile</b> and add your current skills — matched skills, bridge skills, and any probable skills you genuinely have — with honest proficiency levels.'),
          ck('In <b>Oracle Grow</b>, add <b>' + esc(to.subfamily) + '</b> as a career/role of interest so recommendations start pointing at this destination.'),
          ck('In Oracle Grow, review the AI-suggested skills for your profile and accept the ones that fit.'),
          ck('Create one <b>development goal per skill</b> in the table below, tagged to your role of interest.'),
          ck('Request an informational interview with someone in ' + esc(to.subfamily) + ' (' + esc(to.family) + ').')
        ]) +
        phase('02', 'Build the skills', 'Months 2–' + (months - 3), [
          ck('Work the development table below top to bottom — one skill at a time, Vanderbilt courses first, then <b>Oracle Learning</b> enrollments.'),
          ck('Complete <b>AI Workforce Readiness</b> first: it compounds every other skill you build.'),
          ck('Pick one certification from the table and set a completion date with your manager.'),
          ck('Practice in place: volunteer for one task in your current role that uses a destination skill.'),
          ck('<b>Monthly manager check-in</b>: review progress against this table; update goal status in Oracle so the record travels with you.'),
          ck('If progress stalls or the pathway needs formal support, engage your <b>Engagement Consultant / HCM partner</b> to help broker cross-department options.')
        ]) +
        phase('03', 'Prove it & land it', 'Months ' + (months - 3) + '–' + months, [
          ck('In Oracle <b>Opportunity Marketplace</b>, take one gig or short assignment with the ' + esc(to.family) + ' team.'),
          ck('Shadow a ' + esc(to.subfamily) + ' colleague for a day; debrief what surprised you.'),
          ck('Update your <b>Talent Profile</b> with every completed course and new skill so recruiters and Grow can see it.'),
          ck('Refresh your résumé in skills language — lead with matched and newly built skills.'),
          ck('<b>Final manager conversation</b>: confirm readiness; loop in your Engagement Consultant / HCM partner on internal openings.'),
          ck('Apply through Vanderbilt’s internal mobility process with your portfolio of completions.')
        ]) +
      '</div>' +

      /* --- Skill development table --- */
      '<div class="learnlist">' +
        '<h3>Skill development table</h3>' +
        '<p>Ordered by priority: AI Workforce Readiness first (universal), then bridge skills (fastest wins), then new skills. Every row gets a development goal in Oracle. Source links open pre-filtered to the skill.</p>' +
        '<div class="tablewrap"><table class="learntable">' +
          '<thead><tr><th class="lt-done">Done</th><th class="lt-pri">#</th><th>Skill</th><th>Why</th>' +
          '<th>Learn with</th><th>In Oracle</th><th class="lt-date">Target date</th></tr></thead>' +
          '<tbody>' + learnTargets.map(learnRow).join('') + '</tbody>' +
        '</table></div>' +
      '</div>' +

      /* --- Oracle playbook --- */
      '<div class="oracle">' +
        '<h3>Your Oracle playbook</h3>' +
        '<p>Everything above, as a single tour through Oracle. Do steps 1–5 in week one; the rest run through the plan.</p>' +
        '<ol class="oracle__steps">' +
          oStep('Tag your skills', 'Me &rarr; Career and Performance &rarr; <b>Talent Profile</b>: add current skills with proficiency (matched, bridge, and real probable skills). This feeds every recommendation Oracle makes.') +
          oStep('Open Oracle Grow', 'Grow builds a personalized page from your role + skills. Review its suggested skills (Dynamic Skills AI) and accept what fits.') +
          oStep('Declare your destination', 'In Grow / Career Development, add <b>' + esc(to.subfamily) + '</b> as a career or role of interest. Grow then surfaces the gap between your profile and that role.') +
          oStep('Create development goals', 'One goal per row of the table above, tagged with a development intent linked to your role of interest — so progress is visible to you and your manager.') +
          oStep('Enroll in Oracle Learning', 'Me &rarr; <b>Learning</b>: search each skill by name, enroll in courses and <b>learning journeys</b>, join a learning community, and follow the skill topics.') +
          oStep('Work Opportunity Marketplace', 'Browse gigs and short assignments in ' + esc(to.family) + ' — real practice plus visibility with the destination team.') +
          oStep('Keep the loop with people', 'Monthly manager check-ins against this plan; engage your <b>Engagement Consultant / HCM partner</b> when you need cross-department doors opened. Consider a mentor via Connections.') +
          oStep('Close the loop', 'Completed learning updates your Talent Profile (some courses update competencies automatically — verify). Re-run this tool as your profile grows and watch readiness climb.') +
        '</ol>' +
      '</div>' +

      '<div class="plan__actions">' +
        '<button type="button" class="btn" id="print-plan">Print this plan</button>' +
        '<a class="btn btn--ghost" href="https://me5231979.github.io/Course_Library/">Browse the Course Library</a>' +
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
    var q = encodeURIComponent(s.skill);
    var courses = s === AI_READINESS ?
      VU_COURSES.filter(function (c) { return c.name.indexOf('AI') === 0; }) :
      (vuCourseFor(s.skill) ? [vuCourseFor(s.skill)] : []);

    var why = t.tag === 'universal' ? '<span class="lt-tag lt-tag--univ">Universal</span> assumed development need for every role' :
      t.tag === 'bridge' ? '<span class="lt-tag lt-tag--bridge">Bridge</span> near your <b>' + esc(t.via) + '</b>' :
      '<span class="lt-tag lt-tag--grow">New</span>' + (t.ai ? ' AI: likely already forming' : ' new ground for this pathway');

    var learn = courses.map(function (c) {
      return '<a class="lt-vu" href="' + c.url + '">VU: ' + esc(c.name) + '</a>';
    }).join(' ') +
      '<span class="lt-srcs">' +
      srcA('LinkedIn Learning', 'https://www.linkedin.com/learning/search?keywords=' + q) +
      srcA('YouTube', 'https://www.youtube.com/results?search_query=' + q + '+course') +
      srcA('Podcasts', 'https://podcasts.apple.com/us/search?term=' + q) +
      srcA('Certifications', 'https://www.google.com/search?q=%22' + q + '%22+certification') +
      srcA('White papers', 'https://scholar.google.com/scholar?q=%22' + q + '%22') +
      '</span>';

    var oracle = t.tag === 'universal' ?
      'Search “AI” in Oracle Learning; add an AI-readiness development goal; accept Grow’s AI skill suggestions' :
      'Search “' + esc(s.skill) + '” in Oracle Learning; create a development goal tagged to your role of interest; add to Talent Profile once built';

    return '<tr>' +
      '<td class="lt-done"><span class="ckbox" aria-hidden="true"></span></td>' +
      '<td class="lt-pri">' + (i + 1) + '</td>' +
      '<td class="lt-skill"><button type="button" class="skill-link" data-skill="' + esc(s.skill) +
        '" data-kind="' + (s === AI_READINESS ? 'univ' : 'role') + '" data-role="' + esc(toSel.value) + '">' +
        esc(s.skill) + '</button></td>' +
      '<td class="lt-why">' + why + '</td>' +
      '<td class="lt-learn">' + learn + '</td>' +
      '<td class="lt-oracle">' + oracle + '</td>' +
      '<td class="lt-date"><span class="fillin fillin--sm"></span></td>' +
      '</tr>';
  }

  function srcA(label, url) {
    return '<a href="' + url + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  function oStep(title, text) {
    return '<li><b>' + title + '</b><span>' + text + '</span></li>';
  }

  function vuCourseFor(skillName) {
    var lower = skillName.toLowerCase();
    for (var i = 0; i < VU_COURSES.length; i++) {
      if (VU_COURSES[i].skills.some(function (s) { return s.toLowerCase() === lower; })) return VU_COURSES[i];
    }
    return null;
  }

  /* ---------- Skill detail modal ---------- */
  var modal = document.getElementById('skill-modal');
  document.getElementById('modal-close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-skill]');
    if (!btn || !DATA) return;
    openSkill(btn.dataset.skill, btn.dataset.kind, btn.dataset.role);
  });

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
