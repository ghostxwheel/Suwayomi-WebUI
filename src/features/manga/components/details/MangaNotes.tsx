/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useLingui } from '@lingui/react/macro';
import { loadable } from 'react-lazily/loadable';
import { makeToast } from '@/base/utils/Toast.ts';
import type { MangaIdInfo, MangaMetaInfo } from '@/features/manga/Manga.types.ts';
import { updateMangaMetadata, useGetMangaMetadata } from '@/features/manga/services/MangaMetadata.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { MarkdownViewer } from '@/lib/mui-tiptap/MarkdownViewer.tsx';
import Typography from '@mui/material/Typography';
import { lazyLoadFallback } from '@/base/utils/LazyLoad.tsx';

// tiptap/prosemirror are only needed for editing - loading them with the manga page made up most of its chunk
const { MangaNotesEditor } = loadable(
    () => import('@/features/manga/components/details/MangaNotesEditor.tsx'),
    lazyLoadFallback,
);

export const MangaNotesButton = ({ manga, notes }: { manga: MangaIdInfo & MangaMetaInfo; notes: string }) => {
    const { t } = useLingui();

    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState(notes);

    const hasNotes = notes.trim().length > 0;
    const isUnchanged = draft.trimEnd() === notes;

    const openDialog = () => {
        setDraft(notes);
        setIsOpen(true);
    };

    const closeDialog = () => setIsOpen(false);

    const saveNotes = (content: string) => {
        const nextNotes = content.trimEnd();

        void updateMangaMetadata(manga, 'notes', nextNotes)
            .then(() => {
                makeToast(t`Notes saved`, 'success');
                setIsOpen(false);
            })
            .catch((error) => makeToast(t`Could not save notes`, 'error', getErrorMessage(error)));
    };

    return (
        <>
            <Button size="small" onClick={openDialog} variant="text">
                {hasNotes ? t`Edit` : t`Add`}
            </Button>
            <Dialog open={isOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>{hasNotes ? t`Edit notes` : t`Add notes`}</DialogTitle>
                <DialogContent>
                    <MangaNotesEditor notes={notes} onChange={setDraft} onSave={saveNotes} onClose={closeDialog} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>{t`Cancel`}</Button>
                    <Button onClick={() => saveNotes(draft)} disabled={isUnchanged} variant="contained">
                        {t`Save`}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const MangaNotes = ({ manga, showDivider }: { manga: MangaIdInfo & MangaMetaInfo; showDivider: boolean }) => {
    const { t } = useLingui();

    const { notes } = useGetMangaMetadata(manga);
    const hasNotes = notes.trim().length > 0;

    return (
        <Stack sx={{ alignItems: 'flex-start', gap: 1 }}>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1">{t`Notes`}</Typography>
                <MangaNotesButton manga={manga} notes={notes} />
            </Stack>
            {hasNotes && <MarkdownViewer markdown={notes.trim()} />}
            {showDivider && <Divider flexItem sx={{ my: 1 }} />}
        </Stack>
    );
};
