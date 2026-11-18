/* Catálogo de ejercicios, rutinas y plan semanal.
   Fotos: Free Exercise DB (dominio público, Unlicense). */

// tipo: m = máquina, p = polea, l = peso libre, c = cuerpo, k = cardio
// inc = cuánto subir de peso cuando ya domina el ejercicio
const EJ = {
  /* ---------------- PIERNA ---------------- */
  prensa: {
    nombre: 'Prensa de piernas', maquina: 'Máquina de prensa (sentada o inclinada)', grupo: 'Pierna', tipo: 'm',
    musculos: 'Cuádriceps y glúteo', reps: [10, 15], inc: 2.5,
    pasos: [
      'Siéntate con la espalda y la cadera bien pegadas al respaldo.',
      'Pon los pies ALTOS en la plataforma, al ancho de la cadera y con las puntas un poquito hacia afuera.',
      'Baja despacio solo hasta que la rodilla forme un ángulo recto (90°). No más abajo.',
      'Empuja con todo el pie (sobre todo el talón) sin estirar la rodilla del todo arriba.'
    ],
    rodilla: 'Peso moderado y recorrido corto. Si sientes dolor dentro de la rodilla, sube más los pies o baja menos.',
    variantes: ['prensaHorizontal', 'stepUp', 'extension']
  },
  prensaHorizontal: {
    nombre: 'Prensa con pies juntos', maquina: 'Máquina de prensa', grupo: 'Pierna', tipo: 'm',
    musculos: 'Cuádriceps', reps: [12, 15], inc: 2.5, img: 'Narrow_Stance_Leg_Press',
    pasos: [
      'Pies en el centro de la plataforma, más juntos que en la prensa normal.',
      'Baja lento hasta 90° de rodilla, sin despegar la cadera del asiento.',
      'Sube empujando con el talón, sin trabar la rodilla.'
    ],
    rodilla: 'Úsala con poco peso. Si molesta la rodilla operada, vuelve a la prensa con pies altos.',
    variantes: ['prensa', 'extension']
  },
  extension: {
    nombre: 'Extensión de cuádriceps', maquina: 'Máquina de extensión de piernas (sentada)', grupo: 'Pierna', tipo: 'm',
    musculos: 'Cuádriceps (parte de adelante del muslo)', reps: [12, 15], inc: 2.5, img: 'Leg_Extensions',
    pasos: [
      'Ajusta el respaldo para que la rodilla quede justo en el borde del asiento, alineada con el eje de la máquina.',
      'El rodillo va sobre el tobillo, no sobre el pie.',
      'Sube las piernas en 2 segundos, aprieta arriba 1 segundo.',
      'Baja en 3 segundos, sin dejar caer el peso.'
    ],
    rodilla: 'Uno de los mejores para fortalecer la rodilla operada. Peso ligero a moderado, movimiento lento y sin golpes.',
    variantes: ['extensionUna', 'prensa']
  },
  extensionUna: {
    nombre: 'Extensión a una pierna', maquina: 'Máquina de extensión de piernas', grupo: 'Pierna', tipo: 'm',
    musculos: 'Cuádriceps', reps: [12, 15], inc: 2.5, lado: true, img: 'Single-Leg_Leg_Extension',
    pasos: [
      'Igual que la extensión normal pero con una sola pierna.',
      'Sirve para que la pierna operada trabaje igual que la otra.',
      'Haz primero la pierna más débil y luego las mismas repeticiones con la otra.'
    ],
    rodilla: 'Muy buena para equilibrar las dos piernas. Peso muy ligero.',
    variantes: ['extension']
  },
  curlSentado: {
    nombre: 'Curl femoral sentado', maquina: 'Máquina de curl de piernas sentada', grupo: 'Pierna', tipo: 'm',
    musculos: 'Femoral (parte de atrás del muslo)', reps: [10, 15], inc: 2.5, img: 'Seated_Leg_Curl',
    pasos: [
      'Rodilla alineada con el eje de la máquina; el rodillo de abajo detrás del tobillo.',
      'Baja la barra de los muslos para que no se levante la pierna.',
      'Lleva los talones hacia abajo y atrás en 2 segundos.',
      'Regresa despacio en 3 segundos.'
    ],
    rodilla: 'Segura para la prótesis. No fuerces el último tramo si la rodilla no dobla tanto.',
    variantes: ['curlAcostado', 'curlDePie']
  },
  curlAcostado: {
    nombre: 'Curl femoral acostada', maquina: 'Máquina de curl de piernas acostada (boca abajo)', grupo: 'Pierna', tipo: 'm',
    musculos: 'Femoral', reps: [10, 15], inc: 2.5, img: 'Lying_Leg_Curls',
    pasos: [
      'Acuéstate boca abajo con la rodilla justo al borde del banco.',
      'Agárrate de las manijas y mantén la cadera pegada al banco.',
      'Lleva los talones hacia la cola en 2 segundos y baja en 3.'
    ],
    rodilla: 'Segura. Si no dobla toda la rodilla, haz el recorrido que sea cómodo.',
    variantes: ['curlSentado', 'curlDePie']
  },
  curlDePie: {
    nombre: 'Curl femoral de pie', maquina: 'Máquina de curl de pie (una pierna)', grupo: 'Pierna', tipo: 'm',
    musculos: 'Femoral', reps: [10, 15], inc: 2.5, lado: true, img: 'Standing_Leg_Curl',
    pasos: [
      'Apóyate en la almohadilla y agarra las manijas.',
      'Dobla una pierna llevando el talón hacia la cola.',
      'Baja lento. Termina una pierna y cambia.'
    ],
    rodilla: 'Segura. Movimiento lento.',
    variantes: ['curlSentado', 'curlAcostado']
  },
  abductor: {
    nombre: 'Abductor (abrir piernas)', maquina: 'Máquina abductora (sentada, piernas hacia afuera)', grupo: 'Glúteo', tipo: 'm',
    musculos: 'Glúteo medio (costado de la cola)', reps: [15, 20], inc: 5, img: 'Thigh_Abductor',
    pasos: [
      'Siéntate con las almohadillas por fuera de las rodillas.',
      'Abre las piernas lo más que puedas en 2 segundos.',
      'Aguanta 1 segundo afuera y cierra despacio.',
      'Truco: inclínate un poquito hacia adelante para sentirlo más en la cola.'
    ],
    rodilla: 'No carga la rodilla. Ideal.',
    variantes: ['abduccionPolea', 'puenteUna']
  },
  abduccionPolea: {
    nombre: 'Abducción en polea', maquina: 'Polea baja con tobillera', grupo: 'Glúteo', tipo: 'p',
    musculos: 'Glúteo medio', reps: [12, 15], inc: 1.25, lado: true, img: 'Cable_Hip_Adduction',
    pasos: [
      'Ponte la tobillera en la pierna que está lejos de la polea.',
      'Agárrate de la máquina y lleva la pierna hacia el lado, alejándola.',
      'Regresa despacio. Termina un lado y cambia.'
    ],
    rodilla: 'Apóyate bien con la pierna de soporte, rodilla un poquito doblada.',
    variantes: ['abductor']
  },
  aductor: {
    nombre: 'Aductor (cerrar piernas)', maquina: 'Máquina aductora (sentada, piernas hacia adentro)', grupo: 'Pierna', tipo: 'm',
    musculos: 'Parte interna del muslo', reps: [15, 20], inc: 5, img: 'Thigh_Adductor',
    pasos: [
      'Almohadillas por dentro de las rodillas; empieza con una apertura cómoda.',
      'Cierra las piernas en 2 segundos y aprieta.',
      'Abre despacio en 3 segundos.'
    ],
    rodilla: 'No abras demasiado al inicio. Rango cómodo.',
    variantes: ['abductor']
  },
  pantorrillaSentada: {
    nombre: 'Pantorrilla sentada', maquina: 'Máquina de pantorrilla sentada', grupo: 'Pierna', tipo: 'm',
    musculos: 'Pantorrillas', reps: [15, 20], inc: 5, img: 'Seated_Calf_Raise',
    pasos: [
      'Siéntate con la almohadilla sobre los muslos, cerca de las rodillas.',
      'Puntas de los pies en el borde del escalón.',
      'Sube en puntas lo más alto que puedas, aguanta 1 segundo y baja lento.'
    ],
    rodilla: 'La rodilla no se mueve. Muy segura.',
    variantes: ['pantorrillaPrensa', 'pantorrillaPie']
  },
  pantorrillaPrensa: {
    nombre: 'Pantorrilla en prensa', maquina: 'Máquina de prensa', grupo: 'Pierna', tipo: 'm',
    musculos: 'Pantorrillas', reps: [15, 20], inc: 5, img: 'Calf_Press_On_The_Leg_Press_Machine',
    pasos: [
      'En la prensa, apoya solo las puntas de los pies en el borde bajo de la plataforma.',
      'Rodillas estiradas pero sin trabar.',
      'Empuja con las puntas, como poniéndote de puntillas, y regresa lento.'
    ],
    rodilla: 'Peso ligero. No dobles la rodilla.',
    variantes: ['pantorrillaSentada', 'pantorrillaPie']
  },
  pantorrillaPie: {
    nombre: 'Pantorrilla de pie', maquina: 'Máquina de pantorrilla de pie (o escalón)', grupo: 'Pierna', tipo: 'm',
    musculos: 'Pantorrillas', reps: [15, 20], inc: 5, img: 'Standing_Calf_Raises',
    pasos: [
      'Hombros debajo de las almohadillas, puntas en el escalón.',
      'Sube en puntas, aguanta 1 segundo y baja lento.'
    ],
    rodilla: 'Rodillas estiradas sin trabar.',
    variantes: ['pantorrillaSentada', 'pantorrillaPrensa']
  },
  stepUp: {
    nombre: 'Subir al escalón', maquina: 'Cajón o escalón BAJO (20–30 cm) + mancuernas opcionales', grupo: 'Pierna', tipo: 'l',
    musculos: 'Cuádriceps y glúteo', reps: [8, 12], inc: 1, lado: true, img: 'Dumbbell_Step_Ups',
    pasos: [
      'Usa un escalón bajo. Primero sin peso; luego con mancuernas livianas.',
      'Sube con la pierna buena primero si te sientes insegura.',
      'Empuja con el talón del pie que está arriba y baja controlado.',
      'Ten cerca algo para agarrarte.'
    ],
    rodilla: 'Escalón bajo, sin saltos. Rodilla alineada con el pie, que no se vaya hacia adentro.',
    variantes: ['prensa', 'puente']
  },

  /* ---------------- GLÚTEO ---------------- */
  hipThrust: {
    nombre: 'Hip thrust (empuje de cadera)', maquina: 'Máquina de hip thrust / glúteo, o banco + barra', grupo: 'Glúteo', tipo: 'm',
    musculos: 'Glúteo mayor', reps: [10, 15], inc: 2.5, img: 'Barbell_Hip_Thrust',
    pasos: [
      'Espalda alta apoyada en el banco; la barra (con almohadilla) o el cinturón sobre la cadera.',
      'Pies apoyados, al ancho de la cadera, y las rodillas a 90° arriba.',
      'Sube la cadera apretando fuerte la cola hasta quedar recta como una mesa.',
      'Aguanta 1 segundo arriba y baja controlado. Mentón hacia el pecho.'
    ],
    rodilla: 'Excelente para glúteo sin cargar la rodilla. Si la Smart Fit tiene máquina de glúteo, úsala.',
    variantes: ['puente', 'hipSmith', 'puenteUna']
  },
  hipSmith: {
    nombre: 'Puente en máquina Smith', maquina: 'Máquina Smith (barra guiada)', grupo: 'Glúteo', tipo: 'm',
    musculos: 'Glúteo mayor', reps: [10, 15], inc: 2.5, img: 'Smith_Machine_Hip_Raise',
    pasos: [
      'Acostada en el piso o colchoneta debajo de la barra guiada, con almohadilla en la cadera.',
      'Sube la cadera apretando la cola y baja controlado.'
    ],
    rodilla: 'Segura. La barra guiada da estabilidad.',
    variantes: ['hipThrust', 'puente']
  },
  puente: {
    nombre: 'Puente de glúteo', maquina: 'Colchoneta (con o sin disco/mancuerna en la cadera)', grupo: 'Glúteo', tipo: 'l',
    musculos: 'Glúteo mayor', reps: [12, 20], inc: 2.5, img: 'Barbell_Glute_Bridge',
    pasos: [
      'Acostada boca arriba, rodillas dobladas y pies apoyados.',
      'Pon un disco o mancuerna sobre la cadera (opcional).',
      'Sube la cadera apretando la cola, aguanta 2 segundos y baja.'
    ],
    rodilla: 'Muy segura. Buena opción si la máquina está ocupada.',
    variantes: ['hipThrust', 'puenteUna']
  },
  puenteUna: {
    nombre: 'Puente a una pierna', maquina: 'Colchoneta', grupo: 'Glúteo', tipo: 'c',
    musculos: 'Glúteo', reps: [10, 15], inc: 0, lado: true, img: 'Single_Leg_Glute_Bridge',
    pasos: [
      'Como el puente, pero con una pierna estirada en el aire.',
      'Sube la cadera con la pierna apoyada y baja lento. Cambia de lado.'
    ],
    rodilla: 'Segura. Ayuda a igualar la fuerza de ambas piernas.',
    variantes: ['puente', 'hipThrust']
  },
  patada: {
    nombre: 'Patada de glúteo en polea', maquina: 'Polea baja con tobillera', grupo: 'Glúteo', tipo: 'p',
    musculos: 'Glúteo mayor', reps: [12, 15], inc: 1.25, lado: true, img: 'One-Legged_Cable_Kickback',
    pasos: [
      'Tobillera puesta y frente a la polea, agarrada de la máquina.',
      'Inclínate un poco hacia adelante, abdomen firme.',
      'Lleva la pierna estirada hacia atrás apretando la cola, sin arquear la espalda baja.',
      'Regresa lento. Termina un lado y cambia.'
    ],
    rodilla: 'La pierna de apoyo con la rodilla un poco doblada. Si la máquina de glúteo (patada) existe en tu sede, también sirve.',
    variantes: ['patadaPiso', 'abductor', 'puente']
  },
  patadaPiso: {
    nombre: 'Patada de glúteo en colchoneta', maquina: 'Colchoneta', grupo: 'Glúteo', tipo: 'c',
    musculos: 'Glúteo mayor', reps: [12, 20], inc: 0, lado: true, img: 'Glute_Kickback',
    pasos: [
      'En cuatro apoyos (manos y rodillas) sobre una colchoneta gruesa.',
      'Sube una pierna hacia el techo apretando la cola.',
      'Baja lento. Cambia de lado.'
    ],
    rodilla: 'Solo si apoyar la rodilla en la colchoneta no molesta. Si molesta, usa la polea.',
    variantes: ['patada', 'puente']
  },
  rumano: {
    nombre: 'Peso muerto rumano con mancuernas', maquina: 'Mancuernas', grupo: 'Glúteo', tipo: 'l',
    musculos: 'Glúteo y femoral', reps: [10, 12], inc: 1, img: 'Stiff-Legged_Dumbbell_Deadlift',
    pasos: [
      'De pie, mancuernas adelante de los muslos, rodillas un poquito dobladas.',
      'Lleva la cola hacia atrás (como cerrando una puerta con la cola) y baja las mancuernas pegadas a las piernas.',
      'Baja hasta media canilla o hasta sentir el estiramiento atrás del muslo. Espalda siempre recta.',
      'Sube apretando la cola.'
    ],
    rodilla: 'La rodilla casi no se mueve: es de los mejores para glúteo con prótesis. Empieza liviano para cuidar la espalda.',
    variantes: ['hiperextension', 'pullThrough', 'rumanoSmith']
  },
  rumanoSmith: {
    nombre: 'Peso muerto rumano en Smith', maquina: 'Máquina Smith', grupo: 'Glúteo', tipo: 'm',
    musculos: 'Glúteo y femoral', reps: [10, 12], inc: 2.5, img: 'Smith_Machine_Stiff-Legged_Deadlift',
    pasos: [
      'La barra guiada frente a los muslos.',
      'Cola hacia atrás, espalda recta, baja hasta las rodillas o un poco más.',
      'Sube apretando la cola.'
    ],
    rodilla: 'Rodillas suaves, casi sin moverse.',
    variantes: ['rumano', 'hiperextension']
  },
  hiperextension: {
    nombre: 'Hiperextensión para glúteo', maquina: 'Banco de hiperextensiones (romano, 45°)', grupo: 'Glúteo', tipo: 'c',
    musculos: 'Glúteo, femoral y espalda baja', reps: [12, 15], inc: 1, img: 'Hyperextensions_Back_Extensions',
    pasos: [
      'Ajusta el banco para que el borde quede en la cadera (no en la barriga).',
      'Brazos cruzados en el pecho, espalda redondeada un poquito.',
      'Baja y sube apretando la cola, sin pasar de la línea recta.'
    ],
    rodilla: 'Las rodillas están apoyadas. Segura.',
    variantes: ['rumano', 'pullThrough', 'puente']
  },
  pullThrough: {
    nombre: 'Jalón entre piernas en polea', maquina: 'Polea baja con cuerda', grupo: 'Glúteo', tipo: 'p',
    musculos: 'Glúteo y femoral', reps: [12, 15], inc: 2.5, img: 'Pull_Through',
    pasos: [
      'De espaldas a la polea baja, con la cuerda entre las piernas.',
      'Lleva la cola hacia atrás con la espalda recta.',
      'Sube empujando la cadera hacia adelante y apretando la cola.'
    ],
    rodilla: 'Rodillas apenas dobladas. Muy amigable.',
    variantes: ['rumano', 'hiperextension']
  },

  /* ---------------- TREN SUPERIOR ---------------- */
  jalon: {
    nombre: 'Jalón al pecho', maquina: 'Polea alta con barra larga (jalón)', grupo: 'Espalda', tipo: 'p',
    musculos: 'Espalda (dorsales)', reps: [12, 15], inc: 2.5, img: 'Wide-Grip_Lat_Pulldown',
    pasos: [
      'Siéntate y ajusta el rodillo sobre los muslos.',
      'Agarra la barra un poco más ancho que los hombros.',
      'Baja la barra hacia la parte alta del pecho, sacando pecho y bajando los hombros.',
      'Sube despacio hasta estirar los brazos.'
    ],
    rodilla: '—',
    variantes: ['jalonCerrado', 'remoAlto']
  },
  jalonCerrado: {
    nombre: 'Jalón agarre cerrado', maquina: 'Polea alta con agarre en V o barra corta', grupo: 'Espalda', tipo: 'p',
    musculos: 'Espalda', reps: [12, 15], inc: 2.5, img: 'Close-Grip_Front_Lat_Pulldown',
    pasos: [
      'Agarre cerrado, palmas mirándose o hacia ti.',
      'Lleva los codos hacia abajo y atrás, hacia las costillas.',
      'Sube lento.'
    ],
    rodilla: '—',
    variantes: ['jalon', 'remoAlto']
  },
  remoPolea: {
    nombre: 'Remo sentada en polea', maquina: 'Polea baja sentada (remo)', grupo: 'Espalda', tipo: 'p',
    musculos: 'Espalda media y postura', reps: [12, 15], inc: 2.5, img: 'Seated_Cable_Rows',
    pasos: [
      'Siéntate con los pies en los apoyos y las rodillas un poco dobladas.',
      'Espalda recta. Jala el agarre hacia el ombligo, juntando las escápulas.',
      'Regresa estirando los brazos sin encorvarte.'
    ],
    rodilla: 'Si la rodilla molesta estirada, dóblala un poco más.',
    variantes: ['remoMaquina', 'remoAlto']
  },
  remoMaquina: {
    nombre: 'Remo en máquina', maquina: 'Máquina de remo con apoyo de pecho', grupo: 'Espalda', tipo: 'm',
    musculos: 'Espalda media', reps: [12, 15], inc: 2.5, img: 'Leverage_Iso_Row',
    pasos: [
      'Pecho apoyado en la almohadilla.',
      'Jala las manijas llevando los codos hacia atrás.',
      'Aprieta las escápulas 1 segundo y regresa lento.'
    ],
    rodilla: '—',
    variantes: ['remoPolea', 'remoAlto']
  },
  remoAlto: {
    nombre: 'Remo alto en máquina', maquina: 'Máquina de remo alto (jalón convergente)', grupo: 'Espalda', tipo: 'm',
    musculos: 'Espalda', reps: [12, 15], inc: 2.5, img: 'Leverage_High_Row',
    pasos: [
      'Siéntate y agarra las manijas de arriba.',
      'Jala hacia abajo y atrás llevando los codos a las costillas.',
      'Regresa lento.'
    ],
    rodilla: '—',
    variantes: ['jalon', 'remoMaquina']
  },
  pressPecho: {
    nombre: 'Press de pecho en máquina', maquina: 'Máquina de press de pecho sentada', grupo: 'Pecho', tipo: 'm',
    musculos: 'Pecho y parte de atrás del brazo', reps: [12, 15], inc: 2.5, img: 'Leverage_Chest_Press',
    pasos: [
      'Ajusta el asiento para que las manijas queden a la altura del pecho.',
      'Empuja hacia adelante sin trabar los codos.',
      'Regresa lento hasta sentir el pecho estirado.'
    ],
    rodilla: '—',
    variantes: ['pressPechoPolea', 'aperturas']
  },
  pressPechoPolea: {
    nombre: 'Press de pecho en polea', maquina: 'Poleas (cruce de poleas / araña)', grupo: 'Pecho', tipo: 'p',
    musculos: 'Pecho', reps: [12, 15], inc: 1.25, img: 'Cable_Chest_Press',
    pasos: [
      'Poleas a la altura del pecho, un pie adelante para tener equilibrio.',
      'Empuja las manijas hacia adelante y regresa lento.'
    ],
    rodilla: 'Pararte con buen equilibrio, pies firmes.',
    variantes: ['pressPecho', 'aperturas']
  },
  aperturas: {
    nombre: 'Aperturas en máquina', maquina: 'Máquina de aperturas (peck deck / mariposa)', grupo: 'Pecho', tipo: 'm',
    musculos: 'Pecho', reps: [12, 15], inc: 2.5, img: 'Butterfly',
    pasos: [
      'Siéntate con la espalda pegada y los brazos abiertos en las manijas.',
      'Junta los brazos al frente como dando un abrazo grande.',
      'Abre despacio sin pasar la línea de los hombros.'
    ],
    rodilla: '—',
    variantes: ['aperturasPolea', 'pressPecho']
  },
  aperturasPolea: {
    nombre: 'Aperturas en polea', maquina: 'Poleas (araña / cruce)', grupo: 'Pecho', tipo: 'p',
    musculos: 'Pecho', reps: [12, 15], inc: 1.25, img: 'Incline_Cable_Flye',
    pasos: [
      'Recostada en un banco entre las dos poleas bajas.',
      'Brazos casi estirados, junta las manijas arriba del pecho.',
      'Abre lento.'
    ],
    rodilla: '—',
    variantes: ['aperturas', 'pressPecho']
  },
  pressHombro: {
    nombre: 'Press de hombro en máquina', maquina: 'Máquina de press de hombro sentada', grupo: 'Hombro', tipo: 'm',
    musculos: 'Hombros', reps: [12, 15], inc: 2.5, img: 'Machine_Shoulder_Military_Press',
    pasos: [
      'Manijas a la altura de los hombros, espalda pegada.',
      'Empuja hacia arriba sin trabar los codos.',
      'Baja lento hasta la altura de las orejas.'
    ],
    rodilla: '—',
    variantes: ['pressHombroMancuerna', 'laterales']
  },
  pressHombroMancuerna: {
    nombre: 'Press de hombro con mancuernas', maquina: 'Banco con respaldo + mancuernas', grupo: 'Hombro', tipo: 'l',
    musculos: 'Hombros', reps: [12, 15], inc: 1, img: 'Dumbbell_Shoulder_Press',
    pasos: [
      'Sentada con respaldo, mancuernas a la altura de las orejas.',
      'Sube hasta casi juntarlas arriba y baja lento.'
    ],
    rodilla: '—',
    variantes: ['pressHombro', 'laterales']
  },
  laterales: {
    nombre: 'Elevaciones laterales', maquina: 'Mancuernas livianas', grupo: 'Hombro', tipo: 'l',
    musculos: 'Hombros (forma)', reps: [12, 15], inc: 1, img: 'Side_Lateral_Raise',
    pasos: [
      'De pie o sentada, mancuernas a los lados.',
      'Sube los brazos hacia los lados hasta la altura de los hombros, codos un poco doblados.',
      'Baja lento en 3 segundos.'
    ],
    rodilla: 'Puedes hacerlo sentada.',
    variantes: ['lateralesPolea', 'pressHombro']
  },
  lateralesPolea: {
    nombre: 'Elevación lateral en polea', maquina: 'Polea baja con manija', grupo: 'Hombro', tipo: 'p',
    musculos: 'Hombros', reps: [12, 15], inc: 1.25, lado: true, img: 'Cable_Seated_Lateral_Raise',
    pasos: [
      'De lado a la polea baja, agarra la manija con la mano de afuera.',
      'Sube el brazo hacia el lado hasta el hombro y baja lento. Cambia.'
    ],
    rodilla: '—',
    variantes: ['laterales']
  },
  posterior: {
    nombre: 'Aperturas invertidas (hombro de atrás)', maquina: 'Máquina de aperturas al revés (peck deck mirando al respaldo)', grupo: 'Hombro', tipo: 'm',
    musculos: 'Hombro posterior y postura', reps: [12, 15], inc: 2.5, img: 'Reverse_Machine_Flyes',
    pasos: [
      'Siéntate mirando hacia el respaldo de la máquina de aperturas.',
      'Brazos al frente, abre hacia atrás juntando las escápulas.',
      'Regresa lento.'
    ],
    rodilla: '—',
    variantes: ['facePull', 'remoMaquina']
  },
  facePull: {
    nombre: 'Face pull en polea', maquina: 'Polea alta con cuerda', grupo: 'Hombro', tipo: 'p',
    musculos: 'Hombro posterior y postura', reps: [12, 15], inc: 1.25, img: 'Face_Pull',
    pasos: [
      'Cuerda a la altura de la cara.',
      'Jala hacia la frente separando las manos y abriendo los codos.',
      'Regresa lento.'
    ],
    rodilla: '—',
    variantes: ['posterior']
  },
  biceps: {
    nombre: 'Bíceps en máquina', maquina: 'Máquina de bíceps (predicador sentada)', grupo: 'Brazos', tipo: 'm',
    musculos: 'Bíceps (adelante del brazo)', reps: [12, 15], inc: 2.5, img: 'Machine_Bicep_Curl',
    pasos: [
      'Ajusta el asiento para que la parte de atrás del brazo quede apoyada.',
      'Sube doblando los codos y aprieta.',
      'Baja lento sin estirar de golpe.'
    ],
    rodilla: '—',
    variantes: ['bicepsPolea', 'bicepsMancuerna', 'martillo']
  },
  bicepsPolea: {
    nombre: 'Bíceps en polea', maquina: 'Polea baja con barra', grupo: 'Brazos', tipo: 'p',
    musculos: 'Bíceps', reps: [12, 15], inc: 1.25, img: 'Standing_Biceps_Cable_Curl',
    pasos: [
      'De pie frente a la polea baja, codos pegados al cuerpo.',
      'Sube la barra doblando los codos y baja lento.'
    ],
    rodilla: '—',
    variantes: ['biceps', 'martillo']
  },
  bicepsMancuerna: {
    nombre: 'Bíceps con mancuernas', maquina: 'Mancuernas', grupo: 'Brazos', tipo: 'l',
    musculos: 'Bíceps', reps: [12, 15], inc: 1, img: 'Dumbbell_Bicep_Curl',
    pasos: [
      'De pie o sentada, codos pegados al cuerpo.',
      'Sube girando la palma hacia arriba y baja lento.'
    ],
    rodilla: 'Puedes hacerlo sentada.',
    variantes: ['biceps', 'martillo']
  },
  martillo: {
    nombre: 'Curl martillo en polea', maquina: 'Polea baja con cuerda', grupo: 'Brazos', tipo: 'p',
    musculos: 'Bíceps y antebrazo', reps: [12, 15], inc: 1.25, img: 'Cable_Hammer_Curls_-_Rope_Attachment',
    pasos: [
      'Cuerda en la polea baja, palmas mirándose.',
      'Sube doblando los codos, pegados al cuerpo. Baja lento.'
    ],
    rodilla: '—',
    variantes: ['biceps', 'bicepsMancuerna']
  },
  triceps: {
    nombre: 'Tríceps en polea', maquina: 'Polea alta con cuerda', grupo: 'Brazos', tipo: 'p',
    musculos: 'Tríceps (atrás del brazo)', reps: [12, 15], inc: 1.25, img: 'Triceps_Pushdown_-_Rope_Attachment',
    pasos: [
      'Frente a la polea alta, codos pegados al cuerpo.',
      'Empuja la cuerda hacia abajo hasta estirar los brazos y separa las manos al final.',
      'Sube lento hasta 90°.'
    ],
    rodilla: '—',
    variantes: ['tricepsBarra', 'fondos', 'tricepsMaquina']
  },
  tricepsBarra: {
    nombre: 'Tríceps en polea con barra', maquina: 'Polea alta con barra corta', grupo: 'Brazos', tipo: 'p',
    musculos: 'Tríceps', reps: [12, 15], inc: 1.25, img: 'Triceps_Pushdown',
    pasos: ['Igual que con cuerda, pero con barra corta. Codos quietos.'],
    rodilla: '—',
    variantes: ['triceps', 'fondos']
  },
  fondos: {
    nombre: 'Fondos en máquina sentada', maquina: 'Máquina de fondos / dips sentada', grupo: 'Brazos', tipo: 'm',
    musculos: 'Tríceps y pecho', reps: [12, 15], inc: 2.5, img: 'Dip_Machine',
    pasos: [
      'Siéntate y agarra las manijas a los lados.',
      'Empuja hacia abajo hasta estirar los brazos.',
      'Sube lento, sin subir los hombros a las orejas.'
    ],
    rodilla: '—',
    variantes: ['triceps', 'tricepsMaquina']
  },
  tricepsMaquina: {
    nombre: 'Extensión de tríceps en máquina', maquina: 'Máquina de tríceps sentada', grupo: 'Brazos', tipo: 'm',
    musculos: 'Tríceps', reps: [12, 15], inc: 2.5, img: 'Machine_Triceps_Extension',
    pasos: ['Codos apoyados, estira los brazos y regresa lento.'],
    rodilla: '—',
    variantes: ['triceps', 'fondos']
  },

  /* ---------------- ABDOMEN ---------------- */
  pallof: {
    nombre: 'Pallof (abdomen de pie)', maquina: 'Polea a la altura del pecho', grupo: 'Abdomen', tipo: 'p',
    musculos: 'Abdomen completo (faja)', reps: [10, 12], inc: 1.25, lado: true, img: 'Pallof_Press',
    pasos: [
      'De lado a la polea, agarra la manija con las dos manos frente al pecho.',
      'Empuja los brazos hacia adelante y aguanta 2 segundos SIN dejar que te gire.',
      'Regresa. Termina un lado y cambia.'
    ],
    rodilla: 'Se hace de pie, sin acostarse en el piso. Ideal.',
    variantes: ['crunchMaquina', 'deadBug']
  },
  crunchMaquina: {
    nombre: 'Abdominal en máquina', maquina: 'Máquina de abdominales sentada', grupo: 'Abdomen', tipo: 'm',
    musculos: 'Abdomen', reps: [12, 15], inc: 2.5, img: 'Ab_Crunch_Machine',
    pasos: [
      'Siéntate y agarra las manijas.',
      'Encoge el abdomen llevando el pecho hacia las rodillas, sin jalar con los brazos.',
      'Regresa lento.'
    ],
    rodilla: '—',
    variantes: ['pallof', 'deadBug']
  },
  deadBug: {
    nombre: 'Bicho muerto (dead bug)', maquina: 'Colchoneta', grupo: 'Abdomen', tipo: 'c',
    musculos: 'Abdomen profundo', reps: [8, 12], inc: 0, lado: true, img: 'Dead_Bug',
    pasos: [
      'Boca arriba, brazos al techo y rodillas dobladas en el aire.',
      'Pega la espalda baja al piso.',
      'Estira un brazo y la pierna contraria despacio, vuelve y cambia.'
    ],
    rodilla: 'Si estirar la pierna molesta, solo baja el talón a tocar el piso.',
    variantes: ['pallof', 'plancha']
  },
  plancha: {
    nombre: 'Plancha en banco', maquina: 'Banco o colchoneta', grupo: 'Abdomen', tipo: 'c',
    musculos: 'Abdomen completo', reps: [20, 40], inc: 0, seg: true, img: 'Plank',
    pasos: [
      'Antebrazos en el piso o en un banco (más fácil).',
      'Cuerpo recto de la cabeza a los pies, apretando abdomen y cola.',
      'Aguanta el tiempo marcado (segundos).'
    ],
    rodilla: 'Hazla con las manos en un banco para no apoyar las rodillas en el piso.',
    variantes: ['pallof', 'deadBug']
  },

  /* ---------------- CARDIO ---------------- */
  bici: {
    nombre: 'Bicicleta estática', maquina: 'Bicicleta (mejor la de respaldo / reclinada)', grupo: 'Cardio', tipo: 'k',
    musculos: 'Corazón, quema de grasa', reps: [10, 20], inc: 0, img: 'Recumbent_Bike',
    pasos: [
      'Ajusta el asiento: con el pedal abajo, la rodilla queda casi estirada.',
      'Ritmo en el que puedas hablar pero no cantar.',
      'Resistencia baja a media.'
    ],
    rodilla: 'La mejor opción de cardio para la prótesis: sin impacto.',
    variantes: ['eliptica', 'caminadora']
  },
  eliptica: {
    nombre: 'Elíptica', maquina: 'Máquina elíptica', grupo: 'Cardio', tipo: 'k',
    musculos: 'Corazón, quema de grasa', reps: [10, 20], inc: 0, img: 'Elliptical_Trainer',
    pasos: ['Agárrate de las manijas, paso suave y constante.', 'Resistencia baja a media.'],
    rodilla: 'Sin impacto. Buena para la rodilla.',
    variantes: ['bici', 'caminadora']
  },
  caminadora: {
    nombre: 'Caminar en inclinación', maquina: 'Caminadora (trotadora)', grupo: 'Cardio', tipo: 'k',
    musculos: 'Corazón, glúteo, quema de grasa', reps: [10, 20], inc: 0, img: 'Walking_Treadmill',
    pasos: ['Caminar rápido (sin trotar), inclinación 3 a 8.', 'Agárrate solo si lo necesitas.'],
    rodilla: 'Caminar, no correr. Si la rodilla molesta con la inclinación, bájala.',
    variantes: ['bici', 'eliptica']
  }
};

// Imagen por defecto = mismo nombre que el ejercicio en la base de fotos
EJ.prensa.img = 'Leg_Press';

/* --------- RUTINAS ---------
   Los ejercicios van en orden de importancia.
   Tranquila = los 6 primeros · Normal = 7 · Con energía = 8          */
const RUTINAS = {
  piernaA: {
    nombre: 'Pierna y glúteo', corto: 'Pierna', pierna: true,
    desc: 'Cuádriceps, femoral y glúteo',
    ejercicios: ['hipThrust', 'prensa', 'extension', 'curlSentado', 'abductor', 'patada', 'pantorrillaSentada', 'aductor']
  },
  superiorA: {
    nombre: 'Espalda, pecho y brazo', corto: 'Brazo',
    desc: 'Espalda, pecho y brazos · tonificar',
    ejercicios: ['jalon', 'pressPecho', 'remoPolea', 'aperturas', 'triceps', 'biceps', 'laterales', 'pallof']
  },
  piernaB: {
    nombre: 'Glúteo y femoral', corto: 'Glúteo', pierna: true,
    desc: 'Glúteo y parte de atrás de la pierna',
    ejercicios: ['rumano', 'hipThrust', 'curlAcostado', 'prensa', 'abductor', 'hiperextension', 'extensionUna', 'pantorrillaPrensa']
  },
  superiorB: {
    nombre: 'Hombro, brazo y abdomen', corto: 'Hombro',
    desc: 'Hombros, espalda, brazos y abdomen',
    ejercicios: ['remoMaquina', 'pressHombro', 'jalonCerrado', 'posterior', 'fondos', 'martillo', 'crunchMaquina', 'deadBug']
  },
  gluteoTotal: {
    nombre: 'Glúteo y cuerpo completo', corto: 'Completo', pierna: true,
    desc: 'Día extra: glúteo y un poquito de todo',
    ejercicios: ['hipThrust', 'abductor', 'jalon', 'pullThrough', 'pressPecho', 'patada', 'remoMaquina', 'pallof']
  }
};

// Plan según cuántos días va a ir esta semana (orden sugerido)
const PLANES = {
  2: ['piernaA', 'piernaB'],
  3: ['piernaA', 'superiorA', 'piernaB'],
  4: ['piernaA', 'superiorA', 'piernaB', 'superiorB'],
  5: ['piernaA', 'superiorA', 'piernaB', 'superiorB', 'gluteoTotal'],
  6: ['piernaA', 'superiorA', 'piernaB', 'superiorB', 'gluteoTotal', 'piernaA']
};

// Cómo cambia el día según la energía
const ENERGIA = {
  tranquila: { nombre: 'Tranquila', nivel: 1, n: 6, series: 2, rir: 3, cardio: 10, descanso: 60,
    frase: '6 ejercicios · 2 series · peso cómodo', guia: 'Termina cada serie sintiendo que podías hacer 3 más.' },
  normal: { nombre: 'Normal', nivel: 2, n: 7, series: 3, rir: 2, cardio: 15, descanso: 75,
    frase: '7 ejercicios · 3 series', guia: 'Termina cada serie sintiendo que podías hacer 2 más.' },
  fuerte: { nombre: 'Con energía', nivel: 3, n: 8, series: 3, rir: 1, cardio: 20, descanso: 90,
    frase: '8 ejercicios · 3 series · un poquito más pesado', guia: 'Las últimas repeticiones deben costar: te debe sobrar solo 1.' }
};

// Composición corporal que mandó Mike (báscula del gimnasio)
const MEDIDAS_INICIALES = [
  { fecha: '2026-06-16', peso: 65, grasa: 20, musculo: 20, libre: 40 },
  { fecha: '2026-11-17', peso: 66, grasa: 22, musculo: 21, libre: 40 }
];
