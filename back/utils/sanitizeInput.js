const sanitizeInput = (input, language) => {
  // If input is not a string, return it safely
  if (typeof input !== 'string') return input;

  // Minimal sanitization that doesn't break code syntax
  switch (language) {
    case 'cpp':
      return input
        .replace(/\b(system|exec|popen|fork)\s*\(/gi, '') // Block dangerous system calls
        .replace(/`/g, ''); // Remove backticks that might be used for command injection

    case 'javascript':
      return input
        .replace(/eval\s*\(/gi, '')        // Prevent eval
        .replace(/require\s*\(/gi, '')     // Block require
        .replace(/process\s*\./gi, '');    // Prevent process access

    case 'python':
      return input
        .replace(/\bimport\s+(os|sys)\b/gi, '')  // Block dangerous imports
        .replace(/\b(exec|eval)\s*\(/gi, '');    // Prevent exec and eval

    case 'java':
      return input
        .replace(/\b(Runtime\.getRuntime\(\)|System\.exit|ProcessBuilder)\b/gi, '') // Block runtime execution & process handling
        .replace(/\b(import\s+java\.io\.\*|import\s+java\.lang\.reflect\.\*)\b/gi, ''); // Prevent IO and reflection imports

    default:
      return input;
  }
};

module.exports = sanitizeInput;
