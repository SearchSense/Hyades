import { HyadesConfig } from "./common/config.mjs";
import { KNN_algorithm } from "./clustering/knn/knn.mjs";
import { HyadesCanvas } from "./canvas/canvas.mjs";

HyadesConfig.Clustering.Algorithm = KNN_algorithm;
let App = new HyadesCanvas()

// ============================================================================
// Controller
// ============================================================================

const fpsRng = document.querySelector('#control-fps-input')
const batchRng = document.querySelector('#control-batch-input')
const stepBtn = document.querySelector('#control-step-btn')
const startBtn = document.querySelector('#control-start-btn')
const pauseBtn = document.querySelector('#control-pause-btn')
const resetBtn = document.querySelector('#control-reset-btn')

fpsRng.addEventListener('input', (event) => {
    HyadesConfig.Animation.Interval = 1000 / event.target.value;
    document.querySelector('#control-fps-value').textContent = event.target.value;
});

batchRng.addEventListener('input', (event) => {
    HyadesConfig.Animation.BatchSize = event.target.value;
    document.querySelector('#control-batch-value').textContent = event.target.value;
});

stepBtn.addEventListener('click', (event) => {
    // App.expandRegions();
    App.updateBorders();
    App.render();
});

startBtn.addEventListener('click', (event) => {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stepBtn.disabled = true;

    HyadesConfig.Animation.Active = true;
    App.loop();
});

pauseBtn.addEventListener('click', (event) => {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = false;

    HyadesConfig.Animation.Active = false;
    App.loop();
});

resetBtn.addEventListener('click', (event) => {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = false;

    HyadesConfig.Animation.Active = false;
    App.reset();
});
