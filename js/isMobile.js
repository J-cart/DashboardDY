function isMobileBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check for common keywords in mobile user agent strings
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    //return true
    return mobileKeywords.some(keyword => userAgent.includes(keyword));
}