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

    constructor(private http: Http){}

    ngOnInit() {

        // Defining the map container properties
        this.myMap = L.map('myMap', {
            center: L.latLng(0, 0),
            zoom: 3
        });

        // Defining the basemap
        var basemapLayer1 = L.tileLayer.wms('http://tile.stamen.com/toner-background/{z}/{x}/{y}.png', {
            layers: 'Stamen Country Borders',
            maxZoom: 18,
            opacity: 0.8,
            attribution: "<a href='https://stamen.com/'>© Stamen Design LLC</a>"
        });

        var basemapLayer2 = L.tileLayer.wms('http://ows.terrestris.de/osm/service', {
            layers: 'TOPO-WMS',
            opacity: 0.5,
            attribution: "<a href='https://www.terrestris.de/'>Copyright © 2017 terrestris GmbH & Co</a>"
        });
        
        var basemapLayer3 = L.tileLayer.wms('http://ows.terrestris.de/osm/service', {
            layers: 'TOPO-OSM-WMS',
            opacity: 0.5,
            attribution: "<a href='https://www.terrestris.de/'>Copyright © 2017 terrestris GmbH & Co</a>"
        });

        var basemapLayer4 = L.tileLayer.wms('http://ows.terrestris.de/osm/service', {
            layers: 'OSM-WMS',
            opacity: 0.5,
            attribution: "<a href='https://www.terrestris.de/'>Copyright © 2017 terrestris GmbH & Co</a>"
        });

        var basemapLayer5 = L.tileLayer.wms('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            layers: 'OSM - Basemap',
            opacity: 0.5,
            attribution: "<a href='http://www.openstreetmap.org/'>OpenStreetMap®</a>"
        });

        var wmsLayer1 = L.tileLayer.wms('http://10.16.2.55:8080/geoserver/wms', {
            layers: 'Boundary',
            opacity: 0.5,
            attribution: 'Sample Layer from GeoServer'
        });        
        
        // Define a layer group for the basemap
        var basemapLayers = {
            'World Countries Border': basemapLayer1,
            'Topographic Map': basemapLayer2,
            'OSM Topographic Map': basemapLayer3,
            'National Geographic Map': basemapLayer4,
            'Open Street Map': basemapLayer5
        }

        // Define a layer group for the wms layers
        var wmsLayers = { 
            'Sample Internal WMS Layer': wmsLayer1.addTo(this.myMap)
        }; 
        
        // Add the layers to the map
        L.control.layers(basemapLayers, wmsLayers).addTo(this.myMap);  
    }


    loadWMSLayer(){
        var geojsonMarkerOptions = {
            radius: 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var conditionURL = '/query?where=' + this.whereCondition + '&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=' + this.srid + '&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=' + this.returnDistinctValues + '&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';
        this.http.get( this.wmsURL + conditionURL)
        .map((response: Response) => {
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
                    }
                }
            }).addTo(this.myMap);
        }).subscribe();

        this.myMap.eachLayer(function (layer) {
            if (layer.feature){
                console.log(layer.feature.id);
            }
        });
    }

    onEachFeature(feature, layer) {
        if (feature.properties) {
        layer.bindPopup(
            feature.properties.name
        )}
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