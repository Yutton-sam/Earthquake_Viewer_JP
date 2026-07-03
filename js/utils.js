// ==========================
// 地震APIの日時表示
// Safari(iPhone)対応版
// 例:
// "2026/07/03 14:06:54.979"
// ↓
// "2026年07月03日 14:06"
// ==========================
function formatTimeNoSeconds(timeStr) {

    if (!timeStr) return "";

    try {

        // "2026/07/03 14:06:54.979"
        const [datePart, timePart] = timeStr.trim().split(" ");

        if (!datePart || !timePart) {
            return timeStr;
        }

        const [yyyy, mm, dd] = datePart.split("/");
        const [hh, min] = timePart.split(":");

        return `${yyyy}年${mm}月${dd}日 ${hh}:${min}`;

    } catch (e) {

        console.error("日時変換エラー:", timeStr, e);
        return timeStr;

    }
}

function scaleToString(scale) {

    const table = {
        10: "1",
        20: "2",
        30: "3",
        40: "4",
        45: "5弱",
        50: "5強",
        55: "6弱",
        60: "6強",
        70: "7"
    };

    return table[scale] ?? "-";
}

function tsunamiToString(type) {

    switch (type) {

        case "None":
            return "津波の心配はありません";

        case "Checking":
            return "津波の有無を調査中";

        case "NonEffective":
            return "若干の海面変動の可能性があります";

        case "Watch":
            return "津波注意報";

        case "Warning":
            return "津波警報";

        case "Unknown":
            return "津波情報は不明";

        default:
            return "津波情報なし";
    }
}