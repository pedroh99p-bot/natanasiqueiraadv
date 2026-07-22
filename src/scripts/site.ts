const ready = (callback: () => void) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
};

const trackEvent = (name: string, properties: Record<string, string> = {}) => {
  window.dispatchEvent(
    new CustomEvent('landing:track', {
      detail: {
        name,
        properties,
      },
    }),
  );
};

const getFocusable = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null);

const setupTrackedEvents = () => {
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-event]') : null;
    if (!target) return;

    const eventName = target.dataset.event;
    if (!eventName) return;

    const source = target.dataset.eventSource;
    trackEvent(eventName, source ? { source } : {});
  });
};

const setupHeader = () => {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const update = () => {
    header.dataset.compact = window.scrollY > 18 ? 'true' : 'false';
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
};

const setupMenu = () => {
  const drawer = document.querySelector<HTMLElement>('[data-menu-drawer]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!drawer || !toggle) return;

  let lastFocused: HTMLElement | null = null;

  const setPageInert = (isInert: boolean) => {
    document.querySelector('main')?.toggleAttribute('inert', isInert);
    document.querySelector('.site-footer')?.toggleAttribute('inert', isInert);
  };

  const openMenu = () => {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawer.hidden = false;
    document.body.classList.add('menu-is-open');
    setPageInert(true);
    toggle.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      const firstFocusable = getFocusable(drawer)[0];
      firstFocusable?.focus();
    });
  };

  const closeMenu = () => {
    drawer.classList.remove('is-open');
    document.body.classList.remove('menu-is-open');
    setPageInert(false);
    toggle.setAttribute('aria-expanded', 'false');
    window.setTimeout(() => {
      drawer.hidden = true;
      lastFocused?.focus();
    }, 180);
  };

  toggle.addEventListener('click', () => {
    if (drawer.hidden) {
      openMenu();
      return;
    }

    closeMenu();
  });

  closeButton?.addEventListener('click', closeMenu);

  drawer.addEventListener('click', (event) => {
    if (event.target === drawer) closeMenu();
  });

  drawer.querySelectorAll<HTMLElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (drawer.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusable(drawer);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
};

type QuizAnswers = {
  situation?: string;
  timing?: string;
  location?: string;
};

const setupQuiz = () => {
  const root = document.querySelector<HTMLFormElement>('[data-quiz]');
  if (!root) return;

  const storageKey = 'natan-siqueira-quiz-v1';
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-quiz-step]'));
  const prevButton = root.querySelector<HTMLButtonElement>('[data-quiz-prev]');
  const nextButton = root.querySelector<HTMLButtonElement>('[data-quiz-next]');
  const progress = root.querySelector<HTMLElement>('[data-quiz-progress]');
  const counter = root.querySelector<HTMLElement>('[data-quiz-counter]');
  const status = root.querySelector<HTMLElement>('[data-quiz-status]');
  const error = root.querySelector<HTMLElement>('[data-quiz-error]');
  const whatsappNumber = root.dataset.whatsappNumber ?? '';
  const summaryFields = Array.from(root.querySelectorAll<HTMLElement>('[data-quiz-summary]'));
  const reviewButton = root.querySelector<HTMLAnchorElement>('[data-quiz-whatsapp]');
  const resetButton = root.querySelector<HTMLButtonElement>('[data-quiz-reset]');

  let currentStep = 0;
  let answers: QuizAnswers = {};
  let hasStarted = false;

  const readStoredAnswers = () => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) answers = JSON.parse(stored) as QuizAnswers;
    } catch {
      answers = {};
    }
  };

  const saveAnswers = () => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // Session storage is a progressive enhancement; the quiz remains usable without it.
    }
  };

  const restoreInputs = () => {
    root.querySelectorAll<HTMLInputElement>('input[name="situation"]').forEach((input) => {
      input.checked = input.value === answers.situation;
    });
    root.querySelectorAll<HTMLInputElement>('input[name="timing"]').forEach((input) => {
      input.checked = input.value === answers.timing;
    });
    const location = root.querySelector<HTMLInputElement>('input[name="location"]');
    if (location && answers.location) location.value = answers.location;
  };

  const setStatus = (message = '') => {
    if (status) status.textContent = message;
  };

  const updateSummary = () => {
    summaryFields.forEach((field) => {
      const key = field.dataset.quizSummary as keyof QuizAnswers | undefined;
      if (!key) return;
      field.textContent = answers[key] || '-';
    });
    if (reviewButton && whatsappNumber) {
      reviewButton.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    }
  };

  const isValidStep = (stepIndex: number) => {
    if (stepIndex === 0) return Boolean(answers.situation);
    if (stepIndex === 1) return Boolean(answers.timing);
    if (stepIndex === 2) return Boolean(answers.location && answers.location.trim().length >= 3);
    return true;
  };

  const showStep = (stepIndex: number) => {
    currentStep = Math.max(0, Math.min(stepIndex, steps.length - 1));

    steps.forEach((step, index) => {
      step.hidden = index !== currentStep;
    });

    if (progress) progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    if (counter) counter.textContent = `${currentStep + 1} de ${steps.length}`;
    if (prevButton) prevButton.hidden = currentStep === 0;
    if (nextButton) nextButton.hidden = currentStep === steps.length - 1;

    if (currentStep === steps.length - 1) {
      updateSummary();
      trackEvent('quiz_review');
    }

    const visibleInput = steps[currentStep]?.querySelector<HTMLInputElement>('input');
    if (visibleInput && currentStep === 2) visibleInput.focus();
  };

  const completeStep = () => {
    if (!isValidStep(currentStep)) {
      if (currentStep === 2) {
        error?.removeAttribute('hidden');
        root.querySelector<HTMLInputElement>('input[name="location"]')?.focus();
      }
      setStatus('Revise a informação antes de avançar.');
      return;
    }

    error?.setAttribute('hidden', '');
    trackEvent('quiz_step_complete', { step: String(currentStep + 1) });
    showStep(currentStep + 1);
  };

  const resetQuiz = () => {
    answers = {};
    root.reset();
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures.
    }
    setStatus('');
    error?.setAttribute('hidden', '');
    showStep(0);
  };

  const buildWhatsAppMessage = () => {
    return [
      'Olá, Dr. Natan. Vim pelo site.',
      '',
      `Situação: ${answers.situation ?? '-'}`,
      `Quando aconteceu: ${answers.timing ?? '-'}`,
      `Cidade e estado: ${answers.location ?? '-'}`,
      '',
      'Gostaria de verificar a possibilidade de atendimento.',
    ].join('\n');
  };

  const openQuizWhatsApp = (event: Event) => {
    if (!isValidStep(0) || !isValidStep(1) || !isValidStep(2) || !whatsappNumber) {
      event.preventDefault();
      setStatus('Complete as respostas antes de abrir o WhatsApp.');
      return;
    }

    trackEvent('quiz_whatsapp_open');
  };

  readStoredAnswers();
  restoreInputs();
  showStep(answers.situation ? (answers.timing ? (answers.location ? 3 : 2) : 1) : 0);

  root.addEventListener('change', (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input) return;

    if (!hasStarted) {
      hasStarted = true;
      trackEvent('start_quiz');
    }

    if (input.name === 'situation') answers.situation = input.value;
    if (input.name === 'timing') answers.timing = input.value;

    saveAnswers();
    setStatus('Resposta registrada.');

    if ((input.name === 'situation' || input.name === 'timing') && currentStep < 2) {
      window.setTimeout(completeStep, 180);
    }
  });

  root.addEventListener('input', (event) => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input || input.name !== 'location') return;

    if (!hasStarted) {
      hasStarted = true;
      trackEvent('start_quiz');
    }

    answers.location = input.value.trim();
    error?.setAttribute('hidden', '');
    saveAnswers();
  });

  nextButton?.addEventListener('click', completeStep);
  prevButton?.addEventListener('click', () => showStep(currentStep - 1));
  reviewButton?.addEventListener('click', openQuizWhatsApp);
  resetButton?.addEventListener('click', resetQuiz);

  root.querySelectorAll<HTMLButtonElement>('[data-quiz-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = Number(button.dataset.quizEdit);
      if (Number.isFinite(target)) showStep(target);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-quiz-reset-link]').forEach((link) => {
    link.addEventListener('click', resetQuiz);
  });
};

const setupCarousel = () => {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector<HTMLElement>('[data-carousel-track]');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]'));
    const prev = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
    let active = 0;
    let frame = 0;

    const setActive = (index: number) => {
      active = Math.max(0, Math.min(index, slides.length - 1));
      dots.forEach((dot, dotIndex) => {
        dot.setAttribute('aria-current', dotIndex === active ? 'true' : 'false');
      });
    };

    const scrollToSlide = (index: number) => {
      slides[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActive(index);
    };

    const updateActiveFromScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const trackStyle = getComputedStyle(track);
        const targetLeft = trackRect.left + Number.parseFloat(trackStyle.paddingLeft || '0');
        const nearest = slides.reduce(
          (best, slide, index) => {
            const rect = slide.getBoundingClientRect();
            const distance = Math.abs(rect.left - targetLeft);
            return distance < best.distance ? { index, distance } : best;
          },
          { index: 0, distance: Number.POSITIVE_INFINITY },
        );
        setActive(nearest.index);
      });
    };

    prev?.addEventListener('click', () => scrollToSlide(active - 1));
    next?.addEventListener('click', () => scrollToSlide(active + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => scrollToSlide(index)));
    track.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToSlide(active - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToSlide(active + 1);
      }
    });
  });
};

const setupFaq = () => {
  document.querySelectorAll<HTMLElement>('[data-faq]').forEach((faq) => {
    const items = Array.from(faq.querySelectorAll<HTMLElement>('[data-faq-item]'));

    const closeItem = (item: HTMLElement) => {
      const button = item.querySelector<HTMLButtonElement>('[data-faq-button]');
      const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
      button?.setAttribute('aria-expanded', 'false');
      panel?.setAttribute('aria-hidden', 'true');
    };

    const openItem = (item: HTMLElement) => {
      const button = item.querySelector<HTMLButtonElement>('[data-faq-button]');
      const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
      button?.setAttribute('aria-expanded', 'true');
      panel?.setAttribute('aria-hidden', 'false');
    };

    items.forEach((item, index) => {
      const button = item.querySelector<HTMLButtonElement>('[data-faq-button]');
      button?.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        items.forEach(closeItem);
        if (!isOpen) {
          openItem(item);
          trackEvent('faq_open', { index: String(index + 1) });
        }
      });
    });
  });
};

const setupTimeline = () => {
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  if (!timeline) return;

  const steps = Array.from(timeline.querySelectorAll<HTMLElement>('[data-timeline-step]'));

  const activate = (step: HTMLElement) => {
    steps.forEach((item) => item.classList.toggle('is-active', item === step));
  };

  if (!('IntersectionObserver' in window)) {
    if (steps[0]) activate(steps[0]);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target instanceof HTMLElement) activate(visible.target);
    },
    { rootMargin: '-20% 0px -45% 0px', threshold: [0.25, 0.5, 0.75] },
  );

  steps.forEach((step) => observer.observe(step));
  if (steps[0]) activate(steps[0]);
};

const setupReveals = () => {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
  );

  items.forEach((item) => observer.observe(item));
};

ready(() => {
  document.documentElement.classList.add('js');
  setupTrackedEvents();
  setupHeader();
  setupMenu();
  setupQuiz();
  setupCarousel();
  setupFaq();
  setupTimeline();
  setupReveals();
});
