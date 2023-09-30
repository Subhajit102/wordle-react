import { useEffect, useState } from 'react'
import './App.css';
import { WORDS } from './words';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


function App() {

  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [wordleWrd, setWordleWrd] = useState('');
  const [word, setWord] = useState('');
  const [win, setWin] = useState('');
  const [info, setInfo] = useState(false);

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
  }

  function closeModal() {
    setIsOpen(false);
    setInfo(false);
    setWin('');
  }
  function openInfo() {
    setInfo(true);
    openModal();
  }
  useEffect(() => {
    wordleWord();
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', keyboardKeyPressed, true);
  }, [])

  function wordleWord() {
    let len = WORDS.length;
    let randomIndex = Math.floor(Math.random() * len);
    setWordleWrd(WORDS[randomIndex]);
  }

  function generateGrid() {
    let grid = [];
    for (let i = 0; i < 6; i++) {
      let row = [];
      for (let j = 0; j < 5; j++) {
        row.push(<div className="wordle-grid-default" id={'i' + i + 'j' + j} key={j}></div>);
      }
      grid.push(<div className='flex justify-center mb-1' key={i}>
        <div className='grid grid-cols-5 gap-1'>
          {row}
        </div>
      </div>)
    }
    return grid;
  }
  const keyRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const keyRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const keyRow3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  function generateKeyboard() {
    let grid = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      if (i == 0) {
        for (let j = 0; j < keyRow1.length; j++) {
          let k = keyRow1[j];
          row.push(<div className="keyboard-default" id={k} onClick={() => keyPressed(k)} key={j}>{k}</div>);
        }
        grid.push(<div className='flex justify-center mb-2' key={i}>
          <div className='grid grid-cols-10 gap-1'>
            {row}
          </div>
        </div>)
      }
      else if (i == 1) {
        for (let j = 0; j < keyRow2.length; j++) {
          let k = keyRow2[j];
          row.push(<div className="keyboard-default" id={k} onClick={() => keyPressed(k)} key={j}>{k}</div>);
        }
        grid.push(<div className='flex justify-center mb-2' key={i}>
          <div className='grid grid-cols-9 gap-1'>
            {row}
          </div>
        </div>)
      }
      else {
        for (let j = 0; j < keyRow3.length; j++) {
          let k = keyRow3[j];
          row.push(<div className="keyboard-default" id={k} onClick={() => keyPressed(k)} key={j}>{k}</div>);
        }
        grid.push(<div className='flex justify-center mb-2' key={i}>
          <div className='flex gap-1'>
            <div className="keyboard-enter-del" onClick={() => keyPressed('ENTER')}>ENT</div>
            <div className='grid grid-cols-7 gap-1'>
              {row}
            </div>
            <div className="keyboard-enter-del" onClick={() => keyPressed('DEL')}>DEL</div>
          </div>
        </div>)
      }
    }
    return grid;
  }

  // document.addEventListener('keyup', keyboardKeyPressed);


  function keyboardKeyPressed(e) {
    alert('Please use onscreen keyboard to play!');
    // if (e.which === 13) keyPressed('ENTER');
    // if (e.which === 8) keyPressed('DEL');
    // if ((e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122)) keyPressed(String.fromCharCode(e.which).toUpperCase());
  }

  function keyPressed(key) {
    let id = 'i' + row + 'j' + col;
    if (key === 'DEL') {
      if (word.length >= 0 && col > 0) {
        id = 'i' + row + 'j' + (col - 1);
        document.getElementById(id).innerText = '';
        setWord(curr => {
          return curr.slice(0, -1);
        })
        if (col > 0) setCol(col - 1);
      }
    }
    else if (key === 'ENTER') {
      if (word.length == 5 && checkValid(word)) {
        if (word === wordleWrd.toUpperCase()) {
          setWin('CONGRATS!');
          openModal();
          setCol(0);
        }
        else if (row <= 5 && word.length == 5) {
          if (row === 5 && word !== wordleWrd.toUpperCase()) {
            setWin(wordleWrd.toUpperCase());
            openModal();
          }
          setWord('');
          setRow(row + 1);
          setCol(0);
        }
      }

    }
    else {
      if (word.length < 5) {
        document.getElementById(id).innerText = key;
        setWord(curr => {
          return curr + key;
        })
        setCol(col + 1);
      }
    }
  }

  function checkValid(w) {
    if (WORDS.indexOf(w.toLowerCase()) !== -1) {
      for (let index = 0; index < 5; index++) {
        let id = 'i' + row + 'j' + index;
        if (wordleWrd[index] === word[index].toLowerCase()) {
          document.getElementById(id).classList.add('bg-green-400');
          document.getElementById(id).classList.add('border-green-400');
          if (document.getElementById(word[index]).classList.contains('bg-yellow-400')) {
            document.getElementById(word[index]).classList.remove('bg-yellow-400');
          }
          document.getElementById(word[index]).classList.add('bg-green-400');
        }
        else {
          if (wordleWrd.indexOf(word[index].toLowerCase()) !== -1) {
            document.getElementById(id).classList.add('bg-yellow-400');
            document.getElementById(id).classList.add('border-yellow-400');
            if (!document.getElementById(word[index]).classList.contains('bg-green-400'))
              document.getElementById(word[index]).classList.add('bg-yellow-400');
          }
          else {
            document.getElementById(id).classList.add('bg-slate-400');
            document.getElementById(id).classList.add('border-slate-400');
            document.getElementById(word[index]).classList.add('bg-slate-400');
          }
        }
      }
      return true;
    }
    return false;
  }
  return (
    <>

      <h1 className="flex justify-center text-5xl font-bold underline mb-5">
        WORDLE

        <button className='absolute ml-72 mt-3' onClick={openInfo}>
          <svg xmlns="http://www.w3.org/2000/svg" height="0.4em" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </button>
      </h1>
      {generateGrid()}
      <div className='mt-10'>
        {generateKeyboard()}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        {win.length > 0 && <h1 className='flex justify-center text-5xl font-bold'>{win}</h1>}
        {info && <div>
          <h1 className='text-2xl font-bold'>How to Play</h1>
          <ul className='list-disc p-4'>
            <li>
              Guess the Wordle in 6 tries.
            </li>
            <li>
              Each guess must be a valid 5-letter word.
            </li>
            <li className='mb-1'>
              The color of the tiles will change to show how close your guess was to the word.
            </li>
            <li className='flex mb-1'>
              <div className='w-6 h-6 bg-green-400 mr-1 flex place-content-center'>W</div><div> Suggests 'W' is in the word and in the correct spot.</div>
            </li>
            <li className='flex mb-1'>
              <div className='w-6 h-6 bg-yellow-400 mr-1 flex place-content-center'>I</div><div> Suggests 'I' is in the word but in the wrong spot.</div>
            </li>
            <li className='flex mb-1'>
              <div className='w-6 h-6 bg-slate-400 mr-1 flex place-content-center'>U</div><div> Suggests 'U' is not in the word in any spot.</div>
            </li>
            <li>
              Use On screen keyboard to Play.
            </li>
          </ul>
        </div>
        }
      </Modal>
    </>

  )
}

export default App
