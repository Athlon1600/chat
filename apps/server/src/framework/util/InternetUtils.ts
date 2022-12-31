export class InternetUtils {

    static ipToLong(ip: string): number {
        return ip.split('.').reduce(function (ipInt, octet) {
            return (ipInt << 8) + parseInt(octet, 10)
        }, 0) >>> 0;
    }
}