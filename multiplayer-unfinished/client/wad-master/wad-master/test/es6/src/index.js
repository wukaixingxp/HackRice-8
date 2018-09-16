import Wad from '../../../build/wad.min.js';

var ignition = new Wad({source:'./ignition.mp3'})
document.getElementById('ignition').addEventListener('click', async function(){
    await ignition.play()
    await ignition.play()
})
document.getElementById('ignition-faster').addEventListener('click', async function(){
    await ignition.play({
        rate: 2.0,
    })
    await ignition.play({
        rate: 2.0,
    })
})
document.getElementById('ignition-slower').addEventListener('click', async function(){
    await ignition.play({
        rate: 0.5,
    })
    await ignition.play({
        rate: 0.5,
    })
})

var helloMan = new Wad({
    source: './hello-man.wav',
    sprite: {
        hello: [0, .4],
        man  : [.4,1]
    }
})
document.getElementById('sprite-a').addEventListener('click', async function(){
    await helloMan.hello.play({env:{release:.02}})
    await helloMan.hello.play({rate: 1.1, volume:1.2, env:{release:.02}})
})
document.getElementById('sprite-b').addEventListener('click', async function(){
    await helloMan.man.play({env:{attack: .1, release:.02}})
    await helloMan.man.play({env:{attack: .1, release:.02}})
})
document.getElementById('sprite-ab').addEventListener('click', async function(){
    await helloMan.play({env:{attack: .1, release:.02}})
    await helloMan.play({env:{attack: .1, release:.02}})
})

var sine = new Wad({source:'sine', env: {attack: .07, hold: 1.5, release: .3}})
document.getElementById('sine').addEventListener('click', async function(){
    await sine.play()
    await sine.play()
})
document.getElementById('detune').addEventListener('click', function(){
    sine.setDetune(100)
})
document.getElementById('pan').addEventListener('click', function(){
    sine.setPanning(1)
})
document.getElementById('set-pitch').addEventListener('click', function(){
    sine.setPitch('B3')
})

var sawtooth = new Wad({source:'sawtooth', env:{hold:1, release:.2}})
var triangle = new Wad({source:'triangle', env:{hold:1, release:.2}})
var polywad = new Wad.Poly()
polywad.add(sawtooth).add(triangle)

document.getElementById('polywad').addEventListener('click', function(){
    polywad.play()
})
document.getElementById('polywad-set-pitch').addEventListener('click', function(){
    polywad.setPitch('B3')
})

document.getElementById('stop').addEventListener('click', function(){
    sine.stop()
})
document.getElementById('polywad-stop').addEventListener('click', function(){
    polywad.stop()
})

var voice;
var tuner;
var rafId;
var logPitch = function(){
    console.log(tuner.pitch, tuner.noteName)
    rafId = requestAnimationFrame(logPitch)
};
document.getElementById('mic-consent').addEventListener('click', function(){
    voice = new Wad({
        source  : 'mic',
        // reverb  : {
        //     wet : .4
        // },
        // filter  : {
        //     type      : 'highpass',
        //     frequency : 700
        // },
        // panning : -.2
    })

    tuner = new Wad.Poly();
    // tuner.setVolume(0) // mute the tuner to avoid feedback
    tuner.add(voice);


})

document.getElementById('mic-play').addEventListener('click', function(){
    console.log("Play mic")
    voice.play()
})
document.getElementById('mic-stop').addEventListener('click', function(){
    console.log("Play mic")
    voice.stop()
})
document.getElementById('detect-pitch').addEventListener('click', function(){
    tuner.updatePitch()
    logPitch()
})
document.getElementById('stop-detect-pitch').addEventListener('click', function(){
    tuner.stopUpdatingPitch()
    cancelAnimationFrame(rafId)
})


var tunaConfig = {
    source: 'sawtooth',
    env: {
        attack: .1,
        hold: 2,
        release: .4
    },
    filter: {
        type: 'lowpass',
        frequency: 700
    }
}
var withoutTuna = new Wad(tunaConfig)

tunaConfig.tuna = {
    Chorus : {
        intensity: 0.3,  //0 to 1
        rate: 4,         //0.001 to 8
        stereoPhase: 0, //0 to 180
        bypass: 0
    }
} 

var withTuna = new Wad(tunaConfig)

document.getElementById('no-tuna').addEventListener('click', function(){
    withoutTuna.play()
})
document.getElementById('tuna-chorus').addEventListener('click', function(){
    withTuna.play()
})

