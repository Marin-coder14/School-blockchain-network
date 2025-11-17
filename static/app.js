document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('qr-form');
  const img = document.getElementById('qr-image');
  const result = document.getElementById('result');
  const downloadBtn = document.getElementById('download-btn');
  let currentBlob = null;

  // Theme controls
  const themeSelect = document.getElementById('theme-select');
  const accentInput = document.getElementById('accent-color');
  const bgInput = document.getElementById('bg-color');
  const textInput = document.getElementById('text-color');

  function applyTheme(theme, customValues) {
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-purple');
    if (theme === 'custom') {
      // apply inline CSS variables
      if (customValues) {
        document.documentElement.style.setProperty('--accent', customValues.accent || '#667eea');
        document.documentElement.style.setProperty('--bg', customValues.bg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        document.documentElement.style.setProperty('--panel-bg', customValues.panel || '#ffffff');
        document.documentElement.style.setProperty('--text', customValues.text || '#111111');
      }
    } else {
      // remove custom inline variables so theme class variables take effect
      document.documentElement.style.removeProperty('--accent');
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--panel-bg');
      document.documentElement.style.removeProperty('--text');
      document.documentElement.classList.add('theme-' + theme);
    }
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('qr_theme') || 'light';
  const savedAccent = localStorage.getItem('qr_theme_accent') || '#667eea';
  const savedBg = localStorage.getItem('qr_theme_bg') || '#ffffff';
  const savedText = localStorage.getItem('qr_theme_text') || '#111111';
  themeSelect.value = savedTheme;
  accentInput.value = savedAccent;
  bgInput.value = savedBg;
  textInput.value = savedText;
  applyTheme(savedTheme, { accent: savedAccent, bg: savedBg, text: savedText });

  themeSelect.addEventListener('change', () => {
    const theme = themeSelect.value;
    if (theme !== 'custom') {
      applyTheme(theme);
    } else {
      applyTheme('custom', { accent: accentInput.value, bg: `linear-gradient(135deg, ${accentInput.value} 0%, ${accentInput.value}33 100%)`, text: textInput.value, panel: '#ffffff' });
    }
    localStorage.setItem('qr_theme', theme);
  });

  function saveCustomAndApply(){
    const values = { accent: accentInput.value, bg: `linear-gradient(135deg, ${accentInput.value} 0%, ${accentInput.value}33 100%)`, text: textInput.value, panel: '#ffffff' };
    localStorage.setItem('qr_theme_accent', values.accent);
    localStorage.setItem('qr_theme_bg', values.bg);
    localStorage.setItem('qr_theme_text', values.text);
    applyTheme('custom', values);
  }

  accentInput.addEventListener('input', saveCustomAndApply);
  bgInput.addEventListener('input', saveCustomAndApply);
  textInput.addEventListener('input', saveCustomAndApply);

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    try {
      const resp = await fetch('/generate', { method: 'POST', body: formData });
      if (!resp.ok) {
        const txt = await resp.text();
        alert('Error: ' + txt);
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      img.src = url;
      currentBlob = blob;
      result.classList.remove('hidden');
    } catch (err) {
      alert('Request failed: ' + err.message);
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!currentBlob) return;
    const url = URL.createObjectURL(currentBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
    URL.revokeObjectURL(url);
  });
});
