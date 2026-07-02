async function fetchEarthquakeData() {

    const url = "https://api.p2pquake.net/v2/history?codes=551&limit=20";

    try {

        const response = await fetch(url);
        const data = await response.json();

        console.log("API取得成功:", data);

        return data;

    } catch (error) {

        console.error("API取得失敗:", error);

        return [];

    }

}