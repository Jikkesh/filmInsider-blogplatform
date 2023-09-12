import requestIp from "request-ip";
import fetch from "node-fetch"; 

const geolocationMiddleware = async (req, res, next) => {
    // const clientIp = "122.178.239.104";

    const clientIp = requestIp.getClientIp(req); 
    console.log(clientIp);

    try {
        const response = await fetch(`https://ipinfo.io/${clientIp}?token=b2148d886c6406`);
        const data = await response.json();

        const { country, region, city, loc } = data;

        req.geolocation = {
            clientIp,
            country,
            region,
            city,
            coordinates : loc.split(','),
        };
        req.locationData = req.geolocation;
        console.log(req.geolocation);

        next(); 
    } catch (error) {
        console.error('Error fetching IP geolocation:', error);
        console.log('Internal server error' );
    }
};

export default geolocationMiddleware;
