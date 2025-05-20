const API_KEY = "0ac1f472c69044e99502d7ca8e16881e";
const aktien = ["AMC", "MBT", "TSA", "MORN", "KOKAL", "REIN", "BLUE"];

// 2. DARK/LIGHT MODE UMSCHALTEN
document.getElementById("theme-button").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    updateThemeButton();
});

function updateThemeButton() {
    const button = document.getElementById("theme-button");
    if (document.body.classList.contains("dark-mode")) {
        button.textContent = "Light Mode";
    } else {
        button.textContent = "Dark Mode";
    }
}

// 3. AKTIENDATEN HOLEN (simplifizierte Version)
async function getAktienDaten(symbol) {
    try {
        // 3a. SIMULIERTE DATEN (für Testzwecke)
        const simulatedData = {
            symbol: symbol,
            price: (Math.random() * 500 + 50).toFixed(2),
            change: (Math.random() * 10 - 5).toFixed(2)
        };
        return simulatedData;

        // 3b. ECHTE API (zum Aktivieren Kommentar entfernen):
        /*
        const response = await fetch(
            `https://api.example.com/stock/${symbol}?apikey=${API_KEY}`
        );
        return await response.json();
        */
    } catch (error) {
        console.log("Fehler bei " + symbol + ":", error);
        return {
            symbol: symbol,
            price: "---",
            change: "0.00"
        };
    }
}

// 4. AKTIEN ANZEIGEN
async function showAktien() {
    const container = document.getElementById("aktien-container");
    container.innerHTML = "<p>Lade Aktien...</p>";

    let html = "";
    for (const symbol of aktien) {
        const aktie = await getAktienDaten(symbol);
        
        // Farbe basierend auf Preisänderung
        const trend = aktie.change >= 0 ? "up" : "down";
        const trendSymbol = aktie.change >= 0 ? "+" : "";
        
        html += `
            <div class="aktie-card">
                <h3>${aktie.symbol}</h3>
                <p>Preis: $${aktie.price}</p>
                <p class="${trend}">${trendSymbol}${aktie.change}%</p>
            </div>
        `;
