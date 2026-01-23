import { env } from "cloudflare:workers";

export const getAccessToken = async () => {
  const kv = env.SERVICE_MAYERANDWATT || "Not Defined";

  let currentAccessToken = await kv.get("currentAccessToken");
  let currentTokenExpiry = await kv.get("currentTokenExpiry");
  if (
    currentAccessToken?.match(/.{20,}/) &&
    parseInt(currentTokenExpiry) != Number.NaN &&
    Date.now() < parseInt(currentTokenExpiry) - 60 * 1000
  ) {
    // 1 minute buffer
    return {
      accessToken: currentAccessToken,
      expiresIn: parseInt(currentTokenExpiry) - Date.now(),
    };
  } else {
    try {
      let res = await fetch("https://accounts.zoho.com/oauth/v2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          grant_type: "client_credentials",
          scope: env.ACCESS_SCOPE,
          soid: env.SOID,
        }),
      });
      let json = await res.json();
      let { access_token, expires_in } = json;
      let expiryTimestamp = Date.now() + expires_in * 1000;
      await kv.put("currentAccessToken", access_token);
      await kv.put("currentTokenExpiry", expiryTimestamp.toString());

      return { accessToken: access_token, expiresIn: expires_in };
    } catch (err) {
      return { accessToken: null, expiresIn: Number.NaN, error: err };
    }
  }
};
