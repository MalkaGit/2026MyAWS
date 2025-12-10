// server.js (CommonJS version)
const http = require("http");
const { handler: lambdaHandler } = require("./index.js");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  let body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", async () => {
    body = body.length > 0 ? Buffer.concat(body).toString() : null;

    const event = {
      rawPath: req.url,
      rawQueryString: req.url.includes("?")
        ? req.url.split("?")[1]
        : "",
      headers: req.headers,
      requestContext: {
        http: {
          method: req.method,
          path: req.url.split("?")[0],          
        },
      },
      body: body,
    };
    
    try {
      const response = await lambdaHandler(event);

      res.writeHead(response.statusCode, {
        "Content-Type": "application/json",
      });
      res.end(response.body);
    } catch (err) {
      console.error("Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
