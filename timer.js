
function createWatch(toUpdate, SSId){
	this.days = new edgeUnit(0);
	this.hours = new unitTime(24, this.days, 0);
	this.minutes = new unitTime(60, this.hours, 0);
	this.seconds = new unitTime(60, this.minutes, 0);
	this.tracker = new edgeUnit(0);

	this.base = this.seconds;
	this.times = [this.days, this.hours, this.minutes, this.seconds, this.tracker];

	this.limit = 0;
	this.toUpdateDisplay = toUpdate;
	this.SSId = SSId;

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
		this.timer = 0;
	}

	this.updateDisplay = function(){
		this.toUpdateDisplay.value = this.getTime();
	}

	this.setLimit = function(newLimit){
		this.limit = newLimit;
	}

	this.overLimit = function(){
		return this.tracker.timeValue >= this.limit;
	}

	this.update = function(){
		this.tracker.increment(1);
	}

	this.setTimer = function(newTime){
		this.timer = newTime;
	}

	this.getTimer = function(){
		return this.timer
	}

	this.updateDisplay();
}

function startPauseWatch(watch){
	if(watch.timer > 0){
		pauseWatch(watch);
		watch.setTimer(0);
	} else{
		runWatch(watch);
	}
}

function runWatch(watch){
	if(watch.overLimit()) {
		setButton(watch.SSId, true);
		return;
	}
	watch.update();
	watch.updateDisplay();
	watch.setTimer(setTimeout(function(){runWatch(watch);}, 1000));
}

function pauseWatch(watch){
	clearTimeout(watch.getTimer())
}

function resetWatch(watch){
	pauseWatch(watch);
	watch.resetTime();
	watch.updateDisplay();
	setButton(watch.SSId, false);
}

function addTime(clock, seconds){
	for(i = 0; i < seconds; i++){
		clock.base.increment(1);
	}
}

function setWatchLimits(id, watch){
	newLimit = document.getElementById(id).value;
	watch.setLimit(newLimit);
	resetWatch(watch);
	watch.updateDisplay();
	setButton(watch.SSId, false);
}

/////////////////////////////
/////////////////////////////

function createStopWatch(toUpdate, SSId){
	var stopWatch = new createWatch(toUpdate, SSId);
	stopWatch.update = function(){
		stopWatch.tracker.increment(1);
		stopWatch.base.increment(1);	
	}
	return stopWatch;
}

/////////////////////////////
/////////////////////////////

function createCountDown(toUpdate, SSId){
	var countDown = new createWatch(toUpdate, SSId);
	countDown.resetTime = function(){
		for(i = 0; i < countDown.times.length; i++){
			resetUnit(countDown.times[i]);
		}
		countDown.timer = 0;
		addTime(countDown, countDown.limit)
	}

	countDown.update = function(){
		countDown.tracker.increment(1);
		countDown.base.decrement(1);
	}
	return countDown;
}

/////////////////////////////
/////////////////////////////

function unitTime(incrementType, nextUnit, timeValue){
	var unitTime = new edgeUnit(timeValue);

	unitTime.incrementType = incrementType;
	unitTime.nextUnit = nextUnit;
	unitTime.isEdge = false;

	unitTime.increment = function(amount) {
		unitTime.timeValue += amount;
		if(unitTime.timeValue >= unitTime.incrementType){
			unitTime.timeValue = 0;
			unitTime.nextUnit.increment(1);
		}
	}

	unitTime.decrement = function(amount) {
		unitTime.timeValue -= amount;
		if(unitTime.timeValue < 0){
			unitTime.timeValue = this.incrementType - 1;
			unitTime.nextUnit.decrement(1);
		}
	}

	return unitTime
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

/////////////////////////////
/////////////////////////////

function setButton(id, bool){
	document.getElementById(id).disabled = bool; 
}
