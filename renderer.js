const video = document.getElementById('cam');
const camSelect = document.getElementById('camSelect');
const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const clickThroughBtn = document.getElementById('clickThroughBtn');
const container = document.getElementById('container');

let currentStream = null;

async function startCamera(deviceId) {
  if (currentStream) currentStream.getTracks().forEach((t) => t.stop());
  const constraints = {
    video: deviceId
      ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
      : { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  };
  currentStream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = currentStream;
}

async function listCameras(preferredId) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cams = devices.filter((d) => d.kind === 'videoinput');
  camSelect.innerHTML = '';
  cams.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = c.deviceId;
    opt.textContent = c.label || `Camera ${i + 1}`;
    camSelect.appendChild(opt);
  });
  if (preferredId && cams.some((c) => c.deviceId === preferredId)) {
    camSelect.value = preferredId;
  }
}

function showError(msg) {
  container.innerHTML = `<div class="error">Camera error<br><br>${msg}</div>`;
}

(async () => {
  try {
    // Prime permission so enumerateDevices returns labels.
    const tmp = await navigator.mediaDevices.getUserMedia({ video: true });
    tmp.getTracks().forEach((t) => t.stop());

    const saved = localStorage.getItem('cameraId');
    await listCameras(saved);
    if (camSelect.options.length > 0) {
      await startCamera(camSelect.value);
    } else {
      showError('No camera detected.');
    }
  } catch (e) {
    showError(e.message || String(e));
  }
})();

camSelect.addEventListener('change', async () => {
  try {
    await startCamera(camSelect.value);
    localStorage.setItem('cameraId', camSelect.value);
  } catch (e) {
    showError(e.message || String(e));
  }
});

// Refresh device list if cameras are plugged/unplugged.
navigator.mediaDevices.addEventListener('devicechange', () =>
  listCameras(camSelect.value)
);

closeBtn.addEventListener('click', () => window.api.close());
minimizeBtn.addEventListener('click', () => window.api.minimize());
clickThroughBtn.addEventListener('click', () => window.api.toggleClickThrough());

window.api.onClickThroughChanged((on) => {
  clickThroughBtn.classList.toggle('active', on);
});

// Scroll wheel resizes the window. Step is small so tuning feels precise.
window.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    const step = e.deltaY < 0 ? 16 : -16;
    window.api.resize(step);
  },
  { passive: false }
);
