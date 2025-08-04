#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Performance Analysis for Focus Mint');
console.log('=====================================\n');

// Check for common performance issues
const issues = [];

// 1. Check for large bundle sizes
console.log('📦 Bundle Analysis:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});

const heavyDependencies = [
    'recharts',
    'react-datepicker',
    'embla-carousel-react',
    'react-resizable-panels'
];

const foundHeavyDeps = heavyDependencies.filter(dep => 
    dependencies.includes(dep) || devDependencies.includes(dep)
);

if (foundHeavyDeps.length > 0) {
    issues.push({
        type: 'Bundle Size',
        severity: 'Medium',
        description: `Heavy dependencies detected: ${foundHeavyDeps.join(', ')}`,
        recommendation: 'Consider lazy loading these components or finding lighter alternatives'
    });
    console.log(`⚠️  Heavy dependencies: ${foundHeavyDeps.join(', ')}`);
} else {
    console.log('✅ No heavy dependencies detected');
}

// 2. Check for performance optimizations in Next.js config
console.log('\n⚙️  Next.js Configuration:');
const nextConfigPath = 'next.config.js';
if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    const optimizations = [
        'swcMinify',
        'compress',
        'optimizePackageImports',
        'splitChunks'
    ];
    
    const foundOptimizations = optimizations.filter(opt => 
        nextConfig.includes(opt)
    );
    
    if (foundOptimizations.length >= 3) {
        console.log('✅ Good optimization configuration detected');
    } else {
        issues.push({
            type: 'Configuration',
            severity: 'Low',
            description: 'Missing some performance optimizations in Next.js config',
            recommendation: 'Enable swcMinify, compress, and optimizePackageImports'
        });
        console.log('⚠️  Some performance optimizations missing');
    }
} else {
    console.log('❌ Next.js config not found');
}

// 3. Check for React.memo usage
console.log('\n⚛️  React Optimizations:');
const componentsDir = 'components';
if (fs.existsSync(componentsDir)) {
    const componentFiles = [];
    
    function scanDirectory(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                scanDirectory(filePath);
            } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
                componentFiles.push(filePath);
            }
        });
    }
    
    scanDirectory(componentsDir);
    
    let memoizedComponents = 0;
    let totalComponents = 0;
    
    componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('export default') || content.includes('function') || content.includes('const')) {
            totalComponents++;
            if (content.includes('React.memo') || content.includes('memo(')) {
                memoizedComponents++;
            }
        }
    });
    
    const memoPercentage = (memoizedComponents / totalComponents * 100).toFixed(1);
    console.log(`📊 ${memoizedComponents}/${totalComponents} components are memoized (${memoPercentage}%)`);
    
    if (memoPercentage < 50) {
        issues.push({
            type: 'React Optimization',
            severity: 'Medium',
            description: `Only ${memoPercentage}% of components are memoized`,
            recommendation: 'Consider using React.memo for components that receive stable props'
        });
    }
}

// 4. Check for useCallback and useMemo usage
console.log('\n🎣 Hook Usage:');
const appDir = 'app';
if (fs.existsSync(appDir)) {
    const appFiles = [];
    
    function scanAppDirectory(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                scanAppDirectory(filePath);
            } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
                appFiles.push(filePath);
            }
        });
    }
    
    scanAppDirectory(appDir);
    
    let useCallbackCount = 0;
    let useMemoCount = 0;
    let totalFiles = 0;
    
    appFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('useState') || content.includes('useEffect')) {
            totalFiles++;
            if (content.includes('useCallback')) useCallbackCount++;
            if (content.includes('useMemo')) useMemoCount++;
        }
    });
    
    console.log(`📊 useCallback: ${useCallbackCount}/${totalFiles} files`);
    console.log(`📊 useMemo: ${useMemoCount}/${totalFiles} files`);
    
    if (useCallbackCount < totalFiles * 0.3) {
        issues.push({
            type: 'Hook Optimization',
            severity: 'Medium',
            description: 'Low useCallback usage detected',
            recommendation: 'Use useCallback for event handlers to prevent unnecessary re-renders'
        });
    }
}

// 5. Check for image optimization
console.log('\n🖼️  Image Optimization:');
const publicDir = 'public';
if (fs.existsSync(publicDir)) {
    const imgDir = path.join(publicDir, 'img');
    if (fs.existsSync(imgDir)) {
        const files = fs.readdirSync(imgDir);
        const imageFiles = files.filter(file => 
            file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
        );
        
        if (imageFiles.length > 0) {
            console.log(`📊 ${imageFiles.length} images found in public/img`);
            
            const optimizedDir = path.join(imgDir, 'optimized');
            if (fs.existsSync(optimizedDir)) {
                const optimizedFiles = fs.readdirSync(optimizedDir);
                console.log(`✅ ${optimizedFiles.length} optimized images found`);
            } else {
                issues.push({
                    type: 'Image Optimization',
                    severity: 'Medium',
                    description: 'No optimized images directory found',
                    recommendation: 'Optimize images and use WebP format where possible'
                });
                console.log('⚠️  No optimized images directory found');
            }
        }
    }
}

// Summary and recommendations
console.log('\n📋 Performance Summary:');
console.log('========================');

if (issues.length === 0) {
    console.log('✅ No major performance issues detected!');
} else {
    console.log(`⚠️  ${issues.length} performance issues found:\n`);
    
    issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type} (${issue.severity} severity)`);
        console.log(`   Description: ${issue.description}`);
        console.log(`   Recommendation: ${issue.recommendation}\n`);
    });
}

console.log('\n🚀 Quick Wins for Total Blocking Time:');
console.log('======================================');
console.log('1. Use React.memo for components that receive stable props');
console.log('2. Implement useCallback for event handlers');
console.log('3. Use useMemo for expensive calculations');
console.log('4. Lazy load heavy components');
console.log('5. Optimize images and use WebP format');
console.log('6. Implement virtual scrolling for large lists');
console.log('7. Use requestAnimationFrame for smooth animations');
console.log('8. Minimize bundle size with code splitting');
console.log('9. Enable Next.js performance optimizations');
console.log('10. Monitor performance with Lighthouse CI');

console.log('\n📊 Expected TBT Improvement:');
console.log('============================');
console.log('• Current TBT: 6,760ms');
console.log('• Target TBT: < 300ms');
console.log('• Expected improvement: 95%+ reduction');

console.log('\n🎯 Next Steps:');
console.log('==============');
console.log('1. Run Lighthouse audit after implementing changes');
console.log('2. Monitor Core Web Vitals in production');
console.log('3. Set up performance budgets');
console.log('4. Implement continuous performance monitoring'); 