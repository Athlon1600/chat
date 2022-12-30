var ChatSDK = require('./dist-cjs');

// https://jameshfisher.com/2020/10/04/what-are-umd-modules/

if (typeof window !== 'undefined') window.ChatSDK = ChatSDK;
if (typeof module !== 'undefined') {
    /**
     * @api private
     */
    module.exports = ChatSDK;
}
