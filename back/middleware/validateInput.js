const sanitizeInput= require("../utils/sanitizeInput");

const validateInput = (req, res, next) => {
    const { code, language, input } = req.body;
  
    // Validate language
    const allowedLanguages = ['cpp', 'javascript', 'java', 'python'];
    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({ error: 'Unsupported language' });
    }
  
    // Sanitize inputs
    req.body.code = sanitizeInput(code, language);
    req.body.language = language;
    req.body.input = input ? sanitizeInput(input, language) : '';
  
    next();
  };

  module.exports = validateInput;
