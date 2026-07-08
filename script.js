const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('[data-menu]');
const navLinks = document.querySelectorAll('.nav-menu a');
const revealItems = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const faqQuestions = document.querySelectorAll('.faq-question');
const faqChatBody = document.querySelector('[data-faq-chat-body]');
const clearFaqButton = document.querySelector('[data-clear-faq]');
const scrollProgressBar = document.querySelector('[data-scroll-progress]');

const faqIntroMessage =
  'Olá! Escolha uma pergunta ao lado para tirar dúvidas sobre regularização, RT, ISO, rotulagem e segurança de alimentos.';

function closeMenu() {
  document.body.classList.remove('menu-open');
  navMenu?.classList.remove('is-open');
  navToggle?.classList.remove('is-active');
  navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

function createChatMessage(text, type = 'assistant', extraClass = '') {
  const message = document.createElement('div');
  message.className = `chat-message chat-message-${type}${extraClass ? ` ${extraClass}` : ''}`;
  message.textContent = text;
  return message;
}

function renderFaqIntro() {
  if (!faqChatBody) return;

  faqChatBody.replaceChildren(
    createChatMessage(faqIntroMessage, 'assistant', 'intro-message')
  );
}

function scrollFaqToBottom() {
  if (!faqChatBody) return;

  window.requestAnimationFrame(() => {
    faqChatBody.scrollTo({
      top: faqChatBody.scrollHeight,
      behavior: 'smooth'
    });
  });
}

function updateFaq(questionButton) {
  const question = questionButton.dataset.question?.trim();
  const answer = questionButton.dataset.answer?.trim();

  if (!faqChatBody || !question || !answer) return;

  faqQuestions.forEach((button) => button.classList.remove('is-active'));
  questionButton.classList.add('is-active');

  faqChatBody.append(
    createChatMessage(question, 'user'),
    createChatMessage(answer, 'assistant')
  );

  scrollFaqToBottom();
}

faqQuestions.forEach((button) => {
  button.addEventListener('click', () => updateFaq(button));
});

clearFaqButton?.addEventListener('click', () => {
  faqQuestions.forEach((button) => button.classList.remove('is-active'));
  renderFaqIntro();
});

function updateScrollProgress() {
  if (!scrollProgressBar) return;

  const documentElement = document.documentElement;
  const scrollableHeight = documentElement.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY || documentElement.scrollTop;
  const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

  scrollProgressBar.style.height = `${Math.min(Math.max(progress, 0), 100)}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);
updateScrollProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14,
  rootMargin: '0px 0px -70px 0px'
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 60}ms`;
  revealObserver.observe(item);
});

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute('id');
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
    });
  });
}, {
  threshold: 0.44
});

sections.forEach((section) => activeObserver.observe(section));

const desktopMenuBreakpoint = 1080;

window.addEventListener('resize', () => {
  if (window.innerWidth > desktopMenuBreakpoint) {
    closeMenu();
  }
});
