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
    if (!a.growth.length) return null;
    return '<ul>' + a.growth.map(function (s) {
      var hint = a.probable[s.skill] ? '<span class="aihint">AI: likely already forming</span>' : '';
      return '<li><button type="button" class="skill-link" data-skill="' + esc(s.skill) +
        '" data-kind="role" data-role="' + esc(toSel.value) + '">' + esc(s.skill) + '</button>' + hint + '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- Plan ---------- */
  function renderPlan(from, to) {
    var body = document.getElementById('plan-body');
    var title = document.getElementById('plan-title');
    if (!from || !to || from === to) {
      title.innerHTML = 'A clear path, <em>phase by phase</em>.';
      body.innerHTML = '<p class="plan__empty">Select both roles above and your transition plan will build itself here.</p>';
      return;
    }
    var a = analyze(from, to);
    title.innerHTML = esc(from.subfamily) + ' <em class="gold-text">&rarr;</em> ' + esc(to.subfamily);

    var learnTargets = a.bridges.map(function (b) {
      return { skill: b.skill, tag: 'bridge', via: b.via };
    }).concat(a.growth.map(function (s) {
      return { skill: s, tag: 'grow', ai: a.probable[s.skill] };
    }));

    var matchedNames = a.matches.slice(0, 4).map(function (s) { return '<b>' + esc(s.skill) + '</b>'; }).join(', ');

    body.innerHTML =
      '<p class="lead">A ' + (a.growth.length > 5 ? 'twelve' : a.growth.length > 2 ? 'nine' : 'six') +
      '-month arc from <strong>' + esc(from.family) + '</strong> to <strong>' + esc(to.family) +
      '</strong>. Start with what you have, close the gaps in order, then prove it in the real role.</p>' +

      '<div class="phases">' +
        phase('01', 'Leverage what carries', 'Weeks 1–4', [
          'Write your skills story: the six core competencies plus ' +
            (matchedNames ? matchedNames : 'your transferable ' + esc(from.subfamily) + ' experience') +
            ' are already ' + esc(to.subfamily) + ' currency.',
          'Request an informational interview with someone in <b>' + esc(to.subfamily) + '</b> (' + esc(to.family) + ').',
          'Ask your manager to note your pathway goal in your development plan.',
          a.bridges.length ? 'Reframe your bridge skills: ' + a.bridges.slice(0, 3).map(function (b) {
            return '<b>' + esc(b.via) + '</b>'; }).join(', ') + ' — the vocabulary changes, the muscle doesn’t.' :
            'Map your day-to-day wins to the destination role’s language.'
        ]) +
        phase('02', 'Close the gaps', a.growth.length > 5 ? 'Months 2–9' : 'Months 2–6', [
          'Work the learning list below — one skill at a time, Vanderbilt courses first.',
          a.growth.length ? 'Priority order: start with ' + a.growth.slice(0, 2).map(function (s) {
            return '<b>' + esc(s.skill) + '</b>'; }).join(' and ') + '.' :
            'No hard gaps — deepen your bridge skills to destination-level proficiency.',
          'Pick one certification from the learning list and set a completion date.',
          'Practice in place: volunteer for one task in your current role that uses a destination skill.'
        ]) +
        phase('03', 'Prove it and land it', a.growth.length > 5 ? 'Months 9–12' : 'Months 6–9', [
          'Ask for a stretch assignment or cross-department project with the ' + esc(to.family) + ' team.',
          'Shadow a ' + esc(to.subfamily) + ' colleague for a day; debrief what surprised you.',
          'Refresh your résumé in skills language — lead with matched and newly built skills.',
          'Apply through Vanderbilt’s internal mobility process, with your portfolio of course completions.'
        ]) +
      '</div>' +

      '<div class="learnlist">' +
        '<h3>Recommended learning, skill by skill</h3>' +
        '<p>Vanderbilt Course Library first where a live course builds the skill, then curated searches on LinkedIn Learning, YouTube, podcasts, certifications, and white papers. Each link opens pre-filtered to the skill.</p>' +
        (learnTargets.length ? learnTargets.map(learnCard).join('') :
          '<p class="plan__empty">Nothing to learn — these roles share their full skill set.</p>') +
      '</div>' +

      '<div class="plan__actions">' +
        '<button type="button" class="btn" id="print-plan">Print my plan</button>' +
        '<a class="btn btn--ghost" href="https://me5231979.github.io/Course_Library/">Browse the Course Library</a>' +
      '</div>';

    var printBtn = document.getElementById('print-plan');
    if (printBtn) printBtn.addEventListener('click', function () { print(); });
  }

  function phase(num, title, when, items) {
    return '<div class="phase"><p class="phase__num">' + num + '</p><h4>' + title + '</h4>' +
      '<p class="phase__when">' + when + '</p><ul>' + items.map(function (i) {
        return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
  }

  function learnCard(t) {
    var s = t.skill;
    var q = encodeURIComponent(s.skill);
    var course = vuCourseFor(s.skill);
    var tag = t.tag === 'bridge' ?
      '<span class="learn__tag learn__tag--bridge">Bridge — via ' + esc(t.via) + '</span>' :
      '<span class="learn__tag learn__tag--grow">Grow</span>';
    if (t.ai) tag += '<span class="learn__tag learn__tag--ai">AI: likely forming</span>';

    return '<details class="learn"><summary><b>' + esc(s.skill) + '</b>' + tag + '</summary>' +
      '<div class="learn__body">' +
      (s.definition ? '<p class="learn__def">' + esc(s.definition) + '</p>' : '') +
      (course ? '<p class="learn__vu">Vanderbilt course: <a href="' + course.url + '">' +
        esc(course.name) + '</a> — live, interactive, and free to staff.</p>' : '') +
      '<ul class="sources">' +
        src('LinkedIn Learning', 'https://www.linkedin.com/learning/search?keywords=' + q) +
        src('YouTube', 'https://www.youtube.com/results?search_query=' + q + '+course') +
        src('Podcasts', 'https://podcasts.apple.com/us/search?term=' + q) +
        src('Certifications', 'https://www.google.com/search?q=%22' + q + '%22+certification') +
        src('White papers', 'https://scholar.google.com/scholar?q=%22' + q + '%22') +
        src('Coursera', 'https://www.coursera.org/search?query=' + q) +
      '</ul></div></details>';
  }

  function src(label, url) {
    return '<li><a href="' + url + '" target="_blank" rel="noopener">' + label + '</a></li>';
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
    if (kind === 'core') {
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
