import requestIp from 'request-ip';
import fetch from 'node-fetch';

const geolocationMiddleware = async (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);

    try {
        const response = await fetch(`https://ipinfo.io/${clientIp}?token=b2148d886c6406`);
        if (!response.ok) {
            throw new Error(`IP geolocation service error: ${response.statusText}`);
        }
        const data = await response.json();

        const { country, region, city, loc } = data;

        req.geolocation = {
            clientIp,
            country: country || 'Unknown',
            region: region || 'Unknown',
            city: city || 'Unknown',
            coordinates: loc ? loc.split(',') : ['0', '0'],
        };
        
        req.locationData = req.geolocation;

        next();
    } catch (error) {
        console.error('Error fetching IP geolocation:', error);
        req.geolocation = {
            clientIp,
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            coordinates: ['0', '0'],
        };
        req.locationData = req.geolocation;
        
        next();
    }
};

export default geolocationMiddleware;
