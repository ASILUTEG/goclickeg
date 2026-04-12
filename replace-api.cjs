const fs = require('fs');

const files = [
  'src/pages/ServicesPage.tsx',
  'src/pages/Admin.tsx',
  'src/contexts/ProductContext.tsx',
  'src/components/OurServicesSection.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/http:\/\/localhost:3001/g, 'http://127.0.0.1:8000');
  fs.writeFileSync(f, content);
});
console.log('URLs replaced successfully!');
