var bones = 0;
var skeletons = 0;
var frames = 0;

function gatherBones() {
    bones++;
    update();
}

function animateSkeleton() {
    if (bones >= 10) {
        bones -= 10;
        skeletons++;
        update();
    }
}

function update() {
    if (frames % 10 == 0)
        bones += skeletons/50;
    $('#bonesCount').html(round(bones));
    $('#skeletonsCount').html(skeletons);
    frames++;
}

var mainLoop = setInterval(function() {
    update();
}, 20);

function round(given) {
    var result = Math.floor(given * 100)/100;
    return result;
}