interface Env {
  AI: any;
}

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Image Generator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            width: 100%;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .header h1 {
            color: #333;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header p {
            color: #666;
            font-size: 1.1rem;
        }

        .form-group {
            margin-bottom: 30px;
        }

        label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #333;
            font-size: 1.1rem;
        }

        .input-container {
            position: relative;
        }

        #promptInput {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e1e5e9;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            resize: vertical;
            min-height: 120px;
            font-family: inherit;
        }

        #promptInput:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .char-count {
            position: absolute;
            bottom: 10px;
            right: 15px;
            font-size: 0.85rem;
            color: #999;
            background: white;
            padding: 2px 6px;
            border-radius: 4px;
        }

        #generateBtn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        #generateBtn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        #generateBtn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .loading {
            display: none;
            margin: 30px 0;
            text-align: center;
        }

        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .result {
            margin-top: 30px;
            text-align: center;
        }

        .generated-image {
            max-width: 100%;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            margin-bottom: 20px;
        }

        .download-btn {
            background: #28a745;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s ease;
        }

        .download-btn:hover {
            background: #218838;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border: 1px solid #f5c6cb;
        }

        .examples {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }

        .examples h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }

        .example-prompts {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .example-prompt {
            background: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #e1e5e9;
        }

        .example-prompt:hover {
            background: #667eea;
            color: white;
            transform: translateY(-1px);
        }

        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .example-prompts {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 AI Image Generator</h1>
            <p>Transform your ideas into stunning images with AI</p>
        </div>

        <form id="imageForm">
            <div class="form-group">
                <label for="promptInput">Describe the image you want to create:</label>
                <div class="input-container">
                    <textarea 
                        id="promptInput" 
                        placeholder="Enter your creative prompt here... e.g., 'A majestic dragon flying over a cyberpunk city at sunset'"
                        maxlength="500"
                        required
                    ></textarea>
                    <div class="char-count">
                        <span id="charCount">0</span>/500
                    </div>
                </div>
            </div>

            <button type="submit" id="generateBtn">
                ✨ Generate Image
            </button>
        </form>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Creating your masterpiece... This may take a few seconds</p>
        </div>

        <div id="result" class="result"></div>
        <div id="error" class="error" style="display: none;"></div>

        <div class="examples">
            <h3>💡 Try these example prompts:</h3>
            <div class="example-prompts">
                <span class="example-prompt">Cyberpunk cat with neon lights</span>
                <span class="example-prompt">Peaceful mountain landscape at sunrise</span>
                <span class="example-prompt">Futuristic city floating in space</span>
                <span class="example-prompt">Magical forest with glowing mushrooms</span>
                <span class="example-prompt">Steampunk robot in Victorian era</span>
                <span class="example-prompt">Ocean waves in Van Gogh style</span>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('imageForm');
        const promptInput = document.getElementById('promptInput');
        const generateBtn = document.getElementById('generateBtn');
        const loading = document.getElementById('loading');
        const result = document.getElementById('result');
        const error = document.getElementById('error');
        const charCount = document.getElementById('charCount');

        // Character counter
        promptInput.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });

        // Example prompt clicks
        document.querySelectorAll('.example-prompt').forEach(prompt => {
            prompt.addEventListener('click', function() {
                promptInput.value = this.textContent;
                charCount.textContent = promptInput.value.length;
                promptInput.focus();
            });
        });

        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const prompt = promptInput.value.trim();
            if (!prompt) {
                showError('Please enter a prompt');
                return;
            }

            // Show loading state
            generateBtn.disabled = true;
            generateBtn.textContent = '🎨 Generating...';
            loading.style.display = 'block';
            result.innerHTML = '';
            error.style.display = 'none';

            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: prompt })
                });

                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                
                // Show the generated image
                result.innerHTML = \`
                    <img src="\${imageUrl}" alt="Generated image" class="generated-image">
                    <br>
                    <a href="\${imageUrl}" download="ai-generated-image.png" class="download-btn">
                        📥 Download Image
                    </a>
                \`;

            } catch (err) {
                console.error('Error:', err);
                showError('Failed to generate image. Please try again.');
            } finally {
                // Reset button state
                generateBtn.disabled = false;
                generateBtn.textContent = '✨ Generate Image';
                loading.style.display = 'none';
            }
        });

        function showError(message) {
            error.textContent = message;
            error.style.display = 'block';
            result.innerHTML = '';
        }
    </script>
</body>
</html>
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle the main page
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    // Handle image generation API
    if (request.method === 'POST' && url.pathname === '/generate') {
      try {
        const body = await request.json() as { prompt: string };
        
        if (!body.prompt || typeof body.prompt !== 'string') {
          return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Sanitize and validate the prompt
        const prompt = body.prompt.trim().substring(0, 500);
        
        if (prompt.length === 0) {
          return new Response(JSON.stringify({ error: 'Prompt cannot be empty' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Generate the image using Workers AI
        const response = await env.AI.run(
          '@cf/stabilityai/stable-diffusion-xl-base-1.0',
          { prompt: prompt }
        );

        return new Response(response, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600',
          },
        });

      } catch (error) {
        console.error('Error generating image:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 404 for any other routes
    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
