export async function POST(req) {
  const { email, password } = await req.json();

  if (email === "admin@example.com" && password === "password123") {
    return new Response(null, {
      status: 200,
      headers: {
        "Set-Cookie": `token=admin; Path=/; HttpOnly;`
      }
    });
  }

  return new Response("Unauthorized", { status: 401 });
}
