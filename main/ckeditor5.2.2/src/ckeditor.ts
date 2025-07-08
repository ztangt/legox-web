/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading, Title } from '@ckeditor/ckeditor5-heading';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import {
	AutoImage,
	Image,
	ImageCaption,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link, LinkImage } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { PageBreak } from '@ckeditor/ckeditor5-page-break';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import {
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials
} from '@ckeditor/ckeditor5-special-characters';

import {
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar
  // @ts-ignore
} from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {}
class DynamicTable extends Plugin {
  init() {
    const editor = this.editor;

    const tableHTMLStr = `<figure class="table" style="width: 100%">
    <table class="ck-table-resized dynamicTable">
      <colgroup>
        <col style="width: 25%" />
        <col style="width: 25%" />
        <col style="width: 25%" />
        <col style="width: 25%" />
      </colgroup>
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td
            colspan="5"
            align="center"
            contenteditable="false"
            style="border: 0px solid rgb(238, 238, 238)"
          >
            表格行数会根据实际数据量自动加载
          </td>
        </tr>
      </tfoot>
    </table>
  </figure>`;

    editor.ui.componentFactory.add('dynamicTable', () => {
      // The button will be an instance of ButtonView.
      const button = new ButtonView();

      button.set({
        label: '动态表格',
        withText: true,
      });

      button.set('class', 'ckeditor-dynamic-table-button');
      //Execute a callback function when the button is clicked
      button.on('execute', () => {
        //Change the model using the model writer
        editor.model.change(writer => {
          const viewFragment = editor.data.processor.toView(tableHTMLStr);
          const modelFragment = editor.data.toModel(viewFragment);

          editor.model.insertContent(modelFragment);
        });
      });

      return button;
    });
  }
}


Editor.builtinPlugins=[
  // CKBox,
  Alignment,
  AutoImage,
  Autoformat,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  LinkImage,
  List,
  MediaEmbed,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Title,
  // @ts-ignore
  DynamicTable,
];

Editor.defaultConfig = {
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        attributes: true,
        classes: true,
        styles: true
      }
    ],
    disallow:[
      {name: 'script',},//禁止script标签 保证安全
    ]
  },
  toolbar: {
    items: [
      'heading',
      '|',
      'fontBackgroundColor',
      'fontColor',
      'fontSize',
      'fontFamily',
      '|',
      'bold',
      'italic',
      'link',
      'alignment',
      '|',
      'imageInsert',
      'imageUpload',
      'insertTable',
      'dynamicTable',
      'pageBreak',
      '|',
      'undo',
      'redo',
      'sourceEditing'
    ]
  },
  language: 'zh-cn',
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      'linkImage'
    ]
  },
// @ts-ignore
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  }
};

export default Editor;
