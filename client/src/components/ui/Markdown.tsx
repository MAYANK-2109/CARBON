import React, { Fragment } from 'react';

interface MarkdownProps {
  content: string;
}

/**
 * Minimal, safe inline markdown renderer for assistant replies.
 *
 * Supports bold (`**text**`), inline code (`` `code` ``), bullet lists, and paragraphs.
 * Tokenizes text and renders React elements safely.
 */
export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const blocks = content.split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        const isList = lines.every((l) => /^\s*[-*]\s+/.test(l)) && lines.length > 0;

        if (isList) {
          return (
            <ul key={i} style={{ margin: '8px 0 8px 20px', paddingLeft: 0, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {lines.map((line, j) => (
                <li key={j} style={{ textAlign: 'left' }}>
                  {renderInline(line.replace(/^\s*[-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} style={{ margin: '8px 0', textAlign: 'left', lineHeight: '1.5' }}>
            {lines.map((line, j) => (
              <Fragment key={j}>
                {renderInline(line)}
                {j < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
};

/** Render bold and inline-code spans within a single line of text. */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  parts.forEach((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      nodes.push(
        <strong key={i} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    } else if (/^`[^`]+`$/.test(part)) {
      nodes.push(
        <code
          key={i}
          style={{
            borderRadius: '4px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '2px 4px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
            border: '1px solid var(--border-glass)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    } else if (part) {
      nodes.push(<Fragment key={i}>{part}</Fragment>);
    }
  });

  return nodes;
}
