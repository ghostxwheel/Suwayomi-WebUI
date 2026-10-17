/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Lazy loaded (see "MangaNotes.tsx"): the editor is the only part of the manga page that needs tiptap/prosemirror,
// which otherwise made up most of the manga page's chunk.

import { useRef } from 'react';
import { useLingui } from '@lingui/react/macro';
import StarterKit from '@tiptap/starter-kit';
import {
    MenuButton,
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonRedo,
    MenuButtonUndo,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    type RichTextEditorRef,
} from 'mui-tiptap';
import { Markdown } from '@tiptap/markdown';
import { Placeholder } from '@tiptap/extension-placeholder';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClearContentShortcut, SaveContentShortcut } from '@/lib/mui-tiptap/MuiTipTap.shortcut.util.ts';

export const MangaNotesEditor = ({
    notes,
    onChange,
    onSave,
    onClose,
}: {
    notes: string;
    onChange: (notes: string) => void;
    onSave: (notes: string) => void;
    onClose: () => void;
}) => {
    const { t } = useLingui();

    const rteRef = useRef<RichTextEditorRef>(null);

    return (
        <RichTextEditor
            ref={rteRef}
            extensions={[
                StarterKit,
                Markdown,
                Placeholder.configure({
                    placeholder: t`Add a private note about this manga`,
                }),
                ClearContentShortcut.extension,
                SaveContentShortcut((editor, unchangedContent) => {
                    if (unchangedContent) {
                        onClose();
                        return true;
                    }

                    onSave(editor.getMarkdown());

                    return true;
                }).extension,
            ]}
            content={notes.trim()}
            contentType="markdown"
            onUpdate={({ editor }) => {
                onChange(editor.getMarkdown());
            }}
            renderControls={() => (
                <MenuControlsContainer>
                    <MenuButtonUndo />
                    <MenuButtonRedo />
                    <MenuDivider />
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonBulletedList />
                    <MenuButtonOrderedList />
                    <MenuDivider />
                    <MenuButton
                        tooltipLabel={t`Clear notes`}
                        onClick={() => rteRef.current?.editor?.chain().focus().clearContent().run()}
                        tooltipShortcutKeys={ClearContentShortcut.tooltipKeys}
                    >
                        <DeleteIcon color="inherit" />
                    </MenuButton>
                </MenuControlsContainer>
            )}
        />
    );
};
