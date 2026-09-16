import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

import Die from "./components/Die";

export default function App() {
	function generateNewDice() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}

	function generateAllNewDice() {
		return Array.from({ length: 10 }, () => generateNewDice());
	}

	const [dice, setDice] = useState(generateAllNewDice);
	const rollDiceButton = useRef(null);

	const gameWon =
		dice.every(dieObj => dieObj.isHeld) &&
		dice.every(dieObj => dieObj.value === dice[0].value);

	function rollDice() {
		return gameWon
			? setDice(generateAllNewDice)
			: setDice(prevDice =>
					prevDice.map(dieObj =>
						dieObj.isHeld
							? dieObj
							: { ...dieObj, value: Math.ceil(Math.random() * 6) },
					),
				);
	}

	function hold(id) {
		setDice(prevDice =>
			prevDice.map(dieObj =>
				dieObj.id === id ? { ...dieObj, isHeld: !dieObj.isHeld } : dieObj,
			),
		);
	}

	const diceElements = dice.map(dieObj => (
		<Die
			key={dieObj.id}
			value={dieObj.value}
			isHeld={dieObj.isHeld}
			hold={() => hold(dieObj.id)}
		/>
	));

	useEffect(() => {
		if (gameWon) rollDiceButton.current.focus();
	}, [gameWon]);

	return (
		<main>
			{gameWon ? <Confetti /> : undefined}
			<div aria-live="polite" className="sr-only">
				{gameWon && (
					<p>Congratulations! You won! Press "New Game" to start again.</p>
				)}
			</div>
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className="dice-container">{diceElements}</div>
			<button
				ref={rollDiceButton}
				onClick={rollDice}
				className="roll-dice"
				type="button"
			>
				{gameWon ? "New Game" : "Roll"}
			</button>
		</main>
	);
}
