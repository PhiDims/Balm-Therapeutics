// GitHub sign-in for the /admin editor (step 2: swap the code for a token and hand it to the editor).
// Needs GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Cloudflare Pages environment variables.
const page = (status, content) => `<!doctype html><html><body><script>
(function () {
  function receive(e) {
    window.opener.postMessage('authorization:github:${status}:' + JSON.stringify(${content}), e.origin);
    window.removeEventListener('message', receive, false);
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script><p>Signing you in…</p></body></html>`;

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("Cookie") || "";
  const saved = (cookie.match(/decap_oauth_state=([^;]+)/) || [])[1];
  const html = (body) => new Response(body, { headers: { "Content-Type": "text/html;charset=UTF-8" } });

  if (!code || !state || state !== saved) {
    return html(page("error", JSON.stringify({ message: "Sign-in could not be verified. Please try again." })));
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "balm-site-admin" },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
  });
  const data = await res.json();
  if (!data.access_token) {
    return html(page("error", JSON.stringify({ message: data.error_description || "GitHub did not return a token." })));
  }
  return html(page("success", JSON.stringify({ token: data.access_token, provider: "github" })));
}
