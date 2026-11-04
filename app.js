(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const form = $('#quote-form');
  const fields = ['brand', 'model', 'problem'];
  const dialog = $('#message-dialog');
  const preview = $('#message-preview');
  const configuredNumber = String(window.QUALITECH_CONFIG?.whatsapp || '').replace(/\D/g, '');
  const number = /^\d{10,15}$/.test(configuredNumber) ? configuredNumber : '';
  let toastTimer;
  const toast = message => {
    $('.toast').textContent = message;
    $('.toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('.toast').classList.remove('visible'), 3500);
  };
  $('#year').textContent = new Date().getFullYear();
  const toggle = $('.menu-toggle');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); $('.nav').classList.remove('open'); toggle.setAttribute('aria-label', 'Abrir menu'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('.nav').classList.toggle('open', open);
  });
  $$('.nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const navLinks = $$('.nav a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => { const active = a.hash === '#' + entry.target.id; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    });
  }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
  ['inicio', 'servicos', 'sobre', 'depoimentos', 'contato'].forEach(id => observer.observe(document.getElementById(id)));
  try {
    const draft = JSON.parse(localStorage.getItem('tutticell-quote') || '{}');
    fields.forEach(id => { if (typeof draft[id] === 'string') $('#' + id).value = draft[id]; });
  } catch { /* O formulário também funciona sem armazenamento local. */ }
  const errorText = { brand: 'Selecione a marca do aparelho.', model: 'Informe o modelo do aparelho.', problem: 'Descreva o que aconteceu.' };
  const validate = id => {
    const input = $('#' + id);
    const valid = input.value.trim().length > 0;
    input.setAttribute('aria-invalid', String(!valid));
    $('#' + id + '-error').textContent = valid ? '' : errorText[id];
    return valid;
  };
  form.addEventListener('input', e => {
    if (fields.includes(e.target.id) && e.target.hasAttribute('aria-invalid')) validate(e.target.id);
    try { localStorage.setItem('tutticell-quote', JSON.stringify(Object.fromEntries(fields.map(id => [id, $('#' + id).value])))); } catch { /* Armazenamento opcional. */ }
  });
  const updateLink = () => {
    const text = encodeURIComponent(preview.value.trim());
    $('#send-message').href = number ? `https://wa.me/${number}?text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
  };
  const openMessage = (message, feedback = false) => {
    $('#dialog-title').textContent = feedback ? 'Sua experiência importa.' : 'Seu pedido está pronto.';
    $('#dialog-description').textContent = 'Revise a mensagem antes de continuar.';
    preview.value = message;
    $('#connection-note').textContent = number ? 'O WhatsApp será aberto com a mensagem pronta. O envio é confirmado por você.' : 'O número da assistência ainda não foi configurado. Copie a mensagem ou selecione o contato da Tutticell ao abrir o WhatsApp.';
    updateLink();
    dialog.showModal();
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const invalid = fields.filter(id => !validate(id));
    if (invalid.length) { $('#' + invalid[0]).focus(); return; }
    openMessage(`Olá, Tutticell! Gostaria de solicitar um orçamento.\n\nMarca: ${$('#brand').value.trim()}\nModelo: ${$('#model').value.trim()}\nProblema: ${$('#problem').value.trim()}\n\nComo podemos prosseguir?`);
  });
  $$('[data-contact]').forEach(button => button.addEventListener('click', () => openMessage('Olá, Tutticell! Gostaria de saber mais sobre a assistência técnica para meu aparelho.')));
  $$('[data-feedback]').forEach(button => button.addEventListener('click', () => openMessage('Olá, Tutticell! Gostaria de compartilhar minha experiência com o atendimento:\n\n', true)));
  preview.addEventListener('input', updateLink);
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); } });
  $('#copy-message').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(preview.value); toast('Mensagem copiada!'); }
    catch { preview.focus(); preview.select(); toast('Selecione e copie a mensagem com Ctrl+C.'); }
  });
  const steps = [
    '01 · Solicitação — Envie a marca, o modelo e uma descrição do problema. Se possível, compartilhe fotos durante a conversa pelo WhatsApp.',
    '02 · Diagnóstico — O aparelho é avaliado para identificar a causa do problema. Você recebe as opções de reparo, o orçamento e a previsão de prazo.',
    '03 · Reparo — Com sua aprovação, o serviço é realizado. Se o diagnóstico mudar, você é consultado antes de qualquer serviço adicional.',
    '04 · Retirada — Após os testes de funcionamento, combinamos a retirada e explicamos os cuidados e as condições de garantia do serviço.'
  ];
  $$('[data-step]').forEach(button => button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    $$('[data-step]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    button.setAttribute('aria-expanded', String(!expanded));
    $('#step-detail').hidden = expanded;
    $('#step-detail').textContent = expanded ? '' : steps[Number(button.dataset.step)];
  }));
  const services = {
    phone: [
      ['phone', 'Troca de tela', 'Tela quebrada, manchas ou falhas no toque? Solicite uma avaliação para o seu modelo.', 'A tela está com problema. Gostaria de avaliar a troca.'],
      ['bolt', 'Bateria e carregamento', 'Bateria que dura pouco, aparelho que não carrega ou desliga sozinho.', 'O aparelho está com problema de bateria ou carregamento.'],
      ['chip', 'Reparos e desempenho', 'Travamentos, falhas de áudio, câmeras ou aparelho que não liga. Vamos investigar.', 'Meu smartphone precisa de um diagnóstico.']
    ],
    computer: [
      ['laptop', 'Desempenho e sistema', 'Computador lento, erros no sistema e dificuldades para iniciar ou trabalhar.', 'Meu computador apresenta lentidão ou falhas no sistema.'],
      ['chip', 'Upgrade e manutenção', 'Avaliação para expansão de memória, instalação de SSD e manutenção preventiva.', 'Gostaria de avaliar um upgrade ou manutenção do computador.'],
      ['tools', 'Reparos de hardware', 'Problemas no teclado, na tela ou no carregamento do notebook.', 'Meu notebook está com um problema de hardware.']
    ],
    game: [
      ['game', 'Diagnóstico do console', 'Console que não inicia, desliga sozinho ou apresenta falhas durante o jogo.', 'Meu videogame precisa de um diagnóstico.'],
      ['tools', 'Limpeza e manutenção', 'Avaliação de ruídos, aquecimento e necessidade de manutenção do console.', 'Gostaria de avaliar a limpeza e manutenção do meu console.'],
      ['chip', 'Conexões e controles', 'Falhas de imagem, conectores ou controles? Informe o modelo para avaliação.', 'Meu videogame apresenta falhas nas conexões ou no controle.']
    ]
  };
  const tabs = $$('[data-category]');
  const renderServices = category => {
    $('#service-panel').innerHTML = services[category].map(([icon, title, desc], i) => `<article class="service-card"><svg aria-hidden="true"><use href="#i-${icon}"/></svg><h3>${title}</h3><p>${desc}</p><button class="text-link" data-service="${i}">Solicitar avaliação <svg aria-hidden="true"><use href="#i-arrow"/></svg></button></article>`).join('');
    $$('#service-panel [data-service]').forEach(button => button.addEventListener('click', () => {
      $('#problem').value = services[category][Number(button.dataset.service)][3];
      $('#problem').dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('orcamento').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      setTimeout(() => $('#brand').focus({ preventScroll: true }), 450);
      toast('Serviço selecionado. Complete os dados do aparelho.');
    }));
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1; });
      $('#service-panel').setAttribute('aria-labelledby', tab.id);
      renderServices(tab.dataset.category);
    });
    tab.addEventListener('keydown', e => {
      let target;
      if (e.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') target = 0;
      if (e.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { e.preventDefault(); tabs[target].focus(); tabs[target].click(); }
    });
  });
  renderServices('phone');
})();
