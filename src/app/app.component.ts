import { Component, Directive, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletDirective } from  '@asymmetrik/angular2-leaflet';
import {Http,Response} from '@angular/http';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    // Define the global variables and assign the default values
    myMap;
    wmsURL: string = 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/WorldCities/FeatureServer/0';
    whereCondition: string = '1=1';
    srid: string = '4326';
    returnDistinctValues: string = 'false';


    onMapReady(map: L.Map) {
        
    }

    constructor(private http: Http){

    }



    ngOnInit() {

        // Defining the initial map
        this.myMap = L.map('myMap', {
            center: L.latLng(30, -80), zoom: 3
        });

        // Defining the basemap
        var basemapLayer1 = L.tileLayer.wms('http://tile.stamen.com/toner-background/{z}/{x}/{y}.png', {
            layers: 'Open Street Map',
            maxZoom: 18,
            opacity: 0.8,
            attribution: 'Open Street Map'
        });

        // Defining wms layers
        var wmsLayer1 = L.tileLayer.wms('http://ows.terrestris.de/osm/service', {
            layers: 'TOPO-WMS',
            opacity: 0.5,
            attribution: 'TOPO-WMS'
        });
        
        var wmsLayer2 = L.tileLayer.wms('http://ows.terrestris.de/osm/service', {
            layers: 'TOPO-OSM-WMS',
            opacity: 0.5,
            attribution: 'TOPO-OSM-WMS'
        });

        var wmsLayer3 = L.tileLayer.wms('http://ows.terrestris.de/osm/service', {
            layers: 'OSM-WMS',
            opacity: 0.5,
            attribution: 'OSM-WMS'
        });

        var wmsLayer4 = L.tileLayer.wms('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            layers: 'OSM - Basemap',
            opacity: 0.5,
            attribution: 'OSM - Basemap'
        });

        var wmsLayer5 = L.tileLayer.wms('http://10.16.2.55:8080/geoserver/wms', {
            layers: 'Boundary',
            opacity: 0.5,
            attribution: 'OSM-WMS'
        });        
        
        // Define a layer group for the basemap
        var basemapLayers = {
            'Basemap': basemapLayer1
        }

        // Define a layer group for the wms layers
        var wmsLayers = { 
            'TOPO-WMS': wmsLayer1.addTo(this.myMap),
            'TOPO-OSM-WMS': wmsLayer2.addTo(this.myMap),
            'OSM-WMS': wmsLayer3.addTo(this.myMap),
            'Basemap': wmsLayer4.addTo(this.myMap)
        }; 
        
      
    


        // Add the layers to the map
        L.control.layers(basemapLayers, wmsLayers).addTo(this.myMap);
    }


    loadWMSLayer(){
        //Read json file
        var obj;
        
        //this.getJSON().subscribe(data => obj=data);

        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var conditionURL = '/query?where=' + this.whereCondition + '&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=' + this.srid + '&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=' + this.returnDistinctValues + '&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';
        this.http.get( this.wmsURL + conditionURL)
        .map((response: Response) => {
            console.log(response.json());
            
            var geoJsonLayer1 = L.geoJSON(response.json(), {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                onEachFeature: this.onEachFeature,
                style: function(feature) {
                    switch (feature.properties['POP']) {
                        case 'test1': return {
                                                radius: 5,
                                                fillColor: "#5942f4",
                                                color: "#000",
                                                weight: 1,
                                                opacity: 1,
                                                fillOpacity: 0.8
                                            };
                        case 'test2': return {
                                                radius: 10,
                                                fillColor: "#41f465",
                                                color: "#000",
                                                weight: 1,
                                                opacity: 1,
                                                fillOpacity: 0.8
                                            };
                        case 'test3': return {
                                                radius: 20,
                                                fillColor: "#f47341",
                                                color: "#000",
                                                weight: 1,
                                                opacity: 1,
                                                fillOpacity: 0.8
                                            };                               
                    }
                }            
            }).addTo(this.myMap);         
            
        }).subscribe();            
    }

    onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        layer.bindPopup(
            feature.properties.name
        )}
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || { };
    }

    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}


@Directive({
	selector: '[myCustomDirective]'
})
export class MyCustomDirective {
	leafletDirective: LeafletDirective;
	
	constructor(leafletDirective: LeafletDirective) {
    	this.leafletDirective = leafletDirective;
    }

	someFunction() {
	    if (null != this.leafletDirective.getMap()) {
	        // Do stuff with the map
	    }
	}
}