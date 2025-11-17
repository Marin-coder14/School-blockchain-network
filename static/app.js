document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('qr-form');
  const img = document.getElementById('qr-image');

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
    } catch (err) {
      alert('Request failed: ' + err.message);
    }
  });
});
