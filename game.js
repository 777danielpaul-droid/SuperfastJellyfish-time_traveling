const canvas = document.getElementById("gameCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  // Spiel-Variablen
  let score = 0;
  let gameActive = false;

  // Spieler (Raumschiff)
  const player = { x: 280, y: 360, width: 40, height: 20, speed: 6 };

  // Projektile und Gegner
  let bullets = [];
  let enemies = [];
  let keys = {};

  // Steuerung abfangen
  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "Space") e.preventDefault();
  });
  window.addEventListener("keyup", (e) => (keys[e.code] = false));

  // Funktion, um die Invasion zu starten
  window.startSpaceInvaders = function () {
    document.getElementById("game-overlay").style.display = "block";
    gameActive = true;
    score = 0;
    bullets = [];
    enemies = [];

    // Gegner spawnen
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        enemies.push({
          x: col * 60 + 50,
          y: row * 40 + 50,
          width: 30,
          height: 20,
          alive: true,
        });
      }
    }
    gameLoop();
  };

  function gameLoop() {
    if (!gameActive) return;

    // 1. Update Positionen
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.width)
      player.x += player.speed;

    if (keys["Space"]) {
      keys["Space"] = false; // Ein Schuss pro Klick
      bullets.push({ x: player.x + 18, y: player.y, speed: 8 });
    }

    // Kugeln bewegen
    bullets.forEach((b, index) => {
      b.y -= b.speed;
      if (b.y < 0) bullets.splice(index, 1);
    });

    // Kollision prüfen
    bullets.forEach((b, bIdx) => {
      enemies.forEach((e) => {
        if (
          e.alive &&
          b.x > e.x &&
          b.x < e.x + e.width &&
          b.y > e.y &&
          b.y < e.y + e.height
        ) {
          e.alive = false;
          bullets.splice(bIdx, 1);
          score += 10;
          document.getElementById("score").innerText = score;
        }
      });
    });

    // 2. Zeichnen (Rendering)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spieler zeichnen (Grünes Rechteck)
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Schüsse (Rote Linien)
    ctx.fillStyle = "#ff0000";
    bullets.forEach((b) => ctx.fillRect(b.x, b.y, 4, 10));

    // Gegner (Lila Pixel-Blöcke)
    ctx.fillStyle = "#ff00ff";
    enemies.forEach((e) => {
      if (e.alive) ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    // Sieg-Bedingung prüfen
    if (enemies.every((e) => !e.alive)) {
      ctx.fillStyle = "#00ff00";
      ctx.font = "30px Courier New";
      ctx.fillText("ZEITREISE ERFOLGREICH!", 120, 200);
      setTimeout(() => {
        document.getElementById("game-overlay").style.display = "none";
        gameActive = false;
      }, 3000);
      return;
    }

    requestAnimationFrame(gameLoop);
  }
}
