const works = [
  { title: 'Sunrise Diaries — Travel Reel', tag: 'Reel / Grade', src: 'videos/sunrise-diaries.mp4', thumb: 'travel', ratio: 'portrait' },
  { title: 'The Last Harvest — Short Doc', tag: 'Documentary / Sound', src: 'videos/the-last-harvest.mp4', thumb: 'doc', ratio: 'portrait' },
  { title: 'Creator Journey — Vlog Series', tag: 'YouTube / Pacing', src: 'videos/creator-journey.mp4', thumb: 'creator', ratio: 'portrait' },
  { title: 'Player One — Gaming Montage', tag: 'Montage / Cuts', src: 'videos/player-one.mp4', thumb: 'gaming', ratio: 'portrait' },
  { title: 'City Nights — Brand Film', tag: 'Brand / Color', src: 'videos/city-nights.mp4', thumb: 'city', ratio: 'portrait' },
];

const thumbGradients = {
  city: 'linear-gradient(135deg, #1b2735, #090a0f)',
  creator: 'linear-gradient(135deg, #3a1c1c, #160a0a)',
  doc: 'linear-gradient(135deg, #212d21, #0a0f0a)',
  gaming: 'linear-gradient(135deg, #2a1b3a, #0f0a17)',
  travel: 'linear-gradient(135deg, #1c3a2e, #0a1710)',
};

const grid = document.getElementById('work-grid');

works.forEach((w, i) => {
  const card = document.createElement('article');
  card.className = 'work-card reveal' + (w.ratio === 'portrait' ? ' portrait' : '');
  card.innerHTML = `
    <div class="placeholder" style="background:${thumbGradients[w.thumb]}">
      <img src="${w.src.replace(/\.mp4$/, '.jpg')}" alt="${w.title}" loading="lazy" />
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" fill="#fff" opacity=".15"></polygon>
      </svg>
    </div>
    <div class="work-overlay">
      <h3>${w.title}</h3>
      <p>${w.tag}</p>
    </div>
  `;
  card.addEventListener('click', () => openModal(i));
  grid.appendChild(card);
});

const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal-box">
    <iframe allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="display:none"></iframe>
    <video controls playsinline style="display:none; width:100%; height:100%"></video>
    <span class="modal-full">FULL FILM</span>
  </div>
  <button class="modal-nav prev" aria-label="Previous work">&#8249;</button>
  <button class="modal-nav next" aria-label="Next work">&#8250;</button>
  <button class="modal-close" aria-label="Close">&times;</button>
`;
document.body.appendChild(modal);

const iframe = modal.querySelector('iframe');
const video = modal.querySelector('video');
const modalBox = modal.querySelector('.modal-box');
let currentIndex = 0;

function isYouTube(src) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(src);
}

function openModal(i) {
  currentIndex = (i + works.length) % works.length;
  const w = works[currentIndex];
  modalBox.classList.toggle('portrait', w.ratio === 'portrait');
  if (isYouTube(w.src)) {
    iframe.src = w.src;
    iframe.style.display = 'block';
    video.style.display = 'none';
    video.removeAttribute('src');
  } else {
    video.src = w.src;
    video.poster = w.src.replace(/\.mp4$/, '.jpg');
    video.style.display = 'block';
    iframe.style.display = 'none';
    iframe.removeAttribute('src');
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  iframe.removeAttribute('src');
  video.pause();
  video.removeAttribute('src');
  document.body.style.overflow = '';
}

function prevWork() { openModal(currentIndex - 1); }
function nextWork() { openModal(currentIndex + 1); }

modal.querySelector('.modal-close').addEventListener('click', closeModal);
modal.querySelector('.modal-nav.prev').addEventListener('click', (e) => { e.stopPropagation(); prevWork(); });
modal.querySelector('.modal-nav.next').addEventListener('click', (e) => { e.stopPropagation(); nextWork(); });
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (modal.classList.contains('open')) {
    if (e.key === 'ArrowLeft') prevWork();
    if (e.key === 'ArrowRight') nextWork();
  }
});

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  const formData = Object.fromEntries(new FormData(form).entries());
  btn.textContent = 'Sending...';
  btn.disabled = true;
  emailjs.send('service_ujgrlvi', 'template_1o9mngd', formData, 'bJ7N_1Uo4PEf8iN5v')
    .then(() => {
      btn.textContent = 'Brief sent — I\'ll reply within 24h';
      btn.style.background = '#2e7d46';
      form.reset();
    })
    .catch(() => {
      btn.textContent = 'Failed — try again or email me directly';
      btn.style.background = '#8a2f2f';
    })
    .finally(() => {
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = 'Send Brief';
        btn.style.background = '';
      }, 4000);
    });
});