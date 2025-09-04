import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';

export default async function DiagramPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'modernmen-yolo', 'docs', 'diagrams', `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const htmlContent = marked(fileContent);

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  } catch (error) {
    return (
      <div>
        <p>Could not find the requested diagram.</p>
      </div>
    );
  }
}
