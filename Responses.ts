const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Or your specific origin
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  BAD_REQUEST: () => new Response("Bad request", { status: 400, headers }),
  OK_REQUEST_STDOUT: (stdout: string) =>
    new Response(JSON.stringify({ stdout: stdout.toString() }), {
      status: 200,
      headers,
    })
};
