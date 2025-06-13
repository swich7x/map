
let map;
let geocoder;
let markers = [];

window.onload = function () {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 3
  };
  map = new kakao.maps.Map(container, options);
  geocoder = new kakao.maps.services.Geocoder();

  resetAtMidnight();
};

function addMarker() {
  const address = document.getElementById("address").value;
  const invoice = document.getElementById("invoice").value;
  const source = document.getElementById("source").value;

  if (!address || !invoice) {
    alert("주소와 송장번호를 모두 입력해주세요.");
    return;
  }

  geocoder.addressSearch(address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
        image: new kakao.maps.MarkerImage(
          "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
          new kakao.maps.Size(24, 35),
          { offset: new kakao.maps.Point(12, 35) }
        )
      });

      const color = source === "딜리래빗" ? "blue" : "black";
      const content = `<div style="color:${color}; font-weight:bold;">${source}<br>송장번호: ${invoice}</div>`;

      const infowindow = new kakao.maps.InfoWindow({
        content: content
      });

      kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });

      map.setCenter(coords);
      markers.push(marker);
    } else {
      alert("주소를 찾을 수 없습니다.");
    }
  });
}

function resetAtMidnight() {
  const now = new Date();
  const millisUntilMidnight =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

  setTimeout(() => {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    resetAtMidnight();
  }, millisUntilMidnight);
}
