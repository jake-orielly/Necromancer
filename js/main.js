var skeletons = 0;
var resources = {bones:0,wood:0,stones:0,corpses:0};
var resources = {bones:100,wood:100,stones:100,corpses:0,prisoners:0,souls:0};
var workers = {bones:0,wood:0,stones:0};
var army = {skeletalSpearmen:{num:0,name:'Skeletal Spearmen',strength:2,cost:{bones:10,wood:2,stone:1}},
zombieSpearmen:{num:0,name:'Zombie Spearmen',strength:3,cost:{corpses:1,wood:2,stone:1}}};
var target = {travelers:{name:'Ambush Travelers',strength:5,loot:{corpses:[2,3]}}};
var buildings = {butcher:{name:'Butcher',count:0,cost:{stones:25,wood:25}},
ritualPit:{name:'Ritual Pit',count:0,cost:{wood:50,stones:30,corpses:10,bones:40}}};
var frames = 0;
var butcherProgressInterval;
var dubiousMercyCost = {bones:25,corpses:5};

function gatherBones() {
    resources.bones++;
}

function animateSkeleton() {
    if (resources.bones >= 10) {
        resources.bones -= 10;
        skeletons++;
        if (!$('.workerAdd').is(":visible"))
            $('.workerAdd').show();
    }
}

function sacrificePrisoner() {
    if (resources.prisoners >= 1) {
        if (resources.souls == 0)
            addResource('souls');
        resources.prisoners--;
        resources.souls++;
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
    if (canAfford(army[given].cost)) {
        takeCost(army[given].cost);
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

function takeCost(given) {
    for (var i in given)
        resources[i] -= given[i];
}

function canAfford(given) {
    var curr = given;
    var result = true;
    for (var i in curr)
        if (resources[i] < curr[i])
            result = false;
    return result;
}

function attack(given) {
    var temp;
    if (calcStrength() >= target[given].strength) {
        for (var i in target[given].loot) {
            temp = getVal(target[given].loot[i]);
            if (!$('#' + i + 'Count').is(':visible') && temp)
                addResource(i);
            resources[i] += temp;
        }
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

function addResource(given) {
    $('#resourceDiv').html($("#resourceDiv").html() + '<p>' + given.substring(0,1).toUpperCase() 
    + given.substring(1) + ': <span id="' + given + 'Count">' + resources[given] + '</span></p>');
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
    if(canAfford(buildings[given].cost)) {
        if(given == 'ritualPit')
            $('#sacrificePrisoner').show()
        takeCost(buildings[given].cost);
        buildings[given].count++;
        $('#'+given+'Count').html(buildings[given].count);
    }
}

function dubiousMercy() {
    if (canAfford(dubiousMercyCost) && !$('#dubiousMercy').hasClass('bought')) {
        takeCost(dubiousMercyCost);
        $('#dubiousMercy').addClass('bought');
        for (var i in target) {
            curr = target[i].loot;
            if (curr.corpses) {
                curr.corpses[0] -= 1;
                curr.corpses[1] -= 1;
            }
            curr.prisoners = [0,1];
        }
    }
}

function round(given) {
    var result = Math.floor(given * 100)/100;
    return result;
}

function getVal(arr) {
    if (Number.isInteger(arr))
        return arr;
    return parseInt(Math.random()*(arr[1]-(arr[0]-1))+arr[0]);
}