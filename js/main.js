// Site Darlan Hora: calculadora de orçamento e formulário de contato.
// Os valores abaixo são os da calculadora. Para mudar um preço, edite aqui.
(function () {
  var WHATSAPP = '5571996242980';
  var EXTRA_PAGE = 80;   // valor de cada página além das incluídas
  var MAINT = 100;       // manutenção mensal (a partir de)
  var TYPES = [
    { id: 'landing', label: 'Landing page', base: 500, inc: 1, service: 'Landing page', desc: 'Uma página só, para divulgar um produto, serviço ou campanha.' },
    { id: 'inst', label: 'Site institucional', base: 900, inc: 5, service: 'Site institucional', desc: 'Várias páginas para apresentar a empresa: história, serviços e contato.' },
    { id: 'auto', label: 'Site para autônomo', base: 800, inc: 4, service: 'Site para profissional autônomo', desc: 'Para quem trabalha por conta própria mostrar o que faz e receber contatos.' },
    { id: 'port', label: 'Portfólio profissional', base: 700, inc: 4, service: 'Portfólio profissional', desc: 'Uma vitrine dos seus projetos e trabalhos realizados.' },
    { id: 'custom', label: 'Site personalizado', base: 1500, inc: 6, service: 'Site personalizado', desc: 'Projeto sob medida, com mais páginas ou funções próprias.' }
  ];
  var EXTRAS = [
    { id: 'form', label: 'Formulário de contato', price: 60 },
    { id: 'whats', label: 'Integração com WhatsApp', price: 40 },
    { id: 'gal', label: 'Galeria de imagens ou portfólio', price: 120 },
    { id: 'anim', label: 'Animações e efeitos especiais', price: 150 },
    { id: 'func', label: 'Funcionalidades personalizadas', price: 300 }
  ];
  var TPL = {
    "type": "<button type=\"button\" class=\"opt\" aria-pressed=\"{{t.on}}\" data-type=\"{{t.id}}\" style=\"display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 14px 16px; text-align: left; border-radius: 12px; border: 1.5px solid {{t.bd}}; background: {{t.bg}}; color: {{t.fg}}; font-size: 15px; font-weight: 600\"><span>{{t.label}}</span><span style=\"font-size: 13px; font-weight: 400; line-height: 1.4; opacity: 0.85\">{{t.desc}}</span></button>",
    "extra": "<button type=\"button\" class=\"opt\" aria-pressed=\"{{x.on}}\" data-extra=\"{{x.id}}\" style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 60px; padding: 10px 16px; text-align: left; border-radius: 12px; border: 1.5px solid {{x.bd}}; background: {{x.bg}}; color: {{x.fg}}; font-size: 15px; font-weight: 500\">\n<span>{{x.label}}</span>\n<span style=\"font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12.5px; white-space: nowrap\">{{x.tag}}</span>\n</button>",
    "line": "<li style=\"display: flex; justify-content: space-between; gap: 16px\"><span style=\"color: #9A9AB8\">{{l.label}}</span><span style=\"font-family: 'JetBrains Mono', ui-monospace, monospace; font-variant-numeric: tabular-nums; white-space: nowrap\">{{l.value}}</span></li>"
  };

  var state = { type: 'inst', pages: 5, form: true, whats: true, gal: false, anim: false, func: false, maint: false, touched: false };
  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return 'R$ ' + n.toLocaleString('pt-BR'); };
  var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var fill = function (tpl, data) {
    return tpl.replace(/\{\{\w+\.(\w+)\}\}/g, function (_, k) { return esc(data[k]); });
  };
  var look = function (on) {
    return on
      ? { bg: '#1F4FFF', fg: '#FFFFFF', bd: '#1F4FFF' }
      : { bg: 'rgba(255,255,255,0.06)', fg: '#E4EAFF', bd: 'rgba(255,255,255,0.22)' };
  };
  var current = function () {
    return TYPES.filter(function (t) { return t.id === state.type; })[0] || TYPES[1];
  };

  // Faz a conta e devolve tudo o que a tela e a mensagem precisam.
  function compute() {
    var cur = current();
    var extraPages = Math.max(0, state.pages - cur.inc);
    var total = cur.base + extraPages * EXTRA_PAGE;
    var lines = [{ label: cur.label + (cur.inc > 1 ? ' (até ' + cur.inc + ' páginas)' : ' (1 página)'), value: money(cur.base) }];
    if (extraPages > 0) lines.push({ label: extraPages + (extraPages > 1 ? ' páginas extras' : ' página extra'), value: '+ ' + money(extraPages * EXTRA_PAGE) });
    var chosen = [];
    EXTRAS.forEach(function (x) {
      if (state[x.id]) { total += x.price; chosen.push(x.label); lines.push({ label: x.label, value: '+ ' + money(x.price) }); }
    });
    var estimate = money(total) + (state.maint ? ' + manutenção a partir de ' + money(MAINT) + '/mês' : '');
    return { cur: cur, total: total, lines: lines, chosen: chosen, estimate: estimate };
  }

  function render() {
    var c = compute();
    $('calc-types').innerHTML = TYPES.map(function (t) {
      var on = t.id === state.type, k = look(on);
      return fill(TPL.type, { id: t.id, label: t.label, desc: t.desc, on: on, bg: k.bg, fg: k.fg, bd: k.bd });
    }).join('');
    var extras = EXTRAS.map(function (x) { return { id: x.id, label: x.label, tag: '+ ' + money(x.price), on: !!state[x.id] }; });
    extras.push({ id: 'maint', label: 'Manutenção mensal', tag: money(MAINT) + '/mês', on: state.maint });
    $('calc-extras').innerHTML = extras.map(function (x) {
      var k = look(x.on);
      return fill(TPL.extra, { id: x.id, label: x.label, tag: x.tag, on: x.on, bg: k.bg, fg: k.fg, bd: k.bd });
    }).join('');
    $('calc-lines').innerHTML = c.lines.map(function (l) { return fill(TPL.line, l); }).join('');
    $('calc-pages').textContent = state.pages;
    $('calc-pages-note').textContent = (c.cur.inc > 1 ? 'Até ' + c.cur.inc + ' páginas incluídas.' : '1 página incluída.') + ' Cada página extra: ' + money(EXTRA_PAGE) + '.';
    $('calc-total').textContent = money(c.total);
    $('calc-maint').hidden = !state.maint;
    $('calc-summary-box').hidden = !state.touched;
    $('calc-summary').textContent = c.cur.label + ', ' + state.pages + (state.pages > 1 ? ' páginas' : ' página') +
      (c.chosen.length ? ', ' + c.chosen.join(', ') : '') + (state.maint ? ', Manutenção mensal' : '') + '. Estimativa: ' + c.estimate + '.';
    updateLink();
  }

  // Monta a mensagem do WhatsApp com os dados do formulário e, se houver, a simulação.
  function updateLink() {
    var c = compute();
    var val = function (id, empty) { return $(id).value.trim() || empty; };
    var msg = [
      'Olá, Darlan! Quero solicitar um orçamento.',
      '',
      'Nome: ' + val('c-nome', 'não informado'),
      'E-mail: ' + val('c-email', 'não informado'),
      'Telefone: ' + val('c-tel', 'não informado'),
      'Tipo de serviço: ' + $('c-servico').value,
      'Descrição do projeto: ' + val('c-desc', 'não informada')
    ];
    if (state.touched) msg = msg.concat([
      '',
      'Simulação na calculadora:',
      'Tipo de site: ' + c.cur.label,
      'Páginas: ' + state.pages,
      'Funcionalidades: ' + (c.chosen.length ? c.chosen.join(', ') : 'nenhuma extra'),
      'Manutenção mensal: ' + (state.maint ? 'sim' : 'não'),
      'Estimativa apresentada: ' + c.estimate
    ]);
    $('contact-send').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg.join('\n'));
  }

  // Qualquer mexida na calculadora marca a simulação e ajusta o tipo de serviço do formulário.
  function touch() {
    state.touched = true;
    $('c-servico').value = current().service;
    render();
  }

  $('calc-types').addEventListener('click', function (e) {
    var b = e.target.closest('[data-type]'); if (!b) return;
    state.type = b.getAttribute('data-type'); state.pages = current().inc; touch();
  });
  $('calc-extras').addEventListener('click', function (e) {
    var b = e.target.closest('[data-extra]'); if (!b) return;
    var id = b.getAttribute('data-extra'); state[id] = !state[id]; touch();
  });
  // Botões "Solicitar orçamento" dos serviços: já deixam o tipo escolhido na calculadora.
  document.querySelectorAll('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () {
      state.type = a.getAttribute('data-pick'); state.pages = current().inc;
      $('c-servico').value = current().service; render();
    });
  });
  // "Continuar com esta estimativa" leva a simulação para o formulário, mesmo sem mexer em nada.
  $('calc-continue').addEventListener('click', touch);
  // Menu do celular: abre e fecha no botão, e fecha ao tocar em um link.
  var header = document.querySelector('.site-header'), menuBtn = $('menu-btn');
  if (header && menuBtn) {
    menuBtn.addEventListener('click', function () {
      menuBtn.setAttribute('aria-expanded', header.classList.toggle('open'));
    });
    header.addEventListener('click', function (e) {
      if (e.target.closest('a')) { header.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }
  $('calc-less').addEventListener('click', function () { state.pages = Math.max(1, state.pages - 1); touch(); });
  $('calc-more').addEventListener('click', function () { state.pages = Math.min(30, state.pages + 1); touch(); });
  $('contact-form').addEventListener('submit', function (e) { e.preventDefault(); });
  $('contact-form').addEventListener('input', updateLink);
  $('contact-form').addEventListener('change', updateLink);
  // O e-mail é opcional, mas se for preenchido precisa ter formato de e-mail.
  var emailOk = function () {
    var v = $('c-email').value.trim();
    return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  };
  var showEmailError = function (show) {
    $('c-email-erro').hidden = !show;
    $('c-email').setAttribute('aria-invalid', show ? 'true' : 'false');
  };
  $('c-email').addEventListener('input', function () { showEmailError(false); });
  // Consentimento (LGPD): só envia depois de marcar que leu o aviso de privacidade.
  $('c-consent').addEventListener('change', function () { if (this.checked) $('c-consent-erro').hidden = true; });
  $('contact-send').addEventListener('click', function (e) {
    if (!emailOk()) { e.preventDefault(); showEmailError(true); $('c-email').focus(); return; }
    if (!$('c-consent').checked) { e.preventDefault(); $('c-consent-erro').hidden = false; $('c-consent').focus(); return; }
    updateLink();
  });

  render();
})();
