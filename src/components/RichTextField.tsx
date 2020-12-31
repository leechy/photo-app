import React, { useState, useEffect } from 'react';

// @ts-ignore
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from 'draftail';
import { EditorState } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';

import './RichTextField.css';

type RichTextFieldProps = {
  value: string;
  onChange: Function;
};

const RichTextField = ({ value = '', onChange }: RichTextFieldProps) => {
  // const fromHTML = (html: string) => {
  //   console.log('fromHTML', html);
  //   return convertFromHTML(html || '');
  // }

  // const toHTML = (raw: any): string => {
  //   if (raw) {
  //     console.log('toHTML', raw);
  //     return convertToHTML(exporterConfig)(convertFromRaw(raw));
  //   }
  //   return '';
  // }

  // @ts-ignore
  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromHTML(value)));
  const [lastValue, setLastValue] = useState(value);

  useEffect(() => {
    if (value !== lastValue) {
      // @ts-ignore
      setEditorState(EditorState.createWithContent(convertFromHTML(value)));
    }
  }, [value, lastValue]);

  const updateEditorState = (newValue: EditorState) => {
    // @ts-ignore
    const newHTML = convertToHTML(newValue.getCurrentContent()) as string;
    if (newHTML !== lastValue) {
      setLastValue(newHTML);
      onChange(newHTML);
    }
    setEditorState(newValue);
  };

  return (
    <DraftailEditor
      // rawContentState={fromHTML(value)}
      // onSave={(content: any) => { console.log('location content', toHTML(content || {})) }}
      editorState={editorState}
      onChange={updateEditorState}
      blockTypes={[
        { type: BLOCK_TYPE.UNSTYLED },
        { type: BLOCK_TYPE.HEADER_TWO },
        { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
        { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
      ]}
      inlineStyles={[{ type: INLINE_STYLE.BOLD }, { type: INLINE_STYLE.ITALIC }]}
    />
  );
};

export default RichTextField;
