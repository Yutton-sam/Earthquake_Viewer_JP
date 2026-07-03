let selectedCard = null;

function updateStatusBar(data) {

    const bar = document.getElementById("status-bar");

    if (!data || data.length === 0) {
        bar.textContent = "🟢 現在、大きな地震情報はありません";
        return;
    }

    const latest = data[0];
    const quake = latest?.earthquake;

    if (!quake) {
        bar.textContent = "🟢 現在、大きな地震情報はありません";
        return;
    }

    const place = quake.hypocenter?.name ?? "不明";
    const time = formatTimeNoSeconds(quake.time);
    const scale = scaleToString(quake.maxScale ?? 0);

    bar.innerHTML = `
        📍 ${place}<br>
        ${time} 発生<br>
        最大震度 ${scale}
    `;
}

function renderEarthquakeList(data) {
    const container = document.getElementById("earthquake-list");
    container.innerHTML = "";

    if (!Array.isArray(data)) return;

    data.slice(0, 20).forEach(eq => {

        const hypo = eq?.earthquake?.hypocenter ?? {};

        const mag = hypo.magnitude ?? "不明";
        let depth = hypo.depth;

            if (depth == null || depth <= 0) {
                depth = "不明";
            }

        const scale = scaleToString(eq?.earthquake?.maxScale ?? 0);
        const time = formatTimeNoSeconds(eq?.time ?? eq?.earthquake?.time);

        // 場所
        let location = "観測地点なし";
        if (Array.isArray(eq?.points) && eq.points.length > 0) {
            const p = eq.points[0];
            location = `${p.pref ?? ""} ${p.addr ?? ""}`.trim();
        }

        // 震度レベル（色用）
        const maxScale = eq?.earthquake?.maxScale ?? 0;

        let level = "low";
        if (maxScale >= 50) level = "high";
        else if (maxScale >= 40) level = "mid";
        else if (maxScale >= 30) level = "warn";

        const div = document.createElement("div");

        // ★クラスは最低限に固定（崩れ防止）
        div.className = `earthquake-card ${level}`;
        div.dataset.id = eq.id ?? "";

        // カードレイアウト
        div.innerHTML = `
            <div class="card-header">
                <div class="card-title">
                    📍 ${hypo.name || "不明"}
                </div>

                <div class="card-scale-box">
                    <div class="scale-label">最大震度</div>
                    <div class="scale-value">${scale}</div>
                </div>
            </div>

            <div class="card-row">
                <div class="card-location">
                    📌 ${location}
                </div>

                <div class="card-depth">
                    深さ ${depth}${depth === "不明" ? "" : " km"}
                </div>
            </div>

            <div class="card-footer">
                <div class="card-time">
                    ${time}
                </div>

                <div class="card-mag">
                    M${mag}
                </div>
            </div>
        `;

        // カードクリック
        div.onclick = () => {

            const h = eq?.earthquake?.hypocenter;
            if (!h) return;

            moveToLocation(h.latitude, h.longitude);
            highlightLocation(h.latitude, h.longitude);

            if (selectedCard) {
                selectedCard.classList.remove("active");
            }

            div.classList.add("active");
            selectedCard = div;
        };

        container.appendChild(div);
    });
}

//クリックされたマーカーに合わせてカードをトップにスクロール

function scrollToCard(id) {

    const el = document.querySelector(`[data-id="${id}"]`);
    if (!el) return;

    document.getElementById("earthquake-list");

    el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
    });

    // 強調
    if (selectedCard) {
        selectedCard.classList.remove("active");
    }

    el.classList.add("active");
    selectedCard = el;
}