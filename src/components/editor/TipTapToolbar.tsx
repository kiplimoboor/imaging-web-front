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

export default TipTapToolbar;
