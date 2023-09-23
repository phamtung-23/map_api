async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement,  PinElement } = await google.maps.importLibrary("marker"); 
  const map = new Map(document.getElementById("map"), {
    center: { lat: 21.028194139483286, lng: 105.82882897494626 },
    zoom: 8,
    mapId: "4504f8b37365c3d0",
    mapTypeId: 'hybrid'
  });
  

  
// show detail info
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
  // polyline default
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
  const polylines = [
    flightPlanCoordinates, 
    flightPlanCoordinates1,
    flightPlanCoordinates2,
    flightPlanCoordinates3,
    flightPlanCoordinates4
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

  // polyline default
  

  const flightPath1 = new google.maps.Polyline({
    path: flightPlanCoordinates1,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  flightPath1.setMap(map);

  // drag marker
  const infoWindow = new InfoWindow();
  const draggableMarker = new AdvancedMarkerElement({
    map,
    position: {lat: 21.028194139483286, lng: 105.82882897494626},
    gmpDraggable: true,
    title: "This marker is draggable.",
  });

  draggableMarker.addListener("dragend", (event) => {
    const position = draggableMarker.position;

    infoWindow.close();
    infoWindow.setContent(
      JSON.stringify(event.latLng.toJSON(), null, 2)
    );
    infoWindow.open(draggableMarker.map, draggableMarker);
  });


  // create polyline by click
  
  poly = new google.maps.Polyline({
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  });
  poly.setMap(map);
  // Add a listener for the click event
  map.addListener("click", (event)=>{
    const path = poly.getPath();
    path.push(event.latLng);
    // Get the number of points in the path
    const numPoints = path.getLength();
    // Create an empty array to store the coordinates
    const coordinates = [];
    // Loop through each point in the path
    for (let i = 0; i < numPoints; i++) {
      // Get the coordinates of the point
      const point = path.getAt(i);
      // Add the coordinates to the array
      coordinates.push(point.toJSON());
    }
    // Display the coordinates in the console
    console.log(coordinates);
    document.getElementById("polyline-info").innerHTML = ` 
      <h4 class="text-success">Point</h4>
      <div>${JSON.stringify(coordinates)}</div> 
     `;
   
  });


  // add event listener for click event
  document.getElementById("reset-line").addEventListener("click", resetLine);
  document.getElementById("undo-line").addEventListener("click", removeLastPoint);

  function resetLine() {
    poly.setMap(null);
    poly.getPath().clear();
    poly.setMap(map);
    document.getElementById("polyline-info").textContent = '';

  }
  
  function removeLastPoint() {
    // Get the polyline's path
    const path = poly.getPath();
    // Get the number of points in the path
    const numPoints = path.getLength();
    // If there are no points, do nothing
    if (numPoints === 0) {
      return;
    }
    // Remove the last point from the path
    path.pop();
  }
}

// function show info detail
function toggleHighlight(markerView, property) {
  const reviewElement = document.getElementById("review");
  console.log(property);
  if (markerView.content.classList.contains("highlight")) {
    markerView.content.classList.remove("highlight");
    markerView.zIndex = null;
    reviewElement.innerHTML = '';
  } else {
    markerView.content.classList.add("highlight");
    markerView.zIndex = 1;
    reviewElement.innerHTML = `
      <h4 class='text-success'>Detail</h4>
      <h5 >${property.name}</h5>
      <video width="100%" height="250px" controls="controls" autoplay>
        <source src="${property.video}" type="video/mp4" />
      </video>
      <div><b>Address:</b>${property.address}</div>
      <div><b>Position:</b> ${property.position.lat}, ${property.position.lng}</div>
      <div><b>Description:</b> ${property.description}</div>`;
  }
}

function buildContent(property) {
  const content = document.createElement("div");

  content.classList.add("property");
  let HTML = `
    <div class="icon">
        <img src="oil_platform-removebg-preview.png" width="100%">
    </div>
    <div class="details">
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
    </div>

    `;
    content.innerHTML = HTML;
  return content;
}

const properties = [
  {
    name: "Dàn đầu giếng (WHP) Đông Đô",
    video:'khoan1.mp4',
    address: "Thanh Hóa",
    description: "Mỏ Đông Đô khai thác dòng dầu đầu tiên   Ngày 7/07, giàn khai thác Đông Đô thuộc cụm mỏ Thăng Long - Đông Đô, nằm trong Lô 01-97&02-97 đã cho dòng dầu đầu tiên (First Oil).Đây là dự án do Nhà điều hành Lam Sơn JOC (LSJOC), trong đó Tổng Công ty Thăm dò Khai thác dầu khí (PVEP) tham gia 50% và Petronas của Malaysia tham gia 50%, làm chủ đầu tư. ",
    position: {
      lat: 19.978595727381222, 
      lng: 106.88351194871855
    },
  },
  {
    name: "Dàn đầu giếng (WHP) Thăng Long",
    video:"khoan2.mp4",
    address: "Nghệ An",
    description: "Toàn bộ công trình cụm mỏ Thăng Long - Đông Đô bao gồm 22 giếng khoan phát triển, 2 giàn đầu giếng (WHP) tại mỏ Thăng Long và Đông Đô, 1 tàu FPSO công suất xử lý 18.000 thùng dầu/ngày, 13.000 thùng nước/ngày, hệ thống bơm ép nước 15.000 thùng/ngày và hệ thống bơm ép khí 18 triệu bộ khối/ngày.",
    position: {
       lat: 19.37238928233252, 
       lng: 106.43527442155671 
    },
  },
  {
    name: "Dàn đầu giếng Quảng Ngãi",
    video:"khoan1.mp4",
    address: "108 Squirrel Ln &#128063;, Menlo Park, CA",
    description: "Dự án Hải Dương được phát triển bởi PetroVietnam và Công ty Dầu khí Tư nhân Thái Bình Dương (PVEP POC). Mục tiêu của dự án này là thăm dò, khoan và khai thác dầu từ các mỏ nằm dưới đáy biển ở Vịnh Bắc Bộ.",
    position: {
      lat:14.65489530274547,
      lng:109.75644094435764
    }
  },
];

initMap();
