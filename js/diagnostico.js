// Requin Financial Architecture Simulator Logic

// --- Constants & Baselines ---
const INDUSTRIES = {
    retail: { name: "Comercio / Retail", baseMargin: 0.12, optimalMargin: 0.18 },
    services: { name: "Servicios Profesionales", baseMargin: 0.25, optimalMargin: 0.35 },
    transport: { name: "Transporte y Logística", baseMargin: 0.10, optimalMargin: 0.15 },
    real_estate: { name: "Inmobiliario / Construcción", baseMargin: 0.15, optimalMargin: 0.22 },
    technology: { name: "Tecnología / SaaS", baseMargin: 0.20, optimalMargin: 0.30 },
    manufacturing: { name: "Manufactura / Industrial", baseMargin: 0.12, optimalMargin: 0.18 },
    healthcare: { name: "Salud / Médico", baseMargin: 0.18, optimalMargin: 0.25 },
    other: { name: "Otro Sector", baseMargin: 0.15, optimalMargin: 0.22 }
};

const TAX_REGIMES = {
    '14a': { name: "14 A - Semi Integrado", efficiencyFactor: 0.9 }, // Standard, good for large corps
    '14d3': { name: "14 D3 - Pro Pyme General", efficiencyFactor: 1.1 }, // Great incentives
    '14d8': { name: "14 D8 - Pro Pyme Transparente", efficiencyFactor: 1.2 }, // Best for cash flow
    'unk': { name: "Desconocido", efficiencyFactor: 0.7 } // Penalty for lack of knowledge
};

// --- State ---
let state = {
    industry: 'services',
    taxRegime: '14a',
    revenue: 500000000,
    margin: 0.15
};

// --- Formatting Helper ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
};

// --- Core Calculation ---
function calculate() {
    // 1. Get Inputs
    state.industry = document.getElementById('inputIndustry').value;
    state.taxRegime = document.getElementById('inputTaxRegime').value;
    state.revenue = parseInt(document.getElementById('inputIncome').value);
    state.margin = parseInt(document.getElementById('inputMargin').value) / 100;

    // 2. Logic
    const industryData = INDUSTRIES[state.industry];
    const regimeData = TAX_REGIMES[state.taxRegime];

    // Current Profit
    const currentProfit = state.revenue * state.margin;

    // Optimal Scenario Logic
    // Efficiency Score based on Margin Gap + Regime Factor
    let marginGapScore = state.margin / industryData.optimalMargin; // 0.5 to 1.0+
    if (marginGapScore > 1) marginGapScore = 1;

    let efficiencyScore = (marginGapScore * 0.7) + (regimeData.efficiencyFactor * 0.3);
    if (efficiencyScore > 1) efficiencyScore = 0.95; // Cap at 95% unless perfect
    if (efficiencyScore < 0.2) efficiencyScore = 0.2; // Floor

    const efficiencyPercentage = Math.round(efficiencyScore * 100);

    // Capital Recovery Calculation
    // The "Gap" between current and optimal, adjusted by revenue scale
    const potentialMargin = industryData.optimalMargin;
    const profitGap = (potentialMargin - state.margin) * state.revenue;

    // We confirm at least some optimization is always possible (consultant logic)
    // Minimum 5% of revenue improvement if already optimized
    let recoverableCapital = Math.max(profitGap, state.revenue * 0.05);

    // Cap recoverable to realistic bounds (e.g. max 20% of revenue)
    recoverableCapital = Math.min(recoverableCapital, state.revenue * 0.20);

    const optimizedProfit = currentProfit + recoverableCapital;


    // 3. Update DOM
    document.getElementById('displayIncome').innerText = formatCurrency(state.revenue);
    document.getElementById('displayMargin').innerText = (state.margin * 100).toFixed(0) + '%';

    document.getElementById('savings-display').innerText = "+" + formatCurrency(recoverableCapital);
    document.getElementById('profit-current').innerText = formatCurrency(currentProfit);
    document.getElementById('profit-optimized').innerText = formatCurrency(optimizedProfit);

    document.getElementById('efficiency-score').innerText = efficiencyPercentage + '%';

    // Update Gauge/Circle
    // Circumference is 2 * PI * r (r=45) ~= 283
    const circumference = 283;
    const offset = circumference - (efficiencyScore * circumference);
    document.getElementById('score-circle').style.strokeDashoffset = offset;

    // Color logic for score
    const circle = document.getElementById('score-circle');
    const scoreText = document.getElementById('score-text');

    if (efficiencyPercentage < 50) {
        circle.setAttribute('stroke', '#ef4444'); // Red
        scoreText.innerText = "Crítico - Acción Inmediata";
        scoreText.className = "text-xs mt-2 font-bold uppercase text-red-500";
    } else if (efficiencyPercentage < 75) {
        circle.setAttribute('stroke', '#eab308'); // Yellow
        scoreText.innerText = "Mejorable - Oportunidad";
        scoreText.className = "text-xs mt-2 font-bold uppercase text-yellow-500";
    } else {
        circle.setAttribute('stroke', '#22c55e'); // Green
        scoreText.innerText = "Saludable - Optimización Fina";
        scoreText.className = "text-xs mt-2 font-bold uppercase text-green-500";
    }
}

// --- PDF Generation ---
async function generatePDF(event) {
    event.preventDefault();
    const { jsPDF } = window.jspdf;

    const leadName = document.getElementById('leadName').value;
    const leadEmail = document.getElementById('leadEmail').value;

    if (!leadName || !leadEmail) {
        alert("Por favor complete sus datos para generar el informe.");
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // -- Header --
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(202, 138, 4); // Yellow 600
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("REQUIN & ASOCIADOS", 20, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("ARQUITECTURA FINANCIERA & LEGAL", 20, 28);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("INFORME CONFIDENCIAL", pageWidth - 60, 20);
    doc.text(new Date().toLocaleDateString(), pageWidth - 60, 28);

    // -- Title & Client --
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`DIAGNÓSTICO PRELIMINAR: ${leadName.toUpperCase()}`, 20, 60);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Resumen Ejecutivo de Valuación y Eficiencia Fiscal", 20, 68);

    // -- Section 1: Perfil --
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, pageWidth - 20, 75);

    doc.setFontSize(11);
    doc.text(`Industria: ${INDUSTRIES[state.industry].name}`, 20, 85);
    doc.text(`Régimen Tributario: ${TAX_REGIMES[state.taxRegime].name}`, 20, 92);
    doc.text(`Facturación Anual: ${formatCurrency(state.revenue)}`, 120, 85);

    // -- Section 2: Hallazgos (The Hook) --
    doc.setFillColor(248, 250, 252); // Light gray bg
    doc.rect(20, 105, pageWidth - 40, 50, 'F');

    doc.setTextColor(202, 138, 4);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CAPITAL RECUPERABLE PROYECTADO", 30, 120);

    const savings = document.getElementById('savings-display').innerText;
    doc.setFontSize(24);
    doc.setTextColor(22, 163, 74); // Green
    doc.text(savings, 30, 135);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("*Monto anual estimado disponible mediante optimización.", 30, 145);

    // -- Section 3: Recomendaciones --
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text("RECOMENDACIONES ESTRATÉGICAS", 20, 175);

    const recommendations = [
        ["1. Revisión de Estructura Societaria", "Evaluar separación de activos (Holdings) para proteger el patrimonio y optimizar la carga global."],
        ["2. Auditoría de Beneficios Tributarios", `Verificar aplicabilidad de incentivos específicos para el sector ${INDUSTRIES[state.industry].name}.`],
        ["3. Ingeniería de Flujo de Caja", "Implementación de estrategias de liquidez y reinversión bajo normativa 14 D."]
    ];

    doc.autoTable({
        startY: 185,
        head: [['Área', 'Acción Recomendada']],
        body: recommendations,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
    });

    // -- Footer --
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("AGENDE SU SESIÓN DE PROFUNDIDAD", pageWidth / 2, pageHeight - 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text("contacto@requin.cl | +56 9 1234 5678", pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`Requin_Diagnostico_${leadName.replace(/\s+/g, '_')}.pdf`);

    // Optional: Send data to backend here (lead capture)
    console.log("Lead captured:", { name: leadName, email: leadEmail, ...state });
    alert("Su informe se ha descargado correctamente. Un especialista lo contactará pronto.");
}

// Initial Run
document.addEventListener('DOMContentLoaded', calculate);
