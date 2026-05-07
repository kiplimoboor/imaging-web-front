import { useCurrentEditor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { ListButton } from "../tiptap-ui/list-button";
import { Spacer } from "../tiptap-ui-primitive/spacer";
import { ToolbarGroup, ToolbarSeparator } from "../tiptap-ui-primitive/toolbar";

function TipTapToolbar() {
  return (
    <>
      <Spacer />
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
        <CaseButton />
      </ToolbarGroup>

      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingButton level={1} />
        <HeadingButton level={2} />
        <ListButton type="bulletList" />
        <ListButton type="orderedList" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
      </ToolbarGroup>

      <Spacer />
    </>
  );
}

export function CaseButton() {
  const { editor } = useCurrentEditor();
  const [isUpper, setIsUpper] = useState(false);

  const handleCase = useCallback(() => {
    if (!editor || editor.state.selection.empty) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    const newText = isUpper ? selectedText.toLowerCase() : selectedText.toUpperCase();
    editor.chain().focus().insertContentAt({ from, to }, newText).setTextSelection({ from, to }).run();
    setIsUpper(!isUpper);
  }, [editor, isUpper]);

  if (!editor) return null;

  return (
    <button title="Switch case" className="tiptap-button" data-style="ghost" onClick={handleCase}>
      Aa
    </button>
  );
}

export default TipTapToolbar;
