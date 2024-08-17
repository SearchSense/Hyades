import { HyadesConfig } from "../common/config.mjs";
import { _global_datapoint_cache } from "./extends/datapoint.mjs";
import { CanvasCluster } from "./extends/cluster.mjs";

/**
 * The canvas class is responsible for drawing the clusters on the canvas.
 */
export class HyadesCanvas {
    /**
     * @param {string} canvasId - The id of the canvas element.
     */
    constructor(canvasId = "hyades-canvas") {
        /** @type {HTMLCanvasElement} The canvas element. */
        this._pvt_canvas = document.querySelector(`#${String(canvasId)}`);
        if (!this._pvt_canvas) {
            throw new Error("Canvas element not found");
        }

        /** @type {CanvasRenderingContext2D} The canvas context. */
        this._pvt_ctx = this._pvt_canvas.getContext('2d');
        if (!this._pvt_ctx) {
            throw new Error("Canvas context not found");
        }

        /** @type {number} The width of the canvas. */
        this._cache_width = 0;
        /** @type {number} The height of the canvas. */
        this._cache_height = 0;

        /** @type {Array<CanvasCluster>} The list of clusters. */
        this._pvt_clusters = [];

        /** @type {Map<string, CanvasCluster>} The cluster-color map. */
        this._pvt_clusterMap = new Map();

        this.reset();
        this.attachEventListeners();
    }

    /**
     * Reset the HyadesCanvas instance.
     */
    reset() {
        setTimeout(() => {
            this.updateSize();

            const _tmp_cluster = new CanvasCluster([
                Math.round(this._cache_width / 2),
                Math.round(this._cache_height / 2),
            ]);
            this._pvt_clusters = [_tmp_cluster];
            this._pvt_clusterMap.clear();
            this._pvt_clusterMap.set(_tmp_cluster._pvt_color, _tmp_cluster);

            this.render();
        }, 2 * HyadesConfig.Animation.Interval);
    }

    /**
     * Update the canvas size.
     * Note: Resize will automatically reset the canvas.
     */
    updateSize() {
        this._cache_width = this._pvt_canvas.clientWidth;
        this._cache_height = this._pvt_canvas.clientHeight;

        this._pvt_canvas.width = this._cache_width;
        this._pvt_canvas.height = this._cache_height;

        this._tmp_datapoint_canvas = new OffscreenCanvas(this._cache_width, this._cache_height);
        this._tmp_region_canvas = new OffscreenCanvas(this._cache_width, this._cache_height);
        this._tmp_border_canvas = new OffscreenCanvas(this._cache_width, this._cache_height);

        this._tmp_datapoint_ctx = this._tmp_datapoint_canvas.getContext('2d');
        this._tmp_region_ctx = this._tmp_region_canvas.getContext('2d', {
            willReadFrequently: true,
        });
        this._tmp_border_ctx = this._tmp_border_canvas.getContext('2d', {
            willReadFrequently: true,
        });

        this._pvt_regionMap = this._tmp_region_ctx.createImageData(this._cache_width, this._cache_height);
        this._pvt_borderMap = this._tmp_border_ctx.createImageData(this._cache_width, this._cache_height);

        /** @type {Map<symbol, number>} The temporary borders. */
        this._cache_border = new Map();

        new Uint32Array(this._pvt_regionMap.data.buffer).fill(0);
        new Uint32Array(this._pvt_borderMap.data.buffer).fill(0);
    }

    /**
     * Block transfer the shadow canvas to the main canvas.
     */
    blitShadowCanvas() {
        this._pvt_ctx.clearRect(0, 0, this._cache_width, this._cache_height);
        this._pvt_ctx.drawImage(this._tmp_region_canvas, 0, 0);
        this._pvt_ctx.drawImage(this._tmp_datapoint_canvas, 0, 0);
        this._pvt_ctx.drawImage(this._tmp_border_canvas, 0, 0);
    }

    /**
     * Re-render the canvas.
     */
    render() {
        this._pvt_ctx.clearRect(0, 0, this._cache_width, this._cache_height);
        this.blitShadowCanvas();
        this._pvt_clusters.forEach(cluster => this.plotCentroid(cluster));
    }

    /**
     * Plot a data point on the shadow canvas.
     * @param {number} x - The x-coordinate of the data point.
     * @param {number} y - The y-coordinate of the data point.
     */
    plotDataPoint(x, y) {
        let radius = HyadesConfig.Drawing.DataPointRadius;

        const _tmp_x = Math.round(x);
        const _tmp_y = Math.round(y);

        this._tmp_datapoint_ctx.beginPath();
        this._tmp_datapoint_ctx.moveTo(_tmp_x - radius, _tmp_y - radius);
        this._tmp_datapoint_ctx.lineTo(_tmp_x + radius, _tmp_y + radius);
        this._tmp_datapoint_ctx.moveTo(_tmp_x + radius, _tmp_y - radius);
        this._tmp_datapoint_ctx.lineTo(_tmp_x - radius, _tmp_y + radius);
        this._tmp_datapoint_ctx.stroke();
    }

    /**
     * Plot a centroid on the shadow canvas.
     * @param {CanvasCluster} cluster - The cluster to plot.
     */
    plotCentroid(cluster) {
        let radius = HyadesConfig.Drawing.CentroidRadius;
        const { x, y, color } = cluster;

        const _tmp_x = Math.round(x);
        const _tmp_y = Math.round(y);

        this._pvt_ctx.beginPath();
        this._pvt_ctx.fillStyle = color;
        this._pvt_ctx.arc(_tmp_x, _tmp_y, radius, 0, 2 * Math.PI);
        this._pvt_ctx.fill();
        this._pvt_ctx.stroke();
    }

    /**
     * Attach the event listeners to the canvas.
     */
    attachEventListeners() {
        this._pvt_canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const _tmp_canvas_rect = this._pvt_canvas.getBoundingClientRect();
            let _tmp_x = event.clientX - _tmp_canvas_rect.left;
            let _tmp_y = event.clientY - _tmp_canvas_rect.top;

            const _tmp_cluster = new CanvasCluster([_tmp_x, _tmp_y]);
            this._pvt_clusters.push(_tmp_cluster);
            this._pvt_clusterMap.set(_tmp_cluster._pvt_color, _tmp_cluster);
            this.render();
        });

        this._pvt_canvas.addEventListener('click', (event) => {
            event.preventDefault();
            const _tmp_canvas_rect = this._pvt_canvas.getBoundingClientRect();
            let _tmp_x = event.clientX - _tmp_canvas_rect.left;
            let _tmp_y = event.clientY - _tmp_canvas_rect.top;

            /** @type {CanvasCluster} */
            let _tmp_cluster = HyadesConfig.Clustering.Algorithm(
                [_tmp_x, _tmp_y],
                this._pvt_clusters,
                1
            )[0].cluster;
            _tmp_cluster.add([_tmp_x, _tmp_y]);

            this.plotDataPoint(_tmp_x, _tmp_y);
            this.render();
        });

        this._pvt_canvas.addEventListener('resize', this.updateSize.bind(this));
    }

    /**
     * Expand the cluster regions on the canvas.
     */
    expandRegions() {
        this._pvt_clusters.forEach(cluster => {
            cluster.grow(this._pvt_clusters, this._pvt_regionMap, this._pvt_clusterMap);
        });

        const _tmp_borderMap = new Uint32Array(this._pvt_borderMap.data.buffer);
        _tmp_borderMap.fill(0);

        this._pvt_clusters.forEach(cluster => {
            cluster._active_boundary.forEach(coordinate => {
                this._cache_border.set(coordinate.symbol, HyadesConfig.Animation.BorderTimeout);
            });
            cluster._new_boundary.forEach(coordinate => {
                this._cache_border.set(coordinate.symbol, HyadesConfig.Animation.BorderTimeout);
            });
        });

        this._cache_border.forEach((value, symbol) => {
            const _tmp_dp = _global_datapoint_cache.get(symbol);
            const _tmp_freq = value - 1;
            const _tmp_index = Math.round(_tmp_dp.y * this._cache_width + _tmp_dp.x);
            if (_tmp_index < 0 || _tmp_index >= _tmp_borderMap.length)
                return;

            if (_tmp_freq < 0) {
                this._cache_border.delete(symbol);
                _tmp_borderMap[_tmp_index] = 0;
            } else {
                _tmp_borderMap[_tmp_index] = 0xFF000000;
                this._cache_border.set(symbol, _tmp_freq);
            }
        });

        this._tmp_region_ctx.putImageData(this._pvt_regionMap, 0, 0);
        this._tmp_border_ctx.putImageData(this._pvt_borderMap, 0, 0);
    }

    /**
     * Loop the canvas rendering.
     */
    loop() {
        this.expandRegions();
        this.render();
        if (HyadesConfig.Animation.Active) {
            setTimeout(this.loop.bind(this), HyadesConfig.Animation.Interval);
        }
    }
}
