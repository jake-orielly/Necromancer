var skeletons = 0;
var resources = {bones:300,wood:100,stones:100,corpses:10,prisoners:0,souls:0};
var resourceMaxes = {bones:300,wood:100,stones:100,corpses:20,prisoners:10,souls:10};
var workers = {bones:0,wood:0,stones:0};
var army = {skeletalSpearmen:{num:0,name:'Skeletal Spearmen',strength:2,cost:{bones:10,wood:2,stone:1}},
zombieSpearmen:{num:0,name:'Zombie Spearmen',strength:3,cost:{corpses:1,wood:2,stone:1}}};
var target = {travelers:{name:'Ambush Travelers',strength:5,loot:{corpses:[2,3]}}};
var buildings = {butcher:{name:'Butcher',count:0,cost:{stones:25,wood:25},
                    action:{progress:0,cost:{corpses:1},result:{bones:10}}},
ritualPit:{name:'Executioner',count:0,cost:{wood:50,stones:30,corpses:10,bones:40},
                    action:{progress:0,cost:{prisoners:1},result:{souls:1}}}};
var necromancer = {name:'Necromancer',count:0,cost:{bones:25,souls:10},
                    action:{progress:0,cost:{bones:10,wood:2,stone:1},result:{skeletalSpearmen:1}}};
var frames = 0;
var dubiousMercyCost = {bones:25,corpses:5};
var advancedAnimationCost = {bones:100,corpses:12,souls:6};

function gatherBones() {
    if(notMax('bones'))
        resources.bones++;
}

function notMax(given,addon = 1) {
    return resources[given] + addon < resourceMaxes[given]
}

function animateSkeleton() {
    if (resources.bones >= 10) {
        resources.bones -= 10;
        skeletons++;
        if (!$('.workerAdd').is(":visible"))
            $('.workerAdd').show();
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

function give(given) {
    if (!$('#soulsCount').is(':visible') && given.souls)
            addResource('souls');
    takeCost(given,1);
}

function takeCost(given,add = -1) {
    for (var i in given) {
        if (resources[i])
            if (add < 1 || notMax(i,given[i]*add))
                resources[i] += given[i] * add;
            else
                resources[i] = resourceMaxes[i];
        else if (army[i]) {
            army[i].num += given[i] * add;
            $('#'+i+'Count').html(army[i].num);
            $('#armyStrength').html(calcStrength());
        }
    }
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
            if (notMax(i,temp))
                resources[i] += temp;
            else   
                resources[i] = resourceMaxes[i];
        }
    }
}

function update() {
    $('#idleSkeletons').html(skeletons);
    for (var i in workers)
        if (frames % 10 == 0)
            if (notMax(i,workers[i]/50))
                resources[i] += workers[i]/50;
            else
                resources[i] = resourceMaxes[i];
    for (var i in resources)
        $('#' + i + 'Count').html(round(resources[i]));
    for (var i in buildings) {
        var curr = buildings[i];
        
        if ((!curr.action.progress && canAfford(curr.action.cost) && curr.count) ||
            (curr.action.progress)) {
            curr.action.progress ++;
            if ($('#' + i + 'Progress').is(':visible'))
                $('#' + i + 'Progress').width(curr.action.progress+'%');
            if (curr.action.progress > 100) {
                if ($('#' + i + 'Progress').is(':visible'))
                    $('#' + i + 'Progress').width('0%');
                takeCost(curr.action.cost);
                give(curr.action.result);
                curr.action.progress = 0;    
            }
        }
    }
    frames++;
}

var mainLoop = setInterval(function() {
    update();
}, 20);

buildWorkersTable();
buildArmyTable();
buildBuildingsTable();
buildTargetTable();

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

function advancedAnimation() {
    if (canAfford(advancedAnimationCost)) {
        takeCost(advancedAnimationCost);
        $('#advancedAnimation').addClass('bought');
        buildings.necromancer = necromancer;
        buildBuildingsTable();
    }
}