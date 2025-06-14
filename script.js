
let map;
let markers = [];

const INITIAL_LAT = 37.305148;
const INITIAL_LNG = 126.989992;

function saveToLocal(data) {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(24, 0, 0, 0);
  localStorage.setItem("markerData", JSON.stringify(data));
  localStorage.setItem("expire", reset.toISOString());
}

function loadFromLocal() {
  const expire = new Date(localStorage.getItem("expire"));
  if (new Date() > expire) {
    localStorage.removeItem("markerData");
    localStorage.removeItem("expire");
    return [];
  }
  const data = localStorage.getItem("markerData");
  return data ? JSON.parse(data) : [];
}

function updateCount() {
  document.getElementById("count").innerText = "등록된 위치: " + markers.length + "개";
}

function initMap() {
  map = new Tmapv2.Map("map", {
    center: new Tmapv2.LatLng(INITIAL_LAT, INITIAL_LNG),
    width: "100%",
    height: "500px",
    zoom: 15,
  });

  const stored = loadFromLocal();
  stored.forEach(item => placeMarker(item));
  updateCount();
}

function addMarker() {
  const address = document.getElementById("address").value.trim();
  const tracking = document.getElementById("tracking").value.trim();
  const type = document.getElementById("type").value;

  if (!address || !tracking) {
    alert("주소와 송장번호를 모두 입력하세요.");
    return;
  }

  fetch(`https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result&appKey=Z2DCf1YXF5rG8to2AS7w2D1Z1jkUEnjai4WGR4C&fullAddr=${encodeURIComponent(address)}`)
    .then(res => res.json())
    .then(data => {
      if (data.coordinateInfo && data.coordinateInfo.coordinate.length > 0) {
        const coord = data.coordinateInfo.coordinate[0];
        const lat = parseFloat(coord.lat);
        const lon = parseFloat(coord.lon);

        const item = { lat, lon, tracking, type };
        placeMarker(item);
        const saved = loadFromLocal();
        saved.push(item);
        saveToLocal(saved);
        updateCount();
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    })
    .catch(() => alert("주소 변환 중 오류가 발생했습니다."));
}

function placeMarker({ lat, lon, tracking, type }) {
  const icon = type === "dilly" ? "dilly.png" : "pingpong.png";
  const marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(lat, lon),
    icon: icon,
    map: map,
    title: `송장번호: ${tracking}`
  });
  markers.push(marker);
}

window.onload = initMap;
