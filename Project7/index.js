//index.js module//
//Note, this build is for React/Babel Stand-alone files.
//To use with npm, separate each module into respect files and remove commented out import/export declarations.

//MODULES
//////////////////////////////////////////////////////////////////////////////

///Module
//import React from "react";
class PlaceInput extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div id="inputWrapper">
			<input id="placeInput" type="text" name="place-input" maxLength="40" placeholder="Search Restaurants by City"/>
			</div>
		);
	}
}
//export default PlaceInput;
////////////////////////////////////////////////////////////////////////////////


///Module
//import React from "react";
//import Atomic from "./atomic";
class AppTitleBar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			counter: 1,
			counter1: 2,
			counter2: 1,
			Img1:"url(src/img/b1.jpg)",
			Img2:"url(src/img/b2.jpg)",
		};
	}
	componentDidMount(){this.intervalID = setInterval(() => this.updateImg(),7000);};
	componentWillUnmount(){clearInterval(this.intervalID);}

	updateImg(){
		let c, c2;

		setTimeout(() => this.changeImgURL(this.state.counter%2), 800);
		c =	this.state.counter;
		c++;
		if (c>6){c=1};
		this.setState({counter: c});
	};

	changeImgURL(imgNum){
		let c1, imgUrl;

		if (imgNum === 1){
			imgUrl = this.state.Img2;
			c1 = this.state.counter1+2;
			if (c1>6){c1=2};
			imgUrl = "url(src/img/b" + c1 + ".jpg";
			this.setState({counter1: c1, Img2:imgUrl});
		}
		if (imgNum === 0){
			imgUrl = this.state.Img1;
			c1 = this.state.counter2+2;
			if (c1>6){c1=1};
			imgUrl = "url(src/img/b" + c1 + ".jpg";
			this.setState({counter2: c1, Img1:imgUrl});
		}
	};
	render(){
		let bgImage1,bgImage2;

		if (this.state.counter%2 === 1){bgImage1 = {background:this.state.Img1, opacity:1};bgImage2 = {background:this.state.Img2, opacity:0};}
		else{bgImage1 = {background:this.state.Img1, opacity:1};bgImage2 = {background:this.state.Img2, opacity:1};}
		return (
			<div className="title-bar">
			<div className="title-img" style={bgImage1}></div>
			<div className="title-img" style={bgImage2}></div>
			<object className="title-logo"><embed src="src/img/RRlogo.svg"></embed></object>
			<PlaceInput></PlaceInput>
			</div>
		);
	}
}
//export default AppTitleBar;
////////////////////////////////////////////////////////////////////////////////

//Module
//import React from "react";
//import Atomic from "./atomic";
class ReviewForm extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			selectedOption: "5",
		};
	}
	handleOptionChange(e){
		this.setState({selectedOption: e.target.value});
	}
	submitForm(e){
		let stars,comment,i;
		e.preventDefault();
		stars = Number($("input[name=stars]:checked").val());
		comment = $("textarea[name=comment]").val();
		i = (this.props.swData.mNum);
		Atomic.clearAddReviewForm();
		Atomic.restaurantDataStore[i].ratings.push({stars:stars, comment:comment});
		Atomic.setInfoData();
		Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"Restaurant Details", blockAddRest:true});
		Atomic.StreetMapData.update({reviewText:"+ Review"});
		$("#popupAddReview").hide(1000);
	}
	render(){
		return(
			<div id="popupAddReview">
			<div className="flex-wrapper-column">
			<form className="formAddReview" onSubmit={(e) => this.submitForm(e)}>
			<fieldset>
			<legend>Your Details</legend>
			<p>Full Name</p>
			<input type="text" name="name" required></input>
			<p>Email Address</p>
			<input type="email" name="email" required></input>
			</fieldset>
			<fieldset>
			<legend>Your Rating</legend>
			<label><input type="radio" name="stars" value="0" checked={this.state.selectedOption === "0"} onChange={(e) => this.handleOptionChange(e)}/> 0 </label>
			<label><input type="radio" name="stars" value="1" checked={this.state.selectedOption === "1"} onChange={(e) => this.handleOptionChange(e)}/> 1 </label>
			<label><input type="radio" name="stars" value="2" checked={this.state.selectedOption === "2"} onChange={(e) => this.handleOptionChange(e)}/> 2 </label>
			<label><input type="radio" name="stars" value="3" checked={this.state.selectedOption === "3"} onChange={(e) => this.handleOptionChange(e)}/> 3 </label>
			<label><input type="radio" name="stars" value="4" checked={this.state.selectedOption === "4"} onChange={(e) => this.handleOptionChange(e)}/> 4 </label>
			<label><input type="radio" name="stars" value="5" checked={this.state.selectedOption === "5"} onChange={(e) => this.handleOptionChange(e)}/> 5 </label>
			</fieldset>
			<fieldset>
			<legend>Your Review</legend>
			<textarea name="comment" form="formAddReview" required defaultValue="Enter review..."></textarea>
			</fieldset>
			<input type="submit" value="Submit Review"/>
			</form>
			</div>
			</div>
		);
	}
}
//export default ReviewForm;
///////////////////////////////////////////////////////////////////////////////

//Module
//import React from "react";
//import Atomic from "./atomic";
class NewRestaurantForm extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}
	submitForm(e){
		let rName, rAddr, rReviewList;
		e.preventDefault();
		$("#popupAddRestaurant").hide(1000);
		$("#popupInfo").hide(1000);$("#popupAddReview").hide();
		rName = $("input[name=resterauntName]").val();
		rAddr = $("input[name=address1]").val() + ", ";
		rAddr += $("input[name=address2]").val() + ", ";
		rAddr += $("input[name=city]").val() + ". ";
		rAddr += $("input[name=postcode]").val();
		rReviewList = [];
		Atomic.clearAddRestarauntForm();
		Atomic.StreetMapData.update({reviewText:"+ Review"});
		Atomic.restaurantDataStore.push({restaurantName:rName, address:rAddr, lat:this.props.swData.lat, lng:this.props.swData.lng, ratings:rReviewList})
		Atomic.setInfoData();
		Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false});
	}
	render(){
		return(
			<div id="popupAddRestaurant">
			<div className="flex-wrapper-column">
			<form className="formAddReview" onSubmit={(e) => this.submitForm(e)}>
			<fieldset>
			<legend>New Restaurant Details</legend>
			<p>Resteraunt Name</p>
			<input type="text" name="resterauntName" required></input>
			<p>Address Line1</p>
			<input type="text" name="address1" required></input>
			<p>Address Line2</p>
			<input type="text" name="address2" required></input>
			<p>Town/City</p>
			<input type="text" name="city" required></input>
			<p>Post/Zip Code</p>
			<input type="text" name="postcode"></input>
			</fieldset>
			<input type="submit" value="Submit Details"/>
			</form>
			</div>
			</div>
		);
	}
}
//export default NewRestaurantForm;
///////////////////////////////////////////////////////////////////////////////

//Module
//import React from "react";
//import ReviewForm from "./ReviewForm";
//import NewRestaurantForm from "./NewRestaurantForm";
//import Atomic from "./atomic";
class StreetMapData extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			googlePlacesData:false,
			reviewText:"+ Review"
		};
		Atomic.setReactClassUpdate("StreetMapData");
		Atomic.StreetMapData.update = Atomic.StreetMapData.update.bind(this);
	}
	hidePopup(){
		Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false});
		this.setState({reviewText:"+ Review"});
		$("#popupInfo").hide(1000);
		$("#popupAddReview").hide(1000);
		Atomic.addMarkerListeners();
		if (this.props.swData.addRest === true){
			Atomic.clearAddRestarauntForm();
			Atomic.setInfoData();
		}
	}
	showAddReview(){
		if (this.props.swData.addRest === false && this.state.googlePlacesData === false){
			if (this.state.reviewText === "+ Review"){
				Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"Add Review", blockAddRest:true});
				this.setState({reviewText:"Cancel Review"})
				$("#popupAddReview").show(1000);
			}else{
				Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"Restaurant Details", blockAddRest:true});
				this.setState({reviewText:"+ Review"})
				$("#popupAddReview").hide(1000);
			}
		}
	}
	render(){
		if (this.props.swData.mNum !== -1){
			return(
				<div id="popupInfo">
				<div className="popup-header">
				<div className="popup-add" onClick={() => this.showAddReview()}>{this.state.reviewText}</div>
				<div className="popup-close" onClick={() => this.hidePopup()}>X</div>
				</div>
				<ReviewForm swData={this.props.swData}></ReviewForm>
				<NewRestaurantForm swData={this.props.swData}></NewRestaurantForm>
				<img src={this.props.swData.url}></img>
				<div>{Atomic.infoData[this.props.swData.mNum]}</div>
				</div>
			);
		}
		else return(<div id="popupInfo"></div>);
	}
}
//export default StreetMapData;
///////////////////////////////////////////////////////////////////////////////

///Module
//import React from "react";
//import StreetMapData from "./StreetMapData";
//import Atomic from "./atomic";
class GoogleMap extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			markerData:{mNum:-1,url:"",lat:0, lng:0, addRest:false},
			showPopUp:false,
			mouseDrop:false
		};
		Atomic.setReactClassUpdate("GoogleMap");
		Atomic.GoogleMap.update = Atomic.GoogleMap.update.bind(this);
	}
	addRestaurantMarker(e){
		if (this.state.mouseDrop === true){
			let pos,newMarker,markerData,markerNum,url;
			pos = {lat:e.latLng.lat(), lng:e.latLng.lng()}
			url = "https://maps.googleapis.com/maps/api/streetview?size=320x300&location=" + pos.lat + "," + pos.lng + "&fov=90&heading=235&pitch=10&" + Atomic.mapsAPIkey;
			markerNum = Atomic.marker.length;
			markerData = {mNum:markerNum, url:url, lat:pos.lat, lng:pos.lng, addRest:true}
			newMarker = new google.maps.Marker({position: pos, icon:'src/img/ricon_sml.png', map: Atomic.map});
			Atomic.marker.push(newMarker);
			Atomic.GoogleMap.update({markerData:markerData, mouseDrop:false});
			Atomic.InfoPanel.update({addRestaurantText:"Enter Details", blockAddRest:true});
			Atomic.StreetMapData.update({reviewText:"Add Restaurant"})
			Atomic.map.setCenter(pos);
			$("#mouseDropIcon").hide();
			$("#popupAddRestaurant").show();
			$("#popupInfo").show(1000);
		}
	}
	getLocation(){
		let options = {enableHighAccuracy: true, timeout: 7000, maximumAge: 0};
		navigator.geolocation.getCurrentPosition((position) => this.locationSuccess(position), this.locationError, options);
	}
	locationSuccess(position){
		let crd;
		crd = position.coords;
		Atomic.location = {lat:crd.latitude, lng:crd.longitude};
		Atomic.map.setCenter(Atomic.location);
		Atomic.setInfoData();
	};
	locationError(err){
		console.warn(`ERROR(${err.code}): ${err.message}`);
	};
	//nodisplayMap(){console.log("GoogleMaps API not loaded");};
	componentDidMount(){
		Atomic.location = {lat:50.720932, lng:-1.903761};
		Atomic.map = new google.maps.Map(document.getElementById('map'), {zoom: 17, center: Atomic.location});
		Atomic.map.addListener('click', (e) => this.addRestaurantMarker(e));
		//google.maps.event.addListenerOnce(Atomic.map, 'idle', function(){console.log("mapLoaded");});
		//google.maps.event.addListenerOnce(Atomic.map, 'tilesloaded', function(){console.log("mapLoaded");});
		//Atomic.map.addEventListener('google-map-ready', function(e) {console.log("mapLoaded");});
		google.maps.event.addListenerOnce(Atomic.map, 'bounds_changed', function(){Atomic.search();});
		Atomic.loadRestaurantData("src/restaurantData.json");
		this.getLocation();
	};
	render(){
		return (<div id="mapWrapper"><div id="map"></div><StreetMapData swData={this.state.markerData}></StreetMapData></div>);
	}
}
//export default GoogleMap;
////////////////////////////////////////////////////////////////////////////////

//Module
//import React from "react";
//import Atomic from "./atomic";
class SVGClipDefs extends React.Component {
	render(){
		let defStyle = {height:0, width: 0};
		return(
			<div style={defStyle}>
			<svg>
			<defs>
			<clipPath id="id0">
			<path d="M115 28l21 64 67 0 -55 40 22 64 -55 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm970 0l20 64 68 0 -55 40 21 64 -54 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm-243 0l21 64 68 0 -55 40 21 64 -55 -40 -55 40 21 -64 -54 -40 67 0 21 -64zm-242 0l20 64 68 0 -55 40 21 64 -54 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm-243 0l21 64 68 0 -55 40 21 64 -55 -40 -55 40 22 -64 -55 -40 67 0 21 -64z"/>
			</clipPath>
			</defs>
			</svg>
			</div>
		);
	}
}

//Module
//import React from "react";
//import Atomic from "./atomic";
class StarRating extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		let starBox,clipStyle,filStyle1,filStyle2;
		starBox = 240*this.props.stars;
		starBox = starBox.toString();
		clipStyle = {clipPath:"url(#id0)"};
		filStyle1 = {fill:"none",stroke:"#000",strokeWidth:10};
		filStyle2 = {fill:"#f70"};
		if (this.props.stars !== "no reviews"){
			return(
				<svg className="review-stars" width="100%" height="100%" version="1.1" viewBox="0 0 1199 218">
				<g style={clipStyle}>
				<rect style={filStyle2} x="0" y="0" width={starBox} height="218"/>
				</g>
				<path style={filStyle1} d="M115 28l21 64 67 0 -55 40 22 64 -55 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm970 0l20 64 68 0 -55 40 21 64 -54 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm-243 0l21 64 68 0 -55 40 21 64 -55 -40 -55 40 21 -64 -54 -40 67 0 21 -64zm-242 0l20 64 68 0 -55 40 21 64 -54 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm-243 0l21 64 68 0 -55 40 21 64 -55 -40 -55 40 22 -64 -55 -40 67 0 21 -64z"/>
				</svg>);
			}	else{
				return(<svg className="review-stars" width="100%" height="100%" version="1.1" viewBox="0 0 1199 218">
				<g style={clipStyle}>
				<rect style={filStyle2} x="0" y="0" width="0" height="218"/>
				</g>
				<path style={filStyle1} d="M115 28l21 64 67 0 -55 40 22 64 -55 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm970 0l20 64 68 0 -55 40 21 64 -54 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm-243 0l21 64 68 0 -55 40 21 64 -55 -40 -55 40 21 -64 -54 -40 67 0 21 -64zm-242 0l20 64 68 0 -55 40 21 64 -54 -40 -55 40 21 -64 -55 -40 68 0 21 -64zm-243 0l21 64 68 0 -55 40 21 64 -55 -40 -55 40 22 -64 -55 -40 67 0 21 -64z"/>
				</svg>
			);
		}
	}
}

///Module
//import React from "react";
//import StarRating from "./StarRating";
//import Atomic from "./atomic";
class ReviewList extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		let reviewData = [];
		//let reviewStyle = {display:"block"};
		//if (this.props.restReviewList === "none"){reviewStyle = {display:"none"};}
		if (this.props.restReviewList !== "none"){
			for(let i=0;i<this.props.restReviewList.length;i++){
				reviewData.push(<li key={i+"reviewlist"}>{this.props.restReviewList[i].comment}<br></br><StarRating key={i+"StarRating"} stars={this.props.restReviewList[i].stars}></StarRating></li>);
			}
		}
		let dataStyle = {maxHeight:this.props.reviewShow};
		return (
			<div className="data-reviews" style={dataStyle}>
			<h2>Reviews:</h2>
			<ul>
			{reviewData}
			</ul>
			</div>
		);
	}
}
//export default ReviewList
////////////////////////////////////////////////////////////////////////////////


///Module
//import React from "react";
//import ReviewList from "./ReviewList";
//import StarRating from "./StarRating";
//import Atomic from "./atomic";
class DataItem extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			height:"0px",
		};
	}
	toggleList(){
		if (this.state.height === "0px"){this.setState({height:"500px"});}
		else {this.setState({height:"0px"});}
	};
	bounceMapMarker(){
		Atomic.marker[this.props.dataIndex+1].setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(() => this.stopBounce(), 3000);
		Atomic.map.panTo(Atomic.marker[this.props.dataIndex+1].getPosition());
		//Atomic.search();
	};
	stopBounce(){
		Atomic.marker[this.props.dataIndex+1].setAnimation(null);
	}
	render(){
		let dataItemStyle = {display:this.props.dataItemStyle};
		let dataButtonStyle = {display:"block"};
		if (this.props.restReviewList === "none"){dataButtonStyle = {display:"none"};}
		return (
			<div className="data-item glow-hover" style={dataItemStyle} onClick={() => this.bounceMapMarker()}>
			<h1>{this.props.restName}</h1>
			<p>{this.props.restAddr}</p>
			<p><br></br><StarRating stars={this.props.restRating}></StarRating></p>
			<button className="data-button" style={dataButtonStyle} onClick={() => this.toggleList()}>Show/Hide Reviews</button>
			<ReviewList restReviewList={this.props.restReviewList} reviewShow={this.state.height}></ReviewList>
			</div>
		);
	}
}
//export default DataItem
////////////////////////////////////////////////////////////////////////////////


///Module
//import React from "react";
//import DataItem from "./DataItem";
//import Atomic from "./atomic";
class InfoPanel extends React.Component {
	constructor(props){
		super(props);
		this.state = {addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false}
		Atomic.setReactClassUpdate("InfoPanel");
		Atomic.InfoPanel.update = Atomic.InfoPanel.update.bind(this);
	}
	showAddRestaurant(){
		if (this.state.addRestFlag === false && this.state.blockAddRest === false){
			Atomic.removeMarkerListeners();
			$("#mouseDropIcon").show();
			Atomic.GoogleMap.update({mouseDrop:true});
			this.setState({addRestFlag:true, addRestaurantText:"Cancel Restaurant"})
		}
		if (this.state.addRestFlag === true && this.state.blockAddRest === false){
			Atomic.addMarkerListeners();
			Atomic.GoogleMap.update({mouseDrop:false});
			$("#mouseDropIcon").hide();
			this.setState({addRestFlag:false, addRestaurantText:"+ Restaurant"})
		}
	}
	filterRatings(filterType){
		if (this.state.addRestFlag === false && this.state.blockAddRest === false){
			let filterValue;
			filterValue = $("input[name=filterRange]").val();
			filterValue = filterValue/10;
			if (filterType === "high"){
				Atomic.setInfoData(filterValue,5);
				Atomic.InfoPanel.update();
			}else {
				Atomic.setInfoData(0,filterValue);
				Atomic.InfoPanel.update();
			}
		}
	}
	render(){
		let normalStyle, buttonStyle;
		if (this.state.blockAddRest === true || this.state.addRestFlag === true){
			normalStyle = {opacity:0.5, pointerEvents:"none"};
			buttonStyle = {marginLeft:15, marginRight:15, opacity:0.5, pointerEvents:"none"};
		}else{
			normalStyle = {opacity:1, pointerEvents:"all"};
			buttonStyle = {marginLeft:15, marginRight:15, opacity:1, pointerEvents:"all"};
		}
		return (
			<div id="infoPanel">
			<div className="popup-header">
			<div className="popup-add" onClick={() => this.showAddRestaurant()}>{this.state.addRestaurantText}</div>
			</div>
			<div id="filterPanel">
			<button  className="data-button" style={buttonStyle} onClick={() => this.filterRatings("low")}>Filter Lower</button>
			<input className="filter-range" style={normalStyle} type="range" name="filterRange" min="1" max="50"/>
			<button  className="data-button" style={buttonStyle} onClick={() => this.filterRatings("high")}>Filter Higher</button>
			</div>
			<div style={normalStyle}>{Atomic.infoData}</div>
			</div>
		);
	}
}
//export default InfoPanel;
////////////////////////////////////////////////////////////////////////////////

///Module
//import React from "react";
//import Atomic from "./atomic";
class MouseDropIcon extends React.Component {
	constructor(props){
		super(props);
		this.state = {x:"0px", y:"0px", drop:false}
	}
	moveIcon(e){
		let left = ((e.pageX-22) + "px");
		let top = ((e.pageY-45) + "px");
		this.setState({x:left, y:top});
	}
	componentDidMount(){
		$(document).on("mousemove",(e) => this.moveIcon(e));
	};
	render(){
		let pos = {
			left:this.state.x,
			top:this.state.y,
		};
		return (
			<div id="mouseDropIcon" style={pos}></div>
		);
	}
}
//export default MouseDropIcon;
////////////////////////////////////////////////////////////////////////////////

///Module
//import React from "react";
//import Atomic from "./atomic";
class ReviewFooter extends React.Component {
	render(){
		return (
			<div id="reviewFooter"></div>
		);
	}
}
//export default ReviewFooter;
////////////////////////////////////////////////////////////////////////////////


//MAIN index.js module   ///////////////////
//import React from "react";
//import ReactDOM from "react-dom";
//import SVGClipDefs from "./SVGClipDefs";
//import AppTitleBar from "./AppTitleBar";
//import GoogleMap from "./GoogleMap";
//import InfoPanel from "./InfoPanel";
//import ReviewFooter from "./ReviewFooter";
//import MouseDropIcon from "./MouseDropIcon";

//PUBLIC
var destination = document.querySelector("#root");

ReactDOM.render(
	<div>
	<SVGClipDefs/>
	<div>
	<AppTitleBar></AppTitleBar>
	</div>
	<div id="centerSection">
	<GoogleMap></GoogleMap>
	<InfoPanel></InfoPanel>
	</div>
	<ReviewFooter></ReviewFooter>
	<MouseDropIcon></MouseDropIcon>
	</div>
	,destination
);
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
