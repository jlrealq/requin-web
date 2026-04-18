<?php
// ============================================================
// REQUIN & ASOCIADOS — Bot Telegram de Pre-Calificación
// Versión 2.0 — Con instrucciones de sistema completas
// URL: https://www.requinspa.com/telegram/telegram-webhook.php
// ============================================================

// ---- CONFIGURACIÓN ----
define('BOT_TOKEN',      '8603881267:AAH03oaJqV4f30KXJXhfif2Cj9vfB8iwY0g');
define('ADMIN_CHAT_ID',  '2130037013');
define('WEBHOOK_SECRET', 'ReQu1n_W3bh00k_S3cr3t_2025');
define('SESSIONS_DIR',   __DIR__ . '/sessions/');
define('TELEGRAM_API',   'https://api.telegram.org/bot' . BOT_TOKEN . '/');

// ---- SEGURIDAD ----
$headers = function_exists('getallheaders') ? getallheaders() : [];
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
if (!$input) { http_response_code(200); exit(); }

$isCallback = isset($input['callback_query']);
$isMessage  = isset($input['message']);

if ($isCallback) {
    $chatId       = $input['callback_query']['from']['id'];
    $firstName    = $input['callback_query']['from']['first_name'] ?? '';
    $username     = $input['callback_query']['from']['username']   ?? '';
    $callbackData = $input['callback_query']['data'];
    $callbackId   = $input['callback_query']['id'];
    $text         = '';
    answerCallbackQuery($callbackId);
} elseif ($isMessage) {
    $chatId    = $input['message']['chat']['id'];
    $firstName = $input['message']['from']['first_name'] ?? '';
    $username  = $input['message']['from']['username']   ?? '';
    $text      = $input['message']['text'] ?? '';
    $callbackData = '';
} else {
    http_response_code(200); exit();
}

// ---- SESIÓN ----
if (!is_dir(SESSIONS_DIR)) { @mkdir(SESSIONS_DIR, 0755, true); }
$sessionFile = SESSIONS_DIR . $chatId . '.json';
$session     = file_exists($sessionFile)
    ? (json_decode(file_get_contents($sessionFile), true) ?? [])
    : [];

// ---- ARRANQUE CON /start ----
if ($isMessage && strpos($text, '/start') === 0) {
    $parts  = explode(' ', $text, 2);
    $origin = $parts[1] ?? 'directo';
    $session = [
        'state'  => 'AWAITING_SEGMENT',
        'origin' => $origin,
        'leads'  => ['nombre' => $firstName],
    ];
    saveSession($sessionFile, $session);
    sendWelcome($chatId, $firstName, $origin);
    http_response_code(200); exit();
}

$state = $session['state'] ?? 'AWAITING_SEGMENT';

if ($isCallback) {
    handleCallback($chatId, $callbackData, $session, $sessionFile, $firstName, $username);
} elseif ($isMessage) {
    handleMessage($chatId, $text, $state, $session, $sessionFile, $firstName, $username);
}

http_response_code(200); exit();

// ============================================================
// MANEJO DE MENSAJES DE TEXTO
// ============================================================
function handleMessage($chatId, $text, $state, &$session, $sessionFile, $firstName, $username) {

    // ── Comandos rápidos ──────────────────────────────────
    $cmd = strtolower(explode('@', $text)[0]);
    switch ($cmd) {
        case '/servicios':  sendServiciosMenu($chatId);                                          return;
        case '/espana':     sendEspanaInfo($chatId, $session, $sessionFile);                     return;
        case '/auditoria':  sendAuditoriaInfo($chatId, $session, $sessionFile);                  return;
        case '/honorarios': sendHonorariosInfo($chatId);                                         return;
        case '/nda':        sendNdaInfo($chatId);                                                return;
        case '/contacto':   sendContactoInfo($chatId);                                           return;
        case '/asesor':     requestAsesor($chatId, $session, $sessionFile, $firstName, $username); return;
    }

    // ── Captura de campos según estado actual ─────────────
    switch ($state) {

        case 'AWAITING_EMPRESA':
            $session['leads']['empresa'] = $text;
            $session['state']            = 'AWAITING_NEED';
            saveSession($sessionFile, $session);
            askNeed($chatId);
            return;

        case 'AWAITING_PAIS':
            $session['leads']['pais'] = $text;
            $session['state']         = 'AWAITING_OBJETIVO';
            saveSession($sessionFile, $session);
            askObjetivo($chatId);
            return;

        case 'AWAITING_OBJETIVO':
            $session['leads']['objetivo'] = $text;
            $session['state']             = 'AWAITING_ETAPA';
            saveSession($sessionFile, $session);
            askEtapa($chatId);
            return;

        default:
            // ── Clasificación de intención libre ─────────
            handleFreeText($chatId, $text, $state, $session, $sessionFile, $firstName, $username);
    }
}

// ============================================================
// CLASIFICACIÓN DE TEXTO LIBRE
// ============================================================
function handleFreeText($chatId, $text, $state, &$session, $sessionFile, $firstName, $username) {

    $lower = mb_strtolower($text, 'UTF-8');

    // Honorarios / precio / costo
    if (containsAny($lower, ['honorario', 'precio', 'costo', 'cobran', 'cuánto vale', 'cuanto cuesta', 'tarifa', 'fee'])) {
        sendHonorariosInfo($chatId);
        return;
    }

    // España / expansión
    if (containsAny($lower, ['españa', 'espana', 'españa', 'expansión', 'expansion', 'europa', 'madrid', 'barcelona'])) {
        sendEspanaInfo($chatId, $session, $sessionFile);
        return;
    }

    // Auditoría / control
    if (containsAny($lower, ['auditor', 'control', 'fuga', 'revisión', 'revision', 'inconsistencia', 'finanza'])) {
        sendAuditoriaInfo($chatId, $session, $sessionFile);
        return;
    }

    // Confidencial / NDA
    if (containsAny($lower, ['confidencial', 'nda', 'secreto', 'privacidad', 'privado', 'discreción'])) {
        sendNdaInfo($chatId);
        return;
    }

    // Contacto / asesor / reunión
    if (containsAny($lower, ['asesor', 'reunión', 'reunion', 'contacto', 'hablar', 'llamada', 'agendar'])) {
        requestAsesor($chatId, $session, $sessionFile, $firstName, $username);
        return;
    }

    // Tributario / impuestos
    if (containsAny($lower, ['tributari', 'impuesto', 'renta', 'iva', 'sii', 'fiscal', 'agip', 'sat', 'sunat'])) {
        $text  = "La optimización tributaria es una de las áreas centrales de Requin &amp; Asociados.\n\n";
        $text .= "Para orientarle correctamente, ¿podría indicar brevemente su situación? Por ejemplo: tipo de empresa, país y qué aspecto tributario desea revisar.\n\n";
        $text .= "También puede escribir /asesor para derivar directamente con un especialista.";
        sendMessage($chatId, $text);
        return;
    }

    // Holding / estructura
    if (containsAny($lower, ['holding', 'estructura', 'sociedad', 'filial', 'matriz', 'grupo empresa'])) {
        $text  = "La estructuración y optimización de holdings es parte del trabajo de Requin &amp; Asociados.\n\n";
        $text .= "Para evaluarlo correctamente, ¿qué tipo de empresa o grupo tiene actualmente y en qué país opera?\n\n";
        $text .= "Puede continuar aquí o escribir /asesor para contactar directamente con el equipo.";
        sendMessage($chatId, $text);
        return;
    }

    // Pregunta muy técnica (reconocida por longitud o términos específicos)
    if (mb_strlen($text, 'UTF-8') > 180 || containsAny($lower, ['beneficiario final', 'doble imposición', 'treaty', 'cfc', 'base erosion', 'ocde', 'beps'])) {
        $text  = "Su consulta requiere un análisis formal para responderla con precisión.\n\n";
        $text .= "El equipo de Requin &amp; Asociados puede revisarla directamente. Le recomendamos una <b>sesión inicial de diagnóstico</b>, sin compromiso.\n\n";
        $text .= "¿Desea agendar esa reunión? Escriba /asesor o pulse el botón de abajo.";
        $keyboard = ['inline_keyboard' => [[['text' => '📅 Solicitar reunión inicial', 'callback_data' => 'conv_reunion']]]];
        sendMessage($chatId, $text, $keyboard);
        return;
    }

    // Guardar como mensaje libre y relanzar flujo
    $session['leads']['mensaje_libre'] = $text;
    saveSession($sessionFile, $session);

    // Si ya están avanzados en el flujo, continuar donde estaban
    if (in_array($state, ['AWAITING_SEGMENT', 'START'])) {
        $session['state'] = 'AWAITING_SEGMENT';
        saveSession($sessionFile, $session);
        $reply  = "Recibí su mensaje. Para orientarle correctamente, necesito conocer su perfil.\n\n";
        $reply .= "¿Con qué tipo de empresa o estructura trabaja?";
        $keyboard = buildSegmentKeyboard();
        sendMessage($chatId, $reply, $keyboard);
    } else {
        $reply = "Entendido. ¿Desea continuar con el diagnóstico o prefiere contactar directamente con un asesor?";
        $keyboard = ['inline_keyboard' => [
            [['text' => '▶ Continuar diagnóstico', 'callback_data' => 'retomar_flujo']],
            [['text' => '💬 Hablar con un asesor',  'callback_data' => 'conv_asesor']],
        ]];
        sendMessage($chatId, $reply, $keyboard);
    }
}

function containsAny($haystack, $needles) {
    foreach ($needles as $n) {
        if (mb_strpos($haystack, $n, 0, 'UTF-8') !== false) return true;
    }
    return false;
}

// ============================================================
// MANEJO DE CALLBACKS (botones inline)
// ============================================================
function handleCallback($chatId, $data, &$session, $sessionFile, $firstName, $username) {

    // ── Segmento ──────────────────────────────────────────
    $segmentos = [
        'seg_natural'    => 'Persona Natural',
        'seg_pyme'       => 'Pyme',
        'seg_holding'    => 'Holding Familiar',
        'seg_startup'    => 'Startup',
        'seg_expansion'  => 'Expansión Internacional',
        'seg_otro'       => 'Otro',
    ];
    if (isset($segmentos[$data])) {
        $session['leads']['tipo_cliente'] = $segmentos[$data];
        $session['state']                 = 'AWAITING_EMPRESA';
        saveSession($sessionFile, $session);
        $kb = null;
        sendMessage($chatId,
            "Identificado como <b>{$segmentos[$data]}</b>.\n\n¿Cuál es el nombre de su empresa o proyecto? <i>(Si prefiere no indicarlo, escriba «Reservado»)</i>",
            $kb
        );
        return;
    }

    // ── Necesidad ─────────────────────────────────────────
    $necesidades = [
        'need_tributaria'       => 'Optimización Tributaria',
        'need_auditoria'        => 'Auditoría y Control de Gestión',
        'need_internacional'    => 'Expansión Internacional / España',
        'need_reestructuracion' => 'Reestructuración Financiera',
        'need_estrategia'       => 'Evaluación Estratégica',
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
        'etapa_planeando'  => 'Planificación / Pre-operación',
        'etapa_operando'   => 'En operación',
        'etapa_creciendo'  => 'En crecimiento / expansión',
        'etapa_crisis'     => 'Reestructuración / situación compleja',
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
            $session['leads']['desea_reunion'] = 'Sí — reunión inicial solicitada';
            $session['state']                  = 'DONE';
            saveSession($sessionFile, $session);
            sendConfirmReunion($chatId, $firstName);
            notifyAdmin($session, $firstName, $username, '📅 REUNIÓN SOLICITADA');
            break;

        case 'conv_asesor':
            $session['leads']['desea_reunion'] = 'Sí — contacto humano solicitado';
            $session['state']                  = 'DONE';
            saveSession($sessionFile, $session);
            sendConfirmAsesor($chatId, $firstName);
            notifyAdmin($session, $firstName, $username, '💬 CONTACTO HUMANO');
            break;

        case 'conv_info':
            $session['leads']['desea_reunion'] = 'Prefirió ver más información';
            saveSession($sessionFile, $session);
            sendInfoGeneral($chatId);
            break;

        case 'retomar_flujo':
            $state = $session['state'] ?? 'AWAITING_SEGMENT';
            retakeFlujo($chatId, $state, $session);
            break;
    }
}

// Retoma el flujo desde el estado actual
function retakeFlujo($chatId, $state, &$session) {
    switch ($state) {
        case 'AWAITING_SEGMENT':   sendMessage($chatId, "¿Con qué tipo de empresa o estructura trabaja?", buildSegmentKeyboard()); break;
        case 'AWAITING_EMPRESA':   sendMessage($chatId, "¿Cuál es el nombre de su empresa o proyecto?");                           break;
        case 'AWAITING_NEED':      askNeed($chatId);                                                                                break;
        case 'AWAITING_PAIS':      askPais($chatId);                                                                                break;
        case 'AWAITING_OBJETIVO':  askObjetivo($chatId);                                                                            break;
        case 'AWAITING_ETAPA':     askEtapa($chatId);                                                                               break;
        case 'AWAITING_URGENCIA':  askUrgencia($chatId);                                                                            break;
        case 'AWAITING_CONVERSION':askConversion($chatId);                                                                          break;
        default:
            sendMessage($chatId, "Puede continuar escribiendo su consulta o escribir /asesor para hablar con el equipo.");
    }
}

// ============================================================
// MENSAJES DEL FLUJO PRINCIPAL
// ============================================================

function sendWelcome($chatId, $firstName, $origin) {
    $name       = htmlspecialchars($firstName ?: 'estimado/a', ENT_QUOTES);
    $originNote = ($origin === 'web_requinspa') ? ' Hemos registrado que nos visita desde nuestra web.' : '';

    $text  = "Bienvenido/a, <b>{$name}</b>.{$originNote}\n\n";
    $text .= "Soy el asistente de <b>Requin &amp; Asociados</b>. Podemos orientarle en ";
    $text .= "reestructuración tributaria, auditoría estratégica, control de gestión, ";
    $text .= "expansión a España y diagnóstico financiero.\n\n";
    $text .= "Seleccione el área que desea evaluar y le haré unas preguntas breves para derivar su caso.\n";
    $text .= "¿Con qué tipo de empresa o estructura trabaja?";

    sendMessage($chatId, $text, buildSegmentKeyboard());
}

function buildSegmentKeyboard() {
    return ['inline_keyboard' => [
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
}

function askNeed($chatId) {
    $text = "¿Cuál es el área principal que desea evaluar?";
    $keyboard = ['inline_keyboard' => [
        [['text' => '💰 Optimización Tributaria',          'callback_data' => 'need_tributaria']],
        [['text' => '🔍 Auditoría y Control de Gestión',   'callback_data' => 'need_auditoria']],
        [['text' => '🌍 Expansión Internacional / España', 'callback_data' => 'need_internacional']],
        [['text' => '🏗️ Reestructuración Financiera',      'callback_data' => 'need_reestructuracion']],
        [['text' => '📊 Evaluación Estratégica',           'callback_data' => 'need_estrategia']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function askPais($chatId) {
    sendMessage($chatId,
        "¿En qué país opera actualmente su empresa?\n<i>Escríbalo directamente (ej: Chile, México, España...)</i>"
    );
}

function askObjetivo($chatId) {
    sendMessage($chatId,
        "¿Cuál es su objetivo principal en este momento?\n\n".
        "<i>Descríbalo brevemente: optimizar carga fiscal, acceder a financiamiento, ".
        "internacionalizar, reestructurar, auditar, otro.</i>"
    );
}

function askEtapa($chatId) {
    $text = "¿En qué etapa se encuentra su empresa o proyecto?";
    $keyboard = ['inline_keyboard' => [
        [['text' => '📐 Planificación / Pre-operación',         'callback_data' => 'etapa_planeando']],
        [['text' => '⚙️ En operación',                          'callback_data' => 'etapa_operando']],
        [['text' => '📈 En crecimiento / expansión',            'callback_data' => 'etapa_creciendo']],
        [['text' => '🔄 Reestructuración / situación compleja', 'callback_data' => 'etapa_crisis']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function askUrgencia($chatId) {
    $text = "¿Con qué urgencia requiere orientación profesional?";
    $keyboard = ['inline_keyboard' => [
        [['text' => '🔴 Urgente — esta semana', 'callback_data' => 'urg_esta_semana']],
        [['text' => '🟡 Próximas semanas',       'callback_data' => 'urg_pronto']],
        [['text' => '🟢 Explorando opciones',    'callback_data' => 'urg_explorando']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function askConversion($chatId) {
    $text  = "Con base en la información recibida, un asesor de Requin &amp; Asociados ";
    $text .= "puede revisar su caso y orientarle en la dirección correcta.\n\n";
    $text .= "<b>¿Cómo prefiere continuar?</b>";
    $keyboard = ['inline_keyboard' => [
        [['text' => '📅 Solicitar reunión inicial',    'callback_data' => 'conv_reunion']],
        [['text' => '💬 Hablar con un asesor ahora',  'callback_data' => 'conv_asesor']],
        [['text' => 'ℹ️ Ver más información primero', 'callback_data' => 'conv_info']],
    ]];
    sendMessage($chatId, $text, $keyboard);
}

function sendConfirmReunion($chatId, $firstName) {
    $name  = htmlspecialchars($firstName ?: 'estimado/a', ENT_QUOTES);
    $text  = "✅ <b>Solicitud registrada, {$name}.</b>\n\n";
    $text .= "El equipo de Requin &amp; Asociados revisará su caso y se pondrá en contacto ";
    $text .= "en las próximas horas hábiles para confirmar la sesión inicial.\n\n";
    $text .= "<i>Agradecemos su interés. Requin &amp; Asociados.</i>";
    sendMessage($chatId, $text);
}

function sendConfirmAsesor($chatId, $firstName) {
    $name  = htmlspecialchars($firstName ?: 'estimado/a', ENT_QUOTES);
    $text  = "💬 <b>Solicitud recibida, {$name}.</b>\n\n";
    $text .= "Un asesor tomará contacto con usted a través de este chat en breve.\n\n";
    $text .= "<i>Agradecemos su confianza. Requin &amp; Asociados.</i>";
    sendMessage($chatId, $text);
}

// ============================================================
// RESPUESTAS ESPECÍFICAS POR ÁREA
// ============================================================

function sendServiciosMenu($chatId) {
    $text  = "<b>Áreas de especialidad — Requin &amp; Asociados</b>\n\n";
    $text .= "/auditoria — Auditoría y control de gestión\n";
    $text .= "/espana — Expansión a España\n";
    $text .= "/honorarios — Modelo de trabajo\n";
    $text .= "/nda — Confidencialidad\n";
    $text .= "/contacto — Datos de contacto\n";
    $text .= "/asesor — Hablar con un asesor";
    sendMessage($chatId, $text);
}

function sendEspanaInfo($chatId, &$session = [], $sessionFile = null) {
    $text  = "🌍 <b>Expansión a España</b>\n\n";
    $text .= "Requin asesora la estructuración y expansión de empresas hacia España, adaptando ";
    $text .= "forma jurídica, régimen fiscal y operativa a la normativa local.\n\n";
    $text .= "Para evaluar su caso, ¿podría indicar: país actual de operación, tipo de empresa y objetivo principal?";
    sendMessage($chatId, $text);

    // Si está en flujo activo, marcamos necesidad
    if (!empty($session) && isset($session['leads'])) {
        $session['leads']['necesidad'] = $session['leads']['necesidad'] ?? 'Expansión Internacional / España';
        if ($sessionFile) saveSession($sessionFile, $session);
    }
}

function sendAuditoriaInfo($chatId, &$session = [], $sessionFile = null) {
    $text  = "🔍 <b>Auditoría y Control de Gestión</b>\n\n";
    $text .= "Revisamos consistencia financiera, detectamos fugas de capital y proponemos ";
    $text .= "controles internos efectivos.\n\n";
    $text .= "Para orientarle, ¿podría describir brevemente el contexto, síntomas del problema ";
    $text .= "y tamaño aproximado de la operación?";
    sendMessage($chatId, $text);

    if (!empty($session) && isset($session['leads'])) {
        $session['leads']['necesidad'] = $session['leads']['necesidad'] ?? 'Auditoría y Control de Gestión';
        if ($sessionFile) saveSession($sessionFile, $session);
    }
}

function sendHonorariosInfo($chatId) {
    $text  = "💼 <b>Honorarios y Modelo de Trabajo</b>\n\n";
    $text .= "Los honorarios dependen del alcance, complejidad, riesgo, jurisdicción y etapa del proyecto. ";
    $text .= "Requin &amp; Asociados trabaja con modelos adaptados: diagnóstico inicial, proyecto acotado, ";
    $text .= "retención mensual o esquema de éxito compartido.\n\n";
    $text .= "Los detalles se definen en la sesión inicial tras evaluar el caso. ¿Desea agendar esa reunion? /asesor";
    sendMessage($chatId, $text);
}

function sendNdaInfo($chatId) {
    $text  = "🔒 <b>Confidencialidad</b>\n\n";
    $text .= "El equipo de Requin &amp; Asociados puede trabajar bajo acuerdo de confidencialidad (NDA) ";
    $text .= "cuando el caso así lo requiere. Toda información compartida en las sesiones de diagnóstico ";
    $text .= "se trata con la máxima discreción.\n\n";
    $text .= "Si desea formalizar un NDA antes de compartir detalles, indíquelo al asesor: /asesor";
    sendMessage($chatId, $text);
}

function sendContactoInfo($chatId) {
    $text  = "📋 <b>Datos de contacto</b>\n\n";
    $text .= "🌐 <a href=\"https://requinspa.com\">requinspa.com</a>\n";
    $text .= "📧 contacto@requinspa.com\n";
    $text .= "🇨🇱 +56 9 9326 0101\n";
    $text .= "🇪🇸 +34 682 02 8354\n\n";
    $text .= "O inicie el diagnóstico directamente: /asesor";
    sendMessage($chatId, $text);
}

function sendInfoGeneral($chatId) {
    $text  = "<b>Requin &amp; Asociados — Áreas de especialidad</b>\n\n";
    $text .= "🏗️ <b>Reestructuración financiera y tributaria</b>\n";
    $text .= "Rediseño de estructuras para mejorar eficiencia fiscal y capacidad de crecimiento.\n\n";
    $text .= "🌍 <b>Expansión internacional</b>\n";
    $text .= "Estructuración para operar en España y otros mercados, adaptando normativa y divisa.\n\n";
    $text .= "🔍 <b>Auditoría y control de gestión</b>\n";
    $text .= "Detección de fugas de capital y revisión de consistencia financiera.\n\n";
    $text .= "Para iniciar un diagnóstico: /asesor";
    sendMessage($chatId, $text);
}

function requestAsesor($chatId, $session, $sessionFile, $firstName, $username) {
    $session['leads']['desea_reunion'] = 'Sí — solicitud directa /asesor';
    $session['leads']['conversion']    = 'Solicitud directa /asesor';
    saveSession($sessionFile, $session);

    $text  = "Hemos registrado su solicitud.\n\n";
    $text .= "Un asesor de <b>Requin &amp; Asociados</b> se pondrá en contacto con usted a la brevedad.\n\n";
    $text .= "<i>Agradecemos su interés. Requin &amp; Asociados.</i>";
    sendMessage($chatId, $text);
    notifyAdmin($session, $firstName, $username, '🆘 SOLICITUD DIRECTA /asesor');
}

// ============================================================
// NOTIFICACIÓN AL ADMINISTRADOR
// ============================================================
function notifyAdmin($session, $firstName, $username, $tipo) {
    $leads   = $session['leads'] ?? [];
    $origin  = $session['origin'] ?? 'desconocido';
    $userTag = $username ? "@{$username}" : '(sin usuario público)';

    $text  = "🔔 <b>NUEVO LEAD — REQUIN &amp; ASOCIADOS</b>\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "📌 <b>Tipo:</b> "          . htmlspecialchars($tipo)                              . "\n";
    $text .= "🌐 <b>Origen:</b> "        . htmlspecialchars($origin)                            . "\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "👤 <b>Nombre:</b> "        . htmlspecialchars($leads['nombre']       ?? $firstName ?? '—') . "\n";
    $text .= "🏢 <b>Empresa:</b> "       . htmlspecialchars($leads['empresa']      ?? '—')      . "\n";
    $text .= "💬 <b>Telegram:</b> "      . htmlspecialchars($userTag)                           . "\n";
    $text .= "🏢 <b>Tipo cliente:</b> "  . htmlspecialchars($leads['tipo_cliente'] ?? '—')      . "\n";
    $text .= "🌍 <b>País:</b> "          . htmlspecialchars($leads['pais']         ?? '—')      . "\n";
    $text .= "🎯 <b>Necesidad:</b> "     . htmlspecialchars($leads['necesidad']    ?? '—')      . "\n";
    $text .= "📝 <b>Objetivo:</b> "      . htmlspecialchars($leads['objetivo']     ?? '—')      . "\n";
    $text .= "📊 <b>Etapa:</b> "         . htmlspecialchars($leads['etapa']        ?? '—')      . "\n";
    $text .= "⏱️ <b>Urgencia:</b> "      . htmlspecialchars($leads['urgencia']     ?? '—')      . "\n";
    $text .= "✅ <b>¿Reunión?:</b> "     . htmlspecialchars($leads['desea_reunion']?? '—')      . "\n";
    $text .= "💬 <b>Msg libre:</b> "     . htmlspecialchars($leads['mensaje_libre']?? '—')      . "\n";
    $text .= "━━━━━━━━━━━━━━━━━━━━━━\n";
    $text .= "<i>Requin Bot — Lead automático</i>";

    sendMessage(ADMIN_CHAT_ID, $text);
}

// ============================================================
// FUNCIONES BASE — TELEGRAM API
// ============================================================
function sendMessage($chatId, $text, $keyboard = null, $parseMode = 'HTML') {
    $data = ['chat_id' => $chatId, 'text' => $text, 'parse_mode' => $parseMode];
    if ($keyboard) { $data['reply_markup'] = json_encode($keyboard); }
    telegramRequest('sendMessage', $data);
}

function answerCallbackQuery($callbackId) {
    telegramRequest('answerCallbackQuery', ['callback_query_id' => $callbackId]);
}

function telegramRequest($method, $data) {
    $ch = curl_init(TELEGRAM_API . $method);
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
