const API_KEY = "cdbde914335f42bd8b77f64e91c10e49";
const stocks = ["AAPL", "MSFT", "TSLA", "AMZN", "GOOGL", "META", "NFLX"];

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
    updateThemeButton();
});

function updateThemeButton() {
    const btn = document.getElementById("theme-toggle");
    btn.textContent = document.body.dataset.theme === "dark" ? "Light Mode" : "Dark Mode";
}

async function fetchStockData(symbol) {
    try {
        // Simulierte API-Antwort - Ersetze mit echtem API-Call
        const mockData = {
            symbol: symbol,
            price: (Math.random() * 500 + 50).toFixed(2),
            change: (Math.random() * 10 - 5).toFixed(2),
            history: Array.from({length: 30}, (_, i) => ({
                date: new Date(Date.now() - (30 - i) * 86400000).toLocaleDateString(),
                price: (Math.random() * 400 + 100).toFixed(2)
            }))
        };
        return mockData;
        
        // Echter API-Call (Beispiel mit Alpha Vantage):
        /*
        const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );
        return await response.json();
        */
    } catch (error) {
        console.error(`Fehler beim Laden von ${symbol}:`, error);
        return null;
    }
}

async function loadStocks() {
    const container = document.getElementById("stock-container");
    container.innerHTML = "";
    
    const marketData = [];
    
    for (const symbol of stocks) {
        const data = await fetchStockData(symbol);
        if (!data) continue;
        
        marketData.push({
            symbol: data.symbol,
            prices: data.history.map(item => parseFloat(item.price))
        });
        
        const change = parseFloat(data.change);
        const changeClass = change >= 0 ? "up" : "down";
        const changeSymbol = change >= 0 ? "+" : "";
        
        const card = document.createElement("div");
        card.className = "stock-card";
        card.innerHTML = `
            <div class="stock-symbol">${data.symbol}</div>
            <div class="stock-price">$${data.price}</div>
            <div class="${changeClass}">${changeSymbol}${change}%</div>
        `;
        container.appendChild(card);
    }
    
    renderMarketChart(marketData);
}

function renderMarketChart(stockData) {
    const ctx = document.getElementById("market-chart").getContext("2d");
    
    // Gruppiere Daten nach Tagen
    const labels = Array.from({length: 30}, (_, i) => 
        new Date(Date.now() - (30 - i) * 86400000).toLocaleDateString("de-DE", {month: "short", day: "numeric"})
    );
    
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: stockData.map(stock => ({
                label: stock.symbol,
                data: stock.prices,
                borderColor: getRandomColor(),
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top",
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function getRandomColor() {
    const colors = [
        "#FF2D55", "#5856D6", "#007AFF", "#34C759", 
        "#FF9500", "#FFCC00", "#AF52DE", "#FF3B30"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initialisierung
window.addEventListener("load", () => {
    loadStocks();
    updateThemeButton();
});
