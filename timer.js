
function createWatch(){
	this.days = new edgeUnit(0);
	this.hours = new unitTime(24, this.days, 0);
	this.minutes = new unitTime(60, this.hours, 0);
	this.seconds = new unitTime(60, this.minutes, 0);
	this.base = new edgeUnit(0);

	this.times = [this.days, this.hours, this.minutes, this.seconds, this.base];

	this.getTime = function(){ 
		return displayUnit(this.days) + ':' +
			displayUnit(this.hours) + ':' +
			displayUnit(this.minutes) + ':' +
			displayUnit(this.seconds);
	}

	this.resetTime = function(){
		for(i = 0; i < this.times.length; i++){
			resetUnit(this.times[i]);
		}
	}
}
function createStopWatch(toUpdate, SSId){
	this.watch = new createWatch();
	this.times = this.watch.times
	this.timer = null;
	this.limit = 0;
	this.toUpdateDisplay = toUpdate;
	this.SSId = SSId;
	this.countsUp = true;

	this.getTime = function(){ 
		return this.watch.getTime();
	}

	this.resetTime = function(){
		this.watch.resetTime();
		this.timer = 0;
	}

	this.updateDisplay = function(){
		this.toUpdateDisplay.value = this.getTime();
	}

	this.setLimit = function(newLimit){
		this.limit = newLimit;
	}

	this.overLimit = function(){
		return this.watch.base.timeValue >= this.limit;
	}

	this.updateDisplay();

}

function startPauseStopWatch(stopwatch){
	if(stopwatch.timer > 0){
		pauseStopWatch(stopwatch);
		stopwatch.timer = 0;
	} else{
		if(stopwatch.countsUp){
			runStopWatch(stopwatch);
		}
		else{
			runTimer(stopwatch);
		}
	}
}

function runStopWatch(stopwatch){
	if(stopwatch.overLimit()) {
		setButton(stopwatch.SSId, true);
		return;
	}
	stopwatch.watch.seconds.increment(1);
	stopwatch.watch.base.increment(1);
	stopwatch.updateDisplay();
	stopwatch.timer = setTimeout(function(){runStopWatch(stopwatch);}, 1000);
}

function pauseStopWatch(stopwatch){
	clearTimeout(stopwatch.timer)
}

function resetStopWatch(stopwatch){
	pauseStopWatch(stopwatch);
	stopwatch.resetTime();
	stopwatch.updateDisplay();

}



/////////////////////////////
/////////////////////////////

function createCountDown(toUpdate, SSId){
	this.watch = new createWatch();
	this.times = this.watch.times
	this.timer = null;
	this.limit = 0;
	this.toUpdateDisplay = toUpdate;
	this.SSId = SSId;
	this.countsUp = false;

	this.getTime = function(){ 
		return this.watch.getTime();
	}

	this.resetTime = function(){
		this.watch.resetTime();
		this.timer = 0;
	}

	this.updateDisplay = function(){
		this.toUpdateDisplay.value = this.getTime();
	}

	this.setLimit = function(newLimit){
		this.limit = newLimit;
	}

	this.overLimit = function(){
		return this.watch.base.timeValue >= this.limit;
	}

	this.updateDisplay();
}

function runTimer(countDown){
	if(countDown.overLimit()) {
		setButton(countDown.SSId, true);
		return;
	}
	countDown.watch.seconds.decrement(1);
	countDown.watch.base.increment(1);
	countDown.updateDisplay();
	countDown.timer = setTimeout(function(){runTimer(countDown);}, 1000);
}

/////////////////////////////
/////////////////////////////

function unitTime(incrementType, nextUnit, timeValue){
	this.incrementType = incrementType;
	this.nextUnit = nextUnit;
	this.timeValue = timeValue;
	this.isEdge = false;

	this.increment = function(amount) {
		this.timeValue += amount;
		if(this.timeValue >= this.incrementType){
			this.timeValue = 0;
			this.nextUnit.increment(1);
		}
	}

	this.decrement = function(amount) {
		this.timeValue -= amount;
		if(this.timeValue < 0){
			this.timeValue = this.incrementType - 1;
			this.nextUnit.decrement(1);
		}
	}
}

function edgeUnit(timeValue){
	this.timeValue = timeValue;
	this.isEdge = true;

	this.increment = function(amount) {
		this.timeValue += amount;
	}
	this.decrement = function(amount) {
		this.increment(-1*amount);
	}
}

function displayUnit(unitTime){
	if(unitTime.isEdge){
		return String(unitTime.timeValue);
	} else{
		incType = unitTime.incrementType;
		numZeros = 0;
		while (incType > 0){
			numZeros++;
			incType = parseInt(incType/10);
		}
		output = String(unitTime.timeValue);
		while (output.length < numZeros){
			output = "0" + output;
		}
		return output;
	}
}

function resetUnit(unitTime){
	//also resets edgeUnits
	unitTime.timeValue = 0;
}

function addTime(clock, seconds){
	for(i = 0; i < seconds; i++){
		clock.seconds.increment(1);
	}
}


function setWatchLimits(id, watch){
	newLimit = document.getElementById(id).value;
	resetStopWatch(watch);
	watch.limit = newLimit;
	if(watch.countsUp === false){
		addTime(watch.watch, newLimit)
		watch.updateDisplay();
	}
	setButton(watch.SSId, false);
}

function setButton(id, bool){
	document.getElementById(id).disabled = bool; 
}
