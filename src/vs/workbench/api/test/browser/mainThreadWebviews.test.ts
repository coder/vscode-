/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isWeb } from '../../../../base/common/platform.js';
import { reviveWebviewContentOptions } from '../../browser/mainThreadWebviews.js';

suite('MainThreadWebviews', () => {
	test('revives shared session cookies', () => {
		const revived = reviveWebviewContentOptions({
			sharedSessionCookies: {
				allowedOrigins: ['https://Example.com', 'https://example.com/']
			}
		});

		assert.deepStrictEqual(revived.sharedSessionCookies, isWeb ? undefined : {
			allowedOrigins: ['https://example.com']
		});
	});
});
