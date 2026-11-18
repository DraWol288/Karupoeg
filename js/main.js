/* ==========================================================================
   PROJECT: OUR UNIVERSE — SHARED SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  /* ------------------------------------------------------------------------
     1. MAIN PAGE (index.html)
     ------------------------------------------------------------------------ */
  if (body.classList.contains('page-main')) {
    const particleRoot = document.getElementById('particles');
    if (particleRoot) {
      for (let i = 0; i < 38; i++) {
        const p = document.createElement('i');
        p.className = 'particle';
        const s = 2 + Math.random() * 5;
        p.style.width = s + 'px';
        p.style.height = s + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.setProperty('--duration', (7 + Math.random() * 10) + 's');
        p.style.animationDelay = (-Math.random() * 12) + 's';
        particleRoot.appendChild(p);
      }
    }

    // Live countdown to 1 January 2027 (local device time)
    const targetDate = new Date(2027, 0, 1, 0, 0, 0);
    function updateCountdown() {
      const titleEl = document.getElementById('countdownTitle');
      const timerEl = document.getElementById('timer');
      if (!titleEl || !timerEl) return;

      const remaining = targetDate.getTime() - Date.now();
      if (remaining <= 0) {
        titleEl.textContent = 'С НОВЫМ ГОДОМ!';
        timerEl.innerHTML = '<div class="time-unit" style="min-width:230px"><b>2027</b><span>НАЧИНАЕТСЯ НОВАЯ ГЛАВА</span></div>';
        return;
      }
      const values = {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor(remaining / 3600000) % 24,
        minutes: Math.floor(remaining / 60000) % 60,
        seconds: Math.floor(remaining / 1000) % 60
      };
      Object.entries(values).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value).padStart(2, '0');
      });
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Planet pulse interaction
    const planet = document.getElementById('planet');
    function pulsePlanet() {
      if (!planet) return;
      planet.classList.remove('pulse');
      void planet.offsetWidth;
      planet.classList.add('pulse');
      const label = document.querySelector('.visual-label b');
      if (label) {
        label.textContent = 'СИГНАЛ ОТПРАВЛЕН: ПРИНЯТ';
        setTimeout(() => {
          label.textContent = 'ВСЕЛЕННАЯ: В СЕТИ';
        }, 2200);
      }
    }
    if (planet) {
      planet.addEventListener('click', pulsePlanet);
      planet.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pulsePlanet();
        }
      });
    }

    // Classified message modal and hidden signal
    const modal = document.getElementById('modal');
    const modalMsg = document.getElementById('modalMessage');
    const closeBottom = document.getElementById('closeModalBottom');

    function openModal(message) {
      if (!modal || !modalMsg) return;
      modalMsg.textContent = message || 'Пусть в новом году у тебя будет больше поводов улыбаться, больше удивительных открытий и меньше поводов для тревог. А я постараюсь быть рядом — в каждой новой главе нашего приключения.';
      modal.classList.add('open');
      if (closeBottom) closeBottom.focus();
    }

    function closeModal() {
      if (modal) modal.classList.remove('open');
    }

    const secretOpen = document.getElementById('secretOpen');
    const secretOpen2 = document.getElementById('secretOpen2');
    const secretStar = document.getElementById('secretStar');
    const closeTop = document.getElementById('closeModal');

    if (secretOpen) secretOpen.addEventListener('click', () => openModal());
    if (secretOpen2) secretOpen2.addEventListener('click', () => openModal());
    if (secretStar) secretStar.addEventListener('click', () => openModal('Секретный сигнал принят. Среди бесконечного количества звёзд я всё равно выбрала бы именно нашу маленькую вселенную. 💚'));
    if (closeTop) closeTop.addEventListener('click', closeModal);
    if (closeBottom) closeBottom.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    // Ambient mode
    let audioContext = null, oscillator = null, gainNode = null, ambientOn = false;
    const ambientButton = document.getElementById('ambientToggle');
    function toggleAmbient() {
      ambientOn = !ambientOn;
      document.body.classList.toggle('ambient', ambientOn);
      if (ambientButton) {
        ambientButton.textContent = 'АТМОСФЕРНЫЙ РЕЖИМ: ' + (ambientOn ? 'ON' : 'OFF');
        ambientButton.setAttribute('aria-pressed', String(ambientOn));
      }
      if (ambientOn) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            audioContext = audioContext || new AudioCtx();
            if (audioContext.state === 'suspended') audioContext.resume();
            if (!oscillator) {
              oscillator = audioContext.createOscillator();
              gainNode = audioContext.createGain();
              oscillator.type = 'sine';
              oscillator.frequency.value = 110;
              gainNode.gain.value = 0.018;
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              oscillator.start();
            }
            gainNode.gain.setTargetAtTime(0.018, audioContext.currentTime, 0.3);
          }
        } catch (err) {
          // Visual ambient mode remains available if audio is unsupported
        }
      } else if (gainNode && audioContext) {
        gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.2);
      }
    }
    if (ambientButton) ambientButton.addEventListener('click', toggleAmbient);
  }

  /* ------------------------------------------------------------------------
     2. WAR THUNDER PAGE (war-thunder.html)
     ------------------------------------------------------------------------ */
  if (body.classList.contains('page-wt')) {
    const details = {
      B2: ['СЕВЕРНЫЙ АНГАР', 'Точка сбора и подготовки техники. Проверить экипаж, загрузить боекомплект и убедиться, что командир не забыл союзника.', 'ОБЪЕКТ: АНГАР · СТАТУС: АКТИВЕН'],
      C3: ['НАЗЕМНЫЙ ПОЛИГОН', 'Учебная зона наземных сил. На позиции отмечена машина Strv 103A — предмет особого внимания командира.', 'ОБЪЕКТ: STRV 103A · СТАТУС: ГОТОВ'],
      E1: ['ВОЗДУШНЫЙ КОРИДОР', 'Маршрут для воздушных операций. В текущей сводке указан J29 Tunnan, BR 9.0.', 'ОБЪЕКТ: J29 TUNNAN · СТАТУС: ДОСТУПЕН'],
      D4: ['КОНТРОЛЬНАЯ ТОЧКА', 'Зона наблюдения за сектором. Рекомендуется держать канал связи с союзником открытым.', 'ОБЪЕКТ: НАБЛЮДЕНИЕ · СТАТУС: ПОД КОНТРОЛЕМ']
    };

    const grid = document.getElementById('grid');
    if (grid) {
      for (let r = 1; r <= 4; r++) {
        for (let c = 0; c < 6; c++) {
          const id = String.fromCharCode(65 + c) + r;
          const b = document.createElement('button');
          b.className = 'sector' + (id === 'B2' ? ' sel' : '');
          b.textContent = id;
          if (details[id]) {
            const pin = document.createElement('span');
            pin.className = 'pin';
            pin.textContent = ({ B2: '⌂', C3: '▰', E1: '✈', D4: '◎' })[id];
            b.appendChild(pin);
          }
          b.addEventListener('click', () => {
            document.querySelectorAll('.sector').forEach(x => x.classList.remove('sel'));
            b.classList.add('sel');
            const d = details[id] || ['СЕКТОР ' + id, 'Заснеженный участок. Данные наблюдения доступны после дополнительной разведки.', 'ОБЪЕКТ: НЕ ИДЕНТИФИЦИРОВАН · СТАТУС: НЕИЗВЕСТЕН'];
            document.getElementById('coord').textContent = id;
            document.getElementById('stitle').textContent = d[0];
            document.getElementById('sdesc').textContent = d[1];
            document.getElementById('smeta').textContent = d[2];
          });
          grid.appendChild(b);
        }
      }
    }

    document.querySelectorAll('.tabs button').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        document.getElementById('ground').style.display = b.dataset.tab === 'ground' ? 'grid' : 'none';
        document.getElementById('air').style.display = b.dataset.tab === 'air' ? 'grid' : 'none';
      });
    });

    window.notify = function (t) {
      const x = document.getElementById('toast');
      if (!x) return;
      x.textContent = t;
      x.classList.add('show');
      setTimeout(() => x.classList.remove('show'), 2500);
    };

    window.modal = function (t, p) {
      const m = document.getElementById('modal');
      if (!m) return;
      document.getElementById('mtitle').textContent = t;
      document.getElementById('mtext').textContent = p;
      m.classList.add('show');
    };

    const snow = document.getElementById('snow');
    if (snow) {
      for (let i = 0; i < 42; i++) {
        const f = document.createElement('i');
        f.className = 'flake';
        f.style.left = Math.random() * 100 + '%';
        f.style.animationDuration = 7 + Math.random() * 12 + 's';
        f.style.animationDelay = -Math.random() * 15 + 's';
        snow.appendChild(f);
      }
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const m = document.getElementById('modal');
        if (m) m.classList.remove('show');
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. USS VOYAGER PAGE (voyager.html)
     ------------------------------------------------------------------------ */
  if (body.classList.contains('page-voyager')) {
    const intro = document.getElementById('intro');
    function enterSite() {
      if (intro) intro.classList.add('hidden');
    }
    if (intro) {
      intro.addEventListener('click', enterSite);
      intro.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          enterSite();
        }
      });
    }

    const navButtons = [...document.querySelectorAll('.page-navigation button')];
    function activateButton(activeButton) {
      navButtons.forEach(button => {
        button.classList.toggle('active', button === activeButton);
      });
    }

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.target);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        activateButton(button);
      });
    });

    const sections = navButtons
      .map(button => ({
        button,
        section: document.getElementById(button.dataset.target)
      }))
      .filter(item => item.section);

    if (sections.length) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const found = sections.find(item => item.section === visible.target);
        if (found) activateButton(found.button);
      }, {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.15, 0.35, 0.6]
      });

      sections.forEach(item => observer.observe(item.section));
    }

    const sectors = [
      ['A1', 'Тихая орбита', 'Спокойный участок пространства. Подходит для передышки.'],
      ['A2', 'Туманность', 'Область ярких газовых облаков и красивых видов.'],
      ['A3', 'Неизвестный сигнал', 'Зафиксирован слабый сигнал. Источник пока не установлен.'],
      ['A4', 'Звёздный форпост', 'Возможная точка пополнения запасов и обмена данными.'],
      ['A5', 'Пояс астероидов', 'Навигация требует повышенного внимания.'],
      ['A6', 'Глубокий космос', 'За пределами изученных маршрутов.'],
      ['B1', 'Дальний маяк', 'Автоматический маяк передаёт повторяющийся сигнал.'],
      ['B2', 'Новый горизонт', 'Сектор для будущих открытий и неожиданных историй.'],
      ['B3', 'Двойная звезда', 'Две звезды вращаются вокруг общего центра масс.'],
      ['B4', 'Планета класса M', 'Возможны условия для экспедиции на поверхность.'],
      ['B5', 'Зона тишины', 'Связь нестабильна. Держаться ближе к маршруту.'],
      ['B6', 'Свободный маршрут', 'Курс открыт. Решение остаётся за капитанами.'],
      ['C1', 'Космическая станция', 'Торговый и исследовательский узел.'],
      ['C2', 'Скопление звёзд', 'Плотная область звёздного поля.'],
      ['C3', 'Неизвестная система', 'Данные неполные. Требуется сканирование.'],
      ['C4', 'Навигационный узел', 'Удобная точка для построения следующего курса.'],
      ['C5', 'Солнечный ветер', 'Учитывать влияние звёздной активности.'],
      ['C6', 'Дальний сектор', 'Пока не нанесён на подробную карту.'],
      ['D1', 'Планета океанов', 'Голубой мир, покрытый бескрайними морями.'],
      ['D2', 'Красный гигант', 'Звезда на поздней стадии эволюции.'],
      ['D3', 'Край туманности', 'Красивый, но малоизученный регион.'],
      ['D4', 'Точка встречи', 'Место, где можно назначить следующую остановку.'],
      ['D5', 'Орбитальная дуга', 'Безопасный маршрут вокруг крупного объекта.'],
      ['D6', 'Неизвестность', 'Никаких данных. Только любопытство.']
    ];

    const map = document.getElementById('map');
    const mapInfo = document.getElementById('mapinfo');
    if (map && mapInfo) {
      sectors.forEach(sector => {
        const button = document.createElement('button');
        button.className = 'sector';
        button.innerHTML = `<b>${sector[0]}</b><small>${sector[1]}</small>`;
        button.addEventListener('click', () => {
          document.querySelectorAll('.sector').forEach(item => item.classList.remove('active'));
          button.classList.add('active');
          mapInfo.innerHTML = `<b style="color:var(--orange)">${sector[0]} · ${sector[1]}</b><br>${sector[2]}`;
        });
        map.appendChild(button);
      });
    }
  }

  /* ------------------------------------------------------------------------
     4. US PAGE (us.html)
     ------------------------------------------------------------------------ */
  if (body.classList.contains('page-us')) {
    const c = document.getElementById('stars');
    if (c) {
      const x = c.getContext('2d');
      let dots = [];
      function resize() {
        c.width = innerWidth * devicePixelRatio;
        c.height = innerHeight * devicePixelRatio;
        x.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        dots = Array.from({ length: Math.floor(innerWidth / 5) }, () => ({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.6 + 0.15,
          d: Math.random() * 0.012 + 0.003
        }));
      }
      function draw() {
        x.clearRect(0, 0, innerWidth, innerHeight);
        dots.forEach(s => {
          s.a += s.d;
          if (s.a > 0.8 || s.a < 0.1) s.d *= -1;
          x.fillStyle = `rgba(205,255,95,${s.a})`;
          x.beginPath();
          x.arc(s.x, s.y, s.r, 0, 7);
          x.fill();
        });
        requestAnimationFrame(draw);
      }
      window.addEventListener('resize', resize);
      resize();
      draw();
    }

    const planetData = {
      mars: [
        'PERSONAL PLANET FILE · YOU',
        'MARS — ТЫ',
        'Марс — твоя планета в нашей карте Вселенной. Здесь можно написать личные строки о себе: что тебе нравится в этой планете, какие её черты напоминают тебе о себе и почему ты выбрала именно её.'
      ],
      titan: [
        'PERSONAL PLANET FILE · HIM',
        'TITAN — ОН',
        'Титан — его мир. Загадочный спутник с плотной атмосферой, озёрами и скрытыми ландшафтами. Здесь можно добавить, почему эта планета ему нравится и какие ассоциации она вызывает у тебя.'
      ]
    };

    window.planet = function (id) {
      const d = planetData[id];
      const m = document.getElementById('modal');
      if (!d || !m) return;
      document.getElementById('mLabel').textContent = d[0];
      document.getElementById('mTitle').textContent = d[1];
      document.getElementById('mText').textContent = d[2];
      m.classList.add('show');
    };

    window.closePlanet = function () {
      const m = document.getElementById('modal');
      if (m) m.classList.remove('show');
    };

    // Просмотр изображений из таймлайна в полном размере
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');

    window.closeLightbox = function () {
      if (lightbox) lightbox.classList.remove('show');
    };

    document.querySelectorAll('body.page-us .timeline .card').forEach(card => {
  const hint = document.createElement('span');
  hint.className = 'zoom-hint';
  hint.textContent = 'ОТКРЫТЬ';
  card.appendChild(hint);

  card.addEventListener('click', () => {
    const img = card.querySelector('.photo img');
    if (!img || img.style.display === 'none' || !lightbox) return;

    // Только изображение — без подписи и текста
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';

    // Очищаем текстовые поля, чтобы они не отображались
    if (lightboxTag) lightboxTag.textContent = '';
    if (lightboxTitle) lightboxTitle.textContent = '';
    if (lightboxDesc) lightboxDesc.textContent = '';

    // Скрываем блок с подписью, если он есть в HTML
    const captionBlock = lightbox.querySelector('.lightbox-caption');
    if (captionBlock) captionBlock.style.display = 'none';

    lightbox.classList.add('show');
  });
});

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        window.closePlanet();
        if (window.closeLightbox) window.closeLightbox();
      }
    });

    // 3D Heart particle renderer in us.html
    const heartCanvas = document.getElementById('heart-canvas');
    const heartWrapper = document.getElementById('heart-canvas-wrapper');
    if (heartCanvas && heartWrapper) {
      const hCtx = heartCanvas.getContext('2d');
      let heartWidth = 0;
      let heartHeight = 0;

      const palettes = {
        pink: { core: [255, 95, 158], glow: 'rgba(255, 77, 141, 0.85)', ring: 'rgba(255, 110, 170, 0.18)' },
        lime: { core: [200, 255, 54], glow: 'rgba(200, 255, 54, 0.85)', ring: 'rgba(200, 255, 54, 0.18)' },
        cyan: { core: [56, 189, 248], glow: 'rgba(56, 189, 248, 0.85)', ring: 'rgba(56, 189, 248, 0.18)' },
        gold: { core: [251, 191, 36], glow: 'rgba(251, 191, 36, 0.85)', ring: 'rgba(251, 191, 36, 0.18)' }
      };
      let currentPalette = palettes.pink;

      window.setHeartPalette = function(key) {
        currentPalette = palettes[key] || palettes.pink;
        ['pink', 'lime', 'cyan', 'gold'].forEach(k => {
          const btn = document.getElementById('btn-color-' + k);
          if (!btn) return;
          if (k === key) {
            btn.classList.add('active', 'scale-125');
          } else {
            btn.classList.remove('active', 'scale-125');
          }
        });
      };

      let rotationSpeed = 1.2;
      const speedSlider = document.getElementById('speed-slider');
      const speedVal = document.getElementById('speed-val');
      if (speedSlider) {
        speedSlider.addEventListener('input', e => {
          rotationSpeed = parseFloat(e.target.value);
          if (speedVal) speedVal.textContent = rotationSpeed.toFixed(1) + 'x';
        });
      }

      const particles = [];
      const PARTICLE_COUNT = 1300;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = Math.random() * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const shell = Math.pow(Math.random(), 0.35);
        const maxThickness = 6 * Math.sqrt(Math.max(0, 1 - shell * shell));
        const zSign = Math.random() < 0.5 ? -1 : 1;
        const hz = zSign * Math.random() * maxThickness;

        particles.push({
          bx: hx * shell,
          by: hy * shell,
          bz: hz,
          size: Math.random() * 1.8 + 0.8,
          phase: Math.random() * Math.PI * 2
        });
      }

      let angleY = 0;
      let isDragging = false;
      let lastPointerX = 0;

      heartWrapper.addEventListener('pointerdown', e => {
        isDragging = true;
        lastPointerX = e.clientX;
      });
      window.addEventListener('pointermove', e => {
        if (!isDragging) return;
        const dx = e.clientX - lastPointerX;
        lastPointerX = e.clientX;
        angleY += dx * 0.01;
      });
      window.addEventListener('pointerup', () => { isDragging = false; });

      function resizeHeartCanvas() {
        const rect = heartWrapper.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const dpr = window.devicePixelRatio || 1;
        heartWidth = rect.width;
        heartHeight = rect.height;
        heartCanvas.width = heartWidth * dpr;
        heartCanvas.height = heartHeight * dpr;
        hCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      window.addEventListener('resize', resizeHeartCanvas);
      resizeHeartCanvas();

      let lastTime = performance.now();
      function renderHeart(now) {
        const dt = (now - lastTime) * 0.001;
        lastTime = now;

        if (heartWidth > 0 && heartHeight > 0) {
          hCtx.clearRect(0, 0, heartWidth, heartHeight);

          if (!isDragging) {
            angleY += dt * 0.85 * rotationSpeed;
          }

          const timeSec = now * 0.001;
          const beat = 1 + 0.055 * Math.sin(timeSec * 3.2) + 0.02 * Math.sin(timeSec * 6.4);
          const baseScale = Math.min(heartWidth, heartHeight) / 38;
          const scale = baseScale * beat;

          const centerX = heartWidth / 2;
          const centerY = heartHeight / 2 - baseScale * 1.2;

          hCtx.save();
          hCtx.strokeStyle = currentPalette.ring;
          hCtx.lineWidth = 1.2;
          hCtx.beginPath();
          hCtx.ellipse(centerX, centerY + baseScale * 16.5, baseScale * 13, baseScale * 3.2, 0, 0, Math.PI * 2);
          hCtx.stroke();
          hCtx.restore();

          const cosY = Math.cos(angleY);
          const sinY = Math.sin(angleY);
          const fov = 320;

          const projected = particles.map(p => {
            const rx = p.bx * cosY - p.bz * sinY;
            const rz = p.bx * sinY + p.bz * cosY;
            const ry = p.by;

            const zWorld = rz * scale;
            const perspective = fov / (fov + zWorld + 140);

            const x2d = centerX + rx * scale * perspective;
            const y2d = centerY + ry * scale * perspective;

            return { x: x2d, y: y2d, z: rz, perspective, size: p.size, phase: p.phase };
          });

          projected.sort((a, b) => b.z - a.z);
          const [r, g, b] = currentPalette.core;

          for (let i = 0; i < projected.length; i++) {
            const pt = projected[i];
            const depthFactor = Math.max(0.18, Math.min(1, (8 - pt.z) / 14));
            const twinkle = 0.8 + 0.2 * Math.sin(timeSec * 4 + pt.phase);
            const alpha = depthFactor * twinkle;
            const radius = Math.max(0.7, pt.size * pt.perspective * 1.35);

            hCtx.beginPath();
            hCtx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            hCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;

            if (pt.z < -1.5) {
              hCtx.shadowBlur = 10;
              hCtx.shadowColor = currentPalette.glow;
            } else {
              hCtx.shadowBlur = 0;
            }
            hCtx.fill();
          }
          hCtx.shadowBlur = 0;
        }
        requestAnimationFrame(renderHeart);
      }
      requestAnimationFrame(renderHeart);
    }
  }
});

// Global helper for inline onerror attribute on images in us.html
function fallback(img, name) {
  img.style.display = 'none';
  const p = document.createElement('div');
  p.className = 'placeholder';
  p.innerHTML = '<b>IMAGE PLACEHOLDER</b>Добавь файл:<br>images/' + name;
  img.parentNode.appendChild(p);
}
