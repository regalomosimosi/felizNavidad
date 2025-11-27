const YEAR = new Date().getFullYear();
const COOKIE_KEY = `advent_opened_${YEAR}`;

const grid = document.getElementById('grid');
const modalRoot = document.getElementById('modalRoot');
const audioToggle = document.getElementById('audioToggle');
const dayMessages = {
  1: "🎄 ¡Empieza nuestro primer calendario de Adviento juntos mosii!, que comienza la magia navideña.🎄",
  2: "🍫 Hoy toca una chocolatina y besitooo virtual. Me encanta compartir contigo cada pequeño momento.",
  3: "🎁 Hoy algo te espera debajo del arbolito… 🎄",
  4: "Hoy me voy a antequerita, volvere con locas muejeje. No te pongas triste mosi algo te espera de ziocolateee.",
  5: "Mucha suerte mosiii en el dia de hoy espero que te vaya todo lo bien que te mereces, te amo guapa.",
  6: "🍫 Una chocolatina dulce para una persona aún más dulce  jeje, porciertooooo mañana vuelvooo🍫.",
  7: "Mosi mosi hoy vuelvooo, vengo con el cargamento",
  8: "Pilla tu chocolatina mosi y pon de fondo una canción navideña. Así se empieza un buen diaa.",
  9: "Hoy me hacen la fotito de la orla, pero la unica foto que quiero siempre tener es una junto a ti.",
  10: "🎁 Hoy algo te espera debajo del arbolito… 🎄✨",
  11: "🍫 Hoy toca una chocolatina y un pensamiento bonito: qué suerte tengo de tenerte.",
  12: "✨ Zabiaz que quedan 12 dias para navidad mosi? Que locura, te tomaste tu chocolate de hoy? Espero que si jeje.",
  13: "Vemos peli de navidad mosi con chocolatito calentito, (puedes elegir la que quieras)",
  14: "Holaaaa mosiiii, mañana tengo examen estare atacado pero weno el alberto de ahora te dice que gracias por cuidarme tanto como haces siempre te amo guapa",
  15: "Una chocolatina y una promesa: esta Navidad será solo el comienzo de muchas juntos  jeje🎁.",
  16: "Que frio que hace hoy eh, pero bueno contigo siempre me siento calentito como en casita",
  17: "🎁 Hoy algo te espera debajo del arbolito… 🎄✨",
  18: "El papa noel esta calentando que sale, se viene la navidad. Porcierto coje tu chocolatinaa anda que hoy te toca",
  19: "Coge tu chocolatina y piensa en algo que te haga sonreír… espero estar en esa lista.",
  20: "MOSIIIIIIIII MAÑANA NOS VAMOS A TOLEDO JUNTITOZZZZ, llevate el calendario andaaa que yo me quelo comer tus chocolatinaz",
  21: "Lets gooo toledooooooooo muejejej un viajecito de tantos juntos",
  22: "🎁 Hoy algo te espera debajo del arbolito… 🎄✨",
  23: "Aunque me vuelvo a antequera una parte de mi se queda contigo. Te quiero mucho y espero que lo hayamos pasado genial en el viaje. Te quiero mucho mi amor eres la mejor",
  24: " ¡Feliz Nochebuena, mi mosi! Gracias por ser mi persona favorita todos los días. Te quiero muchísimo. Por muchas mas navidades juntos porciertooo cuando vuelva tendras tu gran y zuculento regalo que los reyes me lo han dado. Espero que lo pases genial y disfrutes mucho en familia. Para mi es complicado por tu eres como de mi familia ya. Disfruta mucho y espero que te gustara todo esto (es lo que pasa cuando tienes un novio infomatico muejejej) ❤️."
};

let opened = {};
let debugMode = false;
const cookie = document.cookie.match(new RegExp('(^| )' + COOKIE_KEY + '=([^;]+)'));
if(cookie) {
  try { 
    opened = JSON.parse(decodeURIComponent(cookie[2])); 
  } catch(e) {
    opened = {};
  }
}

const now = new Date();
function isExactDay(day){ 
  return now.getMonth()===11 && now.getDate()===day && now.getFullYear()===YEAR; 
}
function isSunday(day){ 
  const d = new Date(YEAR, 11, day); 
  return d.getDay()===0; 
}

function setCookie(name,value,expires){ 
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${expires.toUTCString()};SameSite=Lax`; 
}
function cookieExpiry(){ 
  return new Date(YEAR, 11, 25, 23, 59, 59); 
}

function render(){
  grid.innerHTML = '';
  for(let i=1;i<=24;i++){
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.setAttribute('data-day', i);

    const num = document.createElement('div'); 
    num.className = 'num'; 
    num.textContent = i;
    tile.appendChild(num);

    if(opened[i]){
      const badge = document.createElement('div'); 
      badge.className = 'opened-badge'; 
      badge.textContent = 'Abierto'; 
      tile.appendChild(badge); 
    }
    if(isSunday(i)) tile.classList.add('weekly');

    if(!isExactDay(i) && !debugMode){
      tile.classList.add('locked');
      const pad = document.createElement('div'); 
      pad.className = 'padlock'; 
      pad.textContent = '🔒'; 
      tile.appendChild(pad);

      tile.addEventListener('click', ()=>tile.animate([
        {transform:'translateX(0)'},
        {transform:'translateX(-6px)'},
        {transform:'translateX(6px)'},
        {transform:'translateX(0)'}
      ],{duration:220}));
    } else {
      tile.addEventListener('click', ()=>openDay(i));
    }

    grid.appendChild(tile);
  }
}

// Música
const audioPath = 'music/musicafondo.mp3'; // Cambia por tu ruta
const audio = new Audio(audioPath);
audio.loop = true;
let audioPlaying = false;

audioToggle.addEventListener('click', () => {
  if (audioPlaying) {
    audio.pause();
    audioToggle.textContent = '🔔 Música: desactivada';
  } else {
    audio.play();
    audioToggle.textContent = '🔔 Música: activada';
  }
  audioPlaying = !audioPlaying;
});



// Abrir día
function openDay(day){
  if(!isExactDay(day) && !debugMode) return;

  const special = isSunday(day); // si quieres hacer algo especial los domingos
  const msg = dayMessages[day] || `Feliz día ${day} 🎁`;

  showModal(day, msg, special);

  const tile = document.querySelector(`.tile[data-day='${day}']`);
  if(tile){
    tile.style.pointerEvents = 'none';
    tile.style.animation = 'tileOpen 0.8s ease forwards';

    tile.addEventListener('animationend', ()=>{
      tile.classList.add('opened');
      tile.style.animation = '';
      opened[day] = true;
      setCookie(COOKIE_KEY, JSON.stringify(opened), cookieExpiry());
      render();
    }, { once: true });
  }
}

// Modal
function showModal(day,message,special){
  modalRoot.innerHTML = '';
  modalRoot.setAttribute('aria-hidden','false');

  const backdrop = document.createElement('div'); 
  backdrop.className = 'modal-backdrop';

  const modal = document.createElement('div'); 
  modal.className = 'modal';

  const h2 = document.createElement('h2'); 
  h2.textContent = special ? `Día ${day} — Sorpresa especial` : `Día ${day}`;

  const content = document.createElement('div'); 
  content.className = 'content'; 
  content.textContent = message;

  const close = document.createElement('button'); 
  close.className = 'close'; 
  close.textContent = 'Cerrar';
  close.addEventListener('click', ()=>{ 
    modalRoot.innerHTML = ''; 
    modalRoot.setAttribute('aria-hidden','true'); 
  });

  modal.appendChild(h2);
  modal.appendChild(content);
  modal.appendChild(close);
  backdrop.appendChild(modal);
  modalRoot.appendChild(backdrop);
}

// Reset calendario


// Nieve
function makeSnow(){
  const snow = document.createElement('div');
  snow.className = 'snow';
  document.body.appendChild(snow);

  for(let i=0;i<50;i++){
    const fl = document.createElement('div'); 
    fl.className = 'flake'; 
    fl.textContent = '❄';
    fl.style.left = Math.random()*100+'%';
    fl.style.top = Math.random()*-20+'%';
    fl.style.fontSize = (8 + Math.random()*18)+'px';
    fl.style.animationDuration = (5 + Math.random()*8)+'s';
    fl.style.animationDelay = Math.random()*5+'s';
    fl.style.transform = `rotate(${Math.random()*360}deg)`;
    snow.appendChild(fl);
  }
}
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
    debugMode = !debugMode;

    // Activar música automáticamente al activar debug
    if (debugMode && !audioPlaying) {
      audio.play();
      audioPlaying = true;
      audioToggle.textContent = '🔔 Música: activada (debug)';
    }

    render();

    alert(`Debug ${debugMode ? 'activado (puedes abrir cualquier día)' : 'desactivado'}`);
  }
});
// Inicialización
makeSnow();
render();
