import React, { useState, useEffect } from 'react';
import { TriviaComponentProps } from '../symbols';
import { answerQuestion } from '../../shared/trivias.service';
import { Button } from '@material-ui/core';
import useInterval from '@use-it/interval';
import './index.scss';
import Nav from '../../nav';
import QuestionResult from '../QuestionResult';
import Error from '../../shared/error';

const SECOND = 1000;

const Answer = ({
  possibleAnswer,
  selectOption,
  answered,
  selected,
}: {
  possibleAnswer: string;
  answered: boolean;
  selected: boolean;
  selectOption: () => void;
}) => {
  const variant = answered && !selected ? 'outlined' : 'contained';
  const noSelectedClassName = answered && !selected ? 'no-selected' : '';

  return (
    <Button
      variant={variant}
      className={`option ${noSelectedClassName}`}
      disabled={answered}
      onClick={selectOption}
    >
      {possibleAnswer}
    </Button>
  );
};

const InProgress = (props: TriviaComponentProps) => {
  const { trivia, triviaId, user } = props;
  const currentQuestion = trivia.questions[trivia.currentQuestionIndex];

  const [answered, setAnswered] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(trivia.timePerQuestion);
  const [completed, setCompleted] = useState(false);
  const [answerError, setAnswerError] = useState<Error>(null);

  useInterval(() => {
    setTime(time + 1);
  }, 1);

  useInterval(() => {
    setTimer(timer - SECOND);
  }, SECOND);

  useEffect(() => {
    if (timer === 0) {
      setCompleted(true);
    }
  }, [timer]);

  useEffect(() => {
    setCompleted(false);
    setTime(0);
    setTimer(trivia.timePerQuestion);
    setAnswered(null);
  }, [trivia.currentQuestionIndex, trivia.timePerQuestion]);

  const selectOption = async (index: number) => {
    setAnswered(index);
    try {
      await answerQuestion(
        triviaId,
        trivia.currentQuestionIndex,
        user,
        index,
        time,
        trivia.participants[user.uid].answers
      );
    } catch (error) {
      setAnswerError(error);
      setAnswered(null);
    }
  };

  const timerInSeconds = timer / SECOND;
  // const timePercentage = Math.floor((timer / trivia.timePerQuestion) * 100);

  if (!completed) {
    return (
      <Nav>
        <main className="question">
          <section className="header">
            <h1 className="title">{currentQuestion.question}</h1>
            <span className="time">{timerInSeconds}</span>
          </section>
          <Error error={answerError} />
          <div className="options">
            {currentQuestion.possibleAnswers.map((possibleAnswer, index) => (
              <Answer
                key={index}
                possibleAnswer={possibleAnswer}
                answered={answered !== null}
                selected={answered === index}
                selectOption={() => selectOption(index)}
              />
            ))}
          </div>
        </main>
      </Nav>
    );
  } else {
    return <QuestionResult {...props} />;
  }
};

export default InProgress;