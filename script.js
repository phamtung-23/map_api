let map;
//@ts-ignore
let featureLayer;
let locationDefault = { lat: 12.173683163790095, lng: 111.60763757035161 };
let googleMapId = "f31626ad9b6aaff9"
let placeIdVietNam = "ChIJXx5qc016FTERvmL-4smwO7A"
let positionOfMarkerDrag = {lat: 21.028194139483286, lng: 105.82882897494626}

async function initMap() {
  // ========== create map default =====================================
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement,  PinElement } = await google.maps.importLibrary("marker"); 
  const map = new Map(document.getElementById("map"), {
    center: locationDefault,
    zoom: 6,
    mapId: googleMapId,
  });

  // ========== Style a boundary polygon ===============================
  featureLayer = map.getFeatureLayer("COUNTRY");
  const featureStyleOptions = {
    strokeColor: "#A9A9A9",
    strokeOpacity: 1.0,
    strokeWeight: 1.0,
    fillColor: "#222222",
    fillOpacity: 0.5,
  };
  featureLayer.style = (options) => {
    console.log(options)
    if (options.feature.placeId != placeIdVietNam) {
      return featureStyleOptions;
    }
  };

  
// =========== show detail info of marker when click =======================
  for (const property of properties) {
    const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
      map,
      content: buildContent(property),
      position: property.position,
      title: property.description,
    });

    AdvancedMarkerElement.addListener("click", () => {
      toggleHighlight(AdvancedMarkerElement, property);
      
      
    });
  }
  //========== polyline default ==========================================
  const flightPlanCoordinates = [
    { lat: 18.729, lng: 105.820 },
    { lat: 18.729, lng: 107.026 },
    { lat: 19.177, lng: 107.026 },
    { lat: 19.177, lng: 105.820 },
    { lat: 18.729, lng: 105.820 },
  ];
  const flightPlanCoordinates1 = [
    { lat: 19.177, lng: 107.026 },
    { lat: 19.377, lng: 107.020 },
    { lat: 19.677, lng: 107.520 },
    { lat: 19.677, lng: 106.020 },
    { lat: 19.477, lng: 105.820 },
    { lat: 19.177, lng: 105.820 },
  ];
  const flightPlanCoordinates2 = [
    { lat: 19.677, lng: 107.520 },
    { lat: 20.477, lng: 107.500 },
    { lat: 20.477, lng: 106.800 },
    { lat: 19.677, lng: 106.020 },
    
  ];
  const flightPlanCoordinates3 = [
    { lat: 19.677, lng: 107.520 },
    { lat: 20.220, lng: 107.900 },
    { lat: 21.120, lng: 107.700 },
    { lat: 20.477, lng: 107.200 },
    
  ];

  const flightPlanCoordinates4 = [
    {lat:14.929, lng:109.070},
    {lat:14.929, lng:110.180},
    {lat:14.323, lng:110.191},
    {lat:14.323, lng:109.257},
    {lat:14.929, lng:109.070}
    
  ];

  const goldenStar1 = [
    {lat:8.029, lng:109.070},
    {lat:7.973, lng:109.147},
    {lat:8.223, lng:109.257},
    {lat:8.223, lng:109.157},
    {lat:8.029, lng:109.070}
  ];

  const goldenStar2 = [
    
    {lat:8.029, lng:109.270},
    {lat:7.980, lng:109.337},
    {lat:8.080, lng:109.437},
    {lat:8.223, lng:109.497},
    {lat:8.223, lng:109.397},
    {lat:8.029, lng:109.270}
  ];

  const polylines = [
    flightPlanCoordinates, 
    flightPlanCoordinates1,
    flightPlanCoordinates2,
    flightPlanCoordinates3,
    flightPlanCoordinates4,
    goldenStar1,
    goldenStar2
  ];
  // Loop through each set of coordinates and draw the polyline
  for (let i = 0; i < polylines.length; i++) {
    const polyline = new google.maps.Polyline({
      path: polylines[i],
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    polyline.setMap(map);
  }

  // ============= drag marker on map ================================================
  const infoWindow = new InfoWindow();
  const draggableMarker = new AdvancedMarkerElement({
    map,
    position: positionOfMarkerDrag,
    gmpDraggable: true,
    title: "This marker is draggable.",
  });
  draggableMarker.addListener("dragend", (event) => {
    infoWindow.close();
    infoWindow.setContent(
      JSON.stringify(event.latLng.toJSON(), null, 2)
    );
    infoWindow.open(draggableMarker.map, draggableMarker);
  });
}
initMap();


// ======== function show info detail of marker =======================
function toggleHighlight(markerView, property) {
  const reviewElement = document.getElementById("review");
  const mapElement = document.getElementById("map");
  console.log(property);
  if (markerView.content.classList.contains("highlight")) {
    markerView.content.classList.remove("highlight");
    markerView.zIndex = null;
    reviewElement.innerHTML = '';
    reviewElement.style.display = "none";
    mapElement.style.width = "100%";
  } else {
    const elements = document.querySelectorAll(".highlight");
    for (const el of elements) {
        el.classList.remove("highlight");
    }
    markerView.content.classList.add("highlight");
    reviewElement.style.display = "block";
    mapElement.style.width = "70%";
    markerView.zIndex = 1;
    reviewElement.innerHTML = `
      <h3 >${property.name}</h3>
      <img class="rounded" width="100%" src="${property.image}">
      <div class="mt-2"><b>Thời gian: </b>${property.time}</div>
      <div class="mt-2"><b>Địa điểm: </b>${property.address}</div>
      <div class="mt-2"><b>Dịch vụ: </b>${property.service}</div>
      <div class="mt-2"><b>Khách hàng: </b>${property.infoCustomer}</div>
      <div class="mt-2"><b>Vị trí: </b> ${property.position.lat}, ${property.position.lng}</div>
      <div class="mt-2"><b>Phạm Vi:</b> ${property.description}</div>
      <div class="gallery">
        <div class="w3-content w3-display-container">
          <div class="gallery-img"></div>
          <div class="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle" style="width:100%">
            <div class="w3-left w3-hover-text-khaki" onclick="plusDivs(-1)">&#10094;</div>
            <div class="w3-right w3-hover-text-khaki" onclick="plusDivs(1)">&#10095;</div>
          </div>
        </div>
      </div>`;
    const gallery = document.querySelector(".gallery-img");
    let html = ``
    const imageArray = property.gallery;
    for (let i = 0; i < imageArray.length; i++) {
      html += ` <img class="mySlides w3-animate-right" src="${imageArray[i]}" style="width:100%" height="250px">`
    }
    gallery.innerHTML = html
    showDivs(slideIndex);
  }
}
// ===========The function is show popup when click the marker ============
function buildContent(property) {
  const content = document.createElement("div");
  content.classList.add("property");
  let HTML = `
    <div class="icon">
        <img src="static/oil_platform-removebg-preview.png" width="100%">
    </div>
    <div class="details">
        <div class="close" style="text-align: end;"><i class="fa fa-times" aria-hidden="true"></i></div>
        <div class="price">${property.name}</div>
        <div class="address">${property.address}</div>
        <div class="features">
        <div>
            <span>lat</span>
            <span>${property.position.lat}</span>
        </div>
        <div>
            <span>lng</span>
            <span>${property.position.lng}</span>
        </div>
        </div>
    </div>`;
  content.innerHTML = HTML;
  return content;
}
// ======== the information of all marker ===================================
const properties = [
  {
    name: "Dàn đầu giếng (WHP) Đông Đô",
    image:'static/SVDN Offshore_adjusted (1).jpg',
    address: "Thanh Hóa",
    description: "Mỏ Đông Đô khai thác dòng dầu đầu tiên   Ngày 7/07, giàn khai thác Đông Đô thuộc cụm mỏ Thăng Long - Đông Đô, nằm trong Lô 01-97&02-97 đã cho dòng dầu đầu tiên (First Oil).Đây là dự án do Nhà điều hành Lam Sơn JOC (LSJOC), trong đó Tổng Công ty Thăm dò Khai thác dầu khí (PVEP) tham gia 50% và Petronas của Malaysia tham gia 50%, làm chủ đầu tư. ",
    time: "11/2017 – 10/2021",
    infoCustomer: "Idemitsu Kosan Co., Ltd",
    service: "Cơ khí dầu khí",
    gallery: [],
    position: {
      lat: 19.978595727381222, 
      lng: 106.88351194871855
    },
  },
  {
    name: "Dàn đầu giếng (WHP) Thăng Long",
    image:"static/SVDN Offshore_adjusted (1).jpg",
    address: "Nghệ An",
    description: "Toàn bộ công trình cụm mỏ Thăng Long - Đông Đô bao gồm 22 giếng khoan phát triển, 2 giàn đầu giếng (WHP) tại mỏ Thăng Long và Đông Đô, 1 tàu FPSO công suất xử lý 18.000 thùng dầu/ngày, 13.000 thùng nước/ngày, hệ thống bơm ép nước 15.000 thùng/ngày và hệ thống bơm ép khí 18 triệu bộ khối/ngày.",
    time: "11/2017 – 10/2021",
    infoCustomer: "Idemitsu Kosan Co., Ltd",
    service: "Cơ khí dầu khí",
    gallery: [],
    position: {
       lat: 19.37238928233252, 
       lng: 106.43527442155671 
    },
  },
  {
    name: "Dàn đầu giếng Quảng Ngãi",
    image:"static/SVDN Offshore_adjusted (1).jpg",
    address: "108 Squirrel Ln &#128063;, Menlo Park, CA",
    description: "Dự án Hải Dương được phát triển bởi PetroVietnam và Công ty Dầu khí Tư nhân Thái Bình Dương (PVEP POC). Mục tiêu của dự án này là thăm dò, khoan và khai thác dầu từ các mỏ nằm dưới đáy biển ở Vịnh Bắc Bộ.",
    time: "11/2017 – 10/2021",
    infoCustomer: "Idemitsu Kosan Co., Ltd",
    service: "Cơ khí dầu khí",
    gallery: [],
    position: {
      lat:14.65489530274547,
      lng:109.75644094435764
    }
  },
  {
    name: "DỰ ÁN SAO VÀNG – ĐẠI NGUYỆT",
    image:"static/SVDN Offshore_adjusted (1).jpg",
    address: "Việt Nam",
    time: "11/2017 – 10/2021",
    infoCustomer: "Idemitsu Kosan Co., Ltd",
    service: "Cơ khí dầu khí",
    description: "Thiết kế, mua sắm, vận chuyển, lắp đặt và chạy thử giàn xử lý trung tâm Sao Vàng, giàn đầu giếng Đại Nguyệt.",
    gallery: [
      "static/16 Jun 20-3.JPG",
      "static/31 May 20-3.JPG",
      "static/SVDN - SV CPP Loadout (1).jpg",
      "static/SVDN - SV CPP Loadout (2).jpg",
      "static/SVDN - SV CPP Loadout (3).jpg",
      "static/SVDN - SV CPP Loadout (4).jpg",
      "static/SVDN - SV CPP Loadout (5).jpg",
      "static/SVDN - SV CPP Loadout (6).jpg",
      "static/SVDN - SV CPP Loadout (7).JPG",
      "static/SVDN CPP Jacket (1).JPG",
      "static/SVDN CPP Jacket (2).JPG",
      "static/SVDN CPP Jacket Fabrication.JPG",
      "static/SVDN CPP Jacket Loadout.JPG",
      "static/SVDN CPP Jacket Sailaway.JPG",
      "static/SVDN CPP Topsides (1).JPG",
      "static/SVDN CPP Topsides (2).jpg",
      "static/SVDN CPP Topsides (3).JPG",
      "static/SVDN CPP Topsides (4).JPG",
      "static/SVDN Offshore_adjusted  (1b)-2.png",
  ],
    position: {
      lat: 8.079985918665942,
      lng: 109.14450384242726
    }
  },
];
// ======== create slider inside the information tab ================
var slideIndex = 1;
function plusDivs(n) {
  showDivs(slideIndex += n);
}
function currentDiv(n) {
  showDivs(slideIndex = n);
}
function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}
setInterval(() => {
  plusDivs(1);
}, 3000);


