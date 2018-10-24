var skeletons = 0;
var resources = {bones:0,wood:0,stones:0}
var workers = {bones:0,wood:0,stones:0};
var army = {skeletalSpearmen:{num:0,name:'Skeletal Spearmen',cost:{wood:2,stone:1}}};
var frames = 0;

function gatherBones() {
    resources.bones++;
    update();
}

function animateSkeleton() {
    if (resources.bones >= 10) {
        resources.bones -= 10;
        skeletons++;
        if (!$('.workerAdd').is(":visible"))
            $('.workerAdd').show();
        update();
    }
}

function assignWorkers(given,num) {
    if (workers[given] == 0) 
        $('#'+given+'Remove').show();
    workers[given] += num;
    if (workers[given] == 0) 
        $('#'+given+'Remove').hide();
    skeletons -= num;
    if (skeletons == 0)
        $('.workerAdd').hide();
    else if (!$('.workerAdd').is(":visible"))
        $('.workerAdd').show();
}

function buildUnit(given) {
    if (canAfford(given)) {
        takeCost(given);
        army[given].num++;
        $('#'+given+'Count').html(army[given].num);
    }
}

function takeCost(given) {
    var curr = army[given].cost;
    for (var i in curr)
        resources[i] -= curr[i];
}

function canAfford(given) {
    var curr = army[given].cost;
    var result = true;
    for (var i in curr)
        if (resources[i] < curr[i])
            result = false;
    return result;
}

function update() {
    $('#idleSkeletons').html(skeletons);
    for (var i in resources) {
        if (frames % 10 == 0)
            resources[i] += workers[i]/50;
        $('#' + i + 'Count').html(round(resources[i]));
        $('#' + i + 'Workers').html(workers[i]);
    }
    frames++;
}

var mainLoop = setInterval(function() {
    update();
}, 20);

buildWorkersTable();
buildArmyTable();

function buildWorkersTable() {
    var result = '';
    var workerNames = {bones:'Grave Robbers',wood:'Lumberjacks',stones:'Stone Pickers'};
    for (var i in workers) {
        result += '<tr>';
        result += '<td><p>' + workerNames[i] + ': <span id="' + i + 'Workers">0</span></p></td>';
        result += '<td><button class="workerAdd" onclick="assignWorkers(\'' + i + '\',1)">+</button></td>';
        result += '<td><button class="workerRemove" id="' + i + 'Remove" onclick="assignWorkers(\'' + i + '\',-1)">-</button></td>';
        result += '</tr>';
    }
    $('#workersTable').html(result);
}

function buildArmyTable() {
    var result = '';
    for (var i in army) {
        result += '<tr>';
        result += '<td><p>' + army[i].name + ': <span id="' + i + 'Count">0</span></p></td>';
        result += '<td><p><button onclick="buildUnit(\'' + i + '\')">+</button></p></td>';
        result += '</tr>';
    }
    $('#armyTable').html(result);
}

function round(given) {
    var result = Math.floor(given * 100)/100;
    return result;
}