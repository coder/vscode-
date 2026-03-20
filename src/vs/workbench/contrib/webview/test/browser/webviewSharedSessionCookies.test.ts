/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isOriginAllowedForSharedSessionCookies, normalizeSharedSessionCookies } from '../../common/webviewSharedSessionCookies.js';

suite('webview shared session cookies', () => {
	test('normalizes allowlisted origins', () => {
		const policy = normalizeSharedSessionCookies({
			allowedOrigins: ['https://Example.com', 'https://example.com/', 'http://127.0.0.1:3000']
		}, { platform: 'electron' });

		assert.deepStrictEqual(policy, {
			allowedOrigins: ['https://example.com', 'http://127.0.0.1:3000']
		});
		assert.strictEqual(isOriginAllowedForSharedSessionCookies(policy, 'https://example.com'), true);
		assert.strictEqual(isOriginAllowedForSharedSessionCookies(policy, 'https://example.org'), false);
	});

	test('denies access by default', () => {
		assert.strictEqual(isOriginAllowedForSharedSessionCookies(undefined, 'https://example.com'), false);
	});

	test('returns undefined for empty allowlists', () => {
		assert.strictEqual(normalizeSharedSessionCookies({ allowedOrigins: [] }, { platform: 'electron' }), undefined);
	});

	test('is disabled outside of electron', () => {
		assert.strictEqual(normalizeSharedSessionCookies({
			allowedOrigins: ['https://example.com']
		}, { platform: 'browser' }), undefined);
	});

	test('rejects invalid origins', () => {
		assert.throws(() => normalizeSharedSessionCookies({
			allowedOrigins: ['https://example.com/path']
		}, { platform: 'electron' }));

		assert.throws(() => normalizeSharedSessionCookies({
			allowedOrigins: ['http://example.com']
		}, { platform: 'electron' }));

		assert.throws(() => normalizeSharedSessionCookies({
			allowedOrigins: ['not-an-origin']
		}, { platform: 'electron' }));
	});
});
