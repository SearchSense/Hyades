import { HyadesConfig } from "./common/config.mjs";
import { KNN_algorithm } from "./clustering/knn/knn.mjs";
import { HyadesCanvas } from "./canvas/canvas.mjs";

HyadesConfig.Clustering.Algorithm = KNN_algorithm;
let App = new HyadesCanvas()

// ============================================================================
// Controller
// ============================================================================

const stepBtn = document.querySelector('#control-step-btn')
const startBtn = document.querySelector('#control-start-btn')
const pauseBtn = document.querySelector('#control-pause-btn')
const resetBtn = document.querySelector('#control-reset-btn')

stepBtn.addEventListener('click', (event) => {
    App.expandRegions();
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
