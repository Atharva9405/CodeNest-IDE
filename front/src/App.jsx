import './App.css';
import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SiJavascript, SiPython, SiCplusplus, SiOpenjdk } from "react-icons/si";


function App() {
  const [code, setCode] = useState({
    cpp: `//start coding here...
    
#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    javascript: `//start coding here...
        
function func() {
    console.log("Hello, World!");
}

func();`,
    java: `//start coding here...
        
public class Main {

public static void main(String[] args) {
    System.out.println("Hello, World!");
}
}`,
    python: `#start coding here...
print("Hello, World!")
     `,
  });

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [currentLang, setCurrentLang] = useState('cpp');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');

  const languageIcons = {
    cpp: <SiCplusplus className="text-blue-500 text-xl" />, // C++ icon
    javascript: <SiJavascript className="text-yellow-500 text-xl" />, // JavaScript icon
    java: <SiOpenjdk className="text-red-500 text-xl" />, // OpenJDK icon (closest to Java)
    python: <SiPython className="text-blue-300 text-xl" />, // Python icon
  };

  // Download code
  const downloadCode = () => {
    if (!code[currentLang]) return;

    // Define file extensions
    const extensions = {
      javascript: "js",
      python: "py",
      cpp: "cpp",
      java: "java",
    };

    const fileExtension = extensions[currentLang] || "txt";

    // Create and trigger download
    const blob = new Blob([code[currentLang]], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle language change
  const handleChange = (event) => {
    const selectedLang = event.target.value;
    setCurrentLang(selectedLang);
  };

  const handleEditorChange = (value) => {
    setCode((prevCode) => ({
      ...prevCode,
      [currentLang]: value,
    }));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const response = await axios.post('http://localhost:3000/execute',
        { code: code[currentLang], language: currentLang, input: input + '\n' },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(`Error: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
  };

  useEffect(() => {
    console.log(currentLang);
  }, [code, currentLang]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 font-sans">
      <div className="h-full w-full bg-gray-850 rounded-xl border border-gray-700 shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-indigo-800 to-purple-700 p-4 rounded-t-xl">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label htmlFor="languages" className="text-gray-100 text-sm font-medium">
                Language:
              </label>
            </div>
            <div className="relative">
              <select
                id="languages"
                value={currentLang}
                onChange={handleChange}
                className="w-40 pl-10 pr-3 py-2 bg-opacity-20 bg-black text-white text-sm border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
              >
                <option className='text-black' value="cpp">C++</option>
                <option className='text-black' value="javascript">JavaScript</option>
                <option className='text-black' value="java">Java</option>
                <option className='text-black' value="python">Python</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {languageIcons[currentLang]}
              </div>
            </div>
            <button 
              onClick={toggleTheme} 
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-sm flex items-center"
            >
              {theme === 'vs-dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          
          <h1 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100 tracking-tight">
            CodeNest <span className="text-lg font-light">IDE</span>
          </h1>
          
          <div className="flex items-center space-x-3">
            <button
              className={`px-5 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2 ${
                isRunning 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
              }`}
              onClick={handleRun}
              disabled={isRunning}
            >
              <span>{isRunning ? '⏳' : '▶️'}</span>
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>

            <button 
              className="px-5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center space-x-2" 
              onClick={downloadCode}
            >
              <span>💾</span>
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 h-[calc(100%-4rem)] overflow-hidden">
          {/* Editor Section - Left Side */}
          <div className="w-2/3 border-r border-gray-700 relative">
            <div className="absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-70 px-4 py-1 z-10 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-xs font-mono text-gray-400 mr-2">●</span>
                <span className="text-xs font-mono text-gray-300">{`code.${currentLang === 'javascript' ? 'js' : currentLang}`}</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <Editor
              height="100%"
              language={currentLang}
              value={code[currentLang]}
              theme={theme}
              onChange={handleEditorChange}
              options={{
                fontSize: 16,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                selectOnLineNumbers: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: { other: true, comments: true, strings: true },
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true,
                smoothScrolling: true,
                padding: { top: 20 }
              }}
              className="pt-8"
            />
          </div>

          {/* Input/Output Section - Right Side */}
          <div className="w-1/3 flex flex-col p-4 space-y-4 bg-gray-850">
            {/* Input Box */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-gray-300 text-2xl font-semibold">Input</h3>
                <span className="text-xs text-gray-500 font-mono">stdin</span>
              </div>
              <textarea
                className="w-full custom-scrollbar h-[calc(50%-2rem)] bg-gray-800 text-gray-200 border border-gray-700 rounded-xl p-4 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                placeholder="Enter your program input here..."
                value={input}
                onChange={handleInputChange}
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>

            {/* Output Box */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-gray-300 text-2xl font-semibold">Output</h3>
                <span className="text-xs text-gray-500 font-mono">stdout</span>
              </div>
              <div
                className={`w-full h-[calc(50%-2rem)] bg-gray-800 text-gray-200 border custom-scrollbar ${
                  output.includes('Error:') ? 'border-red-600' : 'border-gray-700'
                } rounded-xl p-4 overflow-auto font-mono text-sm`}
              >
                <pre className="whitespace-pre-wrap text-left">{output}</pre>
              </div>
            </div>
            
            {/* Status bar */}
            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-2">
              <div>Status: {isRunning ? 'Running' : 'Ready'}</div>
              <div>Language: {currentLang.toUpperCase()}</div>
              <div>Theme: {theme === 'vs-dark' ? 'Dark' : 'Light'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;