// Fazer scroll para formulário de reserva
const btnReserva = document.getElementById("btn-reserva");
const secaoReserva = document.getElementById("reserva");

if (btnReserva && secaoReserva) {
  btnReserva.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Scroll suave até a secção
    secaoReserva.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
const PRECOS = {
  caes: {
    umaVisita: { ate2: 14, mais2: 18 },
    duasVisitas: { ate2: 28, mais2: 36 }
  },
  gatos: {
    umaVisita: { ate3: 12, mais3: 15 },
    duasVisitas: { ate3: 16, mais3: 19 }
  }
};

/* =====================
   DESLOCAÇÃO POR CIDADE
===================== */
const DESLOC_POR_CIDADE = {
  "matosinhos": 0,
  "porto": 3.5,
  "custoias": 2.5,
  "gaia": 5,
  "maia": 4,
  "gondomar": 4,
  "valongo": 5
};

const LIMITE_DESLOC = 5;

/* =====================
   ELEMENTOS DOM
===================== */
const dataInicio = document.getElementById("dataInicio");
const dataFim = document.getElementById("dataFim");
const numCaes = document.getElementById("numCaes");
const numGatos = document.getElementById("numGatos");
const morada = document.getElementById("morada");

const toggleBtns = document.querySelectorAll(".toggle-btn");

let visitas = "umaVisita";

/* =====================
   TOGGLE VISITAS
===================== */
toggleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    toggleBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    visitas = btn.dataset.visitas === "2" ? "duasVisitas" : "umaVisita";
    atualizar();
  });
});

/* =====================
   CALCULAR DIAS
===================== */
function dias() {
  if (!dataInicio.value || !dataFim.value) return 0;
  const diff = new Date(dataFim.value) - new Date(dataInicio.value);
  const d = Math.floor(diff / 86400000) + 1;
  return d > 0 ? d : 0;
}

/* =====================
   PREÇOS SERVIÇO
===================== */
function precoCaes(d) {
  const n = Number(numCaes.value);
  if (n === 0) return 0;
  const p = n <= 2 ? PRECOS.caes[visitas].ate2 : PRECOS.caes[visitas].mais2;
  return p * d;
}

function precoGatos(d) {
  const n = Number(numGatos.value);
  if (n === 0) return 0;
  const p = n <= 3 ? PRECOS.gatos[visitas].ate3 : PRECOS.gatos[visitas].mais3;
  return p * d;
}

/* =====================
   DESLOCAÇÃO POR MORADA
===================== */
function deslocacaoPorCidade(moradaTexto, d) {
  if (!moradaTexto) return 0;

  const texto = moradaTexto.toLowerCase();
  let valor = null; // Começa com null - só muda se encontrar a cidade

  for (const cidade in DESLOC_POR_CIDADE) {
    // Usar regex com word boundaries para procurar a cidade como palavra completa
    const regex = new RegExp(`\\b${cidade}\\b`);
    if (regex.test(texto)) {
      valor = DESLOC_POR_CIDADE[cidade];
      break;
    }
  }

  // Se não encontrou nenhuma localidade conhecida, retorna 0
  if (valor === null) return 0;

  const visitasPorDia = visitas === "duasVisitas" ? 2 : 1;
  return valor * visitasPorDia * d;
}

/* =====================
   ATUALIZAR UI
===================== */
function atualizar() {
  const d = dias();

  document.getElementById("diasSelecionados").textContent =
    `${d} dias selecionados`;

  const pc = precoCaes(d);
  const pg = precoGatos(d);
  const pd = deslocacaoPorCidade(morada.value, d);
  const total = pc + pg + pd;

  document.getElementById("diasCao").textContent = `${d} dias`;
  document.getElementById("diasGato").textContent = `${d} dias`;

  document.getElementById("visitasRes").textContent =
    visitas === "duasVisitas" ? "2 visitas/dia" : "1 visita/dia";

  document.getElementById("precoCaes").textContent = `€${pc.toFixed(2)}`;
  document.getElementById("precoGatos").textContent = `€${pg.toFixed(2)}`;
  document.getElementById("precoDesloc").textContent = `€${pd.toFixed(2)}`;
  document.getElementById("total").textContent = `€${total.toFixed(2)}`;

  // ===== PASSAR DADOS PARA FORMULÁRIO DE RESERVA =====
  const dataInIso = dataInicio.value ? new Date(dataInicio.value).toLocaleDateString('pt-PT') : '-';
  const dataFimIso = dataFim.value ? new Date(dataFim.value).toLocaleDateString('pt-PT') : '-';
  
  const nCaes = Number(numCaes.value);
  const nGatos = Number(numGatos.value);
  let animais = [];
  if (nCaes > 0) animais.push(`${nCaes} cão(es)`);
  if (nGatos > 0) animais.push(`${nGatos} gato(s)`);
  const animaisTexto = animais.length > 0 ? animais.join(', ') : '-';

  const visitasTexto = visitas === "duasVisitas" ? "2 visitas/dia" : "1 visita/dia";

  // Atualizar resumo no formulário de reserva
  if (document.getElementById("r-datas")) {
    document.getElementById("r-datas").textContent = dataInIso === '-' ? '-' : `${dataInIso} a ${dataFimIso}`;
  }
  if (document.getElementById("r-animais")) {
    document.getElementById("r-animais").textContent = animaisTexto;
  }
  if (document.getElementById("r-visitas")) {
    document.getElementById("r-visitas").textContent = visitasTexto;
  }
  if (document.getElementById("r-distancia")) {
    document.getElementById("r-distancia").textContent = `€${pd.toFixed(2)}`;
  }
  if (document.getElementById("r-preco")) {
    document.getElementById("r-preco").textContent = `€${total.toFixed(2)}`;
  }

  // Atualizar campos ocultos para envio de email
  if (document.getElementById("hidden-datas")) {
    document.getElementById("hidden-datas").value = dataInIso === '-' ? '-' : `${dataInIso} a ${dataFimIso}`;
  }
  if (document.getElementById("hidden-animais")) {
    document.getElementById("hidden-animais").value = animaisTexto;
  }
  if (document.getElementById("hidden-visitas")) {
    document.getElementById("hidden-visitas").value = visitasTexto;
  }
  if (document.getElementById("hidden-distancia")) {
    document.getElementById("hidden-distancia").value = `€${pd.toFixed(2)}`;
  }
  if (document.getElementById("hidden-preco")) {
    document.getElementById("hidden-preco").value = `€${total.toFixed(2)}`;
  }
}

/* =====================
   EVENTOS
===================== */
[dataInicio, dataFim, numCaes, numGatos, morada].forEach(el => {
  el.addEventListener("input", atualizar);
});

/* =====================
   ENVIAR FORMULÁRIOS COM WEB3FORMS
===================== */
const reservaForm = document.getElementById("reservaForm");
const contactoForm = document.getElementById("contactoForm");

// Função para enviar forms
function enviarForm(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const resultado = await response.json();

      if (resultado.success) {
        alert("✅ Mensagem enviada com sucesso!\n\nEntraremos em contacto em breve!");
        form.reset();
        document.querySelectorAll("input, textarea, select").forEach(el => {
          if (el.form === form) el.value = "";
        });
        // Se é o formulário de reserva, resetar também a calculadora
        if (form.id === "reservaForm") {
          // Resetar todos os inputs da calculadora
          dataInicio.value = "";
          dataFim.value = "";
          numCaes.value = "0";
          numGatos.value = "0";
          morada.value = "";
          
          // Resetar o toggle de visitas
          toggleBtns.forEach(btn => btn.classList.remove("active"));
          document.querySelector(".toggle-btn[data-visitas='1']").classList.add("active");
          visitas = "umaVisita";
          
          // Atualizar a UI da calculadora
          atualizar();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("❌ Erro ao enviar: " + (resultado.message || "Tente novamente"));
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro ao enviar o formulário. Tente novamente.");
    }
  });
}

if (reservaForm) enviarForm(reservaForm);
if (contactoForm) enviarForm(contactoForm);

/* =====================
   INIT
===================== */
atualizar();

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* =====================
   SISTEMA DE TRADUÇÕES
===================== */
const translations = {
  pt: {
    // Menu
    'menu-sobre': 'Sobre',
    'menu-servicos': 'Serviços',
    'menu-contacto': 'Contacto',
    'menu-marcar': 'Marcar Serviço',
    
    // Hero
    'hero-title': 'Cuide do Seu Animal<br>de Estimação em <span class="highlight">Casa</span>, com <span class="highlight">Confiança</span>',
    'hero-subtitle': 'Serviço profissional de petsitting ao domicílio. Marcação simples e rápida, acompanhamento dedicado e preços claros — sem surpresas.',
    'hero-badge1': '100% Seguro',
    'hero-badge2': 'Horários Flexíveis',
    'hero-badge3': 'No Conforto do Lar',
    'hero-btn1': 'Marcar Serviço Agora',
    'hero-btn2': 'Ver Como Funciona',
    'hero-note': '— Sem compromisso · — Preço transparente · — Marcação instantânea',
    
    // Como Funciona
    'como-title': 'Como Funciona',
    'como-subtitle': 'Marcar o cuidado do seu animal é simples e rápido. Sem telefonemas, sem esperas.',
    'como-step1-title': 'Escolha as Datas',
    'como-step1-desc': 'Selecione quando precisa do serviço e quantas visitas por dia',
    'como-step2-title': 'Indique os Animais',
    'como-step2-desc': 'Quantos cães e gatos tem? Pode combinar ambos',
    'como-step3-title': 'Veja o Preço Final',
    'como-step3-desc': 'Calculamos automaticamente incluído deslocação',
    'como-step4-title': 'Confirme a Marcação',
    'como-step4-desc': 'Escolha o método de pagamento e está feito',
    'como-btn': 'Começar Agora',
    
    // Porque Escolher
    'porque-title': 'Porquê escolher a <span>Pawsitter</span>?',
    'porque-subtitle': 'O meu nome é Bruna e sou a pessoa por trás da PawSitter. Sou auxiliar veterinária e criei este serviço com muito amor e dedicação pelos animais.<br><br>Sempre tive uma ligação especial com eles e acredito que merecem atenção, carinho e segurança, mesmo quando os tutores não podem estar presentes. Na PawSitter, trato cada animal como se fosse meu, respeitando as suas rotinas e necessidades.<br><br>Se procura um serviço de petsitting responsável e experiente, a PawSitter é uma opção de confiança. 🐶🐱',
    'porque-benefit1-title': 'Conforto do Lar',
    'porque-benefit1-desc': 'O seu animal fica em casa, sem stress de transportes ou espaços desconhecidos.',
    'porque-benefit2-title': 'Preço Transparente',
    'porque-benefit2-desc': 'Sem valores escondidos. Vê o preço final antes de confirmar.',
    'porque-benefit3-title': 'Flexibilidade Total',
    'porque-benefit3-desc': 'Escolha 1 ou 2 visitas por dia e combine cães e gatos.',
    'porque-benefit4-title': 'Marcação Instantânea',
    'porque-benefit4-desc': 'Sem esperas. Faça o pedido online em minutos.',
    
    // O Que Está Incluído
    'incluido-title': 'O Que Está Incluído',
    'incluido-subtitle': 'Cada visita é pensada para garantir o bem-estar completo do seu animal',
    'incluido-card1-title': 'Alimentação',
    'incluido-card1-desc': 'Respeitamos os horários e dietas indicadas por si.',
    'incluido-card2-title': 'Carinho e Companhia',
    'incluido-card2-desc': 'Tempo de qualidade, brincadeiras e atenção dedicada.',
    'incluido-card3-title': 'Água Fresca',
    'incluido-card3-desc': 'Renovamos sempre a água e garantimos que está disponível.',
    'incluido-card4-title': 'Higiene',
    'incluido-card4-desc': 'Limpeza das áreas de alimentação e espaços do animal.',
    'incluido-card5-title': 'Medicação',
    'incluido-card5-desc': 'Administração conforme as suas instruções (se necessário).',
    'incluido-card6-title': 'Atualizações',
    'incluido-card6-desc': 'Fotos e mensagens para saber como está o seu animal.',
    'incluido-card7-title': 'Precisa de algo especial?',
    'incluido-card7-desc': 'Cada animal é único e adaptamos o serviço às necessidades específicas',
    
    // CTA Banner
    'cta-title': 'Pronto para Cuidar do Seu Melhor Amigo?',
    'cta-desc': 'Marque agora e tenha a tranquilidade de saber que o seu animal está em boas mãos, no conforto do lar',
    'cta-btn1': 'Marcar Serviço Agora',
    'cta-btn2': 'Saber Mais Sobre Nós',
    'cta-badge1': 'Marcação em minutos',
    'cta-badge2': 'Sem compromisso',
    'cta-badge3': 'Preço transparente',
    
    // Tabela de Preços
    'precos-title': 'Tabela de Preços',
    'precos-subtitle': 'Transparência total - saiba exatamente quanto vai pagar',
    'precos-caes': 'Cães',
    'precos-gatos': 'Gatos',
    'precos-1visita': '1 Visita por Dia',
    'precos-2visitas': '2 Visitas por Dia',
    'precos-desloc-title': 'Custos de Deslocação',
    'precos-desloc-base': 'Base por visita',
    'precos-desloc-nota': 'O custo é aplicado a cada visita (ex: 2 visitas/dia = custo ×2)',
    'precos-combine': '★ Pode combinar cães e gatos no mesmo serviço! Use a calculadora para ver o preço exato.',
    'precos-ate2caes': 'Até 2 cães',
    'precos-34caes': '3-4 cães',
    'precos-ate3gatos': 'Até 3 gatos',
    'precos-4plusgatos': '4+ gatos',
    
    // Calculadora
    'calc-title': 'Calcule o seu preço',
    'calc-subtitle': 'Veja quanto custa cuidar do seu animal - transparente e sem surpresas',
    'calc-datas-label': 'Datas do Serviço',
    'calc-data-inicio': 'Data de Início',
    'calc-data-fim': 'Data de Fim',
    'calc-dias-selecionados': 'dias selecionados',
    'calc-animais-label': 'Quantos Animais?',
    'calc-caes': 'Cães',
    'calc-gatos': 'Gatos',
    'calc-0caes': '0 cães',
    'calc-1cao': '1 cão',
    'calc-2caes': '2 cães',
    'calc-3caes': '3 cães',
    'calc-4caes': '4 cães',
    'calc-0gatos': '0 gatos',
    'calc-1gato': '1 gato',
    'calc-2gatos': '2 gatos',
    'calc-3gatos': '3 gatos',
    'calc-4gatos': '4 gatos',
    'calc-visitas-label': 'Visitas por Dia',
    'calc-1visita': '1 Visita/Dia',
    'calc-2visitas': '2 Visitas/Dia',
    'calc-morada-label': 'A Sua Morada',
    'calc-morada-placeholder': 'Ex: Rua da Boavista, Vila Nova de Gaia',
    'calc-morada-info': 'Insira a morada para calcular a deslocação. Calculamos desde Matosinhos (sede). Valor máximo de deslocação: €5.',
    'calc-resumo': 'Resumo do Preço',
    'calc-servico-caes': 'Serviço de Cães',
    'calc-servico-gatos': 'Serviço de Gatos',
    'calc-deslocacao': 'Deslocação',
    'calc-dias': 'dias',
    'calc-visitas': 'visitas/dia',
    'calc-total': 'Total',
    'calc-btn-reserva': 'Pedir Reserva (Sem Pagamento)',
    'calc-info': 'Após submeter, preencha o formulário para confirmar a recolha das chaves',
    
    // Formulário de Reserva
    'reserva-title': 'Complete a Sua Reserva',
    'reserva-subtitle': 'Preencha os seus dados e entraremos em contacto em breve',
    'reserva-processo': 'Processo de Reserva',
    'reserva-step1': 'Enviará o pedido sem pagamento',
    'reserva-step2': 'Entraremos em contacto para validar',
    'reserva-step3': 'Marcamos dia para recolha de chaves e conhecer os animais',
    'reserva-step4': 'Confirmamos todos os detalhes antes do serviço começar',
    'reserva-form-title': 'Pedido de Reserva',
    'reserva-nome': 'Nome Completo *',
    'reserva-email': 'Email *',
    'reserva-telefone': 'Telefone / WhatsApp *',
    'reserva-morada': 'Morada Completa *',
    'reserva-info-animais': 'Informações sobre os Animais',
    'reserva-info-animais-placeholder': 'Ex: Nome, idade, raça, temperamento, hábitos alimentares, medicação, alergias...',
    'reserva-info-animais-nota': 'Quanto mais detalhes, melhor poderemos cuidar!',
    'reserva-instrucoes': 'Instruções Especiais / Notas Adicionais',
    'reserva-instrucoes-placeholder': 'Ex: Horários preferidos, instruções para medicação, rotinas especiais, acesso à casa...',
    'reserva-resumo': 'Resumo do Serviço',
    'reserva-resumo-datas': 'Datas:',
    'reserva-resumo-animais': 'Animais:',
    'reserva-resumo-visitas': 'Visitas/dia:',
    'reserva-resumo-distancia': 'Distância:',
    'reserva-preco-estimado': 'Preço Estimado:',
    'reserva-preco-nota': '* Preço poderá ser ajustado após validação',
    'reserva-contacto-preferido': 'Forma Preferida de Contacto',
    'reserva-contacto-telefone': 'Telefone',
    'reserva-contacto-whatsapp': 'WhatsApp',
    'reserva-contacto-email': 'Email',
    'reserva-disclaimer': 'Concordo que o PawSitter entre em contacto comigo para validar esta reserva e marcar o dia da recolha de chaves. Compreendo que o preço final poderá ser ajustado após validação.',
    'reserva-btn-enviar': 'Enviar Pedido de Reserva',
    'reserva-response-time': 'Responderemos em até 24 horas',
    
    // FAQ Perguntas
    'faq-q1': 'O que está incluído em cada visita?',
    'faq-a1': 'Cada visita inclui alimentação, água fresca, carinho e companhia, limpeza das áreas do animal (caixas de areia, comedouros), passeio com cães quando necessário, administração de medicação se necessário, e envio de fotos/atualizações para tranquilidade dos donos.',
    'faq-q2': 'Quanto tempo dura cada visita?',
    'faq-a2': 'Cada visita tem uma duração de aproximadamente 30-45 minutos, tempo suficiente para cuidar de todas as necessidades do seu animal, brincar e dar atenção. Se precisar de visitas mais longas, pode adicionar notas especiais na marcação.',
    'faq-q3': 'Como funciona o pagamento?',
    'faq-a3': 'Pode escolher entre pagamento online (por transferência ou MBWay) ou pagamento em mão no primeiro dia do serviço. O preço é sempre calculado automaticamente e apresentado antes de confirmar a marcação.',
    'faq-q4': 'E se o meu animal tiver necessidades especiais?',
    'faq-a4': 'Sem problema! No formulário de marcação há um campo de notas onde pode indicar horários específicos, medicação, comportamentos, alimentação, ou qualquer outra informação relevante. Adaptamos o serviço às necessidades únicas de cada animal.',
    'faq-q5': 'Posso cancelar ou alterar a marcação?',
    'faq-a5': 'Sim! Pedimos apenas que nos avise com 24 horas de antecedência para cancelamentos ou alterações. Entre em contacto connosco por email ou telefone e tratamos de tudo rapidamente.',
    'faq-q6': 'Como é calculada a deslocação?',
    'faq-a6': 'A deslocação tem um valor base de €2,50 + €0,50 por cada quilómetro de distância. Este custo é aplicado a cada visita (ex: se escolher 2 visitas por dia, o custo é multiplicado por 2). Tudo é calculado automaticamente na nossa calculadora de preços.',
    
    // Reviews
    'review4-text': 'A Bruna cuida com muito carinho da minha gata de 13 anos. A Frida adora os miminhos e a atenção quando preciso estar ausente, e eu ainda posso acompanhar e matar a saudade através dos vídeos e feedback da Bruna. Fico mais tranquila ao saber que ela fica em boas mãos, de quem tem também conhecimento sobre o assunto caso seja necessário. Recomendo muito o trabalho!',
    
    // Avaliações
    'reviews-title': 'O Que Dizem os Nossos Clientes',
    'reviews-subtitle': 'Confiança comprovada por quem já utilizou o nosso serviço',
    
    // FAQ
    'faq-title': 'Perguntas Frequentes',
    'faq-subtitle': 'Respostas às dúvidas mais comuns sobre o nosso serviço',
    'faq-btn': 'Entre em Contacto',
    'faq-question': 'Ainda tem dúvidas?',
    
    // Contacto
    'contacto-title': 'Entre em Contacto',
    'contacto-subtitle-left': 'Tem dúvidas ou precisa de ajuda com a sua marcação? Estamos aqui para ajudar!',
    'contacto-email': 'Email',
    'contacto-email-time': 'Respondemos em 24 horas',
    'contacto-phone': 'Telefone',
    'contacto-phone-time': 'Seg-Dom: 9h-20h',
    'contacto-whatsapp': 'WhatsApp',
    'contacto-whatsapp-time': 'Resposta rápida',
    'contacto-social': 'Siga-nos',
    'contacto-form-title': 'Envie-nos uma Mensagem',
    'contacto-note': 'Responderemos em até 24 horas',
    
    // Footer
    'footer-links': 'Links Rápidos',
    'footer-services': 'Serviços',
    'footer-contact': 'Contacto',
    'footer-home': 'Página inicial',
    'footer-about': 'Sobre',
    'footer-reviews': 'Avaliações',
    'footer-book': 'Marcar Serviço',
    'footer-desc': 'Cuidado profissional para o seu animal de estimação, no conforto do lar.<br>Marcação simples, preço transparente.',
    'footer-service1': 'Pet-Sitting ao Domicílio',
    'footer-service2': 'Cuidado de Cães',
    'footer-service3': 'Cuidado de Gatos',
    'footer-service4': 'Visitas Flexíveis',
    'footer-btn': 'Enviar Mensagem',
    'footer-copyright': '© 2026 PawSitter. Todos os direitos reservados.'
  },
  en: {
    // Menu
    'menu-sobre': 'About',
    'menu-servicos': 'Services',
    'menu-contacto': 'Contact',
    'menu-marcar': 'Book Service',
    
    // Hero
    'hero-title': 'Take Care of Your Pet<br>at <span class="highlight">Home</span>, with <span class="highlight">Trust</span>',
    'hero-subtitle': 'Professional petsitting service at home. Simple and fast booking, dedicated support and clear prices — no surprises.',
    'hero-badge1': '100% Safe',
    'hero-badge2': 'Flexible Hours',
    'hero-badge3': 'Home Comfort',
    'hero-btn1': 'Book Service Now',
    'hero-btn2': 'See How It Works',
    'hero-note': '— No commitment · — Transparent pricing · — Instant booking',
    
    // Como Funciona
    'como-title': 'How It Works',
    'como-subtitle': 'Booking care for your pet is simple and fast. No phone calls, no waiting.',
    'como-step1-title': 'Choose Dates',
    'como-step1-desc': 'Select when you need the service and how many visits per day',
    'como-step2-title': 'Indicate Your Pets',
    'como-step2-desc': 'How many dogs and cats do you have? You can combine both',
    'como-step3-title': 'See Final Price',
    'como-step3-desc': 'We calculate automatically including travel costs',
    'como-step4-title': 'Confirm Booking',
    'como-step4-desc': 'Choose payment method and you\'re done',
    'como-btn': 'Start Now',
    
    // Porque Escolher
    'porque-title': 'Why choose <span>Pawsitter</span>?',
    'porque-subtitle': 'My name is Bruna and I\'m the person behind PawSitter. I\'m a veterinary assistant and I created this service with love and dedication for animals.<br><br>I\'ve always had a special connection with them and I believe they deserve attention, affection and security, even when their owners can\'t be present. At PawSitter, I treat each animal as if it were my own, respecting their routines and needs.<br><br>If you\'re looking for a responsible and experienced petsitting service, PawSitter is a trusted choice. 🐶🐱',
    'porque-benefit1-title': 'Home Comfort',
    'porque-benefit1-desc': 'Your pet stays at home, without the stress of transport or unfamiliar spaces.',
    'porque-benefit2-title': 'Transparent Pricing',
    'porque-benefit2-desc': 'No hidden costs. See the final price before confirming.',
    'porque-benefit3-title': 'Total Flexibility',
    'porque-benefit3-desc': 'Choose 1 or 2 visits per day and combine dogs and cats.',
    'porque-benefit4-title': 'Instant Booking',
    'porque-benefit4-desc': 'No waiting. Make your request online in minutes.',
    
    // O Que Está Incluído
    'incluido-title': 'What\'s Included',
    'incluido-subtitle': 'Each visit is designed to ensure your pet\'s complete well-being',
    'incluido-card1-title': 'Feeding',
    'incluido-card1-desc': 'We respect the schedules and diets you indicate.',
    'incluido-card2-title': 'Affection and Company',
    'incluido-card2-desc': 'Quality time, play and dedicated attention.',
    'incluido-card3-title': 'Fresh Water',
    'incluido-card3-desc': 'We always renew water and ensure it\'s available.',
    'incluido-card4-title': 'Hygiene',
    'incluido-card4-desc': 'Cleaning of feeding areas and pet spaces.',
    'incluido-card5-title': 'Medication',
    'incluido-card5-desc': 'Administration according to your instructions (if necessary).',
    'incluido-card6-title': 'Updates',
    'incluido-card6-desc': 'Photos and messages so you know how your pet is doing.',
    'incluido-card7-title': 'Need something special?',
    'incluido-card7-desc': 'Every pet is unique and we adapt the service to specific needs',
    
    // CTA Banner
    'cta-title': 'Ready to Care for Your Best Friend?',
    'cta-desc': 'Book now and have peace of mind knowing your pet is in good hands, in the comfort of home',
    'cta-btn1': 'Book Service Now',
    'cta-btn2': 'Learn More About Us',
    'cta-badge1': 'Booking in minutes',
    'cta-badge2': 'No commitment',
    'cta-badge3': 'Transparent pricing',
    
    // Tabela de Preços
    'precos-title': 'Price Table',
    'precos-subtitle': 'Total transparency - know exactly what you\'ll pay',
    'precos-caes': 'Dogs',
    'precos-gatos': 'Cats',
    'precos-1visita': '1 Visit per Day',
    'precos-2visitas': '2 Visits per Day',
    'precos-desloc-title': 'Travel Costs',
    'precos-desloc-base': 'Base per visit',
    'precos-desloc-nota': 'The cost is applied to each visit (e.g.: 2 visits/day = cost ×2)',
    'precos-combine': '★ You can combine dogs and cats in the same service! Use the calculator to see the exact price.',
    'precos-ate2caes': 'Up to 2 dogs',
    'precos-34caes': '3-4 dogs',
    'precos-ate3gatos': 'Up to 3 cats',
    'precos-4plusgatos': '4+ cats',
    
    // Calculadora
    'calc-title': 'Calculate Your Price',
    'calc-subtitle': 'See how much it costs to care for your pet - transparent and no surprises',
    'calc-datas-label': 'Service Dates',
    'calc-data-inicio': 'Start Date',
    'calc-data-fim': 'End Date',
    'calc-dias-selecionados': 'days selected',
    'calc-animais-label': 'How Many Pets?',
    'calc-caes': 'Dogs',
    'calc-gatos': 'Cats',
    'calc-0caes': '0 dogs',
    'calc-1cao': '1 dog',
    'calc-2caes': '2 dogs',
    'calc-3caes': '3 dogs',
    'calc-4caes': '4 dogs',
    'calc-0gatos': '0 cats',
    'calc-1gato': '1 cat',
    'calc-2gatos': '2 cats',
    'calc-3gatos': '3 cats',
    'calc-4gatos': '4 cats',
    'calc-visitas-label': 'Visits per Day',
    'calc-1visita': '1 Visit/Day',
    'calc-2visitas': '2 Visits/Day',
    'calc-morada-label': 'Your Address',
    'calc-morada-placeholder': 'E.g.: Boavista Street, Vila Nova de Gaia',
    'calc-morada-info': 'Enter address to calculate travel cost. We calculate from Matosinhos (headquarters). Maximum travel cost: €5.',
    'calc-resumo': 'Price Summary',
    'calc-servico-caes': 'Dog Service',
    'calc-servico-gatos': 'Cat Service',
    'calc-deslocacao': 'Travel',
    'calc-dias': 'days',
    'calc-visitas': 'visits/day',
    'calc-total': 'Total',
    'calc-btn-reserva': 'Request Booking (No Payment)',
    'calc-info': 'After submitting, fill out the form to confirm key collection',
    
    // Formulário de Reserva
    'reserva-title': 'Complete Your Booking',
    'reserva-subtitle': 'Fill in your details and we will contact you soon',
    'reserva-processo': 'Booking Process',
    'reserva-step1': 'You will send the request without payment',
    'reserva-step2': 'We will contact you to validate',
    'reserva-step3': 'We schedule a day to collect keys and meet the pets',
    'reserva-step4': 'We confirm all details before the service starts',
    'reserva-form-title': 'Booking Request',
    'reserva-nome': 'Full Name *',
    'reserva-email': 'Email *',
    'reserva-telefone': 'Phone / WhatsApp *',
    'reserva-morada': 'Full Address *',
    'reserva-info-animais': 'Pet Information',
    'reserva-info-animais-placeholder': 'E.g.: Name, age, breed, temperament, eating habits, medication, allergies...',
    'reserva-info-animais-nota': 'The more details, the better we can care!',
    'reserva-instrucoes': 'Special Instructions / Additional Notes',
    'reserva-instrucoes-placeholder': 'E.g.: Preferred times, medication instructions, special routines, house access...',
    'reserva-resumo': 'Service Summary',
    'reserva-resumo-datas': 'Dates:',
    'reserva-resumo-animais': 'Pets:',
    'reserva-resumo-visitas': 'Visits/day:',
    'reserva-resumo-distancia': 'Distance:',
    'reserva-preco-estimado': 'Estimated Price:',
    'reserva-preco-nota': '* Price may be adjusted after validation',
    'reserva-contacto-preferido': 'Preferred Contact Method',
    'reserva-contacto-telefone': 'Phone',
    'reserva-contacto-whatsapp': 'WhatsApp',
    'reserva-contacto-email': 'Email',
    'reserva-disclaimer': 'I agree that PawSitter may contact me to validate this booking and schedule key collection. I understand that the final price may be adjusted after validation.',
    'reserva-btn-enviar': 'Send Booking Request',
    'reserva-response-time': 'We will reply within 24 hours',
    
    // FAQ Perguntas
    'faq-q1': 'What is included in each visit?',
    'faq-a1': 'Each visit includes feeding, fresh water, affection and company, cleaning of pet areas (litter boxes, feeders), dog walks when needed, medication administration if necessary, and sending photos/updates for owners\' peace of mind.',
    'faq-q2': 'How long does each visit last?',
    'faq-a2': 'Each visit lasts approximately 30-45 minutes, enough time to take care of all your pet\'s needs, play and give attention. If you need longer visits, you can add special notes when booking.',
    'faq-q3': 'How does payment work?',
    'faq-a3': 'You can choose between online payment (by transfer or MBWay) or payment in person on the first day of service. The price is always calculated automatically and presented before confirming the booking.',
    'faq-q4': 'What if my pet has special needs?',
    'faq-a4': 'No problem! In the booking form there is a notes field where you can indicate specific times, medication, behaviors, feeding, or any other relevant information. We adapt the service to the unique needs of each pet.',
    'faq-q5': 'Can I cancel or change the booking?',
    'faq-a5': 'Yes! We only ask that you notify us 24 hours in advance for cancellations or changes. Contact us by email or phone and we\'ll handle everything quickly.',
    'faq-q6': 'How is travel calculated?',
    'faq-a6': 'Travel has a base value of €2.50 + €0.50 for each kilometer of distance. This cost is applied to each visit (e.g.: if you choose 2 visits per day, the cost is multiplied by 2). Everything is calculated automatically in our price calculator.',
    
    // Reviews
    'review4-text': 'Bruna takes great care of my 13-year-old cat. Frida loves the cuddles and attention when I need to be away, and I can follow updates and videos from Bruna. I feel reassured knowing she is in knowledgeable, caring hands. I highly recommend her work!',
    
    // Avaliações
    'reviews-title': 'What Our Clients Say',
    'reviews-subtitle': 'Trust proven by those who have already used our service',
    
    // FAQ
    'faq-title': 'Frequently Asked Questions',
    'faq-subtitle': 'Answers to the most common questions about our service',
    'faq-btn': 'Get in Touch',
    'faq-question': 'Still have questions?',
    
    // Contacto
    'contacto-title': 'Get in Touch',
    'contacto-subtitle-left': 'Have questions or need help with your booking? We\'re here to help!',
    'contacto-email': 'Email',
    'contacto-email-time': 'We reply within 24 hours',
    'contacto-phone': 'Phone',
    'contacto-phone-time': 'Mon-Sun: 9am-8pm',
    'contacto-whatsapp': 'WhatsApp',
    'contacto-whatsapp-time': 'Quick response',
    'contacto-social': 'Follow us',
    'contacto-form-title': 'Send us a Message',
    'contacto-note': 'We will reply within 24 hours',
    
    // Footer
    'footer-links': 'Quick Links',
    'footer-services': 'Services',
    'footer-contact': 'Contact',
    'footer-home': 'Home',
    'footer-about': 'About',
    'footer-reviews': 'Reviews',
    'footer-book': 'Book Service',
    'footer-desc': 'Professional care for your pet, in the comfort of home.<br>Simple booking, transparent pricing.',
    'footer-service1': 'Pet-Sitting at Home',
    'footer-service2': 'Dog Care',
    'footer-service3': 'Cat Care',
    'footer-service4': 'Flexible Visits',
    'footer-btn': 'Send Message',
    'footer-copyright': '© 2026 PawSitter. All rights reserved.'
  }
};

let currentLang = localStorage.getItem('language') || 'pt';

function translatePage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // Atualizar todos os elementos com data-lang
  document.querySelectorAll('[data-lang]').forEach(element => {
    const key = element.getAttribute('data-lang');
    if (translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });
  
  // Atualizar placeholders
  document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
    const key = element.getAttribute('data-lang-placeholder');
    if (translations[lang][key]) {
      element.placeholder = translations[lang][key];
    }
  });
  
  // Atualizar options de select
  document.querySelectorAll('option[data-lang]').forEach(option => {
    const key = option.getAttribute('data-lang');
    if (translations[lang][key]) {
      option.textContent = translations[lang][key];
    }
  });
  
  // Atualizar número de dias selecionados dinamicamente
  const diasNum = document.getElementById('diasNum');
  if (diasNum) {
    const numDias = diasNum.textContent;
    document.getElementById('diasSelecionados').innerHTML = `<span id="diasNum">${numDias}</span> <span data-lang="calc-dias-selecionados">${translations[lang]['calc-dias-selecionados']}</span>`;
  }
  
  // Atualizar botões ativos
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang-switch') === lang) {
      btn.classList.add('active');
    }
  });
}

// Event listeners para botões de idioma
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang-switch');
    translatePage(lang);
  });
});

// Aplicar idioma salvo ao carregar
translatePage(currentLang);

// --- Reviews data + renderer (simple to edit) ---
// Edit this array to add/remove reviews. Each item may have: name, date, rating, text {pt,en}, image (optional path)
const reviews = [
  {
    id: 'dialla-2026-01-23',
    name: 'Dialla Dorneles',
    date: '23/01/2026',
    rating: 5,
    text: {
      pt: 'A Bruna cuida com muito carinho da minha gata de 13 anos. A Frida adora os miminhos e a atenção quando preciso estar ausente, e eu ainda posso acompanhar e matar a saudade através dos vídeos e feedback da Bruna. Fico mais tranquila ao saber que ela fica em boas mãos, de quem tem também conhecimento sobre o assunto caso seja necessário. Recomendo muito o trabalho!',
      en: 'Bruna takes great care of my 13-year-old cat. Frida loves the cuddles and attention when I need to be away, and I can follow updates and videos from Bruna. I feel reassured knowing she is in knowledgeable, caring hands. I highly recommend her work!'
    },
    image: null
  },
{
    id: 'viviane-2026-03-01',
    name: 'Viviane Morais',
    date: '01/03/2026',
    rating: 5,
    text: {
      pt: 'Tivemos sorte de nossos caminhos terem se cruzado. Desde a primeira visita em casa, a Bruna sempre foi muito atenciosa e profissional. Ganhou nossa confiança pela forma que sempre tratou nosso gato Kimi. Com muita paciência e delicadeza, ela trata dele desde o ano passado. O comportamento do Kimi é ótimo sempre que usamos esse serviço e certamente melhor que outras experiências anteriores que tivemos. Ficamos tranquilos sabendo que ela cuida dele como se fosse dela. O Kimi agradece o carinho, tia Bruna!',
      en: 'We were lucky that our paths crossed. From the first visit to our home, Bruna has always been very attentive and professional. She earned our trust with the way she has always treated our cat Kimi. With great patience and gentleness, she has been taking care of him since last year. Kimi s behavior is always great whenever we use this service and certainly better than other previous experiences we ve had. We feel reassured knowing that she takes care of him as if he were her own. Kimi thanks you for your affection, Aunt Bruna!'
    },
    image: 'Imagens reviews/Kimi_review.jpeg'
    },
];

function renderReviews() {
  const container = document.getElementById('reviewsGrid');
  if (!container) return;
  container.innerHTML = '';

  reviews.forEach(review => {
    const hasImage = review.image && review.image.trim() !== '';
    const card = document.createElement('div');
    card.className = 'review-card' + (hasImage ? '' : ' review-card-compact');

    const html = [];
    html.push('<div class="review-content">');
    html.push('<div class="review-header">');
    html.push('<div class="review-avatar-placeholder color-4"><i class="fas fa-user"></i></div>');
    html.push('<div class="review-info">');
    html.push(`<h4 class="review-name">${review.name}</h4>`);
    // build star icons so CSS targeting .review-stars i applies
    let starsHtml = '';
    for (let i = 0; i < review.rating; i++) {
      starsHtml += '<i class="fas fa-star" aria-hidden="true"></i>';
    }
    html.push('<div class="review-stars">' + starsHtml + `<span class="review-rating">${review.rating}.0</span></div>`);
    html.push('</div></div>');
    html.push('<div class="review-text-content">');
    const text = (currentLang === 'en' ? review.text.en : review.text.pt) || '';
    html.push(`<p class="review-text">${text}</p>`);
    html.push(`<p class="review-date"><i class="fas fa-calendar"></i> ${review.date}</p>`);
    html.push('</div></div>');
    if (hasImage) html.push(`<img src="${review.image}" alt="Foto de ${review.name}" class="review-photo">`);

    card.innerHTML = html.join('');
    container.appendChild(card);
  });
}

// Re-render reviews after translations or language change
function refreshReviewsForLanguage() {
  renderReviews();
}

// Call renderer now and whenever language changes
renderReviews();
// Ensure language switch re-renders reviews
const originalTranslatePage = translatePage;
translatePage = function(lang) {
  originalTranslatePage(lang);
  refreshReviewsForLanguage();
};
