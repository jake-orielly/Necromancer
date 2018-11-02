function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = $('.tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    $('#' + tabName).show();
    evt.currentTarget.className += " active";
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
        result += '<td onClick="buildBuilding(\''+i+'\')"><div>' + buildings[i].name + ': <span id="' + i +'Count">' + buildings[i].count + 
        '</span><div class="progressBar" id="' + i + 'Progress"></div></div></td>';
        result += '</tr>';
    }
    $('#buildingsTable').html(result);
}

function buildBuilding(given) {
    if(canAfford(buildings[given].cost)) {
        takeCost(buildings[given].cost);
        buildings[given].count++;
        $('#'+given+'Count').html(buildings[given].count);
    }
}