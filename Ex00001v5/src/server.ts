import { handler as lambdaHandler } from "./index.js";

import http, { IncomingMessage, ServerResponse } from "http";

// Define event type (to match the expected Lambda event structure)
interface Event {
  rawPath: string;
  rawQueryString: string;
  headers: Record<string, string | string[] | undefined>;
  requestContext: {
    http: {
      method: string;
      path: string;
    };
  };
  body: string | null;
}

const PORT = 3000;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  let body: Buffer[] = [];

  req.on("data", (chunk: Buffer) => {
    body.push(chunk);
  });

  req.on("end", async () => {
    // Buffer.concat expects an array of Buffer objects, so use that directly
    const bodyString = body.length > 0 ? Buffer.concat(body).toString() : null;

    const event: Event = {
      rawPath: req.url || "",
      rawQueryString: req.url?.includes("?") ? req.url.split("?")[1] : "",
      headers: req.headers as Record<string, string | string[] | undefined>,
      requestContext: {
        http: {
          method: req.method || "GET",
          path: req.url?.split("?")[0] || "",
        },
      },
      body: bodyString, // Set bodyString here, which is `string | null`
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
