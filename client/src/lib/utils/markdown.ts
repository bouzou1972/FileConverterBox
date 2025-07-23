export function convertMarkdownToHTML(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Lists
    .replace(/^\* (.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraphs if not starting with heading or list
  if (html && !html.startsWith('<h') && !html.startsWith('<ul')) {
    html = '<p>' + html + '</p>';
  }

  return html;
}

export function createFullHTMLDocument(content: string, title = 'Converted from Markdown'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
        }
        h1, h2, h3 { color: #333; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul { padding-left: 20px; }
        code { 
            background-color: #f1f1f1; 
            padding: 2px 4px; 
            border-radius: 4px; 
            font-family: monospace; 
        }
        blockquote { 
            border-left: 4px solid #ddd; 
            margin: 0; 
            padding-left: 16px; 
            color: #666; 
        }
    </style>
</head>
<body>
${content}
</body>
</html>`;
}

export const sampleMarkdown = `# Sample Markdown Document

This is a **sample** markdown document with *various* formatting options.

## Features Included

- **Bold text** with double asterisks
- *Italic text* with single asterisks
- [Links](https://example.com) with bracket notation
- \`Inline code\` with backticks

### Lists

- First item
- Second item
- Third item

## Code and Text

You can include \`inline code\` as well as regular text.

### Paragraphs

This is a regular paragraph with some text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

This is another paragraph separated by a blank line.

> This would be a blockquote if fully supported.`;
