document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('qr-form');
  const img = document.getElementById('qr-image');
  const result = document.getElementById('result');
  const downloadBtn = document.getElementById('download-btn');
  const themeSelect = document.getElementById('theme-select');
  const primaryColor = document.getElementById('primary-color');
  const panelBg = document.getElementById('panel-bg');
  const pageBg = document.getElementById('page-bg');
  let currentBlob = null;

  // Theme helpers
  function applyTheme(theme) {
    if (!theme) return;
    // theme: { preset, primary, panelBg, pageBg }
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--panel-bg', theme.panelBg);
    document.documentElement.style.setProperty('--page-accent', theme.pageBg);
    document.documentElement.style.setProperty('--button-bg', theme.primary);
    // set download default color if provided
    if (theme.download) document.documentElement.style.setProperty('--download-bg', theme.download);
    // persist
    localStorage.setItem('qr_theme', JSON.stringify(theme));
  }

  function loadTheme() {
    const raw = localStorage.getItem('qr_theme');
    if (raw) {
      try {
        const theme = JSON.parse(raw);
        // populate controls
        if (theme.primary) primaryColor.value = theme.primary;
        if (theme.panelBg) panelBg.value = theme.panelBg;
        if (theme.pageBg) pageBg.value = theme.pageBg;
        if (theme.preset) themeSelect.value = theme.preset;
        applyTheme(theme);
      } catch (e) {
        console.warn('Failed to load theme', e);
      }
    }
  }

  function presetToTheme(preset) {
    switch (preset) {
      case 'light':
        return { preset: 'light', primary: '#2563eb', panelBg: '#ffffff', pageBg: 'linear-gradient(135deg,#f8fafc,#e6eefc)', download: '#10b981' };
      case 'dark':
        return { preset: 'dark', primary: '#9ca3ff', panelBg: '#0f1724', pageBg: 'linear-gradient(135deg,#0f1724,#031026)', download: '#059669' };
      case 'purple':
        return { preset: 'purple', primary: '#7c3aed', panelBg: '#ffffff', pageBg: 'linear-gradient(135deg,#7c3aed,#4c1d95)', download: '#a78bfa' };
      default:
        return { preset: 'default', primary: '#667eea', panelBg: '#ffffff', pageBg: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', download: '#10b981' };
    }
  }

  // Theme control events
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const theme = presetToTheme(e.target.value);
      // update color pickers
      primaryColor.value = theme.primary;
      panelBg.value = theme.panelBg.startsWith('#') ? theme.panelBg : '#ffffff';
      pageBg.value = '#667eea';
      applyTheme(theme);
    });
  }

  if (primaryColor) primaryColor.addEventListener('input', () => {
    const theme = { preset: 'custom', primary: primaryColor.value, panelBg: panelBg.value, pageBg: pageBg.value, download: '#10b981' };
    applyTheme(theme);
  });
  if (panelBg) panelBg.addEventListener('input', () => {
    const theme = { preset: 'custom', primary: primaryColor.value, panelBg: panelBg.value, pageBg: pageBg.value, download: '#10b981' };
    applyTheme(theme);
  });
  if (pageBg) pageBg.addEventListener('input', () => {
    const theme = { preset: 'custom', primary: primaryColor.value, panelBg: panelBg.value, pageBg: pageBg.value, download: '#10b981' };
    applyTheme(theme);
  });

  // initialize theme from storage
  loadTheme();

  // Export / Import theme controls
  const exportBtn = document.getElementById('export-theme');
  const importFile = document.getElementById('import-theme-file');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const raw = localStorage.getItem('qr_theme') || '{}';
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-theme.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importFile) {
    importFile.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const theme = JSON.parse(reader.result);
          if (theme) {
            // populate controls if present
            if (theme.primary) primaryColor.value = theme.primary;
            if (theme.panelBg) panelBg.value = theme.panelBg;
            if (theme.pageBg) pageBg.value = theme.pageBg;
            if (theme.preset && themeSelect) themeSelect.value = theme.preset;
            applyTheme(theme);
            alert('Theme imported and applied');
          }
        } catch (e) {
          alert('Invalid theme file');
        }
      };
      reader.readAsText(f);
      // clear input so same file can be reimported later
      ev.target.value = '';
    });
  }

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
