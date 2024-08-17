import { throttle } from "./common/debounce/debounce.mjs";
import { HyadesConfig } from "./common/config.mjs";
import { KNN_algorithm } from "./clustering/knn/knn.mjs";
import { HyadesCanvas } from "./canvas/canvas.mjs";

HyadesConfig.Clustering.Algorithm = KNN_algorithm;
let App = new HyadesCanvas()

// ============================================================================
// Controller
// ============================================================================

const fpsRng = document.querySelector('#control-fps-input');
const fpsValue = document.querySelector('#control-fps-value');
const batchRng = document.querySelector('#control-batch-input');
const batchValue = document.querySelector('#control-batch-value');

const stepBtn = document.querySelector('#control-step-btn');
const startBtn = document.querySelector('#control-start-btn');
const pauseBtn = document.querySelector('#control-pause-btn');
const resetBtn = document.querySelector('#control-reset-btn');

fpsRng.addEventListener('input', throttle((event) => {
    HyadesConfig.Animation.Interval = 1000 / event.target.value;
    fpsValue.textContent = event.target.value;
}));

batchRng.addEventListener('input', throttle((event) => {
    HyadesConfig.Animation.BatchSize = event.target.value;
    batchValue.textContent = event.target.value;
}));

stepBtn.addEventListener('click', throttle((_event) => {
    App.expandRegions();
    App.render();
}));

startBtn.addEventListener('click', throttle((_event) => {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stepBtn.disabled = true;

    HyadesConfig.Animation.Active = true;
    App.loop();
}));

pauseBtn.addEventListener('click', throttle((_event) => {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = false;

    HyadesConfig.Animation.Active = false;
    App.loop();
}));

resetBtn.addEventListener('click', throttle((_event) => {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stepBtn.disabled = false;

    HyadesConfig.Animation.Active = false;
    App.reset();
}));
