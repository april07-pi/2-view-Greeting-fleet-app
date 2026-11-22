export type ScreenshotTarget = 'home' | 'greeting' | 'dialog';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function downloadFletViewScreenshot(
  target: ScreenshotTarget,
  userName: string
) {
  const width = 960;
  const height = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Outer backdrop
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, width, height);

  // Titlebar
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, 88);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 88);
  ctx.lineTo(width, 88);
  ctx.stroke();

  // Window control dots (subtle OS chrome)
  const dots = ['#EF4444', '#F59E0B', '#10B981'];
  dots.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(48 + idx * 28, 44, 9, 0, Math.PI * 2);
    ctx.fill();
  });

  // Window title
  ctx.fillStyle = '#0F172A';
  ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Two-View Greeting App', width / 2, 53);

  // Route indicator text
  ctx.fillStyle = '#64748B';
  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  const activeRoute = target === 'greeting' ? '/greeting' : '/';
  ctx.fillText(`route: ${activeRoute}`, width - 36, 51);

  if (target === 'greeting') {
    // AppBar back arrow simulation
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 88, width, 96);
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.moveTo(0, 184);
    ctx.lineTo(width, 184);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.font = '500 28px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('←', 44, 146);
    ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Greeting', 100, 145);

    // Greeting text
    const displayName = userName.trim() || 'Alex';
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 56px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Hello, ${displayName}!`, width / 2, 620);

    // Back Button
    ctx.fillStyle = '#0284C7';
    roundRect(ctx, width / 2 - 180, 680, 360, 84, 42);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 28px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Back', width / 2, 732);
  } else {
    // Home View (/)
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 48px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Two-View Greeting App', width / 2, 470);

    ctx.fillStyle = '#475569';
    ctx.font = '400 26px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      'Enter your name to receive a personalized greeting.',
      width / 2,
      525
    );

    // TextField
    const fieldX = width / 2 - 320;
    const fieldY = 590;
    const fieldW = 640;
    const fieldH = 96;

    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, fieldX, fieldY, fieldW, fieldH, 12);
    ctx.fill();
    ctx.strokeStyle = target === 'dialog' ? '#94A3B8' : '#0284C7';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Floating label
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(fieldX + 20, fieldY - 14, 148, 28);
    ctx.fillStyle = target === 'dialog' ? '#64748B' : '#0284C7';
    ctx.font = '500 22px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Your Name', fieldX + 28, fieldY + 6);

    // TextField value or hint
    const textVal = target === 'dialog' ? '' : userName.trim();
    ctx.fillStyle = textVal ? '#0F172A' : '#94A3B8';
    ctx.font = '400 28px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(textVal || 'Enter your name', fieldX + 28, fieldY + 58);

    // Continue Button
    ctx.fillStyle = '#0284C7';
    roundRect(ctx, fieldX, 726, fieldW, 84, 42);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 28px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Continue', width / 2, 778);

    if (target === 'dialog') {
      // Scrim
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fillRect(0, 88, width, height - 88);

      // AlertDialog surface
      const dlgW = 640;
      const dlgH = 340;
      const dlgX = (width - dlgW) / 2;
      const dlgY = (height - dlgH) / 2;

      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, dlgX, dlgY, dlgW, dlgH, 28);
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.font = '600 36px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Name Required', dlgX + 48, dlgY + 86);

      ctx.fillStyle = '#475569';
      ctx.font = '400 26px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        'Please enter your name before continuing.',
        dlgX + 48,
        dlgY + 154
      );

      // OK TextButton
      ctx.fillStyle = '#0284C7';
      ctx.font = '600 28px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('OK', dlgX + dlgW - 56, dlgY + dlgH - 48);
    }
  }

  const link = document.createElement('a');
  link.download =
    target === 'home'
      ? 'flet_home_view.png'
      : target === 'greeting'
        ? 'flet_greeting_view.png'
        : 'flet_empty_name_dialog.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
