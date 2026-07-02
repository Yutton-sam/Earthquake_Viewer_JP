function formatTimeNoSeconds(timeStr) {

    if (!timeStr) return "";

    const date = new Date(timeStr);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
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