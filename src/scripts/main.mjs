import CONFIG from "./common/config.mjs";
import { knn_algorithm } from "./cluster/knn/knn.mjs";
import { HyadesCanvas } from "./canvas/canvas.mjs";

CONFIG.CLUSTER.ASSIGN = knn_algorithm

let obj = {
    canvas: new HyadesCanvas()
}

const step_button = document.querySelector('#control-step-btn')
const start_button = document.querySelector('#control-start-btn')
const pause_button = document.querySelector('#control-pause-btn')
const reset_button = document.querySelector('#control-reset-btn')

step_button.addEventListener('click', (event) => {
    obj.canvas.expandRegions();
    obj.canvas.render();
});

start_button.addEventListener('click', (event) => {
    start_button.disabled = true;
    pause_button.disabled = false;
    step_button.disabled = true;

    CONFIG.ANIMATION.ACTIVE = true;
    obj.canvas.loop();
});

pause_button.addEventListener('click', (event) => {
    start_button.disabled = false;
    pause_button.disabled = true;
    step_button.disabled = false;

    CONFIG.ANIMATION.ACTIVE = false;
    obj.canvas.loop();
});

reset_button.addEventListener('click', (event) => {
    start_button.disabled = false;
    pause_button.disabled = true;
    step_button.disabled = false;

    CONFIG.ANIMATION.ACTIVE = false;
    obj.canvas = new HyadesCanvas();
});
