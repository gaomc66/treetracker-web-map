/*
 * The module to handle greenstand map
 */
const axios = require("axios");
const chai = require("chai");

class MapModel {
  constructor(apiUrl){
    console.log('ok' + apiUrl);
    this.apiUrl = apiUrl;
    this._markers = [];
    this._map = undefined;
    this._cancelAxios = undefined;
  }

  set markers(mks){
    this._markers = mks;
  }

  get markers(){
    return this._markers;
  }

  set map(map){
    this._map = map;
  }

  get map(){
    return this._map;
  }

  /*
   * To check if need display arrow
   */
  async checkArrow(){
    console.log("check arrow");
    if(
      //no markers
      this._markers.length === 0 || 
      //all markers out of bounds
      this._markers.every(marker => !this._map.getBounds().contains(marker.getPosition()))
    ){
      //no markers, need to find nearest
      const center = this._map.getCenter();
      const nearest = await this.getNearest();
      if(nearest){
        //find it
        //get nearest markers
        chai.assert.isNumber(nearest.lat);
        chai.assert.isNumber(nearest.lng);
        if(!this._map.getBounds().contains({
          lat: nearest.lat,
          lng: nearest.lng,
        })){
          console.log("out of bounds, display arrow");
          const dist = {
            lat: nearest.lat,
            lng: nearest.lng,
          };
          const distanceLat = google.maps.geometry.spherical.computeDistanceBetween(
            center,
            new google.maps.LatLng(
              dist.lat,
              center.lng()
              ),
          );
          console.log("distanceLat:", distanceLat);
          chai.expect(distanceLat).a("number");
          const distanceLng = google.maps.geometry.spherical.computeDistanceBetween(
            center,
            new google.maps.LatLng(
              center.lat(),
              dist.lng,
              ),
          );
          console.log("distanceLng:", distanceLng);
          chai.expect(distanceLng).a("number");
          console.log("dist:", dist);
          console.log("center:", center, center.lat());
          if(dist.lat > center.lat()){
            console.log("On the north");
            if(distanceLat > distanceLng){
              console.log("On the north");
              this.showArrow("north");
            }else{
              if(dist.lng > center.lng()){
                console.log("On the east");
                this.showArrow("east");
              }else{
                console.log("On the west");
                this.showArrow("west");
              }
            }
          }else{
            console.log("On the south");
            if(distanceLat > distanceLng){
              console.log("On the south");
              this.showArrow("south");
            }else{
              if(dist.lng > center.lng()){
                console.log("On the east");
                this.showArrow("east");
              }else{
                console.log("On the west");
                this.showArrow("west");
              }
            }
          }

        }else{
          this.hideArrow();
        }
      }
    }else{
      this.hideArrow();
    }
  }

  /*
   * To show/hide the arrow icon on the map
   */
  hideArrow(){
    const arrow = $("#arrow");
    arrow.hide();
  }

  showArrow(direction){
    const arrow = $("#arrow");
    chai.expect(direction).oneOf(["north", "south", "west", "east"]);
    if(direction === "north"){
      arrow.removeClass();
      arrow.addClass("north");
    }else if(direction === "south"){
      arrow.removeClass();
      arrow.addClass("south");
    }else if(direction === "west"){
      arrow.removeClass();
      arrow.addClass("west");
    }else if(direction === "east"){
      arrow.removeClass();
      arrow.addClass("east");
    }
    arrow.show();
  }

  /*
   * pan map to nearest point
   */
  async gotoNearest(){
    this.hideArrow();
    const nearest = await this.getNearest();
    if(nearest){
      this._map.panTo(nearest);
    }
  }

  async getNearest(){
    //try to cancel previous request if any
    //await this._source.cancel("cancel prevous nearest request");
    if(this._cancelAxios){
      console.log("cancel");
      this._cancelAxios("cancel previous nearest request");
    }
    const center = this._map.getCenter();
    console.log("current center:", center.toJSON());
    const zoom_level = this._map.getZoom();
    const res = await axios.get(this.apiUrl + `nearest?zoom_level=${zoom_level}&lat=${center.lat()}&lng=${center.lng()}`, {
      cancelToken: new axios.CancelToken((c) => {
        this._cancelAxios = c;
      }),
    });
    this._cancelAxios = undefined;
    if(res.status !== 200){
      throw Error("request failed");
    }
    let {nearest} = res.data;
    nearest = nearest? {
      lat: nearest.coordinates[1],
      lng: nearest.coordinates[0],
    }:
    undefined;
    console.log("get nearest:", nearest);
    return nearest;
  }
}

module.exports = MapModel;
