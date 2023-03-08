/**
 * @author WMXPY
 * @namespace Util_Network_DNS
 * @description Txt
 */

import * as DNS from "node:dns";
import { logAgent } from "../../log/log";
import { getDomainHostOfURL, validateDomainName } from "../domain";

export const DNS_TXT_RECORD_NOT_FOUND_SYMBOL = Symbol('dns-txt-record-not-found');

const ALLOWED_CALLBACK_PREFIX: string =
    '_bark-phrase-ownership-v1';

export const dnsLookupPhraseOwnershipTxt = async (domain: string): Promise<string[]> => {

    const txtValue: string | typeof DNS_TXT_RECORD_NOT_FOUND_SYMBOL =
        await dnsLookupTxt(
            `${ALLOWED_CALLBACK_PREFIX}.${domain}`,
        );

    const domainHost: string = getDomainHostOfURL(domain);

    if (txtValue === DNS_TXT_RECORD_NOT_FOUND_SYMBOL) {
        logAgent.debug("Domain Host not found TXT record:", domainHost);
        return [domainHost];
    }

    const domainList: string[] = txtValue
        .split(',')
        .map((each: string) => each.trim())
        .filter((each: string) => validateDomainName(each));

    if (domainList.includes(domainHost)) {
        logAgent.debug("Domain Host already in list:", domainHost, domainList);
        return domainList;
    }

    logAgent.debug("Domain Host not in list:", domainHost, domainList);
    return [domainHost, ...domainList];
};

export const dnsLookupTxt = (domain: string): Promise<string | typeof DNS_TXT_RECORD_NOT_FOUND_SYMBOL> => {

    return new Promise((
        resolve: (
            value: string | typeof DNS_TXT_RECORD_NOT_FOUND_SYMBOL,
        ) => void,
    ) => {

        DNS.resolveTxt(domain, (
            error: Error | null,
            addresses: string[][] | undefined,
        ) => {

            if (error) {
                logAgent.error("DNS TXT Error:", error);
                resolve(DNS_TXT_RECORD_NOT_FOUND_SYMBOL);
                return;
            }

            if (Array.isArray(addresses)) {
                resolve(addresses[0][0]);
                return;
            }

            logAgent.error("DNS TXT Internal Error, addresses:", error);
            resolve(DNS_TXT_RECORD_NOT_FOUND_SYMBOL);
        });
    });
};
