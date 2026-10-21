import fs from 'node:fs';
import path from 'node:path';

function buildSimplePdf(lines) {
  // Build a valid PDF 1.4 document
  // Stream instructions:
  let streamContent = 'BT\n';
  let currentY = 740;
  
  for (const item of lines) {
    if (item.type === 'title') {
      streamContent += `/F1 20 Tf\n`;
      streamContent += `50 ${currentY} Td\n`;
      streamContent += `(${escapePdf(item.text)}) Tj\n`;
      streamContent += `0 0 Td\n`; // reset
      currentY -= 24;
    } else if (item.type === 'subtitle') {
      streamContent += `/F1 11 Tf\n`;
      streamContent += `50 ${currentY} Td\n`;
      streamContent += `(${escapePdf(item.text)}) Tj\n`;
      streamContent += `0 0 Td\n`;
      currentY -= 16;
    } else if (item.type === 'contact') {
      streamContent += `/F2 9 Tf\n`;
      streamContent += `50 ${currentY} Td\n`;
      streamContent += `(${escapePdf(item.text)}) Tj\n`;
      streamContent += `0 0 Td\n`;
      currentY -= 20;
    } else if (item.type === 'section') {
      currentY -= 6;
      streamContent += `/F1 12 Tf\n`;
      streamContent += `50 ${currentY} Td\n`;
      streamContent += `(${escapePdf(item.text)}) Tj\n`;
      streamContent += `0 0 Td\n`;
      currentY -= 14;
    } else if (item.type === 'itemHeader') {
      streamContent += `/F1 10 Tf\n`;
      streamContent += `50 ${currentY} Td\n`;
      streamContent += `(${escapePdf(item.text)}) Tj\n`;
      streamContent += `0 0 Td\n`;
      currentY -= 12;
    } else if (item.type === 'bullet') {
      streamContent += `/F2 8.5 Tf\n`;
      streamContent += `60 ${currentY} Td\n`;
      streamContent += `(- ${escapePdf(item.text)}) Tj\n`;
      streamContent += `0 0 Td\n`;
      currentY -= 11;
    } else if (item.type === 'body') {
      streamContent += `/F2 9 Tf\n`;
      streamContent += `50 ${currentY} Td\n`;
      streamContent += `(${escapePdf(item.text)}) Tj\n`;
      streamContent += `0 0 Td\n`;
      currentY -= 12;
    }
  }
  streamContent += 'ET\n';

  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n'
  );
  objects.push(
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n'
  );
  objects.push(
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  );
  objects.push(
    `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`
  );

  let pdf = '%PDF-1.4\n';
  const xref = [0];
  let offset = Buffer.byteLength(pdf, 'utf-8');

  for (const obj of objects) {
    xref.push(offset);
    pdf += obj;
    offset += Buffer.byteLength(obj, 'utf-8');
  }

  const startxref = offset;
  pdf += `xref\n0 ${xref.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < xref.length; i++) {
    pdf += String(xref[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf-8');
}

function escapePdf(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

const resumeData = [
  { type: 'title', text: 'ASHISH SAHU' },
  { type: 'subtitle', text: 'Full Stack Developer | B.Tech Computer Science & Engineering (Class of 2026)' },
  { type: 'contact', text: 'India | ashishsahu01072005@gmail.com | github.com/Ashishsahu0107 | linkedin.com/in/ashishsahu0107' },
  
  { type: 'section', text: 'EDUCATION' },
  { type: 'itemHeader', text: 'Bachelor of Technology in Computer Science & Engineering (2022 - 2026)' },
  { type: 'bullet', text: 'Core Studies: Data Structures & Algorithms (Java), DBMS, OS, Computer Networks, Software Engineering' },
  { type: 'bullet', text: 'Focus on full-stack web architectures, algorithmic problem solving, and modern cloud deployment' },

  { type: 'section', text: 'TECHNICAL SKILLS' },
  { type: 'bullet', text: 'Languages: JavaScript (ES6+), Java, SQL, HTML5, CSS3' },
  { type: 'bullet', text: 'Frontend: React 19, Next.js, Tailwind CSS, GSAP, Responsive Design, WCAG Accessibility' },
  { type: 'bullet', text: 'Backend: Node.js, Express.js, RESTful API Design, JWT Authentication, Middleware' },
  { type: 'bullet', text: 'Databases & Tools: MongoDB, MongoDB Atlas, MySQL, Git, GitHub, Postman, Vite, VS Code' },

  { type: 'section', text: 'FEATURED PROJECTS' },
  { type: 'itemHeader', text: '1. Learning Management System (LMS) - MERN Stack' },
  { type: 'bullet', text: 'Institutional platform with RBAC (Admin, Instructor, Student), quizzes with auto-grading, and attendance.' },
  { type: 'bullet', text: 'Engineered with React, Node.js, Express, MongoDB, and Tailwind CSS. Achieved sub-2s response times.' },
  
  { type: 'itemHeader', text: '2. Developer Portfolio 2.0 - React 19 & GSAP' },
  { type: 'bullet', text: 'Editorial magazine-grade developer showcase pairing Playfair Display typography with GPU animations.' },
  { type: 'bullet', text: 'Targeting 95+ Google Lighthouse scores, JSON-LD Person schema, and WCAG AA contrast compliance.' },

  { type: 'itemHeader', text: '3. E-Commerce Storefront Platform - Full Stack' },
  { type: 'bullet', text: 'Full-featured online commerce platform with product filtering, persistent cart, and order management.' },
  { type: 'bullet', text: 'Built with React, Express REST APIs, MongoDB indexing, and secure transaction handling.' },

  { type: 'itemHeader', text: '4. Collaborative Real-Time Kanban Hub' },
  { type: 'bullet', text: 'Agile team project board with drag-and-drop task workflow columns, priorities, and deadlines.' },
  { type: 'bullet', text: 'Built with React, Express, MongoDB, and clean event synchronization.' },

  { type: 'section', text: 'TECHNICAL ACHIEVEMENTS & MILESTONES' },
  { type: 'bullet', text: 'Solved 200+ Data Structures & Algorithms problems in Java across competitive programming platforms.' },
  { type: 'bullet', text: 'Active open-source contributor with 20+ public repositories and clean Git commit discipline.' },
];

const outDir = path.resolve('public/resume');
fs.mkdirSync(outDir, { recursive: true });
const pdfBuffer = buildSimplePdf(resumeData);
fs.writeFileSync(path.join(outDir, 'ashish-sahu-resume.pdf'), pdfBuffer);
console.log('Successfully generated public/resume/ashish-sahu-resume.pdf (' + pdfBuffer.length + ' bytes)');
