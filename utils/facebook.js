const bizSdk = require('facebook-nodejs-business-sdk');

// Initialize Facebook Business SDK
const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
const pixelId = process.env.FACEBOOK_PIXEL_ID;

const api = bizSdk.FacebookAdsApi.init(accessToken);
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;

// Helper function to hash data
const hashData = (data) => {
    if (!data) return null;
    return bizSdk.sha256Hash(data.trim().toLowerCase());
};

// Send purchase event to Facebook
const sendPurchaseEvent = async (orderData) => {
    try {
        const { user, products, totalPrice, fullName, city, state, postalCode } = orderData;

        // Prepare user data
        const userData = (new UserData())
            .setFirstName(hashData(fullName.split(' ')[0]))
            .setLastName(hashData(fullName.split(' ').slice(1).join(' ')))
            .setCity(hashData(city))
            .setState(hashData(state))
            .setZip(hashData(postalCode));

        // If user email and phone are available (from user object), add them
        if (user.email) {
            userData.setEmail(hashData(user.email));
        }
        if (user.phone) {
            userData.setPhone(hashData(user.phone));
        }

        // Prepare custom data
        const customData = (new CustomData())
            .setCurrency('INR')
            .setValue(totalPrice);

        // Add content IDs and quantities
        const contents = products.map(product => ({
            id: product._id.toString(),
            quantity: product.quantity
        }));
        customData.setContents(contents);

        // Create server event
        const serverEvent = (new ServerEvent())
            .setEventName('Purchase')
            .setEventTime(Math.floor(Date.now() / 1000))
            .setUserData(userData)
            .setCustomData(customData)
            .setEventSourceUrl('https://soulsun.in/checkout/success')  // Replace with your actual domain
            .setActionSource('website');

        // Create event request
        const eventsData = [serverEvent];
        const eventRequest = (new EventRequest(accessToken, pixelId))
            .setEvents(eventsData);

        // Execute the request
        const response = await eventRequest.execute();
        console.log('Facebook CAPI event sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending Facebook CAPI event:', error);
        // Don't throw the error - we don't want to affect the main flow if FB tracking fails
        return null;
    }
};

module.exports = {
    sendPurchaseEvent
}; 