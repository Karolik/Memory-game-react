import React, {Component} from 'react';
import shuffle from 'shuffle-array';
import Navbar from './Navbar';
import Card from './Card';

const CardState = {
  HIDING: 0,
  SHOWING: 1,
  MATCHING: 2
};

class MemoryGame extends Component {
  
  constructor(props) {
    super(props);
    let cards = [
      {id: 0, cardState: CardState.HIDING, backgroundColor: 'red' },
      {id: 1, cardState: CardState.HIDING, backgroundColor: 'red' },
      {id: 2, cardState: CardState.HIDING, backgroundColor: 'navy' },
      {id: 3, cardState: CardState.HIDING, backgroundColor: 'navy' },
      {id: 4, cardState: CardState.HIDING, backgroundColor: 'green' },
      {id: 5, cardState: CardState.HIDING, backgroundColor: 'green' },
      {id: 6, cardState: CardState.HIDING, backgroundColor: 'yellow' },
      {id: 7, cardState: CardState.HIDING, backgroundColor: 'yellow' },
      {id: 8, cardState: CardState.HIDING, backgroundColor: 'black' },
      {id: 9, cardState: CardState.HIDING, backgroundColor: 'black' },
      {id: 10, cardState: CardState.HIDING, backgroundColor: 'pink' },
      {id: 11, cardState: CardState.HIDING, backgroundColor: 'pink' },
      {id: 12, cardState: CardState.HIDING, backgroundColor: 'blue' },
      {id: 13, cardState: CardState.HIDING, backgroundColor: 'blue' },
      {id: 14, cardState: CardState.HIDING, backgroundColor: 'orange' },
      {id: 15, cardState: CardState.HIDING, backgroundColor: 'orange' }
    ];
    cards = shuffle(cards);
    //this.state = {cards: shuffle(cards)};
    this.state = {cards, noClick: false};
    this.handleClick = this.handleClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    console.log(this.state.cards);
  }

  handleNewGame() {
    let cards = this.state.cards.map(c => ({
      ...c, cardState: CardState.HIDING
    }));
    cards = shuffle(cards);
    this.setState({cards});
  }
  
  handleClick(id) {
    const mapCardState = (cards, idsToChange, newCardState) => {
      return cards.map(c => {
        //If the id that we are on matches any of the ids to change:
        if (idsToChange.includes(c.id)) {
          return {
            ...c,
            cardState: newCardState
          };
        }
        return c;
      });
    }
    //Next we take the card we want out of the array:(it's the card that was just clicked on)
    const foundCard = this.state.cards.find(c => c.id === id);
    //If the card we clicked is already showing or noClick is true, don't do anything(don't change back the card to hiding)
    if (this.state.noClick || foundCard.cardState !== CardState.HIDING) {
      return;
    }
    //Set a variable noClick, set it to false:(use it later to decide if the user can click again or not)
    let noClick = false;
    //When we click a card, the cardState will be SHOWING:
    let cards = mapCardState(this.state.cards, [id], CardState.SHOWING);
    //Get the showing cards:
    const showingCards =  cards.filter((c) => c.cardState === CardState.SHOWING);
    //Get the id of these showingCards:
    const ids = showingCards.map(c => c.id);
    //If there are 2 cards showing and their background is matching, we change the state of these cards to matching:
    if (showingCards.length === 2 &&
        showingCards[0].backgroundColor === showingCards[1].backgroundColor) {
      cards = mapCardState(cards, ids, CardState.MATCHING);
    } else if (showingCards.length === 2) {
      //If not matching, change the state of the showing cards to hiding:
      let hidingCards = mapCardState(cards, ids, CardState.HIDING);
      //You cannot click anywhere else:
      noClick = true;
      
      this.setState({cards, noClick}, () => {
        setTimeout(() => {
          // set the state of the cards to HIDING after 1.3 seconds
          this.setState({cards: hidingCards, noClick: false});
        }, 1300);
      });
      return;
    }
    
    this.setState({cards, noClick});
  }
  
  render() {
    const cards = this.state.cards.map((card) => (
      <Card
        key={card.id}
        showing={card.cardState !== CardState.HIDING}
        backgroundColor={card.backgroundColor}
        onClick={() => this.handleClick(card.id)}
      />
    ));
    return (
      <div className="App">
        <Navbar onNewGame={this.handleNewGame}/>
        {cards}
      </div>
    );
  }
}

export default MemoryGame;
