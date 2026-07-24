/** CONFIGURATION & STATE */

        const CONFIG = {

            voiceLang: 'zh-TW', 

            crisisKeywords: ['kill myself', 'suicide', 'end my life', 'die', 'hurt myself', 'overdose'],

            crisisResponse: "I am detecting signals of severe distress. I care about your safety. Please, I urge you to call emergency services or a suicide prevention hotline immediately.",

            silenceThreshold: 800 
  // ms to wait after speech stops before sending (Faster than default 2000ms)

        };

        const STATE = {

            idle: 0,

            listening: 1,

            thinking: 2,

            speaking: 3,

            crisis: 4

        };

        let currentMode = STATE.idle;

        let audioContext;

        let memory = []; 
     // Session context

        let silenceTimer = null; 
  // Timer for custom speech detection

        let currentTranscript = "";

     // Canvas Setup

        const canvas = document.getElementById('bio-eye');

        const ctx = canvas.getContext('2d');

        let width, height;

        let time = 0;

     /** ADVANCED VISUAL PHYSICS */

        class Filament {

            constructor(angle, length, speed) {

                this.angle = angle;

                this.baseLength = length;

                this.speed = speed;

                this.offset = Math.random() * Math.PI * 2;

                this.color = Math.random() > 0.5 ? '#00ffcc' : '#50c878';

            }

            draw(cx, cy, radius, mode) {

                let volatility = 1;

                let surge = 0;

                

                if (mode === STATE.speaking) { volatility = 3; surge = 10; }

                else if (mode === STATE.thinking) { volatility = 0.5; surge = -5; }

                else if (mode === STATE.listening) { volatility = 1.5; surge = 5; }

                else if (mode === STATE.crisis) { this.color = '#ff0000'; volatility = 8; }

                const movement = Math.sin(time * this.speed + this.offset) * (10 * volatility);

                const currentLen = this.baseLength + movement + surge;

                

                const x1 = cx + Math.cos(this.angle) * (radius * 0.3); 

                const y1 = cy + Math.sin(this.angle) * (radius * 0.3);

                

                const cpX = cx + Math.cos(this.angle + (time * 0.1)) * (currentLen * 0.6);

                const cpY = cy + Math.sin(this.angle + (time * 0.1)) * (currentLen * 0.6);

                

                const x2 = cx + Math.cos(this.angle) * currentLen;

                const y2 = cy + Math.sin(this.angle) * currentLen;

                ctx.beginPath();

                ctx.moveTo(x1, y1);

                ctx.quadraticCurveTo(cpX, cpY, x2, y2);

                

                ctx.strokeStyle = this.color;

                ctx.globalAlpha = (mode === STATE.speaking) ? 0.6 : 0.3;

                ctx.lineWidth = 1.5;

                ctx.stroke();

            }

        }

        const filaments = [];

        const numFilaments = 180;

        function initVisuals() {

            window.addEventListener('resize', resize);

            resize();

            for(let i=0; i<numFilaments; i++) {

                const angle = (Math.PI * 2 / numFilaments) * i;

                const len = 100 + Math.random() * 80;

                const speed = 0.5 + Math.random();

                filaments.push(new Filament(angle, len, speed));

            }

            animate();

        }

        // function resize() {

        //     width = canvas.width = window.innerWidth;

        //     height = canvas.height = window.innerHeight;

        // }

        // function resize() {
        //     // 取得 Canvas 元素本身或其父容器
        //     const container = canvas.parentElement; 
            
        //     // 將計算維度改為父容器的寬高（如果沒有父容器，也可以用 canvas.clientWidth / clientHeight）
        //     width = canvas.width = container ? container.clientWidth : window.innerWidth;
        //     height = canvas.height = container ? container.clientHeight : 400; // 預設給個備用高度
        // }

        function resize() {
            width = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
            height = canvas.height = 800; // 👈 這裡直接指定您想要的高度 (像素)
        }

        function animate() {
            // 1. 如果處於初始/空閒狀態 (STATE.idle)，直接把畫面清成全黑，並繪製預設的視覺
            if (currentMode === STATE.idle) {
                // 完全覆蓋清空（不留殘影）
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);

                // 重置時間軸或絲線狀態，確保下次啟動從乾淨狀態開始
                time = 0; 

                // 繼續保持迴圈，隨時等待啟動
                requestAnimationFrame(animate);
                return;
            }

            // 2. 進行中的狀態（listening, thinking, speaking, crisis）使用帶半透明的畫刷（創造拖尾殘影效果）
            ctx.fillStyle = 'rgba(0, 5, 5, 0.2)'; 
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            ctx.globalCompositeOperation = 'screen';
            filaments.forEach(f => f.draw(cx, cy, 200, currentMode));
            ctx.globalCompositeOperation = 'source-over';

            // 瞳孔繪製
            ctx.fillStyle = '#000000';
            ctx.beginPath();

            let pupilSize = 40;
            if (currentMode === STATE.speaking) pupilSize = 35 + Math.sin(time * 5) * 5;
            if (currentMode === STATE.listening) pupilSize = 50;
            if (currentMode === STATE.crisis) pupilSize = 20; 

            ctx.arc(cx, cy, pupilSize, 0, Math.PI * 2);
            ctx.fill();

            // 眼光反光點
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.ellipse(cx - 20, cy - 20, 10, 6, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();

            time += 0.05;
            requestAnimationFrame(animate);
        }

           /** THE BRAIN */

        async function queryBrain(userInput) {

               // Safety Check

            for (let word of CONFIG.crisisKeywords) {

                if (userInput.toLowerCase().includes(word)) {

                    currentMode = STATE.crisis;

                    document.documentElement.style.setProperty('--iris-primary', '#ff0000');

                    return CONFIG.crisisResponse;

                }

            }

// Immediately switch to thinking mode (Visual feedback)

            currentMode = STATE.thinking;

            updateStatus("PROCESSING...");

       // Limit memory size for speed

            const context = memory.slice(-3).map(m => `User: ${m.user}\nAI: ${m.ai}`).join('\n');

            const systemPrompt = "You are Aura, an AI counselor. Be wise, empathetic, and very concise (1-2 sentences max).";

            const prompt = `${systemPrompt}\n${context}\nUser: ${userInput}\nAI:`;

            

            try {

           // Pollinations API (GET)  
 // Added cachebuster to ensure no stale checks

                const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${Math.floor(Math.random() * 1000)}`;

                const response = await fetch(url);

                

                if (!response.ok) throw new Error("Net error");

                

                const data = await response.text();

                

                memory.push({ user: userInput, ai: data });

                if (memory.length > 5) memory.shift(); 

                

                return data;

            } catch (err) {

                console.error(err);

                return "I am sensing a disturbance in the network. Please try again.";

            }

        }

        async function warmUpBrain() {

   // Sends a silent request to wake up the serverless function

            try {

                fetch(`https://text.pollinations.ai/${encodeURIComponent("Hi")}`);

                console.log("Neural Net Warmup Initiated");

            } catch(e) {}

        }

      /** AUDIO SYS (OPTIMIZED) */

        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        let recognition;

        let synth = window.speechSynthesis;

        function setupAudio() {
            if (!Recognition) return alert("Browser not supported. Please use Chrome.");
            
            recognition = new Recognition();
            // 【修改點 1】改為 false，讓它聽完單次對話就停止
            recognition.continuous = false; 
            recognition.lang = 'zh-TW'; 
            recognition.interimResults = true; 

            recognition.onstart = () => {
                if(currentMode !== STATE.speaking) {
                    currentMode = STATE.listening;
                    updateStatus("LISTENING...");
                }
            };

            // 自訂靜音判定與結果處理
            recognition.onresult = async (event) => {
                clearTimeout(silenceTimer);
                const results = event.results;
                const lastResult = results[results.length - 1];
                currentTranscript = lastResult[0].transcript;

                document.getElementById('transcript').innerText = `"${currentTranscript}"`;

                // 超過 silenceThreshold 毫秒沒發聲，停止監聽並發送
                silenceTimer = setTimeout(async () => {
                    recognition.stop();
                    processUserSpeech(currentTranscript);
                }, CONFIG.silenceThreshold);
            };

            // 【修改點 2】註解或移除自動重啟邏輯，避免背景自動繼續聽
            recognition.onend = () => {
                // 原本的 auto-restart 移除，改由 speak() 的 onend 統一控制狀態
            };
        }

        async function processUserSpeech(text) {

            if (!text || text.trim().length < 1) {

       // False alarm, restart listening

                currentMode = STATE.listening;

                try { recognition.start(); } catch(e){}

                return;

            }

            currentMode = STATE.thinking;

            updateStatus("ANALYZING...");

            

            const answer = await queryBrain(text);

            speak(answer);

        }

        // 【修改點】讓 speak 可以接收兩個參數：(語音文字, 畫面顯示文字)
        function speak(text, displayText) {
            synth.cancel();
            currentMode = STATE.speaking;
            updateStatus("RESPONDING...");
            
            const utter = new SpeechSynthesisUtterance(text);
            
            const voices = synth.getVoices();
            let voice = voices.find(v => v.name.includes("Chinese Taiwan Female"));
            if (!voice) voice = voices.find(v => v.lang === "zh-TW" && v.name.includes("Female"));
            if (!voice) voice = voices.find(v => v.lang === "zh-TW");
            
            if (voice) utter.voice = voice;
            utter.pitch = 1.0; 
            utter.rate = 0.9; 

            utter.onend = () => {
                updateStatus("WAITING...");

                setTimeout(() => {
                    currentMode = STATE.idle;
                    updateStatus("READY / TAP TO START");
                    currentTranscript = "";
                    document.getElementById('transcript').innerText = "點擊按鈕再次開始對話";

                    const canvas = document.getElementById('bio-eye');
                    if (canvas) canvas.style.display = 'none';

                    const startScreen = document.getElementById('start-screen');
                    if (startScreen) {
                        startScreen.style.display = 'block';
                        startScreen.style.opacity = 1;
                    }
                }, 6000); 
            };

            synth.speak(utter);
            
            // 【關鍵修改】如果傳入 displayText 就印 displayText，沒有傳就印發音文字
            document.getElementById('transcript').innerText = displayText || text;
        }

                 /** UTILS */

        function updateStatus(text) {

            const el = document.getElementById('status-display');

            el.innerText = text;

            if (currentMode === STATE.crisis) el.style.color = 'red';

            else el.style.color = 'var(--iris-primary)';

        }

        function bootSystem() {
            // 【新增】點擊按鈕啟動時，重新顯示 Canvas
            const canvas = document.getElementById('bio-eye');
            if (canvas) canvas.style.display = 'block';
            
            // 1. 首次點擊時進行系統初始化
            if (!audioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
                warmUpBrain(); 
                synth.getVoices(); 
                initVisuals();
                setupAudio();
            }

            // 2. 隱藏開始畫面/按鈕遮罩
            const startScreen = document.getElementById('start-screen');
            if (startScreen) {
                startScreen.style.opacity = 0;
                setTimeout(() => {
                    startScreen.style.display = 'none';
                }, 800);
            }

            // 3. 只有在空閒狀態點擊時，才播放問候語
            if (currentMode === STATE.idle) {
                currentMode = STATE.speaking;
                
                // 格式為：speak(語音內容, 畫面顯示內容)
                speak("無論是解答疑問、生活協助還是隨意聊天，易控 AI 智慧管家隨時為您服務。點擊按鈕，隨時隨地開啟我們的對話，傾聽您的需求，為您打造極致便利的 AI 智慧生活體感。歡迎回家，我是你的專屬易控 A I 管家，I am listening.", "歡迎回家，我是您的 A I 智慧管家！");
            }
        }

             // Interrupt Logic

        canvas.addEventListener('click', () => {

            if (currentMode === STATE.speaking) {

                synth.cancel();

                currentMode = STATE.listening;

                updateStatus("INTERRUPTED");

                try { recognition.start(); } catch(e){}

            }

        });