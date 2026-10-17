/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Only used by "MarkdownViewer", which renders the html directly instead of a read-only tiptap editor (upstream).
// Kept out of "HelperFunctions.ts" on purpose: that file is imported almost everywhere, which put "marked" and
// "dompurify" (~110 KB, incl. marked's regex setup on load) into the entry chunk.

import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const markdownToSafeHtml = (markdown: string): string => {
    const html = marked.parse(markdown, {
        async: false,
        // the tiptap editor keeps single line breaks as well (notes are edited with it)
        breaks: true,
        // same as tiptap's markdown parsing (marked's defaults), e.g. "~~strike~~" written in the notes editor
        gfm: true,
    });

    return DOMPurify.sanitize(html, {
        USE_PROFILES: {
            html: true,
        },
    });
};
