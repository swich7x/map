
let mapContainer = document.getElementById('map');
let mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 3
};
let map = new kakao.maps.Map(mapContainer, mapOption);
let geocoder = new kakao.maps.services.Geocoder();
let markerCount = 0;

function addMarker() {
    let address = document.getElementById('address').value.trim();
    let invoice = document.getElementById('invoice').value.trim();
    let type = document.getElementById('type').value;

    if (!address || !invoice) {
        alert("주소와 송장번호를 입력하세요.");
        return;
    }

    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            let imageSrc = type === "dilly" ? "dilly.png" : "pingpong.png";
            let imageSize = new kakao.maps.Size(32, 32);
            let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            let marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });

            let info = new kakao.maps.InfoWindow({
                content: '<div style="padding:5px;font-size:14px;">송장번호: ' + invoice + '</div>'
            });
            info.open(map, marker);

            map.setCenter(coords);

            markerCount++;
            document.getElementById('count').innerText = markerCount;
        } else {
            alert("주소를 찾을 수 없습니다.");
        }
    });
}
