/**
* colorInspirator 1.0
* This tool creates squares with randomly generated colors.
* 
* Copyright 2018, Murat Motz
* Murat Motz <dev@ztom.de> (https://www.kmgt.de)
* 
* Licensed under MIT
* 
* Released on: November 2, 2018
*/

$(function () {
	"use strict";

	// options
	var frameAmount = {
		current: 200,
		min: 1,
		max: 800
	};

	var frameSyle = {
		size: 70,
		step: 10,
		min: 10,
		css: {}
	};

	var frameColors = [];

	// var to clear setInterval
	var frameInterval;
	// var to clear setTimeout
	var toastTimeout;

	// build an array with randomly created hex colors
	var getHexColors = function () {

		// empty color array
		frameColors = [];

		// fill color array
		for (var x = 0; x < frameAmount.current; x++) {
			frameColors.push('#' + ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6));
		}

	}

	// build colored frames from the color array
	var buildFrames = function () {

		// write amount in footer
		$('header .info').html('current: ' + frameColors.length + ' frames');

		// frames container surely empty and no animation in queue
		$('#frames').html('');
		clearInterval(frameInterval);

		// append frames markup
		for (var x = 0; x < frameColors.length; x++) {
			$('#frames').append('<div class="frame frame' + x + '" style="display:inline-block;opacity:0;width:' + frameSyle.size + 'px;height:' + frameSyle.size + 'px;background-color:' + frameColors[x] + '" data-color="' + frameColors[x] + '"></div>');
		}

		// show frames animated
		var f = -1;
		frameInterval = setInterval(function () {
			f++;
			if (f < frameAmount.current) {
				$('.frame' + f).animate({ opacity: 1 }, 500);
			}
			else {
				clearInterval(frameInterval);
			}
		}, 10);

	}

	// all events (click and keyboard)
	var bindEvents = function () {

		// copie to clipboard
		$(document).on('click', '.frame', function () {
			copyToClipboard($(this).attr('data-color'), { 'toast': { message: 'copied: ' + $(this).attr('data-color'), time: 2000 } });
		});

		// keyevents
		$('html').keydown(function (e) {
			e = e || window.event;

			var keyCode = e.keyCode;

			// 13 enter : reload frames
			if (e.keyCode === 13) {
				getHexColors();
				buildFrames();
			}

			// 16 shift : hide/show header and footer
			if (e.keyCode === 16) {
				$('header, footer').toggleClass('hidden');
				$('#frames').toggleClass('alone');
			}

			// 37 left arrow : reduce framesize
			if (e.keyCode === 37) {
				frameSyle.size -= frameSyle.step;
				if (frameSyle.size < frameSyle.min) frameSyle.size = frameSyle.min;
				frameSyle.css = { width: frameSyle.size + 'px', height: frameSyle.size + 'px' };
				$('.frame').css(frameSyle.css);
			}

			// 39 right arrow : increase framesize
			if (e.keyCode === 39) {
				frameSyle.size += frameSyle.step;
				frameSyle.css = { width: frameSyle.size + 'px', height: frameSyle.size + 'px' };
				$('.frame').css(frameSyle.css);
			}

			// 38 up arrow : double frame amount
			if (keyCode === 38) {
				frameAmount.current = Math.ceil(frameAmount.current * 2);
				if (frameAmount.current >= frameAmount.max) {
					if (frameAmount.current > frameAmount.max) toast({ message: 'max amount of frames is ' + frameAmount.max, time: 2000 });
					frameAmount.current = frameAmount.max;
				}
				getHexColors();
				buildFrames();
			}

			// 40 down arrow : half frame amount
			if (keyCode === 40) {
				frameAmount.current = Math.ceil(frameAmount.current / 2);
				if (frameAmount.current < frameAmount.min) frameAmount.current = frameAmount.min;
				getHexColors();
				buildFrames();
			}

		});
	}

	// copy to clipboard
	var copyToClipboard = function (string, callback) {
		$('body').append('<input id="clipboardtext" style="position:fixed;" value="' + string + '" />');
		document.getElementById('clipboardtext').select();
		document.execCommand('copy');
		$('#clipboardtext').remove();
		if ('toast' in callback) {
			toast(callback.toast);
		}
	}

	// toast message
	var toast = function (options) {
		clearTimeout(toastTimeout);
		$('#toast').remove();
		$('body').append('<div id="toast">' + options.message + '</div>');
		toastTimeout = setTimeout(function () {
			$('#toast').remove();
		}, options.time);
	}

	// init/run when page is loaded
	getHexColors();
	buildFrames();
	bindEvents();

});