/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Full visible viewport height.
 *
 * On iOS 12 Safari "100vh" is the height without the browser toolbars, which is taller than what is visible and makes
 * full-height layouts (e.g. the reader) scroll slightly. The legacy shims (src/legacy/ios12-shims.js) set
 * "--viewport-height" to the real "window.innerHeight"; everywhere else the variable is unset and this is "100vh".
 */
export const VIEWPORT_HEIGHT = 'var(--viewport-height, 100vh)';
