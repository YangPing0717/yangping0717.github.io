(function () {
    'use strict';

    var stage = document.querySelector('.ezcon-particle-text');
    if (!stage) return;

    var title = stage.querySelector('.title');
    var canvas = stage.querySelector('.ezcon-particle-text__canvas');
    var context = canvas && canvas.getContext('2d');
    if (!title || !canvas || !context) return;

    var particles = [];
    var animationFrame = null;
    var resizeFrame = null;
    var width = 0;
    var height = 0;
    var deviceScale = 1;
    var gathering = false;
    var gatherStartedAt = 0;
    var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reducedMotion = reduceMotionQuery.matches;
    var pointer = { active: false, x: 0, y: 0, smoothX: 0, smoothY: 0 };

    var settings = {
        particleSize: 2,
        scatter: 620,
        gatherDuration: 1600,
        stagger: 420,
        repelStrength: 60,
        repelRadius: 180,
        idleDrift: 0.7,
        color: { r: 0, g: 77, b: 255 },
        highlight: { r: 0, g: 255, b: 245 }
    };

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function easeOutCubic(value) {
        return 1 - Math.pow(1 - value, 3);
    }

    function colorAt(position) {
        var start = settings.color;
        var end = settings.highlight;
        var amount = clamp(position, 0, 1);
        return 'rgb(' +
            Math.round(start.r + (end.r - start.r) * amount) + ', ' +
            Math.round(start.g + (end.g - start.g) * amount) + ', ' +
            Math.round(start.b + (end.b - start.b) * amount) + ')';
    }

    function textMetrics(drawContext, text, letterSpacing) {
        var glyphs = [];
        var totalWidth = 0;
        Array.from(text).forEach(function (character, index) {
            var glyphWidth = drawContext.measureText(character).width;
            glyphs.push({ character: character, width: glyphWidth });
            totalWidth += glyphWidth;
            if (index < text.length - 1) totalWidth += letterSpacing;
        });
        return { glyphs: glyphs, width: totalWidth };
    }

    function scatterParticles(fromTargets) {
        if (!particles.length || reducedMotion) return;
        var scatterDistance = width < 768 ? 360 : settings.scatter;
        particles.forEach(function (particle) {
            var angle = particle.seed * Math.PI * 2;
            var radius = scatterDistance * (0.35 + particle.depth * 0.75);
            if (fromTargets) {
                particle.x = particle.targetX + Math.cos(angle) * radius + (particle.depth - 0.5) * scatterDistance * 0.55;
                particle.y = particle.targetY + Math.sin(angle) * radius + (particle.seed - 0.5) * scatterDistance * 0.55;
            }
            particle.startX = particle.x;
            particle.startY = particle.y;
            particle.delay = particle.seed * settings.stagger;
        });
        gatherStartedAt = performance.now();
        gathering = true;
    }

    function drawParticle(particle) {
        context.fillStyle = particle.color;
        if (particle.size <= 2.1) {
            context.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
        } else {
            context.beginPath();
            context.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            context.fill();
        }
    }

    function render(time) {
        context.clearRect(0, 0, width, height);
        context.shadowBlur = reducedMotion ? 0 : settings.particleSize * 3;
        context.shadowColor = '#00fff5';

        pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
        pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;
        var allSettled = true;

        particles.forEach(function (particle) {
            var destinationX = particle.targetX;
            var destinationY = particle.targetY;
            var progress = 1;

            if (gathering) {
                progress = clamp((time - gatherStartedAt - particle.delay) / Math.max(1, settings.gatherDuration), 0, 1);
                var eased = easeOutCubic(progress);
                destinationX = particle.startX + (particle.targetX - particle.startX) * eased;
                destinationY = particle.startY + (particle.targetY - particle.startY) * eased;
                if (progress < 1) allSettled = false;
            } else if (!reducedMotion) {
                var seconds = time * 0.001;
                destinationX += Math.sin(seconds * 0.9 + particle.seed * 10) * settings.idleDrift * particle.depth;
                destinationY += Math.cos(seconds * 0.75 + particle.depth * 10) * settings.idleDrift * particle.depth;
            }

            if (pointer.active && !reducedMotion) {
                var distanceX = destinationX - pointer.smoothX;
                var distanceY = destinationY - pointer.smoothY;
                var distance = Math.hypot(distanceX, distanceY);
                if (distance > 0 && distance < settings.repelRadius) {
                    var force = Math.pow(1 - distance / settings.repelRadius, 2) * settings.repelStrength;
                    destinationX += distanceX / distance * force;
                    destinationY += distanceY / distance * force;
                }
            }

            var follow = reducedMotion ? 1 : 0.22;
            particle.x += (destinationX - particle.x) * follow;
            particle.y += (destinationY - particle.y) * follow;
            context.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);
            drawParticle(particle);
        });

        context.globalAlpha = 1;
        context.shadowBlur = 0;
        if (gathering && allSettled) gathering = false;
        animationFrame = window.requestAnimationFrame(render);
    }

    function buildParticles() {
        var rect = stage.getBoundingClientRect();
        width = Math.floor(rect.width);
        height = Math.floor(rect.height);
        if (width <= 0 || height <= 0) return;

        deviceScale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.floor(width * deviceScale));
        canvas.height = Math.max(1, Math.floor(height * deviceScale));
        context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);

        var computed = window.getComputedStyle(title);
        var fontSize = parseFloat(computed.fontSize) || 176;
        var fontWeight = computed.fontWeight || '900';
        var fontFamily = computed.fontFamily || 'sans-serif';
        var letterSpacing = parseFloat(computed.letterSpacing) || 0;
        var text = stage.getAttribute('data-particle-text') || title.textContent.trim() || 'EZCON';

        var buffer = document.createElement('canvas');
        var bufferContext = buffer.getContext('2d', { willReadFrequently: true });
        bufferContext.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily;
        var metrics = textMetrics(bufferContext, text, letterSpacing);
        var padding = Math.max(12, Math.ceil(fontSize * 0.08));
        var textHeight = Math.ceil(fontSize * 1.12);
        buffer.width = Math.ceil(metrics.width) + padding * 2;
        buffer.height = textHeight + padding * 2;

        bufferContext.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily;
        bufferContext.textBaseline = 'alphabetic';
        bufferContext.fillStyle = '#fff';
        var cursorX = padding;
        var baseline = padding + fontSize * 0.86;
        metrics.glyphs.forEach(function (glyph, index) {
            bufferContext.fillText(glyph.character, cursorX, baseline);
            cursorX += glyph.width + (index < metrics.glyphs.length - 1 ? letterSpacing : 0);
        });

        var pixels = bufferContext.getImageData(0, 0, buffer.width, buffer.height).data;
        var gap = width < 768 ? 5 : 4;
        var candidates = [];
        for (var y = 0; y < buffer.height; y += gap) {
            for (var x = 0; x < buffer.width; x += gap) {
                var alpha = pixels[(y * buffer.width + x) * 4 + 3];
                if (alpha > 40) candidates.push({ x: x, y: y, alpha: alpha / 255 });
            }
        }

        var maxParticles = width < 768 ? 2200 : 5200;
        var scatterDistance = width < 768 ? 360 : settings.scatter;
        var stride = Math.max(1, Math.ceil(candidates.length / maxParticles));
        var offsetX = width / 2 - buffer.width / 2;
        var offsetY = height / 2 - buffer.height / 2;

        particles = candidates.filter(function (_, index) {
            return index % stride === 0;
        }).map(function (point, index) {
            var seed = ((index * 9301 + 49297) % 233280) / 233280;
            var depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
            var targetX = offsetX + point.x;
            var targetY = offsetY + point.y;
            var angle = seed * Math.PI * 2;
            var radius = scatterDistance * (0.35 + depth * 0.75);
            var startX = reducedMotion ? targetX : targetX + Math.cos(angle) * radius + (seed - 0.5) * scatterDistance * 0.45;
            var startY = reducedMotion ? targetY : targetY + Math.sin(angle) * radius + (depth - 0.9) * scatterDistance * 0.45;
            return {
                x: startX,
                y: startY,
                startX: startX,
                startY: startY,
                targetX: targetX,
                targetY: targetY,
                size: Math.max(0.7, settings.particleSize * (0.75 + point.alpha * 0.45)),
                color: colorAt(point.x / Math.max(1, buffer.width) + (seed - 0.5) * 0.35),
                seed: seed,
                depth: depth,
                delay: seed * settings.stagger
            };
        });

        pointer.x = width / 2;
        pointer.y = height / 2;
        pointer.smoothX = pointer.x;
        pointer.smoothY = pointer.y;
        stage.classList.add('is-ready');

        if (reducedMotion) {
            particles.forEach(function (particle) {
                particle.x = particle.targetX;
                particle.y = particle.targetY;
            });
            gathering = false;
        } else {
            gatherStartedAt = performance.now();
            gathering = true;
        }
    }

    function queueBuild() {
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(buildParticles);
    }

    function updatePointer(event) {
        var rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
    }

    canvas.addEventListener('pointerenter', function (event) {
        updatePointer(event);
        scatterParticles(true);
    });
    canvas.addEventListener('pointermove', updatePointer);
    canvas.addEventListener('pointerleave', function () {
        pointer.active = false;
    });

    var resizeObserver = new ResizeObserver(queueBuild);
    resizeObserver.observe(stage);

    reduceMotionQuery.addEventListener('change', function (event) {
        reducedMotion = event.matches;
        buildParticles();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(buildParticles);
    } else {
        buildParticles();
    }
    animationFrame = window.requestAnimationFrame(render);
})();
