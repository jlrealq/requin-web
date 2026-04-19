// ============================================================
// REQUIN & ASOCIADOS — Bot Telegram — Cloudflare Worker
// Versión 2.0 — JavaScript para Workers
// Desplegar en: dash.cloudflare.com → Workers & Pages
//
// Variables de entorno requeridas (Settings → Variables):
//   BOT_TOKEN      = 8603881267:AAH03oaJqV4f30KXJXhfif2Cj9vfB8iwY0g
//   ADMIN_CHAT_ID  = 2130037013
//   WEBHOOK_SECRET = ReQu1n_W3bh00k_S3cr3t_2025
//
// KV Namespace (Settings → KV Namespace Bindings):
//   SESSION_KV → [tu namespace creado en Storage → KV]
// ============================================================

const BOT_API = 'https://api.telegram.org/bot';

const SEGMENTOS = {
  seg_natural:   'Persona Natural',
  seg_pyme:      'Pyme',
  seg_holding:   'Holding Familiar',
  seg_startup:   'Startup',
  seg_expansion: 'Expansión Internacional',
  seg_otro:      'Otro',
};

const NECESIDADES = {
  need_tributaria:       'Optimización Tributaria',
  need_auditoria:        'Auditoría y Control de Gestión',
  need_internacional:    'Expansión Internacional / España',
  need_reestructuracion: 'Reestructuración Financiera',
  need_estrategia:       'Evaluación Estratégica',
};

const ETAPAS = {
  etapa_planeando: 'Planificación / Pre-operación',
  etapa_operando:  'En operación',
  etapa_creciendo: 'En crecimiento / expansión',
  etapa_crisis:    'Reestructuración / situación compleja',
};

const URGENCIAS = {
  urg_esta_semana: 'Urgente — esta semana',
  urg_pronto:      'Próximas semanas',
  urg_explorando:  'Explorando opciones',
};

// ── Entry point ─────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (secret !== env.WEBHOOK_SECRET) {
      return new Response('Forbidden', { status: 403 });
    }
    try {
      const update = await request.json();
      ctx.waitUntil(handleUpdate(update, env));
    } catch (e) {
      console.error('Parse error:', e);
    }
    return new Response('OK', { status: 200 });
  },
};

// ── Update handler ───────────────────────────────────────────
async function handleUpdate(update, env) {
  const token = env.BOT_TOKEN;
  let chatId, firstName, username, text, callbackData, callbackId;

  if (update.callback_query) {
    chatId       = update.callback_query.from.id;
    firstName    = update.callback_query.from.first_name || '';
    username     = update.callback_query.from.username   || '';
    callbackData = update.callback_query.data;
    callbackId   = update.callback_query.id;
    text         = '';
    await answerCallback(token, callbackId);
  } else if (update.message) {
    chatId    = update.message.chat.id;
    firstName = update.message.from.first_name || '';
    username  = update.message.from.username   || '';
    text      = update.message.text || '';
    callbackData = '';
  } else {
    return;
  }

  // Load session from KV
  let session = {};
  try {
    const stored = await env.SESSION_KV.get(`s:${chatId}`);
    if (stored) session = JSON.parse(stored);
  } catch (_) {}

  // /start command
  if (text && text.startsWith('/start')) {
    const parts  = text.split(' ');
    const origin = parts[1] || 'directo';
    session = { state: 'AWAITING_SEGMENT', origin, leads: { nombre: firstName } };
    await saveSession(env, chatId, session);
    return sendWelcome(token, chatId, firstName, origin);
  }

  if (update.callback_query) {
    await handleCallback(token, chatId, callbackData, session, env, firstName, username);
  } else if (update.message) {
    await handleMessage(token, chatId, text, session, env, firstName, username);
  }
}

// ── Message handler ──────────────────────────────────────────
async function handleMessage(token, chatId, text, session, env, firstName, username) {
  const cmd = text.split('@')[0].toLowerCase();

  switch (cmd) {
    case '/servicios':  return sendServiciosMenu(token, chatId);
    case '/espana':     return sendEspanaInfo(token, chatId);
    case '/auditoria':  return sendAuditoriaInfo(token, chatId);
    case '/honorarios': return sendHonorariosInfo(token, chatId);
    case '/nda':        return sendNdaInfo(token, chatId);
    case '/contacto':   return sendContactoInfo(token, chatId);
    case '/asesor':     return requestAsesor(token, chatId, session, env, firstName, username);
  }

  const state = session.state || 'AWAITING_SEGMENT';

  switch (state) {
    case 'AWAITING_EMPRESA':
      session.leads.empresa = text;
      session.state         = 'AWAITING_NEED';
      await saveSession(env, chatId, session);
      return askNeed(token, chatId);

    case 'AWAITING_PAIS':
      session.leads.pais = text;
      session.state      = 'AWAITING_OBJETIVO';
      await saveSession(env, chatId, session);
      return askObjetivo(token, chatId);

    case 'AWAITING_OBJETIVO':
      session.leads.objetivo = text;
      session.state          = 'AWAITING_ETAPA';
      await saveSession(env, chatId, session);
      return askEtapa(token, chatId);

    default:
      return handleFreeText(token, chatId, text, session, env, firstName, username);
  }
}

// ── Free text intent classifier ──────────────────────────────
async function handleFreeText(token, chatId, text, session, env, firstName, username) {
  const l = text.toLowerCase();

  if (/honorario|precio|costo|cobran|tarifa|fee/.test(l))
    return sendHonorariosInfo(token, chatId);
  if (/españa|espana|expansión|europa|madrid|barcelona/.test(l))
    return sendEspanaInfo(token, chatId);
  if (/auditor|control|fuga|revisión|inconsistencia/.test(l))
    return sendAuditoriaInfo(token, chatId);
  if (/confidencial|nda|secreto|privacidad|discreción/.test(l))
    return sendNdaInfo(token, chatId);
  if (/asesor|reunión|reunion|contacto|hablar|agendar/.test(l))
    return requestAsesor(token, chatId, session, env, firstName, username);
  if (/tributari|impuesto|renta|iva|sii|fiscal/.test(l)) {
    return sendMessage(token, chatId,
      'La optimización tributaria es una de las áreas centrales de Requin &amp; Asociados.\n\n' +
      'Para orientarle correctamente, indique brevemente su situación y país.\n\n' +
      'También puede escribir /asesor para derivar directamente con un especialista.'
    );
  }
  if (/holding|estructura|sociedad|filial|matriz/.test(l)) {
    return sendMessage(token, chatId,
      'La estructuración de holdings es parte del trabajo de Requin &amp; Asociados.\n\n' +
      '¿Qué tipo de empresa tiene actualmente y en qué país opera?\n\n' +
      'También puede escribir /asesor para contactar directamente con el equipo.'
    );
  }
  if (text.length > 180 || /beps|ocde|cfc|doble imposición|treaty/.test(l)) {
    return sendMessage(token, chatId,
      'Su consulta requiere un análisis formal para responderla con precisión.\n\n' +
      'El equipo de Requin &amp; Asociados puede revisarla en una <b>sesión inicial de diagnóstico</b>, sin compromiso.\n\n' +
      '¿Desea agendar esa reunión?',
      { inline_keyboard: [[{ text: '📅 Solicitar reunión inicial', callback_data: 'conv_reunion' }]] }
    );
  }

  // Guardar mensaje libre y reencauzar
  session.leads = session.leads || {};
  session.leads.mensaje_libre = text;
  await saveSession(env, chatId, session);

  if (!session.state || session.state === 'AWAITING_SEGMENT') {
    return sendMessage(token, chatId,
      'Recibí su mensaje. Para orientarle correctamente, necesito conocer su perfil.\n\n¿Con qué tipo de empresa trabaja?',
      buildSegmentKeyboard()
    );
  }
  return sendMessage(token, chatId,
    '¿Desea continuar con el diagnóstico o prefiere contactar directamente con un asesor?',
    { inline_keyboard: [
      [{ text: '▶ Continuar diagnóstico', callback_data: 'retomar_flujo' }],
      [{ text: '💬 Hablar con un asesor',  callback_data: 'conv_asesor' }],
    ]}
  );
}

// ── Callback handler ─────────────────────────────────────────
async function handleCallback(token, chatId, data, session, env, firstName, username) {

  if (SEGMENTOS[data]) {
    session.leads.tipo_cliente = SEGMENTOS[data];
    session.state              = 'AWAITING_EMPRESA';
    await saveSession(env, chatId, session);
    return sendMessage(token, chatId,
      `Identificado como <b>${SEGMENTOS[data]}</b>.\n\n¿Cuál es el nombre de su empresa o proyecto?\n<i>(Si prefiere no indicarlo, escriba «Reservado»)</i>`
    );
  }

  if (NECESIDADES[data]) {
    session.leads.necesidad = NECESIDADES[data];
    session.state           = 'AWAITING_PAIS';
    await saveSession(env, chatId, session);
    return askPais(token, chatId);
  }

  if (ETAPAS[data]) {
    session.leads.etapa = ETAPAS[data];
    session.state       = 'AWAITING_URGENCIA';
    await saveSession(env, chatId, session);
    return askUrgencia(token, chatId);
  }

  if (URGENCIAS[data]) {
    session.leads.urgencia = URGENCIAS[data];
    session.state          = 'AWAITING_CONVERSION';
    await saveSession(env, chatId, session);
    return askConversion(token, chatId);
  }

  switch (data) {
    case 'conv_reunion':
      session.leads.desea_reunion = 'Sí — reunión inicial solicitada';
      session.state               = 'DONE';
      await saveSession(env, chatId, session);
      await sendConfirmReunion(token, chatId, firstName);
      await notifyAdmin(token, env, session, firstName, username, '📅 REUNIÓN SOLICITADA');
      break;

    case 'conv_asesor':
      session.leads.desea_reunion = 'Sí — contacto humano solicitado';
      session.state               = 'DONE';
      await saveSession(env, chatId, session);
      await sendConfirmAsesor(token, chatId, firstName);
      await notifyAdmin(token, env, session, firstName, username, '💬 CONTACTO HUMANO');
      break;

    case 'conv_info':
      session.leads.desea_reunion = 'Prefirió ver más información';
      await saveSession(env, chatId, session);
      await sendInfoGeneral(token, chatId);
      break;

    case 'retomar_flujo':
      await retakeFlujo(token, chatId, session.state || 'AWAITING_SEGMENT');
      break;
  }
}

// ── Flow questions ────────────────────────────────────────────
async function sendWelcome(token, chatId, firstName, origin) {
  const name = firstName || 'estimado/a';
  const note = origin === 'web_requinspa' ? ' Hemos registrado que nos visita desde nuestra web.' : '';
  await sendMessage(token, chatId,
    `Bienvenido/a, <b>${name}</b>.${note}\n\n` +
    `Soy el asistente de <b>Requin &amp; Asociados</b>. Podemos orientarle en ` +
    `reestructuración tributaria, auditoría estratégica, control de gestión, ` +
    `expansión a España y diagnóstico financiero.\n\n` +
    `¿Con qué tipo de empresa o estructura trabaja?`,
    buildSegmentKeyboard()
  );
}

function buildSegmentKeyboard() {
  return { inline_keyboard: [
    [
      { text: '👤 Persona Natural',         callback_data: 'seg_natural' },
      { text: '🏢 Pyme',                    callback_data: 'seg_pyme' },
    ],
    [
      { text: '🏛️ Holding Familiar',        callback_data: 'seg_holding' },
      { text: '🚀 Startup',                 callback_data: 'seg_startup' },
    ],
    [
      { text: '🌍 Expansión Internacional', callback_data: 'seg_expansion' },
      { text: '🔵 Otro',                    callback_data: 'seg_otro' },
    ],
  ]};
}

async function askNeed(token, chatId) {
  await sendMessage(token, chatId, '¿Cuál es el área principal que desea evaluar?', {
    inline_keyboard: [
      [{ text: '💰 Optimización Tributaria',          callback_data: 'need_tributaria' }],
      [{ text: '🔍 Auditoría y Control de Gestión',   callback_data: 'need_auditoria' }],
      [{ text: '🌍 Expansión Internacional / España', callback_data: 'need_internacional' }],
      [{ text: '🏗️ Reestructuración Financiera',      callback_data: 'need_reestructuracion' }],
      [{ text: '📊 Evaluación Estratégica',           callback_data: 'need_estrategia' }],
    ]
  });
}

async function askPais(token, chatId) {
  await sendMessage(token, chatId,
    '¿En qué país opera actualmente su empresa?\n<i>(Escríbalo directamente: Chile, México, España...)</i>'
  );
}

async function askObjetivo(token, chatId) {
  await sendMessage(token, chatId,
    '¿Cuál es su objetivo principal en este momento?\n\n' +
    '<i>Descríbalo brevemente: optimizar carga fiscal, acceder a financiamiento, internacionalizar, reestructurar, auditar, otro.</i>'
  );
}

async function askEtapa(token, chatId) {
  await sendMessage(token, chatId, '¿En qué etapa se encuentra su empresa o proyecto?', {
    inline_keyboard: [
      [{ text: '📐 Planificación / Pre-operación',         callback_data: 'etapa_planeando' }],
      [{ text: '⚙️ En operación',                          callback_data: 'etapa_operando' }],
      [{ text: '📈 En crecimiento / expansión',            callback_data: 'etapa_creciendo' }],
      [{ text: '🔄 Reestructuración / situación compleja', callback_data: 'etapa_crisis' }],
    ]
  });
}

async function askUrgencia(token, chatId) {
  await sendMessage(token, chatId, '¿Con qué urgencia requiere orientación profesional?', {
    inline_keyboard: [
      [{ text: '🔴 Urgente — esta semana', callback_data: 'urg_esta_semana' }],
      [{ text: '🟡 Próximas semanas',       callback_data: 'urg_pronto' }],
      [{ text: '🟢 Explorando opciones',    callback_data: 'urg_explorando' }],
    ]
  });
}

async function askConversion(token, chatId) {
  await sendMessage(token, chatId,
    'Con base en la información recibida, un asesor de Requin &amp; Asociados puede revisar su caso.\n\n<b>¿Cómo prefiere continuar?</b>',
    { inline_keyboard: [
      [{ text: '📅 Solicitar reunión inicial',   callback_data: 'conv_reunion' }],
      [{ text: '💬 Hablar con un asesor ahora', callback_data: 'conv_asesor' }],
      [{ text: 'ℹ️ Ver más información primero', callback_data: 'conv_info' }],
    ]}
  );
}

async function sendConfirmReunion(token, chatId, firstName) {
  await sendMessage(token, chatId,
    `✅ <b>Solicitud registrada, ${firstName || 'estimado/a'}.</b>\n\n` +
    `El equipo de Requin &amp; Asociados revisará su caso y se pondrá en contacto ` +
    `en las próximas horas hábiles para confirmar la sesión inicial.\n\n` +
    `<i>Agradecemos su interés. Requin &amp; Asociados.</i>`
  );
}

async function sendConfirmAsesor(token, chatId, firstName) {
  await sendMessage(token, chatId,
    `💬 <b>Solicitud recibida, ${firstName || 'estimado/a'}.</b>\n\n` +
    `Un asesor tomará contacto con usted a través de este chat en breve.\n\n` +
    `<i>Agradecemos su confianza. Requin &amp; Asociados.</i>`
  );
}

// ── Named commands ────────────────────────────────────────────
async function sendServiciosMenu(token, chatId) {
  await sendMessage(token, chatId,
    '<b>Áreas de especialidad — Requin &amp; Asociados</b>\n\n' +
    '/auditoria — Auditoría y control de gestión\n' +
    '/espana — Expansión a España\n' +
    '/honorarios — Modelo de trabajo\n' +
    '/nda — Confidencialidad\n' +
    '/contacto — Datos de contacto\n' +
    '/asesor — Hablar con un asesor'
  );
}

async function sendEspanaInfo(token, chatId) {
  await sendMessage(token, chatId,
    '🌍 <b>Expansión a España</b>\n\n' +
    'Requin asesora la estructuración y expansión de empresas hacia España, adaptando ' +
    'forma jurídica, régimen fiscal y operativa a la normativa local.\n\n' +
    'Para evaluar su caso: ¿país actual, tipo de empresa y objetivo principal?'
  );
}

async function sendAuditoriaInfo(token, chatId) {
  await sendMessage(token, chatId,
    '🔍 <b>Auditoría y Control de Gestión</b>\n\n' +
    'Revisamos consistencia financiera, detectamos fugas de capital y proponemos controles internos efectivos.\n\n' +
    'Para orientarle: ¿contexto, síntomas del problema y tamaño aproximado de la operación?'
  );
}

async function sendHonorariosInfo(token, chatId) {
  await sendMessage(token, chatId,
    '💼 <b>Honorarios y Modelo de Trabajo</b>\n\n' +
    'Los honorarios dependen del alcance, complejidad, riesgo, jurisdicción y etapa del proyecto. ' +
    'Requin &amp; Asociados trabaja con modelos adaptados: diagnóstico inicial, proyecto acotado, ' +
    'retención mensual o esquema de éxito compartido.\n\n' +
    'Los detalles se definen en la sesión inicial. ¿Desea agendarla? /asesor'
  );
}

async function sendNdaInfo(token, chatId) {
  await sendMessage(token, chatId,
    '🔒 <b>Confidencialidad</b>\n\n' +
    'El equipo de Requin &amp; Asociados puede trabajar bajo acuerdo de confidencialidad (NDA) ' +
    'cuando el caso así lo requiere. Toda información se trata con la máxima discreción.\n\n' +
    'Si desea formalizar un NDA antes de compartir detalles, indíquelo al asesor: /asesor'
  );
}

async function sendContactoInfo(token, chatId) {
  await sendMessage(token, chatId,
    '📋 <b>Datos de contacto</b>\n\n' +
    '🌐 <a href="https://requinspa.com">requinspa.com</a>\n' +
    '📧 contacto@requinspa.com\n' +
    '🇨🇱 +56 9 9326 0101\n' +
    '🇪🇸 +34 682 02 8354\n\n' +
    'O inicie el diagnóstico directamente: /asesor'
  );
}

async function sendInfoGeneral(token, chatId) {
  await sendMessage(token, chatId,
    '<b>Requin &amp; Asociados — Áreas de especialidad</b>\n\n' +
    '🏗️ <b>Reestructuración financiera y tributaria</b>\nRediseño de estructuras para mejorar eficiencia fiscal.\n\n' +
    '🌍 <b>Expansión internacional</b>\nEstructuración para operar en España y otros mercados.\n\n' +
    '🔍 <b>Auditoría y control de gestión</b>\nDetección de fugas de capital y revisión financiera.\n\n' +
    'Para iniciar un diagnóstico: /asesor'
  );
}

async function requestAsesor(token, chatId, session, env, firstName, username) {
  session.leads                 = session.leads || {};
  session.leads.desea_reunion   = 'Sí — solicitud directa /asesor';
  await saveSession(env, chatId, session);
  await sendMessage(token, chatId,
    'Hemos registrado su solicitud.\n\n' +
    'Un asesor de <b>Requin &amp; Asociados</b> se pondrá en contacto a la brevedad.\n\n' +
    '<i>Agradecemos su interés. Requin &amp; Asociados.</i>'
  );
  await notifyAdmin(token, env, session, firstName, username, '🆘 SOLICITUD DIRECTA /asesor');
}

async function retakeFlujo(token, chatId, state) {
  switch (state) {
    case 'AWAITING_SEGMENT':    return sendMessage(token, chatId, '¿Con qué tipo de empresa trabaja?', buildSegmentKeyboard());
    case 'AWAITING_EMPRESA':    return sendMessage(token, chatId, '¿Cuál es el nombre de su empresa o proyecto?');
    case 'AWAITING_NEED':       return askNeed(token, chatId);
    case 'AWAITING_PAIS':       return askPais(token, chatId);
    case 'AWAITING_OBJETIVO':   return askObjetivo(token, chatId);
    case 'AWAITING_ETAPA':      return askEtapa(token, chatId);
    case 'AWAITING_URGENCIA':   return askUrgencia(token, chatId);
    case 'AWAITING_CONVERSION': return askConversion(token, chatId);
    default: return sendMessage(token, chatId, 'Puede continuar escribiendo su consulta o escribir /asesor.');
  }
}

// ── Admin notification ─────────────────────────────────────────
async function notifyAdmin(token, env, session, firstName, username, tipo) {
  const l      = session.leads || {};
  const origin = session.origin || 'desconocido';
  const tag    = username ? `@${username}` : '(sin usuario público)';

  const text =
    '🔔 <b>NUEVO LEAD — REQUIN &amp; ASOCIADOS</b>\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    `📌 <b>Tipo:</b> ${tipo}\n` +
    `🌐 <b>Origen:</b> ${origin}\n` +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    `👤 <b>Nombre:</b> ${l.nombre || firstName || '—'}\n` +
    `🏢 <b>Empresa:</b> ${l.empresa || '—'}\n` +
    `💬 <b>Telegram:</b> ${tag}\n` +
    `🏢 <b>Tipo cliente:</b> ${l.tipo_cliente || '—'}\n` +
    `🌍 <b>País:</b> ${l.pais || '—'}\n` +
    `🎯 <b>Necesidad:</b> ${l.necesidad || '—'}\n` +
    `📝 <b>Objetivo:</b> ${l.objetivo || '—'}\n` +
    `📊 <b>Etapa:</b> ${l.etapa || '—'}\n` +
    `⏱️ <b>Urgencia:</b> ${l.urgencia || '—'}\n` +
    `✅ <b>¿Reunión?:</b> ${l.desea_reunion || '—'}\n` +
    `💬 <b>Msg libre:</b> ${l.mensaje_libre || '—'}\n` +
    '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '<i>Requin Bot — Cloudflare Worker</i>';

  await sendMessage(token, env.ADMIN_CHAT_ID, text);
}

// ── Telegram API helpers ───────────────────────────────────────
async function sendMessage(token, chatId, text, replyMarkup = null) {
  const body = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  const res = await fetch(`${BOT_API}${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  return res.json();
}

async function answerCallback(token, callbackId) {
  await fetch(`${BOT_API}${token}/answerCallbackQuery`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ callback_query_id: callbackId }),
  });
}

async function saveSession(env, chatId, data) {
  await env.SESSION_KV.put(`s:${chatId}`, JSON.stringify(data), {
    expirationTtl: 604800, // 7 días
  });
}
