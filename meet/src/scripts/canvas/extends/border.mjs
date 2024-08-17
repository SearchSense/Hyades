import { KNN_algorithm } from "../../clustering/knn/knn.mjs";
import { CanvasDataPoint } from "./datapoint.mjs";
import { Cluster } from "../../clustering/cluster.mjs";
import { Deque } from "../../common/util.mjs";

/**
 * @param {CanvasDataPoint} dp
 * @param {Array<Cluster>} clusters
 * @param {ImageBitmap} regionMap
 * @param {Deque<CanvasDataPoint>} border_datapoints
 */
export function grow(dp, clusters, regionMap, border_datapoints) {
    
    /** @type {Array<CanvasDataPoint>} The list of neighbouring data points. */
    const neighbours = dp.getNeighbours();
    /** @type {Cluster} The current cluster of the data point. */
    const curr_cluster = KNN_algorithm(dp, clusters, 1)[0].cluster;
    /** @type {Array<boolean>} The list of boolean values to check if the neighbour is a border. */
    const __tmp_is_border = new Array(neighbours.length).fill(false);   
    /** @type {Uint32Array} The region map data. */
    const __tmp_regionMap = new Uint32Array(regionMap.data.buffer);
    /** @type {number} The width of the region map. */
    const __tmp_width = regionMap.width;

    const __dp_x = Math.round(dp.x);
    const __dp_y = Math.round(dp.y);
    const __dp_index = Math.round(__dp_y * __tmp_width + __dp_x);

    if(__tmp_regionMap[__dp_index] !== 0xFF000000)
    {
        return;
    }

    for(const cluster of clusters){
        if(cluster === curr_cluster){
            continue;
        }
        /** @type {number} The number of data points in the cluster.*/
        const __dp_count = cluster.get_datapoint_count(dp);
        if(__dp_count ){
            cluster.remove(dp, __dp_count);
            curr_cluster.add(dp, __dp_count);
        }
    }

    for (const neighbour of neighbours) {
        const __ng_x = neighbour.x;
        const __ng_y = neighbour.y;

        if(__ng_x < 0 || __ng_x >= regionMap.width ||
            __ng_y < 0 || __ng_y >= regionMap.height)
                continue;

        const __ng_cluster = KNN_algorithm(neighbour, clusters, 1)[0].cluster;
        __tmp_is_border[neighbours.indexOf(neighbour)] = (curr_cluster !== __ng_cluster);
    }

    if(__tmp_is_border.includes(true)){

        border_datapoints.add(dp);
        
        __tmp_regionMap[__dp_index] = 0xFF000000;

        for(const neighbour of neighbours){
            
            const __ng_x = neighbour.x;
            const __ng_y = neighbour.y;
            
            if(__ng_x < 0 || __ng_x >= regionMap.width ||
                __ng_y < 0 || __ng_y >= regionMap.height)
                continue;

            const __ng_cluster = KNN_algorithm(neighbour, clusters, 1)[0].cluster;
            const __ng_index = Math.round(__ng_y * __tmp_width + __ng_x);
            
            if(__ng_cluster !== curr_cluster){
                if(__tmp_regionMap[__ng_index] !== 0xFF000000){
                    border_datapoints.add(neighbour);
                    __tmp_regionMap[__ng_index] = 0xFF000000;
                }
            }
        }
    }else{
        const curr_distance = dp.euclideanDistance(curr_cluster);
        __tmp_regionMap[__dp_index] = curr_cluster.__pvt_color;
        for(const neighbour of neighbours){

            const __ng_x = neighbour.x;
            const __ng_y = neighbour.y;
            
            if(__ng_x < 0 || __ng_x >= regionMap.width ||
                __ng_y < 0 || __ng_y >= regionMap.height)
                continue;
            const __ng_index = Math.round(__ng_y * __tmp_width + __ng_x);

            if(__tmp_regionMap[__ng_index] === 0){
                border_datapoints.add(neighbour);
                __tmp_regionMap[__ng_index] = 0xFF000000;
                continue;
            }

            if(neighbour.euclideanDistance(curr_cluster) >= curr_distance){
                if(__tmp_regionMap[__ng_index] !== 0xFF000000
                    && __tmp_regionMap[__ng_index] !== curr_cluster.__pvt_color
                ){
                    border_datapoints.add(neighbour);   
                    __tmp_regionMap[__ng_index] = 0xFF000000;
                }
            }else{
                if(__tmp_regionMap[__ng_index] !== 0xFF000000
                    && __tmp_regionMap[__ng_index] !== curr_cluster.__pvt_color
                ){
                    border_datapoints.add(neighbour);   
                    __tmp_regionMap[__ng_index] = 0xFF000000;
                }
            }
        }
    }
}