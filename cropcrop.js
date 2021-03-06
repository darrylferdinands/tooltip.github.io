var helpers = Chart.helpers;
        
         function Line(x1,y1,x2,y2){
            this.x1=x1;
            this.y1=y1;
            this.x2=x2;
            this.y2=y2;
        }
        Line.prototype.drawWithArrowheads=function(ctx,color){

            // arbitrary styling
            ctx.strokeStyle=color;
            ctx.fillStyle=color;
            ctx.lineWidth=1;
            
            // draw the line
            ctx.beginPath();
            ctx.moveTo(this.x1,this.y1);
            ctx.lineTo(this.x2,this.y2);
            ctx.stroke();

            // draw the starting arrowhead
            var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
            startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
            this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
            // draw the ending arrowhead
            var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
            endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
            this.drawArrowhead(ctx,this.x2,this.y2,endRadians);
            

        }
        Line.prototype.drawArrowhead=function(ctx,x,y,radians){
            ctx.save();
            ctx.beginPath();
           ctx.translate(x,y);
            ctx.rotate(radians);
            ctx.moveTo(0,0);
            ctx.lineTo(5,5);
            ctx.lineTo(-5,5);
            ctx.closePath();
            ctx.restore();
            ctx.fill();
        }

        
        
        helpers.getValueAtIndexOrDefault = function(value, index, defaultValue) {
		if (value === undefined || value === null) {
			return defaultValue;
		}
		if (helpers.isArray(value)) {
			return index < value.length ? value[index] : defaultValue;
		}
		return value;
	};
	// Default config for a category scale
	var defaultConfig = {
		position: 'bottom'
	};
        
        function parseFontOptions(options) {
		var getValueOrDefault = helpers.getValueOrDefault;
		var globalDefaults = Chart.defaults.global;
		var size = getValueOrDefault(options.fontSize, globalDefaults.defaultFontSize);
		var style = getValueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle);
		var family = getValueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily);
               
		return {
			size: size,
			style: style,
			family: family,
			font: helpers.fontString(size, style, family)
		};
	}
	let MyScale = Chart.Scale.extend({
		/**
		* Internal function to get the correct labels. If data.xLabels or data.yLabels are defined, use those
		* else fall back to data.labels
		* @private
		*/
		getLabels: function() {
			var data = this.chart.data;
			return (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
		},

		determineDataLimits: function() {
			var me = this;
			var labels = me.getLabels();
			me.minIndex = 0;
			me.maxIndex = labels.length - 1;
			var findIndex;
			if (me.options.ticks.min !== undefined) {
				// user specified min value
				findIndex = helpers.indexOf(labels, me.options.ticks.min);
				me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
			}

			if (me.options.ticks.max !== undefined) {
				// user specified max value
				findIndex = helpers.indexOf(labels, me.options.ticks.max);
				me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
			}

			me.min = labels[me.minIndex];
			me.max = labels[me.maxIndex];
                        
		},

		buildTicks: function() {
			var me = this;
			var labels = me.getLabels();
                        
			// If we are viewing some subset of labels, slice the original array
			me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
                           
		},

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: function(value, index, datasetIndex, includeOffset) {
			var me = this;
			// 1 is added because we need the length but we have the indexes
			var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);

			// If value is a data object, then index is the index in the data array,
			// not the index of the scale. We need to change that.
			var valueCategory;
			if (value !== undefined && value !== null) {
				valueCategory = me.isHorizontal() ? value.x : value.y;
			}
			if (valueCategory !== undefined || (value !== undefined && isNaN(index))) {
				var labels = me.getLabels();
				value = valueCategory || value;
				var idx = labels.indexOf(value);
				index = idx !== -1 ? idx : index;
			}
                        
			if (me.isHorizontal()) {
				var valueWidth = me.width / offsetAmt;
				var widthOffset = (valueWidth * (index - me.minIndex));

				if (me.options.gridLines.offsetGridLines && includeOffset || me.maxIndex === me.minIndex && includeOffset) {
					widthOffset += (valueWidth / 2);
				}
				return me.left + Math.round(widthOffset);
			}
			var valueHeight = me.height / offsetAmt;
			var heightOffset = (valueHeight * (index - me.minIndex));
			if (me.options.gridLines.offsetGridLines && includeOffset) {
				heightOffset += (valueHeight / 2);
			}
                        
			return me.top + Math.round(heightOffset);
		},
		getPixelForTick: function(index, includeOffset) {
			return this.getPixelForValue(this.ticks[index], index + this.minIndex, null, includeOffset);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var value;
			var offsetAmt = Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
			var horz = me.isHorizontal();
			var valueDimension = (horz ? me.width : me.height) / offsetAmt;

			pixel -= horz ? me.left : me.top;

			if (me.options.gridLines.offsetGridLines) {
				pixel -= (valueDimension / 2);
			}

			if (pixel <= 0) {
				value = 0;
			} else {
				value = Math.round(pixel / valueDimension);
			}

			return value;
		},
		getBasePixel: function() {
			return this.bottom;
		},
                calculateTickRotation: function() {
			var me = this;
			var context = me.ctx;
			var tickOpts = me.options.ticks;

			// Get the width of each grid by calculating the difference
			// between x offsets between 0 and 1.
			var tickFont = parseFontOptions(tickOpts);
			context.font = tickFont.font;

			var labelRotation = tickOpts.minRotation || 0;

			if (me.options.display && me.isHorizontal()) {
				var originalLabelWidth = helpers.longestText(context, tickFont.font, me.ticks, me.longestTextCache);
				var labelWidth = originalLabelWidth;
				var cosRotation;
				var sinRotation;

				// Allow 3 pixels x2 padding either side for label readability
				var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;

				// Max label rotation can be set or default to 90 - also act as a loop counter
				while (labelWidth > tickWidth && labelRotation < tickOpts.maxRotation) {
					var angleRadians = helpers.toRadians(labelRotation);
					cosRotation = Math.cos(angleRadians);
					sinRotation = Math.sin(angleRadians);

					if (sinRotation * originalLabelWidth > me.maxHeight) {
						// go back one step
						labelRotation--;
						break;
					}

					labelRotation++;
					labelWidth = cosRotation * originalLabelWidth;
				}
			}
			me.labelRotation = labelRotation;
		},
                
                
                draw: function(chartArea) {
			var me = this;
			var options = me.options;
			if (!options.display) {
				return;
			}

			var context = me.ctx;
			var globalDefaults = Chart.defaults.global;
			var optionTicks = options.ticks;
			var gridLines = options.gridLines;
			var scaleLabel = options.scaleLabel;

			var isRotated = 0;
			var skipRatio;
			var useAutoskipper = optionTicks.autoSkip;
			var isHorizontal = me.isHorizontal();

			// figure out the maximum number of gridlines to show
			var maxTicks;
			if (optionTicks.maxTicksLimit) {
				maxTicks = optionTicks.maxTicksLimit;
			}

			var tickFontColor = helpers.getValueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
			var tickFont = parseFontOptions(optionTicks);

			var tl = gridLines.drawTicks ? gridLines.tickMarkLength : 0;
                        
			var scaleLabelFontColor = helpers.getValueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
			var scaleLabelFont = parseFontOptions(scaleLabel);

			var labelRotationRadians = helpers.toRadians(me.labelRotation);
			var cosRotation = Math.cos(labelRotationRadians);
			var longestRotatedLabel = me.longestLabelWidth * cosRotation;

			// Make sure we draw text in the correct color and font
			context.fillStyle = tickFontColor;

			var itemsToDraw = [];

			if (isHorizontal) {
				skipRatio = false;

				if ((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length > (me.width - (me.paddingLeft + me.paddingRight))) {
					skipRatio = 1 + Math.floor(((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length) / (me.width - (me.paddingLeft + me.paddingRight)));
				}

				// if they defined a max number of optionTicks,
				// increase skipRatio until that number is met
				if (maxTicks && me.ticks.length > maxTicks) {
					while (!skipRatio || me.ticks.length / (skipRatio || 1) > maxTicks) {
						if (!skipRatio) {
							skipRatio = 1;
						}
						skipRatio += 1;
					}
				}

				if (!useAutoskipper) {
					skipRatio = false;
				}
			}

			var xTickStart = options.position === 'right' ? me.left : me.right - tl;
			var xTickEnd = options.position === 'right' ? me.left + tl : me.right;
			var yTickStart = options.position === 'bottom' ? me.top : me.bottom - tl;
			var yTickEnd = options.position === 'bottom' ? me.top + tl : me.bottom;
			helpers.each(me.ticks, function(label, index) {
				// If the callback returned a null or undefined value, do not draw this line
				if (label === undefined || label === null) {
					return;
				}

				var isLastTick = me.ticks.length === index + 1;

				// Since we always show the last tick,we need may need to hide the last shown one before
				var shouldSkip = (skipRatio > 1 && index % skipRatio > 0) || (index % skipRatio === 0 && index + skipRatio >= me.ticks.length);
				if (shouldSkip && !isLastTick || (label === undefined || label === null)) {
					return;
				}

				var lineWidth, lineColor, borderDash, borderDashOffset;
				if (index === (typeof me.zeroLineIndex !== 'undefined' ? me.zeroLineIndex : 0)) {
					// Draw the first index specially
					lineWidth = gridLines.zeroLineWidth;
					lineColor = gridLines.zeroLineColor;
					borderDash = gridLines.zeroLineBorderDash;
					borderDashOffset = gridLines.zeroLineBorderDashOffset;
				} else {
					lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, index);
					lineColor = helpers.getValueAtIndexOrDefault(gridLines.color, index);
					borderDash = helpers.getValueOrDefault(gridLines.borderDash, globalDefaults.borderDash);
					borderDashOffset = helpers.getValueOrDefault(gridLines.borderDashOffset, globalDefaults.borderDashOffset);
				}

				// Common properties
				var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
				var textAlign = 'middle';
				var textBaseline = 'middle';
				if (isHorizontal) {
					if (options.position === 'bottom') {
						// bottom
						textBaseline = !isRotated? 'top':'middle';
						textAlign = !isRotated? 'center': 'right';
						labelY = me.top + tl;
					} else {
						// top
						textBaseline = !isRotated? 'bottom':'middle';
						textAlign = !isRotated? 'center': 'left';
						labelY = me.bottom - tl;
					}

					var xLineValue = me.getPixelForTick(index) + helpers.aliasPixel(lineWidth); // xvalues for grid lines
					labelX = me.getPixelForTick(index, gridLines.offsetGridLines) + optionTicks.labelOffset; // x values for optionTicks (need to consider offsetLabel option)
                                        
					tx1 = tx2 = x1 = x2 = xLineValue;
					ty1 = yTickStart;
					ty2 = yTickEnd;
					y1 = chartArea.top;
					y2 = chartArea.bottom;
                                        
				} else {
					var isLeft = options.position === 'left';
					var tickPadding = optionTicks.padding;
					var labelXOffset;

					if (optionTicks.mirror) {
						textAlign = isLeft ? 'left' : 'right';
						labelXOffset = tickPadding;
					} else {
						textAlign = isLeft ? 'right' : 'left';
						labelXOffset = tl + tickPadding;
					}

					labelX = isLeft ? me.right - labelXOffset : me.left + labelXOffset;

					var yLineValue = me.getPixelForTick(index); // xvalues for grid lines
					yLineValue += helpers.aliasPixel(lineWidth);
					labelY = me.getPixelForTick(index, gridLines.offsetGridLines);
                                        
					tx1 = xTickStart;
					tx2 = xTickEnd;
					x1 = chartArea.left;
					x2 = chartArea.right;
					ty1 = ty2 = y1 = y2 = yLineValue;
				}

				itemsToDraw.push({
					tx1: tx1,
					ty1: ty1,
					tx2: tx2,
					ty2: ty2,
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
					labelX: labelX,
					labelY: labelY,
					glWidth: lineWidth,
					glColor: lineColor,
					glBorderDash: borderDash,
					glBorderDashOffset: borderDashOffset,
					rotation: -1 * labelRotationRadians,
					label: label,
					textBaseline: textBaseline,
					textAlign: textAlign
				});
			});
                        if (gridLines.display) {
                                context.save();
                                context.lineWidth = itemsToDraw[0].glWidth;

                                if (context.setLineDash) {
                                        context.setLineDash(itemsToDraw[0].glBorderDash);
                                        context.lineDashOffset = itemsToDraw[0].glBorderDashOffset;
                                }

                                context.beginPath();

                                if (gridLines.drawTicks) {
                                        context.moveTo(itemsToDraw[0].tx1, itemsToDraw[0].ty1);
                                        context.lineTo(itemsToDraw[0].tx2, itemsToDraw[0].ty2);
                                }

                                if (gridLines.drawOnChartArea) {
                                        context.strokeStyle = gridLines.color;
                                        if(itemsToDraw[0] == null || itemsToDraw[1] == null){
                                            return;
                                        }
                                        var centerX = (itemsToDraw[0].labelX + itemsToDraw[1].labelX)/2;
                                        var centerY = (itemsToDraw[0].labelY + itemsToDraw[1].labelY)/2;
                                        
                                        context.rotate(0);
                                        context.textAlign = 'center';
                                        context.textBaseline = 'middle';
                                        context.fillStyle = scaleLabelFontColor; 
                                        context.font = scaleLabelFont.font;

                                        context.moveTo(itemsToDraw[0].labelX, itemsToDraw[0].labelY);
                                        context.fillText(itemsToDraw[0].label,centerX,centerY+8);
                                        context.lineTo(itemsToDraw[1].labelX, itemsToDraw[1].labelY);
                                        // create a new line object
                                        var line=new Line(itemsToDraw[0].labelX, itemsToDraw[0].labelY,itemsToDraw[1].labelX, itemsToDraw[1].labelY);
                                        // draw the line
                                        line.drawWithArrowheads(context,gridLines.color);
                                        
                                }

                                context.stroke();
                                context.restore();
                        }
		}
	});
        Chart.scaleService.registerScaleType('myScale', MyScale, defaultConfig);
        
        
        let arrowGridline = Chart.Scale.extend({
                getLabels: function() {
			var data = this.chart.data;
			return (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
		},

		determineDataLimits: function() {
			var me = this;
			var labels = me.getLabels();
			me.minIndex = 0;
			me.maxIndex = labels.length - 1;
			var findIndex;

			if (me.options.ticks.min !== undefined) {
				// user specified min value
				findIndex = helpers.indexOf(labels, me.options.ticks.min);
				me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
			}

			if (me.options.ticks.max !== undefined) {
				// user specified max value
				findIndex = helpers.indexOf(labels, me.options.ticks.max);
				me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
			}

			me.min = labels[me.minIndex];
			me.max = labels[me.maxIndex];
		},

		buildTicks: function() {
			var me = this;
			var labels = me.getLabels();
			// If we are viewing some subset of labels, slice the original array
			me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
		},

		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var data = me.chart.data;
			var isHorizontal = me.isHorizontal();

			if (data.yLabels && !isHorizontal) {
				return me.getRightValue(data.datasets[datasetIndex].data[index]);
			}
			return me.ticks[index - me.minIndex];
		},

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: function(value, index, datasetIndex, includeOffset) {
			var me = this;
			// 1 is added because we need the length but we have the indexes
			var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);

			// If value is a data object, then index is the index in the data array,
			// not the index of the scale. We need to change that.
			var valueCategory;
			if (value !== undefined && value !== null) {
				valueCategory = me.isHorizontal() ? value.x : value.y;
			}
			if (valueCategory !== undefined || (value !== undefined && isNaN(index))) {
				var labels = me.getLabels();
				value = valueCategory || value;
				var idx = labels.indexOf(value);
				index = idx !== -1 ? idx : index;
			}

			if (me.isHorizontal()) {
				var valueWidth = me.width / offsetAmt;
				var widthOffset = (valueWidth * (index - me.minIndex));

				if (me.options.gridLines.offsetGridLines && includeOffset || me.maxIndex === me.minIndex && includeOffset) {
					widthOffset += (valueWidth / 2);
				}

				return me.left + Math.round(widthOffset);
			}
			var valueHeight = me.height / offsetAmt;
			var heightOffset = (valueHeight * (index - me.minIndex));

			if (me.options.gridLines.offsetGridLines && includeOffset) {
				heightOffset += (valueHeight / 2);
			}

			return me.top + Math.round(heightOffset);
		},
		getPixelForTick: function(index, includeOffset) {
			return this.getPixelForValue(this.ticks[index], index + this.minIndex, null, includeOffset);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var value;
			var offsetAmt = Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
			var horz = me.isHorizontal();
			var valueDimension = (horz ? me.width : me.height) / offsetAmt;

			pixel -= horz ? me.left : me.top;

			if (me.options.gridLines.offsetGridLines) {
				pixel -= (valueDimension / 2);
			}

			if (pixel <= 0) {
				value = 0;
			} else {
				value = Math.round(pixel / valueDimension);
			}

			return value;
		},
		getBasePixel: function() {
			return this.bottom;
		},
                draw: function(chartArea) {
			var me = this;
			var options = me.options;
			if (!options.display) {
				return;
			}

			var context = me.ctx;
			var globalDefaults = Chart.defaults.global;
			var optionTicks = options.ticks;
			var gridLines = options.gridLines;
			var scaleLabel = options.scaleLabel;


			var isRotated = me.labelRotation !== 0;
			var skipRatio;
			var useAutoskipper = optionTicks.autoSkip;
			var isHorizontal = me.isHorizontal();

			// figure out the maximum number of gridlines to show
			var maxTicks;
			if (optionTicks.maxTicksLimit) {
				maxTicks = optionTicks.maxTicksLimit;
			}

			var tickFontColor = helpers.getValueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
			var tickFont = parseFontOptions(optionTicks);

			var tl = gridLines.drawTicks ? gridLines.tickMarkLength : 0;

			var scaleLabelFontColor = helpers.getValueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
			var scaleLabelFont = parseFontOptions(scaleLabel);

			var labelRotationRadians = helpers.toRadians(me.labelRotation);
			var cosRotation = Math.cos(labelRotationRadians);
			var longestRotatedLabel = me.longestLabelWidth * cosRotation;

			// Make sure we draw text in the correct color and font
			context.fillStyle = tickFontColor;

			var itemsToDraw = [];

			if (isHorizontal) {
				skipRatio = false;

				if ((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length > (me.width - (me.paddingLeft + me.paddingRight))) {
					skipRatio = 1 + Math.floor(((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length) / (me.width - (me.paddingLeft + me.paddingRight)));
				}

				// if they defined a max number of optionTicks,
				// increase skipRatio until that number is met
				if (maxTicks && me.ticks.length > maxTicks) {
					while (!skipRatio || me.ticks.length / (skipRatio || 1) > maxTicks) {
						if (!skipRatio) {
							skipRatio = 1;
						}
						skipRatio += 1;
					}
				}

				if (!useAutoskipper) {
					skipRatio = false;
				}
			}


			var xTickStart = options.position === 'right' ? me.left : me.right - tl;
			var xTickEnd = options.position === 'right' ? me.left + tl : me.right;
			var yTickStart = options.position === 'bottom' ? me.top : me.bottom - tl;
			var yTickEnd = options.position === 'bottom' ? me.top + tl : me.bottom;

			helpers.each(me.ticks, function(label, index) {
				// If the callback returned a null or undefined value, do not draw this line
				if (label === undefined || label === null) {
					return;
				}

				var isLastTick = me.ticks.length === index + 1;

				// Since we always show the last tick,we need may need to hide the last shown one before
				var shouldSkip = (skipRatio > 1 && index % skipRatio > 0) || (index % skipRatio === 0 && index + skipRatio >= me.ticks.length);
				if (shouldSkip && !isLastTick || (label === undefined || label === null)) {
					return;
				}

				var lineWidth, lineColor, borderDash, borderDashOffset;
				if (index === (typeof me.zeroLineIndex !== 'undefined' ? me.zeroLineIndex : 0)) {
					// Draw the first index specially
					lineWidth = gridLines.zeroLineWidth;
                                        marker = false;
					lineColor = gridLines.zeroLineColor;
					borderDash = gridLines.zeroLineBorderDash;
					borderDashOffset = gridLines.zeroLineBorderDashOffset;
				} else {
					lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, index);
					lineColor = helpers.getValueAtIndexOrDefault(gridLines.color, index);
                                        marker = helpers.getValueAtIndexOrDefault(gridLines.marker, index);
					borderDash = helpers.getValueOrDefault(gridLines.borderDash, globalDefaults.borderDash);
					borderDashOffset = helpers.getValueOrDefault(gridLines.borderDashOffset, globalDefaults.borderDashOffset);
				}

				// Common properties
				var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
				var textAlign = 'middle';
				var textBaseline = 'middle';

				if (isHorizontal) {

					if (options.position === 'bottom') {
						// bottom
						textBaseline = !isRotated? 'top':'middle';
						textAlign = !isRotated? 'center': 'right';
						labelY = me.top + tl;
					} else {
						// top
						textBaseline = !isRotated? 'bottom':'middle';
						textAlign = !isRotated? 'center': 'left';
						labelY = me.bottom - tl;
					}

					var xLineValue = me.getPixelForTick(index) + helpers.aliasPixel(lineWidth); // xvalues for grid lines
					labelX = me.getPixelForTick(index, gridLines.offsetGridLines) + optionTicks.labelOffset; // x values for optionTicks (need to consider offsetLabel option)

					tx1 = tx2 = x1 = x2 = xLineValue;
					ty1 = yTickStart;
					ty2 = yTickEnd;
					y1 = chartArea.top;
					y2 = chartArea.bottom;
				} else {
					var isLeft = options.position === 'left';
					var tickPadding = optionTicks.padding;
					var labelXOffset;

					if (optionTicks.mirror) {
						textAlign = isLeft ? 'left' : 'right';
						labelXOffset = tickPadding;
					} else {
						textAlign = isLeft ? 'right' : 'left';
						labelXOffset = tl + tickPadding;
					}

					labelX = isLeft ? me.right - labelXOffset : me.left + labelXOffset;

					var yLineValue = me.getPixelForTick(index); // xvalues for grid lines
					yLineValue += helpers.aliasPixel(lineWidth);
					labelY = me.getPixelForTick(index, gridLines.offsetGridLines);

					tx1 = xTickStart;
					tx2 = xTickEnd;
					x1 = chartArea.left;
					x2 = chartArea.right;
					ty1 = ty2 = y1 = y2 = yLineValue;
				}

				itemsToDraw.push({
					tx1: tx1,
					ty1: ty1,
					tx2: tx2,
					ty2: ty2,
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
					labelX: labelX,
					labelY: labelY,
					glWidth: lineWidth,
					glColor: lineColor,
					glBorderDash: borderDash,
					glBorderDashOffset: borderDashOffset,
					rotation: -1 * labelRotationRadians,
					label: label,
					textBaseline: textBaseline,
					textAlign: textAlign,
                                        marker:marker
				});
			});

			// Draw all of the tick labels, tick marks, and grid lines at the correct places
			helpers.each(itemsToDraw, function(itemToDraw) {
				if (gridLines.display) {
					context.save();
					context.lineWidth = itemToDraw.glWidth;
					context.strokeStyle = itemToDraw.glColor;
					if (context.setLineDash) {
						context.setLineDash(itemToDraw.glBorderDash);
						context.lineDashOffset = itemToDraw.glBorderDashOffset;
					}

					context.beginPath();

					if (gridLines.drawTicks) {
						context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
						context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
					}

					if (gridLines.drawOnChartArea) {
						context.moveTo(itemToDraw.x1, itemToDraw.y1);
						context.lineTo(itemToDraw.x2, itemToDraw.y2);
                                                
                                            if(itemToDraw.marker){
                                                context.stroke();
                                                context.restore();
                                                
                                                context.save();
                                                context.lineWidth = itemToDraw.glWidth;
                                                context.strokeStyle = itemToDraw.glColor;
                                                context.fillStyle=itemToDraw.glColor;
                                                context.beginPath();
                                                context.moveTo(itemToDraw.x2, itemToDraw.y2);
                                                context.lineTo(itemToDraw.x2-10, itemToDraw.y2+10);
                                                context.lineTo(itemToDraw.x2+10, itemToDraw.y2+10);
                                                context.fill();
                                            }
					}

					context.stroke();
					context.restore();
				}

				if (optionTicks.display) {
					context.save();
                                        context.fillStyle=null;
					context.translate(itemToDraw.labelX, itemToDraw.labelY);
					context.rotate(itemToDraw.rotation);
					context.font = tickFont.font;
					context.textBaseline = itemToDraw.textBaseline;
					context.textAlign = itemToDraw.textAlign;

					var label = itemToDraw.label;
					if (helpers.isArray(label)) {
						for (var i = 0, y = 0; i < label.length; ++i) {
							// We just make sure the multiline element is a string here..
							context.fillText('' + label[i], 0, y);
							// apply same lineSpacing as calculated @ L#320
							y += (tickFont.size * 1.5);
						}
					} else {
						context.fillText(label, 0, 0);
					}
					context.restore();
				}
			});

			if (scaleLabel.display) {
				// Draw the scale label
				var scaleLabelX;
				var scaleLabelY;
				var rotation = 0;

				if (isHorizontal) {
					scaleLabelX = me.left + ((me.right - me.left) / 2); // midpoint of the width
					scaleLabelY = options.position === 'bottom' ? me.bottom - (scaleLabelFont.size / 2) : me.top + (scaleLabelFont.size / 2);
				} else {
					var isLeft = options.position === 'left';
					scaleLabelX = isLeft ? me.left + (scaleLabelFont.size / 2) : me.right - (scaleLabelFont.size / 2);
					scaleLabelY = me.top + ((me.bottom - me.top) / 2);
					rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
				}

				context.save();
				context.translate(scaleLabelX, scaleLabelY);
				context.rotate(rotation);
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillStyle = scaleLabelFontColor; // render in correct colour
				context.font = scaleLabelFont.font;
				context.fillText(scaleLabel.labelString, 0, 0);
				context.restore();
			}

			if (gridLines.drawBorder) {
				// Draw the line at the edge of the axis
				context.lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, 0);
				context.strokeStyle = helpers.getValueAtIndexOrDefault(gridLines.color, 0);
				var x1 = me.left,
					x2 = me.right,
					y1 = me.top,
					y2 = me.bottom;

				var aliasPixel = helpers.aliasPixel(context.lineWidth);
				if (isHorizontal) {
					y1 = y2 = options.position === 'top' ? me.bottom : me.top;
					y1 += aliasPixel;
					y2 += aliasPixel;
				} else {
					x1 = x2 = options.position === 'left' ? me.right : me.left;
					x1 += aliasPixel;
					x2 += aliasPixel;
				}

				context.beginPath();
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);
				context.stroke();
			}
		}
        });
        
        Chart.scaleService.registerScaleType('arrowGridline', arrowGridline, defaultConfig);
        
        var life_cycle_data = [{"title":"Sowing","duration":{"start":22,"end":27},"clrs":"rgba(22, 116, 255, 0.87)"},{"title":"Transplanting","duration":{"start":25,"end":30},"clrs":"rgba(0, 216, 1, 0.87)"},{"title":"Tillering","duration":{"start":28,"end":35},"clrs":" #ff4858"},{"title":"Flowering","duration":{"start":35,"end":42}, "clrs":"#ffba01"},{"title":"Ball Formation","duration":{"start":40,"end":48}, "clrs": " #845cee"},{"title":"Harvesting","duration":{"start":47,"end":5}, "clrs":"rgba(208, 2, 27, 0.87)"}];
      var water_req_data = [{"duration":{"start":22,"end":24},"water":93.4},{"duration":{"start":24,"end":30},"water":171},{"duration":{"start":30,"end":34},"water":171},{"duration":{"start":34,"end":42},"water":294},{"duration":{"start":42,"end":48},"water":276.5}];
        var life_cycle_chart = [
                        {
                            id: 'weeks',
                            type: "arrowGridline",
                            display: true,
                            stacked: false,
                            gridLines: {
                                display: true,
                                color:["rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)","rgba(0,0,0,0.1)"],
                                marker:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                                lineWidth: 1,
                            },
                            labels: {
                                show: true,
                            },
                            scaleLabel: {
                                display: true,
                                //labelString: '<--Weeks-->'
                            },
                            ticks: {
                                callback: function (value, index, values) {
                                    var data = value.split('-');
                                    return data[0];
                                }
                            },
                            categoryPercentage: 0.3,
                            barPercentage: 0.9,
                        },
                        
                        
        ];
		
        $.each(life_cycle_data,function(k,v){
            var v = v;
            str = v.title.replace(' ','_').toLowerCase();
			cltr=v.clrs;
			txt= v.txclr;
			//alert(txt)
            life_cycle_chart.push({
                            id: 'xAxis_'+str+"_"+k,
                            type: "myScale",
                            title:v.title,
                            gridLines: {
                                display: true,
                                color: cltr,
								//fontColor: "rgba(0,0,0,0.1)",
                                lineWidth: 1,
                                drawBorder: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                              tickMarkLength: 0,
                                zeroLineWidth: 1,
                                zeroLineColor: 'rgba(0,255,0,1)',
                                zeroLineBorderDash: [],
                                zeroLineBorderDashOffset: 0.0,
                                offsetGridLines: false,
                                borderDash: [],
                                borderDashOffset: 0.0
                            },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0,
                                callback: function (value, index, values) {
                                    var data = value.split('-');
                                    
                                    if(data[0] == v.duration.start){
                                        return v.title;
                                                
                                    }
                                    
                                    if(data[0] == v.duration.end){
                                        return '-';
                                    }
                                }
                            }
                        });
        });
        
        life_cycle_chart.push({
                            id: 'xAxis2_water_req',
                            type: "category",
                            gridLines: {
                                drawOnChartArea: false,
                            },
                            ticks: {
                                callback: function (value, index, values) {
                                    var data = value.split('-');
                                    return data[1];
                                }
                            },
                            scaleLabel: {
                                display: true,
                                fontColor:'#0000FF',
                                //labelString: 'Water Requirement'
                              }
                        });
		var customTooltips = function(tooltip) {
			// Tooltip Element
			var tooltipEl = document.getElementById('chartjs-tooltip');

			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.innerHTML = "<table></table>"
				this._chart.canvas.parentNode.appendChild(tooltipEl);
			}

			// Hide if no tooltip
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}

			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem) {
				return bodyItem.lines;
			}

			// Set Text
			if (tooltip.body) {
				var titleLines = tooltip.title || [];
				var bodyLines = tooltip.body.map(getBody);

				var innerHtml = '<thead>';

				titleLines.forEach(function(title) {
					innerHtml += '<tr><th>' + title + '</th></tr>';
				});
				innerHtml += '</thead><tbody>';

				bodyLines.forEach(function(body, i) {
					var colors = tooltip.labelColors[i];
					var style = 'background:' + colors.backgroundColor;
					style += '; border-color:' + colors.borderColor;
					style += '; border-width: 2px'; 
					var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
					innerHtml += '<tr><td>' + span + body + '</td></tr>';
				});
				innerHtml += '</tbody>';

				var tableRoot = tooltipEl.querySelector('table');
				tableRoot.innerHTML = innerHtml;
			}

			var positionY = this._chart.canvas.offsetTop;
			var positionX = this._chart.canvas.offsetLeft;

			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.left = positionX + tooltip.caretX + 'px';
			tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			tooltipEl.style.fontFamily = tooltip._fontFamily;
			tooltipEl.style.fontSize = tooltip.fontSize;
			tooltipEl.style.fontStyle = tooltip._fontStyle;
			tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
		};

var ctx = document.getElementById('finalchart').getContext('2d');
 ctx.height = 500;
var myChart = new Chart(ctx, {
  animating:true,
            type: 'line',
          
  data: {
      labels: ["22-May-2018","23-Jun-2018","24-Jun-2018","25-Jun-2018","26-Jun-2018","27-Jul-2018","28-Jul-2018","29-Jul-2018","30-Jul-2018","31-Jul-2018","32-Aug-2018","33-Aug-2018","34-Aug-2018","35-Aug-2018","36-Sep-2018","37-Sep-2018","38-Sep-2018","39-Sep-2018","40-Oct-2018","41-Oct-2018","42-Oct-2018","43-Oct-2018","44-Oct-2018","45-Nov-2018","46-Nov-2018","47-Nov-2018","48-Nov-2018","49-Dec-2018","50-Dec-2018","51-Dec-2018","52-Dec-2018","01-Dec-2018","02-Jan-2019","03-Jan-2019","04-Jan-2019","05-Jan-2019"],
            
    datasets: [
			{
			  label: 'Average Temp 2017',
			  fill: false,
			  data: [13.7, 14.8, 15.8, 16.8, 17.7, 18.5, 19.3, 19, 19, 19.5, 20.2, 21.8, 23.5, 26, 28.5, 31, 32.7, 33.7, 33, 29.6, 21, 17.5, 17, 17.5, 18.5, 20.2, 21.8, 23.5, 26, 28.5, 31, 32.7, 33.7, 33, 29.6, 20],
			  backgroundColor: "#4a4a4a",
			  borderColor: "#4a4a4a",
			  pointRadius: 0,
			  borderDash: [8, 8],
				pointHoverRadius: 0,
				yAxisID: 'A',
			}, 
			{
			   label: 'Normal Average Temp',
			  data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			  backgroundColor: "#a2a2a2",
			  borderColor: " #a2a2a2",
			 
				yAxisID: 'B',
			   pointHoverRadius: 0,
			   pointRadius: 0,
			   borderColor: false,
			},
			{
			  label: 'Rainfall 2018',
			  data: [17.2, 18.4, 19.5, 20.5, 21.3, 22, 22.5, 22.7, 23, 23.5, 24.5, 26.5, 29, 31.5, 34, 36.5, 38.3, 39.3, 38.4, 35, 28, 22.5, 21.3, 21.8, 23, 24.5, 26.5, 29, 31.5, 34, 36.5, 38.3, 39.3, 38.4, 35, 28],
			  backgroundColor: "#1674ff",
			  borderColor: "#1674ff",
			  fill: false,
			  pointRadius: 0,
			  pointHoverRadius: 0,
			},
			{
			  label: 'Normal Rainfall',
			  data: [86, 188, 239, 254, 238, 205, 155, 115, 85, 68, 58, 52, 53, 75, 130, 180, 188, 155, 115, 85, 68, 60, 56, 60, 69, 80, 90, 95, 98,100, 100, 97, 92, 80, 60, 30,],
	 			backgroundColor: "rgba(255, 72, 88, 0.37)",
				borderColor: "#ff4858",
				yAxisID: 'C',			   
				pointBorderWidth: 2,
				pointHoverRadius: 5,
				pointRadius: 5,
				pointBackgroundColor: "#fff",
  				pointHoverBackgroundColor: "#ff4858",
  				pointHoverBorderColor: "#ff4858",
			},
			{
			  label: 'Rainfall 2017',
			  data: [23.3, 33, 37.4, 38.8, 38.2, 36, 32.5, 27.6, 23, 19, 16, 15, 17, 22, 27, 32, 34, 32, 28, 24, 20, 17, 16, 16.5, 18.4, 22, 26.1, 28, 28.5, 28, 26.5,  24.6, 22.5, 20, 17, 14],
			   backgroundColor: "#ffba01",
			  borderColor: "#ffba01",
			  fill: false,
			  pointRadius: 0,
			   pointHoverRadius: 0,
			},
			
			]
  },
  
  options:  {
       barValueSpacing: 100,
	  responsive: true,
	  maintainAspectRatio: false,
	   tooltips: {
		   titleFontColor: '#fff',
			enabled: true,
			mode: 'index',
			position: 'nearest',
			//custom: customTooltips,
			backgroundColor: 'rgba(91, 91, 92, 0.87)',
			xPadding: 20,
			yPadding: 20,
			bodyFontSize: 10,
			bodySpacing: 10,
			bodyFontColor: '#fff',
			bodyFontStyle: 'bold',
				},
	  legend: {
         	position: 'bottom',
          
			display: true,
			labels: {
                fontColor:  '#a2a2a2',
                usePointStyle:true,
				fontSize: 8,
				fontweight: 600,
				lineHeight: 1,
					}
               },
                title : {
            display : true,
            position : "top",
            text : "Crop Weather Calendar",
            fontSize : 18,
            fontColor : '#00004d',
            fontFamily : 'Alegreya'
        },
    scales: {
                    xAxes:
                        life_cycle_chart,
						fontColor: "red",
                    
                    yAxes: [{
			  gridLines: {
				  drawBorder: false,
				  display: false,
				  } ,
			    id: 'A',
        		type: 'linear',
       			position: 'left',
				ticks: {
					min: 0,
                    max: 60,
               		stepSize: 10,
					//position: right,
                		},
				display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'RAINFALL (mm)',
					fontColor: '#a2a2a2',
					fontSize: 12,
					fontweight: 600,
					lineHeight: 1,
                            },	
           			},
					{
						 gridLines: {
				  			//drawBorder: false,
				 			 display: false,
				  } ,
				id: 'B',
        		type: 'linear',
       			position: 'right',
					ticks: {
					min: 0,
                    max: 50,
               		stepSize: 5,
                			},
				display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'AVERAGE TEMPRATURE (Deg.c)',
					fontColor: '#a2a2a2',
					fontSize: 12,
					fontweight: 600,
					lineHeight: 1,
                            },				
				},
				{
				 gridLines: {
				  	drawBorder: false,
				  	display: false,
				  			} ,						
				id: 'C',
        		type: 'linear',
       			position: 'right',
				afterFit: function(scale) {
               		scale.width = 80  //<-- set value as you wish 
            							},
					ticks: {
					min: 0,
                    max: 500,
               		stepSize: 50,
					padding: 30,
                			},
				display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'WATER REQUIREMENT (mm)',
					fontColor: '#a2a2a2',
					fontSize: 12,
					fontweight: 600,
					lineHeight: 1,
					
                            },				
				}
				],
                }
	  }
}); 