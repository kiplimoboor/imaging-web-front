import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Editor } from "@tiptap/react";
import templates from "../data/templates";

type ChangeTemplateProps = { editor: Editor };

function ChangeTemplate({ editor }: ChangeTemplateProps) {
  const addTemplate = (template: string | null) => {
    if (!editor) return;
    if (template !== null) {
      if (editor?.getText() === "") editor.commands.setContent(templates[template]);
      else editor?.commands.setContent(editor.getHTML() + "<br>" + templates[template]);
    } else editor?.commands.setContent("");
  };

  return (
    <Autocomplete
      options={Object.keys(templates)}
      disablePortal
      sx={{ width: 300 }}
      onChange={(_, newValue: string | null) => addTemplate(newValue)}
      renderInput={(params) => <TextField {...params} label="Choose a Template" size="small" sx={{ height: 40 }} />}
    />
  );
}

export default ChangeTemplate;
