const firebaseConfig = {
  apiKey: "AIzaSyAjF48qjj4SjLxu9cRIhYMPTT6LSWzcfj4",
  authDomain: "todo-list-a080a.firebaseapp.com",
  databaseURL: "https://todo-list-a080a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todo-list-a080a",
  storageBucket: "todo-list-a080a.appspot.com",
  messagingSenderId: "1013376602859",
  appId: "1:1013376602859:web:967e95c8d407f6c3e5e4ae"
};

firebase.initializeApp(firebaseConfig);

let todoDatabase = firebase.database();

anime({
	targets: '.navigate-btns',
	scale: [0, 1],
	delay: anime.stagger(100, {start: 50}),
	easing: 'easeInBounce'
});


function createElement(type, options = {}) {
  const element = document.createElement(type);

  Object.entries(options).forEach(([key, value]) => {
    if(key === 'dataset') {
      if(depthOf(options['dataset']) > 1) {
        throw "Depth Should not be greater than 1";
      }

      Object.entries(value).forEach(([datakey, dataValue]) => {
        element.dataset[datakey] = dataValue;
      });
    } else if(key in element){
      element[key] = value;
    } else{
      element.setAttribute(key, value);
    }
  });
  return element;
}

const getRandomNumber = (min, max) => ~~(Math.random() * (max - min + 1) + min);

const getRandomFromArray = (arr) => {
	if(!Array.isArray(arr)) return;

	return arr[getRandomNumber(0, arr.length-1)];
};

const navigationBtns = document.querySelectorAll('.navigate-btns');
const appSections = document.querySelectorAll(".application-sections");

const createNewtaskNavi = document.getElementById("createTaskNaviBtn");
function openSectionById(event, {
		id: sectionName, 
		sectionClass: sectionClassStr, 
		btnClass: btnClassStr
	}) {
	navigationBtns.forEach((btn)=>btn.classList.remove(btnClassStr));
	appSections.forEach((section)=>section.classList.remove(sectionClassStr));

	const sectionId = document.getElementById(sectionName);

	if(event) event.classList.add(btnClassStr);

	anime({
		targets: sectionId,
		opacity: [0.5, 1],
		translateY: [20, 0],
		easing: 'easeInSine',
		duration: 500
	});
	sectionId.classList.add(sectionClassStr);
}

navigationBtns.forEach((navigBtn)=>{
	navigBtn.addEventListener("click", function(){
		const navigAttr = this.getAttribute("data-open-section");
		openSectionById(this, {id: navigAttr, sectionClass: "is-active", btnClass: "navig-active"});
	});
});

const setDefaultActive = function(id) {
	document.getElementById(id).classList.add("is-active");
};

const taskColors = document.querySelectorAll(".tasks-colors");
taskColors.forEach((taskclr)=>{
	const getTaskClr = taskclr.getAttribute("data-color");
	taskclr.style.backgroundColor = `${getTaskClr}78`;
	taskclr.style.boxShadow = `0 0 0 4px ${getTaskClr}45`;

	taskclr.addEventListener("click", function(){
		taskColors.forEach((tskClr)=>tskClr.classList.remove("active-color"));
		taskclr.classList.add("active-color");
	});
});

function debounce(func, delay) {
	let timerId;
	return function() {
		clearTimeout(timerId);
		timerId = setTimeout(function(){
			func.apply(this, arguments);
		}, delay);
	};
}

const searchTaskInput = document.getElementById("taskSearchIp");

searchTaskInput.addEventListener("input",	debounce(function () {
	  const inputVal = searchTaskInput.value.trim().toLowerCase();
	  const allTasks = document.querySelectorAll(".main-tasks-list-holder");

	  allTasks.forEach((task) => {
		  	const allTaskText = task.querySelectorAll(".all-tasks-holder .task-list-holder");

		  	allTaskText.forEach(tskTxt=>{
		  		const tskTextsElem = tskTxt.querySelector('.task-text-holder span');
		  		const tskTextsElemContent = tskTextsElem.innerText;

			  	if(tskTextsElemContent.toLowerCase().includes(inputVal)){
				  	if (inputVal !== '') {
				  		tskTextsElem.innerHTML = tskTextsElemContent.replace(new RegExp(inputVal, 'gi'), (match)=>`<mark style='background-color: ${tskTextsElem.style.color};color: #000;'>${match}</mark>`);
				  		task.classList.add("currently-active");
				  	}
				  	else {
				  		task.classList.remove("currently-active");
				  		tskTextsElem.innerText = tskTextsElemContent;
				  	}
			  	}
		  	});

	      const taskText = task.innerText.toLowerCase();
	      const match = taskText.includes(inputVal);

	      anime({
	      	targets: task,
	      	scale: match?[1.05, 1]:1,
	      	translateY: match?[12, 0]:0,
	      });
	      
	      task.style.display = match ? 'block' : 'none';
	  });
	}, 750)
);

const noTasksDiv = document.querySelector('.no-tasks-holder');
function checkForDivs(){

	const mainTasksDivs = document.querySelectorAll('.main-tasks-list-holder');
	
	if(mainTasksDivs.length) {
		noTasksDiv.style.display = 'none';
	} else {
		anime({
			targets: noTasksDiv,
			translateY: [12, 0],
			scale: [0, 1],
			opacity: [0, 1],
			easing: 'easeInOutExpo'
		});
		noTasksDiv.style.display = 'flex';
	}
}

const createNewTaskInput = document.getElementById("createNewTask");
const createTagsInput = document.getElementById("createTags");
const createDetailsInput = document.getElementById("createDetails");

createNewtaskNavi.addEventListener("click", ()=>createNewTaskInput.focus());
noTasksDiv.addEventListener('click', function(){
	openSectionById(createNewtaskNavi, {id: 'create', sectionClass: "is-active", btnClass: "navig-active"});
	createNewTaskInput.focus();
});

const createTaskBtn = document.getElementById("createNewTaskBtn");

const inputsArr = [createNewTaskInput, createTagsInput, createDetailsInput];

function resetValuesAfterCreating() {
	createNewTaskInput.value = '';
	createTagsInput.value = '';
	createDetailsInput.value = '';

	taskColors.forEach((tskClr)=>tskClr.classList.remove("active-color"));
}

function invalidInputsValidate(){
	const invalidInputs = inputsArr.filter((input)=>input.value.trim() === '');
	console.log("invalidInputs", invalidInputs);
	console.log("invalidInputslen", invalidInputs.length);
	return (invalidInputs.length > 0);
}

function validateTasksAnimation() {
	inputsArr.forEach((input)=>{
		if(input.value.trim() === '') {
			input.parentElement.classList.add("invalid");
			setTimeout(function() {
				input.parentElement.classList.remove("invalid");
			}, 2000);
		} else {
			input.parentElement.classList.remove("invalid");
		}
	});
}

const todoDbAllTasks = todoDatabase.ref('ToDo-Application/Tasks/');

function getAllTasksObject(){
	const allTasks = (createDetailsInput.value).split('\n');
	const allTasksLen = allTasks.length;
	let allTasksObj = {};

	for(let i = 0;i < allTasksLen; ++i) {
		const subTasks = {
			[`task${i+1}`]: {
				taskName: allTasks[i],
				isCompleted: false
			}
		};
		allTasksObj = Object.assign({}, allTasksObj, subTasks);
	}
		
	return allTasksObj;
}

createTaskBtn.addEventListener("click", function(){

	if(invalidInputsValidate()) {
		validateTasksAnimation();
	} else {
		const getAccentColour = document.querySelector('.active-color').getAttribute("data-color") || '#1a8cff';

		const dbUpdateObj = {
			taskTitle: createNewTaskInput.value,
			taskTag: createTagsInput.value,
			taskProgress: '0%',
			taskDashOffset: 535,
			allTasksString: createDetailsInput.value,
			allTasks: getAllTasksObject(),
			accentColour: getAccentColour
		};

		todoDbAllTasks.push(dbUpdateObj);

		resetValuesAfterCreating();
		checkForDivs();

		openSectionById(document.getElementById("viewAllTasksNaviBtn"), {
			id: 'home', sectionClass: "is-active", btnClass: "navig-active"
		});
	}
});


todoDbAllTasks.on("child_removed", function(removeDataSnap) {
	const removeSnapKey = removeDataSnap.key;
	const removeElement = document.getElementById(removeSnapKey);
	anime({
		targets: removeElement,
		scale: {
			value: 0.7,
			easing: 'easeInOutBounce',
			duration: 250
		},
		opacity: {
			value: 0.5,
			duration: 100
		},
		left: {
			value: '-100%',
			easing: 'easeInOutElastic',
			duration: 250,
			delay: 250
		},
		complete: function() {
			if(removeElement) removeElement.remove();
			checkForDivs();
		}
	});

});

todoDbAllTasks.on('child_added', function(dataSnap){
	const dataSnapValue = dataSnap.val();
	const dataTaskTitle = dataSnapValue.taskTitle;
	const dataTaskTag = dataSnapValue.taskTag;
	const dataTasksString = dataSnapValue.allTasksString;
	const dataTaskDashOffset = dataSnapValue.taskDashOffset;
	const dataTaskProgress = dataSnapValue.taskProgress;
	const dataTasks = dataSnapValue.allTasks;
	const dataTaskAccentClr = dataSnapValue.accentColour;

	const dbRef = todoDatabase.ref('ToDo-Application/Tasks/');

	const tasksDetailsArr = dataTasksString.split('\n').filter((tskDetail)=>tskDetail !== '');
	const tasksDetailsArrLen = tasksDetailsArr.length;

	const mainTaskListHolder = createElement('div', {
		className: 'main-tasks-list-holder',
		id: `${dataSnap.key}`
	}),
	taskHolder = createElement('div', {
		className: 'tasks-holder'
	}),
	taskDetailsHolder = createElement('div', {
		className: 'tasks-details-holder'
	}),
	taskSettingsHolder = createElement('div', {
		className: 'tasks-settings-holder'
	}),
	taskEditIcon = createElement('i', {
		className: 'material-icons task-settings-icon edit-task',
		innerText: 'edit'
	}),
	taskDeleteIcon = createElement('i', {
		className: 'material-icons task-settings-icon delete-task',
		innerText: 'delete_forever'
	}),
	taskTitleh3 = createElement('h3', {
		className: 'tasks-title',
		innerText: dataTaskTitle
	}),
	taskTagSpn = createElement('span', {
		className: 'tasks-tag',
		innerText: dataTaskTag
	}),
	taskNumberSpn = createElement('span', {
		className: 'tasks-number',
		innerHTML: `<i class='material-icons'>assignment</i> ${tasksDetailsArrLen} Tasks`
	}),
	tasksProgressHolder = createElement('div', {
		className: 'tasks-progress-holder'
	}),
	tasksProgressSpn = createElement('span', {
		className: 'tasks-progress',
		innerText: dataTaskProgress
	}),
	allTasksHolder = createElement('div', {
		className: 'all-tasks-holder'
	}),
	allTasksSpn = createElement('span', {
		innerText: 'Tasks'
	});

	const toggleAttribute = function() {
		if(taskTitleh3.getAttribute('contenteditable')) {
			taskTitleh3.removeAttribute("contenteditable");
		} else {
			taskTitleh3.setAttribute('contenteditable', 'true');
		}
	};

	taskEditIcon.addEventListener("click", function(evt) {
		evt.stopPropagation();
		toggleAttribute();
			taskTitleh3.focus();
			
			const range = document.createRange();
			range.selectNodeContents(taskTitleh3);
			range.collapse(false);
			
			const selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
	});

	taskTitleh3.addEventListener("click", function(evt){
		evt.stopPropagation();
	});
	taskTitleh3.addEventListener("blur", function(evt) {
		toggleAttribute();
	});
	taskTitleh3.addEventListener("keydown", function(evt){
		if(evt.key === 'Enter') {
			evt.preventDefault();
			const newTaskTitle = taskTitleh3.innerText || dataTaskTitle;

			if(taskTitleh3.innerText === '') taskTitleh3.innerText = dataTaskTitle;

			dbRef.child(`${dataSnap.key}`).update({
				taskTitle: newTaskTitle 
			});
			taskTitleh3.blur();
		}
	});


	taskDeleteIcon.addEventListener("click", function(evnt){
		evnt.stopPropagation();
		anime({
			targets: mainTaskListHolder,
			scale: {
				value: 0.7,
				easing: 'easeInOutBounce',
				duration: 250
			},
			opacity: {
				value: 0.5,
				duration: 100
			},
			left: {
				value: '-100%',
				easing: 'easeInOutElastic',
				duration: 250,
				delay: 250
			},
			complete: function() {
				mainTaskListHolder.remove();
				dbRef.child(`${dataSnap.key}`).remove();
			}
		});
	});

	taskHolder.style.backgroundColor = `${dataTaskAccentClr}23`;
	taskHolder.style.boxShadow = `0 0 0 3px ${dataTaskAccentClr}aa, 0 3px 5px rgba(0, 0, 0, .5)`;
	taskSettingsHolder.appendChild(taskEditIcon);
	taskSettingsHolder.appendChild(taskDeleteIcon);

	taskDetailsHolder.appendChild(taskSettingsHolder);
	taskDetailsHolder.appendChild(taskTitleh3);
	taskDetailsHolder.appendChild(taskTagSpn);
	taskDetailsHolder.appendChild(taskNumberSpn);

	taskHolder.appendChild(taskDetailsHolder);

	tasksProgressSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	tasksProgressPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

	tasksProgressSVG.setAttribute("height", "80");
	tasksProgressSVG.setAttribute("width", "80");
	tasksProgressSVG.setAttribute("viewBox", "0 0 191.9 191.9");

	tasksProgressPath.setAttribute("fill", "none");
	tasksProgressPath.setAttribute("stroke", `${dataTaskAccentClr}`);
	tasksProgressPath.setAttribute("stroke-width", "20");
	tasksProgressPath.setAttribute("stroke-linecap", "round");
	tasksProgressPath.setAttribute("stroke-miterlimit", "10");
	tasksProgressPath.setAttribute("stroke-dasharray", "540");
	tasksProgressPath.setAttribute("stroke-dashoffset", `${dataTaskDashOffset}`);
	tasksProgressPath.setAttribute("d", "M96,10c-47.5,0-86,38.5-86,86s38.5,86,86,86s86-38.5,86-86C181.9,48.5,143.5,10,96,10");

	tasksProgressSVG.appendChild(tasksProgressPath);

	tasksProgressHolder.appendChild(tasksProgressSVG);

	tasksProgressHolder.appendChild(tasksProgressSpn);

	taskHolder.appendChild(tasksProgressHolder);

	allTasksHolder.appendChild(allTasksSpn);

	anime({
		targets: tasksProgressPath,
		strokeDashoffset: [535, dataTaskDashOffset],
		easing: 'easeInOutCirc',
		delay: 500
	});

	allTasksHolder.addEventListener("click", (event)=>event.stopPropagation());

	for(let i = 0; i < tasksDetailsArrLen;++i) {
		const tasksListHolder = createElement('div', {
			className: 'task-list-holder',
		}),
		taskTextHolder = createElement('div', {
			className: 'task-text-holder',
		}),
		taskTextHolderSpan = createElement('span', {
			style: {
				color: `${dataTaskAccentClr}`
			},
			innerText: tasksDetailsArr[i]
		}),
		taskBorder = createElement('div', {
			className: 'border-line',
			style: {
				backgroundColor: `${dataTaskAccentClr}`
			}
		});

    (function (pathElement, progressTask) {
      tasksListHolder.addEventListener("click", function (event) {
        event.stopPropagation();

        tasksListHolder.classList.toggle("completed");

        if(tasksListHolder.classList.contains("completed")) {
        	taskBorder.style.backgroundColor = `${dataTaskAccentClr}`;
		    	taskTextHolderSpan.style.color = `${dataTaskAccentClr}`;

		    	tasksListHolder.style.backgroundColor = `${dataTaskAccentClr}35`;
		    	tasksListHolder.style.boxShadow = `0 2px 3px rgba(0, 0, 0, .4), 0 0 0 2px ${dataTaskAccentClr}80`;
        } else {
					tasksListHolder.style.boxShadow = `none`;
		    	tasksListHolder.style.backgroundColor = `${dataTaskAccentClr}15`;
        }

				const isCompletedCheck = tasksListHolder.classList.contains("completed")?true:false;

        const completedLen = this.parentElement.querySelectorAll('.completed').length;

        const dashOffset = 535 - (535*(completedLen/tasksDetailsArrLen));
        const progressPercent = `${Math.floor((completedLen/tasksDetailsArrLen)*100)}%`;

        pathElement.style.strokeDashoffset = dashOffset;
        
        progressTask.innerText = progressPercent;
        
        dbRef.child(`${dataSnap.key}`).update({
        	taskDashOffset: dashOffset,
        	taskProgress: progressPercent
        });

				dbRef.child(`${dataSnap.key}/allTasks/task${i+1}`).update({
					isCompleted: isCompletedCheck
				});

      });
    })(tasksProgressPath, tasksProgressSpn);

    taskTextHolder.appendChild(taskBorder);
    taskTextHolder.appendChild(taskTextHolderSpan);
		tasksListHolder.appendChild(taskTextHolder);
		allTasksHolder.appendChild(tasksListHolder);
    
    if(dataTasks[`task${i+1}`]['isCompleted']) {
    	tasksListHolder.classList.add("completed");
    	taskBorder.style.backgroundColor = `${dataTaskAccentClr}`;
    	taskTextHolderSpan.style.color = `${dataTaskAccentClr}`;

    	tasksListHolder.style.backgroundColor = `${dataTaskAccentClr}35`;
    	tasksListHolder.style.boxShadow = `0 2px 3px rgba(0, 0, 0, .4), 0 0 0 2px ${dataTaskAccentClr}80`;

    } else {
    	tasksListHolder.classList.remove("completed");
    	taskTextHolderSpan.style.color = `${dataTaskAccentClr}`;

    	tasksListHolder.style.backgroundColor = `${dataTaskAccentClr}15`;
    	tasksListHolder.style.boxShadow = `none`;
    }

    if(allTasksHolder.querySelectorAll('.task-list-holder').length === tasksDetailsArrLen) {
    	tasksProgressSpn.style.color = dataTaskAccentClr;
    }
	}

	mainTaskListHolder.appendChild(taskHolder);
	mainTaskListHolder.appendChild(allTasksHolder);

	mainTaskListHolder.addEventListener("click", function(){
		mainTaskListHolder.classList.toggle("currently-active");
/*		const isClassActive = mainTaskListHolder.classList.contains("currently-active");
		anime({
			targets: mainTaskListHolder.querySelector('.all-tasks-holder'),
			height: isClassActive?'0px':'200px',
			opacity: isClassActive?0:1,
			elasticity: 10,
			easing: 'easeInOutElastic',
			duration: 250
		});*/
	});

	document.querySelector('.main-tasks-holder').appendChild(mainTaskListHolder);
	
	anime({
		targets: document.querySelectorAll('.main-tasks-list-holder'),
		opacity: [0.5, 1],
		translateY: ['12px', '0px'],
		easing: 'easeInOutSine',
		duration: 250,
		delay: anime.stagger(100)
	});
});
todoDbAllTasks.once("value", function(){
	checkForDivs();
});

const todoDbSettings = todoDatabase.ref('ToDo-Application/Settings/');

const imageInput = document.getElementById("userImageInput");
const userImage = document.getElementById("userImage");

const fileStorage = firebase.storage();

imageInput.addEventListener("change", function(fileEvt){
	const newFile = fileEvt.target.files[0];
	const newFileObj = URL.createObjectURL(newFile);

	setImages(newFileObj);

	const imageRef = fileStorage.ref('User Image/');
	const profileImage = imageRef.put(newFile, {contentType: newFile.type});

	profileImage.then(function(getUrlSnap){
		getUrlSnap.ref.getDownloadURL().then(function(url){
			todoDbSettings.update({userProfileImg: `${url}`});
		});
	});
});


function setImages(url) {
	const userImages = document.querySelectorAll('.user-profile-image');
	userImages.forEach(img=>img.src = `${url}`);
}

todoDbSettings.child('userProfileImg').on("value", function(urlSnap){
	setImages(urlSnap.val());
});

const imageSlider = document.querySelector('.images-slide-holder');
const prevBtn = document.querySelector('.prev-btn');
const nxtBtn = document.querySelector('.next-btn');

const backgroundImgs = document.querySelectorAll('.images-slide-holder img');

prevBtn.addEventListener("click", function(){
	imageSlider.scrollLeft -= 150;
});

nxtBtn.addEventListener("click", function(){
	imageSlider.scrollLeft += 150;
});

backgroundImgs.forEach((img)=>{
	img.addEventListener("click", function(){
		document.body.style.backgroundImage = `url('${img.src}')`;
		todoDbSettings.update({bgImg: `${img.src}`});
	});
});

todoDbSettings.child('bgImg').on("value", function(srcSnap){
	const snapVal = srcSnap.val();
	document.body.style.backgroundImage = `url('${snapVal}')`;
});

const userNameHeading = document.getElementById("userName");
const newUserNameInput = document.getElementById("userNameInput");

newUserNameInput.addEventListener("keyup", function(evt){
	if(evt.key === 'Enter' && newUserNameInput.value !== '') {
		todoDbSettings.update({username: `${newUserNameInput.value}`});
	}
});

todoDbSettings.child("username").on('value', function(userNameSnap){
	const userNameSnapVal = userNameSnap.val();
	const emojiArr = ['👋','😊','🌞','✨','😎','🤗','👽','😸','🐰','🐼'];
	userNameHeading.innerText = `Hello, ${userNameSnapVal} ${getRandomFromArray(emojiArr)}`;
});

const darkModeTgl = document.getElementById("darkModeToggle");

darkModeTgl.addEventListener('click', function(){
	if(darkModeTgl.checked) {
		document.body.classList.add("dark-mode");
		todoDbSettings.update({darkmode: true});
	} else {
		document.body.classList.remove("dark-mode");
		todoDbSettings.update({darkmode: false});
	}
});

todoDbSettings.child("darkmode").on("value", function(darkModeVal){
	const darkModeBool = darkModeVal.val();
	
	if(darkModeBool) {
		darkModeTgl.setAttribute('checked', 'true');
		document.body.classList.add("dark-mode");
	}
	else {
		darkModeTgl.removeAttribute('checked');
		document.body.classList.remove("dark-mode");
	}
});

setDefaultActive('home');

document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll(".images-slide-holder img"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});
