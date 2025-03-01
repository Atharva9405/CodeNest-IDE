const Docker = require('dockerode');
const docker = new Docker();
const languageConfig = require("../config/languageConfig");


const compiler = async (req, res) => {

    const { code, language, input } = req.body;
    const config = languageConfig[language];

    if (!config) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const { image, file, compileCmd } = config;

    let container;
    let isTLE = false;

    try {
        container = await docker.createContainer({
            Image: image,
            Cmd: ['sh', '-c', `echo "${code.replace(/"/g, '\\"')}" > ${file} && echo "${input.replace(/"/g, '\\"')}" > input.txt && ${compileCmd}`],
            AttachStdout: true,
            AttachStderr: true,
            Tty: false,
            HostConfig: {
                Memory: 512 * 1024 * 1024, // 512MB limit
                CpuShares: 512, // Limit CPU usage
                NetworkDisabled: true, // Disable network access
            },
        });

        await container.start();
        const logs = await container.logs({ stdout: true, stderr: true, follow: true });

        let output = "";

        logs.on('data', chunk => output += chunk.toString().replace(/\u0001.*?\u0000/g, '') // Remove unwanted sequences
            .replace(/[^\x20-\x7E\n]/g, '')  // Remove non-printable ASCII except \n
            .replace(/\r\n/g, '\n')          // Normalize line endings
            .trim());

        const timeout = setTimeout(async () => {
            isTLE = true;
            try {
                await container.stop();
            }

            catch (e) {
                res.json({ error: e.message });
                console.error('container stop error', e.message);
            }

        }, 5000);

        await new Promise(resolve => logs.on('end', resolve));
        clearTimeout(timeout);


        if (isTLE) {
            res.json({ output: 'Time Limit exceeded (TLE)' });
        }
        else
            res.json({ output: output.trim() });

    }

    catch (error) {
        res.status(500).json({ error: error.message });
        
    }

    finally {
        if (container) {
            try {
                await container.remove();
            }

            catch (error) {
                console.error('Error during clean', error.message);
            }
        }
    }
};

module.exports = { compiler };