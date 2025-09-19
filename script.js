// 🎵 Музыка
const music = document.getElementById('bg-music');
const btn = document.getElementById('music-btn');
let playing = false;

btn.addEventListener('click', () => {
  if (!playing) {
    music.play().catch(err =>
      console.log("Автовоспроизведение запрещено:", err)
    );
    playing = true;
    btn.textContent = "⏸ Пауза";
  } else {
    music.pause();
    playing = false;
    btn.textContent = "🎵 Музыка";
  }
});

// ✨ Анимация заголовка
(function titleAnim() {
  const titleText = "С Днём Рождения, Дінназ!";
  const container = document.querySelector('.title');
  const words = titleText.split(' ');
  const speed = 60;

  words.forEach((w, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';

    [...w].forEach((char, i) => {
      const ch = document.createElement('span');
      ch.className = 'char';
      ch.textContent = char;
      ch.style.animationDelay = `${wi * 120 + i * speed}ms`;
      wordSpan.appendChild(ch);
    });

    container.appendChild(wordSpan);
    container.appendChild(document.createTextNode(' '));
  });
})();

// 🖼️ Слайдшоу
(function slideshow() {
  const slides = [...document.querySelectorAll('.slide')];
  const dotsWrap = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;
  let timer = null;
  const autoplayDelay = 4200;

  // точки навигации
  slides.forEach((s, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dot.addEventListener('click', () => goto(i));
    dotsWrap.appendChild(dot);
  });

  function update() {
    slides.forEach(s => s.classList.remove('active'));
    slides[current].classList.add('active');

    [...dotsWrap.children].forEach(d => d.classList.remove('active'));
    dotsWrap.children[current]?.classList.add('active');
  }

  function goto(i) {
    current = (i + slides.length) % slides.length;
    update();
    resetTimer();
    slides[current]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function next() { goto(current + 1); }
  function prev() { goto(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // стрелки с клавиатуры
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // свайпы
  const container = document.getElementById('slideshow');
  let xStart = null;
  container.addEventListener('touchstart', e => {
    xStart = e.changedTouches[0].clientX;
  }, { passive: true });
  container.addEventListener('touchend', e => {
    if (xStart === null) return;
    const dx = e.changedTouches[0].clientX - xStart;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    xStart = null;
  });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, autoplayDelay);
  }

  resetTimer();
  update();
})();

// 🌸 Частицы
(function particles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h;
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class P {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = rand(0, w);
      this.y = init ? rand(0, h) : h + rand(10, 120);
      this.vy = rand(-0.3, -1.2);
      this.vx = rand(-0.4, 0.4);
      this.r = rand(0.6, 2.6);
      this.life = rand(200, 700);
      this.alpha = rand(0.12, 0.9);
      this.hue = rand(270, 340);
      this.age = 0;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.y < -30 || this.x < -60 || this.x > w + 60) {
        this.reset(false);
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha * (1 - (this.age / this.life) * 0.6);
      ctx.shadowBlur = Math.min(26, this.r * 9);
      ctx.shadowColor = `hsla(${this.hue},80%,70%,${this.alpha})`;
      ctx.fillStyle = `hsla(${this.hue},70%,92%,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    const max = Math.min(80, Math.floor((w * h) / 42000));
    particles.length = 0;
    for (let i = 0; i < max; i++) particles.push(new P());
  }

  function onResize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', onResize);
  onResize();

  function frame() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.step(); p.draw(ctx); });
    requestAnimationFrame(frame);
  }
  frame();
})();

// 💌 Появление письма
(function letterReveal() {
  const letter = document.getElementById('letter');
  letter.classList.add('hidden');
  setTimeout(() => {
    letter.classList.remove('hidden');
    letter.classList.add('visible');
  }, 850);
})();

// 🌆 Плавное появление картинок
(function imgFade() {
  document.querySelectorAll('.slide img').forEach(img => {
    img.classList.add('img-hidden');
    img.addEventListener('load', () => img.classList.add('img-visible'));
    setTimeout(() => { if (!img.complete) img.classList.add('img-error'); }, 700);
  });
})();
