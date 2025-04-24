////////////// Start by adding fullscreen functionality to the game container

const container = document.getElementById('game-container');
const fsBtn = document.getElementById('fs-btn');
const exitFsBtn = document.getElementById('exit-fs-btn');

// enter fullscreen
fsBtn.addEventListener('click', () => {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen(); // Safari
  }
});

// exit fullscreen
exitFsBtn.addEventListener('click', () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen(); // Safari
  }
});

// toggle buttons on fullscreen change
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement === container) {
    fsBtn.style.display = 'none';
    exitFsBtn.style.display = 'inline-block';
  } else {
    fsBtn.style.display = 'inline-block';
    exitFsBtn.style.display = 'none';
  }
});


////// then add the help popup functionality


const badge   = document.getElementById('index-badge');
const popup   = document.getElementById('help-popup');
const closeBtn= document.getElementById('help-close');

// Toggle popup on badge click
badge.addEventListener('click', () => {
  popup.classList.toggle('visible');
});

// Close when user clicks the ×
closeBtn.addEventListener('click', () => {
  popup.classList.remove('visible');
});

// (Optional) Close if user clicks outside the popup
document.addEventListener('click', e => {
  if (!popup.contains(e.target) && !badge.contains(e.target)) {
    popup.classList.remove('visible');
  }
});

////// then add the lightbox functionality

// ─── Lightbox setup ───
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxClose   = document.getElementById('lightbox-close');

// 1) When ANY image is clicked, open the lightbox
document.querySelectorAll('img').forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', e => {
    lightboxImg.src = img.src;
    lightboxOverlay.classList.add('visible');
    e.stopPropagation();
  });
});

// 2) Close button
lightboxClose.addEventListener('click', () => {
  lightboxOverlay.classList.remove('visible');
});

// 3) Clicking outside the image closes it
lightboxOverlay.addEventListener('click', () => {
  lightboxOverlay.classList.remove('visible');
});

// Optional: prevent clicking the image itself from closing
document.querySelector('.lightbox-content img')
  .addEventListener('click', e => e.stopPropagation());
