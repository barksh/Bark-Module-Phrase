/**
 * @author WMXPY
 * @namespace Util_Network
 * @description Domain
 */

import { URL } from 'node:url';

const fixDomainUrl = (url: string): URL => {

    if (!url.startsWith('http://')
        && !url.startsWith('https://')) {

        return new URL(`https://${url}`);
    }
    return new URL(url);
};

export const getDomainHostOfURL = (url: string): string => {

    const parsed: URL = fixDomainUrl(url);

    if (typeof parsed.port === 'string'
        && parsed.port.length > 0) {
        return `${parsed.hostname}:${parsed.port}`;
    }
    return parsed.hostname;
};

export const validateDomainName = (host: string): boolean => {

    const localhostRegexp: RegExp = /^localhost:\d{3,5}$/;
    if (localhostRegexp.test(host)) {
        return true;
    }

    const regexp: RegExp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    return regexp.test(host);
};
