let map;
let markers = [];
let markerData = [];

function initMap() {
  const mapContainer = document.getElementById('map');
  const defaultCenter = new kakao.maps.LatLng(37.305, 127.009); // 수원 장안구
  map = new kakao.maps.Map(mapContainer, {
    center: defaultCenter,
    level: 3,
  });

  const storedData = JSON.parse(localStorage.getItem('markerData') || '[]');
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  if (storedData.length && now.getTime() < midnight.getTime() + 24 * 60 * 60 * 1000) {
    markerData = storedData;
    markerData.forEach((item) => placeMarker(item));
    updateCount();
  }
}

function placeMarker(data) {
  const imgSrc = data.type === 'dilly' ? 'dilly.png' : 'pingpong.png';
  const imageSize = new kakao.maps.Size(24, 24);
  const markerImage = new kakao.maps.MarkerImage(imgSrc, imageSize);
  const marker = new kakao.maps.Marker({
    map,
    position: new kakao.maps.LatLng(data.lat, data.lng),
    image: markerImage,
    title: data.trackingNumber
  });
  markers.push(marker);
}

function addMarker() {
  const address = document.getElementById('address').value.trim();
  const trackingNumber = document.getElementById('trackingNumber').value.trim();
  const type = document.getElementById('type').value;

  if (!address || !trackingNumber) return;

  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(address, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const lat = result[0].y;
      const lng = result[0].x;
      const data = { lat, lng, trackingNumber, type };
      markerData.push(data);
      localStorage.setItem('markerData', JSON.stringify(markerData));
      placeMarker(data);
      updateCount();
    } else {
      alert('주소를 찾을 수 없습니다.');
    }
  });
}

function updateCount() {
  document.getElementById('countDisplay').textContent = `총 ${markerData.length}건 등록됨`;
}

window.onload = initMap;
