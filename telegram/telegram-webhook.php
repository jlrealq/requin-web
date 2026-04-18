<?php
// ============================================================
// REQUIN & ASOCIADOS — Bot Telegram de Pre-Calificación
// Archivo: telegram/telegram-webhook.php
// URL en producción: https://www.requinspa.com/telegram/telegram-webhook.php
// ============================================================

// ---- CONFIGURACIÓN ----
define('BOT_TOKEN',      '8603881267:AAH03oaJqV4f30KXJXhfif2Cj9vfB8iwY0g');
define('ADMIN_CHAT_ID',  '2130037013');
define('WEBHOOK_SECRET', 'ReQu1n_W3bh00k_S3cr3t_2025'); // Usar al registrar el webhook
define('SESSIONS_DIR',   __DIR__ . '/sessions/');
define('TELEGRAM_API',   'https://api.telegram.org/bot' . BOT_TOKEN . '/');

// ---- SEGURIDAD: Validar token secreto de Telegram ----
$headers = function_exists('getallheaders') ? getallheaders() : [];
// Fallback vía $_SERVER para servidores que no soporten getallheaders()
if (empty($headers)) {
    foreach ($_SERVER as $key => $val) {
        if (strpos($key, 'HTTP_') === 0) {
            $normalized = str_replace('_', '-', ucwords(strtolower(substr($key, 5)), '-'));
            $headers[$normalized] = $val;
        }
    }
}
$secretHeader = $headers['X-Telegram-Bot-Api-Secret-Token']
             ?? $headers['x-telegram-bot-api-secret-token']
             ?? '';

if ($secretHeader !== WEBHOOK_SECRET) {
    http_response_code(403);
    exit('Forbidden');
}

// ---- LEER INPUT ----
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(200);
    exit();
}

// ---- PARSEAR EVENTO ----
$isCallback = isset($input['callback_query']);
$isMessage  = isset($input['message']);

if ($isCallback) {
    $chatId       = $input['callback_query']['from']['id'];
    $firstName    = $input['callback_query']['from']['first_name'] ?? 'Usuario';
    $username     = $input['callback_query']['from']['username']   ?? '';
    $callbackData = $input['callback_query']['data'];
    $callbackId   = $input['callback_query']['id'];
    $text         = '';
    // Responder al callback inmediatamente para quitar el spinner
    answerCallbackQuery($callbackId);
} elseif ($isMessage) {
    $chatId    = $input['message']['chat']['id'];
    $firstName = $input['message']['from']['first_name'] ?? 'Usuario';
    $username  = $input['message']['from']['username']   ?? '';
    $text      = $input['message']['text'] ?? '';
    $callbackData = '';
} else {
    http_response_code(200);
    exit();
}

// ---- SESIÓN ----
if (!is_dir(SESSIONS_DIR)) {
    @mkdir(SESSIONS_DIR, 0755, true);
}
$sessionFile = SESSIONS_DIR . $chatId . '.json';
$session     = [];
if (file_exists($sessionFile)) {
    $session = json_decode(file_get_contents($sessionFile), true) ?? [];
}

// Resetear sesión en /start
if ($isMessage && strpos($text, '/start') === 0) {
    $parts  = explode(' ', $text, 2);
    $origin = $parts[1] ?? 'directo';
    $session = ['state' => 'AWAITING_SEGMENT', 'origin' => $origin, 'leads' => []];
    saveSession($sessionFile, $session);
    sendWelcome($chatId, $firstName, $origin);
    http_response_code(200);
    exit();
}

$state = $session['state'] ?? 'AWAITING_SEGMENT';

// ---- DESPACHO ----
if ($isCallback) {
    handleCallback($chatId, $callbackData, $session, $sessionFile, $firstName, $username);
} elseif ($isMessage) {
    handleMessage($chatId, $text, $state, $session, $sessionFile, $firstName, $username);
}

http_response_code(200);
exit();

// ============================================================
// MANEJADOR DE MENSAJES DE TEXTO
// ============================================================
function handleMessage($chatId, $text, $state, &$session, $sessionFile, $firstName, $username) {

    // Comandos de menú rápido
    $cmd = strtolower(explode('@', $text)[0]);
    switch ($cmd) {
        case '/servicios':   sendServiciosMenu($chatId);                                    return;
        case '/espana':      sendEspanaInfo($chatId);                                       return;
        case '/auditoria':   sendAuditoriaInfo($chatId);                                    return;
        case '/honorarios':  sendHonorariosInfo($chatId);                                   return;
        case '/nda':         sendNdaInfo($chatId);                                          return;
        case '/contacto':    sendContactoInfo($chatId);                                     return;
        case '/asesor':      requestAsesor($chatId, $session, $sessionFile, $firstName, $username); return;
    }

    // Respuestas de texto libre según estado
    switch ($state) {
        case 'AWAITING_PAIS':
            $session['leads']['pais'] = $text;
            $session['state']         = 'AWAITING_OBJETIVO';
            saveSession($sessionFile, $session);
            askObjetivo($chatId);
            break;

        case 'AWAITING_OBJETIVO':
            $session['leads']['objetivo'] = $text;
            $session['state']             = 'AWAITING_ETAPA';
            saveSession($sessionFile, $session);
            askEtapa($chatId);
            break;

        default:
            // Estado indeterminado: reiniciar
            $session = ['state' => 'AWAITING_SEGMENT', 'origin' => 'directo', 'leads' => []];
            saveSession($sessionFile, $session);
            sendWelcome($chatId, $firstName, 'directo');
            break;
    }
}

// ============================================================
// MANEJADOR DE CALLBACKS (botones inline)
// ============================================================
function handleCallback($chatId, $data, &$session, $sessionFile, $firstName, $username) {

    // ── Segmento ──────────────────────────────────────────
    $segmentos = [
        'seg_natural'   => 'Persona Natural',
        'seg_pyme'      => 'Pyme',
        'seg_holding'   => 'Holding Familiar',
        'seg_startup'   => 'Startup',
        'seg_expansion' => 'Expansión Internacional',
        'seg_otro'      => 'Otro',
    ];
    if (isset($segmentos[$data])) {
        $session['leads']['segmento'] = $segmentos[$data];
        $session['state']             = 'AWAITING_NEED';
        saveSession($sessionFile, $session);
        askNeed($chatId);
        return;
    }

    // ── Necesidad ─────────────────────────────────────────
    $necesidades = [
        'need_tributaria'      => 'Optimización Tributaria',
        'need_auditoria'       => 'Auditoría y Control de Gestión',
        'need_internacional'   => 'Expansión Internacional / España',
        'need_reestructuracion'=> 'Reestructuración Financiera',
    ];
    if (isset($necesidades[$data])) {
        $session['leads']['necesidad'] = $necesidades[$data];
        $session['state']              = 'AWAITING_PAIS';
        saveSession($sessionFile, $session);
        askPais($chatId);
        return;
    }

    // ── Etapa ─────────────────────────────────────────────
    $etapas = [
        'etapa_planeando' => 'Planificación / Pre-operación',
        'etapa_operando'  => 'En operación',
        'etapa_creciendo' => 'En crecimiento / expansión',
        'etapa_crisis'    => 'Reestructuración / situación compleja',
    ];
    if (isset($etapas[$data])) {
        $session['leads']['etapa'] = $etapas[$data];
        $session['state']          = 'AWAITING_URGENCIA';
        saveSession($sessionFile, $session);
        askUrgencia($chatId);
        return;
    }

    // ── Urgencia ──────────────────────────────────────────
    $urgencias = [
        'urg_esta_semana' => 'Urgente — esta semana',
        'urg_pronto'      => 'Próximas semanas',
        'urg_explorando'  => 'Explorando opciones',
    ];
    if (isset($urgencias[$data])) {
        $session['leads']['urgencia'] = $urgencias[$data];
        $session['state']             = 'AWAITING_CONVERSION';
        saveSession($sessionFile, $session);
        askConversion($chatId);
        return;
    }

    // ── Conversión ────────────────────────────────────────
    switch ($data) {
        case 'conv_reunion':
            $session['leads']['conversion'] = 'Reunión inicial solicitada';
            $session['state']               = 'DONE';
            saveSession($sessionFile, $session);
            sendConfirmReunion($chatId, $firstName);
            notifyAdmin($session, $firstName, $username, '📅 REUNIÓN SOLICITADA');
            break;

        case 'conv_asesor':
            $session['leads']['conversion'] = 'Contacto humano solicitado';
            $session['state']               = 'DONE';
            saveSession($sessionFile, $session);
            sendConfirmAsesor($chatId, $firstName);
            notifyAdmin($session, $firstName, $username, '💬 CONTACTO HUMANO');
            break;

        case 'conv_info':
            $session['leads']['conversion'] = 'Solicitó más información';
            saveSession($sessionFile, $session);
            sendInfoGeneral($chatId);
            break;
    }
}

// ============================================================
// MENSAJES DEL FLUJO
// ============================================================

function sendWelcome($chatId, $firstName, $origin) {
    $name       = htmlspecialchars($firstName, ENT_QUOTES);
    $originNote = ($origin === 'web_requinspa') ? ' (desde requinspa.com)' : '';
    $text  = "👋 Bienvenido/a, <b>{$name}</b>{$originNote}.\n\n";
    $text .= "Soy el asistente de <b>Requin &amp; Asociados</b>, firma especializada en arquitectura financiera y legal: reestructuración tributaria, auditoría estratégica, expansión a España y diagnóstico financiero para pymes, holdings y startups en crecimiento.\n\n";
    $text .= "Para orientarle correctamente, necesito hacerle unas preguntas breves. No tomará más de 2 minutos.\n\n";
    $text .= "<b>¿Con qué tipo de empresa o estructura desea trabajar?</b>";

    $keyboard = ['inline_keyboard' => [
        [
            ['text' => '👤 Persona Natural',        'callback_data' => 'seg_natural'],
            ['text' => '🏢 Pyme',                   'callback_data' => 'seg_pyme'],
        ],
        [
            ['text' => '🏛️ Holding Familiar',       'callback_data' => 'seg_holding'],
            ['text' => '🚀 Startup',                'callback_data' => 'seg_startup'],
        ],
        [
            ['text' => '🌍 Expansión Internacional', 'callback_data' => 'seg_expansion'],
            ['text' => '🔵 Otro',                   'callback_data' => 'seg_otro'],
        ],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function askNeed($chatId) {
    $text = "Entendido.\n\n<b>¿Cuál es el área principal que desea evaluar?</b>";
    $keyboard = ['inline_keyboard' => [
        [['text' => '💰 Optimización Tributaria',          'callback_data' => 'need_tributaria']],
        [['text' => '🔍 Auditoría y Control de Gestión',   'callback_data' => 'need_auditoria']],
        [['text' => '🌍 Expansión Internacional / España', 'callback_data' => 'need_internacional']],
        [['text' => '🏗️ Reestructuración Financiera',      'callback_data' => 'need_reestructuracion']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function askPais($chatId) {
    $text = "De acuerdo.\n\n<b>¿En qué país opera actualmente su empresa?</b>\n\n<i>Escríbalo libremente (ej: Chile, España, México...)</i>";
    sendMessage($chatId, $text);
}

function askObjetivo($chatId) {
    $text = "<b>¿Cuál es su objetivo principal en este momento?</b>\n\n<i>Descríbalo brevemente: optimizar impuestos, acceder a financiamiento, expandirse, reestructurar deuda, auditoria, etc.</i>";
    sendMessage($chatId, $text);
}

function askEtapa($chatId) {
    $text = "Gracias por la información.\n\n<b>¿En qué etapa se encuentra su empresa o proyecto?</b>";
    $keyboard = ['inline_keyboard' => [
        [['text' => '📐 Planificación / Pre-operación',          'callback_data' => 'etapa_planeando']],
        [['text' => '⚙️ En operación',                           'callback_data' => 'etapa_operando']],
        [['text' => '📈 En crecimiento / expansión',             'callback_data' => 'etapa_creciendo']],
        [['text' => '🔄 Reestructuración / situación compleja',  'callback_data' => 'etapa_crisis']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function askUrgencia($chatId) {
    $text = "<b>¿Con qué urgencia requiere orientación profesional?</b>";
    $keyboard = ['inline_keyboard' => [
        [['text' => '🔴 Urgente — esta semana', 'callback_data' => 'urg_esta_semana']],
        [['text' => '🟡 Próximas semanas',       'callback_data' => 'urg_pronto']],
        [['text' => '🟢 Explorando opciones',    'callback_data' => 'urg_explorando']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function askConversion($chatId) {
    $text  = "Gracias por compartir esa información.\n\n";
    $text .= "Con base en su perfil, un asesor de <b>Requin &amp; Asociados</b> puede orientarle directamente.\n\n";
    $text .= "<b>¿Cómo desea continuar?</b>";
    $keyboard = ['inline_keyboard' => [
        [['text' => '📅 Solicitar reunión inicial',     'callback_data' => 'conv_reunion']],
        [['text' => '💬 Hablar con un asesor ahora',   'callback_data' => 'conv_asesor']],
        [['text' => 'ℹ️ Ver más información primero',  'callback_data' => 'conv_info']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function sendConfirmReunion($chatId, $firstName) {
    $name  = htmlspecialchars($firstName, ENT_QUOTES);
    $text  = "✅ <b>Reunión solicitada, {$name}.</b>\n\n";
    $text .= "Un asesor de Requin &amp; Asociados revisará su caso y se pondrá en contacto con usted en las próximas horas hábiles.\n\n";
    $text .= "Mientras tanto puede visitar: <a href=\"https://requinspa.com\">requinspa.com</a>\n\n";
    $text .= "<i>Gracias por confiar en Requin &amp; Asociados.</i>";
    sendMessage($chatId, $text);
}

function sendConfirmAsesor($chatId, $firstName) {
    $name  = htmlspecialchars($firstName, ENT_QUOTES);
    $text  = "💬 <b>Solicitud recibida, {$name}.</b>\n\n";
    $text .= "Un asesor de Requin &amp; Asociados tomará contacto con usted a la brevedad a través de este mismo chat de Telegram.\n\n";
    $text .= "<i>Gracias por su interés.</i>";
    sendMessage($chatId, $text);
}

function sendInfoGeneral($chatId) {
    $text  = "<b>Requin &amp; Asociados — Áreas de especialidad</b>\n\n";
    $text .= "🏗️ <b>Reestructuración financiera y tributaria:</b> Rediseño de estructuras para mejorar eficiencia fiscal, control y capacidad de crecimiento.\n\n";
    $text .= "🌍 <b>Expansión internacional:</b> Asesoría para operar en España y otros mercados, adaptando estructura, normativa y divisa.\n\n";
    $text .= "🔍 <b>Auditoría y control de gestión:</b> Detección de fugas de capital, revisión de consistencia financiera y controles internos.\n\n";
    $text .= "💰 <b>Optimización tributaria:</b> Diagnóstico y rediseño de obligaciones para minimizar carga fiscal legalmente.\n\n";
    $text .= "Para agendar una sesión inicial: /asesor";
    sendMessage($chatId, $text);
}

function requestAsesor($chatId, $session, $sessionFile, $firstName, $username) {
    $text  = "Hemos registrado su solicitud.\n\n";
    $text .= "Un asesor de <b>Requin &amp; Asociados</b> se pondrá en contacto con usted a la brevedad.";
    sendMessage($chatId, $text);
    $session['leads']['conversion'] = 'Solicitud directa /asesor';
    saveSession($sessionFile, $session);
    notifyAdmin($session, $firstName, $username, '🆘 SOLICITUD DIRECTA /asesor');
}

function sendServiciosMenu($chatId) {
    $text  = "<b>Servicios Requin &amp; Asociados</b>\n\n";
    $text .= "/auditoria — Auditoría y control de gestión\n";
    $text .= "/espana — Expansión a España\n";
    $text .= "/honorarios — Modelo de trabajo y honorarios\n";
    $text .= "/nda — Política de confidencialidad\n";
    $text .= "/contacto — Datos de contacto\n";
    $text .= "/asesor — Solicitar contacto con un asesor";
    sendMessage($chatId, $text);
}

function sendEspanaInfo($chatId) {
    $text  = "🌍 <b>Expansión a España</b>\n\n";
    $text .= "Requin asesora la expansión de empresas latinoamericanas hacia España y otros mercados europeos, adaptando la estructura societaria, fiscal y operativa a la normativa local.\n\n";
    $text .= "<b>Áreas de trabajo:</b>\n";
    $text .= "• Constitución de sociedades en España\n";
    $text .= "• Estructura fiscal eficiente (régimen ETVE, holding, etc.)\n";
    $text .= "• Adaptación a normativa europea\n";
    $text .= "• Apertura bancaria y tesorería internacional\n\n";
    $text .= "Para evaluar su caso: /asesor";
    sendMessage($chatId, $text);
}

function sendAuditoriaInfo($chatId) {
    $text  = "🔍 <b>Auditoría y Control de Gestión</b>\n\n";
    $text .= "Revisamos la consistencia financiera de su empresa, detectamos fugas de capital y proponemos controles de gestión efectivos.\n\n";
    $text .= "Ideal para empresas que necesitan ordenar sus finanzas antes de crecer, acceder a financiamiento o preparar una due diligence.\n\n";
    $text .= "Para agendar una sesión inicial: /asesor";
    sendMessage($chatId, $text);
}

function sendHonorariosInfo($chatId) {
    $text  = "💼 <b>Modelo de Trabajo y Honorarios</b>\n\n";
    $text .= "Requin &amp; Asociados trabaja con modelos adaptados a cada etapa:\n\n";
    $text .= "• <b>Diagnóstico inicial:</b> sesión de evaluación estratégica\n";
    $text .= "• <b>Proyectos acotados:</b> alcance y precio definido\n";
    $text .= "• <b>Modelo mensual:</b> acompañamiento continuo\n";
    $text .= "• <b>Éxito compartido:</b> según caso y objetivos\n\n";
    $text .= "Los modelos se definen previa evaluación del caso. Para más detalles: /asesor";
    sendMessage($chatId, $text);
}

function sendNdaInfo($chatId) {
    $text  = "🔒 <b>Confidencialidad y NDA</b>\n\n";
    $text .= "Requin &amp; Asociados opera bajo estrictos estándares de confidencialidad. Toda información compartida en sesiones de diagnóstico o trabajo continuo está protegida bajo acuerdo de confidencialidad (NDA).\n\n";
    $text .= "La firma no divulga información de clientes ni de sus estructuras bajo ninguna circunstancia.";
    sendMessage($chatId, $text);
}

function sendContactoInfo($chatId) {
    $text  = "📋 <b>Datos de contacto</b>\n\n";
    $text .= "🌐 Web: <a href=\"https://requinspa.com\">requinspa.com</a>\n";
    $text .= "📧 Email: contacto@requinspa.com\n";
    $text .= "🇨🇱 Chile: +56 9 9326 0101\n";
    $text .= "🇪🇸 España: +34 682 02 8354\n\n";
    $text .= "También puede solicitar contacto directo: /asesor";
    sendMessage($chatId, $text);
}

// ============================================================
// NOTIFICACIÓN AL ADMINISTRADOR
// ============================================================
function notifyAdmin($session, $firstName, $username, $tipo) {
    $leads    = $session['leads'] ?? [];
    $origin   = $session['origin'] ?? 'desconocido';
    $userTag  = $username ? "@{$username}" : '(sin usuario público)';

    $text  = "🔔 <b>NUEVO LEAD — REQUIN &amp; ASOCIADOS</b>\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "📌 <b>Tipo:</b> " . htmlspecialchars($tipo)                                     . "\n";
    $text .= "🌐 <b>Origen:</b> " . htmlspecialchars($origin)                                 . "\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "👤 <b>Nombre:</b> "       . htmlspecialchars($firstName)                        . "\n";
    $text .= "💬 <b>Telegram:</b> "     . htmlspecialchars($userTag)                          . "\n";
    $text .= "🏢 <b>Segmento:</b> "     . htmlspecialchars($leads['segmento']   ?? '—')       . "\n";
    $text .= "🎯 <b>Necesidad:</b> "    . htmlspecialchars($leads['necesidad']   ?? '—')       . "\n";
    $text .= "🌍 <b>País:</b> "         . htmlspecialchars($leads['pais']        ?? '—')       . "\n";
    $text .= "📝 <b>Objetivo:</b> "     . htmlspecialchars($leads['objetivo']    ?? '—')       . "\n";
    $text .= "📊 <b>Etapa:</b> "        . htmlspecialchars($leads['etapa']       ?? '—')       . "\n";
    $text .= "⏱️ <b>Urgencia:</b> "     . htmlspecialchars($leads['urgencia']    ?? '—')       . "\n";
    $text .= "✅ <b>Conversión:</b> "   . htmlspecialchars($leads['conversion']  ?? '—')       . "\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "<i>Lead automático — requinspa.com</i>";

    sendMessage(ADMIN_CHAT_ID, $text);
}

// ============================================================
// FUNCIONES BASE — TELEGRAM API
// ============================================================
function sendMessage($chatId, $text, $keyboard = null, $parseMode = 'HTML') {
    $data = [
        'chat_id'    => $chatId,
        'text'       => $text,
        'parse_mode' => $parseMode,
    ];
    if ($keyboard) {
        $data['reply_markup'] = json_encode($keyboard);
    }
    telegramRequest('sendMessage', $data);
}

function answerCallbackQuery($callbackId) {
    telegramRequest('answerCallbackQuery', ['callback_query_id' => $callbackId]);
}

function telegramRequest($method, $data) {
    $url = TELEGRAM_API . $method;
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $data,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

function saveSession($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
