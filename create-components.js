const fs = require('fs');
const path = require('path');

const components = [
  'Header',
  'Hero',
  'SearchCard',
  'TrustStrip',
  'ComparisonPreview',
  'PopularRoutes',
  'HowItWorks',
  'TransparentPricing',
  'Offers',
  'AppPromotion',
  'FinalCTA',
  'Footer'
];

const dir = path.join(__dirname, 'src', 'components');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

components.forEach(name => {
  const content = `import React from 'react';

export default function ${name}() {
  return (
    <section>
      <h2>${name}</h2>
    </section>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${name}.tsx`), content);
});

console.log('Components created!');
