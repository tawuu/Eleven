const EventEmitter = require("events");

class Fight extends EventEmitter  {
    constructor(_fighterOne, _fighterTwo) {
        
        super();

        this.Attacks = [
            { name: "morre filho da puta", damages: [1000000], chance: 1 },
            { name: "punch", damages: [6, 7, 8, 9, 10, 2], chance: 30 },
            { name: "kick", damages: [11, 12, 13, 14, 15], chance: 45 },
            { name: "push", damages: [16, 17, 18, 19, 20], chance: 65 },
            { name: "giveup" }
        ]

        this.fighterOne = {
            id: _fighterOne.id,
            name: _fighterOne.name,
            hp: 100
        };

        this.fighterTwo = {
            id: _fighterTwo.id,
            name: _fighterTwo.name,
            hp: 100
        }

        this.turn = this.fighterOne;
        this.nextTurn = this.fighterTwo;

        this.moves = [];

        this.Attacks.forEach(attack => {
            this.moves.push(attack.name)
        });

    }


    getAttack(attackName) {
        return this.Attacks.find(attack => attack.name === attackName);
    }

    hit(attackName) {

        let _chance = Math.floor(Math.random() * 100);
        let _attack = this.getAttack(attackName);

        if (_attack.name === "giveup") return this.emit("winner", this.nextTurn);


        let _damage = _attack.damages[Math.floor(Math.random() * _attack.damages.length)];
        if (_chance >= _attack.chance) {
            let _died = this.reduceHP(_damage);
            if (_died) return;
            this.emit("attack", this.turn, _attack.name, _damage, this.nextTurn);
            this.changeTurn();
        } else {
            this.emit("attack", this.turn, _attack.name, false, this.nextTurn);
            this.changeTurn();
        }


    }

    reduceHP(damage) {
        this.nextTurn.hp = this.nextTurn.hp - damage;
        if (this.nextTurn.hp <= 0) {
            this.emit("winner", this.turn);
            return true;
        }
    }

    changeTurn() {
        let _a = this.turn;
        let _b = this.nextTurn;

        this.turn = _b;
        this.nextTurn = _a;
    }

}


module.exports = Fight;
