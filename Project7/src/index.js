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
class SearchMap extends React.Component {
	constructor(props){
		super(props);
	}
	searchMapView(){
		Atomic.search();
	}
	render(){
		let searchStyle = {margin:"0px", fontSize:"100%", padding:"10px", borderRadius:"10px"};
		return(
			<div id="searchWrapper">
			<div className="data-button" style={searchStyle} onClick={this.searchMapView}>Search Map View<img id="magnifyImage" src="src/img/magnify.svg"></img></div>
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
			<SearchMap></SearchMap>
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
		let stars,comment,i,newRating;
		e.preventDefault();
		stars = Number($("input[name=stars]:checked").val());
		comment = $("textarea[name=comment]").val();
		i = (this.props.swData.mNum);
		//Adjust rating filter so that new rating doesn't make restaurant disappear - better UX than reseting filter completely.
		newRating = (((Atomic.restaurantDataStore[i].rating*Atomic.restaurantDataStore[i].rReviewList.length)+stars)/(Atomic.restaurantDataStore[i].rReviewList.length+1));
		Atomic.clearAddReviewForm();
		Atomic.restaurantDataStore[i].rReviewList.push({stars:stars, comment:comment});
		if (Atomic.filterHigh < newRating){Atomic.filterHigh = newRating};
		if (Atomic.filterLow > newRating){Atomic.filterLow = newRating};
		Atomic.setInfoData();
		setTimeout(() => 	Atomic.StreetMapData().setState({reviewText:"+ Review"}),1000);
		Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false});
		$("#popupAddReview").hide(1000);
		$("#popupInfo").hide(1000);
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
		setTimeout(() => 	Atomic.StreetMapData().setState({reviewText:"+ Review"}),1000);
		Atomic.restaurantDataStore.push({restaurantName:rName, address:rAddr, lat:this.props.swData.lat, lng:this.props.swData.lng, rReviewList:rReviewList})
		Atomic.setInfoData();
		Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false});
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
			reviewText:"+ Review",
			controlsActive:false,
			markerData:{mNum:-1,url:"",lat:0, lng:0, addRest:false},
		};
		Atomic.StreetMapData = () => this;
	}
	hidePopup(){
		Atomic.StreetMapData().setState({controlsActive: false});
		Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false});
		setTimeout(() => 	Atomic.StreetMapData().setState({reviewText:"+ Review"}),1000);
		$("#popupInfo").hide(1000);
		$("#popupAddReview").hide(1000);
		Atomic.addMarkerListeners();
		if (this.state.markerData.addRest === true){
			Atomic.clearAddRestarauntForm();
			Atomic.setInfoData();
		}
	}
	showAddReview(){
		if (this.state.markerData.addRest === false && this.state.googlePlacesData === false && this.state.controlsActive === true){
			if (this.state.reviewText === "+ Review"){
				Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"Add Review", blockAddRest:true});
				Atomic.StreetMapData().setState({reviewText:"Cancel Review"});
				$("#popupAddReview").show(1000);
			}else{
				Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"Restaurant Details", blockAddRest:true});
				Atomic.StreetMapData().setState({reviewText:"+ Review"})
				$("#popupAddReview").hide(1000);
			}
		}
	}
	render(){
		if (this.state.markerData.mNum !== -1){
			return(
				<div id="popupInfo">
				<div id="popupInfoContent">
				<div className="popup-header">
				<div className="popup-add" onClick={() => this.showAddReview()}>{this.state.reviewText}</div>
				<div className="popup-close" onClick={() => this.hidePopup()}>X</div>
				</div>
				<ReviewForm swData={this.state.markerData}></ReviewForm>
				<NewRestaurantForm swData={this.state.markerData}></NewRestaurantForm>
				<img src={this.state.markerData.url}></img>
				<div>{Atomic.infoData[this.state.markerData.mNum]}</div>
				</div>
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
			showPopUp:false,
			mouseDrop:false
		};
		Atomic.GoogleMap = () => this;
	}
	//markerData:{mNum:-1,url:"",lat:0, lng:0, addRest:false},
	addRestaurantMarker(e){
		if (this.state.mouseDrop === true){
			let pos,newMarker,markerData,markerNum,url;
			pos = {lat:e.latLng.lat(), lng:e.latLng.lng()}
			url = "https://maps.googleapis.com/maps/api/streetview?size=320x300&location=" + pos.lat + "," + pos.lng + "&fov=90&heading=235&pitch=10&" + Atomic.mapsAPIkey;
			markerNum = Atomic.marker.length;
			markerData = {mNum:markerNum, url:url, lat:pos.lat, lng:pos.lng, addRest:true}
			newMarker = new google.maps.Marker({position: pos, icon:'src/img/ricon_sml.png', map: Atomic.map});
			Atomic.marker.push(newMarker);
			Atomic.GoogleMap().setState({mouseDrop:false});
			Atomic.InfoPanel().setState({addRestaurantText:"Enter Details", blockAddRest:true});
			Atomic.StreetMapData().setState({reviewText:"Add Restaurant", markerData:markerData})
			Atomic.map.panTo(pos);
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
		google.maps.event.addListenerOnce(Atomic.map, 'idle', function(){Atomic.mapLoaded = true;Atomic.search();});
		Atomic.loadRestaurantData("src/restaurantData.json");
		this.getLocation();
	};
	render(){
		//return (<div id="mapWrapper"><div id="map"></div><StreetMapData swData={this.state.markerData}></StreetMapData></div>);
		return (<div id="mapWrapper"><div id="map"></div></div>);
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
		if (this.props.restReviewList !== "none"){
			for(let i=0;i<this.props.restReviewList.length;i++){
				reviewData.push(<li key={i+"reviewlist"}>{this.props.restReviewList[i].comment}<br></br><StarRating key={i+"StarRating"} stars={this.props.restReviewList[i].stars}></StarRating></li>);
			}
		}
		let dataStyle = {maxHeight:this.props.height, opacity:this.props.opacity, display:this.props.display};
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
var timeoutCall = 0;
class DataItem extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			height:"0px",
			display:"block",
			opacity:0
		};
	}
	toggleList(){
		if (this.state.height === "0px"){
			if (timeoutCall !== 0){clearTimeout(timeoutCall);timeoutCall = 0;}
			if (this.state.display !== "block"){
				this.setState({display:"block"});
				setTimeout(() => this.setState({height:"500px", opacity:1,}),50);
			}else{
				this.setState({height:"500px", opacity:1,});
			}
		}
		else {
			this.setState({height:"0px", opacity:0});
			timeoutCall = setTimeout(() => this.setState({display:"none"}),800);
		}
	};
	bounceMapMarker(){
		Atomic.marker[this.props.index+1].setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(() => this.stopBounce(), 7000);
		Atomic.map.panTo(Atomic.marker[this.props.index+1].getPosition());
	};
	stopBounce(){
		Atomic.marker[this.props.index+1].setAnimation(null);
	}
	render(){
		let dataItemStyle = {display:this.props.display};
		//if (this.props.restRating !== "no reviews" && this.props.restRating>=Atomic.filterLow && this.props.restRating<=Atomic.filterHigh){dataItemStyle = {display:"block"}};
		//if (this.props.restRating === "no reviews"){display:"block"};
		let dataButtonStyle = {display:"block"};
		let featureStyle = {backgroundImage:"linear-gradient(135deg,rgba(255,101,255,0.3), rgba(8,8,158,0.3))"};
		let featureText = "Google Places...";
		if (this.props.index < Atomic.restaurantDataStore.length){featureStyle = {backgroundImage:"linear-gradient(135deg,rgb(255,101,0), rgb(158,8,8))"};featureText = "feature listing...";}
		//if (this.props.restReviewList === "none"){dataButtonStyle = {display:"none"};}
		return (
			<div className="data-item glow-hover" style={dataItemStyle} onClick={() => this.bounceMapMarker()}>
			<div className="feature-bar" style={featureStyle}><p><em>{featureText}</em></p></div>
			<div className="data-listing">
			<h1>{this.props.restName}</h1>
			<p>{this.props.restAddr}</p>
			<p><br></br><StarRating stars={this.props.restRating}></StarRating></p>
			<button className="data-button" style={dataButtonStyle} onClick={() => this.toggleList()}>Show/Hide Reviews</button>
			<ReviewList restReviewList={this.props.restReviewList} height={this.state.height} opacity={this.state.opacity} display={this.state.display}></ReviewList>
			</div>
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
		this.state = {addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false, filterValue:"0", filterValueStyle:{display:"block"}}
		Atomic.InfoPanel = () => this;
	}
	showAddRestaurant(e){
		if (this.state.addRestFlag === false && this.state.blockAddRest === false){
			Atomic.filterLow = 0;
			Atomic.filterHigh = 5;
			Atomic.setInfoData();
			Atomic.removeMarkerListeners();
			$("#mouseDropIcon").show();
			Atomic.MouseDropIcon().moveIcon(e)
			$(document).on("mousemove",(e) => Atomic.MouseDropIcon().moveIcon(e));
			Atomic.GoogleMap().setState({mouseDrop:true});
			this.setState({addRestFlag:true, addRestaurantText:"Cancel Restaurant"})
		}
		if (this.state.addRestFlag === true && this.state.blockAddRest === false){
			Atomic.addMarkerListeners();
			Atomic.GoogleMap().setState({mouseDrop:false});
			$(document).off("mousemove");
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
				Atomic.filterLow = filterValue;
				Atomic.filterHigh = 5;
				Atomic.setInfoData();
				Atomic.InfoPanel().forceUpdate();
			}else {
				Atomic.filterLow = 0;
				Atomic.filterHigh = filterValue;
				Atomic.setInfoData();
				Atomic.InfoPanel().forceUpdate();
			}
		}
	}
	render(){
		let normalStyle, buttonStyle, filterValueStyle;

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
			<div className="popup-add" onClick={(e) => this.showAddRestaurant(e)}>{this.state.addRestaurantText}</div>
			</div>
			<div id="filterPanel">
			<button  className="data-button" style={buttonStyle} onClick={() => this.filterRatings("low")}>Filter {"<"}</button>
			<input className="filter-range" style={normalStyle} type="range" name="filterRange" min="1" max="50"/>
			<button  className="data-button" style={buttonStyle} onClick={() => this.filterRatings("high")}>Filter {">"}</button>
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
		this.state = {x:"0px", y:"0px", drop:false};
		Atomic.MouseDropIcon = () => this;
	}
	moveIcon(e){
		let left = ((e.pageX-22) + "px");
		let top = ((e.pageY-45) + "px");
		this.setState({x:left, y:top});
	}
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
			<div id="reviewFooter">
			<div className="footer-item">
			<p>Reactive Reviews<br></br>
			An OpenClassrooms Project<br></br>
			By M J Livesey<br></br>
			PolymathicDesign.com<br></br>
			Copyright ©2019
			</p></div>
			<div className="footer-item">
			<p>React Project<br></br>
			Powered by Atomic<br></br>
			By M J Livesey<br></br>
			PolymathicDesign.com<br></br>
			Copyright ©2019
			</p></div>
			<div className="footer-item"><img src="src/img/oc.svg"></img></div>
			</div>
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
	<StreetMapData></StreetMapData>
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
