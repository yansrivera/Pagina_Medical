
document.querySelectorAll('.bolita').forEach(bolita => {
  bolita.style.left = Math.random() * (window.innerWidth - 40) + 'px';
  bolita.style.top = Math.random() * (window.innerHeight - 40) + 'px';

  let dx = (Math.random() - 0.5) * 9;
  let dy = (Math.random() - 0.5) * 9;

  function mover() {
    let x = parseFloat(bolita.style.left);
    let y = parseFloat(bolita.style.top);

    x += dx;
    y += dy;

    if (x <= 0 || x >= window.innerWidth - 40) dx *= -1;
    if (y <= 0 || y >= window.innerHeight - 40) dy *= -1;

    bolita.style.left = x + 'px';
    bolita.style.top = y + 'px';

    requestAnimationFrame(mover);
  }

  mover();

  bolita.addEventListener('click', () => {
    const mensaje = bolita.getAttribute('data-mensaje');
    document.getElementById('textoModal').textContent = mensaje;
    document.getElementById('modal').style.display = 'flex';
  });
});

document.getElementById('cerrar').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});
