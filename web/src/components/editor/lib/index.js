import { Editor } from 'tiptap';
import { Blockquote, Bold, BulletList, Code, CodeBlock, History, Italic, Link, ListItem, OrderedList, Placeholder, Strike, TrailingNode, Underline } from 'tiptap-extensions';
import Paragraph from './Paragraph';
import TextColor from './TextColor';
import BgColor from './BgColor';
import ListMerger from './ListMerger';
import TabEater from './TabEater';
export function createEditor(_a) {
    var content = _a.content, editable = _a.editable, onUpdate = _a.onUpdate;
    var extensions = [
        new Paragraph(),
        new TextColor(),
        new BgColor(),
        new Bold(),
        new Blockquote(),
        new Italic(),
        new Underline(),
        new Strike(),
        new Code(),
        new CodeBlock(),
        new History(),
        new BulletList(),
        new ListItem(),
        new OrderedList(),
        new ListMerger(),
        new Link(),
        new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph']
        }),
        new Placeholder(),
        new TabEater()
    ];
    return new Editor({
        editable: editable,
        extensions: extensions,
        content: content,
        onUpdate: onUpdate,
        emptyDocument: {
            type: 'doc',
            content: content
        }
    });
}
//# sourceMappingURL=index.js.map