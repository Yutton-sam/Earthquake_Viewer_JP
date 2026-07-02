let map;

// 選択中の波紋
let highlightCircle = null;

// 波紋アニメーションのタイマー
let highlightAnimation = null;

let markerLayer;

// ============================
// マーカー表示
// ============================
function addMarkers(earthquakes) {

    markerLayer.clearLayers();

    earthquakes.forEach(eq => {

        const hypo = eq.earthquake?.hypocenter;

        if (!hypo || hypo.latitude == null || hypo.longitude == null) return;

        const lat = hypo.latitude;
        const lng = hypo.longitude;

        const name = hypo.name || "不明";
        const mag = hypo.magnitude ?? "不明";
        const depth = hypo.depth ?? "不明";

        const scale = scaleToString(eq.earthquake?.maxScale);
        const time = formatTimeNoSeconds(eq.earthquake.time);

        const icon = getIconByMagnitude(mag);

        const marker = L.marker([lat, lng], { icon })
            .addTo(markerLayer)
            .bindPopup(`
                <b>📍 ${name}</b><br>
                M${mag}<br>
                最大震度 ${scale}<br>
                深さ ${depth} km<br>
                発生日時 ${time}
            `);

        // ★これが波形と連動の本体
        marker.on("click", () => {
            highlightLocation(lat, lng);
            scrollToCard(eq.id);
        });
    });
}

// ============================
// 地図初期化
// ============================
async function initMap() {

    // まず地図を作る
    map = L.map('map').setView([36.2, 138], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 次にマーカー管理用レイヤーを作る
    markerLayer = L.layerGroup().addTo(map);

    try {

        const data = await fetchEarthquakeData();

        console.log("地震データ:", data);

        addMarkers(data);

    } catch (error) {

        console.error("地図初期化エラー:", error);

    }
}

// ============================
// マップ移動
// ============================

function moveToLocation(lat, lng, zoom = 7) {
    if (!map) return;
    map.setView([lat, lng], zoom);
}

// ============================
// アイコン生成
// ============================
function getIconByMagnitude(mag) {

    const m = parseFloat(mag);

    let color = "green";

    if (m >= 7) color = "purple";
    else if (m >= 6) color = "red";
    else if (m >= 5) color = "orange";
    else if (m >= 4) color = "yellow";

    return L.icon({
        iconUrl: `https://maps.gstatic.com/mapfiles/ms2/micons/${color}-dot.png`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

// ============================
// 既存の円を削除
// ============================

function highlightLocation(lat, lng) {

    // ===========================
    // 前のアニメーション停止
    // ===========================
    if (highlightAnimation) {
        clearInterval(highlightAnimation);
        highlightAnimation = null;
    }

    // ===========================
    // 前の波紋削除
    // ===========================
    if (highlightCircle) {
        map.removeLayer(highlightCircle);
        highlightCircle = null;
    }

    // 波紋を開始
    startWave(lat, lng);
}

function startWave(lat, lng) {

    let radius = 5000;
    let opacity = 0.35;

    highlightCircle = L.circle([lat, lng], {
        radius: radius,
        color: "red",
        fillColor: "red",
        fillOpacity: opacity,
        weight: 2
    }).addTo(map);

    highlightAnimation = setInterval(() => {

        radius += 2000;
        opacity -= 0.01;

        highlightCircle.setRadius(radius);

        highlightCircle.setStyle({
            fillOpacity: Math.max(opacity, 0),
            opacity: Math.max(opacity, 0)
        });

        // 波紋が消えたらもう一度最初から
        if (opacity <= 0) {

            map.removeLayer(highlightCircle);

            radius = 5000;
            opacity = 0.35;

            highlightCircle = L.circle([lat, lng], {
                radius: radius,
                color: "red",
                fillColor: "red",
                fillOpacity: opacity,
                weight: 2
            }).addTo(map);

        }
    }, 40);
}
// ============================
// 起動
// ============================
initMap();