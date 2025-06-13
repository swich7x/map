
const mapContainer = document.getElementById('map');
const mapOption = {
  center: new kakao.maps.LatLng(37.5665, 126.9780),
  level: 3
};
const map = new kakao.maps.Map(mapContainer, mapOption);
const geocoder = new kakao.maps.services.Geocoder();

document.getElementById('location-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const address = document.getElementById('address').value;
  const tracking = document.getElementById('tracking').value;
  const type = document.getElementById('type').value;

  if (!address || !tracking) {
    alert("주소와 송장번호를 입력해주세요.");
    return;
  }

  geocoder.addressSearch(address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      const imageSrc = type === 'dilly' ? 'dilly.png' : 'pingpong.png';
      const imageSize = new kakao.maps.Size(32, 32);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
        image: markerImage
      });

      const info = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:13px;">송장: ${tracking}</div>`
      });
      info.open(map, marker);

      map.setCenter(coords);
    } else {
      alert("주소를 찾을 수 없습니다.");
    }
  });
});
