/**
 * @author WMXPY
 * @namespace Handlers
 * @description Verify Token
 */

import { requestBarkPublicKeyV1, RequestBarkPublicKeyV1Response } from "@barksh/client-authentication-node";
import { BarkAuthenticationToken } from "@barksh/token-node";
import { Initializer } from "../../initialize/initializer";
import { logAgent } from "../../util/log/log";

const publicKeyCaches = new Map<string, string>();

const getPublicKey = async (
    targetDomain: string,
): Promise<string> => {

    if (publicKeyCaches.has(targetDomain)) {

        logAgent.info('Get public key from cache', targetDomain);
        return publicKeyCaches.get(targetDomain) as string;
    }

    logAgent.info('Get public key from remote', targetDomain);
    const publicKey: RequestBarkPublicKeyV1Response = await requestBarkPublicKeyV1(targetDomain, {
        domain: Initializer.getInstance().getSelfDomain(),
    });

    publicKeyCaches.set(targetDomain, publicKey.publicKey);

    return publicKey.publicKey;
};

export const verifyTokenSignature = async (
    token: BarkAuthenticationToken,
    targetDomain: string,
): Promise<boolean> => {

    const publicKey: string = await getPublicKey(targetDomain);

    return token.verifySignature(publicKey);
};
