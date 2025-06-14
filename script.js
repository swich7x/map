
let map;
let geocoder;
let markers = [];

function initMap() {
    map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
    });
    geocoder = new kakao.maps.services.Geocoder();
    loadMarkers();
    scheduleResetAtMidnightKST();
}

function addMarker() {
    const address = document.getElementById('address').value.trim();
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    const appType = document.getElementById('appType').value;

    if (!address || !trackingNumber) {
        alert('주소와 송장번호를 입력하세요.');
        return;
    }

    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            const imageSrc = appType === '딜리래빗' ? 'marker-blue.png' : 'marker-black.png';
            const imageSize = new kakao.maps.Size(32, 32);
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            const marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });
            const info = new kakao.maps.InfoWindow({
                content: `<div>${trackingNumber}</div>`
            });
            info.open(map, marker);
            markers.push({ address, trackingNumber, appType, lat: result[0].y, lng: result[0].x });
            saveMarkers();
            updateCountDisplay();
            map.setCenter(coords);
        } else {
            alert('주소를 찾을 수 없습니다.');
        }
    });
}

function saveMarkers() {
    localStorage.setItem('markerData', JSON.stringify(markers));
}

function loadMarkers() {
    const data = localStorage.getItem('markerData');
    if (data) {
        markers = JSON.parse(data);
        markers.forEach(({ lat, lng, trackingNumber, appType }) => {
            const coords = new kakao.maps.LatLng(lat, lng);
            const imageSrc = appType === '딜리래빗' ? 'marker-blue.png' : 'marker-black.png';
            const imageSize = new kakao.maps.Size(32, 32);
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            const marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });
            const info = new kakao.maps.InfoWindow({
                content: `<div>${trackingNumber}</div>`
            });
            info.open(map, marker);
        });
        updateCountDisplay();
    }
}

function updateCountDisplay() {
    document.getElementById('countDisplay').innerText = `총 등록 수: ${markers.length}`;
}

function scheduleResetAtMidnightKST() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const koreaNow = new Date(utc + 9 * 60 * 60 * 1000);
    const nextMidnight = new Date(koreaNow);
    nextMidnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = nextMidnight - koreaNow;
    setTimeout(() => {
        localStorage.removeItem("markerData");
        location.reload();
    }, msUntilMidnight);
}

window.onload = initMap;
