export const site = {
  name: 'Dr. Natan Siqueira',
  shortName: 'Natan Siqueira',
  profession: 'Advocacia Criminal',
  registration: 'OAB/RJ',
  whatsapp: {
    display: '+55 21 96505-1288',
    number: '5521965051288',
    href: 'https://wa.me/5521965051288',
  },
  instagram: {
    display: '@chamaodr.natan',
    href: 'https://www.instagram.com/chamaodr.natan/',
  },
  assets: {
    horizontalLogo:
      'https://res.cloudinary.com/dhbrxzt5a/image/upload/v1784729831/68fb54f1-838c-4aef-a5aa-3f2f853193b8_1_1_tle6ib.webp',
    roundSymbol:
      'https://res.cloudinary.com/dhbrxzt5a/image/upload/v1784729832/668d934d-26cb-45c6-818a-c1fac53afe73_1_vwpgc9.webp',
    whatsappLogo:
      'https://res.cloudinary.com/dhbrxzt5a/image/upload/v1784740034/whatsapp-logo-png_iyyy0e.webp',
    heroPhoto:
      'https://res.cloudinary.com/dhbrxzt5a/image/upload/v1784730827/MWS_0266_hysvkf.webp',
    specialistPhoto:
      'https://res.cloudinary.com/dhbrxzt5a/image/upload/v1784730874/MWS_0264_zum8kv.webp',
  },
  navLinks: [
    { label: 'Início', href: '#inicio' },
    { label: 'Apresentar situação', href: '#quiz' },
    { label: 'Sobre', href: '#especialista' },
    { label: 'Pilares', href: '#pilares' },
    { label: 'Áreas de atuação', href: '#areas' },
    { label: 'Como funciona', href: '#processo' },
    { label: 'Perguntas frequentes', href: '#faq' },
    { label: 'Falar com o advogado', href: '#final' },
  ],
  authorityRoller: ['ÉTICA', 'TÉCNICA', 'HUMANIDADE', 'EVIDÊNCIAS', 'RESPONSABILIDADE'],
  transitionRoller: ['CADA FATO EXIGE ANÁLISE', 'CADA PESSOA MERECE UMA DEFESA RESPONSÁVEL'],
  pillars: [
    {
      number: '01',
      title: 'Defesa técnica',
      description: 'Análise cuidadosa dos fatos, provas e procedimentos.',
    },
    {
      number: '02',
      title: 'Estratégia individualizada',
      description: 'Cada situação exige uma abordagem própria.',
    },
    {
      number: '03',
      title: 'Comunicação clara',
      description: 'Orientação objetiva sobre medidas e próximos passos.',
    },
    {
      number: '04',
      title: 'Respeito humano',
      description: 'Atendimento responsável, confidencial e sem julgamentos.',
    },
  ],
  practiceAreas: [
    { title: 'Prisão em flagrante', icon: 'handcuffs', description: 'Leitura imediata do cenário e das medidas cabíveis.' },
    { title: 'Audiência de custódia', icon: 'gavel', description: 'Acompanhamento técnico do primeiro controle judicial.' },
    { title: 'Inquérito policial', icon: 'search', description: 'Análise inicial do que foi apurado e do que ainda falta esclarecer.' },
    { title: 'Intimação para depoimento', icon: 'file-text', description: 'Orientação sobre postura, riscos e direitos antes do comparecimento.' },
    { title: 'Busca e apreensão', icon: 'shield', description: 'Avaliação dos limites do ato e dos documentos envolvidos.' },
    { title: 'Processo criminal', icon: 'scale', description: 'Leitura da fase processual e dos próximos passos.' },
    { title: 'Tribunal do Júri', icon: 'users', description: 'Estruturação da defesa conforme a dinâmica do júri.' },
    { title: 'Habeas corpus', icon: 'lock-open', description: 'Ação técnica quando houver discussão sobre liberdade ou ilegalidade.' },
    { title: 'Recursos criminais', icon: 'refresh-cw', description: 'Revisão da decisão e dos fundamentos disponíveis.' },
    { title: 'Execução penal', icon: 'clipboard-list', description: 'Acompanhamento de progressão, benefícios e incidentes da execução.' },
  ],
  process: [
    {
      number: '01',
      title: 'Primeiro contato',
      description: 'A pessoa apresenta brevemente a situação.',
    },
    {
      number: '02',
      title: 'Análise do contexto',
      description: 'As informações iniciais são avaliadas.',
    },
    {
      number: '03',
      title: 'Orientação inicial',
      description: 'São explicados os possíveis próximos passos.',
    },
    {
      number: '04',
      title: 'Acompanhamento jurídico',
      description: 'Após a contratação, são conduzidas as medidas adequadas.',
    },
  ],
  faqs: [
    {
      question: 'Quando devo procurar um advogado criminalista?',
      answer:
        'Logo que houver intimação, investigação, prisão, audiência ou qualquer risco de restrição de direitos. Quanto antes houver análise técnica, mais claro fica o cenário.',
    },
    {
      question: 'O atendimento é sigiloso?',
      answer:
        'Sim. A comunicação entre advogado e cliente é protegida por sigilo profissional e deve ser tratada com confidencialidade.',
    },
    {
      question: 'Posso ser acompanhado em um depoimento?',
      answer:
        'Em muitos casos, sim. O ideal é verificar o contexto antes do comparecimento para definir a atuação adequada.',
    },
    {
      question: 'Um familiar foi preso. O que devo informar?',
      answer:
        'Informe onde ocorreu a prisão, quando aconteceu, qual unidade está responsável e qualquer documento ou intimação já recebidos.',
    },
    {
      question: 'O atendimento pode acontecer à distância?',
      answer:
        'Sim, quando a análise inicial puder ser feita por telefone ou WhatsApp e a situação permitir esse formato.',
    },
    {
      question: 'A mensagem enviada já representa contratação?',
      answer:
        'Não. A mensagem serve para iniciar o contato e organizar a análise inicial da situação.',
    },
  ],
  socialLinks: [
    { label: 'WhatsApp', href: 'https://wa.me/5521965051288', external: true },
    { label: 'Instagram', href: 'https://www.instagram.com/chamaodr.natan/', external: true },
  ],
  legalNotes: ['Política de privacidade', 'Termos de uso', 'Aviso jurídico'],
} as const;

export const quiz = {
  steps: [
    {
      key: 'situation',
      title: 'Qual situação se aproxima do seu caso?',
      type: 'choice' as const,
      options: [
        'Prisão em flagrante',
        'Intimação ou depoimento',
        'Investigação em curso',
        'Processo criminal',
        'Familiar preso',
        'Outra situação',
      ],
    },
    {
      key: 'timing',
      title: 'Quando isso aconteceu?',
      type: 'choice' as const,
      options: ['Está acontecendo agora', 'Nas últimas 24 horas', 'Nos últimos dias', 'Há mais tempo'],
    },
    {
      key: 'location',
      title: 'Em qual cidade e estado ocorreu?',
      type: 'text' as const,
      placeholder: 'Digite cidade e estado',
    },
    {
      key: 'review',
      title: 'Revise antes de enviar',
      type: 'review' as const,
    },
  ],
} as const;

export type QuizKey = (typeof quiz.steps)[number]['key'];
