const languageConfig = {
    cpp: {
        image: 'gcc:latest',
        file: 'code.cpp',
        compileCmd: 'g++ code.cpp -o output && ./output<input.txt',
    },
    javascript: {
        image: 'node:latest',
        file: 'code.js',
        compileCmd: 'node code.js <input.txt',
    },
    java: {
        image: 'openjdk:11',
        file: 'Main.java',
        compileCmd: 'javac Main.java && java -cp . Main<input.txt',
    }, python: {
        image: 'python:3.9',
        file: 'code.py',
        compileCmd: 'python code.py<input.txt',
    }
};

module.exports= languageConfig;