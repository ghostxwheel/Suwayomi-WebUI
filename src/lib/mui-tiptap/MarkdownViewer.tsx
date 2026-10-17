/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { getEditorStyles } from 'mui-tiptap';
import { markdownToSafeHtml } from '@/lib/Markdown.ts';

/**
 * Renders the sanitized html with mui-tiptap's editor content styles.
 *
 * This used to be a read-only tiptap editor ("RichTextReadOnly"), which made the manga page load and instantiate the
 * whole tiptap/prosemirror stack just to display the description and notes - by far the largest part of its chunk,
 * which is slow to download and parse on old devices.
 */
export const MarkdownViewer = ({ markdown }: { markdown: string }) => {
    const html = useMemo(() => markdownToSafeHtml(markdown), [markdown]);

    return (
        <Box
            sx={(theme) => ({
                ...getEditorStyles(theme),
                overflowWrap: 'break-word',

                display: 'flex',
                flexDirection: 'column',
                rowGap: '1rem',

                textAlign: 'justify',
                textJustify: 'inter-word',

                '& > *': {
                    margin: 0,
                },
            })}
            // oxlint-disable-next-line react/no-danger -- sanitized by DOMPurify (markdownToSafeHtml)
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
