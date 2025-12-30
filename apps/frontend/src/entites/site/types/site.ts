import SiteType from "./site_type";

interface Site {
    id: number;
    code: string;
    name: string;
    siteType: SiteType;
    longtitude: number;
    latitude: number;
}

export default Site;