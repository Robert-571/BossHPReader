import * as a1lib from "@alt1/base";
import { ImgRef, ImageDetect } from "@alt1/base";
import * as OCR from "@alt1/ocr";

let font = require("./assets/bosshpfont.fontmeta.json");

let textcol:[number,number,number] = [238,218,178]

let imgs = ImageDetect.webpackImages({
	bossbarleft: require("./assets/bossbarleft.data.png"),
    bossbarright: require("./assets/bossbarright.data.png")
});

export default class BossHPReader {

	pos: a1lib.RectLike | null = null;

	find(img?: ImgRef) {
		console.log("find")
		if (!img) { img = a1lib.captureHoldFullRs(); }

		let left_pos = img.findSubimage(imgs.bossbarleft);
		if (left_pos.length == 0) { return null; }
		if (left_pos.length > 1) { console.log("more than one possible left boss hp bar found"); }

		let right_pos = img.findSubimage(imgs.bossbarright);
		if (right_pos.length == 0) { return null; }
		if (right_pos.length > 1) { console.log("more than one possible right boss hp bar found"); }

        let width = right_pos[0].x - (left_pos[0].x + imgs.bossbarleft.width)

		this.pos = { x: left_pos[0].x + imgs.bossbarleft.width, y: left_pos[0].y, width: width, height: imgs.bossbarleft.height };
		return this.pos;
	}
	read(img?: ImgRef) {
		console.log("read")
		if (!this.pos) { return null; }
		let buf: ImageData;
		if (!img) { buf = a1lib.capture(this.pos); }
		else { buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height); }
		let hpstr = OCR.findReadLine(buf, font, [textcol], Math.round(this.pos.width/2), Math.round(this.pos.height/2));
		let hpnum = parseInt(hpstr.text.replace(/,/g, ''), 10)
		if (!hpnum) { return null; }
		return hpnum
	}
}