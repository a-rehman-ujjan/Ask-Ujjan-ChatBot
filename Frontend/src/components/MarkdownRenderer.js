// components/MarkdownRenderer.js
import React from 'react';
import ReactMarkdown from 'react-markdown';

const MDR = ({ content }) => {
  content = content.replace(/\n\s*\n/g, '\n');
  return (
    <div className="markdown-content">
      <ReactMarkdown className={'-mt-7'}>{content}</ReactMarkdown>
    </div>
  );
};

export default MDR;