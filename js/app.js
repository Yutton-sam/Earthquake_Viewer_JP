function formatDateTime(date) {

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return {
        date: `${yyyy}/${mm}/${dd}`,
        time: `${hh}:${mi}:${ss}`
    };
}

// ==========================
// 現在時刻（毎秒更新）
// ==========================
function updateClock() {

    const now = new Date();
    const dt = formatDateTime(now);

    document.getElementById("current-date").textContent = dt.date;
    document.getElementById("current-time").textContent = dt.time;

}

// ==========================
// 最終更新時刻
// ==========================
function updateLastUpdateTime() {

    const now = new Date();
    const dt = formatDateTime(now);

    document.getElementById("last-update-date").textContent = dt.date;
    document.getElementById("last-update-time").textContent = dt.time;

}

// ==========================
// 時計開始
// ==========================
updateClock();
updateLastUpdateTime();
setInterval(updateClock, 1000);

// ==========================
// 地震情報更新
// ==========================
async function reloadEarthquake() {
    
    const statusBar = document.getElementById("status-bar");
    
    statusBar.textContent = "🔄 地震情報を更新しています...";

    try {

        const data = await fetchEarthquakeData();
        console.log(data[0].earthquake.time);
        updateStatusBar(data);
        renderEarthquakeList(data);
        addMarkers(data);

        updateLastUpdateTime();

    } catch (error) {

        console.error(error);

        statusBar.textContent = "❌ 地震情報の取得に失敗しました。";

    }
}

// ==========================
// アプリ起動
// ==========================
async function startApp() {

    await reloadEarthquake();

}

// 起動
startApp();

// ==========================
// 更新ボタン
// ==========================
document.getElementById("refresh-button")?.addEventListener("click", async () => {
    await reloadEarthquake();
    updateLastUpdateTime();
});