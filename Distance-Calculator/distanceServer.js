var http = require("http");

http
  .createServer(function (request, response) {
    // Parse the incoming URL and query parameters
    var requestUrl = new URL("http://" + request.headers.host + request.url);
    var latA = parseFloat(requestUrl.searchParams.get("latA"));
    var lonA = parseFloat(requestUrl.searchParams.get("lonA"));
    var latB = parseFloat(requestUrl.searchParams.get("latB"));
    var lonB = parseFloat(requestUrl.searchParams.get("lonB"));

    if (
      isNaN(latA) ||
      isNaN(lonA) ||
      isNaN(latB) ||
      isNaN(lonB)
    ) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid input values" }));
      return;
    }

    // Calculate distance (spherical law of cosines)
    var φ1 = (latA * Math.PI) / 180;
    var φ2 = (latB * Math.PI) / 180;
    var Δλ = ((lonB - lonA) * Math.PI) / 180;
    var R = 6371; // Earth's radius in km
    var distance =
      Math.acos(
        Math.sin(φ1) * Math.sin(φ2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
      ) * R;

    // Send JSON response
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ distance: distance.toFixed(2) }));
  })
  .listen(8080, () =>
    console.log("✅ Server running at http://localhost:8080/")
  );
