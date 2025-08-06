/**
 * Environment Setup Script for Angular Maps Application
 * 
 * This script creates environment configuration files for the Angular application
 * by reading environment variables and generating TypeScript environment files.
 * It's typically run during the build process to inject API keys and other
 * sensitive configuration values that shouldn't be committed to version control.
 */

const { writeFileSync, mkdirSync } = require("fs");

// Load environment variables from .env file
require("dotenv").config();

// Define paths for the environment files
const targetPath = "./src/environments/environment.ts";
const targetPathDev = "./src/environments/environment.development.ts";

// Get the baseURL from environment variables
const baseUrl = process.env["BASE_URL"];

// Validate that the required environment variable is set
if (!baseUrl) {
  throw new Error("BASE_URL is not set in the environment variables.");
}

// Create the content for the environment files
// This will be written as a TypeScript module that exports the configuration
const envFileContent = `
   export const environment = {
    baseUrl: "${baseUrl}",
   }
`;

// Ensure the environments directory exists
mkdirSync("./src/environments", { recursive: true });

// Write the environment configuration to both production and development files
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
