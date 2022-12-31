export class AsyncUtils {

    static async sleep(ms: number) {

        return new Promise(function (resolve, reject) {

            setTimeout(function () {
                resolve(true);
            }, ms);

        });
    }
}