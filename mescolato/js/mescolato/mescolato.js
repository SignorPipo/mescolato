WL.registerComponent('mescolato', {
    _myDomeSphereMesh: { type: WL.Type.Mesh },
    _mySnakeSphereMesh: { type: WL.Type.Mesh },
    _myDomeSphereMaterial: { type: WL.Type.Material },
    _mySnakeSphereMaterial_1: { type: WL.Type.Material },
    _mySnakeSphereMaterial_2: { type: WL.Type.Material },
    _mySnakeSphereMaterial_3: { type: WL.Type.Material },
    _mySnakeSphereMaterial_4: { type: WL.Type.Material },
}, {
    init: function () {
        GlobalData.myRootObject = WL.scene.addObject(this.object);
        GlobalData.myDomeSphereMesh = this._myDomeSphereMesh;
        GlobalData.mySnakeSphereMesh = this._mySnakeSphereMesh;
        GlobalData.myDomeSphereMaterial = this._myDomeSphereMaterial;
        GlobalData.mySnakeSphereMaterialList = [];
        GlobalData.mySnakeSphereMaterialList.push(this._mySnakeSphereMaterial_1);
        GlobalData.mySnakeSphereMaterialList.push(this._mySnakeSphereMaterial_2);
        GlobalData.mySnakeSphereMaterialList.push(this._mySnakeSphereMaterial_3);
        GlobalData.mySnakeSphereMaterialList.push(this._mySnakeSphereMaterial_4);
    },
    start: function () {
        this._myWait1Timer = 5;
        this._myWait2Timer = 6.5;

        this._mySphereDome = new SpheresDome();
        this._mySphereDome.start();

        this._mySnake = new Snake();

        this._myPhase = MescolatoPhase.WAIT_SESSION;
    },
    update: function (dt) {
        switch (this._myPhase) {
            case MescolatoPhase.WAIT_SESSION:
                this._wait_session(dt);
                break;
            case MescolatoPhase.WAIT_BEFORE_SPHERE:
                this._wait_before_sphere(dt);
                break;
            case MescolatoPhase.SPHERE:
                this._sphere(dt);
                break;
            case MescolatoPhase.WAIT_BEFORE_SNAKE:
                this._wait_before_snake(dt);
                break;
            case MescolatoPhase.SNAKE:
                this._snake(dt);
                break;
            case MescolatoPhase.DONE:
                this._done(dt);
                break;
        }
    },
    _wait_session: function (dt) {
        if (WL.xrSession) {
            this._myPhase = MescolatoPhase.WAIT_BEFORE_SPHERE;
        }
    },
    _wait_before_sphere: function (dt) {
        this._myWait1Timer -= dt;
        if (this._myWait1Timer <= 0) {
            console.log("wait 1 ended");
            this._myPhase = MescolatoPhase.SPHERE;
        }
    },
    _sphere: function (dt) {
        this._mySphereDome.update(dt);
        if (this._mySphereDome.isDone()) {
            console.log("sphere ended");
            this._myPhase = MescolatoPhase.WAIT_BEFORE_SNAKE;
        }
    },
    _wait_before_snake: function (dt) {
        this._mySphereDome.update(dt);
        this._myWait2Timer -= dt;
        if (this._myWait2Timer <= 0) {
            this._myPhase = MescolatoPhase.SNAKE;
            this._mySnake.start();
        }
    },
    _snake: function (dt) {
        this._mySphereDome.update(dt);
        this._mySnake.update(dt);
        if (this._mySnake.isDone()) {
            this._myPhase = MescolatoPhase.DONE;
        }
    },
    _done: function (dt) {
        this._mySphereDome.update(dt);
        this._mySnake.update(dt);
    }
});

var MescolatoPhase = {
    WAIT_SESSION: 0,
    WAIT_BEFORE_SPHERE: 1,
    SPHERE: 2,
    WAIT_BEFORE_SNAKE: 3,
    SNAKE: 4,
    DONE: 5
};

var GlobalData = {
    myRootObject: null,
    mySphereMesh: null,
    myDomeSphereMaterial: null,
    mySnakeSphereMaterialList: null,
};