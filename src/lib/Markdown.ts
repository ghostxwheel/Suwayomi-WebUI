/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Kept out of "HelperFunctions.ts" on purpose: that file is imported almost everywhere, which put "marked" and
// "dompurify" (~110 KB, incl. marked's regex setup on load) into the entry chunk although only the manga notes and
// the markdown viewer need them.

import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const markdownToSafeHtml = (markdown: string): string => {
    const html = marked.parse(markdown, {
        async: false,
        breaks: true,
        gfm: false,
    });

    return DOMPurify.sanitize(html, {
        USE_PROFILES: {
            html: true,
        },
    });
};
