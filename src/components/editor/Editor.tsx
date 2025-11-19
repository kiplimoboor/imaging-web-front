import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./editor.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import type { Study } from "@/types";
import { Toolbar } from "../tiptap-ui-primitive/toolbar";
import EditorActions from "./EditorActions";
import TipTapToolbar from "./TipTapToolbar";

const API_URL = import.meta.env.VITE_API_URL;

function Editor() {
	const { uid } = useParams();
	const { user } = useAuth();
	const [study, setStudy] = useState<Study | null>(null);
	const [editable, setEditable] = useState(true);

	useEffect(() => {
		const getStudywithNote = async () => {
			const res = await fetch(API_URL + "/notes/" + uid, { credentials: "include" });
			const data: Study = await res.json();
			const editable = data.radiologist === user?.id || data.student === user?.id;
			setEditable(editable);
			setStudy(data);
		};

		getStudywithNote();
	}, [uid, user]);

	const editor = useEditor(
		{
			immediatelyRender: true,
			editorProps: { attributes: { class: "simple-editor" } },
			extensions: [StarterKit.configure({}), TextAlign.configure({ types: ["heading", "paragraph"] }), Typography],
			content: study?.note || "",
			editable,
		},
		[study, editable],
	);

	return (
		<div>
			<EditorContext.Provider value={{ editor }}>
				{editable && study && (
					<>
						<EditorActions editor={editor} study={study} setStudy={setStudy} />
						<Toolbar>
							<TipTapToolbar />
						</Toolbar>
					</>
				)}
				<EditorContent editor={editor} role="presentation" className="simple-editor-content" />
			</EditorContext.Provider>
		</div>
	);
}

export default Editor;
