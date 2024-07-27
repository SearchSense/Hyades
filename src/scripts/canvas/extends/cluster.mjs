import CONFIG from "../../common/config.mjs";
import { Cluster } from "../../cluster/cluster.mjs"

/**
 * Extended Cluster class for use with the canvas
 */
export class CanvasCluster extends Cluster {
    constructor(...options) {
        super(...options)

        this._color = 0;
        this.color = "#";
        for (let i = 0; i < 3; i++) {
            const random = Math.floor(Math.random() * 256);
            this._color = this._color << 8 | random;
            this.color += Number(random).toString(16).padStart(2, '0')
        }
        this._color = this._color << 8 | 255;

        this.region_boundary = [this.centroid];
    }

    get x() {
        return this.centroid.coords[0];
    }

    get y() {
        return this.centroid.coords[1];
    }

    /**
     * Expand the cluster region one step at a time
     * @param {Array<CanvasCluster>} clusters - The list of clusters to grow
     * @param {ImageBitmap} region_map - Tmapcanvas used to draw the clusters
     */
    grow(clusters, region_map) {
        let new_region_boundary = [];
        const region_map_data = new Uint32Array(region_map.data.buffer);


        for (const datapoint of this.region_boundary) {
            let new_datapoints = datapoint.getNeighbours();

            for (const new_datapoint of new_datapoints) {
                const [x, y] = new_datapoint.coords;

                if (x < 0 || x >= region_map.width || y < 0 || y >= region_map.height) {
                    continue;
                }

                const pixel = region_map_data[y * region_map.width + x];

                if (pixel === this._color) {
                    continue;
                } else if (pixel === 0) {
                    // console.log(x, y, new_datapoint)
                    new_region_boundary.push(new_datapoint);
                    region_map_data[y * region_map.width + x] = this._color;
                    continue;
                }

                let cluster = CONFIG.CLUSTER.ASSIGN(new_datapoint, clusters);

                if (cluster !== this) {
                    new_region_boundary.push(new_datapoint);
                    region_map_data[y * region_map.width + x] = this._color;
                }
            }
        } // for datapoint of this.region_boundary

        this.region_boundary = new_region_boundary;
        console.log(this.region_boundary.length);
    }
}
