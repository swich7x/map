let map;
let geocoder;
let markers = [];
const STORAGE_KEY = "markers";
const countDiv = document.getElementById("count");

function initMap() {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.302148, 126.989375), // 수원시 장안구 장안로 271
    level: 3,
  };
  map = new kakao.maps.Map(container, options);
  geocoder = new kakao.maps.services.Geocoder();

  loadMarkers();
  scheduleMidnightReset();
}

function loadMarkers() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.forEach(({ address, invoice, type }) => {
    geocodeAddress(address, invoice, type, false);
  });
  updateCount(data.length);
}

function updateCount(n) {
  countDiv.textContent = `등록된 마커 수: ${n}`;
}

function saveMarker(address, invoice, type) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.push({ address, invoice, type });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  updateCount(data.length);
}

function geocodeAddress(address, invoice, type, save = true) {
  geocoder.addressSearch(address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      const marker = new kakao.maps.Marker({
        map,
        position: coords,
        title: invoice,
        image: new kakao.maps.MarkerImage(
          type === "dilly" ? "dilly.png" : "pingpong.png",
          new kakao.maps.Size(24, 24)
        ),
      });
      markers.push(marker);
      map.setCenter(coords);
      if (save) saveMarker(address, invoice, type);
    } else {
      alert("주소를 찾을 수 없습니다.");
    }
  });
}

document.getElementById("addBtn").addEventListener("click", () => {
  const address = document.getElementById("address").value.trim();
  const invoice = document.getElementById("invoice").value.trim();
  const type = document.getElementById("type").value;
  if (!address || !invoice) {
    alert("주소와 송장번호를 입력해주세요.");
    return;
  }
  geocodeAddress(address, invoice, type);
  document.getElementById("address").value = "";
  document.getElementById("invoice").value = "";
});

function scheduleMidnightReset() {
  const now = new Date();
  const koreaOffset = 9 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const koreaTime = new Date(utc + koreaOffset);

  const midnight = new Date(koreaTime);
  midnight.setHours(24, 0, 0, 0);

  const timeout = midnight.getTime() - koreaTime.getTime();
  setTimeout(() => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }, timeout);
}

window.onload = initMap;
