var skeletons = 0;
var resources = {bones:0,wood:0,stones:0,corpses:0};
var resources = {bones:100,wood:100,stones:100,corpses:0};
var workers = {bones:0,wood:0,stones:0};
var army = {skeletalSpearmen:{num:0,name:'Skeletal Spearmen',strength:2,cost:{bones:10,wood:2,stone:1}}};
var target = {travelers:{name:'Ambush Travelers',strength:5,loot:{corpses:3}}};
var buildings = {butcher:{name:'Butcher',count:0,cost:{stones:25,wood:25}}};
var frames = 0;
var butcherProgressInterval;

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
    $('#' + given + 'Workers').html(workers[given]);
}

function buildUnit(given) {
    if (canAfford(given,army)) {
        takeCost(given,army);
        army[given].num++;
        $('#'+given+'Count').html(army[given].num);
    }
    
    $('#armyStrength').html(calcStrength());
}

function calcStrength() {
    var totalStrength = 0;
    for (var i in army)
        totalStrength += army[i].strength * army[i].num;
    return totalStrength;
}

function takeCost(given,list) {
    var curr = list[given].cost;
    for (var i in curr)
        resources[i] -= curr[i];
}

function canAfford(given,list) {
    var curr = list[given].cost;
    var result = true;
    for (var i in curr)
        if (resources[i] < curr[i])
            result = false;
    return result;
}

function attack(given) {
    if (calcStrength() >= target[given].strength) {
        if (resources['corpses'] == 0 && target[given].loot['corpses'])
            addCorpses();
        for (var i in target[given].loot)
            resources[i] += target[given].loot[i];
    }
}

function update() {
    $('#idleSkeletons').html(skeletons);
    for (var i in workers)
        if (frames % 10 == 0)
            resources[i] += workers[i]/50;
    for (var i in resources)
        $('#' + i + 'Count').html(round(resources[i]));
    if (!butcherProgressInterval && resources.corpses && buildings.butcher.count)
        makeProgress('butcher');
    frames++;
}

var mainLoop = setInterval(function() {
    update();
}, 20);

buildWorkersTable();
buildArmyTable();
buildBuildingsTable();
buildTargetTable();

function makeProgress(given) {
    var x = 0;
    butcherProgressInterval = setInterval(function(){
        x += 2;
        if ($('#' + given + 'Progress').is(':visible'))
            $('#' + given + 'Progress').width(x+'%');
        if (x > 100) {
            if ($('#' + given + 'Progress').is(':visible'))
                $('#' + given + 'Progress').width('0%');
            resources.corpses--;
            resources.bones += 10;
            clearInterval(butcherProgressInterval);
            butcherProgressInterval = undefined;    
        }
    },40);
}

function addCorpses() {
    $('#resourceDiv').html($("#resourceDiv").html() + '<p>Corpses: <span id="corpsesCount">0</span></p>');
}

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

function buildTargetTable() {
    var result = '';
    result += '<tr><th>Target</th><th>Strength</th></tr>'
    for (var i in target) {
        result += '<tr>';
        result += '<td>' + target[i].name + '</td>';
        result += '<td>' + target[i].strength + '</td>';
        result += '<td><button onClick="attack(\''+i+'\')">Attack</button></td>';
        result += '</tr>';
    }
    $('#targetTable').html(result);
}

function buildBuildingsTable() {
    var result = '';
    for (var i in buildings) {
        result += '<tr>';
        result += '<td onClick="buildBuilding(\''+i+'\')"><div>' + buildings[i].name + ': <span id="' + i +'Count">' + buildings[i].count + '</span><div class="progressBar" id="butcherProgress"></div></div></td>';
        result += '</tr>';
    }
    $('#buildingsTable').html(result);
}

function buildBuilding(given) {
    if(canAfford(given,buildings)) {
        takeCost(given,buildings);
        buildings[given].count++;
        $('#'+given+'Count').html(buildings[given].count);
    }
}

function round(given) {
    var result = Math.floor(given * 100)/100;
    return result;
}