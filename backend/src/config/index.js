import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Convert Windows path to WSL path if needed
const convertToWSLPath = (windowsPath) => {
    // Remove drive letter and convert backslashes
    return windowsPath
        .replace(/^[A-Za-z]:/, '')
        .replace(/\\/g, '/')
        .replace(/^/, '/mnt/c');
};

const projectRoot = process.env.PROJECT_ROOT || convertToWSLPath(process.cwd());

export const config = {
    dataDir: path.join(projectRoot, 'backend', 'data'),
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    logDir: path.join(projectRoot, 'backend', 'logs')
}; 