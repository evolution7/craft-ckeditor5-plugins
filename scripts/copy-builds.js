#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '../plugins');
const assetsDir = path.join(__dirname, '../src/assets/plugins');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Find all plugin directories
const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

console.log(`Found ${pluginDirs.length} plugins: ${pluginDirs.join(', ')}`);

pluginDirs.forEach(pluginName => {
    const pluginBuildDir = path.join(pluginsDir, pluginName, 'build');
    const targetDir = path.join(assetsDir, pluginName);
    
    if (!fs.existsSync(pluginBuildDir)) {
        console.warn(`Warning: No build directory found for ${pluginName}`);
        return;
    }
    
    // Remove existing target directory if it exists
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true });
    }
    
    // Copy build directory to assets
    copyDirectory(pluginBuildDir, targetDir);
    console.log(`Copied ${pluginName} build files to src/assets/plugins/${pluginName}`);
});

function copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}