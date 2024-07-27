import CONFIG from "../common/config.mjs";
import { DataPoint } from "../cluster/datapoint.mjs";
import { CanvasCluster } from "./extends/cluster.mjs";

/**
 * The canvas class is responsible for drawing the clusters on the canvas.
 */
export class HyadesCanvas {
    /**
     * @param {string} canvasId - The id of the canvas element.
     */
    constructor(canvasId = "canvas") {
        this.canvas = document.getElementById(canvasId);
        this._datapoint_canvas = document.createElement('canvas');
        this._region_canvas = document.createElement('canvas');

        this.ctx = this.canvas.getContext('2d');
        this._datapoint_ctx = this._datapoint_canvas.getContext('2d');
        this._region_ctx = this._region_canvas.getContext('2d', {
            willReadFrequently: true,
        });

        this.updateSize();

        this.clusters = [new CanvasCluster([
            this.canvas.width / 2,
            this.canvas.height / 2
        ])];

        this.attachEventListeners();
        this.render();
    }

    /**
     * Update the canvas size.
     */
    updateSize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this._datapoint_canvas.width = this.canvas.width;
        this._datapoint_canvas.height = this.canvas.height;

        this._region_canvas.width = this.canvas.width;
        this._region_canvas.height = this.canvas.height;

        this._region_map = this._region_ctx.createImageData(this.canvas.width, this.canvas.height);
    }

    /**
     * Plot a data point on the shadow canvas.
     * @param {number} x - The x-coordinate of the data point.
     * @param {number} y - The y-coordinate of the data point.
     */
    plotDataPoint(x, y) {
        let radius = CONFIG.CANVAS.datapoint_radius;

        this._datapoint_ctx.beginPath();
        this._datapoint_ctx.moveTo(x - radius, y - radius);
        this._datapoint_ctx.lineTo(x + radius, y + radius);
        this._datapoint_ctx.moveTo(x + radius, y - radius);
        this._datapoint_ctx.lineTo(x - radius, y + radius);
        this._datapoint_ctx.stroke();
    }

    /**
     * Plot a centroid on the shadow canvas.
     * @param {CanvasCluster} cluster - The cluster to plot.
     */
    plotCentroid(cluster) {
        let radius = CONFIG.CANVAS.centroid_radius;
        const { x, y, color } = cluster;

        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * Block transfer the shadow canvas to the main canvas.
     */
    blitShadowCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.drawImage(this._region_canvas, 0, 0);
        this.ctx.putImageData(this._region_map, 0, 0);
        this.ctx.drawImage(this._datapoint_canvas, 0, 0);
    }

    /**
     * Re-render the canvas.
     */
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.blitShadowCanvas();
        this.clusters.forEach(cluster => this.plotCentroid(cluster));
    }

    /**
     * Attach the event listeners to the canvas.
     */
    attachEventListeners() {
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const canvas_area = this.canvas.getBoundingClientRect();
            let x = event.clientX - canvas_area.left;
            let y = event.clientY - canvas_area.top;

            this.clusters.push(new CanvasCluster([x, y]));
            this.render();
        });

        this.canvas.addEventListener('click', (event) => {
            event.preventDefault();
            const canvas_area = this.canvas.getBoundingClientRect();
            let x = event.clientX - canvas_area.left;
            let y = event.clientY - canvas_area.top;

            /** @type {CanvasCluster} */
            let cluster = CONFIG.CLUSTER.ASSIGN([x, y], this.clusters);
            cluster.add([x, y]);

            this.plotDataPoint(x, y);
            this.render();
        });

        this.canvas.addEventListener('resize', this.updateSize.bind(this));
    }

    /**
     * Expand the cluster regions on the canvas.
     */
    expandRegions() {
        this.clusters.forEach((cluster) => {
            cluster.grow(this.clusters, this._region_map);
        });

        this._region_ctx.putImageData(this._region_map, 0, 0);
    }

    /**
     * Loop the canvas rendering.
     */
    loop() {
        this.expandRegions();
        this.render();
        if (CONFIG.ANIMATION.ACTIVE) setTimeout(this.loop.bind(this), CONFIG.ANIMATION.INTERVAL);
    }
}
