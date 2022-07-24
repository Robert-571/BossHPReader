import * as a1lib from "@alt1/base";
import BossHPReader from "./bosshpreader";

//tell webpack to add index.html and appconfig.json to output
require("!file-loader?name=[name].[ext]!./index.html");
require("!file-loader?name=[name].[ext]!./appconfig.json");

var output = document.getElementById("output");

let b = new BossHPReader()

export function capture() {
	var img = a1lib.captureHoldFullRs();
	if (b.pos == null){
		b.find(img)
	}
	let hp = b.read(img)
	//output.insertAdjacentHTML("beforeend", `<div>HP: ${hp}</div>`);
	output.innerHTML = `<div>HP: ${hp}</div>`;
}

const interval = setInterval(function() {
	capture()
  }, 1000);

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	//tell alt1 about the app
	//this makes alt1 show the add app button when running inside the embedded browser
	//also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig.json");
}