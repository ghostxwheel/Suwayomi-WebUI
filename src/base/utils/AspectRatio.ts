/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { Theme } from '@mui/material/styles';

// see ApplyStyles.ts for why not "SxProps<Theme>"
type CSSObject = ReturnType<Theme['applyStyles']>;

/**
 * "aspect-ratio" with a fallback for browsers that don't support it (Safari < 15, e.g. iOS 12).
 *
 * Without support the element just takes the height of its content, which e.g. for manga cards means the height of the
 * not-yet-loaded/loaded cover. Virtualized grids (VirtuosoGrid) expect all items to have the same size and end up in an
 * endless scroll-jumping loop if they don't.
 *
 * The fallback is the classic "padding-top" box: the element's height comes from a percentage padding (relative to the
 * width of the containing block) and its direct children are stretched over it. Thus, the element has to be as wide as
 * its containing block and its content has to be in direct children.
 *
 * @param ratio "width / height", e.g. "1 / 1.5"
 */
export const aspectRatioSx = (ratio: string): CSSObject => {
    const [width, height] = ratio.split('/').map((value) => Number(value.trim()));

    return {
        aspectRatio: ratio,
        '@supports not (aspect-ratio: 1 / 1)': {
            position: 'relative',
            height: 0,
            paddingTop: `${(height / width) * 100}%`,
            // doubled "&" to win against the children's own (single class) styles
            '&& > *': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            },
        },
    };
};
