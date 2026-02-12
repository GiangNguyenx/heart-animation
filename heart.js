// Canvas settings
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
const IMAGE_ENLARGE = 11;
const HEART_COLOR = "#f76070";

// Get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Heart function - converts parametric t to x,y coordinates
function heartFunction(t, shrinkRatio = IMAGE_ENLARGE) {
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    
    x *= shrinkRatio;
    y *= shrinkRatio;
    
    x += CANVAS_CENTER_X;
    y += CANVAS_CENTER_Y;
    
    return [Math.floor(x), Math.floor(y)];
}

// Scatter points inside the heart
function scatterInside(x, y, beta = 0.15) {
    const ratioX = -beta * Math.log(Math.random());
    const ratioY = -beta * Math.log(Math.random());
    
    const dx = ratioX * (x - CANVAS_CENTER_X);
    const dy = ratioY * (y - CANVAS_CENTER_Y);
    
    return [x - dx, y - dy];
}

// Shrink effect
function shrink(x, y, ratio) {
    const force = -1 / Math.pow((Math.pow(x - CANVAS_CENTER_X, 2) + Math.pow(y - CANVAS_CENTER_Y, 2)), 0.6);
    const dx = ratio * force * (x - CANVAS_CENTER_X);
    const dy = ratio * force * (y - CANVAS_CENTER_Y);
    return [x - dx, y - dy];
}

// Curve function for animation
function curve(p) {
    return 2 * (2 * Math.sin(4 * p)) / (2 * Math.PI);
}

// Heart class
class Heart {
    constructor(generateFrame = 20) {
        this.points = new Set();
        this.edgeDiffusionPoints = new Set();
        this.centerDiffusionPoints = new Set();
        this.allPoints = {};
        this.generateFrame = generateFrame;
        
        this.build(2000);
        
        for (let frame = 0; frame < generateFrame; frame++) {
            this.calc(frame);
        }
    }
    
    build(number) {
        // Generate main heart points
        for (let i = 0; i < number; i++) {
            const t = Math.random() * 2 * Math.PI;
            const [x, y] = heartFunction(t);
            this.points.add(`${x},${y}`);
        }
        
        // Generate edge diffusion points
        const pointsArray = Array.from(this.points).map(p => p.split(',').map(Number));
        for (const [x, y] of pointsArray) {
            for (let i = 0; i < 3; i++) {
                const [newX, newY] = scatterInside(x, y, 0.05);
                this.edgeDiffusionPoints.add(`${newX},${newY}`);
            }
        }
        
        // Generate center diffusion points
        for (let i = 0; i < 4000; i++) {
            const randomPoint = pointsArray[Math.floor(Math.random() * pointsArray.length)];
            const [newX, newY] = scatterInside(randomPoint[0], randomPoint[1], 0.17);
            this.centerDiffusionPoints.add(`${newX},${newY}`);
        }
    }
    
    calcPosition(x, y, ratio) {
        const force = 1 / Math.pow((Math.pow(x - CANVAS_CENTER_X, 2) + Math.pow(y - CANVAS_CENTER_Y, 2)), 0.520);
        const dx = ratio * force * (x - CANVAS_CENTER_X) + Math.floor(Math.random() * 3) - 1;
        const dy = ratio * force * (y - CANVAS_CENTER_Y) + Math.floor(Math.random() * 3) - 1;
        return [x - dx, y - dy];
    }
    
    calc(generateFrame) {
        const ratio = 10 * curve(generateFrame / 10 * Math.PI);
        const haloRadius = Math.floor(4 + 6 * (1 + curve(generateFrame / 10 * Math.PI)));
        const haloNumber = Math.floor(3000 + 4000 * Math.abs(Math.pow(curve(generateFrame / 10 * Math.PI), 2)));
        
        const allPoints = [];
        
        // Generate heart halo points
        const heartHaloPoint = new Set();
        for (let i = 0; i < haloNumber; i++) {
            const t = Math.random() * 2 * Math.PI;
            let [x, y] = heartFunction(t, 11.6);
            [x, y] = shrink(x, y, haloRadius);
            const key = `${x},${y}`;
            if (!heartHaloPoint.has(key)) {
                heartHaloPoint.add(key);
                x += Math.floor(Math.random() * 29) - 14;
                y += Math.floor(Math.random() * 29) - 14;
                const size = [1, 2, 2][Math.floor(Math.random() * 3)];
                allPoints.push([x, y, size]);
            }
        }
        
        // Process main points
        const pointsArray = Array.from(this.points).map(p => p.split(',').map(Number));
        for (let [x, y] of pointsArray) {
            [x, y] = this.calcPosition(x, y, ratio);
            const size = Math.floor(Math.random() * 3) + 1;
            allPoints.push([x, y, size]);
        }
        
        // Process edge diffusion points
        const edgeArray = Array.from(this.edgeDiffusionPoints).map(p => p.split(',').map(Number));
        for (let [x, y] of edgeArray) {
            [x, y] = this.calcPosition(x, y, ratio);
            const size = Math.floor(Math.random() * 2) + 1;
            allPoints.push([x, y, size]);
        }
        
        // Process center diffusion points
        const centerArray = Array.from(this.centerDiffusionPoints).map(p => p.split(',').map(Number));
        for (let [x, y] of centerArray) {
            [x, y] = this.calcPosition(x, y, ratio);
            const size = Math.floor(Math.random() * 2) + 1;
            allPoints.push([x, y, size]);
        }
        
        this.allPoints[generateFrame] = allPoints;
    }
    
    render(renderFrame) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const frame = renderFrame % this.generateFrame;
        const points = this.allPoints[frame];
        
        ctx.fillStyle = HEART_COLOR;
        for (const [x, y, size] of points) {
            ctx.fillRect(x, y, size, size);
        }
    }
}

// Initialize and animate
let heart;
let frame = 0;

function init() {
    heart = new Heart();
    animate();
}

function animate() {
    heart.render(frame);
    frame++;
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 160);
}

// Start animation when page loads
window.addEventListener('load', init);
