/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../base/common/arrays.js';

export interface IWebviewSharedSessionCookies {
	readonly allowedOrigins: readonly string[];
}

export interface IWebviewSharedSessionCookiePolicyOptions {
	readonly platform: 'browser' | 'electron';
}

const localhostHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '[::1]']);

export function normalizeSharedSessionCookies(
	value: { readonly allowedOrigins: readonly string[] } | undefined,
	options: IWebviewSharedSessionCookiePolicyOptions,
): IWebviewSharedSessionCookies | undefined {
	if (!value) {
		return undefined;
	}

	const normalizedAllowedOrigins: string[] = [];
	for (const candidate of value.allowedOrigins) {
		const normalizedOrigin = normalizeAllowedOrigin(candidate);
		if (!normalizedAllowedOrigins.includes(normalizedOrigin)) {
			normalizedAllowedOrigins.push(normalizedOrigin);
		}
	}

	if (!normalizedAllowedOrigins.length || options.platform !== 'electron') {
		return undefined;
	}

	return { allowedOrigins: normalizedAllowedOrigins };
}

export function areSharedSessionCookiesEqual(
	a: IWebviewSharedSessionCookies | undefined,
	b: IWebviewSharedSessionCookies | undefined,
): boolean {
	if (a === b) {
		return true;
	}

	if (!a || !b) {
		return false;
	}

	return equals(a.allowedOrigins, b.allowedOrigins);
}

export function isOriginAllowedForSharedSessionCookies(
	policy: IWebviewSharedSessionCookies | undefined,
	origin: string,
): boolean {
	return !!policy && policy.allowedOrigins.includes(origin);
}

function normalizeAllowedOrigin(candidate: string): string {
	let url: URL;
	try {
		url = new URL(candidate);
	} catch {
		throw new Error(`Invalid shared session cookie origin: ${candidate}`);
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		throw new Error(`Invalid shared session cookie origin: ${candidate}`);
	}

	if (!url.host || url.username || url.password || url.search || url.hash) {
		throw new Error(`Invalid shared session cookie origin: ${candidate}`);
	}

	if (url.pathname && url.pathname !== '/') {
		throw new Error(`Invalid shared session cookie origin: ${candidate}`);
	}

	if (url.protocol === 'http:' && !localhostHosts.has(url.hostname)) {
		throw new Error(`Invalid shared session cookie origin: ${candidate}`);
	}

	return url.origin;
}
