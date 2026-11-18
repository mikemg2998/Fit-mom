/* Guarda todo en el celular para que funcione sin internet. Sube VERSION al cambiar archivos. */
const VERSION = 'fitmommy-v10';
const ARCHIVOS = [
  './', 'index.html', 'styles.css', 'data.js', 'app.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'img/Ab_Crunch_Machine_0.jpg',
  'img/Ab_Crunch_Machine_1.jpg',
  'img/Barbell_Glute_Bridge_0.jpg',
  'img/Barbell_Glute_Bridge_1.jpg',
  'img/Barbell_Hip_Thrust_0.jpg',
  'img/Barbell_Hip_Thrust_1.jpg',
  'img/Butterfly_0.jpg',
  'img/Butterfly_1.jpg',
  'img/Cable_Chest_Press_0.jpg',
  'img/Cable_Chest_Press_1.jpg',
  'img/Cable_Hammer_Curls_-_Rope_Attachment_0.jpg',
  'img/Cable_Hammer_Curls_-_Rope_Attachment_1.jpg',
  'img/Cable_Hip_Adduction_0.jpg',
  'img/Cable_Hip_Adduction_1.jpg',
  'img/Cable_Seated_Lateral_Raise_0.jpg',
  'img/Cable_Seated_Lateral_Raise_1.jpg',
  'img/Calf_Press_On_The_Leg_Press_Machine_0.jpg',
  'img/Calf_Press_On_The_Leg_Press_Machine_1.jpg',
  'img/Close-Grip_Front_Lat_Pulldown_0.jpg',
  'img/Close-Grip_Front_Lat_Pulldown_1.jpg',
  'img/Dead_Bug_0.jpg',
  'img/Dead_Bug_1.jpg',
  'img/Dip_Machine_0.jpg',
  'img/Dip_Machine_1.jpg',
  'img/Dumbbell_Bicep_Curl_0.jpg',
  'img/Dumbbell_Bicep_Curl_1.jpg',
  'img/Dumbbell_Shoulder_Press_0.jpg',
  'img/Dumbbell_Shoulder_Press_1.jpg',
  'img/Dumbbell_Step_Ups_0.jpg',
  'img/Dumbbell_Step_Ups_1.jpg',
  'img/Elliptical_Trainer_0.jpg',
  'img/Elliptical_Trainer_1.jpg',
  'img/Face_Pull_0.jpg',
  'img/Face_Pull_1.jpg',
  'img/Glute_Kickback_0.jpg',
  'img/Glute_Kickback_1.jpg',
  'img/Hyperextensions_Back_Extensions_0.jpg',
  'img/Hyperextensions_Back_Extensions_1.jpg',
  'img/Incline_Cable_Flye_0.jpg',
  'img/Incline_Cable_Flye_1.jpg',
  'img/Leg_Extensions_0.jpg',
  'img/Leg_Extensions_1.jpg',
  'img/Leg_Press_0.jpg',
  'img/Leg_Press_1.jpg',
  'img/Leverage_Chest_Press_0.jpg',
  'img/Leverage_Chest_Press_1.jpg',
  'img/Leverage_High_Row_0.jpg',
  'img/Leverage_High_Row_1.jpg',
  'img/Leverage_Iso_Row_0.jpg',
  'img/Leverage_Iso_Row_1.jpg',
  'img/Lying_Leg_Curls_0.jpg',
  'img/Lying_Leg_Curls_1.jpg',
  'img/Machine_Bicep_Curl_0.jpg',
  'img/Machine_Bicep_Curl_1.jpg',
  'img/Machine_Shoulder_Military_Press_0.jpg',
  'img/Machine_Shoulder_Military_Press_1.jpg',
  'img/Machine_Triceps_Extension_0.jpg',
  'img/Machine_Triceps_Extension_1.jpg',
  'img/Narrow_Stance_Leg_Press_0.jpg',
  'img/Narrow_Stance_Leg_Press_1.jpg',
  'img/One-Legged_Cable_Kickback_0.jpg',
  'img/One-Legged_Cable_Kickback_1.jpg',
  'img/Pallof_Press_0.jpg',
  'img/Pallof_Press_1.jpg',
  'img/Plank_0.jpg',
  'img/Plank_1.jpg',
  'img/Pull_Through_0.jpg',
  'img/Pull_Through_1.jpg',
  'img/Recumbent_Bike_0.jpg',
  'img/Recumbent_Bike_1.jpg',
  'img/Reverse_Machine_Flyes_0.jpg',
  'img/Reverse_Machine_Flyes_1.jpg',
  'img/Seated_Cable_Rows_0.jpg',
  'img/Seated_Cable_Rows_1.jpg',
  'img/Seated_Calf_Raise_0.jpg',
  'img/Seated_Calf_Raise_1.jpg',
  'img/Seated_Leg_Curl_0.jpg',
  'img/Seated_Leg_Curl_1.jpg',
  'img/Side_Lateral_Raise_0.jpg',
  'img/Side_Lateral_Raise_1.jpg',
  'img/Single-Leg_Leg_Extension_0.jpg',
  'img/Single-Leg_Leg_Extension_1.jpg',
  'img/Single_Leg_Glute_Bridge_0.jpg',
  'img/Single_Leg_Glute_Bridge_1.jpg',
  'img/Smith_Machine_Hip_Raise_0.jpg',
  'img/Smith_Machine_Hip_Raise_1.jpg',
  'img/Smith_Machine_Stiff-Legged_Deadlift_0.jpg',
  'img/Smith_Machine_Stiff-Legged_Deadlift_1.jpg',
  'img/Standing_Biceps_Cable_Curl_0.jpg',
  'img/Standing_Biceps_Cable_Curl_1.jpg',
  'img/Standing_Calf_Raises_0.jpg',
  'img/Standing_Calf_Raises_1.jpg',
  'img/Standing_Leg_Curl_0.jpg',
  'img/Standing_Leg_Curl_1.jpg',
  'img/Stiff-Legged_Dumbbell_Deadlift_0.jpg',
  'img/Stiff-Legged_Dumbbell_Deadlift_1.jpg',
  'img/Thigh_Abductor_0.jpg',
  'img/Thigh_Abductor_1.jpg',
  'img/Thigh_Adductor_0.jpg',
  'img/Thigh_Adductor_1.jpg',
  'img/Triceps_Pushdown_-_Rope_Attachment_0.jpg',
  'img/Triceps_Pushdown_-_Rope_Attachment_1.jpg',
  'img/Triceps_Pushdown_0.jpg',
  'img/Triceps_Pushdown_1.jpg',
  'img/Walking_Treadmill_0.jpg',
  'img/Walking_Treadmill_1.jpg',
  'img/Wide-Grip_Lat_Pulldown_0.jpg',
  'img/Wide-Grip_Lat_Pulldown_1.jpg',
];

self.addEventListener('install', e => {
  // cache: 'reload' evita copiar archivos viejos guardados por el navegador
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const FUENTES = ['api.fontshare.com', 'cdn.fontshare.com'];
function guardarCopia(req, res) {
  if (res && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(VERSION).then(k => k.put(req, c)); }
  return res;
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const propio = url.origin === location.origin, fuente = FUENTES.includes(url.hostname);
  if (!propio && !fuente) return;
  const esFoto = propio && (url.pathname.includes('/img/') || url.pathname.includes('/icons/'));
  if (propio && !esFoto) {
    // Código de la app: primero internet (siempre la última versión), y sin internet la copia guardada
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then(res => guardarCopia(req, res))
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
    );
    return;
  }
  // Fotos y letra: primero la copia guardada
  e.respondWith(
    caches.match(req, { ignoreSearch: propio }).then(r => r || fetch(req).then(res => guardarCopia(req, res)).catch(() => Response.error()))
  );
});
