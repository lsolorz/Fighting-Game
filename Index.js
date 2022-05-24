const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './IMG/background.png'
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 148
    },
    imageSrc: './IMG/shop.png',
    scale: 2.60,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x:200,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    imageSrc: './IMG/wind/Idle.png',
    framesMax: 8,
    scale: 2.9,
    offset:{
        x:400,
        y:218
    },
    sprites: {
        idle: {
            imageSrc: './IMG/wind/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './IMG/wind/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './IMG/wind/Jump.png',
            framesMax: 3
        },
        fall:{
            imageSrc: './IMG/wind/Fall.png',
            framesMax: 3
        }, 
        attack1:{
            imageSrc: './IMG/wind/Attack1.png',
            framesMax: 8
        }, 
        takeHit:{
            imageSrc: './IMG/wind/Hit.png',
            framesMax: 6
        },
        death:{
            imageSrc: './IMG/wind/Death.png',
            framesMax: 19
        }, 
    },
    attackBox:{
        offset:{
            x:20,
            y:50
        },
        width: 100,
        height: 50
    } 
})


const enemy = new Fighter({
    position: {
        x:700,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset:{
        x:-50,
        y:0
    },
    imageSrc: './IMG/Fire/Idle.png',
    framesMax: 8,
    scale: 3.2,
    offset:{
        x:440,
        y:240
    },
    sprites: {
        idle: {
            imageSrc: './IMG/Fire/Idle.png',
            framesMax: 6
        },
        run: {
            imageSrc: './IMG/Fire/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './IMG/Fire/Jump.png',
            framesMax: 3
        },
        fall:{
            imageSrc: './IMG/Fire/Fall.png',
            framesMax: 3
        }, 
        attack1:{
            imageSrc: './IMG/Fire/Attack1.png',
            framesMax: 6
        }, 
        takeHit:{
            imageSrc: './IMG/Fire/Hit.png',
            framesMax: 6
        }, 
        death:{
            imageSrc: './IMG/Fire/Death.png',
            framesMax: 18
        }, 
    },
    attackBox:{
        offset:{
            x:-90,
            y:50
        },
        width: 100,
        height: 50
    } 
})


console.log(player);

const keys = { 
    a: {
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}

decreaseTimer()


function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'green'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba( 225,225,225,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player Movement
    if(keys.a.pressed && player.lastKey === 'a' ){
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x= 5
        player.switchSprite('run')
    }else {
        player.switchSprite('idle')
    }
    
    //jumping
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //enemy Movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' ){
        enemy.velocity.x = -6
        enemy.switchSprite('run')
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x= 6
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }
    
    //enemy jump
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect for collision
    if(
        collision({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.frameCurrent === 1
    ){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth',{
            width: enemy.health + '%'
        })
    }

    //if player missses
    if( player.isAttacking && player.frameCurrent === 3){
        player.isAttacking = false
    }

    if(
        collision({
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isAttacking && enemy.frameCurrent === 3
    ){
        player.takeHit()
        enemy.isAttacking = false    
        gsap.to('#playerHealth',{
            width: player.health + '%'
        })
    }

    if( enemy.isAttacking && enemy.frameCurrent === 3){
        enemy.isAttacking = false
    }

    //end game based on health
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerId})
    }
}

animate()

window.addEventListener('keydown',(event) => {
    if(!player.dead){
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            
        break
        case 'a':
           keys.a.pressed = true
           player.lastKey = 'a'
        break
        case 'w':
           player.velocity.y = -20
        break
        case 's':
            player.attack()
        break
    }
}
if(!enemy.dead){
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
           keys.ArrowLeft.pressed = true
           enemy.lastKey = 'ArrowLeft'
        break
        case 'ArrowUp':
           enemy.velocity.y = -20
        break
        case 'ArrowDown':
            enemy.attack()
        break
    }
    }
})

window.addEventListener('keyup',(event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false 
        break
        case 'a':
            keys.a.pressed = false
        break
        case 'w':
           keys.w.pressed = false
           lastKey = 'w'
        break
        case 's':
            player.attack()
        break
    }

    // enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false 
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
        
    }
})