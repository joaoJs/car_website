const key = "AIzaSyAPg2Dtd6vrWdpbPho43t0U6OsaCOabMpw";

const geoKey = 'AIzaSyBZmlw9qWUNZvc1jbUEZ8HQXHGTHXe3Jm4';

// key for mapquest developer api
const questKey = 'Wqg5107kondz2HpG8OPYTxMGLcsgVZ9B';

// hotel 99 lat: 40.796699 lng: -73.970909
const carLat = 40.796699;
const carLng = -73.970909;
// fdmGroup lat: 40.707619 lng: -74.010595

const markers = [
  {lat: 40.796699, lng: -73.970909},
];

function initMap() {
        var position = {lat: 40.796699, lng: -73.970909};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: position
        });

        var marker = new google.maps.Marker({
          position: position,
          map: map
        });


        function addMarker(coords) {
          var marker = new google.maps.Marker({
            position: coords,
            map: map
          });
        }

        const locationForm = document.getElementById("locationForm");
        locationForm.addEventListener('submit', geocode);

        function geocode(e) {
          e.preventDefault();

          var location = document.getElementById('locationInput').value;
          axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
            params: {
              address: location,
              key: geoKey
            }
          })
          .then((response) => {
            //console.log("Form ---> ", response.data.results[0].formatted_address);
            console.log("Response ----> ", response);
            const address = response.data.results[0].formatted_address;

            const lat = response.data.results[0].geometry.location.lat;
            const lng = response.data.results[0].geometry.location.lng;
            const coords = {lat: lat, lng: lng};

            markers.push(coords);

            markers.forEach(marker => {
              addMarker(marker);
            });

            getDistance();

            function getDistance() {


                $.ajax({
                url: `http://www.mapquestapi.com/directions/v2/route?key=${questKey}&from=${lat},${lng}&to=${carLat},${carLng}&routeType=bicycle`,
                type: "GET",
                dataType: 'json',
                cache: false,
                success: function(response){
                    console.log("Response --> ", response);
                    console.log("time ---> ", response.route.formattedTime);
                    const time = response.route.formattedTime;
                    $('.result').addClass('active');
                    $('.bike').html(`<p>You need ${time} to get to <i>J-lpy</i> by bike.</p>`);
                }
              });

                $.ajax({
                url: `http://www.mapquestapi.com/directions/v2/route?key=${questKey}&from=${lat},${lng}&to=${carLat},${carLng}`,
                type: "GET",
                dataType: 'json',
                cache: false,
                success: function(response){
                    console.log("response ---> ", response);
                    const time = response.route.formattedTime;
                    $('.result').addClass('active');
                    $('.car').html(`<p>With a car you only need ${time}!</p>`);
                }
              });

            }
          })
          .catch((err) => {
            console.log(`Err ---> ${err}`);
          });

        }


}
