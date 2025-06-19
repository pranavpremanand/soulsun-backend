const axios = require("axios");
const crypto = require("crypto");

const pixelId = "1238400481630068";
const accessToken =
  "EAAbMvJbLSKUBO5ToXa58TqAnfNW1xhF9wjAZAMX4WXd1hZCnEwOrWru1IZAbg8ZA9rbGQEBSmbSFJl32bZAjJRMmHOlTSozrKOJQslux6cs6EOQCIgPHHopmtTSXPXwmdYxga1xuJdTZBTB0IE7UKUgqPsWYWtWmhnm4v2t4sAMTRvdIA3TbqogJVPcX0HL75ZAVAZDZD";

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
