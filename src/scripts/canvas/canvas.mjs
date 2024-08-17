import { HyadesConfig } from "../common/config.mjs";
import { Cluster } from "../clustering/cluster.mjs";
import { Deque } from "../common/util.mjs";
import { grow } from "./extends/border.mjs";
import { CanvasDataPoint } from "./extends/datapoint.mjs";

/**
 * The canvas class is responsible for drawing the clusters on the canvas.
 */
export class HyadesCanvas {
    /**
     * @param {string} canvasId - The id of the canvas element.
     */
    constructor(canvasId = "hyades-canvas") {
        /** @type {HTMLCanvasElement} The canvas element. */
        this.__pvt_canvas = document.querySelector(`#${canvasId}`);
        if (!this.__pvt_canvas) {
            throw new Error("Canvas element not found");
        }

        this.__pvt_ctx = this.__pvt_canvas.getContext('2d');
        if (!this.__pvt_ctx) {
            throw new Error("Canvas context not found");
        }

        /** @type {number} The width of the canvas. */
        this.__cache_width = 0;
        /** @type {number} The height of the canvas. */
        this.__cache_height = 0;

        /** @type {Array<Cluster>} The list of clusters. */
        this.__pvt_clusters = [];

        /** @type {Deque<CanvasDataPoint>} The list of border data points. */
        this.__pvt_border_datapoints = new Deque();

        this.reset();
        this.attachEventListeners();
    }

    /**
     * Reset the HyadesCanvas instance.
     */
    reset() {

        setTimeout(() => {
            this.updateSize();
            this.__pvt_clusters = [new Cluster([
                Math.round(this.__cache_width / 2),
                Math.round(this.__cache_height / 2),
            ])];
            this.__pvt_border_datapoints.add(new CanvasDataPoint([
                Math.round(this.__cache_width / 2),
                Math.round(this.__cache_height / 2),
            ]));

            const x = Math.round(this.__cache_width / 2);
            const y = Math.round(this.__cache_height / 2);
            const __tmp_regionMap = new Uint32Array(this.__pvt_regionMap.data.buffer);
            const __index = Math.round(y * this.__pvt_regionMap.width + x);
            __tmp_regionMap[__index] = 0xFF000000;
            
            this.render();
        }, 2 * HyadesConfig.Animation.Interval);
    }

    /**
     * Update the canvas size.
     * Note: Resize will automatically reset the canvas.
     */
    updateSize() {
        this.__cache_width = this.__pvt_canvas.clientWidth;
        this.__cache_height = this.__pvt_canvas.clientHeight;

        this.__pvt_canvas.width = this.__cache_width;
        this.__pvt_canvas.height = this.__cache_height;

        this.__tmp_datapoint_canvas = new OffscreenCanvas(this.__cache_width, this.__cache_height);
        this.__tmp_region_canvas = new OffscreenCanvas(this.__cache_width, this.__cache_height);

        this.__tmp_datapoint_ctx = this.__tmp_datapoint_canvas.getContext('2d');
        this.__tmp_region_ctx = this.__tmp_region_canvas.getContext('2d', {
            willReadFrequently: true,
        });

        this.__pvt_regionMap = this.__tmp_region_ctx.createImageData(this.__cache_width, this.__cache_height);
    }

    /**
     * Block transfer the shadow canvas to the main canvas.
     */
    blitShadowCanvas() {
        this.__pvt_ctx.clearRect(0, 0, this.__cache_width, this.__cache_height);
        this.__pvt_ctx.drawImage(this.__tmp_region_canvas, 0, 0);
        this.__pvt_ctx.drawImage(this.__tmp_datapoint_canvas, 0, 0);
    }

    /**
     * Re-render the canvas.
     */
    render() {
        this.__pvt_ctx.clearRect(0, 0, this.__cache_width, this.__cache_height);
        this.blitShadowCanvas();
        this.__pvt_clusters.forEach(cluster => this.plotCentroid(cluster));
    }

    /**
     * Plot a data point on the shadow canvas.
     * @param {number} x - The x-coordinate of the data point.
     * @param {number} y - The y-coordinate of the data point.
     */
    plotDataPoint(x, y) {
        let radius = HyadesConfig.Drawing.DataPointRadius;

        this.__tmp_datapoint_ctx.beginPath();
        this.__tmp_datapoint_ctx.moveTo(x - radius, y - radius);
        this.__tmp_datapoint_ctx.lineTo(x + radius, y + radius);
        this.__tmp_datapoint_ctx.moveTo(x + radius, y - radius);
        this.__tmp_datapoint_ctx.lineTo(x - radius, y + radius);
        this.__tmp_datapoint_ctx.stroke();
    }

    /**
     * Plot a centroid on the shadow canvas.
     * @param {Cluster} cluster - The cluster to plot.
     */
    plotCentroid(cluster) {
        let radius = HyadesConfig.Drawing.CentroidRadius;
        const { x, y, color } = cluster;

        this.__pvt_ctx.beginPath();
        this.__pvt_ctx.fillStyle = color;
        this.__pvt_ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.__pvt_ctx.fill();
        this.__pvt_ctx.stroke();
    }

    /**
     * Attach the event listeners to the canvas.
     */
    attachEventListeners() {
        this.__pvt_canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const canvas_area = this.__pvt_canvas.getBoundingClientRect();
            let x = event.clientX - canvas_area.left;
            let y = event.clientY - canvas_area.top;

            this.__pvt_clusters.push(new Cluster([x, y]));
            this.__pvt_border_datapoints.add(new CanvasDataPoint([x, y]));
            const __tmp_regionMap = new Uint32Array(this.__pvt_regionMap.data.buffer);
            const __index = Math.round(y * this.__pvt_regionMap.width + x);
            __tmp_regionMap[__index] = 0xFF000000;

            this.render();
        });

        this.__pvt_canvas.addEventListener('click', (event) => {
            event.preventDefault();
            const canvas_area = this.__pvt_canvas.getBoundingClientRect();
            let x = event.clientX - canvas_area.left;
            let y = event.clientY - canvas_area.top;

            /** @type {Cluster} */
            let __tmp_cluster = HyadesConfig.Clustering.Algorithm([x, y], this.__pvt_clusters, 1)[0].cluster;
            __tmp_cluster.add([x, y]);

            this.plotDataPoint(x, y);
            this.render();
        });

        this.__pvt_canvas.addEventListener('resize', this.updateSize.bind(this));
    }

    /**
     * Update the borders of the clusters.
     */
    updateBorders(){
        let no_items = this.__pvt_border_datapoints.length;
        for(let i = 0; i < no_items; i++){
            grow(this.__pvt_border_datapoints.remove(), this.__pvt_clusters, this.__pvt_regionMap, this.__pvt_border_datapoints);
        }

        this.__tmp_region_ctx.putImageData(this.__pvt_regionMap, 0, 0);
    }

    /**
     * Loop the canvas rendering.
     */
    loop() {
        this.updateBorders();
        this.render();
        if (HyadesConfig.Animation.Active) {
            setTimeout(() => this.loop(), HyadesConfig.Animation.Interval);
        }
    }
}
