const fs = require('fs');
const files = [
  'src/components/layout.tsx',
  'src/components/ui/three-dwall-calendar.tsx',
  'src/components/ui/ai-input.tsx',
  'src/components/ui/leads-data-table.tsx',
  'src/App.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
});
console.log('Done');
