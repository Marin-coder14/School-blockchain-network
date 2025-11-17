document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('qr-form');
  const img = document.getElementById('qr-image');
  const result = document.getElementById('result');
  const downloadBtn = document.getElementById('download-btn');
  let currentBlob = null;

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
