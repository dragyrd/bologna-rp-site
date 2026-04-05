export default function handler(req, res) {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head><title>Bologna RP</title></head>
    <body>
      <h1>⚜️ BOLOGNA | RP ⚜️</h1>
      <button onclick="login()">Accedi con Discord</button>
      <script>
        const CLIENT_ID = '1473999356125249556';
        const REDIRECT_URI = encodeURIComponent('https://bologna-rp-site.vercel.app/dashboard.html');
        function login() {
          window.location.href = `https://discord.com/api/oauth2/authorize?client_id=` + CLIENT_ID + `&redirect_uri=` + REDIRECT_URI + `&response_type=token&scope=identify`;
        }
      </script>
    </body>
    </html>
  `);
}
