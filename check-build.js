// check-build.js
import { execSync } from 'child_process';

console.log('🧪 Testing production build locally...');

try {
  // Build en mode production
  execSync('npm run build', { stdio: 'inherit' });
  
  // Vérifier que les fichiers sont présents
  const fs = require('fs');
  const files = fs.readdirSync('build');
  
  console.log('✅ Build successful! Files created:');
  files.forEach(file => console.log(`   - ${file}`));
  
  // Vérifier la présence des fichiers critiques
  const criticalFiles = ['index.html', 'assets', '_app'];
  const missingFiles = criticalFiles.filter(file => 
    !files.some(f => f.includes(file))
  );
  
  if (missingFiles.length > 0) {
    console.log('❌ Missing critical files:', missingFiles);
    process.exit(1);
  }
  
  console.log('🎉 All checks passed! Ready for deployment.');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}