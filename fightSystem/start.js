class Fight {
    constructor(fighterOne, fighterTwo) {

        this.fighterOne = fighterOne;
        this.fighterTwo = fighterTwo;

        this.nowMoviment = this.fighterOne;
        this.nextMoviment = this.fighterTwo;

        this.fighters = [this.fighterOne, this.fighterTwo];
    }

    async move(moviment) {
        const chance = Math.floor(Math.random() * 2);
        if (chance === 1) {
            // successfully moviment!
            
            switch (moviment) {
                case "punch": this.punch(this.nowMoviment);
                    break;
            
            }

            await this.changeMoviment();            
            return true;

        } else {

            await this.changeMoviment();
            return false;

        }
    }

   async changeMoviment() {
        let now = this.nowMoviment;
        let next = this.nextMoviment;
        
        this.nowMoviment = next;
        this.nextMoviment = now;

    }

    punch(fighter) {
    }

    whoMoves() { return this.nowMoviment };

}

module.exports = Fight;