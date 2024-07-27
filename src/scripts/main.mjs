import CONFIG from "./common/config.mjs";
import { knn_algorithm } from "./cluster/knn/knn.mjs";
import { HyadesCanvas } from "./canvas/canvas.mjs";

CONFIG.CLUSTER.ASSIGN = knn_algorithm

let obj = {
    canvas: new HyadesCanvas()
}

const next_button = document.querySelector('#next-button')
next_button.addEventListener('click', (event) => {
    obj.canvas.expandRegions();
    obj.canvas.render();
})

const start_button = document.querySelector('#start-button')
start_button.addEventListener('click', (event) => {
    CONFIG.ANIMATION.ACTIVE = true;
    obj.canvas.loop();
});

const pause_button = document.querySelector('#pause-button')
pause_button.addEventListener('click', (event) => {
    CONFIG.ANIMATION.ACTIVE = false;
    obj.canvas.loop();
});

const reset_button = document.querySelector('#reset-button')
reset_button.addEventListener('click', (event) => {
    CONFIG.ANIMATION.ACTIVE = false;
    obj.canvas = new HyadesCanvas();
});
