Goal
1. Run rest API with Lambada and fuction url

Citical Notes:
1. for now, we dont work with db, just memory

Citical  AWS Notes:
1. Lambada  is severless approach
2. Lambada expose one url
   you can call it with all http meothds GET,POST,PUT,DELETE, etc
3. AWS will foward the request to lambada handler
   passing it event object with the requst details 
4. Execution can fail if the schema of the evnent object is not as you expected
4.1 to get the stuctue of the event you can set the handle to retun 
        return {
            statusCode: 404,
            body: JSON.stringify({
            error: "Route not found",
            path,
            event
        })
        };
4.2 it seems that the stuctue of my event is 
    it seens that this is the strcture of the event: { "error": "Route not found", "path": "/songs", "event": { "version": "2.0", "routeKey": "$default", "rawPath": "/songs", "rawQueryString": "", "headers": { "content-length": "97", "x-amzn-tls-version": "TLSv1.3", "x-forwarded-proto": "https", "postman-token": "f209bcb4-e86d-497d-9355-2a551a0da132", "x-forwarded-port": "443", "x-forwarded-for": "176.228.3.68", "accept": "*/*", "authorization": "Basic YWRtaW46cmVnaW5l", "x-amzn-tls-cipher-suite": "TLS_AES_128_GCM_SHA256", "x-amzn-trace-id": "Root=1-6937f4ca-36ec218529d644bc19471550", "x-consumerapplication": "ddd", "host": "fcw5jemf7ucq6zqkgbn7mzb5ae0uakjr.lambda-url.eu-north-1.on.aws", "content-type": "application/json", "cache-control": "no-cache", "accept-encoding": "gzip, deflate, br", "user-agent": "PostmanRuntime/7.26.8" }, "requestContext": { "accountId": "anonymous", "apiId": "fcw5jemf7ucq6zqkgbn7mzb5ae0uakjr", "domainName": "fcw5jemf7ucq6zqkgbn7mzb5ae0uakjr.lambda-url.eu-north-1.on.aws", "domainPrefix": "fcw5jemf7ucq6zqkgbn7mzb5ae0uakjr", "http": { "method": "GET", "path": "/songs", "protocol": "HTTP/1.1", "sourceIp": "176.228.3.68", "userAgent": "PostmanRuntime/7.26.8" }, "requestId": "0c940951-de64-48bf-b8e5-e0e7ea2bfef3", "routeKey": "$default", "stage": "$default", "time": "09/Dec/2025:10:07:06 +0000", "timeEpoch": 1765274826743 }, "body": " {\r\n \"OriginalText\": \"o100\",\r\n \"ReplaceWith\": \"r100\"\r\n }", "isBase64Encoded": false } }

5. Update and delete will not work with lambada and keeping data im memory 
   since lambada is statelsess
 