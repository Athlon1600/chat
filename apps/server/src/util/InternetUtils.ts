import * as IpLib from 'ip';
import path from "path";
import maxmind, {CityResponse} from "maxmind";
import {GeoIPResponse, Nullable, NullablePromise} from "../types";

export class InternetUtils {

    static async getIpLocation(ip: string): NullablePromise<GeoIPResponse> {

        const rootDir = path.resolve('./');
        const databasePath = path.join(rootDir, '/resources/GeoLite2-City.mmdb');

        // TODO: handle not found
        const lookup = await maxmind.open<CityResponse>(databasePath);

        const response: Nullable<CityResponse> = lookup.get(ip);

        if (response === null) {
            return null;
        }

        return {
            city: response?.city?.names?.en || "",
            continentCode: response?.continent?.code || "",
            countryCode: response?.country?.iso_code || "",
            countryName: response?.country?.names?.en || "",
            latitude: response?.location?.latitude || 0,
            longitude: response?.location?.longitude || 0,
            postalCode: response?.postal?.code || "",
            region: response?.subdivisions ? response.subdivisions[0]?.iso_code : ""
        };
    }

    static ipToLong(ip: string): number {
        return IpLib.toLong(ip);
    }

    static longToIp(ip: number): string {
        return IpLib.fromLong(ip);
    }

    static randomIpLong() {
        return IpLib.toLong('224.68.41.107');
    }
}