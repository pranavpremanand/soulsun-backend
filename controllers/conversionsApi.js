const axios = require("axios");
const crypto = require("crypto");

const pixelId = "2136476180162625";
const accessToken =
  "EAFZABLzxSGpIBOyUrjYNzgfYSFwLLYuzdc5bq2xQMj6KhS5z2RDkyLW8F0KqmIbeoIrWic1B1jT0i8DKb5HS0swk1xAadUjqUO1QQfyhskjVabtI1kXIZAIAE8r7unlt0TH9wSisDb1nvIdXk7ugyK4yw4CxVQGKvZAJZCmvdTZBnZAeZAvLYW3y4nMNwBepgfYYgZDZD";

export const sendServerEvent = async (
  userData = {},
  eventName = "Purchase",
  customData = {}
) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pixelId}/events`,
      {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              em: hash(userData.email), // SHA256 hash of email
              ph: hash(userData.phone), // SHA256 hash of phone
              client_ip_address: userData.ip,
              client_user_agent: userData.userAgent,
            },
            custom_data: {
              currency: "INR",
              value: customData.value,
              content_ids: customData.ids || [],
              content_type: "product",
            },
            action_source: "website",
          },
        ],
        access_token: accessToken,
      }
    );

    console.log("Facebook CAPI response:", response.data);
  } catch (error) {
    console.error(
      "Facebook CAPI error:",
      error.response?.data || error.message
    );
  }
};

const hash = (data) => {
  if (!data) return undefined;
  return crypto.createHash("sha256").update(data).digest("hex");
};
